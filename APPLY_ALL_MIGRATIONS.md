# Apply All Pending Migrations

## Quick Fix (5 minutes)

You have 2 migrations that need to be applied to your Supabase database.

### Step 1: Go to SQL Editor

Open: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/editor

---

### Step 2: Apply Food Images Migration

1. **Copy this entire SQL** from `/supabase/migrations/003_add_food_images.sql`

2. **Paste in SQL Editor**

3. **Click Run**

4. ✅ Success! Food items now have images

---

### Step 3: Apply Welcome Email Migration

1. **Copy this entire SQL** from `/supabase/migrations/004_welcome_email_setup.sql`

2. **Paste in SQL Editor**

3. **Click Run**

4. ✅ Success! Welcome email tracking table created

---

### Step 4: Verify

**Check Migrations:**
- Go to: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/database/migrations
- You should see both migrations listed with checkmarks ✓

**Check Tables:**
- Go to: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/editor
- You should see a new table: `welcome_emails_sent`

**Check Food Images:**
- In Table Editor, open `food_items` table
- Look at the `image_url` column
- Default foods should have Unsplash URLs

---

### Step 5: Test in Your App

1. **Refresh your app**: http://localhost:3000

2. **Go to Foods page**: http://localhost:3000/foods
   - All food items should now show actual food images! 🎉

3. **Test welcome email**:
   - Sign up with a new account
   - Confirm email
   - Welcome email should send without errors

---

## Errors Fixed

After applying these migrations, you'll no longer see these errors in your console:

❌ Before:
```
Error tracking welcome email: {
  message: "Could not find the table 'public.welcome_emails_sent' in the schema cache"
}
```

✅ After:
```
Welcome email sent to: user@example.com
```

---

## Alternative: Apply All at Once

Copy BOTH migration files' content, paste them one after the other in SQL Editor, then click Run once:

```sql
-- First paste content of 003_add_food_images.sql
-- Then paste content of 004_welcome_email_setup.sql
```

---

## Already Applied?

To check if migrations are already applied:
- Go to: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/database/migrations
- Look for checkmarks next to migration names
