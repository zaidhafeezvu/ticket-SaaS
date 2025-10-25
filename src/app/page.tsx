import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TicketSaaS - Buy and Sell Event Tickets",
  description: "The trusted marketplace for concert tickets, sports events, theater shows, and festivals. Safe, secure, and simple ticket trading platform.",
  keywords: ["tickets", "events", "concerts", "sports", "theater", "festivals", "marketplace"],
  openGraph: {
    title: "TicketSaaS - Buy and Sell Event Tickets",
    description: "The trusted marketplace for event tickets. Safe, secure, and simple.",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background dark:from-blue-950/20 dark:to-background">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
            Buy and Sell Event Tickets
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            The trusted marketplace for concert tickets, sports events, theater shows, and more.
            Safe, secure, and simple.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 text-base px-8 py-6 h-auto"
            >
              <Link href="/tickets" prefetch={true}>
                🎫 Browse Tickets
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild
              className="border-2 border-purple-600/50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/50 dark:hover:to-purple-950/50 transition-all duration-300 hover:scale-105 hover:shadow-lg text-base px-8 py-6 h-auto hover:border-purple-600"
            >
              <Link href="/tickets/create" prefetch={false}>
                ✨ List Your Tickets
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="group hover:scale-105 hover:border-blue-500/50 dark:hover:border-blue-400/50">
            <CardHeader>
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">🔒</div>
              <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Secure Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Your purchases are protected with our secure payment system and buyer guarantee.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="group hover:scale-105 hover:border-purple-500/50 dark:hover:border-purple-400/50">
            <CardHeader>
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">⚡</div>
              <CardTitle className="text-xl group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Instant Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Get your tickets immediately after purchase. No waiting, no hassle.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="group hover:scale-105 hover:border-pink-500/50 dark:hover:border-pink-400/50">
            <CardHeader>
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">💰</div>
              <CardTitle className="text-xl group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">Best Prices</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Compare prices from multiple sellers and find the best deals on tickets.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Categories Section */}
        <div className="mt-24">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link 
              href="/tickets?category=concerts" 
              prefetch={true}
              className="group relative bg-gradient-to-br from-purple-500 to-pink-500 text-white p-8 rounded-xl text-center font-bold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-3 group-hover:scale-125 transition-transform duration-300">🎵</div>
                <div className="text-lg">Concerts</div>
              </div>
            </Link>
            <Link 
              href="/tickets?category=sports" 
              prefetch={true}
              className="group relative bg-gradient-to-br from-green-500 to-teal-500 text-white p-8 rounded-xl text-center font-bold hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-3 group-hover:scale-125 transition-transform duration-300">⚽</div>
                <div className="text-lg">Sports</div>
              </div>
            </Link>
            <Link 
              href="/tickets?category=theater" 
              prefetch={true}
              className="group relative bg-gradient-to-br from-red-500 to-orange-500 text-white p-8 rounded-xl text-center font-bold hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-3 group-hover:scale-125 transition-transform duration-300">🎭</div>
                <div className="text-lg">Theater</div>
              </div>
            </Link>
            <Link 
              href="/tickets?category=festivals" 
              prefetch={true}
              className="group relative bg-gradient-to-br from-blue-500 to-indigo-500 text-white p-8 rounded-xl text-center font-bold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-3 group-hover:scale-125 transition-transform duration-300">🎉</div>
                <div className="text-lg">Festivals</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-gray-950 dark:from-gray-950 dark:to-black text-white mt-24 py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-1">
              <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">🎫 TicketSaaS</h3>
              <p className="text-gray-400 leading-relaxed">
                Your trusted marketplace for buying and selling event tickets.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg text-white">For Buyers</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/tickets" className="hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">Browse Tickets</Link></li>
                <li><Link href="/how-it-works" className="hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">How It Works</Link></li>
                <li><Link href="/buyer-guarantee" className="hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">Buyer Guarantee</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg text-white">For Sellers</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/tickets/create" className="hover:text-purple-400 transition-colors duration-200 hover:translate-x-1 inline-block">List Tickets</Link></li>
                <li><Link href="/seller-guide" className="hover:text-purple-400 transition-colors duration-200 hover:translate-x-1 inline-block">Seller Guide</Link></li>
                <li><Link href="/dashboard" className="hover:text-purple-400 transition-colors duration-200 hover:translate-x-1 inline-block">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg text-white">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/help" className="hover:text-pink-400 transition-colors duration-200 hover:translate-x-1 inline-block">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-pink-400 transition-colors duration-200 hover:translate-x-1 inline-block">Contact Us</Link></li>
                <li><Link href="/terms" className="hover:text-pink-400 transition-colors duration-200 hover:translate-x-1 inline-block">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">&copy; 2024 TicketSaaS. All rights reserved. Made with ❤️ for ticket enthusiasts.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
