"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    const { authClient } = await import("@/lib/auth-client");
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            🎫 TicketSaaS
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/tickets"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Browse Tickets
            </Link>
            
            {!isPending && (
              <>
                {session ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/tickets/create"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Sell Tickets
                    </Link>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-700">
                        {session.user.email}
                      </span>
                      <button
                        onClick={handleSignOut}
                        className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
