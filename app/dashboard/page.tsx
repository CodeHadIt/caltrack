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
import { ShareDialog } from '@/components/share/share-dialog'
import { useAuth } from '@/lib/hooks/use-auth'
import { useFoodLog } from '@/lib/hooks/use-food-log'
import { getToday, formatDateShort } from '@/lib/utils'
import { Plus, Calendar, ChevronLeft, ChevronRight, TrendingUp, Share2, Sparkles } from 'lucide-react'
import { MealTime } from '@/types'

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(getToday())
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
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
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-display">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Track your daily nutrition</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShareDialogOpen(true)}
              className="border-coral/20 hover:bg-coral/5 hover:border-coral/40 rounded-xl"
            >
              <Share2 className="mr-2 h-4 w-4 text-coral" />
              Share
            </Button>
            <Link href="/log">
              <Button className="btn-gradient text-white rounded-xl shadow-lg shadow-coral/25 font-semibold">
                <Plus className="mr-2 h-4 w-4" />
                Log Food
              </Button>
            </Link>
          </div>
        </div>

        {/* Date Navigation */}
        <Card className="mb-8 border-0 card-glow bg-card/80 backdrop-blur-sm">
          <CardContent className="py-5">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={goToPreviousDay} className="rounded-xl hover:bg-coral/10">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-coral" />
                </div>
                <span className="font-semibold font-display text-lg">
                  {format(parseISO(selectedDate), 'EEEE, MMMM d, yyyy')}
                </span>
                {!isToday && (
                  <Button variant="outline" size="sm" onClick={goToToday} className="rounded-lg border-coral/20 hover:bg-coral/5 ml-2">
                    Today
                  </Button>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNextDay}
                disabled={isToday}
                className="rounded-xl hover:bg-coral/10"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Daily Summary */}
        <div className="mb-8">
          <DailySummary summary={summary} calorieGoal={2000} />
        </div>

        {/* Meals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
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
          <Card className="border-0 card-glow bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg font-display">
                <div className="w-9 h-9 rounded-xl bg-sage/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-sage" />
                </div>
                Weekly Calories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CalorieChart data={weeklyData} goal={2000} />
            </CardContent>
          </Card>

          <Card className="border-0 card-glow bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg font-display">
                <div className="w-9 h-9 rounded-xl bg-sky/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-sky" />
                </div>
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
          <Card className="mt-8 border-0 bg-gradient-to-r from-coral/10 via-rose/10 to-peach/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-40 h-40 -mr-10 -mt-10 rounded-full bg-coral/10 blur-3xl" />
            <CardContent className="py-6 relative">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-coral/10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-coral" />
                  </div>
                  <div>
                    <p className="font-semibold font-display text-lg">You&apos;re using guest mode</p>
                    <p className="text-sm text-muted-foreground">
                      Create an account to sync your data across devices
                    </p>
                  </div>
                </div>
                <Link href="/auth/signup">
                  <Button className="btn-gradient text-white rounded-xl shadow-lg shadow-coral/25 font-semibold">
                    Create Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Share Dialog */}
        <ShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          summary={summary}
          calorieGoal={2000}
        />
      </main>
    </AppWrapper>
  )
}
