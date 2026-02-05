import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from 'date-fns'
import { ActivityLevel, Gender, Goal, ACTIVITY_MULTIPLIERS, TDEEResult, BodyFatResult, FoodItem, FoodLog, MacroRecommendation } from '@/types'
import { BODY_FAT_CATEGORIES } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'MMM d, yyyy')
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'MMM d')
}

export function getToday(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: Gender
): number {
  // Mifflin-St Jeor Equation
  const base = 10 * weight + 6.25 * height - 5 * age
  return gender === 'male' ? base + 5 : base - 161
}

export function calculateTDEE(
  weight: number,
  height: number,
  age: number,
  gender: Gender,
  activityLevel: ActivityLevel
): TDEEResult {
  const bmr = calculateBMR(weight, height, age, gender)
  const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel]

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    deficit: Math.round(tdee - 500), // 500 calorie deficit for ~0.5kg/week loss
    surplus: Math.round(tdee + 500), // 500 calorie surplus for ~0.5kg/week gain
  }
}

export function calculateBodyFat(
  gender: Gender,
  waist: number,
  neck: number,
  height: number,
  hip?: number
): BodyFatResult {
  let percentage: number

  if (gender === 'male') {
    // Navy Method for men
    percentage =
      86.01 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76
  } else {
    // Navy Method for women (requires hip measurement)
    if (!hip) throw new Error('Hip measurement required for female body fat calculation')
    percentage =
      163.205 * Math.log10(waist + hip - neck) -
      97.684 * Math.log10(height) -
      78.387
  }

  // Ensure percentage is in valid range
  percentage = Math.max(0, Math.min(100, percentage))

  // Get category
  const categories = BODY_FAT_CATEGORIES[gender]
  const category = categories.find(c => percentage <= c.max)?.category || 'Unknown'

  return {
    percentage: Math.round(percentage * 10) / 10,
    category,
  }
}

export function calculateCaloriesFromFood(
  food: FoodItem,
  weightGrams: number
): { calories: number; protein: number; carbs: number; fat: number } {
  const multiplier = weightGrams / 100
  return {
    calories: Math.round(food.calories_per_100g * multiplier),
    protein: Math.round(food.protein_per_100g * multiplier * 10) / 10,
    carbs: Math.round(food.carbs_per_100g * multiplier * 10) / 10,
    fat: Math.round(food.fat_per_100g * multiplier * 10) / 10,
  }
}

export function calculateDailyTotals(
  logs: Array<FoodLog & { food_item: FoodItem }>
): { calories: number; protein: number; carbs: number; fat: number } {
  return logs.reduce(
    (acc, log) => {
      const nutrients = calculateCaloriesFromFood(log.food_item, log.weight_grams)
      return {
        calories: acc.calories + nutrients.calories,
        protein: acc.protein + nutrients.protein,
        carbs: acc.carbs + nutrients.carbs,
        fat: acc.fat + nutrients.fat,
      }
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )
}

export function getProgressColor(current: number, goal: number): string {
  const percentage = (current / goal) * 100
  if (percentage < 50) return 'text-emerald-500'
  if (percentage < 75) return 'text-teal-500'
  if (percentage < 100) return 'text-cyan-500'
  if (percentage < 110) return 'text-amber-500'
  return 'text-red-500'
}

export function getMacroColor(macro: 'protein' | 'carbs' | 'fat'): string {
  switch (macro) {
    case 'protein':
      return '#10b981' // emerald
    case 'carbs':
      return '#f59e0b' // amber
    case 'fat':
      return '#3b82f6' // blue
  }
}

// Macro ratios based on goal
// Protein: 4 calories per gram
// Carbs: 4 calories per gram
// Fat: 9 calories per gram
const MACRO_RATIOS: Record<Goal, { protein: number; carbs: number; fat: number }> = {
  lose: { protein: 0.40, carbs: 0.35, fat: 0.25 },    // High protein for muscle retention during cut
  maintain: { protein: 0.30, carbs: 0.40, fat: 0.30 }, // Balanced macros
  gain: { protein: 0.30, carbs: 0.45, fat: 0.25 },     // Higher carbs for energy and muscle building
}

export function calculateMacros(tdee: number, goal: Goal): MacroRecommendation {
  // Adjust calories based on goal
  let targetCalories: number
  switch (goal) {
    case 'lose':
      targetCalories = tdee - 500 // 500 calorie deficit
      break
    case 'gain':
      targetCalories = tdee + 500 // 500 calorie surplus
      break
    default:
      targetCalories = tdee
  }

  const ratios = MACRO_RATIOS[goal]

  // Calculate calories from each macro
  const proteinCalories = Math.round(targetCalories * ratios.protein)
  const carbsCalories = Math.round(targetCalories * ratios.carbs)
  const fatCalories = Math.round(targetCalories * ratios.fat)

  // Convert to grams
  const proteinGrams = Math.round(proteinCalories / 4)
  const carbsGrams = Math.round(carbsCalories / 4)
  const fatGrams = Math.round(fatCalories / 9)

  return {
    calories: targetCalories,
    protein: {
      grams: proteinGrams,
      calories: proteinCalories,
      percentage: Math.round(ratios.protein * 100),
    },
    carbs: {
      grams: carbsGrams,
      calories: carbsCalories,
      percentage: Math.round(ratios.carbs * 100),
    },
    fat: {
      grams: fatGrams,
      calories: fatCalories,
      percentage: Math.round(ratios.fat * 100),
    },
    goal,
  }
}
