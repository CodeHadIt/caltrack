# Apply Food Images to Your Database

## The Issue

Food items are showing generic icons because the migration that adds image URLs hasn't been applied to your database yet.

## The Fix (2 minutes)

### Step 1: Go to Supabase SQL Editor

Open: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/editor

### Step 2: Copy the Migration

1. Open the file: `/supabase/migrations/003_add_food_images.sql`

2. Copy the **entire content** (all 41 lines)

### Step 3: Run the Migration

1. In the SQL Editor, paste the migration code

2. Click **Run** (or press Cmd/Ctrl + Enter)

3. You should see: "Success. No rows returned"

### Step 4: Verify

1. Go to Table Editor: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/editor

2. Click on the **food_items** table

3. Look at the `image_url` column - it should now have Unsplash URLs

4. Example: Chicken Breast should have: `https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&h=200&fit=crop`

### Step 5: Refresh Your App

1. Go back to your app: http://localhost:3000

2. Navigate to the **Foods** page or **Log Food** page

3. All default food items should now show actual food images! 🎉

---

## What This Migration Does

It updates 20+ default food items with high-quality food images from Unsplash:

- **Carbs**: Rice, Plantain, Sweet Potato, Yam
- **Proteins**: Chicken, Turkey, Lamb, Beef, Eggs
- **Fats**: Avocado, Groundnut, Cashews
- **Fruits**: Banana, Apple, Kiwi
- **Vegetables**: Broccoli, Carrots, Bell Pepper, Peas, Green Beans
- **Dairy**: Greek Yogurt
- **Snacks**: Plantain Chips, Biscuits

---

## Already Applied?

To check if you've already run this migration:

1. Go to: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/database/migrations

2. Look for migration **003_add_food_images**

3. If it's listed and has a checkmark ✓, it's already applied

4. If not listed, run it using the steps above

---

## Custom Foods

Custom foods created by users will still show category icons until users add their own image URLs through the food form.

---

## Troubleshooting

### Images still not showing after migration:

1. **Clear browser cache**: Cmd/Ctrl + Shift + R

2. **Check dev server**: Make sure `npm run dev` is running

3. **Verify in database**:
   - Go to food_items table
   - Check a food like "Chicken Breast"
   - Confirm `image_url` column has a URL

4. **Check console**: Look for image loading errors in browser console (F12)

### Migration fails:

- **Error: "column image_url does not exist"**
  - You need to run migration `001_initial_schema.sql` first
  - This creates the database structure including the `image_url` column

- **Error: "relation food_items does not exist"**
  - Run all previous migrations in order:
    1. `001_initial_schema.sql`
    2. `002_update_foods.sql`
    3. `003_add_food_images.sql`

---

## Quick Command (If using Supabase CLI)

If you have Supabase CLI set up and linked:

```bash
npx supabase db push
```

This will apply all pending migrations automatically.
