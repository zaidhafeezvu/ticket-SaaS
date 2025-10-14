# QR Code Ticket Generation Documentation

## Overview

This implementation adds comprehensive QR code generation for ticket entry verification. Each purchase automatically generates a unique QR code that can be used for secure event entry.

## Features

### 1. Automatic QR Code Generation
- Every completed purchase automatically generates a unique QR code
- QR code format: `TICKET-{purchaseId}-{timestamp}-{hash}`
- Secure hash-based generation prevents duplication and tampering

### 2. Buyer Features
- View QR codes in the dashboard purchases section
- Download QR codes as PNG images
- QR codes display ticket and event information
- Visual indication if ticket has been scanned

### 3. Seller/Organizer Features
- Verify tickets at the venue entrance using the `/verify` page
- Scan QR codes to validate tickets
- Mark tickets as scanned to prevent reuse
- View buyer and ticket information during verification
- Prevent duplicate entry with scanned ticket tracking

### 4. Security
- Unique QR codes for each purchase
- One-time use tracking (scanned status)
- Seller-only verification authorization
- Rate limiting on all QR code endpoints

## Database Schema Changes

Added fields to the `Purchase` model:

```prisma
model Purchase {
  // ... existing fields
  qrCode          String?   @unique    // Unique QR code for ticket entry
  qrCodeScanned   Boolean   @default(false)  // Whether QR code has been scanned
  qrCodeScannedAt DateTime?  // When QR code was scanned
}
```

## API Endpoints

### GET `/api/purchases/[id]/qrcode`
Retrieve QR code for a specific purchase.

**Authorization**: Buyer or seller only

**Response**:
```json
{
  "qrCode": "TICKET-xxx-xxx-xxx",
  "qrCodeImage": "data:image/png;base64,...",
  "qrCodeScanned": false,
  "qrCodeScannedAt": null,
  "purchase": { ... },
  "ticket": { ... }
}
```

### POST `/api/qrcode/verify`
Verify a QR code and optionally mark as scanned.

**Authorization**: Required (seller for marking as scanned)

**Request Body**:
```json
{
  "qrCode": "TICKET-xxx-xxx-xxx",
  "markAsScanned": true
}
```

**Response**:
```json
{
  "valid": true,
  "scanned": true,
  "scannedAt": "2025-10-14T...",
  "purchase": { ... },
  "ticket": { ... },
  "buyer": { ... },
  "message": "Ticket successfully verified for entry"
}
```

## Components

### QRCodeDisplay
Reusable component for displaying QR codes.

**Usage**:
```tsx
<QRCodeDisplay
  purchaseId={purchase.id}
  ticketTitle={ticket.title}
  quantity={quantity}
  eventDate={eventDate}
  location={location}
/>
```

### PurchasesTable
Enhanced purchases table with QR code viewing capability.

## Usage

### For Buyers

1. **Purchase Tickets**: Buy tickets as usual
2. **View QR Code**: Go to Dashboard → My Purchases → Click "View QR" button
3. **Download**: Click the "Download" button to save the QR code image
4. **Show at Venue**: Present the QR code at the event entrance

### For Sellers/Organizers

1. **Access Verification**: Navigate to `/verify` page
2. **Scan QR Code**: Use a QR scanner or manually enter the QR code
3. **Check Status**: Click "Check Status" to verify without marking as used
4. **Grant Entry**: Click "Verify & Mark as Scanned" to allow entry
5. **View Details**: See buyer information and ticket details

## Migration

To apply the database changes:

```bash
npx prisma migrate deploy
```

Or for development:

```bash
npx prisma migrate dev
```

## Dependencies

- `qrcode` - QR code generation library
- `@types/qrcode` - TypeScript definitions for qrcode

## Security Considerations

1. **Unique QR Codes**: Each purchase gets a cryptographically unique QR code
2. **One-Time Use**: Tickets can only be scanned once
3. **Authorization**: Only sellers can mark tickets as scanned
4. **Rate Limiting**: All QR code endpoints are rate-limited
5. **Validation**: QR code format is validated before processing

## Future Enhancements

Possible improvements for future versions:

1. **Camera Integration**: Add camera-based QR scanning on mobile devices
2. **Offline Mode**: Cache verification data for offline scanning
3. **Analytics**: Track entry times and attendance statistics
4. **Email Delivery**: Automatically email QR codes to buyers
5. **PDF Tickets**: Generate printable PDF tickets with QR codes
6. **Multi-Entry**: Support for multi-day or multi-entry tickets
7. **Transfer**: Allow buyers to transfer tickets to others
8. **Notification**: Send notifications when tickets are scanned

## Testing

### Manual Testing Steps

1. **Create Purchase**:
   - Sign up/login as a buyer
   - Purchase a ticket
   - Verify QR code is generated in database

2. **View QR Code**:
   - Go to Dashboard
   - Click "View QR" on a purchase
   - Verify QR code displays correctly
   - Download and check image

3. **Verify Ticket**:
   - Login as the seller
   - Navigate to `/verify`
   - Enter the QR code
   - Verify ticket information is correct
   - Mark as scanned
   - Try scanning again (should show already scanned)

## Troubleshooting

### QR Code Not Generated
- Check that the purchase status is "completed"
- Verify the purchase API is calling `generateQRCodeData()`
- Check database for qrCode field value

### Cannot View QR Code
- Verify user is the buyer or seller of the ticket
- Check network requests for errors
- Ensure authentication is working

### Verification Fails
- Confirm QR code format matches expected pattern
- Verify user is authenticated
- Check that user is the seller of the ticket

## Support

For issues or questions about QR code functionality:
1. Check the API endpoint responses for error messages
2. Review server logs for detailed error information
3. Verify database schema is up to date
4. Ensure all dependencies are installed
