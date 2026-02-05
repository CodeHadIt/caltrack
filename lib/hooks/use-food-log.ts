'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  addGuestFoodLog,
  removeGuestFoodLog,
  getGuestFoodLogs,
  getGuestCustomFoods,
  addGuestCustomFood,
  getGuestId,
} from '@/lib/storage/local-storage'
import { FoodItem, FoodLog, FoodLogWithItem, MealTime, DailySummary, FoodCategory } from '@/types'
import { DEFAULT_FOODS, DEFAULT_CATEGORIES } from '@/lib/constants'
import { getToday } from '@/lib/utils'

export function useFoodLog(userId: string | null, isGuest: boolean) {
  const [logs, setLogs] = useState<FoodLogWithItem[]>([])
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [categories, setCategories] = useState<Omit<FoodCategory, 'created_at'>[]>(DEFAULT_CATEGORIES)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const fetchFoods = useCallback(async () => {
    setIsLoading(true)

    try {
      if (isGuest) {
        const customFoods = getGuestCustomFoods()
        const defaultFoods = DEFAULT_FOODS.map((food, index) => ({
          ...food,
          id: `default-${index}`,
          user_id: null,
          created_at: new Date().toISOString(),
        }))
        setFoods([...defaultFoods, ...customFoods])
        setCategories(DEFAULT_CATEGORIES)
        setIsLoading(false)
        return [...defaultFoods, ...customFoods]
      }

      // Fetch categories from database
      const { data: dbCategories, error: catError } = await supabase
        .from('food_categories')
        .select('*')
        .order('name')

      if (catError) {
        console.error('Error fetching categories:', catError)
        setCategories(DEFAULT_CATEGORIES)
      } else if (dbCategories) {
        setCategories(dbCategories)
      }

      // Fetch foods from database
      const { data: dbFoods, error: foodError } = await supabase
        .from('food_items')
        .select('*')
        .or(`is_default.eq.true,user_id.eq.${userId}`)
        .order('name')

      if (foodError) {
        console.error('Error fetching foods:', foodError)
        setFoods([])
        setIsLoading(false)
        return []
      }

      if (dbFoods) {
        setFoods(dbFoods)
        setIsLoading(false)
        return dbFoods
      }

      setIsLoading(false)
      return []
    } catch (error) {
      console.error('Error in fetchFoods:', error)
      setIsLoading(false)
      return []
    }
  }, [isGuest, userId, supabase])

  const fetchLogs = useCallback(async (date: string) => {
    setIsLoading(true)
    const allFoods = await fetchFoods()

    if (isGuest) {
      const guestLogs = getGuestFoodLogs(date)
      const logsWithItems = guestLogs.map(log => {
        const food = allFoods.find(f => f.id === log.food_item_id)
        return {
          ...log,
          food_item: food!,
        }
      }).filter(log => log.food_item)
      setLogs(logsWithItems)
      setIsLoading(false)
      return logsWithItems
    }

    const { data: dbLogs } = await supabase
      .from('food_logs')
      .select(`
        *,
        food_item:food_items(*)
      `)
      .eq('user_id', userId)
      .eq('date', date)
      .order('logged_at', { ascending: true })

    if (dbLogs) {
      setLogs(dbLogs as FoodLogWithItem[])
    }
    setIsLoading(false)
    return dbLogs || []
  }, [isGuest, userId, supabase, fetchFoods])

  const addLog = useCallback(async (
    foodItemId: string,
    weightGrams: number,
    mealTime: MealTime,
    date: string = getToday()
  ) => {
    if (isGuest) {
      const newLog = addGuestFoodLog({
        food_item_id: foodItemId,
        weight_grams: weightGrams,
        meal_time: mealTime,
        date,
      })
      const food = foods.find(f => f.id === foodItemId)
      if (food) {
        setLogs(prev => [...prev, { ...newLog, food_item: food }])
      }
      return { error: null }
    }

    const { error } = await supabase.from('food_logs').insert({
      user_id: userId,
      food_item_id: foodItemId,
      weight_grams: weightGrams,
      meal_time: mealTime,
      date,
    })

    if (!error) {
      await fetchLogs(date)
    }

    return { error }
  }, [isGuest, userId, supabase, foods, fetchLogs])

  const removeLog = useCallback(async (logId: string) => {
    if (isGuest) {
      removeGuestFoodLog(logId)
      setLogs(prev => prev.filter(log => log.id !== logId))
      return { error: null }
    }

    const { error } = await supabase
      .from('food_logs')
      .delete()
      .eq('id', logId)

    if (!error) {
      setLogs(prev => prev.filter(log => log.id !== logId))
    }

    return { error }
  }, [isGuest, supabase])

  const addCustomFood = useCallback(async (
    food: Omit<FoodItem, 'id' | 'user_id' | 'created_at' | 'is_default'>
  ) => {
    if (isGuest) {
      const newFood = addGuestCustomFood(food)
      setFoods(prev => [...prev, newFood])
      return { data: newFood, error: null }
    }

    const { data, error } = await supabase
      .from('food_items')
      .insert({
        ...food,
        user_id: userId,
        is_default: false,
      })
      .select()
      .single()

    if (!error && data) {
      setFoods(prev => [...prev, data])
    }

    return { data, error }
  }, [isGuest, userId, supabase])

  const getDailySummary = useCallback((date: string): DailySummary => {
    const dayLogs = logs.filter(log => log.date === date)

    const meals = {
      breakfast: dayLogs.filter(log => log.meal_time === 'breakfast'),
      lunch: dayLogs.filter(log => log.meal_time === 'lunch'),
      dinner: dayLogs.filter(log => log.meal_time === 'dinner'),
      snack: dayLogs.filter(log => log.meal_time === 'snack'),
    }

    const totals = dayLogs.reduce(
      (acc, log) => {
        const multiplier = log.weight_grams / 100
        return {
          calories: acc.calories + log.food_item.calories_per_100g * multiplier,
          protein: acc.protein + log.food_item.protein_per_100g * multiplier,
          carbs: acc.carbs + log.food_item.carbs_per_100g * multiplier,
          fat: acc.fat + log.food_item.fat_per_100g * multiplier,
        }
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    )

    return {
      date,
      totalCalories: Math.round(totals.calories),
      totalProtein: Math.round(totals.protein * 10) / 10,
      totalCarbs: Math.round(totals.carbs * 10) / 10,
      totalFat: Math.round(totals.fat * 10) / 10,
      meals,
    }
  }, [logs])

  const fetchWeeklyCalories = useCallback(async (dates: string[]): Promise<{ date: string; calories: number }[]> => {
    const allFoods = await fetchFoods()

    if (isGuest) {
      return dates.map(date => {
        const dayLogs = getGuestFoodLogs(date)
        const totalCalories = dayLogs.reduce((acc, log) => {
          const food = allFoods.find(f => f.id === log.food_item_id)
          if (food) {
            return acc + (food.calories_per_100g * log.weight_grams / 100)
          }
          return acc
        }, 0)
        return { date, calories: Math.round(totalCalories) }
      })
    }

    // For authenticated users, fetch all logs for the date range
    const { data: weekLogs } = await supabase
      .from('food_logs')
      .select(`
        date,
        weight_grams,
        food_item:food_items(calories_per_100g)
      `)
      .eq('user_id', userId)
      .in('date', dates)

    // Aggregate calories by date
    const caloriesByDate = new Map<string, number>()
    dates.forEach(date => caloriesByDate.set(date, 0))

    if (weekLogs) {
      weekLogs.forEach((log) => {
        const foodItem = log.food_item as unknown as { calories_per_100g: number } | null
        if (foodItem) {
          const current = caloriesByDate.get(log.date) || 0
          caloriesByDate.set(log.date, current + (foodItem.calories_per_100g * log.weight_grams / 100))
        }
      })
    }

    return dates.map(date => ({
      date,
      calories: Math.round(caloriesByDate.get(date) || 0)
    }))
  }, [isGuest, userId, supabase, fetchFoods])

  return {
    logs,
    foods,
    isLoading,
    fetchLogs,
    fetchFoods,
    addLog,
    removeLog,
    addCustomFood,
    getDailySummary,
    fetchWeeklyCalories,
    categories,
  }
}
