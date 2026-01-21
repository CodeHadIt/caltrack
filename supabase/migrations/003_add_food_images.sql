-- Add images to existing food items
-- Run this in your Supabase SQL Editor

-- Carbs
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop' WHERE name = 'Basmati Rice' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1603052875302-d376b7c0638a?w=200&h=200&fit=crop' WHERE name = 'Ripe Plantain' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1619608246899-d972ae8d26b2?w=200&h=200&fit=crop' WHERE name = 'Sweet Potato' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1594282486756-576bf05ed4b3?w=200&h=200&fit=crop' WHERE name = 'Yam' AND is_default = true;

-- Proteins
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&h=200&fit=crop' WHERE name = 'Chicken Breast' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=200&fit=crop' WHERE name = 'Chicken Thigh' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=200&h=200&fit=crop' WHERE name = 'Turkey Wings' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=200&h=200&fit=crop' WHERE name = 'Lamb Steak' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=200&h=200&fit=crop' WHERE name = 'Beef Steak' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop' WHERE name = 'Eggs' AND is_default = true;

-- Fats
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200&h=200&fit=crop' WHERE name = 'Avocado' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1543158181-1274e5362710?w=200&h=200&fit=crop' WHERE name = 'Groundnut' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=200&h=200&fit=crop' WHERE name = 'Cashew Nuts' AND is_default = true;

-- Fruits
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop' WHERE name = 'Banana' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1584306670957-acf935f5033c?w=200&h=200&fit=crop' WHERE name = 'Apple' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=200&h=200&fit=crop' WHERE name = 'Kiwi' AND is_default = true;

-- Vegetables
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200&h=200&fit=crop' WHERE name = 'Broccoli' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200&h=200&fit=crop' WHERE name = 'Carrots' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=200&h=200&fit=crop' WHERE name = 'Bell Pepper' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=200&h=200&fit=crop' WHERE name = 'Peas' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=200&h=200&fit=crop' WHERE name = 'Green Beans' AND is_default = true;

-- Dairy
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop' WHERE name = 'Greek Yogurt' AND is_default = true;

-- Snacks
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&h=200&fit=crop' WHERE name = 'Plantain Chips' AND is_default = true;
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop' WHERE name = 'Biscuit' AND is_default = true;
