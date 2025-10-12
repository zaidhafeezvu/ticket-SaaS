# User Profiles with Ratings & Reviews Feature

## Overview
This document describes the implementation of the user profiles with ratings and reviews feature for the Ticket Marketplace SaaS platform. This feature adds trust and transparency to the marketplace by allowing buyers to rate and review sellers after completing purchases.

## Features Implemented

### 1. Database Schema
- **Review Model** (`prisma/schema.prisma`)
  - `id`: Unique identifier
  - `rating`: Integer (1-5 stars)
  - `comment`: Optional text feedback
  - `reviewerId`: User who left the review
  - `revieweeId`: User being reviewed (seller)
  - `purchaseId`: Associated purchase (one-to-one relationship)
  - Timestamps for creation and updates
  
- **Updated User Model**
  - `reviewsGiven`: Reviews written by the user
  - `reviewsReceived`: Reviews received by the user
  
- **Updated Purchase Model**
  - `review`: Optional related review (one-to-one)

### 2. API Endpoints

#### POST /api/reviews
Creates a new review for a completed purchase.

**Request Body:**
```json
{
  "purchaseId": "string",
  "rating": 1-5,
  "comment": "string (optional)"
}
```

**Validations:**
- User must be authenticated
- User must be the buyer of the purchase
- Purchase must have status "completed"
- Review doesn't already exist for this purchase
- Rating must be between 1 and 5
- Users cannot review themselves

**Response:** 201 Created with review details

#### GET /api/reviews
Fetches reviews with optional filtering.

**Query Parameters:**
- `userId`: Filter by reviewee (seller) ID
- `limit`: Max results (default: 50)
- `offset`: Pagination offset (default: 0)

**Response:** Array of reviews with reviewer and reviewee details

#### GET /api/reviews/user/[id]
Fetches all reviews for a specific user with statistics.

**Response:**
```json
{
  "reviews": [...],
  "stats": {
    "totalReviews": number,
    "averageRating": number,
    "ratingDistribution": {
      "5": number,
      "4": number,
      "3": number,
      "2": number,
      "1": number
    }
  }
}
```

### 3. User Profile Page

**Route:** `/users/[id]/page.tsx`

**Features:**
- User avatar and basic information
- Average rating display with star visualization
- Total review count
- Rating distribution chart (1-5 stars)
- Active ticket listings (up to 6)
- All reviews received with reviewer details
- Joined date and listing statistics

### 4. React Components

#### ReviewForm (`src/components/review-form.tsx`)
Client component for submitting reviews.
- Interactive 5-star rating selector
- Optional comment textarea (500 char limit)
- Form validation
- Success/error handling

#### ReviewList (`src/components/review-list.tsx`)
Displays a list of reviews with:
- Reviewer avatar and name
- Star rating visualization
- Review comment
- Related ticket information
- Review date

#### SellerRating (`src/components/seller-rating.tsx`)
Reusable component to display seller ratings.
- Shows average rating and total reviews
- Configurable sizes (sm, md, lg)
- Optional clickable link to seller profile
- Handles "New" sellers with no reviews

#### ReviewButton (`src/components/review-button.tsx`)
Client component for the review action button.
- Opens side sheet with ReviewForm
- Shows "Reviewed" badge if review exists
- Only available for completed purchases
- Refreshes page on success

### 5. Updated Pages

#### Ticket Listings (`/tickets`)
- Displays seller rating below each ticket
- Shows star rating and review count
- Small, compact display format

#### Ticket Detail Page (`/tickets/[id]`)
- Enhanced seller information section
- Displays seller rating with stars
- "View Profile" button linking to seller's profile
- Fetches rating data client-side

#### Dashboard (`/dashboard`)
- New "Your Rating" stat card showing average rating
- "Reviews Received" section displaying all reviews
- "Leave Review" button for completed purchases
- Review status indicator (Reviewed/Leave Review)
- Link to full profile page

## User Flow

### Buying and Reviewing Flow:
1. Buyer purchases tickets from a seller
2. Purchase is marked as "completed"
3. Buyer sees "Leave Review" button in dashboard
4. Buyer clicks button, side sheet opens with ReviewForm
5. Buyer selects rating (1-5 stars) and optional comment
6. Review is submitted and associated with purchase
7. Button changes to "Reviewed" (disabled)
8. Review appears on seller's profile page
9. Seller's average rating updates across the platform

