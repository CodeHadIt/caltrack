'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Loader2 } from 'lucide-react'
import { FoodItem, FoodCategory } from '@/types'
import { DEFAULT_CATEGORIES } from '@/lib/constants'

interface FoodFormData {
  name: string
  category_id: string
  calories_per_100g: number
  protein_per_100g: number
  carbs_per_100g: number
  fat_per_100g: number
}

interface FoodFormProps {
  onSubmit: (food: Omit<FoodItem, 'id' | 'user_id' | 'created_at' | 'is_default'>) => Promise<void>
}

export function FoodForm({ onSubmit }: FoodFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FoodFormData>()

  const selectedCategory = watch('category_id')

  const handleFormSubmit = async (data: FoodFormData) => {
    setIsLoading(true)
    try {
      await onSubmit({
        ...data,
        calories_per_100g: Number(data.calories_per_100g),
        protein_per_100g: Number(data.protein_per_100g),
        carbs_per_100g: Number(data.carbs_per_100g),
        fat_per_100g: Number(data.fat_per_100g),
        image_url: null,
      })
      reset()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-poppins flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Plus className="h-4 w-4 text-white" />
          </div>
          Add Custom Food
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Food Name</Label>
              <Input
                id="name"
                placeholder="e.g., Grilled Chicken Salad"
                {...register('name', { required: 'Name is required' })}
                className="border-slate-200 dark:border-slate-700"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => setValue('category_id', value)}
              >
                <SelectTrigger className="border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                step="0.1"
                placeholder="per 100g"
                {...register('calories_per_100g', {
                  required: 'Required',
                  min: { value: 0, message: 'Must be positive' },
                })}
                className="border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                step="0.1"
                placeholder="per 100g"
                {...register('protein_per_100g', {
                  required: 'Required',
                  min: { value: 0, message: 'Must be positive' },
                })}
                className="border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                step="0.1"
                placeholder="per 100g"
                {...register('carbs_per_100g', {
                  required: 'Required',
                  min: { value: 0, message: 'Must be positive' },
                })}
                className="border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                step="0.1"
                placeholder="per 100g"
                {...register('fat_per_100g', {
                  required: 'Required',
                  min: { value: 0, message: 'Must be positive' },
                })}
                className="border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Food
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
