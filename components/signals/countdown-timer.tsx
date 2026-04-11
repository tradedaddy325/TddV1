'use client'

import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  unlockTime: Date
  onUnlock?: () => void
  label?: string
}

export function CountdownTimer({ unlockTime, onUnlock, label = 'Unlocks in' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>('')
  const [isUnlocked, setIsUnlocked] = useState(false)

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime()
      const target = new Date(unlockTime).getTime()
      const diff = target - now

      if (diff <= 0) {
        setTimeLeft('Unlocked')
        setIsUnlocked(true)
        onUnlock?.()
        return
      }

      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [unlockTime, onUnlock])

  return (
    <div className={`text-sm font-mono ${isUnlocked ? 'text-green-400' : 'text-purple-400'}`}>
      <span className="text-gray-400">{label}: </span>
      <span className="font-bold">{timeLeft}</span>
    </div>
  )
}
