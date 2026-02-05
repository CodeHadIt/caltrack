import { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type FoodCategory = Database['public']['Tables']['food_categories']['Row']
export type FoodItem = Database['public']['Tables']['food_items']['Row']
export type FoodLog = Database['public']['Tables']['food_logs']['Row']

export type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'

export type Gender = 'male' | 'female'

export type Goal = 'lose' | 'maintain' | 'gain'

export interface FoodLogWithItem extends FoodLog {
  food_item: FoodItem
}

export interface DailySummary {
  date: string
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  meals: {
    breakfast: FoodLogWithItem[]
    lunch: FoodLogWithItem[]
    dinner: FoodLogWithItem[]
    snack: FoodLogWithItem[]
  }
}

export interface TDEEResult {
  bmr: number
  tdee: number
  deficit: number
  surplus: number
}

export interface MacroRecommendation {
  calories: number
  protein: { grams: number; calories: number; percentage: number }
  carbs: { grams: number; calories: number; percentage: number }
  fat: { grams: number; calories: number; percentage: number }
  goal: Goal
}

export const GOAL_LABELS: Record<Goal, string> = {
  lose: 'Cut / Lose Weight',
  maintain: 'Maintain Weight',
  gain: 'Bulk / Gain Weight',
}

export const GOAL_ICONS: Record<Goal, string> = {
  lose: '🔥',
  maintain: '⚖️',
  gain: '💪',
}

export interface BodyFatResult {
  percentage: number
  category: string
}

export interface GuestData {
  foodLogs: FoodLog[]
  customFoods: FoodItem[]
  profile: Partial<Profile>
}

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary (little or no exercise)',
  light: 'Light (exercise 1-3 times/week)',
  moderate: 'Moderate (exercise 3-5 times/week)',
  active: 'Active (exercise 6-7 times/week)',
  very_active: 'Very Active (hard exercise daily)',
}

export const MEAL_TIME_LABELS: Record<MealTime, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
}

export const MEAL_TIME_ICONS: Record<MealTime, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍿',
}
