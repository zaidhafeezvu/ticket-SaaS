# QR Code Feature - User Guide

## Quick Start Guide

### For Ticket Buyers

#### Step 1: Purchase Tickets
1. Browse available tickets at `/tickets`
2. Select a ticket and choose quantity
3. Complete your purchase (requires authentication)
4. QR code is automatically generated

#### Step 2: Access Your QR Code
1. Go to your Dashboard at `/dashboard`
2. Find your purchase in the "My Purchases" section
3. Click the **"🎫 View QR"** button next to your purchase

#### Step 3: View and Download
The QR code modal will show:
- **Event Details**: Title, date, location
- **QR Code Image**: Large, scannable QR code on white background
- **Scan Status**: Shows if ticket has been used for entry
- **Actions**: 
  - "Hide QR Code" - Close the QR display
  - "Download" - Save QR code as PNG image

#### Step 4: Use at Event
- Show the QR code on your phone screen at the venue entrance
- Event staff will scan it to grant entry
- Once scanned, the ticket cannot be used again

---

### For Event Organizers/Sellers

#### Step 1: Access Verification Page
- Navigate to `/verify` in your browser
- This page is available to all authenticated users
- Best accessed on a tablet or mobile device at the venue entrance

#### Step 2: Scan Tickets
The verification page provides:
- **QR Code Input Field**: Paste or type the QR code text
- **Two Verification Options**:
  1. **"Check Status"** - Verify ticket without marking as used
  2. **"Verify & Mark as Scanned"** - Grant entry and mark as used

#### Step 3: Review Information
After scanning, you'll see:
- **Validity Status**: ✅ Valid / ⚠️ Already Scanned / ❌ Invalid
- **Event Details**: Title, date, location
- **Ticket Details**: Quantity purchased
- **Buyer Information**: Name and email
- **Scan History**: When the ticket was scanned (if already used)

#### Step 4: Grant Entry
- If ticket is valid and not already scanned, click "Verify & Mark as Scanned"
- System immediately marks the ticket as used
- Attempting to scan the same ticket again will show "Already Scanned"

---

## UI Components

### Dashboard Purchases Table
Location: `/dashboard` → "My Purchases" section

New column added: **QR Code**
- Shows "🎫 View QR" button for completed purchases
- Click to open modal with QR code display
- Empty for pending or cancelled purchases

### QR Code Display Modal
Triggered by clicking "View QR" button

Components:
- **Header**: "🎫 Entry Ticket" with scan status badge
- **Event Info**: Date with calendar icon, location with pin icon
- **QR Code**: 300x300px QR code on white background
- **Status Alert**: Green if not scanned, shows scan time if used
- **Action Buttons**: Hide and Download options
- **Helper Text**: "Present this QR code at the venue entrance for scanning"

### Verification Page
Location: `/verify`

Layout:
- **Page Header**: "🎫 Ticket Verification" with description
- **Scan Card**: 
  - QR Code input field (supports paste from scanner)
  - Two action buttons (Check Status / Verify & Scan)
- **Results Display**:
  - Status badge (large, colored)
  - Message text
  - Ticket details card
  - Buyer information card
  - Scan history (if applicable)
- **Instructions**: How-to guide at bottom

---

## QR Code Format

Each QR code contains a unique identifier string:
```
TICKET-{purchaseId}-{timestamp}-{hash}
```

Example:
```
TICKET-cm2abc123xyz-1729012345678-a1b2c3d4
```

Components:
- `TICKET-` prefix for easy identification
- Purchase ID (unique database identifier)
- Timestamp (when QR was generated)
- 8-character hash (security validation)

---

## Security Features

1. **Unique Generation**: Each purchase gets a cryptographically unique QR code
2. **One-Time Use**: Once scanned, tickets cannot be reused
3. **Seller Authorization**: Only the event organizer can mark tickets as scanned
4. **Timestamp Validation**: QR codes include generation timestamps
5. **Database Tracking**: All scans are logged with timestamp
6. **Rate Limiting**: API endpoints are rate-limited to prevent abuse

---

## Troubleshooting

### QR Code Not Showing
**Problem**: "View QR" button doesn't show QR code
**Solutions**:
- Check that purchase status is "completed"
- Ensure you have internet connection
- Try refreshing the page
- Check browser console for errors

### Cannot Download QR Code
**Problem**: Download button doesn't work
**Solutions**:
- Check browser permissions for downloads
- Try right-clicking the QR image and "Save As"
- Use a different browser

### Verification Fails
**Problem**: Valid QR code shows as invalid
**Solutions**:
- Verify you copied the complete QR code text
- Check that you're logged in as the event organizer
- Ensure the QR code format is correct (starts with "TICKET-")
- Contact support if issue persists

### Already Scanned Error
**Problem**: Buyer says ticket wasn't used but shows as scanned
**Solutions**:
- Check the scan timestamp in the verification results
- Verify the buyer is using the correct QR code for this event
- Contact platform administrator for manual verification

---

## Best Practices

### For Buyers
- Download QR code before arriving at the venue (in case of no internet)
- Keep phone charged for displaying QR code
- Arrive early to allow time for entry processing
- Don't share your QR code with others (one-time use only)

### For Organizers
- Test the verification system before the event
- Have backup internet connection at venue
- Train staff on using the verification page
- Have a manual verification process as backup
- Monitor for duplicate scan attempts
- Keep a device charged for scanning throughout event

### For Developers
- Regular database backups (includes QR codes)
- Monitor API rate limits during high-traffic events
- Log verification attempts for security auditing
- Consider offline mode for poor connectivity venues
- Test QR codes on various scanner types

---

## Technical Details

### API Endpoints

**GET /api/purchases/[id]/qrcode**
- Returns QR code image as base64 data URL
- Requires authentication (buyer or seller)
- Rate limit: 30 requests/minute

**POST /api/qrcode/verify**
- Validates QR code and optionally marks as scanned
- Requires authentication
- Rate limit: 20 requests/minute

### Database Fields

```typescript
Purchase {
  qrCode: string | null        // Unique QR code text
  qrCodeScanned: boolean       // Has been scanned
  qrCodeScannedAt: Date | null // When scanned
}
```

### QR Code Generation

Library: `qrcode` (npm package)
- Error correction level: H (30% recovery)
- Output format: PNG data URL
- Size: 300x300 pixels
- Margin: 2 modules
- Colors: Black on white

---

## Support

For issues with the QR code system:
1. Check this guide first
2. Review QR_CODE_IMPLEMENTATION.md for technical details
3. Open a GitHub issue with:
   - Description of the problem
   - Steps to reproduce
   - Screenshots if applicable
   - Browser/device information

---

## Future Enhancements

Planned improvements:
- [ ] Camera-based QR scanning from browser
- [ ] Bulk QR code export for organizers
- [ ] PDF ticket generation with QR codes
- [ ] Email QR codes automatically after purchase
- [ ] SMS QR code delivery option
- [ ] Multi-entry tickets (scan multiple times)
- [ ] QR code customization (colors, logos)
- [ ] Offline verification mode
- [ ] Analytics dashboard for scans
