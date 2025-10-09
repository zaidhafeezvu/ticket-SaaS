import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background dark:from-blue-950/20 dark:to-background">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Buy and Sell Event Tickets
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The trusted marketplace for concert tickets, sports events, theater shows, and more.
            Safe, secure, and simple.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/tickets">
                Browse Tickets
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild
              className="border-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/50 dark:hover:to-purple-950/50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Link href="/tickets/create">
                List Your Tickets
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="text-4xl mb-2">🔒</div>
              <CardTitle>Secure Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your purchases are protected with our secure payment system and buyer guarantee.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="text-4xl mb-2">⚡</div>
              <CardTitle>Instant Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get your tickets immediately after purchase. No waiting, no hassle.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="text-4xl mb-2">💰</div>
              <CardTitle>Best Prices</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Compare prices from multiple sellers and find the best deals on tickets.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Categories Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-10 text-foreground">Popular Categories</h2>
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
      <footer className="bg-gray-900 dark:bg-gray-950 text-white mt-20 py-12">
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
                <li><Link href="/tickets" className="hover:text-white transition-colors">Browse Tickets</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="/buyer-guarantee" className="hover:text-white transition-colors">Buyer Guarantee</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Sellers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/tickets/create" className="hover:text-white transition-colors">List Tickets</Link></li>
                <li><Link href="/seller-guide" className="hover:text-white transition-colors">Seller Guide</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
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
