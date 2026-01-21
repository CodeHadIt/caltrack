-- CalTrack Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  height_cm NUMERIC,
  weight_kg NUMERIC,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female')),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  goal TEXT CHECK (goal IN ('lose', 'maintain', 'gain'))
);

-- Food categories table
CREATE TABLE IF NOT EXISTS food_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Food items table
CREATE TABLE IF NOT EXISTS food_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES food_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  calories_per_100g NUMERIC NOT NULL,
  protein_per_100g NUMERIC NOT NULL,
  carbs_per_100g NUMERIC NOT NULL,
  fat_per_100g NUMERIC NOT NULL,
  image_url TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Food logs table
CREATE TABLE IF NOT EXISTS food_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  food_item_id UUID NOT NULL REFERENCES food_items(id) ON DELETE CASCADE,
  weight_grams NUMERIC NOT NULL,
  meal_time TEXT NOT NULL CHECK (meal_time IN ('breakfast', 'lunch', 'dinner', 'snack')),
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date DATE NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_food_items_user_id ON food_items(user_id);
CREATE INDEX IF NOT EXISTS idx_food_items_category_id ON food_items(category_id);
CREATE INDEX IF NOT EXISTS idx_food_items_is_default ON food_items(is_default);
CREATE INDEX IF NOT EXISTS idx_food_logs_user_id ON food_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_food_logs_date ON food_logs(date);
CREATE INDEX IF NOT EXISTS idx_food_logs_user_date ON food_logs(user_id, date);

-- Row Level Security Policies

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Food categories policies (public read)
CREATE POLICY "Anyone can view categories" ON food_categories
  FOR SELECT USING (true);

-- Food items policies
CREATE POLICY "Anyone can view default foods" ON food_items
  FOR SELECT USING (is_default = true);

CREATE POLICY "Users can view own custom foods" ON food_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own foods" ON food_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own foods" ON food_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own foods" ON food_items
  FOR DELETE USING (auth.uid() = user_id);

-- Food logs policies
CREATE POLICY "Users can view own logs" ON food_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own logs" ON food_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own logs" ON food_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own logs" ON food_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default categories
INSERT INTO food_categories (id, name, icon, color) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Carbs', '🍚', '#f59e0b'),
  ('00000000-0000-0000-0000-000000000002', 'Proteins', '🥩', '#ef4444'),
  ('00000000-0000-0000-0000-000000000003', 'Fats', '🥑', '#84cc16'),
  ('00000000-0000-0000-0000-000000000004', 'Fruits', '🍎', '#22c55e'),
  ('00000000-0000-0000-0000-000000000005', 'Vegetables', '🥬', '#10b981'),
  ('00000000-0000-0000-0000-000000000006', 'Dairy', '🥛', '#3b82f6'),
  ('00000000-0000-0000-0000-000000000007', 'Snacks', '🍿', '#8b5cf6')
ON CONFLICT (id) DO NOTHING;

-- Insert default foods

-- Carbs
INSERT INTO food_items (category_id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, image_url, is_default) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Basmati Rice', 150, 3.5, 32, 0.4, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop', true),
  ('00000000-0000-0000-0000-000000000001', 'Ripe Plantain', 122, 1.3, 32, 0.4, 'https://images.unsplash.com/photo-1603052875302-d376b7c0638a?w=200&h=200&fit=crop', true),
  ('00000000-0000-0000-0000-000000000001', 'Sweet Potato', 86, 1.6, 20, 0.1, 'https://images.unsplash.com/photo-1596097635121-14b63a7a6c19?w=200&h=200&fit=crop', true),
  ('00000000-0000-0000-0000-000000000001', 'Yam', 118, 1.5, 28, 0.2, 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=200&h=200&fit=crop', true);

-- Proteins
INSERT INTO food_items (category_id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, image_url, is_default) VALUES
  ('00000000-0000-0000-0000-000000000002', 'Chicken Breast', 165, 31, 0, 3.6, 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&h=200&fit=crop', true),
  ('00000000-0000-0000-0000-000000000002', 'Chicken Thigh', 209, 26, 0, 11, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=200&fit=crop', true),
  ('00000000-0000-0000-0000-000000000002', 'Turkey Wings', 197, 28, 0, 9, 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=200&h=200&fit=crop', true),
  ('00000000-0000-0000-0000-000000000002', 'Lamb Steak', 250, 25, 0, 16, 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=200&h=200&fit=crop', true),
  ('00000000-0000-0000-0000-000000000002', 'Beef Steak', 271, 26, 0, 18, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=200&h=200&fit=crop', true),
  ('00000000-0000-0000-0000-000000000002', 'Eggs', 155, 13, 1.1, 11, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop', true);

-- Fats
INSERT INTO food_items (category_id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, image_url, is_default) VALUES
  ('00000000-0000-0000-0000-000000000003', 'Avocado', 160, 2, 9, 15, 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200&h=200&fit=crop', true),
  ('00000000-0000-0000-0000-000000000003', 'Groundnut', 567, 26, 16, 49, 'https://images.unsplash.com/photo-1567892320421-1c657571ea4a?w=200&h=200&fit=crop', true),
  ('00000000-0000-0000-0000-000000000003', 'Cashew Nuts', 553, 18, 30, 44, 'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=200&h=200&fit=crop', true);

-- Fruits
INSERT INTO food_items (category_id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, image_url, is_default) VALUES
  ('00000000-0000-0000-0000-000000000004', 'Banana', 89, 1.1, 23, 0.3, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop', true),
  ('00000000-0000-0000-0000-000000000004', 'Apple', 52, 0.3, 14, 0.2, 'https://images.unsplash.com/photo-1584306670957-acf935f5033c?w=200&h=200&fit=crop', true),
  ('00000000-0000-0000-0000-000000000004', 'Kiwi', 61, 1.1, 15, 0.5, 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=200&h=200&fit=crop', true);

-- Vegetables
INSERT INTO food_items (category_id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, image_url, is_default) VALUES
  ('00000000-0000-0000-0000-000000000005', 'Broccoli', 34, 2.8, 7, 0.4, 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200&h=200&fit=crop', true),
  ('00000000-0000-0000-0000-000000000005', 'Carrots', 41, 0.9, 10, 0.2, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200&h=200&fit=crop', true),
  ('00000000-0000-0000-0000-000000000005', 'Bell Pepper', 31, 1, 6, 0.3, 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=200&h=200&fit=crop', true),
  ('00000000-0000-0000-0000-000000000005', 'Peas', 81, 5, 14, 0.4, 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=200&h=200&fit=crop', true),
  ('00000000-0000-0000-0000-000000000005', 'Green Beans', 31, 1.8, 7, 0.1, 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=200&h=200&fit=crop', true);

-- Dairy
INSERT INTO food_items (category_id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, image_url, is_default) VALUES
  ('00000000-0000-0000-0000-000000000006', 'Greek Yogurt', 97, 9, 3.6, 5, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop', true);

-- Snacks
INSERT INTO food_items (category_id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, image_url, is_default) VALUES
  ('00000000-0000-0000-0000-000000000007', 'Plantain Chips', 519, 2, 58, 31, 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&h=200&fit=crop', true),
  ('00000000-0000-0000-0000-000000000007', 'Biscuit', 502, 6, 62, 25, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop', true);
