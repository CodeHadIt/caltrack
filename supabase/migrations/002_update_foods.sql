-- Update Foods Migration
-- Run this in your Supabase SQL Editor to update categories and foods

-- Step 1: Delete existing default food items (user custom foods are preserved)
DELETE FROM food_items WHERE is_default = true;

-- Step 2: Delete existing categories and insert new ones
DELETE FROM food_categories;

-- Step 3: Insert updated categories (including new Fats category)
INSERT INTO food_categories (id, name, icon, color) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Carbs', '🍚', '#f59e0b'),
  ('00000000-0000-0000-0000-000000000002', 'Proteins', '🥩', '#ef4444'),
  ('00000000-0000-0000-0000-000000000003', 'Fats', '🥑', '#84cc16'),
  ('00000000-0000-0000-0000-000000000004', 'Fruits', '🍎', '#22c55e'),
  ('00000000-0000-0000-0000-000000000005', 'Vegetables', '🥬', '#10b981'),
  ('00000000-0000-0000-0000-000000000006', 'Dairy', '🥛', '#3b82f6'),
  ('00000000-0000-0000-0000-000000000007', 'Snacks', '🍿', '#8b5cf6');

-- Step 4: Insert new default foods

-- Carbs
INSERT INTO food_items (category_id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, is_default) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Basmati Rice', 150, 3.5, 32, 0.4, true),
  ('00000000-0000-0000-0000-000000000001', 'Ripe Plantain', 122, 1.3, 32, 0.4, true),
  ('00000000-0000-0000-0000-000000000001', 'Sweet Potato', 86, 1.6, 20, 0.1, true),
  ('00000000-0000-0000-0000-000000000001', 'Yam', 118, 1.5, 28, 0.2, true),
  ('00000000-0000-0000-0000-000000000001', 'Irish Potatoes', 77, 2, 17, 0.1, true);

-- Proteins
INSERT INTO food_items (category_id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, is_default) VALUES
  ('00000000-0000-0000-0000-000000000002', 'Chicken Breast', 165, 31, 0, 3.6, true),
  ('00000000-0000-0000-0000-000000000002', 'Chicken Thigh', 209, 26, 0, 11, true),
  ('00000000-0000-0000-0000-000000000002', 'Turkey Wings', 197, 28, 0, 9, true),
  ('00000000-0000-0000-0000-000000000002', 'Lamb Steak', 250, 25, 0, 16, true),
  ('00000000-0000-0000-0000-000000000002', 'Beef Steak', 271, 26, 0, 18, true),
  ('00000000-0000-0000-0000-000000000002', 'Eggs', 155, 13, 1.1, 11, true);

-- Fats (NEW CATEGORY)
INSERT INTO food_items (category_id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, is_default) VALUES
  ('00000000-0000-0000-0000-000000000003', 'Avocado', 160, 2, 9, 15, true),
  ('00000000-0000-0000-0000-000000000003', 'Groundnut', 567, 26, 16, 49, true),
  ('00000000-0000-0000-0000-000000000003', 'Cashew Nuts', 553, 18, 30, 44, true);

-- Fruits
INSERT INTO food_items (category_id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, is_default) VALUES
  ('00000000-0000-0000-0000-000000000004', 'Banana', 89, 1.1, 23, 0.3, true),
  ('00000000-0000-0000-0000-000000000004', 'Apple', 52, 0.3, 14, 0.2, true),
  ('00000000-0000-0000-0000-000000000004', 'Kiwi', 61, 1.1, 15, 0.5, true);

-- Vegetables
INSERT INTO food_items (category_id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, is_default) VALUES
  ('00000000-0000-0000-0000-000000000005', 'Broccoli', 34, 2.8, 7, 0.4, true),
  ('00000000-0000-0000-0000-000000000005', 'Carrots', 41, 0.9, 10, 0.2, true),
  ('00000000-0000-0000-0000-000000000005', 'Bell Pepper', 31, 1, 6, 0.3, true),
  ('00000000-0000-0000-0000-000000000005', 'Peas', 81, 5, 14, 0.4, true),
  ('00000000-0000-0000-0000-000000000005', 'Green Beans', 31, 1.8, 7, 0.1, true);

-- Dairy
INSERT INTO food_items (category_id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, is_default) VALUES
  ('00000000-0000-0000-0000-000000000006', 'Greek Yogurt', 97, 9, 3.6, 5, true);

-- Snacks
INSERT INTO food_items (category_id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, is_default) VALUES
  ('00000000-0000-0000-0000-000000000007', 'Plantain Chips', 519, 2, 58, 31, true),
  ('00000000-0000-0000-0000-000000000007', 'Biscuit', 502, 6, 62, 25, true);
