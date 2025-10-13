# Ticket Deletion Feature

## Overview

The ticket deletion feature allows users to delete their own ticket listings from their dashboard. This feature includes comprehensive safeguards to protect data integrity and ensure only authorized deletions occur.

## Features

### 1. Authentication & Authorization
- **User Authentication**: Only authenticated users can delete tickets
- **Email Verification**: Users must have verified email addresses
- **Ownership Verification**: Users can only delete tickets they own
- **Session Validation**: Uses Better Auth session management

### 2. Business Logic Safeguards
- **Purchase Protection**: Tickets with existing purchases cannot be deleted
  - Prevents data loss and maintains purchase history integrity
  - Users attempting to delete tickets with purchases receive clear error messages
- **Disabled State**: Delete button is disabled (grayed out) for tickets with purchases
  - Visual indicator prevents confusion
  - Tooltip explains why deletion is not available

### 3. User Interface
- **Delete Button**: Located in the "Actions" column of the dashboard table
- **Confirmation Dialog**: Prevents accidental deletions
  - Shows ticket title for confirmation
  - "Cancel" and "Delete" buttons
  - Modal dialog with backdrop
- **Visual Feedback**:
  - Trash icon indicator
  - Red/destructive color for delete button
  - Loading state during deletion
  - Toast notifications for success/error messages

### 4. Security & Performance
- **Rate Limiting**: Maximum 10 delete requests per minute per user
- **Error Handling**: Comprehensive error messages for all failure scenarios
- **Transaction Safety**: Database operations are atomic

## API Endpoint

### DELETE `/api/tickets/[id]`

Deletes a ticket by ID if all conditions are met.

**Authentication**: Required (Bearer token via session)

**Request Headers**:
```
Cookie: session token (handled automatically by Better Auth)
```

**Response Codes**:
- `200 OK` - Ticket deleted successfully
- `400 Bad Request` - Ticket has existing purchases
- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - Email not verified or user doesn't own the ticket
- `404 Not Found` - Ticket doesn't exist
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

**Success Response**:
```json
{
  "message": "Ticket deleted successfully"
}
```

**Error Response Examples**:
```json
{
  "error": "Cannot delete ticket with existing purchases"
}
```

```json
{
  "error": "Forbidden: You can only delete your own tickets"
}
```

## Implementation Details

### Components

#### 1. DeleteTicketButton Component
**Location**: `src/components/delete-ticket-button.tsx`

**Props**:
- `ticketId: string` - The ID of the ticket to delete
- `ticketTitle: string` - The title shown in confirmation dialog
- `hasPurchases: boolean` - Whether the ticket has purchases

**Behavior**:
- If `hasPurchases` is true, button is disabled with tooltip
- Opens confirmation dialog on click
- Makes DELETE API call on confirmation
- Shows loading state during deletion
- Refreshes page data on success
- Displays toast notifications

#### 2. Dialog Component
**Location**: `src/components/ui/dialog.tsx`

Standard shadcn/ui dialog component used for the confirmation modal.

### Database Considerations

**Ticket Model** (from `prisma/schema.prisma`):
```prisma
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
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  sellerId    String
  seller      User       @relation(fields: [sellerId], references: [id])
  purchases   Purchase[]
  
  @@index([sellerId])
}
```

**Note**: The `purchases` relation does not have `onDelete: Cascade`, so we manually check for purchases before deletion to prevent orphaned purchase records.

## Usage

### For End Users

1. Navigate to your dashboard at `/dashboard`
2. Find the ticket you want to delete in "My Listed Tickets"
3. Click the trash icon in the "Actions" column
4. Confirm deletion in the dialog
5. Receive confirmation via toast notification

**Important**: You can only delete tickets that have not been purchased.

### For Developers

To test the deletion feature:

1. Create a test ticket:
   ```bash
   # Login and navigate to /tickets/create
   ```

2. Test deletion of ticket without purchases:
   ```bash
   curl -X DELETE http://localhost:3000/api/tickets/[ticket-id] \
     -H "Cookie: session-token-here"
   ```

3. Test deletion prevention with purchases:
   ```bash
   # First create a purchase, then attempt deletion
   ```

## Error Scenarios

| Scenario | HTTP Code | Error Message | UI Behavior |
|----------|-----------|---------------|-------------|
| Not logged in | 401 | "Unauthorized" | Redirects to login |
| Email not verified | 403 | "Email verification required" | Shows error toast |
| Not ticket owner | 403 | "Forbidden: You can only delete your own tickets" | Shows error toast |
| Ticket has purchases | 400 | "Cannot delete ticket with existing purchases" | Button disabled, tooltip shown |
| Ticket not found | 404 | "Ticket not found" | Shows error toast |
| Rate limit exceeded | 429 | Rate limit message | Shows error toast |
| Server error | 500 | "Failed to delete ticket" | Shows error toast |

## Future Enhancements

Potential improvements for future versions:

1. **Soft Delete**: Mark tickets as deleted instead of removing from database
2. **Archive Feature**: Allow archiving old tickets instead of deletion
3. **Bulk Delete**: Delete multiple tickets at once
4. **Delete with Refunds**: Handle refunds for purchased tickets before deletion
5. **Admin Override**: Allow admins to delete any ticket
6. **Audit Log**: Track all deletion actions for compliance
7. **Undo Feature**: Temporary deletion with ability to restore

## Testing Checklist

- [ ] Delete ticket without purchases succeeds
- [ ] Delete ticket with purchases is prevented
- [ ] Non-owner cannot delete ticket
- [ ] Unauthenticated user cannot delete
- [ ] Unverified email user cannot delete
- [ ] Confirmation dialog works correctly
- [ ] Rate limiting functions as expected
- [ ] UI updates after successful deletion
- [ ] Toast notifications display correctly
- [ ] Disabled state shows for tickets with purchases

## Related Files

- `src/app/api/tickets/[id]/route.ts` - DELETE endpoint implementation
- `src/components/delete-ticket-button.tsx` - Delete button component
- `src/components/ui/dialog.tsx` - Dialog UI component
- `src/app/dashboard/page.tsx` - Dashboard with delete functionality
- `prisma/schema.prisma` - Database schema

## Support

For issues or questions about ticket deletion:
1. Check this documentation
2. Review error messages in toast notifications
3. Check browser console for detailed error logs
4. Review server logs for API errors
