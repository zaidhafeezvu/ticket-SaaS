import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

// Rate limiters
const getTicketsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 requests per minute
});

const createTicketLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute
});

// GET all tickets
export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await getTicketsLimiter(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
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
  // Apply rate limiting
  const rateLimitResponse = await createTicketLimiter(request);
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
    const { title, description, price, eventDate, location, category, quantity } = body;

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
        sellerId: session.user.id,
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
