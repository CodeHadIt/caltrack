'use client'

import { MIXED_VEGETABLES_OPTIONS, MixVegetableOption } from '@/lib/constants'
import { Button } from '@/components/ui/button'

interface VegetableMixCustomizerProps {
  selected: Set<string>
  onSelectionChange: (selected: Set<string>) => void
}

function getAveragedNutrients(selected: Set<string>) {
  const selectedVegs = MIXED_VEGETABLES_OPTIONS.filter(v => selected.has(v.name))
  if (selectedVegs.length === 0) return { calories: 0, protein: 0, carbs: 0, fat: 0 }

  const count = selectedVegs.length
  return {
    calories: Math.round(selectedVegs.reduce((sum, v) => sum + v.calories_per_100g, 0) / count),
    protein: Math.round(selectedVegs.reduce((sum, v) => sum + v.protein_per_100g, 0) / count * 10) / 10,
    carbs: Math.round(selectedVegs.reduce((sum, v) => sum + v.carbs_per_100g, 0) / count * 10) / 10,
    fat: Math.round(selectedVegs.reduce((sum, v) => sum + v.fat_per_100g, 0) / count * 10) / 10,
  }
}

export { getAveragedNutrients }

export function VegetableMixCustomizer({ selected, onSelectionChange }: VegetableMixCustomizerProps) {
  const allSelected = selected.size === MIXED_VEGETABLES_OPTIONS.length
  const nutrients = getAveragedNutrients(selected)

  const handleToggle = (name: string) => {
    const next = new Set(selected)
    if (next.has(name)) {
      if (next.size <= 1) return // at least 1 must stay selected
      next.delete(name)
    } else {
      next.add(name)
    }
    onSelectionChange(next)
  }

  const handleToggleAll = () => {
    if (allSelected) {
      // Clear to just the first vegetable
      onSelectionChange(new Set([MIXED_VEGETABLES_OPTIONS[0].name]))
    } else {
      onSelectionChange(new Set(MIXED_VEGETABLES_OPTIONS.map(v => v.name)))
    }
  }

  return (
    <div className="rounded-xl bg-muted/30 border border-coral/10 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">Customize your mix</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleAll}
          className="h-6 px-2 text-[10px] text-coral hover:bg-coral/10"
        >
          {allSelected ? 'Clear' : 'Select All'}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {MIXED_VEGETABLES_OPTIONS.map((veg) => {
          const isActive = selected.has(veg.name)
          return (
            <button
              key={veg.name}
              onClick={() => handleToggle(veg.name)}
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg text-[10px] font-medium transition-all ${
                isActive
                  ? 'bg-coral/15 text-coral border border-coral/30'
                  : 'bg-muted/40 text-muted-foreground border border-transparent hover:bg-muted/60'
              }`}
            >
              <span className="text-sm">{veg.emoji}</span>
              <span className="truncate w-full text-center">{veg.name}</span>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
        <div className="p-1.5 rounded-lg bg-card/60">
          <p className="font-bold text-coral">{nutrients.calories}</p>
          <p className="text-muted-foreground">cal</p>
        </div>
        <div className="p-1.5 rounded-lg bg-card/60">
          <p className="font-bold text-sage">{nutrients.protein}g</p>
          <p className="text-muted-foreground">protein</p>
        </div>
        <div className="p-1.5 rounded-lg bg-card/60">
          <p className="font-bold text-honey">{nutrients.carbs}g</p>
          <p className="text-muted-foreground">carbs</p>
        </div>
        <div className="p-1.5 rounded-lg bg-card/60">
          <p className="font-bold text-sky">{nutrients.fat}g</p>
          <p className="text-muted-foreground">fat</p>
        </div>
      </div>
      <p className="text-[9px] text-muted-foreground text-center">Average per 100g based on {selected.size} vegetable{selected.size !== 1 ? 's' : ''}</p>
    </div>
  )
}
