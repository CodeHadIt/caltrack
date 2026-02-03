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
    <div className="space-y-5">
      <Card className="border-0 bg-gradient-to-br from-coral/10 via-rose/10 to-peach/10 card-glow overflow-hidden relative">
        <div className="absolute top-0 right-0 w-60 h-60 -mr-20 -mt-20 rounded-full bg-coral/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 -ml-10 -mb-10 rounded-full bg-peach/10 blur-3xl" />
        <CardContent className="pt-8 pb-8 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center">
              <ProgressRing
                value={summary.totalCalories}
                max={calorieGoal}
                size={160}
                strokeWidth={14}
                unit="kcal"
                colorClass={
                  percentage < 75
                    ? 'stroke-sage'
                    : percentage < 100
                    ? 'stroke-coral'
                    : percentage < 110
                    ? 'stroke-honey'
                    : 'stroke-destructive'
                }
              />
              <p className="text-sm text-muted-foreground mt-3 font-medium">
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 bg-gradient-to-br from-coral/15 to-coral/5 card-glow hover-lift group">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-2 text-coral">
              <div className="w-8 h-8 rounded-lg bg-coral/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Flame className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold">Calories</span>
            </div>
            <p className="text-3xl font-bold font-display mt-3">
              {summary.totalCalories}
            </p>
            <Progress
              value={(summary.totalCalories / calorieGoal) * 100}
              className="h-2 mt-3 bg-coral/10 dark:bg-coral/20 [&>div]:bg-coral rounded-full"
            />
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-sage/15 to-sage/5 card-glow hover-lift group">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-2 text-sage">
              <div className="w-8 h-8 rounded-lg bg-sage/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Beef className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold">Protein</span>
            </div>
            <p className="text-3xl font-bold font-display mt-3">
              {summary.totalProtein}g
            </p>
            <Progress
              value={(summary.totalProtein / 150) * 100}
              className="h-2 mt-3 bg-sage/10 dark:bg-sage/20 [&>div]:bg-sage rounded-full"
            />
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-honey/15 to-honey/5 card-glow hover-lift group">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-2 text-honey">
              <div className="w-8 h-8 rounded-lg bg-honey/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wheat className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold">Carbs</span>
            </div>
            <p className="text-3xl font-bold font-display mt-3">
              {summary.totalCarbs}g
            </p>
            <Progress
              value={(summary.totalCarbs / 250) * 100}
              className="h-2 mt-3 bg-honey/10 dark:bg-honey/20 [&>div]:bg-honey rounded-full"
            />
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-sky/15 to-sky/5 card-glow hover-lift group">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-2 text-sky">
              <div className="w-8 h-8 rounded-lg bg-sky/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Droplet className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold">Fat</span>
            </div>
            <p className="text-3xl font-bold font-display mt-3">
              {summary.totalFat}g
            </p>
            <Progress
              value={(summary.totalFat / 65) * 100}
              className="h-2 mt-3 bg-sky/10 dark:bg-sky/20 [&>div]:bg-sky rounded-full"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
