import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { generateQRCodeData } from "@/lib/qrcode";
import { sendPurchaseConfirmationEmail, sendSaleNotificationEmail } from "@/lib/email";

// Rate limiters
const createPurchaseLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5, // 5 purchases per minute (stricter to prevent abuse)
});

const getPurchasesLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 requests per minute
});

// POST create a purchase
export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await createPurchaseLimiter(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check email verification
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { emailVerified: true },
    });

    if (!user?.emailVerified) {
      return NextResponse.json(
        { error: "Email verification required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { ticketId, quantity } = body;

    // Validate input
    if (!ticketId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    // Get ticket
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    if (ticket.available < quantity) {
      return NextResponse.json(
        { error: "Not enough tickets available" },
        { status: 400 }
      );
    }

    // Create purchase and update ticket availability in a transaction
    const purchase = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Update ticket availability
      await tx.ticket.update({
        where: { id: ticketId },
        data: {
          available: {
            decrement: quantity,
          },
        },
      });

      // Create purchase record first to get the ID
      const newPurchase = await tx.purchase.create({
        data: {
          ticketId,
          buyerId: session.user.id,
          quantity,
          totalPrice: ticket.price * quantity,
          status: "completed",
        },
      });

      // Generate QR code with purchase ID
      const qrCodeData = generateQRCodeData(newPurchase.id, ticketId, session.user.id);

      // Update purchase with QR code
      return tx.purchase.update({
        where: { id: newPurchase.id },
        data: {
          qrCode: qrCodeData,
        },
        include: {
          ticket: {
            include: {
              seller: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
          buyer: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });
    });

    // Send email notifications asynchronously (don't await to avoid blocking the response)
    // Send purchase confirmation to buyer
    sendPurchaseConfirmationEmail(
      purchase.buyer.email,
      purchase.buyer.name || "Buyer",
      purchase.ticket.title,
      purchase.quantity,
      purchase.totalPrice,
      purchase.ticket.eventDate,
      purchase.ticket.location
    ).catch(error => {
      console.error("Failed to send purchase confirmation email:", error);
    });

    // Send sale notification to seller
    sendSaleNotificationEmail(
      purchase.ticket.seller.email,
      purchase.ticket.seller.name || "Seller",
      purchase.ticket.title,
      purchase.quantity,
      purchase.totalPrice,
      purchase.buyer.name || "Buyer"
    ).catch(error => {
      console.error("Failed to send sale notification email:", error);
    });

    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    console.error("Error creating purchase:", error);
    return NextResponse.json(
      { error: "Failed to create purchase" },
      { status: 500 }
    );
  }
}

// GET all purchases
export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await getPurchasesLimiter(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const purchases = await prisma.purchase.findMany({
      include: {
        ticket: true,
        buyer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(purchases);
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchases" },
      { status: 500 }
    );
  }
}
