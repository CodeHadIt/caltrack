# How to Sync Email Setup to Supabase

## Step 1: Sync Database Migration

### Option A: Using Supabase CLI

1. Login to Supabase CLI:
```bash
npx supabase login
```

2. Link your project:
```bash
npx supabase link --project-ref txolhskqfdezbrixptnu
```

3. Push the migration:
```bash
npx supabase db push
```

### Option B: Using Supabase Dashboard (Manual)

1. Go to https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/editor

2. Click on **SQL Editor** in the left sidebar

3. Open the migration file: `supabase/migrations/004_welcome_email_setup.sql`

4. Copy the entire SQL content

5. Paste it into the SQL Editor

6. Click **Run** to execute the migration

7. Verify the table was created:
   - Go to **Table Editor**
   - Look for `welcome_emails_sent` table

## Step 2: Configure Email Templates in Dashboard

**Important:** Email templates can only be configured through the Supabase dashboard, not via code.

### Configure Confirmation Email

1. Go to: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/auth/templates

2. Select **Confirm signup** from the dropdown

3. Update the **Subject** to:
   ```
   Confirm Your CalTrack Account
   ```

4. Replace the entire template with the content from:
   `supabase/templates/confirmation.html`

5. Click **Save**

### Configure Welcome Email (Optional - for invites)

1. Still in **Email Templates**, select **Invite user**

2. Update the **Subject** to:
   ```
   Welcome to CalTrack! 🎉
   ```

3. Replace the template with content from:
   `supabase/templates/invite.html`

4. Click **Save**

## Step 3: Test the Email Flow

### In Development (Local Testing)

1. Start Supabase locally (if you want to test locally):
```bash
npx supabase start
```

2. View emails at: http://localhost:54324

### In Production (Real Testing)

1. Go to your app: https://yourdomain.com/auth/signup

2. Sign up with a test email

3. Check your email inbox for the confirmation email

4. Click the confirmation link

5. Check for the welcome email (if configured)

## Step 4: View Data in Dashboard

### View Migration Status
- **URL**: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/database/migrations
- Check that migration `004_welcome_email_setup` is listed

### View Database Tables
- **URL**: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/editor
- Look for the `welcome_emails_sent` table
- You should see columns: `id`, `user_id`, `sent_at`

### View Email Templates
- **URL**: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/auth/templates
- Check that your custom templates are configured

### View Auth Settings
- **URL**: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/auth/settings
- Verify email settings:
  - Enable email confirmations (if you want users to confirm)
  - Configure SMTP settings (for production emails)

### View Logs
- **URL**: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/logs/explorer
- Filter by `auth` to see authentication events
- Check for email sending events

### View Users
- **URL**: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/auth/users
- See all registered users
- Check `email_confirmed_at` status

## Important Notes

1. **Email Confirmations**: Currently disabled in your config (`enable_confirmations = false`)
   - To enable: Go to Auth Settings → Email Auth → Enable "Confirm Email"

2. **SMTP Setup**: You need to configure SMTP for production emails
   - Go to: Project Settings → Auth → SMTP Settings
   - Add your email service credentials

3. **Welcome Email API**: The `/api/auth/welcome` endpoint needs an email service
   - Currently just logs to console
   - Integrate with Resend, SendGrid, etc. for production

## Quick Links

- **Auth Templates**: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/auth/templates
- **SQL Editor**: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/editor
- **Table Editor**: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/table
- **Auth Settings**: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/auth/settings
- **Logs**: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/logs/explorer

## Troubleshooting

### Migration not showing up
- Try refreshing the migrations page
- Check SQL Editor for any errors
- Verify you're on the correct project

### Email templates not saving
- Ensure you're using valid HTML
- Check that all Supabase variables are correct: `{{ .ConfirmationURL }}`
- Try clearing browser cache

### Emails not sending
- Check Auth Logs for errors
- Verify SMTP settings
- Test with a different email address
