'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

interface CalorieChartProps {
  data: Array<{
    date: string
    calories: number
    label: string
  }>
  goal?: number
}

export function CalorieChart({ data, goal }: CalorieChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[250px] text-muted-foreground">
        No data to display
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                    <span className="text-emerald-500 font-semibold">
                      {data.calories}
                    </span>
                    <span className="text-muted-foreground"> kcal</span>
                  </p>
                  {goal && (
                    <p className="text-xs text-muted-foreground">
                      {data.calories < goal
                        ? `${goal - data.calories} under goal`
                        : data.calories > goal
                        ? `${data.calories - goal} over goal`
                        : 'On target!'}
                    </p>
                  )}
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
            label={{ value: 'Goal', position: 'right', fill: '#f59e0b', fontSize: 12 }}
          />
        )}
        <Bar
          dataKey="calories"
          fill="url(#colorGradient)"
          radius={[4, 4, 0, 0]}
        />
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  )
}
