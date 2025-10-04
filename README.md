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

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **API**: Next.js API Routes

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
# Generate Prisma client
npx prisma generate

# Create and migrate the database
npx prisma migrate dev --name init
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

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

## 📱 Pages & Features

### Home Page (`/`)
- Hero section with call-to-action buttons
- Feature highlights (secure transactions, instant delivery, best prices)
- Popular category browsing (Concerts, Sports, Theater, Festivals)

### Tickets Listing (`/tickets`)
- Browse all available tickets
- Filter by category
- View ticket details (price, date, location, availability)

### Ticket Details (`/tickets/[id]`)
- Complete event information
- Purchase interface with quantity selection
- Seller information
- Real-time availability

### Create Ticket (`/tickets/create`)
- Form to list new tickets
- Fields for title, description, category, price, quantity, event date, and location
- Client-side validation

### Dashboard (`/dashboard`)
- Overview statistics (listed tickets, total sales, purchases made, total spent)
- Manage your listed tickets
- View purchase history
- Revenue tracking

## 🛠️ API Routes

- `GET /api/tickets` - Fetch all tickets (with optional category filter)
- `POST /api/tickets` - Create a new ticket listing
- `GET /api/tickets/[id]` - Get ticket by ID
- `POST /api/purchases` - Create a purchase
- `GET /api/purchases` - Fetch all purchases

## 🎨 UI Components

The application features:
- Responsive navigation bar
- Category filter chips
- Ticket cards with gradient backgrounds
- Interactive forms with validation
- Tables for data display
- Status badges
- Loading states

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
  seller      User
  purchases   Purchase[]
}

model Purchase {
  id          String   @id @default(cuid())
  quantity    Int
  totalPrice  Float
  status      String
  buyer       User
  ticket      Ticket
}
```

## 🎯 Future Enhancements

- User authentication with NextAuth.js
- Payment integration (Stripe)
- Email notifications
- Advanced search and filtering
- User reviews and ratings
- QR code ticket generation
- Admin panel

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
