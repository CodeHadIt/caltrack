export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          created_at: string
          height_cm: number | null
          weight_kg: number | null
          age: number | null
          gender: string | null
          activity_level: string | null
          goal: string | null
        }
        Insert: {
          id: string
          email?: string | null
          created_at?: string
          height_cm?: number | null
          weight_kg?: number | null
          age?: number | null
          gender?: string | null
          activity_level?: string | null
          goal?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          created_at?: string
          height_cm?: number | null
          weight_kg?: number | null
          age?: number | null
          gender?: string | null
          activity_level?: string | null
          goal?: string | null
        }
      }
      food_categories: {
        Row: {
          id: string
          name: string
          icon: string | null
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon?: string | null
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string | null
          color?: string | null
          created_at?: string
        }
      }
      food_items: {
        Row: {
          id: string
          user_id: string | null
          category_id: string
          name: string
          calories_per_100g: number
          protein_per_100g: number
          carbs_per_100g: number
          fat_per_100g: number
          image_url: string | null
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          category_id: string
          name: string
          calories_per_100g: number
          protein_per_100g: number
          carbs_per_100g: number
          fat_per_100g: number
          image_url?: string | null
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          category_id?: string
          name?: string
          calories_per_100g?: number
          protein_per_100g?: number
          carbs_per_100g?: number
          fat_per_100g?: number
          image_url?: string | null
          is_default?: boolean
          created_at?: string
        }
      }
      food_logs: {
        Row: {
          id: string
          user_id: string
          food_item_id: string
          weight_grams: number
          meal_time: string
          logged_at: string
          date: string
        }
        Insert: {
          id?: string
          user_id: string
          food_item_id: string
          weight_grams: number
          meal_time: string
          logged_at?: string
          date: string
        }
        Update: {
          id?: string
          user_id?: string
          food_item_id?: string
          weight_grams?: number
          meal_time?: string
          logged_at?: string
          date?: string
        }
      }
    }
  }
}
