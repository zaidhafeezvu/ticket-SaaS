import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar, Ticket } from "lucide-react";
import Link from "next/link";

// Revalidate every 5 minutes
export const revalidate = 300;

// Generate static params for active users
export async function generateStaticParams() {
  try {
    const users = await prisma.user.findMany({
      where: {
        tickets: {
          some: {},
        },
      },
      select: { id: true },
      take: 100, // Pre-generate top 100 active users
    });

    return users.map((user) => ({
      id: user.id,
    }));
  } catch {
    // If DB is not available at build time, return empty array
    // Pages will be generated on-demand with ISR
    console.log('Database not available at build time, skipping static generation');
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: { 
      name: true, 
      email: true,
    },
  });

  if (!user) {
    return {
      title: "User Not Found - TicketSaaS",
    };
  }

  return {
    title: `${user.name || user.email} - TicketSaaS`,
    description: `View tickets and reviews for ${user.name || user.email} on TicketSaaS`,
    openGraph: {
      title: user.name || user.email,
      description: `Ticket seller profile on TicketSaaS`,
      type: "profile",
    },
  };
}

interface UserProfilePageProps {
  params: Promise<{ id: string }>;
}

interface ReviewData {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  purchase?: {
    ticket: {
      id: string;
      title: string;
    };
  };
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = await params;

  // Fetch user data and reviews in parallel
  const [user, reviewsData] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            tickets: true,
            purchases: true,
          },
        },
      },
    }),
    prisma.review.findMany({
      where: { revieweeId: id },
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
        createdAt: 'desc',
      },
    }),
  ]);

  if (!user) {
    notFound();
  }

  // Calculate review stats
  const totalReviews = reviewsData.length;
  const averageRating =
    totalReviews > 0
      ? reviewsData.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  const ratingDistribution = {
    5: reviewsData.filter((r) => r.rating === 5).length,
    4: reviewsData.filter((r) => r.rating === 4).length,
    3: reviewsData.filter((r) => r.rating === 3).length,
    2: reviewsData.filter((r) => r.rating === 2).length,
    1: reviewsData.filter((r) => r.rating === 1).length,
  };

  const stats = {
    averageRating,
    totalReviews,
    ratingDistribution,
  };

  const reviews = reviewsData.map((review) => ({
    ...review,
    createdAt: review.createdAt.toISOString(),
  }));

  // Fetch user's active tickets
  const activeTickets = await prisma.ticket.findMany({
    where: {
      sellerId: id,
      available: {
        gt: 0,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });

  // Get user initials for avatar
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email[0].toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* User Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{user.name || "Anonymous User"}</h1>
                <p className="text-muted-foreground mb-4">{user.email}</p>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{stats.averageRating.toFixed(1)}</span>
                    <span className="text-muted-foreground">
                      ({stats.totalReviews} {stats.totalReviews === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">
                      {user._count.tickets} {user._count.tickets === 1 ? "listing" : "listings"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">
                      Member since {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Rating Distribution */}
                {stats.totalReviews > 0 && (
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-sm w-12">{rating} ⭐</span>
                        <div className="flex-1 bg-secondary h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-yellow-500 h-full"
                            style={{
                              width: `${
                                stats.totalReviews > 0
                                  ? (stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] /
                                      stats.totalReviews) *
                                    100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12">
                          {stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Listings */}
        {activeTickets.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">🎫 Active Listings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTickets.map((ticket) => (
                <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{ticket.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span className="line-clamp-1">{ticket.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(ticket.eventDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-2xl font-bold text-primary">${ticket.price}</span>
                          <Badge variant="secondary">{ticket.available} available</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">⭐ Reviews</h2>
          {reviews.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No reviews yet
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((review: ReviewData) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage
                          src={review.reviewer.image || undefined}
                          alt={review.reviewer.name || "Reviewer"}
                        />
                        <AvatarFallback>
                          {review.reviewer.name?.[0]?.toUpperCase() || review.reviewer.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold">{review.reviewer.name || "Anonymous"}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {review.comment && (
                          <p className="text-muted-foreground mb-2">{review.comment}</p>
                        )}

                        {review.purchase?.ticket && (
                          <p className="text-sm text-muted-foreground">
                            For: <span className="font-medium">{review.purchase.ticket.title}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
