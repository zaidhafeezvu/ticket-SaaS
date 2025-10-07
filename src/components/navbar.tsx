"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

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
    <nav className="border-b bg-background shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-primary">
            🎫 TicketSaaS
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/tickets"
              className="text-foreground hover:text-primary transition-colors"
            >
              Browse Tickets
            </Link>
            
            {!isPending && (
              <>
                {session ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Button asChild>
                      <Link href="/tickets/create">
                        Sell Tickets
                      </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {session.user.email}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild>
                      <Link href="/auth/login">
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href="/auth/signup">
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
