# Setup Guide for Ticket Marketplace SaaS

This guide will help you set up the Ticket Marketplace SaaS application.

## Prerequisites

- Node.js 18 or higher
- bun (package manager)
- Internet connection (for initial Prisma setup)

## Step-by-Step Setup

### 1. Clone and Install

```bash
git clone https://github.com/zaidhafeezvu/ticket-SaaS.git
cd ticket-SaaS
bun install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/ticketsaas"
BETTER_AUTH_SECRET="your-super-secret-key-change-this-in-production"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
# Optional: GitHub OAuth (get from https://github.com/settings/developers)
GITHUB_CLIENT_ID="your-github-oauth-client-id"
GITHUB_CLIENT_SECRET="your-github-oauth-client-secret"
```

**Note:** For authentication to work, you need to set up Better Auth environment variables. For GitHub OAuth setup instructions, see [AUTHENTICATION.md](./AUTHENTICATION.md) for details.

### 3. Generate Prisma Client

This step requires internet access to download Prisma engines:

```bash
bunx prisma generate
```

If this step fails due to network restrictions, you can:
- Try again on a different network
- Use a proxy or VPN
- Set `PRISMA_ENGINES_MIRROR` environment variable

### 4. Initialize the Database

```bash
bunx prisma migrate dev --name init
```

This will:
- Create the PostgreSQL database tables
- Apply the schema migrations
- Create tables for Users, Tickets, and Purchases

### 5. (Optional) Seed Sample Data

You can manually create sample data through the UI or use Prisma Studio:

```bash
bunx prisma studio
```

This opens a browser interface where you can:
- Create users
- Add sample tickets
- View all data

### 6. Start Development Server

```bash
bun run dev
```

Visit http://localhost:3000 to see your application!

## Troubleshooting

### Prisma Engine Download Issues

If `bunx prisma generate` fails:

**Solution 1: Use a mirror**
```bash
export PRISMA_ENGINES_MIRROR=https://your-mirror-url
bunx prisma generate
```

**Solution 2: Manual download**
Download engines from another machine and copy to:
- `node_modules/@prisma/engines/`
- `node_modules/.prisma/client/`

**Solution 3: Binary cache**
If you've generated Prisma client before, you can copy the cache from:
- Mac/Linux: `~/.cache/prisma/`
- Windows: `%LOCALAPPDATA%\Prisma\`

### Database Connection Issues

If you get database errors:

```bash
# Reset the database
bunx prisma migrate reset

# Or just migrate again
bunx prisma migrate dev
```

### Build Errors

If the build fails:

```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
bun run build
```

## Production Deployment

### 1. Build for Production

```bash
bun run build
```

### 2. Start Production Server

```bash
bun run start
```

### 3. Deployment Platforms

This app can be deployed to:

**Vercel (Recommended)**
```bash
bun install -g vercel
vercel
```

**Other Platforms**
- Railway.app
- Render.com
- DigitalOcean App Platform
- AWS/GCP/Azure

### Environment Variables for Production

Make sure to set:
- `DATABASE_URL` - Your database connection string (use PostgreSQL or MySQL for production)
- `BETTER_AUTH_SECRET` - A strong, random secret key (generate with `openssl rand -base64 32`)
- `BETTER_AUTH_URL` - Your production domain (e.g., `https://yourdomain.com`)
- `NEXT_PUBLIC_BETTER_AUTH_URL` - Leave unset to use relative URLs (recommended) or set to your production domain
- `NODE_ENV=production`

**Important for Production:**
- The auth client will use relative URLs when `NEXT_PUBLIC_BETTER_AUTH_URL` is not set
- This automatically works with your deployment and avoids hardcoded localhost issues
- HTTPS-only cookies and HSTS headers are automatically enabled when `NODE_ENV=production`
- Always deploy behind HTTPS (most modern platforms like Vercel, Railway, Render provide this automatically)
- See [AUTHENTICATION.md](./AUTHENTICATION.md) for detailed production setup

## Using the Application

### As a Seller

1. Navigate to "Sell Tickets" or `/tickets/create`
2. Fill in event details:
   - Title
   - Description
   - Category (Concerts, Sports, Theater, Festivals)
   - Event date and time
   - Location
   - Price per ticket
   - Quantity available
3. Submit the form
4. Your tickets will appear in the marketplace and on your dashboard

### As a Buyer

1. Browse tickets on the homepage or `/tickets`
2. Filter by category if desired
3. Click on a ticket to view details
4. Select quantity and click "Buy Now"
5. View your purchases in the Dashboard

### Dashboard Features

- **Listed Tickets**: See all tickets you've listed
- **Sales Stats**: Track revenue from ticket sales
- **My Purchases**: View all tickets you've bought
- **Quick Actions**: Create new listings or view ticket details

## API Usage

### Get All Tickets

```bash
curl http://localhost:3000/api/tickets
```

### Get Tickets by Category

```bash
curl http://localhost:3000/api/tickets?category=concerts
```

### Create a Ticket

```bash
curl -X POST http://localhost:3000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Summer Music Festival",
    "description": "Amazing outdoor concert",
    "price": 50,
    "eventDate": "2024-07-15T18:00:00Z",
    "location": "Central Park, NY",
    "category": "concerts",
    "quantity": 100
  }'
```

### Purchase Tickets

```bash
curl -X POST http://localhost:3000/api/purchases \
  -H "Content-Type: application/json" \
  -d '{
    "ticketId": "clxxxx",
    "quantity": 2
  }'
```

## Next Steps

- Implement user authentication
- Add payment processing
- Set up email notifications
- Deploy to production
- Add more features from the roadmap

## Support

If you encounter issues:
1. Check this guide thoroughly
2. Review error messages carefully
3. Check the GitHub issues
4. Open a new issue with details

Happy ticket selling! 🎫
