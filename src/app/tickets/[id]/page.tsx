"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    if (!ticket || purchaseQuantity > ticket.available) {
      alert("Invalid quantity");
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
        alert("Purchase successful! Check your dashboard for details.");
        router.push("/dashboard");
      } else {
        alert("Purchase failed. Please try again.");
      }
    } catch (error) {
      console.error("Error purchasing ticket:", error);
      alert("An error occurred");
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="border-b bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                🎫 TicketSaaS
              </Link>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Ticket not found</h1>
          <Link href="/tickets" className="text-blue-600 hover:underline">
            ← Back to Tickets
          </Link>
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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              🎫 TicketSaaS
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/tickets" className="text-gray-700 hover:text-blue-600">
                Browse Tickets
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/tickets" className="text-blue-600 hover:underline">
            ← Back to Tickets
          </Link>
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
                <h1 className="text-4xl font-bold text-gray-900">{ticket.title}</h1>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {ticket.category}
                </span>
              </div>
              <p className="text-gray-600 text-lg">{ticket.description}</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md space-y-4">
              <div className="flex items-center text-gray-700">
                <span className="text-2xl mr-3">📍</span>
                <div>
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="font-semibold">{ticket.location}</div>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <span className="text-2xl mr-3">📅</span>
                <div>
                  <div className="text-sm text-gray-500">Event Date</div>
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

              <div className="flex items-center text-gray-700">
                <span className="text-2xl mr-3">💰</span>
                <div>
                  <div className="text-sm text-gray-500">Price per Ticket</div>
                  <div className="font-bold text-2xl text-blue-600">${ticket.price.toFixed(2)}</div>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <span className="text-2xl mr-3">🎫</span>
                <div>
                  <div className="text-sm text-gray-500">Availability</div>
                  <div className="font-semibold">
                    {ticket.available} of {ticket.quantity} tickets available
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Section */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold mb-4">Purchase Tickets</h2>
              
              {ticket.available > 0 ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max={ticket.available}
                      value={purchaseQuantity}
                      onChange={(e) => setPurchaseQuantity(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-blue-600 text-2xl">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handlePurchase}
                    disabled={purchasing || purchaseQuantity > ticket.available}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg"
                  >
                    {purchasing ? "Processing..." : "Buy Now"}
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-red-600 font-semibold text-lg">Sold Out</p>
                  <p className="text-gray-600 mt-2">This event is currently sold out.</p>
                </div>
              )}
            </div>

            {/* Seller Info */}
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="text-sm text-gray-600">
                Listed by: <span className="font-semibold">{ticket.seller.name || ticket.seller.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
