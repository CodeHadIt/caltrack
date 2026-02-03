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
      <main className="container mx-auto px-4 py-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6 rounded-xl hover:bg-coral/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-display flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-coral/10 flex items-center justify-center">
                <UtensilsCrossed className="h-6 w-6 text-coral" />
              </div>
              Log Food
            </h1>
            <p className="text-muted-foreground mt-2">Select a food and set the amount</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Food Selection */}
          <div className="lg:col-span-2 space-y-5">
            {/* Search */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-coral/10 flex items-center justify-center">
                <Search className="h-4 w-4 text-coral" />
              </div>
              <Input
                placeholder="Search foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 h-14 text-lg rounded-2xl border-coral/20 focus:border-coral/40 focus:ring-coral/20"
              />
            </div>

            {/* Category Tabs */}
            <CategoryTabs
              categories={categories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />

            {/* Foods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-2 scrollbar-thin">
              {isLoading ? (
                <div className="col-span-2 text-center py-16 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-coral" />
                  Loading foods...
                </div>
              ) : filteredFoods.length === 0 ? (
                <div className="col-span-2 text-center py-16">
                  <p className="text-muted-foreground mb-4">No foods found</p>
                  <Link href="/foods/add">
                    <Button variant="outline" className="rounded-xl border-coral/20 hover:bg-coral/5">
                      <Plus className="mr-2 h-4 w-4 text-coral" />
                      Add Custom Food
                    </Button>
                  </Link>
                </div>
              ) : (
                filteredFoods.map((food) => {
                  const foodCategory = categories.find(c => c.id === food.category_id)
                  return (
                    <div
                      key={food.id}
                      onClick={() => handleSelectFood(food)}
                      className={`cursor-pointer transition-all ${
                        selectedFood?.id === food.id
                          ? 'ring-2 ring-coral ring-offset-2 rounded-2xl'
                          : ''
                      }`}
                    >
                      <FoodCard food={food} category={foodCategory} showAddButton={false} />
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Log Form */}
          <div className="lg:col-span-1">
            <Card className="border-0 card-glow bg-card/90 backdrop-blur-sm sticky top-24 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 rounded-full bg-coral/10 blur-3xl" />
              <CardHeader className="relative">
                <CardTitle className="text-xl font-display">
                  {selectedFood ? selectedFood.name : 'Select a food'}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                {selectedFood ? (
                  <div className="space-y-6">
                    {/* Weight Slider */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">Amount</Label>
                        <span className="text-3xl font-bold font-display text-coral">
                          {weight}g
                        </span>
                      </div>
                      <Slider
                        value={[weight]}
                        onValueChange={([value]) => setWeight(value)}
                        min={10}
                        max={500}
                        step={5}
                        className="[&>span]:bg-coral"
                      />
                      <div className="flex gap-2 flex-wrap">
                        {[50, 100, 150, 200, 250].map((preset) => (
                          <Button
                            key={preset}
                            variant="outline"
                            size="sm"
                            onClick={() => setWeight(preset)}
                            className={`rounded-lg ${weight === preset ? 'border-coral bg-coral/10 text-coral' : 'border-coral/20 hover:bg-coral/5'}`}
                          >
                            {preset}g
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Meal Time */}
                    <div className="space-y-2">
                      <Label className="font-medium">Meal</Label>
                      <Select
                        value={mealTime}
                        onValueChange={(value) => setMealTime(value as MealTime)}
                      >
                        <SelectTrigger className="h-12 rounded-xl border-coral/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {(Object.keys(MEAL_TIME_LABELS) as MealTime[]).map((time) => (
                            <SelectItem key={time} value={time} className="rounded-lg">
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
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-coral/10 via-rose/10 to-peach/10">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="p-3 rounded-xl bg-card/60">
                            <p className="text-2xl font-bold font-display text-coral">
                              {nutrients.calories}
                            </p>
                            <p className="text-xs text-muted-foreground font-medium">Calories</p>
                          </div>
                          <div className="p-3 rounded-xl bg-card/60">
                            <p className="text-2xl font-bold font-display text-sage">
                              {nutrients.protein}g
                            </p>
                            <p className="text-xs text-muted-foreground font-medium">Protein</p>
                          </div>
                          <div className="p-3 rounded-xl bg-card/60">
                            <p className="text-2xl font-bold font-display text-honey">
                              {nutrients.carbs}g
                            </p>
                            <p className="text-xs text-muted-foreground font-medium">Carbs</p>
                          </div>
                          <div className="p-3 rounded-xl bg-card/60">
                            <p className="text-2xl font-bold font-display text-sky">
                              {nutrients.fat}g
                            </p>
                            <p className="text-xs text-muted-foreground font-medium">Fat</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full btn-gradient text-white h-14 rounded-2xl font-semibold shadow-lg shadow-coral/25"
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
                  <div className="text-center text-muted-foreground py-12">
                    <div className="w-16 h-16 rounded-2xl bg-coral/10 flex items-center justify-center mx-auto mb-4">
                      <UtensilsCrossed className="h-8 w-8 text-coral/50" />
                    </div>
                    <p>Click on a food to select it</p>
                  </div>
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
