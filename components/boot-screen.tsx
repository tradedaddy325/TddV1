'use client'

import { useEffect, useState } from 'react'

export function BootScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(0)

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

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
      <div className="w-full max-w-md px-6 space-y-8">
        {/* Logo Animation */}
        <div className="flex justify-center animate-pulse">
          <div className="text-4xl font-bold text-primary font-mono">
            ▲ TRADEDADDY
          </div>
        </div>

        {/* Status Text */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground font-mono">
            Initializing Market Systems...
          </p>
          <p className="text-xs text-accent font-mono">[████████░░] {Math.min(Math.round(progress), 100)}%</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-card border border-accent rounded-sm overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Boot Messages */}
        <div className="space-y-1 text-xs text-muted-foreground font-mono">
          <p className="text-accent">[✓] System Online</p>
          <p className="text-accent">[✓] Market Feed Active</p>
          <p className="text-accent">[...] Loading Dashboard</p>
        </div>
      </div>
    </div>
  )
}
