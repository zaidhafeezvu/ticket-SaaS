import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

// Rate limiter for individual ticket GET
const getTicketLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
});

// Rate limiter for ticket DELETE
const deleteTicketLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 deletes per minute
});

// GET ticket by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Apply rate limiting
  const rateLimitResponse = await getTicketLimiter(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const { id } = await context.params;
    
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json(
      { error: "Failed to fetch ticket" },
      { status: 500 }
    );
  }
}

// DELETE ticket by ID
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Apply rate limiting
  const rateLimitResponse = await deleteTicketLimiter(request);
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

    const { id } = await context.params;

    // Get ticket to verify ownership
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        purchases: true,
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (ticket.sellerId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own tickets" },
        { status: 403 }
      );
    }

    // Check if ticket has any purchases
    if (ticket.purchases && ticket.purchases.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete ticket with existing purchases" },
        { status: 400 }
      );
    }

    // Delete the ticket
    await prisma.ticket.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Ticket deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json(
      { error: "Failed to delete ticket" },
      { status: 500 }
    );
  }
}
