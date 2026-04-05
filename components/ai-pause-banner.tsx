'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Pause, Clock, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MarketStatus {
  isClosed: boolean
  closesIn?: number
  opensIn?: number
  market: string
  nextOpenTime: string
}

export function AIPauseBanner() {
  const [marketStatus, setMarketStatus] = useState<MarketStatus | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [aiMessage, setAiMessage] = useState('')

  useEffect(() => {
    const checkMarketStatus = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const day = now.getDay()

      let status: MarketStatus | null = null

      // US Market hours: 9:30 AM - 4:00 PM EST (Monday-Friday)
      if (day >= 1 && day <= 5) {
        const openTime = 9.5 * 60 // 9:30 AM in minutes
        const closeTime = 16 * 60 // 4:00 PM in minutes
        const currentTime = hours * 60 + minutes

        if (currentTime >= closeTime) {
          // Market closed
          const nextOpen = new Date(now)
          if (day === 5) {
            nextOpen.setDate(nextOpen.getDate() + 3) // Monday
          } else {
            nextOpen.setDate(nextOpen.getDate() + 1)
          }
          nextOpen.setHours(9, 30, 0)

          status = {
            isClosed: true,
            market: 'US Equities',
            opensIn: Math.round((nextOpen.getTime() - now.getTime()) / 60000),
            nextOpenTime: nextOpen.toLocaleString('en-US', {
              weekday: 'short',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'America/New_York',
            }),
          }

          setAiMessage(
            'Markets are currently closed. Our AI systems are analyzing overnight data and preparing tomorrow\'s analysis. Use this time to review today\'s trades and plan your strategy.'
          )
        } else if (currentTime < openTime) {
          // Pre-market
          status = {
            isClosed: true,
            market: 'US Equities',
            opensIn: openTime - currentTime,
            nextOpenTime: 'Today at 9:30 AM EST',
          }

          setAiMessage(
            'Pre-market session. The AI is calibrating models based on overnight news and global market movements. Main market opens in ' +
              (openTime - currentTime) +
              ' minutes.'
          )
        } else if (currentTime >= closeTime - 30 && currentTime < closeTime) {
          // Closing soon
          status = {
            isClosed: false,
            market: 'US Equities',
            closesIn: closeTime - currentTime,
            nextOpenTime: 'Tomorrow at 9:30 AM EST',
          }

          setAiMessage(
            'Market closing in ' +
              (closeTime - currentTime) +
              ' minutes. The AI is finalizing today\'s analysis and preparing the overnight strategy update.'
          )
        } else {
          // Market open - no banner needed
          status = null
        }
      } else {
        // Weekend
        status = {
          isClosed: true,
          market: 'US Equities',
          opensIn: day === 6 ? 24 * 60 : 23 * 60, // Rough estimate
          nextOpenTime: 'Monday at 9:30 AM EST',
        }

        setAiMessage(
          'Markets are closed for the weekend. Use this time for analysis and research. Our AI will resume analysis when markets reopen Monday morning.'
        )
      }

      setMarketStatus(status)
      setIsVisible(!!status)
    }

    checkMarketStatus()
    const interval = setInterval(checkMarketStatus, 60000)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible || !marketStatus) return null

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-md">
      <div
        className={`border-l-4 rounded-lg p-4 shadow-lg backdrop-blur-sm ${
          marketStatus.isClosed
            ? 'bg-red-900/20 border-red-700 border-l-red-500'
            : 'bg-yellow-900/20 border-yellow-700 border-l-yellow-500'
        }`}
      >
        <div className="flex items-start gap-3">
          {marketStatus.isClosed ? (
            <Pause className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          )}

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">
                {marketStatus.isClosed ? 'Market Closed' : 'Market Closing Soon'}
              </h3>
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{aiMessage}</p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
              <Clock className="w-3 h-3" />
              {marketStatus.opensIn && (
                <span>
                  {marketStatus.isClosed ? 'Opens in' : 'Closes in'} {formatTime(marketStatus.opensIn)}
                </span>
              )}
              <span className="text-muted-foreground/50">•</span>
              <span>{marketStatus.nextOpenTime}</span>
            </div>

            <div className="flex gap-2 pt-3">
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={() => setIsVisible(false)}
              >
                Dismiss
              </Button>
              <Button
                size="sm"
                className="text-xs h-7 bg-cyan-600 hover:bg-cyan-700"
                onClick={() => window.location.href = '/academy'}
              >
                View Analysis
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
