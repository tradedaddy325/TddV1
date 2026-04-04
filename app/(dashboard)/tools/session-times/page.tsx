'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock, Globe } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const sessions = [
  {
    name: 'Sydney',
    openUTC: 21, // 9pm UTC previous day to 6am UTC
    closeUTC: 6,
    color: 'bg-blue-500',
    timezone: 'AEST',
    pairs: ['AUD/USD', 'NZD/USD', 'AUD/JPY'],
  },
  {
    name: 'Tokyo',
    openUTC: 0, // Midnight UTC to 9am UTC
    closeUTC: 9,
    color: 'bg-red-500',
    timezone: 'JST',
    pairs: ['USD/JPY', 'EUR/JPY', 'GBP/JPY'],
  },
  {
    name: 'London',
    openUTC: 7, // 7am UTC to 4pm UTC
    closeUTC: 16,
    color: 'bg-green-500',
    timezone: 'GMT',
    pairs: ['EUR/USD', 'GBP/USD', 'EUR/GBP'],
  },
  {
    name: 'New York',
    openUTC: 12, // Noon UTC to 9pm UTC
    closeUTC: 21,
    color: 'bg-yellow-500',
    timezone: 'EST',
    pairs: ['EUR/USD', 'USD/CAD', 'USD/CHF'],
  },
]

function isSessionOpen(session: typeof sessions[0], currentHourUTC: number): boolean {
  if (session.closeUTC < session.openUTC) {
    // Session spans midnight
    return currentHourUTC >= session.openUTC || currentHourUTC < session.closeUTC
  }
  return currentHourUTC >= session.openUTC && currentHourUTC < session.closeUTC
}

export default function SessionTimesPage() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const currentHourUTC = currentTime.getUTCHours()

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/tools">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Session Times</h1>
          <p className="text-muted-foreground">
            Forex market trading sessions worldwide
          </p>
        </div>
      </div>

      {/* Current Time Display */}
      <Card className="bg-card border-border">
        <CardContent className="py-6">
          <div className="flex items-center justify-center gap-4">
            <Clock className="w-6 h-6 text-primary" />
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground font-mono">
                {currentTime.toUTCString().slice(17, 25)} UTC
              </p>
              <p className="text-sm text-muted-foreground">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((session) => {
          const isOpen = isSessionOpen(session, currentHourUTC)
          return (
            <Card 
              key={session.name} 
              className={cn(
                'bg-card border-border transition-all',
                isOpen && 'border-primary ring-1 ring-primary/50'
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className={cn('w-3 h-3 rounded-full', session.color)} />
                    {session.name}
                  </CardTitle>
                  <span className={cn(
                    'px-2 py-1 text-xs rounded',
                    isOpen 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-muted-foreground'
                  )}>
                    {isOpen ? 'OPEN' : 'CLOSED'}
                  </span>
                </div>
                <CardDescription>{session.timezone}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Trading Hours (UTC)</span>
                    <span className="font-mono text-foreground">
                      {session.openUTC.toString().padStart(2, '0')}:00 - {session.closeUTC.toString().padStart(2, '0')}:00
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Best pairs to trade:</p>
                    <div className="flex flex-wrap gap-1">
                      {session.pairs.map((pair) => (
                        <span 
                          key={pair} 
                          className="px-2 py-0.5 bg-secondary text-xs rounded text-foreground"
                        >
                          {pair}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Session Overlap Info */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="w-5 h-5 text-accent" />
            Session Overlaps (High Volume)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-primary/10 rounded">
              <div>
                <p className="text-sm font-medium text-foreground">London + New York</p>
                <p className="text-xs text-muted-foreground">Highest volatility period</p>
              </div>
              <span className="font-mono text-sm text-primary">12:00 - 16:00 UTC</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary rounded">
              <div>
                <p className="text-sm font-medium text-foreground">Tokyo + London</p>
                <p className="text-xs text-muted-foreground">Good for JPY pairs</p>
              </div>
              <span className="font-mono text-sm text-foreground">07:00 - 09:00 UTC</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary rounded">
              <div>
                <p className="text-sm font-medium text-foreground">Sydney + Tokyo</p>
                <p className="text-xs text-muted-foreground">Asian session overlap</p>
              </div>
              <span className="font-mono text-sm text-foreground">00:00 - 06:00 UTC</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
