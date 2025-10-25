"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TicketsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Tickets page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <div className="text-6xl mb-4">⚠️</div>
            <CardTitle className="text-2xl">Something went wrong</CardTitle>
            <CardDescription className="text-lg">
              We encountered an error while loading tickets. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={reset} size="lg">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
