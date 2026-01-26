# Custom Email Setup for CalTrack

This guide explains how to set up custom branded emails for authentication in CalTrack.

## Overview

We've created two custom email templates:

1. **Confirmation Email** (`templates/confirmation.html`) - Sent when users sign up
2. **Welcome Email** (`templates/invite.html`) - Sent after users confirm their email

## Local Development

### Email Templates

The email templates are configured in `supabase/config.toml`:

```toml
[auth.email.template.confirmation]
subject = "Confirm Your CalTrack Account"
content_path = "./supabase/templates/confirmation.html"
```

When running locally with `supabase start`, emails are captured by Inbucket (email testing server) at:
- **Web Interface**: http://localhost:54324
- You can view all emails sent during development here

### Testing Email Flow

1. Start the Supabase local development server:
   ```bash
   npx supabase start
   ```

2. Start your Next.js app:
   ```bash
   npm run dev
   ```

3. Sign up with a new account at http://localhost:3000/auth/signup

4. Check Inbucket at http://localhost:54324 to see the confirmation email

5. Click the confirmation link in the email

6. The welcome email will be triggered (check Inbucket again)

## Production Setup

### Step 1: Configure Email Templates in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Email Templates**
3. For each template (Confirm signup, Magic Link, etc.):
   - Copy the content from the corresponding template file
   - Paste it into the Supabase dashboard editor
   - Update the subject line
   - Save changes

### Step 2: Set Up SMTP Provider

To send real emails in production, you need to configure an SMTP provider:

#### Option A: Using Supabase Built-in SMTP (Recommended for small projects)

Supabase provides basic email sending. Configure it in your dashboard:
- Go to **Project Settings** → **Auth**
- Under **SMTP Settings**, enable and configure your provider

#### Option B: Using External Email Service (Recommended for production)

For better deliverability and tracking, use a dedicated email service:

**Popular Options:**
- [Resend](https://resend.com) - Modern, developer-friendly
- [SendGrid](https://sendgrid.com) - Enterprise-grade
- [Postmark](https://postmarkapp.com) - Great deliverability
- [AWS SES](https://aws.amazon.com/ses/) - Cost-effective at scale

**To integrate an external email service:**

1. Sign up for an email service provider
2. Get your API key
3. Update `app/api/auth/welcome/route.ts` to use your email service:

```typescript
// Example using Resend
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// In your POST handler:
await resend.emails.send({
  from: 'CalTrack <noreply@yourdomain.com>',
  to: user.email,
  subject: 'Welcome to CalTrack! 🎉',
  html: welcomeEmailHTML, // Read from template file
})
```

### Step 3: Update Environment Variables

Add to your `.env.local`:

```env
# Email service API key (choose one based on your provider)
RESEND_API_KEY=your_api_key_here
# or
SENDGRID_API_KEY=your_api_key_here
# or
POSTMARK_API_KEY=your_api_key_here
```

### Step 4: Configure SMTP in Production (for Supabase)

Update your production `config.toml` or use the Supabase dashboard:

```toml
[auth.email.smtp]
enabled = true
host = "smtp.your-provider.com"
port = 587
user = "apikey"
pass = "env(EMAIL_API_KEY)"
admin_email = "noreply@yourdomain.com"
sender_name = "CalTrack"
```

## Email Template Customization

### Available Variables

Both templates support Supabase template variables:

**Confirmation Email:**
- `{{ .ConfirmationURL }}` - Link to confirm email
- `{{ .Email }}` - User's email address
- `{{ .SiteURL }}` - Your app's URL

**Welcome/Invite Email:**
- `{{ .SiteURL }}` - Your app's URL
- `{{ .Email }}` - User's email address

### Customizing Templates

1. Edit the HTML files in `supabase/templates/`
2. Test locally using Inbucket
3. Deploy to production via Supabase dashboard

### Branding Tips

- Replace the emoji logo (🍽️) with your actual logo image
- Update colors to match your brand
- Modify copy to match your brand voice
- Test on multiple email clients (Gmail, Outlook, Apple Mail)

## Database Schema

The welcome email system uses a tracking table:

```sql
-- Tracks which users have received welcome emails
CREATE TABLE public.welcome_emails_sent (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  sent_at timestamptz DEFAULT now()
);
```

This prevents sending duplicate welcome emails to the same user.

## Troubleshooting

### Emails not sending in development
- Check that Inbucket is running: http://localhost:54324
- Verify `supabase start` is running
- Check console for errors

### Emails not sending in production
- Verify SMTP settings in Supabase dashboard
- Check email service API key is valid
- Review Supabase logs for errors
- Ensure `enable_confirmations = true` in auth settings

### Welcome email not triggering
- Check browser console for API errors
- Verify `/api/auth/welcome` route is accessible
- Check database for `welcome_emails_sent` table
- Ensure user's email is confirmed (`email_confirmed_at` is set)

### Email going to spam
- Configure SPF, DKIM, and DMARC records for your domain
- Use a dedicated email service (not a generic SMTP)
- Warm up your domain gradually
- Avoid spam trigger words

## Email Best Practices

1. **Authentication**: Always use authenticated SMTP (TLS/SSL)
2. **Rate Limiting**: Respect your email service's rate limits
3. **Unsubscribe**: Add unsubscribe links for marketing emails
4. **Testing**: Test emails on multiple clients before deploying
5. **Monitoring**: Track bounce rates and delivery issues
6. **Personalization**: Use the user's name when available
7. **Mobile-First**: Ensure emails look good on mobile devices

## Next Steps

- [ ] Choose an email service provider
- [ ] Configure SMTP settings
- [ ] Test email flow end-to-end
- [ ] Set up domain authentication (SPF/DKIM)
- [ ] Monitor email delivery rates
- [ ] Create additional email templates as needed

## Additional Resources

- [Supabase Email Templates Docs](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Email Template Testing Tools](https://www.emailonacid.com/)
- [HTML Email Best Practices](https://www.campaignmonitor.com/dev-resources/guides/coding/)
