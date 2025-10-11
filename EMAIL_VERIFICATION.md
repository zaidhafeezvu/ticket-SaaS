# Email Verification Guide

## Overview

TicketSaaS implements comprehensive email verification using Better Auth and Resend email service. This ensures that users have valid email addresses and helps prevent spam accounts.

## Features

- ✅ Automatic verification email on signup
- ✅ Beautiful HTML email templates with ticket-themed branding
- ✅ Email verification required for protected actions
- ✅ Resend verification email functionality
- ✅ User-friendly verification pages
- ✅ Rate limiting on verification endpoints
- ✅ 24-hour token expiration
- ✅ Graceful error handling

## Setup

### 1. Get Resend API Key

1. Sign up for a free account at [Resend](https://resend.com)
2. Navigate to API Keys section
3. Create a new API key
4. Copy the API key for use in environment variables

### 2. Configure Email Domain (Production)

For production use with your own domain:

1. Add your domain in Resend dashboard
2. Add the required DNS records (SPF, DKIM, DMARC)
3. Wait for domain verification (usually a few minutes)
4. Update `EMAIL_FROM` to use your domain (e.g., `noreply@yourdomain.com`)

For development, you can use `onboarding@resend.dev` as the sender.

### 3. Environment Variables

Add these to your `.env` file:

```env
# Email Configuration (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxxx"
EMAIL_FROM="noreply@yourdomain.com"  # or "onboarding@resend.dev" for development
```

### 4. Enable Email Verification

Email verification is already enabled in `src/lib/auth.ts`:

```typescript
emailAndPassword: {
  enabled: true,
  requireEmailVerification: true,
  sendVerificationEmail: async ({ user, url }) => {
    await sendVerificationEmail(user.email, url, user.name || "");
  },
}
```

## User Flow

### New User Signup

1. User fills out signup form at `/auth/signup`
2. Account is created with `emailVerified: false`
3. Verification email is sent automatically
4. User sees success message with instructions
5. User clicks verification link in email
6. Email is marked as verified in database
7. User is redirected to login page

### Attempting Protected Actions

1. Unverified user tries to access protected feature (Dashboard, Create Ticket, Purchase)
2. System checks email verification status
3. If not verified, user is redirected to `/auth/email-verification-required`
4. User can resend verification email from this page
5. User can also sign out and try different account

### Email Verification Flow

1. User receives email with verification link
2. Link contains unique token: `/auth/verify-email?token=xxx`
3. Token is validated against database
4. If valid, user's `emailVerified` field is set to `true`
5. User sees success message and is redirected to login

## Protected Routes & APIs

### Pages (Server Components)

Protected pages check verification status:

- `/dashboard` - User dashboard
- All pages use `getSession()` and check `emailVerified` field

### Client Components

Protected client components:

- `/tickets/create` - Creates ticket listing
- Checks verification via API endpoint on mount

### API Routes

Protected API endpoints verify email before allowing actions:

- `POST /api/tickets` - Create ticket
- `POST /api/purchases` - Purchase ticket
- Both return 403 error if email not verified

## Email Template

The verification email includes:

- Professional HTML design
- Responsive layout
- TicketSaaS branding with gradient theme
- Clear call-to-action button
- Plain text link fallback
- Security note about ignoring if not requested
- Expiration notice (24 hours)

## API Endpoints

### Verify Email
**POST** `/api/auth/verify-email`

Verifies email using token from email link.

**Request:**
```json
{
  "token": "verification-token-from-email"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Response (Error):**
```json
{
  "error": "Invalid or expired verification token"
}
```

---

### Resend Verification Email
**POST** `/api/auth/resend-verification`

Sends a new verification email. Rate limited to 2 requests per minute.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Verification email sent. Please check your inbox."
}
```

**Response (Error):**
```json
{
  "error": "Email is already verified"
}
```

---

### Check Verification Status
**POST** `/api/auth/check-verification`

Checks if current user's email is verified.

**Response:**
```json
{
  "verified": true
}
```

## Database Schema

### User Model
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified Boolean   @default(false)  // Email verification status
  name          String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### Verification Model
```prisma
model Verification {
  id         String   @id @default(cuid())
  identifier String   // Email address
  value      String   // Verification token
  expiresAt  DateTime // Token expiration (24 hours)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  @@unique([identifier, value])
}
```

## Security Features

### Token Security
- Tokens are cryptographically random (32 bytes)
- Tokens expire after 24 hours
- Tokens are single-use (deleted after verification)
- Unique constraint prevents duplicate tokens

### Rate Limiting
- Resend verification: 2 requests per minute per IP
- Prevents email spam and abuse
- Configured in `src/lib/rate-limit.ts`

### Privacy
- Resend endpoint doesn't reveal if email exists
- Returns success regardless to prevent email enumeration
- Only actual users receive verification emails

## Testing

### Demo Account

The seeded demo account is already verified:
- **Email:** demo@ticketsaas.com
- **Password:** demo1234
- **Verified:** ✅ Yes

### Manual Testing

1. **Sign up with new account:**
   ```bash
   # Navigate to /auth/signup
   # Fill form with test email
   # Check email inbox (or Resend logs in dev)
   ```

2. **Verify email link works:**
   ```bash
   # Click link in email
   # Should redirect to /auth/verify-email?token=xxx
   # Should show success and redirect to login
   ```

3. **Test unverified user protection:**
   ```bash
   # Sign in with unverified account
   # Try to access /dashboard
   # Should redirect to /auth/email-verification-required
   ```

4. **Test resend functionality:**
   ```bash
   # From verification required page
   # Click "Resend Verification Email"
   # Check for new email
   ```

## Troubleshooting

### Email not received
- Check spam/junk folder
- Verify RESEND_API_KEY is set correctly
- Check Resend dashboard logs for delivery status
- Ensure EMAIL_FROM is a verified domain (or use resend.dev for testing)

### "Invalid or expired token" error
- Tokens expire after 24 hours
- Each token can only be used once
- Request new verification email
- Check database for verification record

### "Email verification required" on login
- User hasn't clicked verification link yet
- Click "Resend Verification Email" on error message
- Check email inbox and spam folder

### Verification email not sending
- Check server console for errors
- Verify Resend API key is correct
- Check Resend dashboard for API errors
- Ensure `sendVerificationEmail` function is called

### Demo account issues
- Demo account (demo@ticketsaas.com) is pre-verified
- If having issues, reseed database: `bunx prisma db seed`
- Check user's emailVerified field in database

## Development

### Email Preview in Development

During development, you can:

1. Use Resend test mode (logs emails without sending)
2. Check Resend dashboard for email content preview
3. Use your own email for testing
4. Check server console logs for verification URLs

### Customizing Email Template

Edit `src/lib/email.ts` to customize:

- HTML design and styling
- Email subject line
- Sender name
- Brand colors and logos
- Email copy text

### Testing Without Real Emails

For automated testing:

1. Mock the Resend client in tests
2. Use test API key from Resend
3. Manually mark users as verified in test database
4. Skip verification check in test environment

## Production Checklist

Before deploying to production:

- [ ] Set up custom domain in Resend
- [ ] Configure DNS records (SPF, DKIM, DMARC)
- [ ] Use production Resend API key
- [ ] Set EMAIL_FROM to your domain
- [ ] Test email delivery end-to-end
- [ ] Monitor Resend dashboard for delivery issues
- [ ] Set up email delivery monitoring/alerts
- [ ] Consider email templates A/B testing
- [ ] Review rate limiting settings

## Cost Considerations

### Resend Pricing

- **Free tier:** 100 emails/day, 3,000 emails/month
- **Pro tier:** $20/month for 50,000 emails/month
- **Scale tier:** Custom pricing for higher volume

For most applications, the free tier is sufficient for testing and small-scale deployments.

## Best Practices

1. **Always verify emails in production** - Prevents spam and fake accounts
2. **Use professional email templates** - Increases open rates and trust
3. **Monitor email delivery rates** - Catch issues early
4. **Provide clear instructions** - Help users understand verification process
5. **Allow easy resending** - Don't frustrate users with expired tokens
6. **Log verification events** - Track success rates and issues
7. **Test across email clients** - Ensure templates render correctly
8. **Keep tokens secure** - Never expose tokens in logs or URLs unnecessarily

## Additional Resources

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [Email Authentication (SPF, DKIM, DMARC)](https://www.cloudflare.com/learning/email-security/)
- [HTML Email Best Practices](https://www.campaignmonitor.com/dev-resources/guides/email-development-guide/)

## Support

For issues or questions about email verification:

1. Check this documentation first
2. Review server console logs for errors
3. Check Resend dashboard for delivery status
4. Open an issue in the repository
5. Contact support with relevant error messages

---

**Note:** Email verification is required for production deployments to ensure user authenticity and prevent abuse.
