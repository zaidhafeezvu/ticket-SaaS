# Copilot Instructions for Ticket Marketplace SaaS

## Project Overview

This is a full-featured SaaS platform for buying and selling event tickets, built as a modern web application. The platform enables users to:
- Browse and purchase tickets for concerts, sports events, theater shows, and festivals
- List their own tickets for sale with detailed information
- Manage their ticket inventory and purchase history through a comprehensive dashboard
- Authenticate securely using email/password authentication

The application prioritizes user experience with responsive design, real-time availability tracking, and secure transaction handling.

## Tech Stack

### Core Framework
- **Next.js 15.5.4**: React framework with App Router for server-side rendering and routing
- **React 19.1.0**: UI library for building component-based interfaces
- **TypeScript 5**: Strongly typed JavaScript for better developer experience

### Authentication & Security
- **Better Auth 1.3.26**: Modern authentication library with email/password support
- **bcryptjs**: Secure password hashing
- Built-in session management with token-based authentication
- Rate limiting on all API routes (see RATE_LIMITING.md)

### Database & ORM
- **PostgreSQL**: Primary database (configurable to other databases)
- **Prisma 6.16.3**: Type-safe ORM for database operations
- Migrations managed through Prisma Migrate

### Styling & UI
- **Tailwind CSS 4**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives for dropdowns, labels, selects
- **next-themes**: Dark mode support
- **lucide-react**: Icon library
- **shadcn/ui components**: Pre-built, customizable UI components

### Package Manager
- **bun** or **npm**: Primary package managers (bun preferred for speed)

## Project Structure

```
ticket-SaaS/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes (REST endpoints)
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── tickets/       # Ticket CRUD operations
│   │   │   └── purchases/     # Purchase management
│   │   ├── auth/              # Authentication pages (login, signup)
│   │   ├── dashboard/         # User dashboard
│   │   ├── tickets/           # Ticket browsing and creation
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── navbar.tsx        # Main navigation
│   │   ├── theme-toggle.tsx  # Dark mode toggle
│   │   └── theme-provider.tsx # Theme context provider
│   ├── lib/                   # Utility libraries
│   │   ├── auth.ts           # Better Auth configuration
│   │   ├── auth-client.ts    # Client-side auth utilities
│   │   ├── session.ts        # Server-side session management
│   │   ├── prisma.ts         # Prisma client instance
│   │   ├── rate-limit.ts     # Rate limiting implementation
│   │   └── utils.ts          # General utilities
│   └── types/                 # TypeScript type definitions
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── seed.ts               # Database seeding script
│   └── migrations/           # Database migrations
├── public/                    # Static assets
├── .github/                   # GitHub configuration
└── [config files]            # Various config files
```

## Database Schema

### Key Models
- **User**: Authentication and user profiles
- **Session**: User sessions for auth
- **Account**: OAuth accounts and password storage
- **Ticket**: Event tickets for sale
- **Purchase**: Purchase transactions
- **Verification**: Email verification tokens

See `prisma/schema.prisma` for complete schema details.

## Coding Guidelines

### TypeScript
- Use TypeScript for all new files
- Define proper types/interfaces for all props and function parameters
- Avoid using `any` type; prefer `unknown` if type is truly dynamic
- Use type inference where appropriate to reduce verbosity

### React & Next.js
- Use Server Components by default; add `"use client"` only when needed
- Follow Next.js App Router conventions
- Use async/await for server components that fetch data
- Keep components focused and single-purpose
- Use descriptive component names in PascalCase

### File Organization
- Place reusable components in `src/components/`
- Place UI primitives in `src/components/ui/`
- Place utility functions in `src/lib/`
- Place API routes in `src/app/api/`
- Co-locate page-specific components with their pages when appropriate

### Styling
- Use Tailwind CSS utility classes
- Follow existing color scheme using CSS variables (primary, secondary, etc.)
- Use the `cn()` utility from `src/lib/utils.ts` for conditional classes
- Support dark mode using `dark:` prefix
- Use emoji icons (🎫, 🎵, ⚽, etc.) for visual elements

### API Routes
- Always validate user authentication for protected endpoints
- Use `getSession()` from `src/lib/session.ts` for auth checks
- Apply rate limiting middleware to prevent abuse
- Return proper HTTP status codes (200, 201, 400, 401, 500, etc.)
- Include error messages in response bodies
- Use Prisma client from `src/lib/prisma.ts` for database operations

