-- Update food images with better quality pictures and add Irish Potatoes
-- Run this in your Supabase SQL Editor

-- Add Irish Potatoes if it doesn't exist
INSERT INTO food_items (category_id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, is_default, image_url)
SELECT
  '00000000-0000-0000-0000-000000000001',
  'Irish Potatoes',
  77,
  2,
  17,
  0.1,
  true,
  'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop'
WHERE NOT EXISTS (
  SELECT 1 FROM food_items WHERE name = 'Irish Potatoes' AND is_default = true
);

-- Update existing food images with better quality pictures

-- Carbs - Better images
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=200&h=200&fit=crop'
WHERE name = 'Basmati Rice' AND is_default = true;

UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1586754107546-a3fbd5c5e8f5?w=200&h=200&fit=crop'
WHERE name = 'Sweet Potato' AND is_default = true;

UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1566207474742-de921626ad0c?w=200&h=200&fit=crop'
WHERE name = 'Yam' AND is_default = true;

-- Proteins - Cooked chicken breast and better beef steak
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=200&h=200&fit=crop'
WHERE name = 'Chicken Breast' AND is_default = true;

UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=200&h=200&fit=crop'
WHERE name = 'Beef Steak' AND is_default = true;

-- Fats - Better groundnut and cashew pictures
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=200&h=200&fit=crop'
WHERE name = 'Groundnut' AND is_default = true;

UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=200&h=200&fit=crop'
WHERE name = 'Cashew Nuts' AND is_default = true;

-- Vegetables - Clearer broccoli
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1628773822503-930a7edbf0d8?w=200&h=200&fit=crop'
WHERE name = 'Broccoli' AND is_default = true;

-- Dairy - Greek yogurt in bowl
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1571212515416-26f6a49e8c78?w=200&h=200&fit=crop'
WHERE name = 'Greek Yogurt' AND is_default = true;
