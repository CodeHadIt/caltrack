-- Add images to existing food items
-- Run this in your Supabase SQL Editor

-- Carbs
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=200&h=200&fit=crop' WHERE name = 'Basmati Rice' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1603052875302-d376b7c0638a?w=200&h=200&fit=crop' WHERE name = 'Ripe Plantain' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1586754107546-a3fbd5c5e8f5?w=200&h=200&fit=crop' WHERE name = 'Sweet Potato' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1566207474742-de921626ad0c?w=200&h=200&fit=crop' WHERE name = 'Yam' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop' WHERE name = 'Irish Potatoes' AND is_default = true;

-- Proteins
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=200&h=200&fit=crop' WHERE name = 'Chicken Breast' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=200&fit=crop' WHERE name = 'Chicken Thigh' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=200&h=200&fit=crop' WHERE name = 'Turkey Wings' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=200&h=200&fit=crop' WHERE name = 'Lamb Steak' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=200&h=200&fit=crop' WHERE name = 'Beef Steak' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop' WHERE name = 'Eggs' AND is_default = true;

-- Fats
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200&h=200&fit=crop' WHERE name = 'Avocado' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=200&h=200&fit=crop' WHERE name = 'Groundnut' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=200&h=200&fit=crop' WHERE name = 'Cashew Nuts' AND is_default = true;

-- Fruits
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop' WHERE name = 'Banana' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1584306670957-acf935f5033c?w=200&h=200&fit=crop' WHERE name = 'Apple' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=200&h=200&fit=crop' WHERE name = 'Kiwi' AND is_default = true;

-- Vegetables
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1628773822503-930a7edbf0d8?w=200&h=200&fit=crop' WHERE name = 'Broccoli' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200&h=200&fit=crop' WHERE name = 'Carrots' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=200&h=200&fit=crop' WHERE name = 'Bell Pepper' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=200&h=200&fit=crop' WHERE name = 'Peas' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=200&h=200&fit=crop' WHERE name = 'Green Beans' AND is_default = true;

-- Dairy
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1571212515416-26f6a49e8c78?w=200&h=200&fit=crop' WHERE name = 'Greek Yogurt' AND is_default = true;

-- Snacks
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&h=200&fit=crop' WHERE name = 'Plantain Chips' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop' WHERE name = 'Biscuit' AND is_default = true;
