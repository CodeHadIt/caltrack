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
        return 'text-sky'
      case 'Athletes':
        return 'text-sage'
      case 'Fitness':
        return 'text-coral'
      case 'Average':
        return 'text-honey'
      case 'Obese':
        return 'text-destructive'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 card-glow bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-display">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-sky to-blue-400 flex items-center justify-center shadow-lg shadow-sky/25">
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
            <Label className="font-medium">Gender</Label>
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
              <Label htmlFor="bf-height" className="font-medium">Height (cm)</Label>
              <Input
                id="bf-height"
                type="number"
                placeholder="e.g., 175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="h-11 rounded-xl border-sky/20 focus:border-sky/40 focus:ring-sky/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bf-neck" className="font-medium">Neck circumference (cm)</Label>
              <Input
                id="bf-neck"
                type="number"
                step="0.1"
                placeholder="e.g., 38"
                value={neck}
                onChange={(e) => setNeck(e.target.value)}
                className="h-11 rounded-xl border-sky/20 focus:border-sky/40 focus:ring-sky/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bf-waist" className="font-medium">Waist circumference (cm)</Label>
              <Input
                id="bf-waist"
                type="number"
                step="0.1"
                placeholder="e.g., 85"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                className="h-11 rounded-xl border-sky/20 focus:border-sky/40 focus:ring-sky/20"
              />
              <p className="text-xs text-muted-foreground">
                Measure at navel level
              </p>
            </div>
            {gender === 'female' && (
              <div className="space-y-2">
                <Label htmlFor="bf-hip" className="font-medium">Hip circumference (cm)</Label>
                <Input
                  id="bf-hip"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 100"
                  value={hip}
                  onChange={(e) => setHip(e.target.value)}
                  className="h-11 rounded-xl border-sky/20 focus:border-sky/40 focus:ring-sky/20"
                />
                <p className="text-xs text-muted-foreground">
                  Measure at widest point
                </p>
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-sky to-blue-400 hover:from-sky hover:to-blue-500 text-white h-12 rounded-xl font-semibold shadow-lg shadow-sky/25"
          >
            <Ruler className="mr-2 h-4 w-4" />
            Calculate Body Fat
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-0 bg-gradient-to-br from-sky/10 via-blue-400/10 to-indigo-400/10 card-glow">
          <CardHeader>
            <CardTitle className="text-lg font-display">Your Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative">
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-sky to-blue-400 flex items-center justify-center shadow-lg shadow-sky/25">
                  <div className="w-32 h-32 rounded-full bg-card flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold font-display">
                      {result.percentage}%
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">Body Fat</span>
                  </div>
                </div>
              </div>
              <p className={`mt-4 text-lg font-semibold ${getCategoryColor(result.category)}`}>
                {result.category}
              </p>
            </div>

            <div className="mt-4 p-5 rounded-2xl bg-card/60 backdrop-blur-sm">
              <h4 className="font-semibold font-display mb-3">Body Fat Categories ({gender === 'male' ? 'Men' : 'Women'})</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-sky font-medium">Essential Fat</span>
                  <span className="text-muted-foreground">
                    {gender === 'male' ? '2-6%' : '10-14%'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage font-medium">Athletes</span>
                  <span className="text-muted-foreground">
                    {gender === 'male' ? '6-14%' : '14-21%'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-coral font-medium">Fitness</span>
                  <span className="text-muted-foreground">
                    {gender === 'male' ? '14-18%' : '21-25%'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-honey font-medium">Average</span>
                  <span className="text-muted-foreground">
                    {gender === 'male' ? '18-25%' : '25-32%'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-destructive font-medium">Obese</span>
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
