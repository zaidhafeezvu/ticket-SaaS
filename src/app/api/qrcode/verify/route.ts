import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { verifyQRCodeFormat } from "@/lib/qrcode";

// Rate limiter for QR code verification
const verifyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 20, // 20 verifications per minute
});

// POST verify a QR code for entry
export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await verifyLimiter(request);
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

    const body = await request.json();
    const { qrCode, markAsScanned } = body;

    if (!qrCode) {
      return NextResponse.json(
        { error: "QR code is required" },
        { status: 400 }
      );
    }

    // Verify QR code format
    const formatCheck = verifyQRCodeFormat(qrCode);
    if (!formatCheck.valid) {
      return NextResponse.json(
        { error: "Invalid QR code format" },
        { status: 400 }
      );
    }

    // Find purchase by QR code
    const purchase = await prisma.purchase.findUnique({
      where: { qrCode },
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
        { error: "QR code not found" },
        { status: 404 }
      );
    }

    // Check if the user is the seller (only sellers can verify tickets for their events)
    if (purchase.ticket.sellerId !== session.user.id) {
      // Allow buyers to view their own tickets without marking as scanned
      if (purchase.buyerId === session.user.id && !markAsScanned) {
        return NextResponse.json({
          valid: true,
          scanned: purchase.qrCodeScanned,
          scannedAt: purchase.qrCodeScannedAt,
          purchase: {
            id: purchase.id,
            quantity: purchase.quantity,
            status: purchase.status,
          },
          ticket: {
            title: purchase.ticket.title,
            eventDate: purchase.ticket.eventDate,
            location: purchase.ticket.location,
          },
          buyer: purchase.buyer,
          message: "This is your ticket. Only the event organizer can mark it as scanned.",
        });
      }

      return NextResponse.json(
        { error: "Unauthorized - Only the event organizer can verify tickets for entry" },
        { status: 403 }
      );
    }

    // Check if already scanned (if markAsScanned is true)
    if (markAsScanned && purchase.qrCodeScanned) {
      return NextResponse.json({
        valid: false,
        alreadyScanned: true,
        scannedAt: purchase.qrCodeScannedAt,
        message: "This ticket has already been used for entry",
        purchase: {
          id: purchase.id,
          quantity: purchase.quantity,
        },
        ticket: {
          title: purchase.ticket.title,
          eventDate: purchase.ticket.eventDate,
        },
        buyer: purchase.buyer,
      });
    }

    // Mark as scanned if requested
    let updatedPurchase = purchase;
    if (markAsScanned && !purchase.qrCodeScanned) {
      updatedPurchase = await prisma.purchase.update({
        where: { id: purchase.id },
        data: {
          qrCodeScanned: true,
          qrCodeScannedAt: new Date(),
        },
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
    }

    return NextResponse.json({
      valid: true,
      scanned: updatedPurchase.qrCodeScanned,
      scannedAt: updatedPurchase.qrCodeScannedAt,
      purchase: {
        id: updatedPurchase.id,
        quantity: updatedPurchase.quantity,
        totalPrice: updatedPurchase.totalPrice,
        status: updatedPurchase.status,
        createdAt: updatedPurchase.createdAt,
      },
      ticket: {
        id: updatedPurchase.ticket.id,
        title: updatedPurchase.ticket.title,
        eventDate: updatedPurchase.ticket.eventDate,
        location: updatedPurchase.ticket.location,
        category: updatedPurchase.ticket.category,
      },
      buyer: updatedPurchase.buyer,
      message: markAsScanned && updatedPurchase.qrCodeScanned ? "Ticket successfully verified for entry" : "Ticket is valid",
    });
  } catch (error) {
    console.error("Error verifying QR code:", error);
    return NextResponse.json(
      { error: "Failed to verify QR code" },
      { status: 500 }
    );
  }
}
