'use client'

import { cn } from '@/lib/utils'
import { FoodCategory } from '@/types'

interface CategoryTabsProps {
  categories: Omit<FoodCategory, 'created_at'>[]
  selected: string | null
  onSelect: (categoryId: string | null) => void
}

export function CategoryTabs({ categories, selected, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          'px-4 py-2 rounded-full text-sm font-medium transition-all',
          selected === null
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
            : 'bg-slate-100 dark:bg-slate-800 text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-700'
        )}
      >
        All Foods
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2',
            selected === category.id
              ? 'text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-700'
          )}
          style={
            selected === category.id
              ? { backgroundColor: category.color || '#10b981' }
              : {}
          }
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  )
}
