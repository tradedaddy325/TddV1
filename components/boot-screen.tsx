'use client'

import { useEffect, useState } from 'react'

// Color functions for progress
function getPercentColor(percent: number): string {
  if (percent < 25) return 'text-blue-500'
  if (percent < 50) return 'text-cyan-400'
  if (percent < 75) return 'text-green-500'
  if (percent < 90) return 'text-yellow-500'
  return 'text-green-400'
}

function getBarColor(percent: number): string {
  if (percent < 25) return 'from-blue-500 to-cyan-400'
  if (percent < 50) return 'from-cyan-400 to-green-500'
  if (percent < 75) return 'from-green-500 to-yellow-500'
  if (percent < 90) return 'from-yellow-500 to-green-400'
  return 'from-green-400 to-green-300'
}

export function BootScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const displayPercent = Math.min(Math.round(progress), 100)

  useEffect(() => {
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + Math.random() * 30
        }
        return 100
      })
    }, 200)

    // Hide boot screen after 4 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false)
    }, 4000)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!isVisible) return null

  const percentColor = getPercentColor(displayPercent)
  const barGradient = getBarColor(displayPercent)

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
      <div className="w-full max-w-md px-6 space-y-8">
        {/* Logo Animation */}
        <div className="flex justify-center animate-pulse">
          <div className="text-4xl font-bold text-primary font-mono">
            ▲ TRADEDADDY
          </div>
        </div>

        {/* Status Text with Colorful Percent */}
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground font-mono">
            Initializing Market Systems...
          </p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-xs text-muted-foreground font-mono">[████████░░]</p>
            <p className={`text-lg font-bold font-mono ${percentColor}`}>
              {displayPercent}%
            </p>
          </div>
        </div>

        {/* Colorful Progress Bar */}
        <div className="w-full h-2 bg-card border border-muted rounded-sm overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${barGradient} transition-all duration-300 shadow-lg`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Boot Messages */}
        <div className="space-y-1 text-xs text-muted-foreground font-mono">
          <p className={displayPercent > 25 ? 'text-blue-400' : 'text-muted-foreground'}>[✓] System Online</p>
          <p className={displayPercent > 50 ? 'text-cyan-400' : 'text-muted-foreground'}>[✓] Market Feed Active</p>
          <p className={displayPercent > 75 ? 'text-green-400' : 'text-muted-foreground'}>[...] Loading Dashboard</p>
        </div>
      </div>
    </div>
  )
}
