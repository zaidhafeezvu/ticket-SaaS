"use client";

import { Star } from "lucide-react";
import Link from "next/link";

interface SellerRatingProps {
  sellerId: string;
  averageRating: number;
  totalReviews: number;
  showLink?: boolean;
  size?: "sm" | "md" | "lg";
}

export function SellerRating({
  sellerId,
  averageRating,
  totalReviews,
  showLink = true,
  size = "md",
}: SellerRatingProps) {
  const starSize = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }[size];

  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }[size];

  const content = (
    <div className={`flex items-center gap-1 ${textSize}`}>
      <Star className={`${starSize} text-yellow-500 fill-yellow-500`} />
      <span className="font-semibold">
        {totalReviews > 0 ? averageRating.toFixed(1) : "New"}
      </span>
      <span className="text-muted-foreground">
        ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
      </span>
    </div>
  );

  if (showLink) {
    return (
      <Link
        href={`/users/${sellerId}`}
        className="hover:underline inline-block"
      >
        {content}
      </Link>
    );
  }

  return content;
}
