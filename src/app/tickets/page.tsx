import Link from "next/link";
import type { Ticket } from "@/types";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SellerRating } from "@/components/seller-rating";

export const dynamic = 'force-dynamic';

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;

  // Fetch tickets from database
  const tickets: Ticket[] = await prisma.ticket.findMany({
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
  }) as unknown as Ticket[];

  // Fetch seller ratings for all tickets
  const sellerRatings = await Promise.all(
    tickets.map(async (ticket) => {
      const reviews = await prisma.review.findMany({
        where: { revieweeId: ticket.sellerId },
        select: { rating: true },
      });
      
      const totalReviews = reviews.length;
      const averageRating =
        totalReviews > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
          : 0;
      
      return {
        sellerId: ticket.sellerId,
        averageRating,
        totalReviews,
      };
    })
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background dark:from-blue-950/20 dark:to-background">
      {/* Navigation */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Tickets` : 'All Tickets'}
          </h1>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Link href="/tickets/create">
              ✨ List Tickets
            </Link>
          </Button>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex gap-3 flex-wrap">
          <Button
            variant={!category ? "default" : "outline"}
            asChild
          >
            <Link href="/tickets">
              All
            </Link>
          </Button>
          <Button
            variant={category === 'concerts' ? "default" : "outline"}
            asChild
          >
            <Link href="/tickets?category=concerts">
              🎵 Concerts
            </Link>
          </Button>
          <Button
            variant={category === 'sports' ? "default" : "outline"}
            asChild
          >
            <Link href="/tickets?category=sports">
              ⚽ Sports
            </Link>
          </Button>
          <Button
            variant={category === 'theater' ? "default" : "outline"}
            asChild
          >
            <Link href="/tickets?category=theater">
              🎭 Theater
            </Link>
          </Button>
          <Button
            variant={category === 'festivals' ? "default" : "outline"}
            asChild
          >
            <Link href="/tickets?category=festivals">
              🎉 Festivals
            </Link>
          </Button>
        </div>

        {/* Tickets Grid */}
        {tickets.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">🎫</div>
            <CardHeader>
              <CardTitle className="text-2xl">No tickets available yet</CardTitle>
              <CardDescription>
                Be the first to list tickets in this category!
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Button asChild>
                <Link href="/tickets/create">
                  List Your Tickets
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket, index) => {
              const sellerRating = sellerRatings[index];
              return (
                <Link
                  key={ticket.id}
                  href={`/tickets/${ticket.id}`}
                  className="block group"
                >
                  <Card className="overflow-hidden h-full group-hover:scale-105 transition-all duration-300 border-2">
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-6xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                        {ticket.category === 'concerts' && '🎵'}
                        {ticket.category === 'sports' && '⚽'}
                        {ticket.category === 'theater' && '🎭'}
                        {ticket.category === 'festivals' && '🎉'}
                        {!['concerts', 'sports', 'theater', 'festivals'].includes(ticket.category) && '🎫'}
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">{ticket.title}</CardTitle>
                        <span className="text-primary font-bold text-xl whitespace-nowrap">${ticket.price}</span>
                      </div>
                      <CardDescription className="line-clamp-2 text-base">{ticket.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                      <div>📍 {ticket.location}</div>
                      <div>📅 {new Date(ticket.eventDate).toLocaleDateString()}</div>
                      <div className="pt-2">
                        <SellerRating
                          sellerId={ticket.sellerId}
                          averageRating={sellerRating.averageRating}
                          totalReviews={sellerRating.totalReviews}
                          showLink={false}
                          size="sm"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <span className={cn(
                        "font-semibold",
                        ticket.available > 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                      )}>
                        {ticket.available} / {ticket.quantity} available
                      </span>
                      <Badge variant="secondary">
                        {ticket.category}
                      </Badge>
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
