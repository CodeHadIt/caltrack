'use client'

import { forwardRef } from 'react'
import { DailySummary } from '@/types'
import { Flame, Beef, Wheat, Droplets } from 'lucide-react'

interface ShareCardProps {
  summary: DailySummary
  calorieGoal?: number
  userName?: string
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  function ShareCard({ summary, calorieGoal = 2000, userName }, ref) {
    const progress = Math.min((summary.totalCalories / calorieGoal) * 100, 100)
    const dateFormatted = new Date(summary.date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })

    return (
      <div
        ref={ref}
        className="w-[400px] p-6 rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, #059669 0%, #0d9488 50%, #0891b2 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-3">
            <Flame className="h-4 w-4 text-white" />
            <span className="text-white text-sm font-medium">CalTrack</span>
          </div>
          <h2 className="text-white text-lg font-medium opacity-90">{dateFormatted}</h2>
          {userName && (
            <p className="text-white/70 text-sm mt-1">{userName}&apos;s Daily Summary</p>
          )}
        </div>

        {/* Calories Circle */}
        <div className="flex justify-center mb-6">
          <div className="relative w-40 h-40">
            {/* Background circle */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${progress * 2.83} 283`}
              />
            </svg>
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-white">{summary.totalCalories}</span>
              <span className="text-white/70 text-sm">of {calorieGoal} kcal</span>
            </div>
          </div>
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
            <div className="flex justify-center mb-1">
              <div className="w-8 h-8 rounded-full bg-emerald-400/30 flex items-center justify-center">
                <Beef className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{summary.totalProtein}g</p>
            <p className="text-white/60 text-xs">Protein</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
            <div className="flex justify-center mb-1">
              <div className="w-8 h-8 rounded-full bg-amber-400/30 flex items-center justify-center">
                <Wheat className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{summary.totalCarbs}g</p>
            <p className="text-white/60 text-xs">Carbs</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
            <div className="flex justify-center mb-1">
              <div className="w-8 h-8 rounded-full bg-blue-400/30 flex items-center justify-center">
                <Droplets className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{summary.totalFat}g</p>
            <p className="text-white/60 text-xs">Fat</p>
          </div>
        </div>

        {/* Meals count */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 mb-4">
          <div className="flex justify-between text-white/80 text-sm">
            <span>Meals logged today</span>
            <span className="font-semibold text-white">
              {Object.values(summary.meals).reduce((acc, meals) => acc + meals.length, 0)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-white/50 text-xs">Track your nutrition with CalTrack</p>
        </div>
      </div>
    )
  }
)
