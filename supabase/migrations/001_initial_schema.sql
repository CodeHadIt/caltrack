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
  ('00000000-0000-0000-0000-000000000001', 'Proteins', '🥩', '#ef4444'),
  ('00000000-0000-0000-0000-000000000002', 'Carbs', '🍚', '#f59e0b'),
  ('00000000-0000-0000-0000-000000000003', 'Fruits', '🍎', '#22c55e'),
  ('00000000-0000-0000-0000-000000000004', 'Vegetables', '🥬', '#10b981'),
  ('00000000-0000-0000-0000-000000000005', 'Dairy', '🥛', '#3b82f6'),
  ('00000000-0000-0000-0000-000000000006', 'Snacks', '🍿', '#8b5cf6')
ON CONFLICT (id) DO NOTHING;

-- Insert default foods

-- Proteins
INSERT INTO food_items (category_id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, is_default) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Chicken Breast', 165, 31, 0, 3.6, true),
  ('00000000-0000-0000-0000-000000000001', 'Beef (Lean)', 250, 26, 0, 15, true),
  ('00000000-0000-0000-0000-000000000001', 'Salmon', 208, 20, 0, 13, true),
  ('00000000-0000-0000-0000-000000000001', 'Eggs', 155, 13, 1.1, 11, true),
  ('00000000-0000-0000-0000-000000000001', 'Tofu', 76, 8, 1.9, 4.8, true),
  ('00000000-0000-0000-0000-000000000001', 'Tuna', 132, 29, 0, 1, true),
  ('00000000-0000-0000-0000-000000000001', 'Shrimp', 99, 24, 0.2, 0.3, true);

-- Carbs
INSERT INTO food_items (category_id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, is_default) VALUES
  ('00000000-0000-0000-0000-000000000002', 'White Rice (cooked)', 130, 2.7, 28, 0.3, true),
  ('00000000-0000-0000-0000-000000000002', 'Brown Rice (cooked)', 112, 2.6, 24, 0.9, true),
  ('00000000-0000-0000-0000-000000000002', 'Bread (White)', 265, 9, 49, 3.2, true),
  ('00000000-0000-0000-0000-000000000002', 'Pasta (cooked)', 131, 5, 25, 1.1, true),
  ('00000000-0000-0000-0000-000000000002', 'Oats', 389, 17, 66, 7, true),
  ('00000000-0000-0000-0000-000000000002', 'Potato', 77, 2, 17, 0.1, true),
  ('00000000-0000-0000-0000-000000000002', 'Sweet Potato', 86, 1.6, 20, 0.1, true);

-- Fruits
INSERT INTO food_items (category_id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, is_default) VALUES
  ('00000000-0000-0000-0000-000000000003', 'Apple', 52, 0.3, 14, 0.2, true),
  ('00000000-0000-0000-0000-000000000003', 'Banana', 89, 1.1, 23, 0.3, true),
  ('00000000-0000-0000-0000-000000000003', 'Orange', 47, 0.9, 12, 0.1, true),
  ('00000000-0000-0000-0000-000000000003', 'Strawberries', 32, 0.7, 8, 0.3, true),
  ('00000000-0000-0000-0000-000000000003', 'Blueberries', 57, 0.7, 14, 0.3, true),
  ('00000000-0000-0000-0000-000000000003', 'Grapes', 69, 0.7, 18, 0.2, true);

-- Vegetables
INSERT INTO food_items (category_id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, is_default) VALUES
  ('00000000-0000-0000-0000-000000000004', 'Broccoli', 34, 2.8, 7, 0.4, true),
  ('00000000-0000-0000-0000-000000000004', 'Spinach', 23, 2.9, 3.6, 0.4, true),
  ('00000000-0000-0000-0000-000000000004', 'Carrots', 41, 0.9, 10, 0.2, true),
  ('00000000-0000-0000-0000-000000000004', 'Cucumber', 16, 0.7, 3.6, 0.1, true),
  ('00000000-0000-0000-0000-000000000004', 'Tomatoes', 18, 0.9, 3.9, 0.2, true),
  ('00000000-0000-0000-0000-000000000004', 'Bell Peppers', 31, 1, 6, 0.3, true);

-- Dairy
INSERT INTO food_items (category_id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, is_default) VALUES
  ('00000000-0000-0000-0000-000000000005', 'Whole Milk', 61, 3.2, 4.8, 3.3, true),
  ('00000000-0000-0000-0000-000000000005', 'Greek Yogurt', 97, 9, 3.6, 5, true),
  ('00000000-0000-0000-0000-000000000005', 'Cheddar Cheese', 403, 25, 1.3, 33, true),
  ('00000000-0000-0000-0000-000000000005', 'Cottage Cheese', 98, 11, 3.4, 4.3, true),
  ('00000000-0000-0000-0000-000000000005', 'Mozzarella', 280, 28, 3.1, 17, true);

-- Snacks
INSERT INTO food_items (category_id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, is_default) VALUES
  ('00000000-0000-0000-0000-000000000006', 'Almonds', 579, 21, 22, 50, true),
  ('00000000-0000-0000-0000-000000000006', 'Peanuts', 567, 26, 16, 49, true),
  ('00000000-0000-0000-0000-000000000006', 'Protein Bar', 350, 25, 35, 12, true),
  ('00000000-0000-0000-0000-000000000006', 'Dark Chocolate', 546, 5, 60, 31, true),
  ('00000000-0000-0000-0000-000000000006', 'Popcorn (air-popped)', 387, 13, 78, 4.5, true);
