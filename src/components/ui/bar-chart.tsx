'use client'

import { useMemo } from 'react'

interface DataPoint {
  label: string
  value: number
  color?: string
}

interface BarChartProps {
  data: DataPoint[]
  title?: string
  maxValue?: number
  height?: number
  showValues?: boolean
  className?: string
}

export function BarChart({
  data,
  title,
  maxValue,
  height = 200,
  showValues = true,
  className = '',
}: BarChartProps) {
  const max = useMemo(() => {
    if (maxValue) return maxValue
    return Math.max(...data.map(d => d.value), 1)
  }, [data, maxValue])

  const barWidth = useMemo(() => {
    const totalBars = data.length
    if (totalBars <= 4) return 60
    if (totalBars <= 7) return 40
    return 30
  }, [data.length])

  const chartWidth = useMemo(() => {
    return data.length * (barWidth + 12) + 40 // bars + gaps + padding
  }, [data.length, barWidth])

  if (data.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500 text-sm">No data available</p>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h4 className="text-sm font-medium text-gray-300 mb-4">{title}</h4>
      )}

      <div className="overflow-x-auto">
        <svg
          width={chartWidth}
          height={height}
          className="mx-auto"
          style={{ minWidth: '100%' }}
        >
          {/* Y-axis guide lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(percent => {
            const y = height - 40 - percent * (height - 60)
            return (
              <g key={percent}>
                <line
                  x1={20}
                  y1={y}
                  x2={chartWidth - 20}
                  y2={y}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                />
                <text
                  x={10}
                  y={y + 4}
                  fontSize="10"
                  fill="rgba(255,255,255,0.4)"
                  textAnchor="end"
                >
                  {Math.round(max * percent)}
                </text>
              </g>
            )
          })}

          {/* Bars */}
          {data.map((item, index) => {
            const barHeight = (item.value / max) * (height - 60)
            const x = 40 + index * (barWidth + 12)
            const y = height - 40 - barHeight
            const color = item.color || '#3b82f6' // Default blue

            return (
              <g key={item.label}>
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  rx="4"
                  className="transition-all duration-300 hover:opacity-80"
                >
                  <title>{`${item.label}: ${item.value}`}</title>
                </rect>

                {/* Value label on top of bar */}
                {showValues && item.value > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 5}
                    fontSize="11"
                    fill="rgba(255,255,255,0.8)"
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {item.value}
                  </text>
                )}

                {/* X-axis label */}
                <text
                  x={x + barWidth / 2}
                  y={height - 20}
                  fontSize="11"
                  fill="rgba(255,255,255,0.6)"
                  textAnchor="middle"
                >
                  {item.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
