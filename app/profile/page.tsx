'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AppWrapper } from '@/components/app-wrapper'
import { useAuth } from '@/lib/hooks/use-auth'
import { toast } from 'sonner'
import { User, Save, Loader2, Shield } from 'lucide-react'
import { ActivityLevel, Gender, Goal, ACTIVITY_LABELS } from '@/types'
import Link from 'next/link'

const GOAL_LABELS: Record<Goal, string> = {
  lose: 'Lose Weight',
  maintain: 'Maintain Weight',
  gain: 'Gain Weight',
}

export default function ProfilePage() {
  const { profile, updateProfile, isGuest, user, isLoading: authLoading } = useAuth()

  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<Gender>('male')
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate')
  const [goal, setGoal] = useState<Goal>('maintain')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setHeight(profile.height_cm?.toString() || '')
      setWeight(profile.weight_kg?.toString() || '')
      setAge(profile.age?.toString() || '')
      setGender((profile.gender as Gender) || 'male')
      setActivityLevel((profile.activity_level as ActivityLevel) || 'moderate')
      setGoal((profile.goal as Goal) || 'maintain')
    }
  }, [profile])

  const handleSave = async () => {
    setIsSaving(true)

    const { error } = await updateProfile({
      height_cm: height ? parseFloat(height) : null,
      weight_kg: weight ? parseFloat(weight) : null,
      age: age ? parseInt(age) : null,
      gender,
      activity_level: activityLevel,
      goal,
    })

    if (error) {
      toast.error('Failed to save profile')
      setIsSaving(false)
      return
    }

    toast.success('Profile saved!')
    setIsSaving(false)
  }

  return (
    <AppWrapper>
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold font-poppins flex items-center gap-2">
            <User className="h-7 w-7 text-emerald-600" />
            Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Account Info */}
        <Card className="mb-6 border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-poppins flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              Account
            </CardTitle>
            <CardDescription>
              {isGuest
                ? 'You are currently using guest mode'
                : `Signed in as ${user?.email}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isGuest ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Create an account to sync your data across devices and never lose your progress.
                </p>
                <Link href="/auth/signup">
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white whitespace-nowrap">
                    Create Account
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Your data is securely stored and synced across devices.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Personal Info */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-poppins">Personal Information</CardTitle>
            <CardDescription>
              This information is used to calculate your daily calorie needs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="e.g., 175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g., 30"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Gender</Label>
              <RadioGroup
                value={gender}
                onValueChange={(value) => setGender(value as Gender)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="profile-male" />
                  <Label htmlFor="profile-male" className="cursor-pointer">
                    Male
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="profile-female" />
                  <Label htmlFor="profile-female" className="cursor-pointer">
                    Female
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Activity Level</Label>
              <Select
                value={activityLevel}
                onValueChange={(value) => setActivityLevel(value as ActivityLevel)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((level) => (
                    <SelectItem key={level} value={level}>
                      {ACTIVITY_LABELS[level]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Goal</Label>
              <Select value={goal} onValueChange={(value) => setGoal(value as Goal)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => (
                    <SelectItem key={g} value={g}>
                      {GOAL_LABELS[g]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </main>
    </AppWrapper>
  )
}
