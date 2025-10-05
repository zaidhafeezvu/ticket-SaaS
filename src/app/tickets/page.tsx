import Link from "next/link";
import type { Ticket } from "@/types";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Tickets` : 'All Tickets'}
          </h1>
          <Link
            href="/tickets/create"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            + List Tickets
          </Link>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex gap-2 flex-wrap">
          <Link
            href="/tickets"
            className={`px-4 py-2 rounded-lg ${
              !category ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All
          </Link>
          <Link
            href="/tickets?category=concerts"
            className={`px-4 py-2 rounded-lg ${
              category === 'concerts' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🎵 Concerts
          </Link>
          <Link
            href="/tickets?category=sports"
            className={`px-4 py-2 rounded-lg ${
              category === 'sports' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            ⚽ Sports
          </Link>
          <Link
            href="/tickets?category=theater"
            className={`px-4 py-2 rounded-lg ${
              category === 'theater' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🎭 Theater
          </Link>
          <Link
            href="/tickets?category=festivals"
            className={`px-4 py-2 rounded-lg ${
              category === 'festivals' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🎉 Festivals
          </Link>
        </div>

        {/* Tickets Grid */}
        {tickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🎫</div>
            <h2 className="text-2xl font-semibold mb-2">No tickets available yet</h2>
            <p className="text-gray-600 mb-6">
              Be the first to list tickets in this category!
            </p>
            <Link
              href="/tickets/create"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              List Your Tickets
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/tickets/${ticket.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-6xl">
                  {ticket.category === 'concerts' && '🎵'}
                  {ticket.category === 'sports' && '⚽'}
                  {ticket.category === 'theater' && '🎭'}
                  {ticket.category === 'festivals' && '🎉'}
                  {!['concerts', 'sports', 'theater', 'festivals'].includes(ticket.category) && '🎫'}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{ticket.title}</h3>
                    <span className="text-blue-600 font-bold text-lg">${ticket.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ticket.description}</p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div>📍 {ticket.location}</div>
                    <div>📅 {new Date(ticket.eventDate).toLocaleDateString()}</div>
                    <div className="flex justify-between items-center pt-2">
                      <span className={`${ticket.available > 0 ? 'text-green-600' : 'text-red-600'} font-semibold`}>
                        {ticket.available} / {ticket.quantity} available
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {ticket.category}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
