'use client'

import { useEffect, useState } from 'react'
import type { Profile } from '@/lib/types'

interface TerminalGreetingProps {
  profile: Profile
}

export function TerminalGreeting({ profile }: TerminalGreetingProps) {
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(true)

  const greeting = getGreeting()
  const fullText = `${greeting}, ${profile?.display_name || 'Trader'}. System operational.`

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
      }
    }, 40)

    return () => clearInterval(timer)
  }, [fullText])

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorTimer)
  }, [])

  return (
    <div className="bg-card border border-border rounded p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <div className="w-3 h-3 rounded-full bg-warning" />
          <div className="w-3 h-3 rounded-full bg-primary" />
        </div>
        <span className="text-xs text-muted-foreground">tradedaddy@terminal:~$</span>
      </div>
      <p className="text-lg text-primary glow-green">
        {displayText}
        <span className={showCursor ? 'opacity-100' : 'opacity-0'}>_</span>
      </p>
      <div className="mt-2 text-xs text-muted-foreground">
        <span className="text-accent">[{new Date().toLocaleTimeString()}]</span>{' '}
        Session active | Tier: <span className="text-primary uppercase">{profile?.subscription_tier || 'free'}</span> |{' '}
        Credits: <span className="text-warning">{profile?.credits || 0}</span>
      </div>
    </div>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
