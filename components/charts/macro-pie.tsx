'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { getMacroColor } from '@/lib/utils'

interface MacroPieProps {
  protein: number
  carbs: number
  fat: number
}

export function MacroPie({ protein, carbs, fat }: MacroPieProps) {
  const data = [
    { name: 'Protein', value: Math.round(protein), color: getMacroColor('protein') },
    { name: 'Carbs', value: Math.round(carbs), color: getMacroColor('carbs') },
    { name: 'Fat', value: Math.round(fat), color: getMacroColor('fat') },
  ].filter(d => d.value > 0)

  const total = protein + carbs + fat

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        No macros logged yet
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={70}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload
              return (
                <div className="bg-background border rounded-lg shadow-lg p-2">
                  <p className="font-medium" style={{ color: data.color }}>
                    {data.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {data.value}g ({Math.round((data.value / total) * 100)}%)
                  </p>
                </div>
              )
            }
            return null
          }}
        />
        <Legend
          formatter={(value, entry) => (
            <span className="text-sm">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
