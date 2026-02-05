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
import { Calculator, Flame, TrendingDown, TrendingUp, Activity, Target, Check } from 'lucide-react'
import { calculateTDEE, calculateMacros } from '@/lib/utils'
import { saveMacroRecommendation } from '@/lib/storage/local-storage'
import { ActivityLevel, Gender, Goal, ACTIVITY_LABELS, GOAL_LABELS, GOAL_ICONS, TDEEResult, MacroRecommendation } from '@/types'
import { toast } from 'sonner'

export function TDEEForm() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<Gender>('male')
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate')
  const [goal, setGoal] = useState<Goal>('maintain')
  const [result, setResult] = useState<TDEEResult | null>(null)
  const [macros, setMacros] = useState<MacroRecommendation | null>(null)

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

    // Calculate macro recommendations based on goal
    const macroRecommendation = calculateMacros(tdeeResult.tdee, goal)
    setMacros(macroRecommendation)
  }

  const handleSaveToDashboard = () => {
    if (macros) {
      saveMacroRecommendation(macros)
      toast.success('Macro targets saved to dashboard!')
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 card-glow bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-display">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-coral to-rose flex items-center justify-center shadow-lg shadow-coral/25">
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
              <Label htmlFor="weight" className="font-medium">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="e.g., 70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="h-11 rounded-xl border-coral/20 focus:border-coral/40 focus:ring-coral/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height" className="font-medium">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="e.g., 175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="h-11 rounded-xl border-coral/20 focus:border-coral/40 focus:ring-coral/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age" className="font-medium">Age (years)</Label>
              <Input
                id="age"
                type="number"
                placeholder="e.g., 30"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="h-11 rounded-xl border-coral/20 focus:border-coral/40 focus:ring-coral/20"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="font-medium">Gender</Label>
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
            <Label className="font-medium">Activity Level</Label>
            <Select
              value={activityLevel}
              onValueChange={(value) => setActivityLevel(value as ActivityLevel)}
            >
              <SelectTrigger className="h-11 rounded-xl border-coral/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((level) => (
                  <SelectItem key={level} value={level} className="rounded-lg">
                    {ACTIVITY_LABELS[level]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-coral" />
              Weight Goal
            </Label>
            <Select
              value={goal}
              onValueChange={(value) => setGoal(value as Goal)}
            >
              <SelectTrigger className="h-11 rounded-xl border-coral/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => (
                  <SelectItem key={g} value={g} className="rounded-lg">
                    <span className="flex items-center gap-2">
                      <span>{GOAL_ICONS[g]}</span>
                      <span>{GOAL_LABELS[g]}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleCalculate}
            disabled={!weight || !height || !age}
            className="w-full btn-gradient text-white h-12 rounded-xl font-semibold shadow-lg shadow-coral/25"
          >
            <Calculator className="mr-2 h-4 w-4" />
            Calculate TDEE
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-0 bg-gradient-to-br from-coral/10 via-rose/10 to-peach/10 card-glow">
          <CardHeader>
            <CardTitle className="text-lg font-display">Your Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-sm text-center hover-lift">
                <div className="flex items-center justify-center gap-2 text-sage mb-2">
                  <Activity className="h-4 w-4" />
                  <span className="text-xs font-semibold">BMR</span>
                </div>
                <p className="text-2xl font-bold font-display">{result.bmr}</p>
                <p className="text-xs text-muted-foreground">kcal/day</p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-coral to-rose text-white text-center shadow-lg shadow-coral/25 hover-lift">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Flame className="h-4 w-4" />
                  <span className="text-xs font-semibold">TDEE</span>
                </div>
                <p className="text-2xl font-bold font-display">{result.tdee}</p>
                <p className="text-xs opacity-80">kcal/day</p>
              </div>

              <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-sm text-center hover-lift">
                <div className="flex items-center justify-center gap-2 text-sky mb-2">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-xs font-semibold">Weight Loss</span>
                </div>
                <p className="text-2xl font-bold font-display">{result.deficit}</p>
                <p className="text-xs text-muted-foreground">kcal/day</p>
              </div>

              <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-sm text-center hover-lift">
                <div className="flex items-center justify-center gap-2 text-honey mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-semibold">Weight Gain</span>
                </div>
                <p className="text-2xl font-bold font-display">{result.surplus}</p>
                <p className="text-xs text-muted-foreground">kcal/day</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              TDEE = BMR × Activity Multiplier
            </p>
          </CardContent>
        </Card>
      )}

      {macros && (
        <Card className="border-0 bg-gradient-to-br from-sage/10 via-emerald-500/10 to-teal-500/10 card-glow">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              {GOAL_ICONS[macros.goal]} Recommended Daily Macros for {GOAL_LABELS[macros.goal]}
            </CardTitle>
            <CardDescription>
              Based on your TDEE and {macros.goal === 'lose' ? 'a 500 calorie deficit' : macros.goal === 'gain' ? 'a 500 calorie surplus' : 'maintenance calories'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Daily Calorie Target */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-coral to-rose text-white text-center shadow-lg shadow-coral/25">
              <p className="text-sm font-semibold mb-1">Daily Calorie Target</p>
              <p className="text-3xl font-bold font-display">{macros.calories}</p>
              <p className="text-xs opacity-80">kcal/day</p>
            </div>

            {/* Macro Breakdown */}
            <div className="grid grid-cols-3 gap-4">
              {/* Protein */}
              <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-sm text-center hover-lift">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">🥩</span>
                </div>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Protein</p>
                <p className="text-2xl font-bold font-display">{macros.protein.grams}g</p>
                <p className="text-xs text-muted-foreground">{macros.protein.calories} kcal</p>
                <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${macros.protein.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{macros.protein.percentage}%</p>
              </div>

              {/* Carbs */}
              <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-sm text-center hover-lift">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">🍚</span>
                </div>
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">Carbs</p>
                <p className="text-2xl font-bold font-display">{macros.carbs.grams}g</p>
                <p className="text-xs text-muted-foreground">{macros.carbs.calories} kcal</p>
                <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${macros.carbs.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{macros.carbs.percentage}%</p>
              </div>

              {/* Fat */}
              <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-sm text-center hover-lift">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">🥑</span>
                </div>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Fat</p>
                <p className="text-2xl font-bold font-display">{macros.fat.grams}g</p>
                <p className="text-xs text-muted-foreground">{macros.fat.calories} kcal</p>
                <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${macros.fat.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{macros.fat.percentage}%</p>
              </div>
            </div>

            {/* Ratio Summary */}
            <div className="p-4 rounded-xl bg-card/40 text-center">
              <p className="text-sm font-medium mb-2">Macro Ratio</p>
              <div className="flex items-center justify-center gap-2 text-lg font-bold font-display">
                <span className="text-emerald-500">{macros.protein.percentage}%</span>
                <span className="text-muted-foreground">:</span>
                <span className="text-amber-500">{macros.carbs.percentage}%</span>
                <span className="text-muted-foreground">:</span>
                <span className="text-blue-500">{macros.fat.percentage}%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Protein : Carbs : Fat</p>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSaveToDashboard}
              className="w-full bg-gradient-to-r from-sage to-emerald-500 hover:from-sage/90 hover:to-emerald-500/90 text-white h-12 rounded-xl font-semibold shadow-lg shadow-sage/25"
            >
              <Check className="mr-2 h-4 w-4" />
              Save Targets to Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
