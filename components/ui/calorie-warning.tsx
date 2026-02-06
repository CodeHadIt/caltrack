'use client'

import { AlertTriangle, Flame, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalorieWarningProps {
  currentCalories: number
  targetCalories: number
  additionalCalories?: number
  className?: string
}

export function CalorieWarning({
  currentCalories,
  targetCalories,
  additionalCalories = 0,
  className,
}: CalorieWarningProps) {
  const projectedCalories = currentCalories + additionalCalories
  const percentageOfTarget = (projectedCalories / targetCalories) * 100

  // No warning if under 85% of target
  if (percentageOfTarget < 85) {
    return null
  }

  // Determine warning level
  const isApproaching = percentageOfTarget >= 85 && percentageOfTarget < 100
  const isAtLimit = percentageOfTarget >= 100 && percentageOfTarget < 110
  const isExceeded = percentageOfTarget >= 110

  const warningConfig = isExceeded
    ? {
        bg: 'bg-red-500/10 border-red-500/30',
        iconBg: 'bg-red-500/20',
        iconColor: 'text-red-500',
        textColor: 'text-red-600 dark:text-red-400',
        title: 'Calorie Target Exceeded!',
        message: `You're ${Math.round(projectedCalories - targetCalories)} calories over your daily target.`,
        Icon: AlertTriangle,
      }
    : isAtLimit
    ? {
        bg: 'bg-amber-500/10 border-amber-500/30',
        iconBg: 'bg-amber-500/20',
        iconColor: 'text-amber-500',
        textColor: 'text-amber-600 dark:text-amber-400',
        title: 'At Calorie Limit',
        message: `You've reached your daily calorie target of ${targetCalories} kcal.`,
        Icon: Flame,
      }
    : {
        bg: 'bg-sky-500/10 border-sky-500/30',
        iconBg: 'bg-sky-500/20',
        iconColor: 'text-sky-500',
        textColor: 'text-sky-600 dark:text-sky-400',
        title: 'Approaching Target',
        message: `${Math.round(targetCalories - projectedCalories)} calories remaining to reach your daily goal.`,
        Icon: TrendingUp,
      }

  const { bg, iconBg, iconColor, textColor, title, message, Icon } = warningConfig

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border',
        bg,
        className
      )}
    >
      <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', iconBg)}>
        <Icon className={cn('h-5 w-5', iconColor)} />
      </div>
      <div>
        <p className={cn('font-semibold text-sm', textColor)}>{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{message}</p>
        {additionalCalories > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            Current: {currentCalories} kcal → After logging: {projectedCalories} kcal
          </p>
        )}
      </div>
    </div>
  )
}
