# Email Notifications

This document describes the email notification system for ticket purchases and sales.

## Overview

The TicketSaaS platform automatically sends email notifications for the following events:
- **Purchase Confirmation**: Sent to buyers when they successfully purchase tickets
- **Sale Notification**: Sent to sellers when their tickets are sold

## Configuration

Email notifications are sent using [Resend](https://resend.com/), a modern email API service.

### Environment Variables

Add the following environment variables to your `.env` file:

```env
# Email Configuration (Required for email notifications)
RESEND_API_KEY="re_xxxxxxxxxxxxx"  # Get from https://resend.com/api-keys
EMAIL_FROM="noreply@yourdomain.com"  # Or use "onboarding@resend.dev" for testing
```

### Getting a Resend API Key

1. Sign up for a free account at [Resend](https://resend.com/)
2. Navigate to [API Keys](https://resend.com/api-keys)
3. Create a new API key
4. Copy the key and add it to your `.env` file

## Email Types

### 1. Purchase Confirmation Email

**Sent to:** Buyer  
**Triggered when:** A purchase is successfully completed  
**Subject:** `Purchase Confirmation - {Event Title}`

**Contains:**
- Event title
- Quantity of tickets purchased
- Total price paid
- Event date and time
- Event location
- Instructions to view QR codes in dashboard

### 2. Sale Notification Email

**Sent to:** Seller  
**Triggered when:** Their ticket listing is purchased  
**Subject:** `Ticket Sale Notification - {Event Title}`

**Contains:**
- Event title
- Quantity of tickets sold
- Sale amount earned
- Buyer name
- Link to view sales in dashboard

## Implementation Details

### Email Functions

The email notification functions are located in `src/lib/email.ts`:

```typescript
// Send purchase confirmation to buyer
sendPurchaseConfirmationEmail(
  buyerEmail: string,
  buyerName: string,
  ticketTitle: string,
  quantity: number,
  totalPrice: number,
  eventDate: Date,
  location: string
)

// Send sale notification to seller
sendSaleNotificationEmail(
  sellerEmail: string,
  sellerName: string,
  ticketTitle: string,
  quantity: number,
  totalPrice: number,
  buyerName: string
)
```

### Integration

Email notifications are automatically sent when a purchase is created via the API endpoint:

**Endpoint:** `POST /api/purchases`

The notifications are sent asynchronously to avoid blocking the purchase response. If email sending fails, the error is logged but the purchase still completes successfully.

### Error Handling

- If `RESEND_API_KEY` is not set, a warning is logged and emails are skipped
- Email sending happens asynchronously after the purchase transaction completes
- Email failures are logged but don't affect the purchase process
- Users will still receive their tickets even if email delivery fails

## Email Templates

All email templates feature:
- Responsive HTML design
- Mobile-friendly layout
- Branded TicketSaaS header with gradient design
- Clear call-to-action sections
- Professional formatting
- Footer with copyright information

## Testing Email Notifications

### Local Development

For local testing, you have two options:

1. **Use Resend's test mode:**
   - Sign up for a free Resend account
   - Use the test API key
   - Emails will be visible in your Resend dashboard

2. **Skip email sending:**
   - Don't set `RESEND_API_KEY` in `.env`
   - Emails will be skipped with a warning logged to console
   - Purchase functionality will still work normally

### Testing the Purchase Flow

1. Create a user account and verify email
2. Create a ticket listing
3. Log in with a different user account
4. Purchase the ticket
5. Check both email inboxes for:
   - Buyer: Purchase confirmation email
   - Seller: Sale notification email

## Production Deployment

For production:

1. **Domain Configuration:**
   - Use your own domain for `EMAIL_FROM` (e.g., `noreply@yourdomain.com`)
   - Verify your domain in Resend settings

2. **API Key:**
   - Use a production API key from Resend
   - Store it securely in environment variables

3. **Email Volume:**
   - Free tier: 3,000 emails/month
   - Paid plans available for higher volume

## Troubleshooting

### Emails Not Sending

1. **Check environment variables:**
   ```bash
   # Verify RESEND_API_KEY is set
   echo $RESEND_API_KEY
   ```

2. **Check logs:**
   - Look for error messages in console/server logs
   - Check Resend dashboard for delivery status

3. **Verify API key:**
   - Ensure the API key is valid and not expired
   - Check your Resend account status

### Email Delivery Issues

1. **Check spam folder:** Emails might be filtered
2. **Verify recipient email:** Ensure email addresses are valid
3. **Domain verification:** In production, verify your sending domain
4. **Resend dashboard:** Check delivery logs in Resend

## Future Enhancements

Potential improvements for the email notification system:

- [ ] Add email preferences in user settings
- [ ] Send QR codes as email attachments
- [ ] Event reminder emails before event date
- [ ] Ticket transfer notifications
- [ ] Review request emails after event completion
- [ ] Weekly/monthly sales summary for sellers
- [ ] Support for multiple languages/locales
- [ ] Rich text email editor for customization
