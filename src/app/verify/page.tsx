"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, AlertCircle, Scan } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [qrCode, setQrCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<{
    valid: boolean;
    message?: string;
    alreadyScanned?: boolean;
    scannedAt?: string;
    purchase?: {
      id: string;
      quantity: number;
    };
    ticket?: {
      title: string;
      eventDate: string;
      location?: string;
    };
    buyer?: {
      name: string | null;
      email: string;
    };
  } | null>(null);

  if (isPending) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <div className="text-2xl text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  const handleVerify = async (markAsScanned: boolean = false) => {
    if (!qrCode.trim()) {
      return;
    }

    setVerifying(true);
    setResult(null);

    try {
      const response = await fetch("/api/qrcode/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qrCode: qrCode.trim(),
          markAsScanned,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        if (markAsScanned && data.valid && !data.alreadyScanned) {
          // Clear the input after successful scan
          setQrCode("");
        }
      } else {
        setResult({
          valid: false,
          message: data.error || "Verification failed",
        });
      }
    } catch (error) {
      console.error("Error verifying QR code:", error);
      setResult({
        valid: false,
        message: "An error occurred while verifying the QR code",
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !verifying) {
      handleVerify(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🎫 Ticket Verification</h1>
          <p className="text-muted-foreground">
            Scan or enter QR codes to verify tickets for entry
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="w-5 h-5" />
              Scan QR Code
            </CardTitle>
            <CardDescription>
              Enter the QR code text from the ticket or use a scanner
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qrCode">QR Code</Label>
              <Input
                id="qrCode"
                type="text"
                placeholder="TICKET-xxxxxx-xxxxx-xxxx"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={verifying}
                autoFocus
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleVerify(false)}
                disabled={!qrCode.trim() || verifying}
                variant="outline"
                className="flex-1"
              >
                Check Status
              </Button>
              <Button
                onClick={() => handleVerify(true)}
                disabled={!qrCode.trim() || verifying}
                className="flex-1"
              >
                {verifying ? "Verifying..." : "Verify & Mark as Scanned"}
              </Button>
            </div>

            {result && (
              <div className="mt-6 space-y-4">
                {/* Status Badge */}
                <div className="flex justify-center">
                  {result.valid && !result.alreadyScanned ? (
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 dark:bg-green-950 border-2 border-green-500 rounded-lg">
                      <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                      <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                        Valid Ticket
                      </span>
                    </div>
                  ) : result.alreadyScanned ? (
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-100 dark:bg-yellow-950 border-2 border-yellow-500 rounded-lg">
                      <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                        Already Scanned
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-100 dark:bg-red-950 border-2 border-red-500 rounded-lg">
                      <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                      <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                        Invalid Ticket
                      </span>
                    </div>
                  )}
                </div>

                {/* Message */}
                {result.message && (
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm">{result.message}</p>
                  </div>
                )}

                {/* Ticket Details */}
                {result.ticket && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ticket Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Event</div>
                        <div className="font-semibold">{result.ticket.title}</div>
                      </div>
                      {result.ticket.location && (
                        <div>
                          <div className="text-sm text-muted-foreground">Location</div>
                          <div className="font-medium">{result.ticket.location}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-muted-foreground">Event Date</div>
                        <div className="font-medium">
                          {new Date(result.ticket.eventDate).toLocaleString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      {result.purchase && (
                        <div>
                          <div className="text-sm text-muted-foreground">Quantity</div>
                          <div className="font-medium">{result.purchase.quantity} ticket(s)</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Buyer Details */}
                {result.buyer && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Buyer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Name</div>
                        <div className="font-medium">{result.buyer.name || "N/A"}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Email</div>
                        <div className="font-medium">{result.buyer.email}</div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Scanned Info */}
                {result.alreadyScanned && result.scannedAt && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Scanned:</strong>{" "}
                      {new Date(result.scannedAt).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">How to use:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Use a QR code scanner to read the ticket QR code</li>
            <li>Paste or type the QR code text into the input field above</li>
            <li>Click &quot;Check Status&quot; to verify the ticket without marking it as used</li>
            <li>Click &quot;Verify & Mark as Scanned&quot; to grant entry and mark the ticket as used</li>
            <li>Once marked as scanned, the ticket cannot be used again</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
