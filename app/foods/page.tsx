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
      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-poppins flex items-center gap-2">
              <Apple className="h-7 w-7 text-emerald-600" />
              Food Database
            </h1>
            <p className="text-muted-foreground">Browse and add foods to your log</p>
          </div>
          <Link href="/foods/add">
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Custom Food
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search foods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg border-slate-200 dark:border-slate-700"
          />
        </div>

        {/* Category Tabs */}
        <div className="mb-6">
          <CategoryTabs
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* Foods Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading foods...</div>
        ) : filteredFoods.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No foods found</p>
            <Link href="/foods/add">
              <Button variant="outline">Add Custom Food</Button>
            </Link>
          </div>
        ) : selectedCategory ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFoods.map((food) => (
              <Link key={food.id} href={`/log?food=${food.id}`}>
                <FoodCard food={food} showAddButton={false} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {categories.map((category) => {
              const categoryFoods = groupedFoods[category.id] || []
              if (categoryFoods.length === 0) return null

              return (
                <div key={category.id}>
                  <h2 className="text-xl font-semibold font-poppins mb-4 flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      ({categoryFoods.length})
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryFoods.map((food) => (
                      <Link key={food.id} href={`/log?food=${food.id}`}>
                        <FoodCard food={food} showAddButton={false} />
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
