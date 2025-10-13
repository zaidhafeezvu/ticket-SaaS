# Ticket Deletion Testing Guide

## Quick Test Scenarios

### Scenario 1: Successful Ticket Deletion
**Prerequisites**: 
- User is logged in
- Email is verified
- User has created a ticket
- Ticket has NO purchases

**Steps**:
1. Navigate to `/dashboard`
2. Locate your ticket in "My Listed Tickets"
3. Click the trash icon in the Actions column
4. Confirm deletion in the dialog
5. See success toast notification
6. Ticket disappears from the list

**Expected Result**: ✅ Ticket deleted successfully

---

### Scenario 2: Prevent Deletion with Purchases
**Prerequisites**: 
- User is logged in
- Email is verified
- User has created a ticket
- Ticket HAS purchases

**Steps**:
1. Navigate to `/dashboard`
2. Locate your ticket with purchases in "My Listed Tickets"
3. Observe the trash icon is grayed out
4. Hover over the icon to see tooltip

**Expected Result**: ✅ Delete button is disabled with tooltip "Cannot delete ticket with existing purchases"

---

### Scenario 3: Unauthorized Deletion Attempt
**Prerequisites**: 
- User A creates a ticket
- User B attempts to delete it via API

**API Test**:
```bash
curl -X DELETE http://localhost:3000/api/tickets/{ticket-id} \
  -H "Cookie: {user-b-session}"
```

**Expected Result**: ✅ 403 Forbidden - "Forbidden: You can only delete your own tickets"

---

### Scenario 4: Unauthenticated Deletion Attempt
**Prerequisites**: 
- User is not logged in

**API Test**:
```bash
curl -X DELETE http://localhost:3000/api/tickets/{ticket-id}
```

**Expected Result**: ✅ 401 Unauthorized

---

### Scenario 5: Email Not Verified
**Prerequisites**: 
- User is logged in
- Email is NOT verified

**Steps**:
1. Navigate to `/dashboard`
2. User should be redirected to email verification page

**Expected Result**: ✅ Cannot access dashboard without email verification

---

## Integration Test Flow

### Complete User Journey
1. **Sign up** → Create account at `/auth/signup`
2. **Verify email** → Click link in email
3. **Login** → Sign in at `/auth/login`
4. **Create ticket** → Go to `/tickets/create` and create a ticket
5. **View dashboard** → Navigate to `/dashboard` and see the ticket
6. **Delete ticket** → Click trash icon, confirm, see success
7. **Verify deletion** → Ticket no longer appears in dashboard

### Dashboard Visual Verification
Check the dashboard displays:
- ✅ Ticket count in stats
- ✅ Table with all ticket information
- ✅ Actions column with delete button
- ✅ Delete button state (enabled/disabled based on purchases)
- ✅ All columns: Event, Date, Price, Available, Sold, Revenue, Actions

---

## API Testing with cURL

### Get Ticket
```bash
curl -X GET http://localhost:3000/api/tickets/{ticket-id}
```

### Delete Ticket (with authentication)
```bash
curl -X DELETE http://localhost:3000/api/tickets/{ticket-id} \
  -H "Cookie: better-auth.session_token={your-session-token}" \
  -v
```

### Expected Responses

**Success (200)**:
```json
{
  "message": "Ticket deleted successfully"
}
```

**Has Purchases (400)**:
```json
{
  "error": "Cannot delete ticket with existing purchases"
}
```

**Not Owner (403)**:
```json
{
  "error": "Forbidden: You can only delete your own tickets"
}
```

**Not Found (404)**:
```json
{
  "error": "Ticket not found"
}
```

**Rate Limited (429)**:
Rate limit response from middleware

---

## Rate Limiting Test

**Test**: Make more than 10 DELETE requests in 60 seconds

**Expected**: After 10 requests, subsequent requests return 429 status

```bash
# Run this in a loop
for i in {1..15}; do
  echo "Request $i"
  curl -X DELETE http://localhost:3000/api/tickets/{ticket-id} \
    -H "Cookie: {session-token}" \
    -w "\nStatus: %{http_code}\n"
  sleep 1
done
```

---

## Browser Testing Checklist

