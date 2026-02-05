'use client'

import { FoodItem, FoodLog, Profile, GuestData, MacroRecommendation } from '@/types'
import { v4 as uuidv4 } from 'uuid'

const MACRO_KEY = 'calories_tracker_macro_recommendation'

const STORAGE_KEY = 'calories_tracker_guest_data'
const GUEST_ID = 'guest-user'

export function getGuestId(): string {
  return GUEST_ID
}

export function getGuestData(): GuestData {
  if (typeof window === 'undefined') {
    return { foodLogs: [], customFoods: [], profile: {} }
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return { foodLogs: [], customFoods: [], profile: {} }
  }

  try {
    return JSON.parse(stored)
  } catch {
    return { foodLogs: [], customFoods: [], profile: {} }
  }
}

export function saveGuestData(data: GuestData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function addGuestFoodLog(log: Omit<FoodLog, 'id' | 'user_id' | 'logged_at'>): FoodLog {
  const data = getGuestData()
  const newLog: FoodLog = {
    ...log,
    id: uuidv4(),
    user_id: GUEST_ID,
    logged_at: new Date().toISOString(),
  }
  data.foodLogs.push(newLog)
  saveGuestData(data)
  return newLog
}

export function removeGuestFoodLog(logId: string): void {
  const data = getGuestData()
  data.foodLogs = data.foodLogs.filter(log => log.id !== logId)
  saveGuestData(data)
}

export function getGuestFoodLogs(date?: string): FoodLog[] {
  const data = getGuestData()
  if (date) {
    return data.foodLogs.filter(log => log.date === date)
  }
  return data.foodLogs
}

export function addGuestCustomFood(food: Omit<FoodItem, 'id' | 'user_id' | 'created_at' | 'is_default'>): FoodItem {
  const data = getGuestData()
  const newFood: FoodItem = {
    ...food,
    id: uuidv4(),
    user_id: GUEST_ID,
    is_default: false,
    created_at: new Date().toISOString(),
  }
  data.customFoods.push(newFood)
  saveGuestData(data)
  return newFood
}

export function getGuestCustomFoods(): FoodItem[] {
  const data = getGuestData()
  return data.customFoods
}

export function updateGuestProfile(profile: Partial<Profile>): void {
  const data = getGuestData()
  data.profile = { ...data.profile, ...profile }
  saveGuestData(data)
}

export function getGuestProfile(): Partial<Profile> {
  const data = getGuestData()
  return data.profile
}

export function clearGuestData(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

export function saveMacroRecommendation(macros: MacroRecommendation): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(MACRO_KEY, JSON.stringify(macros))
}

export function getMacroRecommendation(): MacroRecommendation | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(MACRO_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export function clearMacroRecommendation(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(MACRO_KEY)
}
