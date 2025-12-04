'use client'

import { useMemo } from 'react'

interface DataPoint {
  label: string
  value: number
}

interface LineChartProps {
  data: DataPoint[]
  title?: string
  height?: number
  color?: string
  showPoints?: boolean
  showGrid?: boolean
  className?: string
}

export function LineChart({
  data,
  title,
  height = 200,
  color = '#8b5cf6', // Purple
  showPoints = true,
  showGrid = true,
  className = '',
}: LineChartProps) {
  const { maxValue, minValue, points, path } = useMemo(() => {
    if (data.length === 0) {
      return { maxValue: 100, minValue: 0, points: [], path: '' }
    }

    const values = data.map(d => d.value)
    const max = Math.max(...values, 1)
    const min = Math.min(...values, 0)
    const range = max - min || 1

    const chartWidth = 600
    const chartHeight = height - 60
    const padding = 40

    // Calculate point positions
    const pointsData = data.map((item, index) => {
      const x =
        padding + (index / (data.length - 1 || 1)) * (chartWidth - padding * 2)
      const normalizedValue = (item.value - min) / range
      const y = chartHeight - normalizedValue * chartHeight + 20

      return { x, y, label: item.label, value: item.value }
    })

    // Create SVG path
    const pathData = pointsData
      .map((point, index) => {
        return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
      })
      .join(' ')

    return { maxValue: max, minValue: min, points: pointsData, path: pathData }
  }, [data, height])

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
          width="600"
          height={height}
          className="mx-auto"
          style={{ minWidth: '100%', maxWidth: '100%' }}
        >
          {/* Grid lines */}
          {showGrid &&
            [0, 0.25, 0.5, 0.75, 1].map(percent => {
              const y = height - 60 - percent * (height - 60) + 20
              return (
                <g key={percent}>
                  <line
                    x1={40}
                    y1={y}
                    x2={560}
                    y2={y}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                  />
                  <text
                    x={25}
                    y={y + 4}
                    fontSize="10"
                    fill="rgba(255,255,255,0.4)"
                    textAnchor="end"
                  >
                    {Math.round(minValue + (maxValue - minValue) * percent)}
                  </text>
                </g>
              )
            })}

          {/* Area under the line (gradient fill) */}
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          {path && (
            <path
              d={`${path} L ${points[points.length - 1]?.x || 0} ${height - 40} L ${points[0]?.x || 0} ${height - 40} Z`}
              fill="url(#lineGradient)"
            />
          )}

          {/* Line */}
          {path && (
            <path
              d={path}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data points */}
          {showPoints &&
            points.map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill={color}
                  stroke="#18181b"
                  strokeWidth="2"
                  className="transition-all duration-200 hover:r-6"
                >
                  <title>{`${point.label}: ${point.value}`}</title>
                </circle>
              </g>
            ))}

          {/* X-axis labels */}
          {points.map((point, index) => {
            // Show every nth label to avoid crowding
            const showEvery = Math.ceil(points.length / 8)
            if (index % showEvery !== 0 && index !== points.length - 1)
              return null

            return (
              <text
                key={`label-${index}`}
                x={point.x}
                y={height - 15}
                fontSize="10"
                fill="rgba(255,255,255,0.6)"
                textAnchor="middle"
              >
                {point.label}
              </text>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