### Dashboard Page
- [ ] Delete button appears in Actions column
- [ ] Delete button shows trash icon
- [ ] Delete button is red/destructive color when enabled
- [ ] Delete button is gray when disabled (has purchases)
- [ ] Tooltip shows on hover for disabled button
- [ ] Click delete button opens confirmation dialog

### Confirmation Dialog
- [ ] Dialog shows ticket title
- [ ] Dialog has descriptive warning message
- [ ] Cancel button works (closes dialog without deletion)
- [ ] Delete button shows loading state
- [ ] Dialog closes after successful deletion
- [ ] Toast notification appears after deletion

### After Deletion
- [ ] Page refreshes/updates automatically
- [ ] Deleted ticket no longer appears in list
- [ ] Stats update correctly (ticket count decreases)
- [ ] No errors in browser console

---

## Security Checklist

- [ ] ✅ Cannot delete without authentication
- [ ] ✅ Cannot delete without email verification
- [ ] ✅ Cannot delete someone else's ticket
- [ ] ✅ Cannot delete ticket with purchases
- [ ] ✅ Rate limiting prevents abuse
- [ ] ✅ All errors return appropriate HTTP codes
- [ ] ✅ Session validation works correctly
- [ ] ✅ CSRF protection (if implemented)

---

## Performance Testing

### Database Queries
Check that the DELETE operation:
1. Fetches ticket with purchases in single query
2. Verifies ownership without extra query
3. Deletes ticket in single operation
4. No N+1 query issues

### UI Performance
- [ ] Dialog opens instantly
- [ ] Delete button responds immediately
- [ ] Loading state shows during API call
- [ ] Page refresh is smooth
- [ ] No UI flickering

---

## Edge Cases

### Test These Scenarios:
1. ✅ Delete last ticket (stats should show 0)
2. ✅ Delete ticket while another user views it
3. ✅ Attempt double-delete (clicking twice quickly)
4. ✅ Network failure during deletion
5. ✅ Session expires during deletion
6. ✅ Ticket deleted between page load and delete attempt
7. ✅ Very long ticket titles in confirmation dialog

---

## Troubleshooting

### Issue: Delete button doesn't appear
**Check**:
- Are you the ticket owner?
- Is email verified?
- Is the Actions column rendered?

### Issue: Cannot delete ticket
**Check**:
- Does ticket have purchases?
- Are you authenticated?
- Is session valid?
- Check browser console for errors

### Issue: Dialog doesn't open
**Check**:
- Is Dialog component imported correctly?
- Are Radix UI dependencies installed?
- Check browser console for errors

### Issue: Page doesn't refresh after deletion
**Check**:
- Is `router.refresh()` called?
- Check network tab for API response
- Verify deletion actually succeeded

---

## Manual Testing Script

```bash
# 1. Start the development server
npm run dev

# 2. Open browser to http://localhost:3000

# 3. Create a test account
# Email: test-delete@example.com
# Password: TestPassword123

# 4. Verify email (check your email or use database)

# 5. Create a test ticket
# - Navigate to /tickets/create
# - Fill in all fields
# - Submit

# 6. Test deletion
# - Go to /dashboard
# - Click trash icon on your ticket
# - Confirm deletion
# - Verify ticket is gone

# 7. Test with purchases
# - Create another ticket
# - Purchase it (with another account)
# - Try to delete (should be disabled)

# 8. Verify API directly
curl -X DELETE http://localhost:3000/api/tickets/{id} \
  -H "Cookie: $(grep session .cookies)" \
  -v
```

---

## Automated Testing (Future Enhancement)

Consider adding these tests in the future:

```typescript
// Example Jest/Vitest tests
describe('Ticket Deletion', () => {
  it('should delete ticket without purchases', async () => {
    // Test implementation
  });

  it('should prevent deletion with purchases', async () => {
    // Test implementation
  });

  it('should require authentication', async () => {
    // Test implementation
  });

  it('should verify ownership', async () => {
    // Test implementation
  });
});
```

---

## Success Criteria

All scenarios should pass:
- ✅ Successful deletion works
- ✅ Deletion prevented when has purchases
- ✅ Unauthorized access blocked
- ✅ UI updates correctly
- ✅ Error messages are clear
- ✅ Rate limiting works
- ✅ No data corruption
- ✅ No security vulnerabilities
