import { FoodCategory, FoodItem } from '@/types'

export const DEFAULT_CATEGORIES: Omit<FoodCategory, 'created_at'>[] = [
  { id: 'cat-proteins', name: 'Proteins', icon: '🥩', color: '#ef4444' },
  { id: 'cat-carbs', name: 'Carbs', icon: '🍚', color: '#f59e0b' },
  { id: 'cat-fruits', name: 'Fruits', icon: '🍎', color: '#22c55e' },
  { id: 'cat-vegetables', name: 'Vegetables', icon: '🥬', color: '#10b981' },
  { id: 'cat-dairy', name: 'Dairy', icon: '🥛', color: '#3b82f6' },
  { id: 'cat-snacks', name: 'Snacks', icon: '🍿', color: '#8b5cf6' },
]

export const DEFAULT_FOODS: Omit<FoodItem, 'id' | 'created_at' | 'user_id'>[] = [
  // Proteins
  { category_id: 'cat-proteins', name: 'Chicken Breast', calories_per_100g: 165, protein_per_100g: 31, carbs_per_100g: 0, fat_per_100g: 3.6, image_url: null, is_default: true },
  { category_id: 'cat-proteins', name: 'Beef (Lean)', calories_per_100g: 250, protein_per_100g: 26, carbs_per_100g: 0, fat_per_100g: 15, image_url: null, is_default: true },
  { category_id: 'cat-proteins', name: 'Salmon', calories_per_100g: 208, protein_per_100g: 20, carbs_per_100g: 0, fat_per_100g: 13, image_url: null, is_default: true },
  { category_id: 'cat-proteins', name: 'Eggs', calories_per_100g: 155, protein_per_100g: 13, carbs_per_100g: 1.1, fat_per_100g: 11, image_url: null, is_default: true },
  { category_id: 'cat-proteins', name: 'Tofu', calories_per_100g: 76, protein_per_100g: 8, carbs_per_100g: 1.9, fat_per_100g: 4.8, image_url: null, is_default: true },
  { category_id: 'cat-proteins', name: 'Tuna', calories_per_100g: 132, protein_per_100g: 29, carbs_per_100g: 0, fat_per_100g: 1, image_url: null, is_default: true },
  { category_id: 'cat-proteins', name: 'Shrimp', calories_per_100g: 99, protein_per_100g: 24, carbs_per_100g: 0.2, fat_per_100g: 0.3, image_url: null, is_default: true },

  // Carbs
  { category_id: 'cat-carbs', name: 'White Rice (cooked)', calories_per_100g: 130, protein_per_100g: 2.7, carbs_per_100g: 28, fat_per_100g: 0.3, image_url: null, is_default: true },
  { category_id: 'cat-carbs', name: 'Brown Rice (cooked)', calories_per_100g: 112, protein_per_100g: 2.6, carbs_per_100g: 24, fat_per_100g: 0.9, image_url: null, is_default: true },
  { category_id: 'cat-carbs', name: 'Bread (White)', calories_per_100g: 265, protein_per_100g: 9, carbs_per_100g: 49, fat_per_100g: 3.2, image_url: null, is_default: true },
  { category_id: 'cat-carbs', name: 'Pasta (cooked)', calories_per_100g: 131, protein_per_100g: 5, carbs_per_100g: 25, fat_per_100g: 1.1, image_url: null, is_default: true },
  { category_id: 'cat-carbs', name: 'Oats', calories_per_100g: 389, protein_per_100g: 17, carbs_per_100g: 66, fat_per_100g: 7, image_url: null, is_default: true },
  { category_id: 'cat-carbs', name: 'Potato', calories_per_100g: 77, protein_per_100g: 2, carbs_per_100g: 17, fat_per_100g: 0.1, image_url: null, is_default: true },
  { category_id: 'cat-carbs', name: 'Sweet Potato', calories_per_100g: 86, protein_per_100g: 1.6, carbs_per_100g: 20, fat_per_100g: 0.1, image_url: null, is_default: true },

  // Fruits
  { category_id: 'cat-fruits', name: 'Apple', calories_per_100g: 52, protein_per_100g: 0.3, carbs_per_100g: 14, fat_per_100g: 0.2, image_url: null, is_default: true },
  { category_id: 'cat-fruits', name: 'Banana', calories_per_100g: 89, protein_per_100g: 1.1, carbs_per_100g: 23, fat_per_100g: 0.3, image_url: null, is_default: true },
  { category_id: 'cat-fruits', name: 'Orange', calories_per_100g: 47, protein_per_100g: 0.9, carbs_per_100g: 12, fat_per_100g: 0.1, image_url: null, is_default: true },
  { category_id: 'cat-fruits', name: 'Strawberries', calories_per_100g: 32, protein_per_100g: 0.7, carbs_per_100g: 8, fat_per_100g: 0.3, image_url: null, is_default: true },
  { category_id: 'cat-fruits', name: 'Blueberries', calories_per_100g: 57, protein_per_100g: 0.7, carbs_per_100g: 14, fat_per_100g: 0.3, image_url: null, is_default: true },
  { category_id: 'cat-fruits', name: 'Grapes', calories_per_100g: 69, protein_per_100g: 0.7, carbs_per_100g: 18, fat_per_100g: 0.2, image_url: null, is_default: true },

  // Vegetables
  { category_id: 'cat-vegetables', name: 'Broccoli', calories_per_100g: 34, protein_per_100g: 2.8, carbs_per_100g: 7, fat_per_100g: 0.4, image_url: null, is_default: true },
  { category_id: 'cat-vegetables', name: 'Spinach', calories_per_100g: 23, protein_per_100g: 2.9, carbs_per_100g: 3.6, fat_per_100g: 0.4, image_url: null, is_default: true },
  { category_id: 'cat-vegetables', name: 'Carrots', calories_per_100g: 41, protein_per_100g: 0.9, carbs_per_100g: 10, fat_per_100g: 0.2, image_url: null, is_default: true },
  { category_id: 'cat-vegetables', name: 'Cucumber', calories_per_100g: 16, protein_per_100g: 0.7, carbs_per_100g: 3.6, fat_per_100g: 0.1, image_url: null, is_default: true },
  { category_id: 'cat-vegetables', name: 'Tomatoes', calories_per_100g: 18, protein_per_100g: 0.9, carbs_per_100g: 3.9, fat_per_100g: 0.2, image_url: null, is_default: true },
  { category_id: 'cat-vegetables', name: 'Bell Peppers', calories_per_100g: 31, protein_per_100g: 1, carbs_per_100g: 6, fat_per_100g: 0.3, image_url: null, is_default: true },

  // Dairy
  { category_id: 'cat-dairy', name: 'Whole Milk', calories_per_100g: 61, protein_per_100g: 3.2, carbs_per_100g: 4.8, fat_per_100g: 3.3, image_url: null, is_default: true },
  { category_id: 'cat-dairy', name: 'Greek Yogurt', calories_per_100g: 97, protein_per_100g: 9, carbs_per_100g: 3.6, fat_per_100g: 5, image_url: null, is_default: true },
  { category_id: 'cat-dairy', name: 'Cheddar Cheese', calories_per_100g: 403, protein_per_100g: 25, carbs_per_100g: 1.3, fat_per_100g: 33, image_url: null, is_default: true },
  { category_id: 'cat-dairy', name: 'Cottage Cheese', calories_per_100g: 98, protein_per_100g: 11, carbs_per_100g: 3.4, fat_per_100g: 4.3, image_url: null, is_default: true },
  { category_id: 'cat-dairy', name: 'Mozzarella', calories_per_100g: 280, protein_per_100g: 28, carbs_per_100g: 3.1, fat_per_100g: 17, image_url: null, is_default: true },

  // Snacks
  { category_id: 'cat-snacks', name: 'Almonds', calories_per_100g: 579, protein_per_100g: 21, carbs_per_100g: 22, fat_per_100g: 50, image_url: null, is_default: true },
  { category_id: 'cat-snacks', name: 'Peanuts', calories_per_100g: 567, protein_per_100g: 26, carbs_per_100g: 16, fat_per_100g: 49, image_url: null, is_default: true },
  { category_id: 'cat-snacks', name: 'Protein Bar', calories_per_100g: 350, protein_per_100g: 25, carbs_per_100g: 35, fat_per_100g: 12, image_url: null, is_default: true },
  { category_id: 'cat-snacks', name: 'Dark Chocolate', calories_per_100g: 546, protein_per_100g: 5, carbs_per_100g: 60, fat_per_100g: 31, image_url: null, is_default: true },
  { category_id: 'cat-snacks', name: 'Popcorn (air-popped)', calories_per_100g: 387, protein_per_100g: 13, carbs_per_100g: 78, fat_per_100g: 4.5, image_url: null, is_default: true },
]

export const BODY_FAT_CATEGORIES = {
  male: [
    { max: 6, category: 'Essential Fat' },
    { max: 14, category: 'Athletes' },
    { max: 18, category: 'Fitness' },
    { max: 25, category: 'Average' },
    { max: 100, category: 'Obese' },
  ],
  female: [
    { max: 14, category: 'Essential Fat' },
    { max: 21, category: 'Athletes' },
    { max: 25, category: 'Fitness' },
    { max: 32, category: 'Average' },
    { max: 100, category: 'Obese' },
  ],
}
