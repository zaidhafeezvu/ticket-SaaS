import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PurchaseForm } from "@/components/purchase-form";

// Revalidate every 60 seconds for ISR
export const revalidate = 60;

// Generate static params for top tickets (optional, can be limited)
export async function generateStaticParams() {
  try {
    const tickets = await prisma.ticket.findMany({
      select: { id: true },
      take: 50, // Pre-generate top 50 tickets at build time
      orderBy: { createdAt: 'desc' },
    });

    return tickets.map((ticket) => ({
      id: ticket.id,
    }));
  } catch (error) {
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

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    select: { 
      title: true, 
      description: true, 
      price: true,
      category: true,
      location: true,
    },
  });

  if (!ticket) {
    return {
      title: "Ticket Not Found - TicketSaaS",
    };
  }

  return {
    title: `${ticket.title} - $${ticket.price} - TicketSaaS`,
    description: ticket.description,
    openGraph: {
      title: ticket.title,
      description: ticket.description,
      type: "website",
    },
  };
}

export default async function TicketDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  // Fetch ticket and seller rating in parallel
  const [ticket, reviews] = await Promise.all([
    prisma.ticket.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.ticket.findUnique({
      where: { id },
      select: { sellerId: true },
    }).then(async (t) => {
      if (!t) return [];
      return prisma.review.findMany({
        where: { revieweeId: t.sellerId },
        select: { rating: true },
      });
    }),
  ]);

  if (!ticket) {
    notFound();
  }

  // Calculate seller rating
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  const categoryEmojiMap: Record<string, string> = {
    concerts: "🎵",
    sports: "⚽",
    theater: "🎭",
    festivals: "🎉",
  };
  
  const categoryEmoji = categoryEmojiMap[ticket.category] || "🎫";

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/tickets" prefetch={true}>
              ← Back to Tickets
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ticket Image/Icon */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg h-96 flex items-center justify-center text-white">
            <div className="text-9xl">{categoryEmoji}</div>
          </div>

          {/* Ticket Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-4xl font-bold text-foreground">{ticket.title}</h1>
                <Badge variant="secondary">
                  {ticket.category}
                </Badge>
              </div>
              <p className="text-muted-foreground text-lg">{ticket.description}</p>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📍</span>
                  <div>
                    <div className="text-sm text-muted-foreground">Location</div>
                    <div className="font-semibold">{ticket.location}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="text-2xl mr-3">📅</span>
                  <div>
                    <div className="text-sm text-muted-foreground">Event Date</div>
                    <div className="font-semibold">
                      {new Date(ticket.eventDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="text-2xl mr-3">💰</span>
                  <div>
                    <div className="text-sm text-muted-foreground">Price per Ticket</div>
                    <div className="font-bold text-2xl text-primary">${ticket.price.toFixed(2)}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="text-2xl mr-3">🎫</span>
                  <div>
                    <div className="text-sm text-muted-foreground">Availability</div>
                    <div className="font-semibold">
                      {ticket.available} of {ticket.quantity} tickets available
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Purchase Section - Client Component */}
            <PurchaseForm
              ticketId={ticket.id}
              available={ticket.available}
              price={ticket.price}
            />

            {/* Seller Info */}
            <Card className="bg-muted">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Listed by:</div>
                    <Link 
                      href={`/users/${ticket.sellerId}`}
                      className="font-semibold text-foreground hover:text-primary transition-colors"
                      prefetch={false}
                    >
                      {ticket.seller.name || ticket.seller.email}
                    </Link>
                    {totalReviews > 0 && (
                      <div className="flex items-center gap-1 mt-2 text-sm">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">
                          {averageRating.toFixed(1)}
                        </span>
                        <span className="text-muted-foreground">
                          ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
                        </span>
                      </div>
                    )}
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/users/${ticket.sellerId}`} prefetch={false}>
                      View Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
