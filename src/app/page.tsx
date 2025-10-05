import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Buy and Sell Event Tickets
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The trusted marketplace for concert tickets, sports events, theater shows, and more.
            Safe, secure, and simple.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/tickets" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Tickets
            </Link>
            <Link 
              href="/tickets/create" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              List Your Tickets
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
            <p className="text-gray-600">
              Your purchases are protected with our secure payment system and buyer guarantee.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Instant Delivery</h3>
            <p className="text-gray-600">
              Get your tickets immediately after purchase. No waiting, no hassle.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
            <p className="text-gray-600">
              Compare prices from multiple sellers and find the best deals on tickets.
            </p>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-10">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              href="/tickets?category=concerts" 
              className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-lg text-center font-semibold hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-2">🎵</div>
              Concerts
            </Link>
            <Link 
              href="/tickets?category=sports" 
              className="bg-gradient-to-br from-green-500 to-teal-500 text-white p-6 rounded-lg text-center font-semibold hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-2">⚽</div>
              Sports
            </Link>
            <Link 
              href="/tickets?category=theater" 
              className="bg-gradient-to-br from-red-500 to-orange-500 text-white p-6 rounded-lg text-center font-semibold hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-2">🎭</div>
              Theater
            </Link>
            <Link 
              href="/tickets?category=festivals" 
              className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white p-6 rounded-lg text-center font-semibold hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-2">🎉</div>
              Festivals
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">🎫 TicketSaaS</h3>
              <p className="text-gray-400">
                Your trusted marketplace for buying and selling event tickets.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Buyers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/tickets" className="hover:text-white">Browse Tickets</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white">How It Works</Link></li>
                <li><Link href="/buyer-guarantee" className="hover:text-white">Buyer Guarantee</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Sellers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/tickets/create" className="hover:text-white">List Tickets</Link></li>
                <li><Link href="/seller-guide" className="hover:text-white">Seller Guide</Link></li>
                <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 TicketSaaS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
