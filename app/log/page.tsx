'use client'

import { Suspense, useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AppWrapper } from '@/components/app-wrapper'
import { FoodCard } from '@/components/food/food-card'
import { CategoryTabs } from '@/components/food/category-tabs'
import { useAuth } from '@/lib/hooks/use-auth'
import { useFoodLog } from '@/lib/hooks/use-food-log'
import { toast } from 'sonner'
import { calculateCaloriesFromFood, getToday } from '@/lib/utils'
import { Search, ArrowLeft, UtensilsCrossed, Loader2, Plus, Check } from 'lucide-react'
import { FoodItem, MealTime, MEAL_TIME_LABELS, MEAL_TIME_ICONS } from '@/types'

function LogPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedFoodId = searchParams.get('food')

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const [weight, setWeight] = useState(100)
  const [mealTime, setMealTime] = useState<MealTime>('lunch')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { userId, isGuest, isLoading: authLoading } = useAuth()
  const { foods, fetchFoods, addLog, categories, isLoading } = useFoodLog(userId, isGuest)

  useEffect(() => {
    if (!authLoading) {
      fetchFoods()
    }
  }, [authLoading, fetchFoods])

  useEffect(() => {
    if (preselectedFoodId && foods.length > 0) {
      const food = foods.find((f) => f.id === preselectedFoodId)
      if (food) {
        setSelectedFood(food)
      }
    }
  }, [preselectedFoodId, foods])

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || food.category_id === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [foods, searchQuery, selectedCategory])

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food)
    setWeight(100)
  }

  const handleSubmit = async () => {
    if (!selectedFood) return

    setIsSubmitting(true)
    const { error } = await addLog(selectedFood.id, weight, mealTime, getToday())

    if (error) {
      toast.error('Failed to log food')
      setIsSubmitting(false)
      return
    }

    toast.success('Food logged successfully!')
    router.push('/dashboard')
  }

  const nutrients = selectedFood
    ? calculateCaloriesFromFood(selectedFood, weight)
    : null

  return (
    <AppWrapper>
      <main className="container mx-auto px-4 py-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-poppins flex items-center gap-2">
              <UtensilsCrossed className="h-7 w-7 text-emerald-600" />
              Log Food
            </h1>
            <p className="text-muted-foreground">Select a food and set the amount</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Food Selection */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>

            {/* Category Tabs */}
            <CategoryTabs
              categories={categories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />

            {/* Foods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
              {isLoading ? (
                <div className="col-span-2 text-center py-12 text-muted-foreground">
                  Loading foods...
                </div>
              ) : filteredFoods.length === 0 ? (
                <div className="col-span-2 text-center py-12">
                  <p className="text-muted-foreground mb-4">No foods found</p>
                  <Link href="/foods/add">
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Custom Food
                    </Button>
                  </Link>
                </div>
              ) : (
                filteredFoods.map((food) => (
                  <div
                    key={food.id}
                    onClick={() => handleSelectFood(food)}
                    className={`cursor-pointer transition-all ${
                      selectedFood?.id === food.id
                        ? 'ring-2 ring-emerald-500 ring-offset-2 rounded-xl'
                        : ''
                    }`}
                  >
                    <FoodCard food={food} showAddButton={false} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Log Form */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 sticky top-20">
              <CardHeader>
                <CardTitle className="text-lg font-poppins">
                  {selectedFood ? selectedFood.name : 'Select a food'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedFood ? (
                  <div className="space-y-6">
                    {/* Weight Slider */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Amount</Label>
                        <span className="text-2xl font-bold font-poppins text-emerald-600">
                          {weight}g
                        </span>
                      </div>
                      <Slider
                        value={[weight]}
                        onValueChange={([value]) => setWeight(value)}
                        min={10}
                        max={500}
                        step={5}
                        className="[&>span]:bg-emerald-500"
                      />
                      <div className="flex gap-2">
                        {[50, 100, 150, 200, 250].map((preset) => (
                          <Button
                            key={preset}
                            variant="outline"
                            size="sm"
                            onClick={() => setWeight(preset)}
                            className={weight === preset ? 'border-emerald-500 text-emerald-600' : ''}
                          >
                            {preset}g
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Meal Time */}
                    <div className="space-y-2">
                      <Label>Meal</Label>
                      <Select
                        value={mealTime}
                        onValueChange={(value) => setMealTime(value as MealTime)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(MEAL_TIME_LABELS) as MealTime[]).map((time) => (
                            <SelectItem key={time} value={time}>
                              <span className="flex items-center gap-2">
                                <span>{MEAL_TIME_ICONS[time]}</span>
                                <span>{MEAL_TIME_LABELS[time]}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Nutrition Preview */}
                    {nutrients && (
                      <div className="p-4 rounded-xl bg-emerald-500/10">
                        <div className="grid grid-cols-2 gap-3 text-center">
                          <div>
                            <p className="text-2xl font-bold font-poppins text-orange-600">
                              {nutrients.calories}
                            </p>
                            <p className="text-xs text-muted-foreground">Calories</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold font-poppins text-emerald-600">
                              {nutrients.protein}g
                            </p>
                            <p className="text-xs text-muted-foreground">Protein</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold font-poppins text-amber-600">
                              {nutrients.carbs}g
                            </p>
                            <p className="text-xs text-muted-foreground">Carbs</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold font-poppins text-blue-600">
                              {nutrients.fat}g
                            </p>
                            <p className="text-xs text-muted-foreground">Fat</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white h-12"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Log Food
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Click on a food to select it
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </AppWrapper>
  )
}

export default function LogPage() {
  return (
    <Suspense fallback={
      <AppWrapper>
        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        </main>
      </AppWrapper>
    }>
      <LogPageContent />
    </Suspense>
  )
}
