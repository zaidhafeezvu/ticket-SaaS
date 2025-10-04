# Ticket Marketplace SaaS

A modern, full-featured SaaS platform for buying and selling event tickets built with Next.js 15.

## 🎫 Features

- **Event Ticket Marketplace**: Browse and purchase tickets for concerts, sports, theater, and festivals
- **Ticket Listing**: Easily list your tickets for sale with detailed information
- **Real-time Availability**: Track ticket availability in real-time
- **Purchase Management**: Complete purchase flow with transaction history
- **Dashboard**: Comprehensive dashboard to manage your listed tickets and purchases
- **Responsive Design**: Beautiful, mobile-friendly UI built with Tailwind CSS
- **Database Management**: SQLite database with Prisma ORM for data persistence

## 🚀 Tech Stack

- **Framework**: Next.js 15.5.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite with Prisma ORM
- **API**: Next.js API Routes (REST)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/zaidhafeezvu/ticket-SaaS.git
cd ticket-SaaS
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
# Generate Prisma client (requires internet access)
npx prisma generate

# Create and migrate the database
npx prisma migrate dev --name init

# (Optional) Seed the database with sample data
npx prisma db seed
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

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

The application uses SQLite for simplicity. The database schema includes:

- **Users**: Store user information (sellers and buyers)
- **Tickets**: Event ticket listings with price, date, location, and availability
- **Purchases**: Transaction records linking buyers to tickets

To reset the database:
```bash
rm prisma/dev.db
npx prisma migrate reset
```

To view the database with Prisma Studio:
```bash
npx prisma studio
```

## 📱 Pages & Features

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

### Create Ticket (`/tickets/create`)
- Comprehensive form to list new tickets
- Fields for title, description, category, price, quantity, event date, and location
- Client-side validation
- Category selection (Concerts, Sports, Theater, Festivals, Other)
- Date/time picker for event scheduling

### Dashboard (`/dashboard`)
- Overview statistics (listed tickets, total sales, purchases made, total spent)
- Manage your listed tickets with detailed table view
- View purchase history
- Revenue tracking per ticket
- Status indicators
- Quick navigation to ticket details

## 🛠️ API Routes

### Tickets
- `GET /api/tickets` - Fetch all tickets (with optional category filter)
- `POST /api/tickets` - Create a new ticket listing
- `GET /api/tickets/[id]` - Get ticket by ID

### Purchases
- `POST /api/purchases` - Create a purchase (handles inventory management)
- `GET /api/purchases` - Fetch all purchases

All API routes return JSON responses and include proper error handling.

## 🎨 UI Components & Design

The application features:
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
DATABASE_URL="file:./dev.db"
```

## 🔧 Development

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm run start
```

Run linting:
```bash
npm run lint
```

## 📊 Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tickets   Ticket[]
  purchases Purchase[]
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

- [ ] User authentication with NextAuth.js or Clerk
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
- Implement proper authentication (NextAuth.js recommended)
- Use secure password hashing (bcrypt)
- Add CSRF protection
- Implement rate limiting on API routes
- Validate all user inputs server-side
- Use environment variables for sensitive data
- Enable HTTPS only
- Implement proper authorization checks

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check the documentation above
- Review the code comments for implementation details

## 🙏 Acknowledgments

- Built with Next.js 15
- Styled with Tailwind CSS 4
- Database powered by Prisma
- Icons use emoji for simplicity and universal support

