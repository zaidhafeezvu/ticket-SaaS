import Link from "next/link";
import type { Ticket, Purchase } from "@/types";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Check authentication
  const session = await getSession();
  
  if (!session) {
    redirect("/auth/login");
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
      ticket: true,
      buyer: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  }) as unknown as Purchase[];

  // Calculate totals
  const totalSales = tickets.reduce((sum, ticket) => {
    const sold = ticket.quantity - ticket.available;
    return sum + (sold * ticket.price);
  }, 0);

  const totalPurchases = purchases.reduce((sum, purchase) => {
    return sum + purchase.totalPrice;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-gray-600 text-sm mb-2">Listed Tickets</div>
            <div className="text-3xl font-bold text-blue-600">{tickets.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-gray-600 text-sm mb-2">Total Sales</div>
            <div className="text-3xl font-bold text-green-600">${totalSales.toFixed(2)}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-gray-600 text-sm mb-2">Purchases Made</div>
            <div className="text-3xl font-bold text-purple-600">{purchases.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-gray-600 text-sm mb-2">Total Spent</div>
            <div className="text-3xl font-bold text-orange-600">${totalPurchases.toFixed(2)}</div>
          </div>
        </div>

        {/* My Listed Tickets */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">My Listed Tickets</h2>
            <Link
              href="/tickets/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Add New
            </Link>
          </div>

          {tickets.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-400 text-5xl mb-4">📋</div>
              <p className="text-gray-600 mb-4">You haven&apos;t listed any tickets yet.</p>
              <Link
                href="/tickets/create"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                List Your First Ticket
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Available
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sold
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tickets.map((ticket) => {
                      const sold = ticket.quantity - ticket.available;
                      const revenue = ticket.purchases?.reduce((sum, p) => sum + p.totalPrice, 0) || 0;
                      return (
                        <tr key={ticket.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <Link
                              href={`/tickets/${ticket.id}`}
                              className="text-blue-600 hover:underline font-medium"
                            >
                              {ticket.title}
                            </Link>
                            <div className="text-sm text-gray-500">{ticket.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(ticket.eventDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${ticket.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {ticket.available} / {ticket.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {sold}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                            ${revenue.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* My Purchases */}
        <div>
          <h2 className="text-2xl font-bold mb-4">My Purchases</h2>

          {purchases.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-400 text-5xl mb-4">🎫</div>
              <p className="text-gray-600 mb-4">You haven&apos;t purchased any tickets yet.</p>
              <Link
                href="/tickets"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Browse Tickets
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purchase Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {purchases.map((purchase) => {
                      if (!purchase.ticket) return null;
                      return (
                      <tr key={purchase.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <Link
                            href={`/tickets/${purchase.ticket.id}`}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            {purchase.ticket.title}
                          </Link>
                          <div className="text-sm text-gray-500">{purchase.ticket.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(purchase.ticket.eventDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {purchase.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          ${purchase.totalPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            purchase.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {purchase.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(purchase.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
