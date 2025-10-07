# Ticket Marketplace SaaS

A modern, full-featured SaaS platform for buying and selling event tickets built with Next.js 15.

## 🎫 Features

- **User Authentication**: Secure email/password authentication with Better Auth
- **Event Ticket Marketplace**: Browse and purchase tickets for concerts, sports, theater, and festivals
- **Ticket Listing**: Easily list your tickets for sale with detailed information
- **Real-time Availability**: Track ticket availability in real-time
- **Purchase Management**: Complete purchase flow with transaction history
- **Dashboard**: Comprehensive dashboard to manage your listed tickets and purchases
- **Responsive Design**: Beautiful, mobile-friendly UI built with Tailwind CSS
- **Database Management**: PostgreSQL database with Prisma ORM for data persistence
- **Protected Routes**: Authentication-required pages for selling and purchasing

## 🚀 Tech Stack

- **Framework**: Next.js 15.5.4 with App Router
- **Language**: TypeScript
- **Authentication**: Better Auth with email/password
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with Prisma ORM
- **API**: Next.js API Routes (REST)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/zaidhafeezvu/ticket-SaaS.git
cd ticket-SaaS
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
# Create .env file
cat > .env << 'EOF'
DATABASE_URL="postgresql://user:password@localhost:5432/ticketsaas"
BETTER_AUTH_SECRET="your-super-secret-key-change-this-in-production"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
EOF
```

**For Production:** Set `BETTER_AUTH_URL` to your domain and leave `NEXT_PUBLIC_BETTER_AUTH_URL` unset (recommended).

4. Set up the database:
```bash
# Generate Prisma client (requires internet access)
bunx prisma generate

# Apply database migrations
bunx prisma migrate deploy

# (Optional) Seed the database with sample data
bunx prisma db seed
```

5. Start the development server:
```bash
bun run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Account

After seeding, you can sign in with:
- **Email:** demo@ticketsaas.com
- **Password:** demo1234

For more details on authentication, see [AUTHENTICATION.md](./AUTHENTICATION.md).

## ⚠️ Important Note About Prisma

This project uses Prisma ORM which requires downloading binary engines on first setup. If you're in an environment with restricted internet access:

1. **Option A**: Set up in a different environment with internet access, then copy the `node_modules/.prisma` and `node_modules/@prisma` directories
2. **Option B**: Use the `PRISMA_ENGINES_MIRROR` environment variable to specify an alternative download location
3. **Option C**: The application UI is fully functional; API routes will work once Prisma engines are available

For development without database:
- The UI pages will render correctly
- You can view and test all frontend components
- API routes will fail until Prisma is properly initialized

## 🗄️ Database Setup

The application uses PostgreSQL for production-ready database management. The database schema includes:

- **Users**: Store user information with authentication data
- **Sessions**: Manage user sessions for authentication
- **Accounts**: Store password hashes and provider information
- **Tickets**: Event ticket listings with price, date, location, and availability
- **Purchases**: Transaction records linking buyers to tickets

To reset the database:
```bash
bunx prisma migrate reset
```

To view the database with Prisma Studio:
```bash
bunx prisma studio
```

## 🔐 Authentication

The application uses **Better Auth** for comprehensive user authentication. Key features:

- ✅ Email/password authentication with secure bcrypt hashing
- ✅ Session management with automatic refresh
- ✅ Protected routes for authenticated users only
- ✅ User-specific dashboards showing only owned tickets and purchases

**Available Auth Pages:**
- `/auth/signup` - Create a new account
- `/auth/login` - Sign in to existing account

**Protected Routes (require authentication):**
- `/dashboard` - View your tickets and purchases
- `/tickets/create` - List new tickets
- Purchase functionality on ticket detail pages

For detailed authentication documentation, see [AUTHENTICATION.md](./AUTHENTICATION.md).

## 📱 Pages & Features

### Authentication Pages

#### Sign Up (`/auth/signup`)
- Create new account with email and password
- Name, email, and password validation
- Automatic sign-in after registration
- Redirect to dashboard upon success

#### Sign In (`/auth/login`)
- Email/password authentication
- Error handling for invalid credentials
- Session creation and management
- Redirect to dashboard upon success

### Home Page (`/`)
- Hero section with call-to-action buttons
- Feature highlights (secure transactions, instant delivery, best prices)
- Popular category browsing (Concerts, Sports, Theater, Festivals)
- Professional footer with navigation links

### Tickets Listing (`/tickets`)
- Browse all available tickets
- Filter by category (Concerts, Sports, Theater, Festivals)
- View ticket details (price, date, location, availability)
- Responsive grid layout
- Empty state when no tickets are available

### Ticket Details (`/tickets/[id]`)
- Complete event information with large visual display
- Purchase interface with quantity selection
- Real-time availability tracking
- Seller information
- Location, date, and price details
- Sold out handling
- **Requires authentication to purchase**

### Create Ticket (`/tickets/create`)
- **Protected route - requires authentication**
- Comprehensive form to list new tickets
- Fields for title, description, category, price, quantity, event date, and location
- Client-side validation
- Category selection (Concerts, Sports, Theater, Festivals, Other)
- Date/time picker for event scheduling
- Automatic seller assignment from authenticated user

