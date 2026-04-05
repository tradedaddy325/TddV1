'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface MacroData {
  overview: string
  interestRates: string
  inflation: string
  usdStrength: number
  globalRisk: string
  keyEvents: string[]
  lastUpdated: Date
}

export default function MacroDeskPage() {
  const [macroData, setMacroData] = useState<MacroData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLocked, setIsLocked] = useState(true)

  useEffect(() => {
    // Check if user has access (via credits or subscription)
    const checkAccess = async () => {
      try {
        // TODO: Check user credits/subscription status
        setIsLocked(true) // Set to false when user has access
      } catch (error) {
        console.error('Error checking access:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAccess()
    
    // Auto-update every hour
    const interval = setInterval(fetchMacroData, 3600000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchMacroData = async () => {
    try {
      if (isLocked) return
      
      // Fetch from existing API endpoints
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Provide macro overview: interest rates, inflation, USD strength (0-100), global risk sentiment, and key events'
        })
      })
      
      const data = await response.json()
      setMacroData({
        overview: data.overview || 'Market overview unavailable',
        interestRates: data.interestRates || 'N/A',
        inflation: data.inflation || 'N/A',
        usdStrength: data.usdStrength || 50,
        globalRisk: data.globalRisk || 'Neutral',
        keyEvents: data.keyEvents || [],
        lastUpdated: new Date()
      })
    } catch (error) {
      console.error('Error fetching macro data:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-400">Loading Macro Desk...</div>
      </div>
    )
  }

  if (isLocked) {
    return (
      <div className="space-y-6 p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-amber-400">Macro Desk Terminal</h1>
          <p className="text-gray-400">AI-powered macro intelligence</p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-transparent rounded-lg blur-md" />
          <Card className="relative border-amber-600/30 bg-amber-900/10 backdrop-blur-sm p-8 text-center space-y-4">
            <div className="text-lg text-amber-400 font-semibold">Premium Feature</div>
            <p className="text-gray-300 max-w-md mx-auto">
              Unlock AI-generated macro analysis, interest rate forecasts, inflation expectations, and global risk sentiment updates every hour.
            </p>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              Unlock with Credits
            </Button>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-4 opacity-30 pointer-events-none">
          <Card className="p-4 bg-gray-900/50 border-gray-800">
            <div className="text-sm text-gray-500 mb-2">Interest Rates Outlook</div>
            <div className="text-2xl font-bold text-gray-600">Blurred</div>
          </Card>
          <Card className="p-4 bg-gray-900/50 border-gray-800">
            <div className="text-sm text-gray-500 mb-2">Inflation Expectations</div>
            <div className="text-2xl font-bold text-gray-600">Blurred</div>
          </Card>
          <Card className="p-4 bg-gray-900/50 border-gray-800">
            <div className="text-sm text-gray-500 mb-2">USD Strength</div>
            <div className="text-2xl font-bold text-gray-600">--</div>
          </Card>
          <Card className="p-4 bg-gray-900/50 border-gray-800">
            <div className="text-sm text-gray-500 mb-2">Global Risk</div>
            <div className="text-2xl font-bold text-gray-600">Blurred</div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-amber-400">Macro Desk Terminal</h1>
          <Badge className="bg-amber-600 text-white">Premium</Badge>
        </div>
        <p className="text-gray-400 text-sm">Last updated: {macroData?.lastUpdated.toLocaleTimeString()}</p>
      </div>

      {/* AI Overview */}
      <Card className="p-6 bg-gradient-to-r from-amber-900/20 to-gray-900/20 border-amber-600/30">
        <h2 className="text-lg font-semibold text-amber-300 mb-3">AI Market Overview</h2>
        <p className="text-gray-300 leading-relaxed">{macroData?.overview}</p>
      </Card>

      {/* Macro Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-gray-900/50 border-gray-800">
          <div className="text-sm text-gray-400 mb-2">Interest Rates</div>
          <div className="text-2xl font-bold text-white mb-1">{macroData?.interestRates}</div>
          <p className="text-xs text-gray-500">Current outlook</p>
        </Card>

        <Card className="p-4 bg-gray-900/50 border-gray-800">
          <div className="text-sm text-gray-400 mb-2">Inflation Expectations</div>
          <div className="text-2xl font-bold text-white mb-1">{macroData?.inflation}</div>
          <p className="text-xs text-gray-500">Trend analysis</p>
        </Card>

        <Card className="p-4 bg-gray-900/50 border-gray-800">
          <div className="text-sm text-gray-400 mb-2">USD Strength Meter</div>
          <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full"
              style={{ width: `${macroData?.usdStrength || 50}%` }}
            />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{macroData?.usdStrength || 50}/100</div>
        </Card>

        <Card className="p-4 bg-gray-900/50 border-gray-800">
          <div className="text-sm text-gray-400 mb-2">Global Risk Sentiment</div>
          <div className={`text-2xl font-bold ${
            macroData?.globalRisk === 'High' ? 'text-red-400' : 
            macroData?.globalRisk === 'Low' ? 'text-green-400' : 
            'text-yellow-400'
          }`}>
            {macroData?.globalRisk}
          </div>
          <p className="text-xs text-gray-500 mt-1">Market positioning</p>
        </Card>
      </div>

      {/* Key Events */}
      {macroData?.keyEvents && macroData.keyEvents.length > 0 && (
        <Card className="p-6 bg-gray-900/50 border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Key Macro Events</h3>
          <div className="space-y-2">
            {macroData.keyEvents.map((event, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>{event}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
