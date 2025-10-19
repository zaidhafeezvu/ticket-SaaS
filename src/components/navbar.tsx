"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, User, LogOut, Star } from "lucide-react";
import { getAvatarUrl } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

export function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const { authClient } = await import("@/lib/auth-client");
    await authClient.signOut();
    toast.success("Signed out successfully");
    setMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  // Get user initials for avatar fallback
  const getUserInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
            🎫 TicketSaaS
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/tickets"
              className="text-foreground hover:text-primary transition-all duration-200 font-medium hover:scale-105"
            >
              Browse Tickets
            </Link>
            
            {!isPending && (
              <>
                {session ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-foreground hover:text-primary transition-all duration-200 font-medium hover:scale-105"
                    >
                      Dashboard
                    </Link>
                    <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Link href="/tickets/create">
                        Sell Tickets
                      </Link>
                    </Button>
                    
                    {/* User Avatar Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                          <Avatar className="h-10 w-10">
                            <AvatarImage 
                              src={getAvatarUrl(session.user.email)} 
                              alt={session.user.email}
                            />
                            <AvatarFallback>
                              {getUserInitials(session.user.email)}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">My Account</p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {session.user.email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/users/${session.user.id}`} className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            View Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={handleSignOut}
                          className="cursor-pointer text-red-600 focus:text-red-600"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {!isPending && session && (
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <Avatar className="h-12 w-12">
                        <AvatarImage 
                          src={getAvatarUrl(session.user.email)} 
                          alt={session.user.email}
                        />
                        <AvatarFallback>
                          {getUserInitials(session.user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">My Account</p>
                        <p className="text-xs text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    className="justify-start" 
                    asChild
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href="/tickets">
                      Browse Tickets
                    </Link>
                  </Button>
                  
                  {!isPending && (
                    <>
                      {session ? (
                        <>
                          <Button 
                            variant="ghost" 
                            className="justify-start" 
                            asChild
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Link href={`/users/${session.user.id}`}>
                              <Star className="mr-2 h-4 w-4" />
                              View Profile
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="justify-start" 
                            asChild
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Link href="/dashboard">
                              Dashboard
                            </Link>
                          </Button>
                          <Button 
                            className="justify-start" 
                            asChild
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Link href="/tickets/create">
                              Sell Tickets
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            className="justify-start text-red-600 hover:text-red-600"
                            onClick={handleSignOut}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="ghost" 
                            className="justify-start" 
                            asChild
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Link href="/auth/login">
                              Sign In
                            </Link>
                          </Button>
                          <Button 
                            className="justify-start" 
                            asChild
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Link href="/auth/signup">
                              Sign Up
                            </Link>
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
