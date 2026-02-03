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
          <CardContent>
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

            <p className="text-sm text-muted-foreground mt-4 text-center">
              TDEE = BMR × Activity Multiplier. For weight loss, aim for a 500 calorie deficit. For weight gain, aim for a 500 calorie surplus.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
