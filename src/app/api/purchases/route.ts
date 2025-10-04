import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// POST create a purchase
export async function POST(request: NextRequest) {
  try {
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

    // For demo purposes, use the first user or create one
    let user = await prisma.user.findFirst();
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "buyer@ticketsaas.com",
          name: "Buyer User",
          password: "hashed_password_placeholder",
        },
      });
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

      // Create purchase record
      return tx.purchase.create({
        data: {
          ticketId,
          buyerId: user.id,
          quantity,
          totalPrice: ticket.price * quantity,
          status: "completed",
        },
        include: {
          ticket: true,
          buyer: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });
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
export async function GET() {
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