### Dashboard (`/dashboard`)
- **Protected route - requires authentication**
- Overview statistics (listed tickets, total sales, purchases made, total spent)
- Manage your listed tickets with detailed table view
- View purchase history
- Revenue tracking per ticket
- Status indicators
- Quick navigation to ticket details

## 🛠️ API Routes

### Authentication
- `POST /api/auth/sign-up` - Create a new user account
- `POST /api/auth/sign-in` - Authenticate user
- `POST /api/auth/sign-out` - End user session
- `GET /api/auth/session` - Get current user session

### Tickets
- `GET /api/tickets` - Fetch all tickets (with optional category filter)
- `POST /api/tickets` - Create a new ticket listing (**requires authentication**)
- `GET /api/tickets/[id]` - Get ticket by ID

### Purchases
- `POST /api/purchases` - Create a purchase (**requires authentication**, handles inventory management)
- `GET /api/purchases` - Fetch all purchases

All API routes return JSON responses and include proper error handling.

## 🎨 UI Components & Design

The application features:
- **Authentication-aware navigation bar** with dynamic user state
- **Responsive navigation bar** with logo and action buttons
- **Category filter chips** for easy browsing
- **Ticket cards** with gradient backgrounds and emoji icons
- **Interactive forms** with validation feedback
- **Data tables** for dashboard views
- **Status badges** for purchase states
- **Loading states** and empty states
- **Mobile-first responsive design**
- **Color-coded statistics** on dashboard

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ticketsaas"
```

## 🔧 Development

Build the application:
```bash
bun run build
```

Start the production server:
```bash
bun run start
```

Run linting:
```bash
bun run lint
```

## 📊 Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified Boolean   @default(false)
  name          String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  tickets       Ticket[]
  purchases     Purchase[]
  sessions      Session[]
  accounts      Account[]
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  expiresAt DateTime
  token     String   @unique
  ipAddress String?
  userAgent String?
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

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
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Ticket {
  id          String   @id @default(cuid())
  title       String
  description String
  price       Float
  eventDate   DateTime
  location    String
  category    String
  quantity    Int
  available   Int
  imageUrl    String?
  seller      User
  purchases   Purchase[]
}

model Purchase {
  id          String   @id @default(cuid())
  quantity    Int
  totalPrice  Float
  status      String   @default("pending")
  buyer       User
  ticket      Ticket
  createdAt   DateTime @default(now())
}
```

## 🎯 Future Enhancements

- [x] User authentication with Better Auth ✅
- [ ] OAuth providers (Google, GitHub)
- [ ] Email verification
- [ ] Two-factor authentication (2FA)
- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications for purchases and sales
- [ ] Advanced search with filters (price range, date range, location)
- [ ] User reviews and ratings system
- [ ] QR code ticket generation for entry
- [ ] Admin panel for platform management
- [ ] Multi-image upload for tickets
- [ ] Ticket transfer functionality
- [ ] Real-time notifications
- [ ] Social sharing features
- [ ] Analytics dashboard for sellers

## 🔐 Security Considerations

For production deployment:
- ✅ **Authentication**: Implemented with Better Auth (bcrypt password hashing)
- ✅ **Session Management**: Secure session tokens with automatic expiration
- ✅ **CSRF Protection**: Built-in with Better Auth
- ✅ **Authorization**: User-specific data isolation
- ✅ **Rate Limiting**: In-memory rate limiting on all API routes (see below)
- ✅ **Input Validation**: Server-side validation on all user inputs
- ✅ **Environment Variables**: Sensitive data stored in .env
- 🔄 **HTTPS**: Enable HTTPS only in production
- 🔄 **Email Verification**: Consider enabling for production
- 🔄 **2FA**: Consider adding two-factor authentication

### Rate Limiting Details

All API routes are protected with rate limiting to prevent abuse:

**Authentication Endpoints** (`/api/auth/*`):
- Limit: 20 requests per 15 minutes per IP
- Prevents brute force attacks

**Ticket Endpoints**:
- `GET /api/tickets`: 30 requests per minute
- `POST /api/tickets`: 10 requests per minute
- `GET /api/tickets/[id]`: 60 requests per minute

**Purchase Endpoints**:
- `POST /api/purchases`: 5 requests per minute (strict to prevent abuse)
- `GET /api/purchases`: 30 requests per minute

Rate limit responses include:
- `429 Too Many Requests` status code
- `Retry-After` header indicating when to retry
- `X-RateLimit-*` headers with limit information

See [AUTHENTICATION.md](./AUTHENTICATION.md) for detailed security features.

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check the documentation above
- Review [AUTHENTICATION.md](./AUTHENTICATION.md) for auth-related questions
- Review the code comments for implementation details

## 🙏 Acknowledgments

- Built with Next.js 15
- Authentication powered by Better Auth
- Styled with Tailwind CSS 4
- Database powered by Prisma
- Icons use emoji for simplicity and universal support

