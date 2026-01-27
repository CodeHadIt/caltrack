# New Profile Features

## Overview

The profile page now includes several enhanced features for better user experience.

## Features Implemented

### 1. Height Unit Selection (cm or ft)

Users can now choose their preferred height unit:
- **Metric (cm)**: Enter height in centimeters (e.g., 175)
- **Imperial (ft)**: Enter height in feet and inches (e.g., 5'11" or 5.11)

**How it works:**
- Dropdown next to the height field lets users switch units
- When switching units, the value automatically converts
- Data is stored in the database as centimeters (standard)

**Conversions:**
- ft to cm: `(feet × 12 + inches) × 2.54`
- cm to ft: Divides by 2.54, then converts to feet and inches

### 2. Weight Unit Selection (kg or lbs)

Users can choose their preferred weight unit:
- **Metric (kg)**: Enter weight in kilograms (e.g., 70)
- **Imperial (lbs)**: Enter weight in pounds (e.g., 154)

**How it works:**
- Dropdown next to the weight field lets users switch units
- Automatic conversion when switching units
- Data is stored in the database as kilograms (standard)

**Conversions:**
- kg to lbs: `kg × 2.20462`
- lbs to kg: `lbs / 2.20462`

### 3. Dashboard Redirect After Save

After saving profile information, users are automatically redirected to the dashboard.

**Benefits:**
- Better onboarding flow for new users
- Smooth transition after completing profile setup
- Reduces confusion about "what's next"

### 4. Account Deletion with Email Confirmation

Users can permanently delete their accounts with a secure confirmation process:

**Deletion Process:**
1. User clicks "Delete Account" button in profile
2. Confirmation dialog appears with warning
3. User confirms and deletion request is sent
4. Email sent to user's registered email address
5. User clicks confirmation link in email
6. Account and all data is permanently deleted

**Security Features:**
- Email confirmation required
- Time-limited deletion tokens (24 hours)
- Cannot be undone after confirmation
- Guest accounts cannot be deleted

**What Gets Deleted:**
- User account and login credentials
- All food logs and meal history
- Custom food items
- Profile information
- All associated data

**Database Table:**
```sql
account_deletion_requests
- id: UUID (primary key)
- user_id: User requesting deletion
- token: Secure deletion token
- expires_at: Token expiration (24 hours)
- created_at: Request timestamp
```

---

## Setup Instructions

### Database Migration

Run the account deletion migration:

1. Go to Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/editor

2. Copy content from `/supabase/migrations/005_account_deletion.sql`

3. Paste and click **Run**

4. Verify table created: Check for `account_deletion_requests` table

### Email Template

The account deletion email template is already created at:
- `/supabase/templates/delete-account.html`

This template is used automatically by the API route when sending deletion confirmation emails.

### Environment Variables

Make sure these are set in your `.env.local`:
```env
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=your_email@domain.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## API Routes

### POST /api/auth/delete-account

Initiates account deletion request and sends confirmation email.

**Request:** POST (authenticated)
**Response:**
```json
{
  "message": "Confirmation email sent successfully"
}
```

### GET /api/auth/confirm-delete?token=xxx

Confirms and executes account deletion.

**Request:** GET with deletion token
**Response:** Redirects to home page with status message

---

## User Flow Examples

### New User Onboarding:
1. User signs up
2. Fills out profile (chooses preferred units)
3. Clicks "Save Profile"
4. ✅ **Redirected to dashboard automatically**
5. Starts tracking meals

### Account Deletion:
1. User goes to Profile page
2. Scrolls to "Danger Zone" section
3. Clicks "Delete Account"
4. Reads warning dialog
5. Clicks "Send Confirmation Email"
6. Receives email with deletion link
7. Clicks link in email
8. Account is permanently deleted
9. Redirected to home page

---

## Testing

### Test Unit Conversions:

**Height:**
- Enter 175 cm → Switch to ft → Should show ~5'9"
- Enter 6'0" → Switch to cm → Should show ~183 cm

**Weight:**
- Enter 70 kg → Switch to lbs → Should show ~154 lbs
- Enter 150 lbs → Switch to kg → Should show ~68 kg

### Test Dashboard Redirect:

1. Go to /profile
2. Fill in any field
3. Click "Save Profile"
4. Should redirect to /dashboard

### Test Account Deletion:

1. Sign in with a test account
2. Go to /profile
3. Click "Delete Account"
4. Check email for confirmation link
5. Click link
6. Verify account is deleted (try logging in)

---

## Security Considerations

1. **Email Verification**: Prevents accidental deletions
2. **Token Expiration**: 24-hour limit on deletion links
3. **One-Time Use**: Tokens are deleted after use
4. **Cascade Delete**: Database automatically removes related data
5. **Guest Protection**: Guest accounts cannot be deleted (data stored locally)

---

## Troubleshooting

### Units not converting:
- Check browser console for errors
- Verify input format (5.11 for feet/inches)
- Clear browser cache

### Not redirecting to dashboard:
- Check if `router.push('/dashboard')` is called
- Verify dashboard route exists
- Check for JavaScript errors

### Deletion email not sending:
- Verify Resend API key is valid
- Check `RESEND_FROM_EMAIL` is configured
- Look at server logs for errors
- Ensure migration 005 was run

### Deletion confirmation fails:
- Check if token is still valid (24hr limit)
- Verify migration created the table
- Check server logs for database errors

---

## Future Enhancements

Potential improvements:
- Remember user's preferred units
- Add more unit options (stones for weight, etc.)
- Export data before deletion
- Account suspension instead of immediate deletion
- Deletion cooldown period (7-30 days)
