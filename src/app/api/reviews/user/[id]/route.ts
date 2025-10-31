import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/reviews/user/[id] - Get reviews for a specific user with stats
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    // Get all reviews for the user
    const reviews = await prisma.review.findMany({
      where: {
        revieweeId: userId,
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
    });

    // Calculate rating statistics with optimized single-pass algorithm
    const totalReviews = reviews.length;
    let sumRating = 0;
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    // Single pass through reviews to calculate both sum and distribution
    reviews.forEach((review) => {
      sumRating += review.rating;
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
    });
    
    const averageRating = totalReviews > 0 ? sumRating / totalReviews : 0;

    return NextResponse.json({
      reviews,
      stats: {
        totalReviews,
        averageRating: parseFloat(averageRating.toFixed(2)),
        ratingDistribution,
      },
    });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch user reviews" },
      { status: 500 }
    );
  }
}
