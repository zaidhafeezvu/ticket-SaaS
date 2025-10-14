"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QRCodeDisplay } from "@/components/qrcode-display";
import { ReviewButton } from "@/components/review-button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Purchase {
  id: string;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  ticket: {
    id: string;
    title: string;
    location: string;
    eventDate: string;
    seller?: {
      name: string | null;
      email: string;
    };
  };
  review?: {
    id: string;
  } | null;
}

interface PurchasesTableProps {
  purchases: Purchase[];
}

export function PurchasesTable({ purchases }: PurchasesTableProps) {
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);

  return (
    <>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead>QR Code</TableHead>
              <TableHead>Review</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.map((purchase) => {
              if (!purchase.ticket) return null;
              return (
                <TableRow key={purchase.id}>
                  <TableCell>
                    <Link
                      href={`/tickets/${purchase.ticket.id}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {purchase.ticket.title}
                    </Link>
                    <div className="text-sm text-muted-foreground">{purchase.ticket.location}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {new Date(purchase.ticket.eventDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {purchase.quantity}
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-semibold">
                    ${purchase.totalPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge variant={purchase.status === 'completed' ? 'default' : 'secondary'}>
                      {purchase.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {new Date(purchase.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {purchase.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPurchase(purchase)}
                      >
                        🎫 View QR
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {purchase.status === 'completed' && (
                      <ReviewButton
                        purchaseId={purchase.id}
                        ticketTitle={purchase.ticket.title}
                        sellerName={purchase.ticket.seller?.name || purchase.ticket.seller?.email || "Seller"}
                        hasReview={!!purchase.review}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* QR Code Dialog */}
      <Dialog open={!!selectedPurchase} onOpenChange={() => setSelectedPurchase(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ticket QR Code</DialogTitle>
          </DialogHeader>
          {selectedPurchase && (
            <QRCodeDisplay
              purchaseId={selectedPurchase.id}
              ticketTitle={selectedPurchase.ticket.title}
              quantity={selectedPurchase.quantity}
              eventDate={new Date(selectedPurchase.ticket.eventDate)}
              location={selectedPurchase.ticket.location}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
