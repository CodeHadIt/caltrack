'use client'

import { Trash2, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FoodLogWithItem } from '@/types'
import { calculateCaloriesFromFood } from '@/lib/utils'
import { DEFAULT_CATEGORIES } from '@/lib/constants'

interface LogEntryProps {
  log: FoodLogWithItem
  onDelete?: () => void
}

export function LogEntry({ log, onDelete }: LogEntryProps) {
  const { calories, protein, carbs, fat } = calculateCaloriesFromFood(
    log.food_item,
    log.weight_grams
  )
  const category = DEFAULT_CATEGORIES.find(c => c.id === log.food_item.category_id)

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors group">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl"
        style={{ backgroundColor: `${category?.color}20` }}
      >
        {category?.icon || '🍽️'}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm truncate">{log.food_item.name}</h4>
          <span className="text-xs text-muted-foreground">
            {log.weight_grams}g
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span>P: {protein}g</span>
          <span>C: {carbs}g</span>
          <span>F: {fat}g</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-orange-500 font-semibold">
          <Flame className="h-4 w-4" />
          <span>{calories}</span>
        </div>
        {onDelete && (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
