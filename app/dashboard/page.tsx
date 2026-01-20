'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format, subDays, parseISO } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AppWrapper } from '@/components/app-wrapper'
import { DailySummary } from '@/components/log/daily-summary'
import { MealSection } from '@/components/log/meal-section'
import { CalorieChart } from '@/components/charts/calorie-chart'
import { WeeklyTrend } from '@/components/charts/weekly-trend'
import { useAuth } from '@/lib/hooks/use-auth'
import { useFoodLog } from '@/lib/hooks/use-food-log'
import { getToday, formatDateShort } from '@/lib/utils'
import { Plus, Calendar, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react'
import { MealTime } from '@/types'

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(getToday())
  const { userId, isGuest, isLoading: authLoading } = useAuth()
  const { logs, fetchLogs, removeLog, getDailySummary, isLoading } = useFoodLog(
    userId,
    isGuest
  )

  useEffect(() => {
    if (!authLoading) {
      fetchLogs(selectedDate)
    }
  }, [selectedDate, authLoading, fetchLogs])

  const summary = getDailySummary(selectedDate)

  const goToPreviousDay = () => {
    setSelectedDate(format(subDays(parseISO(selectedDate), 1), 'yyyy-MM-dd'))
  }

  const goToNextDay = () => {
    const tomorrow = format(subDays(parseISO(selectedDate), -1), 'yyyy-MM-dd')
    const today = getToday()
    if (tomorrow <= today) {
      setSelectedDate(tomorrow)
    }
  }

  const goToToday = () => {
    setSelectedDate(getToday())
  }

  const isToday = selectedDate === getToday()

  // Generate mock weekly data for charts
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd')
    const isSelected = date === selectedDate
    return {
      date: format(parseISO(date), 'MMM d'),
      calories: isSelected ? summary.totalCalories : Math.floor(Math.random() * 500 + 1500),
      label: format(parseISO(date), 'EEE'),
    }
  })

  const handleDeleteLog = async (logId: string) => {
    await removeLog(logId)
  }

  return (
    <AppWrapper>
      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-poppins">Dashboard</h1>
            <p className="text-muted-foreground">Track your daily nutrition</p>
          </div>
          <Link href="/log">
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Log Food
            </Button>
          </Link>
        </div>

        {/* Date Navigation */}
        <Card className="mb-6 border-0 shadow-md bg-white/60 dark:bg-slate-800/60">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={goToPreviousDay}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-emerald-600" />
                <span className="font-semibold">
                  {format(parseISO(selectedDate), 'EEEE, MMMM d, yyyy')}
                </span>
                {!isToday && (
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    Today
                  </Button>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNextDay}
                disabled={isToday}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Daily Summary */}
        <div className="mb-6">
          <DailySummary summary={summary} calorieGoal={2000} />
        </div>

        {/* Meals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {(['breakfast', 'lunch', 'dinner', 'snack'] as MealTime[]).map((mealTime) => (
            <MealSection
              key={mealTime}
              mealTime={mealTime}
              logs={summary.meals[mealTime]}
              onDeleteLog={handleDeleteLog}
            />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-poppins">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                Weekly Calories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CalorieChart data={weeklyData} goal={2000} />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-poppins">
                <TrendingUp className="h-5 w-5 text-cyan-600" />
                Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WeeklyTrend data={weeklyData} goal={2000} />
            </CardContent>
          </Card>
        </div>

        {/* Guest Mode Banner */}
        {isGuest && (
          <Card className="mt-6 border-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
            <CardContent className="py-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">You&apos;re using guest mode</p>
                  <p className="text-sm text-muted-foreground">
                    Create an account to sync your data across devices
                  </p>
                </div>
                <Link href="/auth/signup">
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
                    Create Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </AppWrapper>
  )
}
