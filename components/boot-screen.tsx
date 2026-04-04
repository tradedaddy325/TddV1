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
    // Simulate smooth progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 95) {
          // Slower increments at the beginning, faster in the middle
          const increment = prev < 30 ? Math.random() * 8 : prev < 70 ? Math.random() * 12 : Math.random() * 5
          return Math.min(prev + increment, 95)
        }
        return 95
      })
    }, 100)

    // Hide boot screen after 4 seconds
    const hideTimer = setTimeout(() => {
      setProgress(100)
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
            TRADEDADDY
          </div>
        </div>

        {/* Status Text with Colorful Percent */}
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground font-mono">
            Initializing Market Systems...
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            {/* Dynamic inline progress bar */}
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xs text-muted-foreground font-mono">[</span>
              <div className="flex-1 h-2 bg-gray-800 border border-gray-700 rounded-sm overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${barGradient} transition-all duration-100`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground font-mono">]</span>
            </div>
            <p className={`text-lg font-bold font-mono ${percentColor} min-w-12`}>
              {displayPercent}%
            </p>
          </div>
        </div>

        {/* Boot Messages */}
        <div className="space-y-1.5 text-xs text-muted-foreground font-mono">
          <p className={displayPercent > 10 ? 'text-blue-400' : 'text-muted-foreground'}>[✓] System Online</p>
          <p className={displayPercent > 25 ? 'text-cyan-400' : 'text-muted-foreground'}>[✓] Database Connected</p>
          <p className={displayPercent > 40 ? 'text-green-400' : 'text-muted-foreground'}>[✓] Market Feed Active</p>
          <p className={displayPercent > 55 ? 'text-yellow-400' : 'text-muted-foreground'}>[✓] Analytics Initialized</p>
          <p className={displayPercent > 70 ? 'text-emerald-400' : 'text-muted-foreground'}>[✓] API Ready</p>
          <p className={displayPercent > 85 ? 'text-lime-400' : 'text-muted-foreground'}>[...] Loading Dashboard</p>
        </div>
      </div>
    </div>
  )
}