### Database Operations
- Always use Prisma for database queries
- Import prisma client: `import { prisma } from '@/lib/prisma'`
- Use transactions for operations that modify multiple records
- Include proper error handling for database operations
- Add appropriate indexes for frequently queried fields (already defined in schema)

### Authentication
- Use Better Auth for all authentication needs
- Never store passwords in plain text (bcrypt hashing handled by Better Auth)
- Session tokens are automatically managed
- Check authentication status server-side for protected routes
- Use `getSession()` for server components
- Use `useSession()` hook from `@/lib/auth-client` for client components

### Security Practices
- Validate all user inputs server-side
- Sanitize data before database operations
- Use environment variables for secrets (never commit secrets)
- Implement rate limiting on public endpoints
- Use HTTPS in production
- Follow OWASP security guidelines

## Development Commands

```bash
# Install dependencies
npm install
# or
bun install

# Generate Prisma client (required after schema changes)
bunx prisma generate

# Run database migrations
bunx prisma migrate dev

# Seed database with sample data
bunx prisma db seed

# Start development server (http://localhost:3000)
npm run dev
# or
bun run dev

# Build for production
npm run build
# or
bun run build

# Start production server
npm run start
# or
bun run start

# Run linter
npm run lint
# or
bun run lint

# Open Prisma Studio (database GUI)
bunx prisma studio
```

## Environment Variables

Required environment variables (see `.env.example`):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ticketsaas"
BETTER_AUTH_SECRET="your-super-secret-key-change-this-in-production"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
```

**Production Notes:**
- Generate strong `BETTER_AUTH_SECRET` using: `openssl rand -base64 32`
- Set `BETTER_AUTH_URL` to your production domain
- Leave `NEXT_PUBLIC_BETTER_AUTH_URL` unset in production (uses relative URLs)
- Use `NODE_ENV=production`

## Key Features to Understand

### Authentication Flow
1. Users sign up at `/auth/signup` with email/password
2. Better Auth handles password hashing and user creation
3. Sessions are created automatically on successful login
4. Protected routes check for valid session using `getSession()`
5. Client-side auth state available via `useSession()` hook

### Protected Routes
- `/dashboard` - User's tickets and purchases
- `/tickets/create` - Create new ticket listing
- Purchase actions on ticket detail pages

### Rate Limiting
- Configured in `src/lib/rate-limit.ts`
- Applied to all API routes
- In-memory storage (consider Redis for production)
- See RATE_LIMITING.md for details

### Demo Account
After running `bunx prisma db seed`:
- **Email:** demo@ticketsaas.com
- **Password:** demo1234

## Common Patterns

### Fetching Data in Server Components
```typescript
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const tickets = await prisma.ticket.findMany({
    include: { seller: true }
  });
  
  return <div>{/* render tickets */}</div>;
}
```

### Protected API Route
```typescript
import { getSession } from "@/lib/session";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  // Process authenticated request
}
```

### Client-Side Auth Check
```typescript
"use client";

import { useSession } from "@/lib/auth-client";

export function MyComponent() {
  const { data: session, isPending } = useSession();
  
  if (isPending) return <div>Loading...</div>;
  if (!session) return <div>Please sign in</div>;
  
  return <div>Hello {session.user.name}</div>;
}
```

## Testing & Quality

- Run linter before committing: `npm run lint`
- Test authentication flows manually (signup, login, logout)
- Verify protected routes require authentication
- Check responsive design on mobile devices
- Test dark mode toggle functionality
- Verify database operations in Prisma Studio

## Documentation

Key documentation files:
- **README.md** - Project overview and quick start
- **SETUP.md** - Detailed setup instructions
- **AUTHENTICATION.md** - Authentication implementation details
- **RATE_LIMITING.md** - Rate limiting configuration
- **IMPLEMENTATION_SUMMARY.md** - Better Auth implementation notes

## Production Considerations

Before deploying:
1. Set all environment variables in production environment
2. Use PostgreSQL or MySQL (not SQLite) for production database
3. Enable HTTPS only
4. Run database migrations: `bunx prisma migrate deploy`
5. Set up proper error monitoring
6. Consider implementing:
   - Email verification
   - Two-factor authentication
   - OAuth providers (Google, GitHub)
   - Password reset flow
   - Proper logging and monitoring

## Support

For issues or questions:
1. Check the documentation files listed above
2. Review code comments in implementation files
3. Check GitHub issues for similar problems
4. Open a new issue with detailed information

## License

MIT License - Open source and free to use
