'use client'

import { useRouter } from 'next/navigation'
import { AppWrapper } from '@/components/app-wrapper'
import { FoodForm } from '@/components/food/food-form'
import { useAuth } from '@/lib/hooks/use-auth'
import { useFoodLog } from '@/lib/hooks/use-food-log'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FoodItem } from '@/types'

export default function AddFoodPage() {
  const router = useRouter()
  const { userId, isGuest } = useAuth()
  const { addCustomFood } = useFoodLog(userId, isGuest)

  const handleSubmit = async (food: Omit<FoodItem, 'id' | 'user_id' | 'created_at' | 'is_default'>) => {
    const { error } = await addCustomFood(food)

    if (error) {
      toast.error('Failed to add food', {
        description: 'Please try again',
      })
      return
    }

    toast.success('Food added successfully!')
    router.push('/foods')
  }

  return (
    <AppWrapper>
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <Link href="/foods">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Foods
          </Button>
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold font-poppins">Add Custom Food</h1>
          <p className="text-muted-foreground">
            Create a new food item with nutritional information
          </p>
        </div>

        <FoodForm onSubmit={handleSubmit} />
      </main>
    </AppWrapper>
  )
}
