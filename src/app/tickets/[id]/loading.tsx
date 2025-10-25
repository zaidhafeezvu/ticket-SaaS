import { Navbar } from "@/components/navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function TicketDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ticket Image Skeleton */}
          <Skeleton className="h-96 w-full rounded-lg" />

          {/* Ticket Details Skeleton */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3 mt-2" />
            </div>

            <Card>
              <CardContent className="pt-6 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="h-8 w-8 rounded mr-3" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