### Viewing Reviews Flow:
1. Click on seller name/rating anywhere on the platform
2. Navigate to seller's profile (`/users/[id]`)
3. View average rating, total reviews, and distribution
4. See all reviews with comments and ratings
5. View seller's active listings
6. Click tickets to navigate to ticket detail page

## Technical Implementation Details

### Rate Limiting
All API endpoints use the existing rate limiting middleware to prevent abuse.

### Authentication
- Reviews API requires authentication via `getSession()`
- Only buyers can review their own purchases
- Sellers cannot review themselves

### Data Integrity
- One review per purchase (enforced at database level)
- Reviews cascade delete with purchases
- Reviews cascade delete when users are deleted

### Performance Optimizations
- Efficient Prisma queries with selective includes
- Rating statistics calculated server-side
- Client-side caching for user profile data

### UI/UX Considerations
- Star ratings use lucide-react icons
- Hover effects on interactive star selectors
- Responsive design for all screen sizes
- Dark mode support throughout
- Loading states for async operations
- Toast notifications for user feedback

## Database Migration

To apply the database changes, run:
```bash
bunx prisma migrate dev --name add_reviews
```

This will:
1. Create the Review table
2. Add review relations to User model
3. Add review relation to Purchase model
4. Create necessary indexes for performance

## Future Enhancements

Potential improvements for future iterations:
1. **Review Responses**: Allow sellers to respond to reviews
2. **Review Moderation**: Admin panel to moderate inappropriate reviews
3. **Review Editing**: Allow users to edit reviews within a time window
4. **Review Flagging**: Report inappropriate or fake reviews
5. **Verified Purchase Badge**: Show "Verified Purchase" badge on reviews
6. **Review Sorting**: Sort by date, rating, helpfulness
7. **Review Voting**: Upvote/downvote helpful reviews
8. **Detailed Analytics**: Charts for rating trends over time
9. **Email Notifications**: Notify sellers of new reviews
10. **Review Reminders**: Email buyers to leave reviews after events

## Testing Checklist

Before considering this feature complete, test:
- [ ] Create review for completed purchase
- [ ] Verify review appears on seller profile
- [ ] Verify rating updates correctly
- [ ] Test rating validation (1-5 only)
- [ ] Test duplicate review prevention
- [ ] Test self-review prevention
- [ ] Test review on non-completed purchase
- [ ] Test unauthenticated review attempt
- [ ] Verify responsive design on mobile
- [ ] Verify dark mode appearance
- [ ] Test pagination for users with many reviews
- [ ] Test edge case: seller with no reviews
- [ ] Test rating display on ticket listings
- [ ] Test rating display on ticket detail page

## API Examples

### Creating a Review
```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "purchaseId": "abc123",
    "rating": 5,
    "comment": "Great tickets! Fast delivery and excellent communication."
  }'
```

### Fetching User Reviews
```bash
curl http://localhost:3000/api/reviews/user/userId123
```

## Component Usage Examples

### Using SellerRating Component
```tsx
import { SellerRating } from "@/components/seller-rating";

<SellerRating
  sellerId="user123"
  averageRating={4.5}
  totalReviews={23}
  showLink={true}
  size="md"
/>
```

### Using ReviewForm Component
```tsx
import { ReviewForm } from "@/components/review-form";

<ReviewForm
  purchaseId="purchase123"
  ticketTitle="Concert Tickets"
  sellerName="John Doe"
  onSuccess={() => console.log("Review submitted!")}
/>
```

### Using ReviewList Component
```tsx
import { ReviewList } from "@/components/review-list";

<ReviewList reviews={reviewsArray} />
```

## Security Considerations

1. **Input Validation**: All inputs are validated server-side
2. **Rate Limiting**: Prevents review spam
3. **Authentication**: Reviews require valid session
4. **Authorization**: Users can only review their own purchases
5. **SQL Injection**: Protected by Prisma ORM
6. **XSS Prevention**: React escapes user input automatically

## Performance Metrics

Expected performance characteristics:
- Review creation: < 500ms
- Profile page load: < 1s
- Rating calculation: O(n) where n = number of reviews
- Database queries: Optimized with proper indexes

## Accessibility

The feature includes:
- Semantic HTML structure
- ARIA labels for star ratings
- Keyboard navigation support
- Screen reader friendly content
- High contrast for dark mode
- Focus indicators on interactive elements

## Conclusion

This feature successfully adds a trust layer to the Ticket Marketplace SaaS platform. Users can now make informed decisions based on seller ratings and reviews, creating a more transparent and reliable marketplace experience.
