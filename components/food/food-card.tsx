'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Flame, Beef } from 'lucide-react'
import { FoodItem, FoodCategory } from '@/types'
import { DEFAULT_CATEGORIES } from '@/lib/constants'

interface FoodCardProps {
  food: FoodItem
  onAdd?: () => void
  showAddButton?: boolean
}

export function FoodCard({ food, onAdd, showAddButton = true }: FoodCardProps) {
  const category = DEFAULT_CATEGORIES.find(c => c.id === food.category_id)

  return (
    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
            style={{ backgroundColor: `${category?.color}20` }}
          >
            {category?.icon || '🍽️'}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{food.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="secondary"
                className="text-xs px-2 py-0"
                style={{
                  backgroundColor: category?.color ? `${category.color}20` : undefined,
                  color: category?.color || undefined,
                }}
              >
                {category?.name}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div className="flex items-center gap-1.5 text-orange-600">
                <Flame className="h-3.5 w-3.5" />
                <span className="font-medium">{food.calories_per_100g}</span>
                <span className="text-muted-foreground">kcal</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600">
                <Beef className="h-3.5 w-3.5" />
                <span className="font-medium">{food.protein_per_100g}g</span>
                <span className="text-muted-foreground">protein</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>C: {food.carbs_per_100g}g</span>
              <span>F: {food.fat_per_100g}g</span>
            </div>
          </div>

          {showAddButton && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 shrink-0 rounded-full bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 hover:text-emerald-700"
              onClick={onAdd}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
