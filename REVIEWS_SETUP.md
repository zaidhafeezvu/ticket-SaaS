# Setting Up the Reviews Feature

## Quick Start Guide

### 1. Run Database Migration

When your database is accessible, run the following command to apply the schema changes:

```bash
bunx prisma migrate dev --name add_reviews
```

This will create the Review table and update the User and Purchase models with the necessary relations.

### 2. Generate Prisma Client

After the migration, regenerate the Prisma client to include the new Review model:

```bash
bunx prisma generate
```

### 3. Restart Development Server

Restart your development server to pick up the changes:

```bash
# Stop the current server (Ctrl+C)
# Then restart
bun run dev
# or
npm run dev
```

### 4. Test the Feature

1. **Create a test purchase:**
   - Sign up/login as a buyer
   - Purchase tickets from a seller
   
2. **Mark purchase as completed:**
   Since there's no payment integration yet, you'll need to manually update the purchase status in the database:
   
   ```bash
   bunx prisma studio
   ```
   
   Navigate to the Purchase model, find your purchase, and change the `status` field from "pending" to "completed".

3. **Leave a review:**
   - Go to your Dashboard
   - Find the completed purchase
   - Click "Leave Review"
   - Submit a rating and comment

4. **View the review:**
   - Click on the seller's name/rating
   - View the seller's profile with the new review
   - Check that the rating appears on ticket listings

## Features to Test

### ✅ User Profile Page
- Navigate to `/users/[sellerId]`
- Verify rating display
- Check reviews list
- View active listings

### ✅ Ticket Listings
- Go to `/tickets`
- Verify seller ratings appear on ticket cards

### ✅ Ticket Detail Page
- Go to any ticket detail page
- Check enhanced seller info with rating
- Click "View Profile" button

### ✅ Dashboard
- View "Your Rating" stat card
- Check "Reviews Received" section
- Test "Leave Review" button on completed purchases
- Verify "Reviewed" badge on already-reviewed purchases

## API Endpoints to Test

### Create a Review
```bash
POST http://localhost:3000/api/reviews
Content-Type: application/json

{
  "purchaseId": "your-purchase-id",
  "rating": 5,
  "comment": "Great experience!"
}
```

### Get User Reviews
```bash
GET http://localhost:3000/api/reviews/user/[userId]
```

### Get All Reviews
```bash
GET http://localhost:3000/api/reviews?userId=[sellerId]&limit=10&offset=0
```

## Troubleshooting

### Migration Errors
If you encounter migration errors:
1. Check your DATABASE_URL in `.env`
2. Ensure the database is running
3. Try resetting the database: `bunx prisma migrate reset` (⚠️ This will delete all data!)

### TypeScript Errors
If you see TypeScript errors:
1. Regenerate Prisma client: `bunx prisma generate`
2. Restart TypeScript server in VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

### Reviews Not Appearing
If reviews don't appear:
1. Verify the purchase status is "completed"
2. Check that the review was successfully created in Prisma Studio
3. Verify the sellerId matches the ticket seller
4. Clear browser cache and refresh

## Database Schema Overview

```prisma
model Review {
  id          String   @id @default(cuid())
  rating      Int      // 1-5 stars
  comment     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  reviewerId  String
  reviewer    User     @relation("ReviewsGiven", ...)
  revieweeId  String
  reviewee    User     @relation("ReviewsReceived", ...)
  purchaseId  String   @unique
  purchase    Purchase @relation(...)
}
```

## Next Steps

After testing, consider:
1. Adding email notifications when sellers receive reviews
2. Implementing review moderation
3. Adding review response functionality
4. Creating admin dashboard for review management
5. Adding analytics for review trends

## Support

For issues or questions:
1. Check `REVIEWS_FEATURE.md` for detailed documentation
2. Review the code comments in the implementation files
3. Check Prisma Studio for database state
4. Review console logs for error messages
