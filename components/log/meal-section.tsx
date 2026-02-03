'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LogEntry } from './log-entry'
import { FoodLogWithItem, MealTime, MEAL_TIME_LABELS, MEAL_TIME_ICONS } from '@/types'
import { calculateDailyTotals } from '@/lib/utils'

interface MealSectionProps {
  mealTime: MealTime
  logs: FoodLogWithItem[]
  onDeleteLog?: (logId: string) => void
}

export function MealSection({ mealTime, logs, onDeleteLog }: MealSectionProps) {
  const totals = calculateDailyTotals(logs)

  return (
    <Card className="border-0 bg-card/80 backdrop-blur-sm card-glow hover-lift">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-base font-display">
            <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center text-xl">
              {MEAL_TIME_ICONS[mealTime]}
            </div>
            <span className="font-semibold">{MEAL_TIME_LABELS[mealTime]}</span>
          </div>
          {logs.length > 0 && (
            <span className="text-sm font-semibold px-3 py-1 rounded-lg bg-coral/10 text-coral">
              {totals.calories} kcal
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-2 text-2xl opacity-50">
              {MEAL_TIME_ICONS[mealTime]}
            </div>
            <p className="text-sm text-muted-foreground">
              No foods logged for {MEAL_TIME_LABELS[mealTime].toLowerCase()}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <LogEntry
                key={log.id}
                log={log}
                onDelete={onDeleteLog ? () => onDeleteLog(log.id) : undefined}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
