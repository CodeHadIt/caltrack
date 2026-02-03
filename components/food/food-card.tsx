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
  category?: Omit<FoodCategory, 'created_at'> | null
  onAdd?: () => void
  showAddButton?: boolean
}

export function FoodCard({ food, category: propCategory, onAdd, showAddButton = true }: FoodCardProps) {
  const category = propCategory || DEFAULT_CATEGORIES.find(c => c.id === food.category_id)

  return (
    <Card className="group relative overflow-hidden border-0 bg-card/80 backdrop-blur-sm card-glow hover-lift">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {food.image_url ? (
            <div className="relative h-14 w-14 shrink-0 rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
              <Image
                src={food.image_url}
                alt={food.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="56px"
              />
            </div>
          ) : (
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-md group-hover:scale-105 transition-transform"
              style={{ backgroundColor: `${category?.color}15` }}
            >
              {category?.icon || '🍽️'}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate font-display">{food.name}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge
                variant="secondary"
                className="text-xs px-2.5 py-0.5 rounded-lg font-medium"
                style={{
                  backgroundColor: category?.color ? `${category.color}15` : undefined,
                  color: category?.color || undefined,
                }}
              >
                {category?.name}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div className="flex items-center gap-1.5 text-coral">
                <div className="w-6 h-6 rounded-md bg-coral/10 flex items-center justify-center">
                  <Flame className="h-3.5 w-3.5" />
                </div>
                <span className="font-semibold">{food.calories_per_100g}</span>
                <span className="text-muted-foreground">kcal</span>
              </div>
              <div className="flex items-center gap-1.5 text-sage">
                <div className="w-6 h-6 rounded-md bg-sage/10 flex items-center justify-center">
                  <Beef className="h-3.5 w-3.5" />
                </div>
                <span className="font-semibold">{food.protein_per_100g}g</span>
                <span className="text-muted-foreground">protein</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground font-medium">
              <span className="px-2 py-0.5 rounded-md bg-muted/50">C: {food.carbs_per_100g}g</span>
              <span className="px-2 py-0.5 rounded-md bg-muted/50">F: {food.fat_per_100g}g</span>
            </div>
          </div>

          {showAddButton && (
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 shrink-0 rounded-xl bg-coral/10 text-coral hover:bg-coral/20 hover:text-coral hover:scale-110 transition-all shadow-sm"
              onClick={onAdd}
            >
              <Plus className="h-5 w-5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
