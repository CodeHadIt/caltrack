# Update Food Images - Quick Guide

## What's New

This update includes:
- ✅ **Better quality images** for existing food items
- ✅ **Irish Potatoes** added as a new carb option

## Images Updated

### Improved Images:
- **Basmati Rice** - Now shows actual long grain rice
- **Beef Steak** - Now shows a cooked steak (not raw)
- **Broccoli** - Clearer, more vibrant picture
- **Cashew Nuts** - Better quality cashew image
- **Chicken Breast** - Now shows cooked chicken (not raw)
- **Greek Yogurt** - Shows yogurt in a bowl
- **Groundnut** - Actual peanut image
- **Sweet Potatoes** - Unpeeled sweet potatoes
- **Yam** - Better quality yam picture

### New Food Item:
- **Irish Potatoes** - Added to Carbs category
  - Calories: 77 per 100g
  - Protein: 2g
  - Carbs: 17g
  - Fat: 0.1g

---

## How to Apply This Update

### Step 1: Go to Supabase SQL Editor

Open: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/editor

### Step 2: Run the Migration

1. **Copy** the entire content from `/supabase/migrations/006_update_food_images.sql`

2. **Paste** in SQL Editor

3. **Click Run**

4. ✅ Success! All images updated and Irish Potatoes added

### Step 3: Verify

**Check in your app:**
1. Go to http://localhost:3000/foods
2. Look for the updated images on existing foods
3. Look for "Irish Potatoes" in the Carbs section

**Check in database:**
1. Go to Table Editor: https://supabase.com/dashboard/project/txolhskqfdezbrixptnu/editor
2. Open `food_items` table
3. Verify Irish Potatoes exists
4. Check that image URLs have been updated

---

## Image URLs Reference

Here are the new Unsplash image URLs being used:

### Carbs:
- **Basmati Rice**: `photo-1536304993881-ff6e9eefa2a6` (long grain rice)
- **Sweet Potato**: `photo-1586754107546-a3fbd5c5e8f5` (unpeeled)
- **Yam**: `photo-1566207474742-de921626ad0c` (actual yam)
- **Irish Potatoes**: `photo-1518977676601-b53f82aba655` (NEW)

### Proteins:
- **Chicken Breast**: `photo-1587593810167-a84920ea0781` (cooked)
- **Beef Steak**: `photo-1588168333986-5078d3ae3976` (cooked steak)

### Fats:
- **Groundnut**: `photo-1608797178974-15b35a64ede9` (peanuts)
- **Cashew Nuts**: `photo-1585704032915-c3400ca199e7` (cashews)

### Vegetables:
- **Broccoli**: `photo-1628773822503-930a7edbf0d8` (clearer)

### Dairy:
- **Greek Yogurt**: `photo-1571212515416-26f6a49e8c78` (in bowl)

---

## Notes

- **Safe to run multiple times**: The migration uses `INSERT ... WHERE NOT EXISTS` for Irish Potatoes, so it won't create duplicates
- **Only updates default foods**: User custom foods are not affected
- **Image size**: All images are optimized at 200x200px with crop
- **Free images**: All images from Unsplash (free to use)

---

## For New Installations

If you're setting up a fresh database, make sure to run migrations in order:
1. `001_initial_schema.sql`
2. `002_update_foods.sql` (includes Irish Potatoes now)
3. `003_add_food_images.sql` (includes all updated images)
4. Skip `006_update_food_images.sql` (not needed for fresh install)

---

## Troubleshooting

### Images not showing:
- Clear browser cache (Cmd/Ctrl + Shift + R)
- Check if migration ran successfully
- Verify image URLs in database table

### Irish Potatoes not appearing:
- Check if migration ran without errors
- Verify in database: `SELECT * FROM food_items WHERE name = 'Irish Potatoes'`
- Make sure category ID '00000000-0000-0000-0000-000000000001' exists

### Old images still showing:
- Hard refresh browser
- Check `image_url` column in database to confirm URLs changed
- Restart dev server
