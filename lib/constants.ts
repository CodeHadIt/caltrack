import { FoodCategory, FoodItem } from '@/types'

export const DEFAULT_CATEGORIES: Omit<FoodCategory, 'created_at'>[] = [
  { id: 'cat-carbs', name: 'Carbs', icon: '🍚', color: '#f59e0b' },
  { id: 'cat-proteins', name: 'Proteins', icon: '🥩', color: '#ef4444' },
  { id: 'cat-fats', name: 'Fats', icon: '🥑', color: '#84cc16' },
  { id: 'cat-fruits', name: 'Fruits', icon: '🍎', color: '#22c55e' },
  { id: 'cat-vegetables', name: 'Vegetables', icon: '🥬', color: '#10b981' },
  { id: 'cat-dairy', name: 'Dairy', icon: '🥛', color: '#3b82f6' },
  { id: 'cat-snacks', name: 'Snacks', icon: '🍿', color: '#8b5cf6' },
]

export const DEFAULT_FOODS: Omit<FoodItem, 'id' | 'created_at' | 'user_id'>[] = [
  // Carbs
  { category_id: 'cat-carbs', name: 'Basmati Rice', calories_per_100g: 150, protein_per_100g: 3.5, carbs_per_100g: 32, fat_per_100g: 0.4, image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop', is_default: true },
  { category_id: 'cat-carbs', name: 'Ripe Plantain', calories_per_100g: 122, protein_per_100g: 1.3, carbs_per_100g: 32, fat_per_100g: 0.4, image_url: 'https://images.unsplash.com/photo-1603052875302-d376b7c0638a?w=200&h=200&fit=crop', is_default: true },
  { category_id: 'cat-carbs', name: 'Sweet Potato', calories_per_100g: 86, protein_per_100g: 1.6, carbs_per_100g: 20, fat_per_100g: 0.1, image_url: 'https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=200&h=200&fit=crop', is_default: true },
  { category_id: 'cat-carbs', name: 'Yam', calories_per_100g: 118, protein_per_100g: 1.5, carbs_per_100g: 28, fat_per_100g: 0.2, image_url: 'https://images.unsplash.com/photo-1516747773440-e1417d61e89a?w=200&h=200&fit=crop', is_default: true },

  // Proteins
  { category_id: 'cat-proteins', name: 'Chicken Breast', calories_per_100g: 165, protein_per_100g: 31, carbs_per_100g: 0, fat_per_100g: 3.6, image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&h=200&fit=crop', is_default: true },
  { category_id: 'cat-proteins', name: 'Chicken Thigh', calories_per_100g: 209, protein_per_100g: 26, carbs_per_100g: 0, fat_per_100g: 11, image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=200&fit=crop', is_default: true },
  { category_id: 'cat-proteins', name: 'Turkey Wings', calories_per_100g: 197, protein_per_100g: 28, carbs_per_100g: 0, fat_per_100g: 9, image_url: 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=200&h=200&fit=crop', is_default: true },
  { category_id: 'cat-proteins', name: 'Lamb Steak', calories_per_100g: 250, protein_per_100g: 25, carbs_per_100g: 0, fat_per_100g: 16, image_url: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=200&h=200&fit=crop', is_default: true },
  { category_id: 'cat-proteins', name: 'Beef Steak', calories_per_100g: 271, protein_per_100g: 26, carbs_per_100g: 0, fat_per_100g: 18, image_url: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=200&h=200&fit=crop', is_default: true },
  { category_id: 'cat-proteins', name: 'Eggs', calories_per_100g: 155, protein_per_100g: 13, carbs_per_100g: 1.1, fat_per_100g: 11, image_url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop', is_default: true },

  // Fats
  { category_id: 'cat-fats', name: 'Avocado', calories_per_100g: 160, protein_per_100g: 2, carbs_per_100g: 9, fat_per_100g: 15, image_url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200&h=200&fit=crop', is_default: true },
  { category_id: 'cat-fats', name: 'Groundnut', calories_per_100g: 567, protein_per_100g: 26, carbs_per_100g: 16, fat_per_100g: 49, image_url: 'https://images.unsplash.com/photo-1543158181-1274e5362710?w=200&h=200&fit=crop', is_default: true },
  { category_id: 'cat-fats', name: 'Cashew Nuts', calories_per_100g: 553, protein_per_100g: 18, carbs_per_100g: 30, fat_per_100g: 44, image_url: 'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=200&h=200&fit=crop', is_default: true },

  // Fruits
  { category_id: 'cat-fruits', name: 'Banana', calories_per_100g: 89, protein_per_100g: 1.1, carbs_per_100g: 23, fat_per_100g: 0.3, image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop', is_default: true },
  { category_id: 'cat-fruits', name: 'Apple', calories_per_100g: 52, protein_per_100g: 0.3, carbs_per_100g: 14, fat_per_100g: 0.2, image_url: 'https://images.unsplash.com/photo-1584306670957-acf935f5033c?w=200&h=200&fit=crop', is_default: true },
  { category_id: 'cat-fruits', name: 'Kiwi', calories_per_100g: 61, protein_per_100g: 1.1, carbs_per_100g: 15, fat_per_100g: 0.5, image_url: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=200&h=200&fit=crop', is_default: true },

  // Vegetables
  { category_id: 'cat-vegetables', name: 'Broccoli', calories_per_100g: 34, protein_per_100g: 2.8, carbs_per_100g: 7, fat_per_100g: 0.4, image_url: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200&h=200&fit=crop', is_default: true },
  { category_id: 'cat-vegetables', name: 'Carrots', calories_per_100g: 41, protein_per_100g: 0.9, carbs_per_100g: 10, fat_per_100g: 0.2, image_url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200&h=200&fit=crop', is_default: true },
  { category_id: 'cat-vegetables', name: 'Bell Pepper', calories_per_100g: 31, protein_per_100g: 1, carbs_per_100g: 6, fat_per_100g: 0.3, image_url: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=200&h=200&fit=crop', is_default: true },
  { category_id: 'cat-vegetables', name: 'Peas', calories_per_100g: 81, protein_per_100g: 5, carbs_per_100g: 14, fat_per_100g: 0.4, image_url: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=200&h=200&fit=crop', is_default: true },
  { category_id: 'cat-vegetables', name: 'Green Beans', calories_per_100g: 31, protein_per_100g: 1.8, carbs_per_100g: 7, fat_per_100g: 0.1, image_url: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=200&h=200&fit=crop', is_default: true },

  // Dairy
  { category_id: 'cat-dairy', name: 'Greek Yogurt', calories_per_100g: 97, protein_per_100g: 9, carbs_per_100g: 3.6, fat_per_100g: 5, image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop', is_default: true },

  // Snacks
  { category_id: 'cat-snacks', name: 'Plantain Chips', calories_per_100g: 519, protein_per_100g: 2, carbs_per_100g: 58, fat_per_100g: 31, image_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&h=200&fit=crop', is_default: true },
  { category_id: 'cat-snacks', name: 'Biscuit', calories_per_100g: 502, protein_per_100g: 6, carbs_per_100g: 62, fat_per_100g: 25, image_url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop', is_default: true },
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
