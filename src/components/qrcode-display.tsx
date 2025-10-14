"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";

interface QRCodeDisplayProps {
  purchaseId: string;
  ticketTitle: string;
  quantity: number;
  eventDate: Date;
  location: string;
  compact?: boolean;
}

export function QRCodeDisplay({
  purchaseId,
  ticketTitle,
  quantity,
  eventDate,
  location,
  compact = false,
}: QRCodeDisplayProps) {
  const [qrCodeData, setQRCodeData] = useState<{
    qrCode: string;
    qrCodeImage: string;
    qrCodeScanned: boolean;
    qrCodeScannedAt: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);

  const fetchQRCode = async () => {
    if (qrCodeData) {
      setShowQR(!showQR);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/purchases/${purchaseId}/qrcode`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch QR code");
      }

      const data = await response.json();
      setQRCodeData({
        qrCode: data.qrCode,
        qrCodeImage: data.qrCodeImage,
        qrCodeScanned: data.qrCodeScanned,
        qrCodeScannedAt: data.qrCodeScannedAt,
      });
      setShowQR(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load QR code");
      console.error("Error fetching QR code:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeData) return;

    const link = document.createElement("a");
    link.href = qrCodeData.qrCodeImage;
    link.download = `ticket-${purchaseId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (compact) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={fetchQRCode}
        disabled={loading}
      >
        {loading ? "Loading..." : showQR ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        <span className="ml-2">{showQR ? "Hide QR" : "Show QR"}</span>
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎫 Entry Ticket
          {qrCodeData?.qrCodeScanned && (
            <Badge variant="secondary" className="ml-auto">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Scanned
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {ticketTitle} • {quantity} ticket{quantity > 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <span className="text-muted-foreground mr-2">📅</span>
            <span>{new Date(eventDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-muted-foreground mr-2">📍</span>
            <span>{location}</span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
              <XCircle className="w-4 h-4" />
              {error}
            </div>
          </div>
        )}

        {!showQR && !qrCodeData && (
          <Button onClick={fetchQRCode} disabled={loading} className="w-full">
            {loading ? "Loading QR Code..." : "Show QR Code for Entry"}
          </Button>
        )}

        {showQR && qrCodeData && (
          <div className="space-y-4">
            <div className="flex justify-center p-4 bg-white rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeData.qrCodeImage}
                alt="Ticket QR Code"
                className="w-64 h-64"
              />
            </div>

            {qrCodeData.qrCodeScanned && qrCodeData.qrCodeScannedAt && (
              <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  Scanned on {new Date(qrCodeData.qrCodeScannedAt).toLocaleString()}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={() => setShowQR(false)} variant="outline" className="flex-1">
                <EyeOff className="w-4 h-4 mr-2" />
                Hide QR Code
              </Button>
              <Button onClick={downloadQRCode} variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              Present this QR code at the venue entrance for scanning
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
