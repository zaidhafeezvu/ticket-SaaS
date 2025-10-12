"use client";

import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  purchase?: {
    ticket: {
      id: string;
      title: string;
    };
  };
}

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No reviews yet
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage
                  src={review.reviewer.image || undefined}
                  alt={review.reviewer.name || "Reviewer"}
                />
                <AvatarFallback>
                  {review.reviewer.name?.[0]?.toUpperCase() ||
                    review.reviewer.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold">
                      {review.reviewer.name || "Anonymous"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {review.comment && (
                  <p className="text-muted-foreground mb-2">{review.comment}</p>
                )}

                {review.purchase?.ticket && (
                  <p className="text-sm text-muted-foreground">
                    For:{" "}
                    <span className="font-medium">
                      {review.purchase.ticket.title}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
