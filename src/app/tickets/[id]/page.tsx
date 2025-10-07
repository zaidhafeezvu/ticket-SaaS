"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Ticket {
  id: string;
  title: string;
  description: string;
  price: number;
  eventDate: string;
  location: string;
  category: string;
  quantity: number;
  available: number;
  seller: {
    name: string | null;
    email: string;
  };
}

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    params.then((resolvedParams) => {
      fetchTicket(resolvedParams.id);
    });
  }, [params]);

  const fetchTicket = async (id: string) => {
    try {
      const response = await fetch(`/api/tickets/${id}`);
      if (response.ok) {
        const data = await response.json();
        setTicket(data);
      }
    } catch (error) {
      console.error("Error fetching ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!session) {
      router.push("/auth/login");
      return;
    }

    if (!ticket || purchaseQuantity > ticket.available) {
      toast.error("Invalid quantity. Please check the available tickets.");
      return;
    }

    setPurchasing(true);
    try {
      const response = await fetch("/api/purchases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticketId: ticket.id,
          quantity: purchaseQuantity,
        }),
      });

      if (response.ok) {
        toast.success("Purchase successful! Check your dashboard for details.");
        router.push("/dashboard");
        router.refresh();
      } else {
        const error = await response.json();
        toast.error(error.error || "Purchase failed. Please try again.");
      }
    } catch (error) {
      console.error("Error purchasing ticket:", error);
      toast.error("An error occurred while processing your purchase");
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <div className="text-2xl text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Ticket not found</h1>
          <Button variant="ghost" asChild>
            <Link href="/tickets">
              ← Back to Tickets
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const totalPrice = ticket.price * purchaseQuantity;
  const categoryEmoji = {
    concerts: "🎵",
    sports: "⚽",
    theater: "🎭",
    festivals: "🎉",
  }[ticket.category] || "🎫";

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/tickets">
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

            {/* Purchase Section */}
            <Card>
              <CardHeader>
                <CardTitle>Purchase Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                {ticket.available > 0 ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        type="number"
                        id="quantity"
                        min="1"
                        max={ticket.available}
                        value={purchaseQuantity}
                        onChange={(e) => setPurchaseQuantity(parseInt(e.target.value) || 1)}
                      />
                    </div>

                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center text-lg">
                          <span className="font-semibold">Total:</span>
                          <span className="font-bold text-primary text-2xl">
                            ${totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Button
                      onClick={handlePurchase}
                      disabled={purchasing || purchaseQuantity > ticket.available}
                      className="w-full"
                      size="lg"
                    >
                      {purchasing ? "Processing..." : "Buy Now"}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-destructive font-semibold text-lg">Sold Out</p>
                    <p className="text-muted-foreground mt-2">This event is currently sold out.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card className="bg-muted">
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">
                  Listed by: <span className="font-semibold text-foreground">{ticket.seller.name || ticket.seller.email}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
