'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Ruler, Percent } from 'lucide-react'
import { calculateBodyFat } from '@/lib/utils'
import { Gender, BodyFatResult } from '@/types'

export function BodyFatForm() {
  const [height, setHeight] = useState('')
  const [waist, setWaist] = useState('')
  const [neck, setNeck] = useState('')
  const [hip, setHip] = useState('')
  const [gender, setGender] = useState<Gender>('male')
  const [result, setResult] = useState<BodyFatResult | null>(null)
  const [error, setError] = useState('')

  const handleCalculate = () => {
    setError('')
    if (!height || !waist || !neck) {
      setError('Please fill in all required fields')
      return
    }
    if (gender === 'female' && !hip) {
      setError('Hip measurement is required for females')
      return
    }

    try {
      const bodyFatResult = calculateBodyFat(
        gender,
        parseFloat(waist),
        parseFloat(neck),
        parseFloat(height),
        gender === 'female' ? parseFloat(hip) : undefined
      )
      setResult(bodyFatResult)
    } catch (err) {
      setError('Unable to calculate. Please check your measurements.')
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Essential Fat':
        return 'text-blue-600'
      case 'Athletes':
        return 'text-emerald-600'
      case 'Fitness':
        return 'text-teal-600'
      case 'Average':
        return 'text-amber-600'
      case 'Obese':
        return 'text-red-600'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-poppins">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Percent className="h-5 w-5 text-white" />
            </div>
            Body Fat Calculator
          </CardTitle>
          <CardDescription>
            Estimate your body fat percentage using the U.S. Navy method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Gender</Label>
            <RadioGroup
              value={gender}
              onValueChange={(value) => {
                setGender(value as Gender)
                setResult(null)
              }}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="bf-male" />
                <Label htmlFor="bf-male" className="cursor-pointer">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="bf-female" />
                <Label htmlFor="bf-female" className="cursor-pointer">Female</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bf-height">Height (cm)</Label>
              <Input
                id="bf-height"
                type="number"
                placeholder="e.g., 175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="border-slate-200 dark:border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bf-neck">Neck circumference (cm)</Label>
              <Input
                id="bf-neck"
                type="number"
                step="0.1"
                placeholder="e.g., 38"
                value={neck}
                onChange={(e) => setNeck(e.target.value)}
                className="border-slate-200 dark:border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bf-waist">Waist circumference (cm)</Label>
              <Input
                id="bf-waist"
                type="number"
                step="0.1"
                placeholder="e.g., 85"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                className="border-slate-200 dark:border-slate-700"
              />
              <p className="text-xs text-muted-foreground">
                Measure at navel level
              </p>
            </div>
            {gender === 'female' && (
              <div className="space-y-2">
                <Label htmlFor="bf-hip">Hip circumference (cm)</Label>
                <Input
                  id="bf-hip"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 100"
                  value={hip}
                  onChange={(e) => setHip(e.target.value)}
                  className="border-slate-200 dark:border-slate-700"
                />
                <p className="text-xs text-muted-foreground">
                  Measure at widest point
                </p>
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
          >
            <Ruler className="mr-2 h-4 w-4" />
            Calculate Body Fat
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-poppins">Your Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full bg-white dark:bg-slate-900 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold font-poppins">
                      {result.percentage}%
                    </span>
                    <span className="text-xs text-muted-foreground">Body Fat</span>
                  </div>
                </div>
              </div>
              <p className={`mt-4 text-lg font-semibold ${getCategoryColor(result.category)}`}>
                {result.category}
              </p>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-white/60 dark:bg-slate-800/60">
              <h4 className="font-semibold mb-3">Body Fat Categories ({gender === 'male' ? 'Men' : 'Women'})</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-600">Essential Fat</span>
                  <span className="text-muted-foreground">
                    {gender === 'male' ? '2-6%' : '10-14%'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-600">Athletes</span>
                  <span className="text-muted-foreground">
                    {gender === 'male' ? '6-14%' : '14-21%'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-teal-600">Fitness</span>
                  <span className="text-muted-foreground">
                    {gender === 'male' ? '14-18%' : '21-25%'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-600">Average</span>
                  <span className="text-muted-foreground">
                    {gender === 'male' ? '18-25%' : '25-32%'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Obese</span>
                  <span className="text-muted-foreground">
                    {gender === 'male' ? '>25%' : '>32%'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
