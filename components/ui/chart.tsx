"use client"

import type React from "react"
import { useEffect, useRef } from "react"

interface ChartProps {
  data: Array<{ label: string; value: number }>
  width?: number
  height?: number
}

export function Chart({ data, width = 400, height = 200 }: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)

    const maxValue = Math.max(...data.map((d) => d.value), 1)
    const barWidth = width / data.length

    data.forEach((d, i) => {
      const barHeight = (d.value / maxValue) * height
      ctx.fillStyle = "#3b82f6"
      ctx.fillRect(i * barWidth, height - barHeight, barWidth - 4, barHeight)
    })
  }, [data, width, height])

  return <canvas ref={canvasRef} width={width} height={height} />
}
