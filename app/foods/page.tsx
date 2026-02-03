'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AppWrapper } from '@/components/app-wrapper'
import { FoodCard } from '@/components/food/food-card'
import { CategoryTabs } from '@/components/food/category-tabs'
import { useAuth } from '@/lib/hooks/use-auth'
import { useFoodLog } from '@/lib/hooks/use-food-log'
import { Search, Plus, Apple } from 'lucide-react'
import { FoodItem } from '@/types'

export default function FoodsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { userId, isGuest, isLoading: authLoading } = useAuth()
  const { foods, fetchFoods, categories, isLoading } = useFoodLog(userId, isGuest)

  useEffect(() => {
    if (!authLoading) {
      fetchFoods()
    }
  }, [authLoading, fetchFoods])

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || food.category_id === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [foods, searchQuery, selectedCategory])

  const groupedFoods = useMemo(() => {
    const groups: Record<string, FoodItem[]> = {}
    filteredFoods.forEach((food) => {
      if (!groups[food.category_id]) {
        groups[food.category_id] = []
      }
      groups[food.category_id].push(food)
    })
    return groups
  }, [filteredFoods])

  return (
    <AppWrapper>
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-display flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center">
                <Apple className="h-6 w-6 text-sage" />
              </div>
              Food Database
            </h1>
            <p className="text-muted-foreground mt-2">Browse and add foods to your log</p>
          </div>
          <Link href="/foods/add">
            <Button className="btn-gradient text-white rounded-xl shadow-lg shadow-coral/25 font-semibold">
              <Plus className="mr-2 h-4 w-4" />
              Add Custom Food
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-6">
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
        <div className="mb-8">
          <CategoryTabs
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* Foods Grid */}
        {isLoading ? (
          <div className="text-center py-16 text-muted-foreground">
            <div className="w-16 h-16 rounded-2xl bg-coral/10 flex items-center justify-center mx-auto mb-4">
              <Apple className="h-8 w-8 text-coral/50 animate-pulse" />
            </div>
            Loading foods...
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground mb-4">No foods found</p>
            <Link href="/foods/add">
              <Button variant="outline" className="rounded-xl border-coral/20 hover:bg-coral/5">
                <Plus className="mr-2 h-4 w-4 text-coral" />
                Add Custom Food
              </Button>
            </Link>
          </div>
        ) : selectedCategory ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFoods.map((food) => {
              const foodCategory = categories.find(c => c.id === food.category_id)
              return (
                <Link key={food.id} href={`/log?food=${food.id}`}>
                  <FoodCard food={food} category={foodCategory} showAddButton={false} />
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="space-y-10">
            {categories.map((category) => {
              const categoryFoods = groupedFoods[category.id] || []
              if (categoryFoods.length === 0) return null

              return (
                <div key={category.id}>
                  <h2 className="text-xl font-bold font-display mb-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center text-xl">
                      {category.icon}
                    </div>
                    <span>{category.name}</span>
                    <span className="text-sm font-normal px-2.5 py-0.5 rounded-lg bg-muted/50 text-muted-foreground">
                      {categoryFoods.length}
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {categoryFoods.map((food) => (
                      <Link key={food.id} href={`/log?food=${food.id}`}>
                        <FoodCard food={food} category={category} showAddButton={false} />
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </AppWrapper>
  )
}
