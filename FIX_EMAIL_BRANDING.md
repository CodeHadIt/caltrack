# Fix Email Subject and Sender - Quick Guide

## Problem
- Email subject shows "Supabase Auth" instead of "Confirm Your CalTrack Account"
- Sender shows `noreply@mailapp.supabase.io` instead of CalTrack

## Solution

### Step 1: Fix Email Subject (Easy - 2 minutes)

1. Go to your Supabase Email Templates:
   👉 https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/auth/templates

2. Select **"Confirm signup"** from the dropdown at the top

3. You'll see two fields:
   - **Subject line**: Change this to:
     ```
     Confirm Your CalTrack Account
     ```

   - **Message body**: Paste the content from `/supabase/templates/confirmation.html`

4. Click **Save** at the bottom

5. **Test it**: Sign up with a new email - subject should now be correct!

---

### Step 2: Fix Sender Email (Requires SMTP Setup)

The sender email `noreply@mailapp.supabase.io` is Supabase's default. To use your own email (like `hello@caltrack.com`), you need to set up **custom SMTP**.

#### Option A: Use Resend for All Emails (Recommended - Easiest)

Instead of using Supabase's built-in emails, send ALL emails through Resend:

**Benefits:**
- Your own branded sender email
- Better deliverability
- More control
- Free tier is generous

**How to set up:**

1. Get Resend API key: https://resend.com/signup

2. Create a new API route for confirmation emails at:
   `/app/api/auth/send-confirmation/route.ts`

3. Configure Supabase to disable built-in confirmation emails:
   - Go to: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/auth/settings
   - Under "Email Auth" → Turn OFF "Confirm email"
   - Handle confirmation in your app code instead

**Note:** This requires more code changes. Let me know if you want me to implement this.

#### Option B: Configure SMTP in Supabase (For Production)

If you want to keep using Supabase's email system but with your own sender:

1. **Get SMTP Credentials** (choose one):
   - **Resend SMTP**: https://resend.com/docs/send-with-smtp
   - **SendGrid SMTP**: https://sendgrid.com
   - **AWS SES**: https://aws.amazon.com/ses/
   - **Postmark**: https://postmarkapp.com

2. **Configure in Supabase:**
   - Go to: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/settings/auth
   - Scroll to **SMTP Settings**
   - Enable **"Enable Custom SMTP"**
   - Fill in:
     ```
     Host: smtp.resend.com (or your SMTP provider)
     Port: 587
     Username: resend (or your SMTP username)
     Password: [Your SMTP password/API key]
     Sender email: noreply@yourdomain.com
     Sender name: CalTrack
     ```

3. **Important**: You need to verify your domain with your SMTP provider first!

4. Click **Save**

---

### Step 3: Verify Domain (For Custom Sender Email)

To send from `hello@caltrack.com` or `noreply@caltrack.com`:

1. **Add your domain to Resend:**
   - Go to: https://resend.com/domains
   - Click "Add Domain"
   - Enter: `caltrack.com`

2. **Add DNS Records:**
   - Resend will give you DNS records (SPF, DKIM, DMARC)
   - Add these to your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.)
   - Example records:
     ```
     Type: TXT
     Name: @
     Value: v=spf1 include:resend.com ~all

     Type: TXT
     Name: resend._domainkey
     Value: [provided by Resend]
     ```

3. **Wait for verification** (usually 5-30 minutes)

4. **Update sender email** in Supabase SMTP settings or Resend config

---

## Quick Fix for Now (Development)

**For testing purposes**, you can keep using Supabase's default sender. Just fix the **subject line** (Step 1 above).

Users won't care too much about the sender email during development, but you should fix it before launching to production.

---

## Summary

✅ **Easy Fix** (Do this now):
- Update subject line in Supabase dashboard

⏳ **For Production** (Do before launch):
- Set up custom SMTP
- Verify your domain
- Update sender email

---

## Need Help?

Let me know if you want me to:
1. Implement Option A (Resend for all emails)
2. Help you configure SMTP settings
3. Create DNS record instructions for your specific domain registrar
