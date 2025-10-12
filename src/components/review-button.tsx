"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ReviewForm } from "@/components/review-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Star } from "lucide-react";

interface ReviewButtonProps {
  purchaseId: string;
  ticketTitle: string;
  sellerName: string;
  hasReview: boolean;
}

export function ReviewButton({
  purchaseId,
  ticketTitle,
  sellerName,
  hasReview,
}: ReviewButtonProps) {
  const [open, setOpen] = useState(false);

  if (hasReview) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
        Reviewed
      </Button>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Star className="w-4 h-4 mr-1" />
          Leave Review
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Leave a Review</SheetTitle>
          <SheetDescription>
            Share your experience with this purchase
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <ReviewForm
            purchaseId={purchaseId}
            ticketTitle={ticketTitle}
            sellerName={sellerName}
            onSuccess={() => {
              setOpen(false);
              window.location.reload();
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
