'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { AppWrapper } from '@/components/app-wrapper'
import { useAuth } from '@/lib/hooks/use-auth'
import { toast } from 'sonner'
import { User, Save, Loader2, Shield, Trash2 } from 'lucide-react'
import { ActivityLevel, Gender, Goal, ACTIVITY_LABELS } from '@/types'
import Link from 'next/link'

const GOAL_LABELS: Record<Goal, string> = {
  lose: 'Lose Weight',
  maintain: 'Maintain Weight',
  gain: 'Gain Weight',
}

export default function ProfilePage() {
  const { profile, updateProfile, isGuest, user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<Gender>('male')
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate')
  const [goal, setGoal] = useState<Goal>('maintain')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Unit preferences
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm')
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg')

  // Conversion utilities
  const cmToFeet = (cm: number) => {
    const totalInches = cm / 2.54
    const feet = Math.floor(totalInches / 12)
    const inches = Math.round(totalInches % 12)
    return `${feet}'${inches}"`
  }

  const feetToCm = (feet: number, inches: number) => {
    return Math.round((feet * 12 + inches) * 2.54)
  }

  const kgToLbs = (kg: number) => {
    return Math.round(kg * 2.20462 * 10) / 10
  }

  const lbsToKg = (lbs: number) => {
    return Math.round((lbs / 2.20462) * 10) / 10
  }

  useEffect(() => {
    if (profile) {
      // Set height based on unit
      if (profile.height_cm) {
        if (heightUnit === 'cm') {
          setHeight(profile.height_cm.toString())
        } else {
          const totalInches = profile.height_cm / 2.54
          const feet = Math.floor(totalInches / 12)
          const inches = Math.round(totalInches % 12)
          setHeight(`${feet}.${inches}`)
        }
      }

      // Set weight based on unit
      if (profile.weight_kg) {
        if (weightUnit === 'kg') {
          setWeight(profile.weight_kg.toString())
        } else {
          setWeight(kgToLbs(profile.weight_kg).toString())
        }
      }

      setAge(profile.age?.toString() || '')
      setGender((profile.gender as Gender) || 'male')
      setActivityLevel((profile.activity_level as ActivityLevel) || 'moderate')
      setGoal((profile.goal as Goal) || 'maintain')
    }
  }, [profile, heightUnit, weightUnit])

  const handleSave = async () => {
    setIsSaving(true)

    // Convert height to cm
    let heightCm: number | null = null
    if (height) {
      if (heightUnit === 'cm') {
        heightCm = parseFloat(height)
      } else {
        // Parse feet and inches from format like "5.11" or "5'11""
        const parts = height.replace(/['"]/g, '').split(/[.\s]/)
        const feet = parseInt(parts[0]) || 0
        const inches = parseInt(parts[1]) || 0
        heightCm = feetToCm(feet, inches)
      }
    }

    // Convert weight to kg
    let weightKg: number | null = null
    if (weight) {
      if (weightUnit === 'kg') {
        weightKg = parseFloat(weight)
      } else {
        weightKg = lbsToKg(parseFloat(weight))
      }
    }

    const { error } = await updateProfile({
      height_cm: heightCm,
      weight_kg: weightKg,
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

    // Redirect to dashboard after saving
    router.push('/dashboard')
  }

  const handleDeleteAccount = async () => {
    if (isGuest) {
      toast.error('Guest accounts cannot be deleted')
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to request account deletion')
      }

      toast.success('Verification email sent!', {
        description: 'Please check your email to confirm account deletion.',
      })
    } catch (error) {
      console.error('Error requesting account deletion:', error)
      toast.error('Failed to send deletion email')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AppWrapper>
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-display flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-coral/10 flex items-center justify-center">
              <User className="h-6 w-6 text-coral" />
            </div>
            Profile
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Account Info */}
        <Card className="mb-6 border-0 card-glow bg-card/80 backdrop-blur-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 rounded-full bg-coral/10 blur-3xl" />
          <CardHeader className="relative">
            <CardTitle className="text-lg font-display flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sage/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-sage" />
              </div>
              Account
            </CardTitle>
            <CardDescription>
              {isGuest
                ? 'You are currently using guest mode'
                : `Signed in as ${user?.email}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            {isGuest ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Create an account to sync your data across devices and never lose your progress.
                </p>
                <Link href="/auth/signup">
                  <Button className="btn-gradient text-white rounded-xl shadow-lg shadow-coral/25 font-semibold whitespace-nowrap">
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
        <Card className="border-0 card-glow bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-display">Personal Information</CardTitle>
            <CardDescription>
              This information is used to calculate your daily calorie needs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="height">Height</Label>
                  <Select value={heightUnit} onValueChange={(value: 'cm' | 'ft') => setHeightUnit(value)}>
                    <SelectTrigger className="w-20 h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cm">cm</SelectItem>
                      <SelectItem value="ft">ft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  id="height"
                  type="text"
                  placeholder={heightUnit === 'cm' ? 'e.g., 175' : "e.g., 5'11\""}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="weight">Weight</Label>
                  <Select value={weightUnit} onValueChange={(value: 'kg' | 'lbs') => setWeightUnit(value)}>
                    <SelectTrigger className="w-20 h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lbs">lbs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder={weightUnit === 'kg' ? 'e.g., 70' : 'e.g., 154'}
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
              className="w-full btn-gradient text-white h-12 rounded-xl font-semibold shadow-lg shadow-coral/25"
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

        {/* Danger Zone - Delete Account */}
        {!isGuest && (
          <Card className="mt-6 border-red-200 dark:border-red-900 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-poppins text-red-600 dark:text-red-400">
                Danger Zone
              </CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    disabled={isDeleting}
                    className="w-full sm:w-auto"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. We will send a confirmation email to{' '}
                      <strong>{user?.email}</strong>. You must confirm the deletion via email
                      before your account is permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Send Confirmation Email
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <p className="text-xs text-muted-foreground mt-3">
                All your data including food logs, custom foods, and profile information will be
                permanently deleted.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </AppWrapper>
  )
}
