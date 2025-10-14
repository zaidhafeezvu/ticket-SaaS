import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { generateQRCodeImage } from "@/lib/qrcode";

// Rate limiter for QR code requests
const qrCodeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 requests per minute
});

// GET QR code for a purchase
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Apply rate limiting
  const rateLimitResponse = await qrCodeLimiter(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const { id } = await params;

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

    // Get purchase with ticket details
    const purchase = await prisma.purchase.findUnique({
      where: { id },
      include: {
        ticket: {
          include: {
            seller: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: "Purchase not found" },
        { status: 404 }
      );
    }

    // Verify user is the buyer or seller
    if (purchase.buyerId !== session.user.id && purchase.ticket.sellerId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized - You can only access your own purchase QR codes" },
        { status: 403 }
      );
    }

    if (!purchase.qrCode) {
      return NextResponse.json(
        { error: "QR code not generated for this purchase" },
        { status: 404 }
      );
    }

    // Generate QR code image
    const qrCodeImage = await generateQRCodeImage(purchase.qrCode);

    return NextResponse.json({
      qrCode: purchase.qrCode,
      qrCodeImage,
      qrCodeScanned: purchase.qrCodeScanned,
      qrCodeScannedAt: purchase.qrCodeScannedAt,
      purchase: {
        id: purchase.id,
        quantity: purchase.quantity,
        totalPrice: purchase.totalPrice,
        status: purchase.status,
        createdAt: purchase.createdAt,
      },
      ticket: {
        id: purchase.ticket.id,
        title: purchase.ticket.title,
        eventDate: purchase.ticket.eventDate,
        location: purchase.ticket.location,
        category: purchase.ticket.category,
      },
    });
  } catch (error) {
    console.error("Error fetching QR code:", error);
    return NextResponse.json(
      { error: "Failed to fetch QR code" },
      { status: 500 }
    );
  }
}
