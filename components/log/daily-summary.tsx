'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ProgressRing } from '@/components/charts/progress-ring'
import { MacroPie } from '@/components/charts/macro-pie'
import { CalorieWarning } from '@/components/ui/calorie-warning'
import { DailySummary as DailySummaryType, MacroRecommendation, GOAL_LABELS, GOAL_ICONS } from '@/types'
import { Flame, Beef, Wheat, Droplet, Target } from 'lucide-react'
import Link from 'next/link'

interface DailySummaryProps {
  summary: DailySummaryType
  calorieGoal?: number
  macroTargets?: MacroRecommendation | null
}

export function DailySummary({ summary, calorieGoal = 2000, macroTargets }: DailySummaryProps) {
  // Use macro targets if available, otherwise use defaults
  const effectiveCalorieGoal = macroTargets?.calories || calorieGoal
  const proteinGoal = macroTargets?.protein.grams || 150
  const carbsGoal = macroTargets?.carbs.grams || 250
  const fatGoal = macroTargets?.fat.grams || 65

  const percentage = Math.min((summary.totalCalories / effectiveCalorieGoal) * 100, 100)
  const remaining = Math.max(effectiveCalorieGoal - summary.totalCalories, 0)

  return (
    <div className="space-y-5">
      {/* Goal Banner */}
      {macroTargets && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-sage/10 to-emerald-500/10 border border-sage/20">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-sage" />
            <span className="text-sm font-medium">
              {GOAL_ICONS[macroTargets.goal]} {GOAL_LABELS[macroTargets.goal]} Target
            </span>
          </div>
          <Link href="/calculators" className="text-xs text-sage hover:underline">
            Adjust
          </Link>
        </div>
      )}

      {/* Calorie Warning */}
      {macroTargets && (
        <CalorieWarning
          currentCalories={summary.totalCalories}
          targetCalories={effectiveCalorieGoal}
        />
      )}

      <Card className="border-0 bg-gradient-to-br from-coral/10 via-rose/10 to-peach/10 card-glow overflow-hidden relative">
        <div className="absolute top-0 right-0 w-60 h-60 -mr-20 -mt-20 rounded-full bg-coral/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 -ml-10 -mb-10 rounded-full bg-peach/10 blur-3xl" />
        <CardContent className="pt-8 pb-8 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center">
              <ProgressRing
                value={summary.totalCalories}
                max={effectiveCalorieGoal}
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
                  : `${Math.abs(effectiveCalorieGoal - summary.totalCalories)} kcal over`}
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
            <p className="text-xs text-muted-foreground">/ {effectiveCalorieGoal}</p>
            <Progress
              value={(summary.totalCalories / effectiveCalorieGoal) * 100}
              className="h-2 mt-2 bg-coral/10 dark:bg-coral/20 [&>div]:bg-coral rounded-full"
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
            <p className="text-xs text-muted-foreground">/ {proteinGoal}g</p>
            <Progress
              value={(summary.totalProtein / proteinGoal) * 100}
              className="h-2 mt-2 bg-sage/10 dark:bg-sage/20 [&>div]:bg-sage rounded-full"
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
            <p className="text-xs text-muted-foreground">/ {carbsGoal}g</p>
            <Progress
              value={(summary.totalCarbs / carbsGoal) * 100}
              className="h-2 mt-2 bg-honey/10 dark:bg-honey/20 [&>div]:bg-honey rounded-full"
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
            <p className="text-xs text-muted-foreground">/ {fatGoal}g</p>
            <Progress
              value={(summary.totalFat / fatGoal) * 100}
              className="h-2 mt-2 bg-sky/10 dark:bg-sky/20 [&>div]:bg-sky rounded-full"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
