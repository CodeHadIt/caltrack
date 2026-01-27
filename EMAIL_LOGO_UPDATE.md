# Email Logo Update - Important Notes

## What Changed

Both email templates now use the **actual CalTrack logo** instead of emojis:
- ✅ `confirmation.html` - Confirmation email
- ✅ `invite.html` - Welcome email

## How Logo Works in Emails

The templates use: `{{ .SiteURL }}/caltrack_logo.png`

This means the logo is loaded from your deployed website URL.

### For Supabase Dashboard (Confirmation Email):

When you paste `confirmation.html` into Supabase:
- Supabase replaces `{{ .SiteURL }}` with your configured site URL
- In production: Logo loads from `https://yourdomain.com/caltrack_logo.png`
- In development: Logo loads from `http://localhost:3000/caltrack_logo.png`

### For Resend (Welcome Email):

The API route automatically replaces `{{ .SiteURL }}` with:
- Value from `NEXT_PUBLIC_SITE_URL` in your `.env.local`
- Make sure this matches your deployed domain in production

## Setup Checklist

### Local Development:

1. ✅ `.env.local` should have:
   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

2. ✅ Make sure logo exists at `/public/caltrack_logo.png`

3. Test: When you receive emails locally, the logo should load from your local server

### Production Setup:

1. **Deploy your app** to production first (Vercel, Netlify, etc.)

2. **Update Supabase site_url**:
   - Go to: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/auth/settings
   - Update "Site URL" to your production domain: `https://yourdomain.com`

3. **Update production environment variables**:
   ```env
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

4. **Update email template in Supabase**:
   - Go to: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/auth/templates
   - Paste updated `confirmation.html` with logo
   - Supabase will automatically use your production URL

5. **Test**: Sign up with a real email and verify logo appears in both emails

## Logo Specifications

- **Width**: 180px (as specified)
- **Format**: PNG with transparent background
- **Location**: `/public/caltrack_logo.png`
- **File size**: ~1.4MB (consider optimizing for faster email loading)

## Troubleshooting

### Logo not showing in emails:

1. **Check image URL in received email**:
   - View email source/HTML
   - Look for the `<img src="...">` tag
   - Verify the URL is correct

2. **Verify logo is publicly accessible**:
   - Open `https://yourdomain.com/caltrack_logo.png` in browser
   - Should display the logo (not 404)

3. **Check CORS/CDN settings**:
   - Some email clients require images to be served with proper headers
   - Make sure your hosting allows image loading from emails

4. **For local testing**:
   - Logo won't show in actual emails when testing locally
   - Email clients can't access `http://localhost:3000`
   - Solution: Test with deployed preview URL or use placeholder

### Alternative: Host Logo on CDN

If email logo loading is unreliable, consider:
- Upload logo to Supabase Storage
- Use Cloudinary or ImgBB
- Update template with direct CDN URL instead of `{{ .SiteURL }}`

Example with Supabase Storage:
```html
<img src="https://txolhskqfdezbrixptnu.supabase.co/storage/v1/object/public/assets/caltrack_logo.png" />
```

## Optimization Recommendation

Current logo is 1.4MB - consider optimizing:
```bash
# Using ImageMagick
convert caltrack_logo.png -resize 180x -quality 85 caltrack_logo_optimized.png

# Or use online tools:
# - TinyPNG (https://tinypng.com)
# - Squoosh (https://squoosh.app)
```

Target: Under 100KB for faster email loading.
