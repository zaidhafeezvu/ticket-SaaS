"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface PurchaseFormProps {
  ticketId: string;
  available: number;
  price: number;
}

export function PurchaseForm({ ticketId, available, price }: PurchaseFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = async () => {
    if (!session) {
      router.push("/auth/login");
      return;
    }

    if (purchaseQuantity > available) {
      toast.error("Invalid quantity. Please check the available tickets.");
      return;
    }

    setPurchasing(true);
    try {
      const response = await fetch("/api/purchases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticketId,
          quantity: purchaseQuantity,
        }),
      });

      if (response.ok) {
        toast.success("Purchase successful! Check your dashboard for details.");
        router.push("/dashboard");
        router.refresh();
      } else {
        const error = await response.json();
        toast.error(error.error || "Purchase failed. Please try again.");
      }
    } catch (error) {
      console.error("Error purchasing ticket:", error);
      toast.error("An error occurred while processing your purchase");
    } finally {
      setPurchasing(false);
    }
  };

  const totalPrice = price * purchaseQuantity;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        {available > 0 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                type="number"
                id="quantity"
                min="1"
                max={available}
                value={purchaseQuantity}
                onChange={(e) => setPurchaseQuantity(parseInt(e.target.value) || 1)}
              />
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-primary text-2xl">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handlePurchase}
              disabled={purchasing || purchaseQuantity > available}
              className="w-full"
              size="lg"
            >
              {purchasing ? "Processing..." : "Buy Now"}
            </Button>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-destructive font-semibold text-lg">Sold Out</p>
            <p className="text-muted-foreground mt-2">This event is currently sold out.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
