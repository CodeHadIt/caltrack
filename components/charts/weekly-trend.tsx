'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

interface WeeklyTrendProps {
  data: Array<{
    date: string
    calories: number
    label: string
  }>
  goal?: number
}

export function WeeklyTrend({ data, goal }: WeeklyTrendProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        No trend data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
        />
        <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload
              return (
                <div className="bg-background border rounded-lg shadow-lg p-3">
                  <p className="font-medium">{data.date}</p>
                  <p className="text-sm">
                    <span className="text-cyan-500 font-semibold">
                      {data.calories}
                    </span>
                    <span className="text-muted-foreground"> kcal</span>
                  </p>
                </div>
              )
            }
            return null
          }}
        />
        {goal && (
          <ReferenceLine
            y={goal}
            stroke="#f59e0b"
            strokeDasharray="5 5"
          />
        )}
        <Line
          type="monotone"
          dataKey="calories"
          stroke="#06b6d4"
          strokeWidth={3}
          dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: '#06b6d4' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
