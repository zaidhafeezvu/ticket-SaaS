"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      // Sign in successful, redirect to dashboard
      toast.success("Welcome back! Signed in successfully.");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Invalid email or password";
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Check if error is related to email verification
      if (errorMessage.toLowerCase().includes("email") && 
          (errorMessage.toLowerCase().includes("verify") || errorMessage.toLowerCase().includes("verified"))) {
        setShowResendVerification(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendingEmail(true);
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Verification email sent! Please check your inbox.");
        setShowResendVerification(false);
      } else {
        toast.error(data.error || "Failed to resend verification email");
      }
    } catch (error) {
      toast.error("Failed to resend verification email");
      console.error("Resend verification error:", error);
    } finally {
      setResendingEmail(false);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to sign in with GitHub";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50/30 to-background dark:from-blue-950/20 dark:via-purple-950/10 dark:to-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
              🎫 TicketSaaS
            </Link>
            <Link
              href="/auth/signup"
              className="text-muted-foreground hover:text-primary transition-all duration-200 font-medium hover:scale-105"
            >
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="max-w-md mx-auto px-4 py-16">
        <Card className="border-2 shadow-2xl">
          <CardHeader className="space-y-3 pb-8">
            <CardTitle className="text-4xl text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Sign In</CardTitle>
            <CardDescription className="text-center text-base">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="space-y-3 mb-4">
                <div className="bg-destructive/15 text-destructive p-3 rounded-lg text-sm">
                  {error}
                </div>
                {showResendVerification && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          Email not verified
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                          Please check your email for the verification link.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={handleResendVerification}
                          disabled={resendingEmail}
                        >
                          {resendingEmail ? "Sending..." : "Resend Verification Email"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Your password"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg h-12"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-3 text-muted-foreground font-medium">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-2 hover:border-purple-600/50"
              onClick={handleGitHubSignIn}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Sign in with GitHub
            </Button>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline font-semibold hover:text-purple-600 transition-colors">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
