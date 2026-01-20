'use client'

import { useState } from 'react'
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
import { Calculator, Flame, TrendingDown, TrendingUp, Activity } from 'lucide-react'
import { calculateTDEE } from '@/lib/utils'
import { ActivityLevel, Gender, ACTIVITY_LABELS, TDEEResult } from '@/types'

export function TDEEForm() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<Gender>('male')
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate')
  const [result, setResult] = useState<TDEEResult | null>(null)

  const handleCalculate = () => {
    if (!weight || !height || !age) return

    const tdeeResult = calculateTDEE(
      parseFloat(weight),
      parseFloat(height),
      parseInt(age),
      gender,
      activityLevel
    )
    setResult(tdeeResult)
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-poppins">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            TDEE Calculator
          </CardTitle>
          <CardDescription>
            Calculate your Total Daily Energy Expenditure using the Mifflin-St Jeor equation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="e.g., 70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="border-slate-200 dark:border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="e.g., 175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="border-slate-200 dark:border-slate-700"
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
                className="border-slate-200 dark:border-slate-700"
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
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="cursor-pointer">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="cursor-pointer">Female</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Activity Level</Label>
            <Select
              value={activityLevel}
              onValueChange={(value) => setActivityLevel(value as ActivityLevel)}
            >
              <SelectTrigger className="border-slate-200 dark:border-slate-700">
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

          <Button
            onClick={handleCalculate}
            disabled={!weight || !height || !age}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
          >
            <Calculator className="mr-2 h-4 w-4" />
            Calculate TDEE
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-poppins">Your Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 text-center">
                <div className="flex items-center justify-center gap-2 text-emerald-600 mb-2">
                  <Activity className="h-4 w-4" />
                  <span className="text-xs font-medium">BMR</span>
                </div>
                <p className="text-2xl font-bold font-poppins">{result.bmr}</p>
                <p className="text-xs text-muted-foreground">kcal/day</p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Flame className="h-4 w-4" />
                  <span className="text-xs font-medium">TDEE</span>
                </div>
                <p className="text-2xl font-bold font-poppins">{result.tdee}</p>
                <p className="text-xs opacity-80">kcal/day</p>
              </div>

              <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 text-center">
                <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-xs font-medium">Weight Loss</span>
                </div>
                <p className="text-2xl font-bold font-poppins">{result.deficit}</p>
                <p className="text-xs text-muted-foreground">kcal/day</p>
              </div>

              <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 text-center">
                <div className="flex items-center justify-center gap-2 text-orange-600 mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-medium">Weight Gain</span>
                </div>
                <p className="text-2xl font-bold font-poppins">{result.surplus}</p>
                <p className="text-xs text-muted-foreground">kcal/day</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-4 text-center">
              TDEE = BMR × Activity Multiplier. For weight loss, aim for a 500 calorie deficit. For weight gain, aim for a 500 calorie surplus.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
