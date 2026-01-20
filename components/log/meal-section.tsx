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
    <Card className="border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base font-poppins">
            <span className="text-xl">{MEAL_TIME_ICONS[mealTime]}</span>
            <span>{MEAL_TIME_LABELS[mealTime]}</span>
          </div>
          {logs.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              {totals.calories} kcal
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No foods logged for {MEAL_TIME_LABELS[mealTime].toLowerCase()}
          </p>
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
