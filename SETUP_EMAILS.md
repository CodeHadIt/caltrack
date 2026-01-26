# Setting Up CalTrack Emails - Quick Guide

## Overview

CalTrack has **TWO** types of emails:

1. **Confirmation Email** (when user signs up) → Handled by **Supabase**
2. **Welcome Email** (after email is confirmed) → Handled by **Your App** (via Resend)

---

## Step 1: Setup Confirmation Email in Supabase

This is the "Confirm your email" message users get when signing up.

### What to do:

1. Go to: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/auth/templates

2. Select **"Confirm signup"** from the dropdown

3. Update the **Subject** to:
   ```
   Confirm Your CalTrack Account
   ```

4. **Copy the entire content** from: `/supabase/templates/confirmation.html`

5. **Paste** it into the template editor (replacing everything)

6. Click **Save**

### Test it:
- Sign up with a new account
- Check your email for the confirmation message
- It should have CalTrack branding (no Supabase references)

---

## Step 2: Setup Welcome Email with Resend

This is the "Welcome! 🎉" message users get AFTER confirming their email.

### A. Get a Resend API Key (FREE)

1. Go to: https://resend.com/signup

2. Sign up for a free account

3. Verify your email

4. Go to **API Keys**: https://resend.com/api-keys

5. Click **"Create API Key"**

6. Copy the API key (starts with `re_...`)

### B. Add API Key to Your Project

Add these to your `.env.local` file:

```env
# Resend Email Service
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev

# Site URL for emails
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

**Note:**
- For development, you can use `onboarding@resend.dev` (Resend's test email)
- For production, you'll need to verify your own domain

### C. Verify Your Domain (Production Only)

To send emails from your own domain (e.g., `hello@caltrack.com`):

1. Go to: https://resend.com/domains

2. Click **"Add Domain"**

3. Enter your domain (e.g., `caltrack.com`)

4. Add the DNS records Resend provides to your domain registrar

5. Wait for verification (usually a few minutes)

6. Update `.env.local`:
   ```env
   RESEND_FROM_EMAIL=hello@caltrack.com
   ```

### Test it:
1. Sign up with a new account
2. Confirm your email (click the link in confirmation email)
3. Check your inbox - you should receive the welcome email with the 🎉 celebration header

---

## Step 3: Enable Email Confirmations (Optional)

By default, users don't need to confirm their email. To require confirmation:

1. Go to: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/auth/settings

2. Scroll to **"Email Auth"**

3. Toggle **"Confirm email"** to **ON**

4. Click **Save**

Now users MUST confirm their email before they can sign in.

---

## What Each Template Does

### `confirmation.html` (Supabase)
- **When**: User signs up
- **Purpose**: Verify email address
- **Contains**: Confirmation button/link
- **Managed by**: Supabase (via dashboard)

### `invite.html` (Your App via Resend)
- **When**: User confirms email
- **Purpose**: Welcome message & onboarding
- **Contains**: Feature highlights, dashboard link
- **Managed by**: Your app code (`/api/auth/welcome`)

---

## Environment Variables Summary

Add these to `.env.local`:

```env
# Existing Supabase vars
NEXT_PUBLIC_SUPABASE_URL=https://txolhskqfdezbrixptnu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# New email vars
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production, update `NEXT_PUBLIC_SITE_URL` to your actual domain.

---

## Troubleshooting

### "Confirmation email looks wrong"
- Make sure you copied the ENTIRE content from `confirmation.html`
- Check you're editing "Confirm signup" (not "Invite user")
- Clear browser cache and try again

### "Welcome email not sending"
- Check `.env.local` has `RESEND_API_KEY`
- Verify API key is valid at https://resend.com/api-keys
- Check server console for error messages
- Ensure email was confirmed (check `email_confirmed_at` in Supabase users table)

### "Emails going to spam"
- Use Resend's test email (`onboarding@resend.dev`) in development
- For production, verify your domain with Resend
- Set up SPF/DKIM records (Resend provides these)

### "Welcome email sent twice"
- This shouldn't happen - we check `welcome_emails_sent` table
- If it does, check the table in Supabase: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/editor

---

## Quick Test Checklist

- [ ] Confirmation email has CalTrack branding (no Supabase logo)
- [ ] Confirmation link works and logs user in
- [ ] Welcome email arrives after confirmation
- [ ] Welcome email has 🎉 header and CalTrack branding
- [ ] "Go to Dashboard" button works
- [ ] No duplicate emails sent

---

## Need Help?

- **Resend Docs**: https://resend.com/docs
- **Supabase Email Docs**: https://supabase.com/docs/guides/auth/auth-email-templates
- **Check Logs**: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/logs/explorer
