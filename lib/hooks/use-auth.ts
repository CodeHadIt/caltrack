'use client'

import { useEffect, useState, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { getGuestId, getGuestProfile, updateGuestProfile, clearGuestData, getGuestData } from '@/lib/storage/local-storage'
import { Profile } from '@/types'

interface AuthState {
  user: User | null
  profile: Partial<Profile> | null
  isGuest: boolean
  isLoading: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isGuest: true,
    isLoading: true,
  })

  const supabase = createClient()

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return data
  }, [supabase])

  useEffect(() => {
    const initAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const profile = await fetchProfile(user.id)
        setState({
          user,
          profile,
          isGuest: false,
          isLoading: false,
        })
      } else {
        // Guest mode
        const guestProfile = getGuestProfile()
        setState({
          user: null,
          profile: { id: getGuestId(), ...guestProfile },
          isGuest: true,
          isLoading: false,
        })
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id)
          setState({
            user: session.user,
            profile,
            isGuest: false,
            isLoading: false,
          })

          // Send welcome email after successful email confirmation
          if (event === 'SIGNED_IN' && session.user.email_confirmed_at) {
            try {
              await fetch('/api/auth/welcome', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
              })
            } catch (error) {
              console.error('Failed to send welcome email:', error)
            }
          }
        } else {
          const guestProfile = getGuestProfile()
          setState({
            user: null,
            profile: { id: getGuestId(), ...guestProfile },
            isGuest: true,
            isLoading: false,
          })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, fetchProfile])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    // Get guest data before signing up
    const guestData = getGuestData()

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (!error && data.user) {
      // Note: Profile is created via database trigger on auth.users insert
      // Update profile with guest data if any
      if (Object.keys(guestData.profile).length > 0) {
        await supabase
          .from('profiles')
          .update({
            height_cm: guestData.profile.height_cm,
            weight_kg: guestData.profile.weight_kg,
            age: guestData.profile.age,
            gender: guestData.profile.gender,
            activity_level: guestData.profile.activity_level,
            goal: guestData.profile.goal,
          })
          .eq('id', data.user.id)
      }

      // Sync guest food logs to database
      if (guestData.foodLogs.length > 0) {
        for (const log of guestData.foodLogs) {
          await supabase.from('food_logs').insert({
            user_id: data.user.id,
            food_item_id: log.food_item_id,
            weight_grams: log.weight_grams,
            meal_time: log.meal_time,
            date: log.date,
          })
        }
      }

      // Sync custom foods
      if (guestData.customFoods.length > 0) {
        for (const food of guestData.customFoods) {
          await supabase.from('food_items').insert({
            user_id: data.user.id,
            category_id: food.category_id,
            name: food.name,
            calories_per_100g: food.calories_per_100g,
            protein_per_100g: food.protein_per_100g,
            carbs_per_100g: food.carbs_per_100g,
            fat_per_100g: food.fat_per_100g,
            image_url: food.image_url,
            is_default: false,
          })
        }
      }

      // Clear guest data after sync
      clearGuestData()
    }

    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setState({
        user: null,
        profile: { id: getGuestId() },
        isGuest: true,
        isLoading: false,
      })
    }
    return { error }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (state.isGuest) {
      updateGuestProfile(updates)
      setState(prev => ({
        ...prev,
        profile: { ...prev.profile, ...updates },
      }))
      return { error: null }
    }

    if (!state.user) return { error: new Error('No user') }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', state.user.id)

    if (!error) {
      setState(prev => ({
        ...prev,
        profile: { ...prev.profile, ...updates },
      }))
    }

    return { error }
  }

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    updateProfile,
    userId: state.user?.id || getGuestId(),
  }
}
