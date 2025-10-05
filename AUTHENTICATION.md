# Authentication Guide

This application uses [Better Auth](https://www.better-auth.com/) for comprehensive user authentication.

## Features

- ✅ Email/Password authentication
- ✅ Secure password hashing with bcrypt
- ✅ Session management with automatic refresh
- ✅ Protected routes (Dashboard, Create Ticket, Purchase)
- ✅ User-specific data (own tickets, purchases)

## Setup

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
BETTER_AUTH_SECRET="your-super-secret-key-change-this-in-production"
BETTER_AUTH_URL="http://localhost:3000"
```

**Important:** Change `BETTER_AUTH_SECRET` to a strong, random string in production. You can generate one with:
```bash
openssl rand -base64 32
```

### 2. Database Setup

Run the database migrations:

```bash
# Apply migrations
npx prisma migrate deploy

# Seed with sample data (optional)
npx prisma db seed
```

### 3. Demo Account

After seeding, you can login with:
- **Email:** demo@ticketsaas.com
- **Password:** demo1234

## Usage

### Sign Up

Navigate to `/auth/signup` or click "Sign Up" in the navigation bar. Create an account with:
- Name
- Email address
- Password (minimum 8 characters)

### Sign In

Navigate to `/auth/login` or click "Sign In" in the navigation bar. Enter your email and password.

### Protected Routes

The following routes require authentication:
- `/dashboard` - View your tickets and purchases
- `/tickets/create` - List new tickets for sale
- Purchase functionality on ticket detail pages

## API Routes

### Authentication Endpoints

All authentication endpoints are handled by Better Auth at `/api/auth/[...all]`:

- `POST /api/auth/sign-up` - Create new account
- `POST /api/auth/sign-in` - Sign in
- `POST /api/auth/sign-out` - Sign out
- `GET /api/auth/session` - Get current session

### Protected API Routes

The following API routes require authentication:

- `POST /api/tickets` - Create a ticket (seller is automatically set to current user)
- `POST /api/purchases` - Purchase tickets (buyer is automatically set to current user)

## Database Schema

### User Table
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified Boolean   @default(false)
  name          String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### Session Table
```prisma
model Session {
  id        String   @id @default(cuid())
  userId    String
  expiresAt DateTime
  token     String   @unique
  ipAddress String?
  userAgent String?
}
```

### Account Table
```prisma
model Account {
  id           String    @id @default(cuid())
  userId       String
  accountId    String
  providerId   String
  password     String?
  accessToken  String?
  refreshToken String?
  idToken      String?
  expiresAt    DateTime?
}
```

## Security Features

### Password Security
- Passwords are hashed using bcrypt with a cost factor of 10
- Minimum password length of 8 characters
- Passwords are never stored in plain text

### Session Security
- Sessions expire after 7 days of inactivity
- Session tokens are securely generated
- Automatic session refresh every 24 hours
- Sessions are invalidated on sign out

### API Security
- All protected routes check for valid session
- User data is isolated (users can only access their own tickets and purchases)
- CSRF protection via Better Auth
- Rate limiting recommended for production

## Client-Side Usage

### Check Authentication Status

```tsx
import { useSession } from "@/lib/auth-client";

function MyComponent() {
  const { data: session, isPending } = useSession();
  
  if (isPending) {
    return <div>Loading...</div>;
  }
  
  if (!session) {
    return <div>Please sign in</div>;
  }
  
  return <div>Hello, {session.user.email}!</div>;
}
```

### Sign Out

```tsx
import { authClient } from "@/lib/auth-client";

async function handleSignOut() {
  await authClient.signOut();
  router.push("/");
  router.refresh();
}
```

## Server-Side Usage

### Get Current Session

```tsx
import { getSession } from "@/lib/session";

export default async function ServerComponent() {
  const session = await getSession();
  
  if (!session) {
    redirect("/auth/login");
  }
  
  return <div>Hello, {session.user.email}!</div>;
}
```

### Require Authentication

```tsx
import { requireAuth } from "@/lib/session";

export async function POST(request: NextRequest) {
  const session = await requireAuth(); // Throws error if not authenticated
  
  // Use session.user.id for user-specific operations
}
```

## Production Considerations

1. **Secret Key:** Use a strong, random secret key
2. **HTTPS:** Always use HTTPS in production
3. **Email Verification:** Consider enabling email verification for production
4. **Rate Limiting:** Implement rate limiting on auth endpoints
5. **Password Policy:** Enforce stronger password requirements
6. **Session Timeout:** Adjust session expiration based on your security needs
7. **Multi-Factor Authentication:** Consider adding 2FA for additional security

## Troubleshooting

### "Unauthorized" errors
- Ensure you're signed in
- Check that session hasn't expired
- Verify BETTER_AUTH_SECRET is set correctly

### Cannot create tickets/purchases
- Verify you're authenticated
- Check API route is receiving session correctly
- Review browser console for errors

### Session not persisting
- Check that cookies are enabled
- Verify BETTER_AUTH_URL matches your domain
- Ensure database is accessible

## Additional Resources

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Authentication Patterns](https://nextjs.org/docs/app/building-your-application/authentication)
