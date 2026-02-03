'use client'

interface ProgressRingProps {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  label?: string
  unit?: string
  colorClass?: string
}

export function ProgressRing({
  value,
  max,
  size = 120,
  strokeWidth = 10,
  label,
  unit = '',
  colorClass = 'stroke-coral',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const percentage = Math.min((value / max) * 100, 100)
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center group">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle with subtle gradient */}
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-coral)" />
            <stop offset="100%" stopColor="var(--color-rose)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className="stroke-coral/15 dark:stroke-coral/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${colorClass} transition-all duration-700 ease-out drop-shadow-sm`}
          style={{ filter: 'drop-shadow(0 2px 4px rgba(249, 112, 102, 0.3))' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold font-display group-hover:scale-105 transition-transform">
          {Math.round(value)}
        </span>
        {unit && <span className="text-sm text-muted-foreground font-medium">{unit}</span>}
        {label && (
          <span className="text-xs text-muted-foreground mt-1">{label}</span>
        )}
      </div>
    </div>
  )
}
