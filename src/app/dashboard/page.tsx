import Link from "next/link";
import type { Ticket, Purchase } from "@/types";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ReviewList } from "@/components/review-list";
import { ReviewButton } from "@/components/review-button";
import { Star } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Check authentication
  const session = await getSession();
  
  if (!session) {
    redirect("/auth/login");
  }

  // Check email verification
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { emailVerified: true },
  });

  if (!user?.emailVerified) {
    redirect("/auth/email-verification-required");
  }

  // Fetch user's tickets
  const tickets: Ticket[] = await prisma.ticket.findMany({
    where: {
      sellerId: session.user.id,
    },
    include: {
      purchases: true,
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

  // Fetch user's purchases
  const purchases: Purchase[] = await prisma.purchase.findMany({
    where: {
      buyerId: session.user.id,
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
          name: true,
          email: true,
        },
      },
      review: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  }) as unknown as Purchase[];

  // Fetch reviews received by the user
  const reviewsReceived = await prisma.review.findMany({
    where: {
      revieweeId: session.user.id,
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
      createdAt: 'desc',
    },
  });

  // Calculate average rating
  const totalReviews = reviewsReceived.length;
  const averageRating =
    totalReviews > 0
      ? reviewsReceived.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

  // Calculate totals
  const totalSales = tickets.reduce((sum, ticket) => {
    const sold = ticket.quantity - ticket.available;
    return sum + (sold * ticket.price);
  }, 0);

  const totalPurchases = purchases.reduce((sum, purchase) => {
    return sum + purchase.totalPrice;
  }, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Listed Tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{tickets.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-500">${totalSales.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Purchases Made</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-500">{purchases.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Spent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-500">${totalPurchases.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Your Rating</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-500">
                  {totalReviews > 0 ? averageRating.toFixed(1) : "N/A"}
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Listed Tickets */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">My Listed Tickets</h2>
            <Button asChild>
              <Link href="/tickets/create">
                + Add New
              </Link>
            </Button>
          </div>

          {tickets.length === 0 ? (
            <Card className="text-center p-8">
              <div className="text-muted-foreground text-5xl mb-4">📋</div>
              <CardDescription className="mb-4">You haven&apos;t listed any tickets yet.</CardDescription>
              <Button asChild>
                <Link href="/tickets/create">
                  List Your First Ticket
                </Link>
              </Button>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Sold</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => {
                    const sold = ticket.quantity - ticket.available;
                    const revenue = ticket.purchases?.reduce((sum, p) => sum + p.totalPrice, 0) || 0;
                    return (
                      <TableRow key={ticket.id}>
                        <TableCell>
                          <Link
                            href={`/tickets/${ticket.id}`}
                            className="text-primary hover:underline font-medium"
                          >
                            {ticket.title}
                          </Link>
                          <div className="text-sm text-muted-foreground">{ticket.category}</div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {new Date(ticket.eventDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="whitespace-nowrap font-medium">
                          ${ticket.price}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {ticket.available} / {ticket.quantity}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {sold}
                        </TableCell>
                        <TableCell className="whitespace-nowrap font-semibold text-green-600 dark:text-green-500">
                          ${revenue.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>

        {/* My Purchases */}
        <div>
          <h2 className="text-2xl font-bold mb-4">My Purchases</h2>

          {purchases.length === 0 ? (
            <Card className="text-center p-8">
              <div className="text-muted-foreground text-5xl mb-4">🎫</div>
              <CardDescription className="mb-4">You haven&apos;t purchased any tickets yet.</CardDescription>
              <Button asChild>
                <Link href="/tickets">
                  Browse Tickets
                </Link>
              </Button>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Review</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((purchase) => {
                    if (!purchase.ticket) return null;
                    return (
                    <TableRow key={purchase.id}>
                      <TableCell>
                        <Link
                          href={`/tickets/${purchase.ticket.id}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {purchase.ticket.title}
                        </Link>
                        <div className="text-sm text-muted-foreground">{purchase.ticket.location}</div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {new Date(purchase.ticket.eventDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {purchase.quantity}
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-semibold">
                        ${purchase.totalPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant={purchase.status === 'completed' ? 'default' : 'secondary'}>
                          {purchase.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {new Date(purchase.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {purchase.status === 'completed' && (
                          <ReviewButton
                            purchaseId={purchase.id}
                            ticketTitle={purchase.ticket.title}
                            sellerName={purchase.ticket.seller?.name || purchase.ticket.seller?.email || "Seller"}
                            hasReview={!!purchase.review}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                  })}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>

        {/* Reviews Received */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">⭐ Reviews Received</h2>
            {totalReviews > 0 && (
              <Button asChild variant="outline">
                <Link href={`/users/${session.user.id}`}>
                  View Full Profile
                </Link>
              </Button>
            )}
          </div>

          {reviewsReceived.length === 0 ? (
            <Card className="text-center p-8">
              <div className="text-muted-foreground text-5xl mb-4">⭐</div>
              <CardDescription className="mb-4">
                No reviews yet. Reviews will appear here when buyers rate your tickets.
              </CardDescription>
            </Card>
          ) : (
            <ReviewList reviews={reviewsReceived.map(review => ({
              ...review,
              createdAt: review.createdAt.toISOString(),
            }))} />
          )}
        </div>
      </div>
    </div>
  );
}
