import QRCode from "qrcode";
import crypto from "crypto";

/**
 * Generate a unique QR code string for a purchase
 * Format: TICKET-{purchaseId}-{timestamp}-{hash}
 */
export function generateQRCodeData(purchaseId: string, ticketId: string, buyerId: string): string {
  const timestamp = Date.now();
  const data = `${purchaseId}:${ticketId}:${buyerId}:${timestamp}`;
  const hash = crypto.createHash('sha256').update(data).digest('hex').substring(0, 8);
  return `TICKET-${purchaseId}-${timestamp}-${hash}`;
}

/**
 * Generate a QR code image as a data URL
 */
export async function generateQRCodeImage(data: string): Promise<string> {
  try {
    return await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Verify QR code format and extract purchase ID
 */
export function verifyQRCodeFormat(qrCode: string): { valid: boolean; purchaseId?: string } {
  // Expected format: TICKET-{purchaseId}-{timestamp}-{hash}
  const pattern = /^TICKET-([a-zA-Z0-9]+)-(\d+)-([a-f0-9]{8})$/;
  const match = qrCode.match(pattern);
  
  if (!match) {
    return { valid: false };
  }
  
  return {
    valid: true,
    purchaseId: match[1],
  };
}

/**
 * Generate verification data for QR code
 * This creates a JSON payload that can be embedded in the QR code
 */
export function generateQRCodePayload(purchase: {
  id: string;
  ticketId: string;
  buyerId: string;
  quantity: number;
  ticket: {
    title: string;
    eventDate: Date;
    location: string;
  };
}): string {
  const payload = {
    purchaseId: purchase.id,
    ticketId: purchase.ticketId,
    buyerId: purchase.buyerId,
    quantity: purchase.quantity,
    eventTitle: purchase.ticket.title,
    eventDate: purchase.ticket.eventDate.toISOString(),
    location: purchase.ticket.location,
    timestamp: Date.now(),
  };
  
  return JSON.stringify(payload);
}
