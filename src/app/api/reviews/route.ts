import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const limiter = rateLimit({
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 10, // 10 requests per minute
    });
    
    const rateLimitResult = await limiter(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    // Check authentication
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { purchaseId, rating, comment } = body;

    // Validate input
    if (!purchaseId || !rating) {
      return NextResponse.json(
        { error: "Purchase ID and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Verify the purchase exists and belongs to the user
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: {
        ticket: {
          include: { seller: true },
        },
        review: true,
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: "Purchase not found" },
        { status: 404 }
      );
    }

    if (purchase.buyerId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only review your own purchases" },
        { status: 403 }
      );
    }

    // Check if purchase is completed
    if (purchase.status !== "completed") {
      return NextResponse.json(
        { error: "You can only review completed purchases" },
        { status: 400 }
      );
    }

    // Check if review already exists
    if (purchase.review) {
      return NextResponse.json(
        { error: "You have already reviewed this purchase" },
        { status: 400 }
      );
    }

    // Prevent self-review
    if (purchase.ticket.sellerId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot review yourself" },
        { status: 400 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        rating,
        comment: comment || null,
        reviewerId: session.user.id,
        revieweeId: purchase.ticket.sellerId,
        purchaseId,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        reviewee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Review created successfully", review },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

// GET /api/reviews - Get all reviews (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let where = {};

    if (userId) {
      where = { revieweeId: userId };
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          reviewee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          purchase: {
            include: {
              ticket: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: offset,
      }),
      prisma.review.count({ where }),
    ]);

    return NextResponse.json({
      reviews,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
