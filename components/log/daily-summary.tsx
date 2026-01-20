'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ProgressRing } from '@/components/charts/progress-ring'
import { MacroPie } from '@/components/charts/macro-pie'
import { DailySummary as DailySummaryType } from '@/types'
import { Flame, Beef, Wheat, Droplet } from 'lucide-react'

interface DailySummaryProps {
  summary: DailySummaryType
  calorieGoal?: number
}

export function DailySummary({ summary, calorieGoal = 2000 }: DailySummaryProps) {
  const percentage = Math.min((summary.totalCalories / calorieGoal) * 100, 100)
  const remaining = Math.max(calorieGoal - summary.totalCalories, 0)

  return (
    <div className="space-y-4">
      <Card className="border-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center">
              <ProgressRing
                value={summary.totalCalories}
                max={calorieGoal}
                size={140}
                strokeWidth={12}
                unit="kcal"
                colorClass={
                  percentage < 75
                    ? 'stroke-emerald-500'
                    : percentage < 100
                    ? 'stroke-teal-500'
                    : percentage < 110
                    ? 'stroke-amber-500'
                    : 'stroke-red-500'
                }
              />
              <p className="text-sm text-muted-foreground mt-2">
                {remaining > 0
                  ? `${remaining} kcal remaining`
                  : `${Math.abs(calorieGoal - summary.totalCalories)} kcal over`}
              </p>
            </div>

            <div className="flex-1 w-full md:w-auto">
              <MacroPie
                protein={summary.totalProtein}
                carbs={summary.totalCarbs}
                fat={summary.totalFat}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-0 bg-gradient-to-br from-orange-500/10 to-orange-500/5 shadow-md">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 text-orange-600">
              <Flame className="h-4 w-4" />
              <span className="text-xs font-medium">Calories</span>
            </div>
            <p className="text-2xl font-bold font-poppins mt-1">
              {summary.totalCalories}
            </p>
            <Progress
              value={(summary.totalCalories / calorieGoal) * 100}
              className="h-1.5 mt-2 bg-orange-100 dark:bg-orange-900/30 [&>div]:bg-orange-500"
            />
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 shadow-md">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <Beef className="h-4 w-4" />
              <span className="text-xs font-medium">Protein</span>
            </div>
            <p className="text-2xl font-bold font-poppins mt-1">
              {summary.totalProtein}g
            </p>
            <Progress
              value={(summary.totalProtein / 150) * 100}
              className="h-1.5 mt-2 bg-emerald-100 dark:bg-emerald-900/30 [&>div]:bg-emerald-500"
            />
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-amber-500/10 to-amber-500/5 shadow-md">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 text-amber-600">
              <Wheat className="h-4 w-4" />
              <span className="text-xs font-medium">Carbs</span>
            </div>
            <p className="text-2xl font-bold font-poppins mt-1">
              {summary.totalCarbs}g
            </p>
            <Progress
              value={(summary.totalCarbs / 250) * 100}
              className="h-1.5 mt-2 bg-amber-100 dark:bg-amber-900/30 [&>div]:bg-amber-500"
            />
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-blue-500/5 shadow-md">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Droplet className="h-4 w-4" />
              <span className="text-xs font-medium">Fat</span>
            </div>
            <p className="text-2xl font-bold font-poppins mt-1">
              {summary.totalFat}g
            </p>
            <Progress
              value={(summary.totalFat / 65) * 100}
              className="h-1.5 mt-2 bg-blue-100 dark:bg-blue-900/30 [&>div]:bg-blue-500"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
