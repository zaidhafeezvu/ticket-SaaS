"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmailVerificationRequiredPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [resending, setResending] = useState(false);

  const handleResendVerification = async () => {
    if (!session?.user?.email) {
      toast.error("Email not found. Please log in again.");
      return;
    }

    setResending(true);
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.user.email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Verification email sent! Please check your inbox.");
      } else {
        toast.error(data.error || "Failed to resend verification email");
      }
    } catch (error) {
      toast.error("Failed to resend verification email");
      console.error("Resend verification error:", error);
    } finally {
      setResending(false);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background dark:from-blue-950/20 dark:to-background">
      {/* Navigation */}
      <nav className="border-b bg-background shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary">
              🎫 TicketSaaS
            </Link>
          </div>
        </div>
      </nav>

      {/* Verification Required Message */}
      <div className="max-w-md mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">Email Verification Required</CardTitle>
            <CardDescription className="text-center">
              Please verify your email to access this feature
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-4">
                <Mail className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground">
                We&apos;ve sent a verification link to
              </p>
              <p className="font-semibold">{session?.user?.email}</p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg text-left space-y-2">
              <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">
                Check your email inbox
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Click the verification link in the email to activate your account. 
                If you don&apos;t see the email, check your spam folder.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleResendVerification}
                disabled={resending}
                className="w-full"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${resending ? "animate-spin" : ""}`} />
                {resending ? "Sending..." : "Resend Verification Email"}
              </Button>

              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
