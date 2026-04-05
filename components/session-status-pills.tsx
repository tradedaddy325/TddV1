'use client'

import { useEffect, useState } from 'react'
import { Clock, AlertCircle, CheckCircle2, Pause } from 'lucide-react'

interface SessionStatus {
  market: string
  status: 'open' | 'closing_soon' | 'closed' | 'upcoming'
  closesIn?: number
  opensIn?: number
  timeZone: string
}

export function SessionStatusPills() {
  const [sessions, setSessions] = useState<SessionStatus[]>([])

  useEffect(() => {
    const updateSessions = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const day = now.getDay()

      const newSessions: SessionStatus[] = []

      // US Market (9:30 AM - 4:00 PM EST)
      if (day >= 1 && day <= 5) {
        const openTime = 9.5 * 60
        const closeTime = 16 * 60
        const currentTime = hours * 60 + minutes
        const estOffset = now.getTimezoneOffset() === 300 ? 0 : -300 / 60

        if (currentTime >= openTime && currentTime < closeTime) {
          newSessions.push({
            market: 'US Market',
            status: currentTime > closeTime - 30 ? 'closing_soon' : 'open',
            closesIn: closeTime - currentTime,
            timeZone: 'EST',
          })
        } else if (currentTime < openTime) {
          newSessions.push({
            market: 'US Market',
            status: 'upcoming',
            opensIn: openTime - currentTime,
            timeZone: 'EST',
          })
        } else {
          newSessions.push({
            market: 'US Market',
            status: 'closed',
            timeZone: 'EST',
          })
        }
      }

      // Forex Market (24/5)
      if (day >= 1 && day <= 5) {
        newSessions.push({
          market: 'Forex',
          status: 'open',
          timeZone: 'UTC',
        })
      } else {
        newSessions.push({
          market: 'Forex',
          status: day === 5 ? 'closing_soon' : 'closed',
          timeZone: 'UTC',
        })
      }

      // Crypto (24/7)
      newSessions.push({
        market: 'Crypto',
        status: 'open',
        timeZone: 'UTC',
      })

      setSessions(newSessions)
    }

    updateSessions()
    const interval = setInterval(updateSessions, 60000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: SessionStatus['status']) => {
    switch (status) {
      case 'open':
        return 'bg-green-900/30 border-green-700/50 text-green-400'
      case 'closing_soon':
        return 'bg-yellow-900/30 border-yellow-700/50 text-yellow-400'
      case 'closed':
        return 'bg-red-900/30 border-red-700/50 text-red-400'
      case 'upcoming':
        return 'bg-blue-900/30 border-blue-700/50 text-blue-400'
    }
  }

  const getStatusIcon = (status: SessionStatus['status']) => {
    switch (status) {
      case 'open':
        return <CheckCircle2 className="w-4 h-4" />
      case 'closing_soon':
        return <AlertCircle className="w-4 h-4" />
      case 'closed':
        return <Pause className="w-4 h-4" />
      case 'upcoming':
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusText = (session: SessionStatus) => {
    switch (session.status) {
      case 'open':
        return 'OPEN'
      case 'closing_soon':
        return `CLOSING IN ${session.closesIn}M`
      case 'closed':
        return 'CLOSED'
      case 'upcoming':
        return `OPENS IN ${session.opensIn}M`
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {sessions.map((session) => (
        <div
          key={session.market}
          className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-mono ${getStatusColor(
            session.status
          )}`}
        >
          {getStatusIcon(session.status)}
          <span className="font-semibold">{session.market}</span>
          <span className="text-muted-foreground text-xs">({session.timeZone})</span>
          <span className="ml-1 text-xs">{getStatusText(session)}</span>
        </div>
      ))}
    </div>
  )
}
