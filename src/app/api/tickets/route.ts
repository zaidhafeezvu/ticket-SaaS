import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all tickets
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");

    const tickets = await prisma.ticket.findMany({
      where: category ? { category } : {},
      include: {
        seller: {
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

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

// POST create a new ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, price, eventDate, location, category, quantity } = body;

    // For demo purposes, we'll create a default user if none exists
    let user = await prisma.user.findFirst();
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "demo@ticketsaas.com",
          name: "Demo User",
          password: "hashed_password_placeholder",
        },
      });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        price,
        eventDate: new Date(eventDate),
        location,
        category,
        quantity,
        available: quantity,
        sellerId: user.id,
      },
      include: {
        seller: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 }
    );
  }
}
