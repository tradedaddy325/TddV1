'use client'

import { useState, useEffect } from 'react'

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
    fetchMacroData()
    const interval = setInterval(fetchMacroData, 3600000) // 1 hour
    return () => clearInterval(interval)
  }, [])

  const fetchMacroData = async () => {
    setIsLoading(true)
    try {
      setMacroData({
        overview: 'Global economic conditions remain uncertain with mixed signals',
        interestRates: 'US rates at 5.25-5.50%, ECB at 4.75%',
        inflation: 'CPI growth moderating but above targets',
        usdStrength: 102.5,
        globalRisk: 'Moderate',
        keyEvents: ['Fed speakers this week', 'CPI data Monday', 'Jobs report Friday'],
        lastUpdated: new Date(),
      })
    } catch (error) {
      console.error('Error fetching macro data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto bg-black p-6">
        <div className="text-center">
          <p className="font-mono text-green-400">{">"} INITIALIZING_MACRO_DESK...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto bg-black p-6 space-y-6">
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold text-white font-mono mb-6">MACRO DESK</h1>
        
        {isLocked ? (
          <div className="border border-amber-600/50 bg-amber-900/20 rounded-lg p-8 text-center">
            <p className="text-amber-400 font-mono mb-4">{">"} PREMIUM_FEATURE_LOCKED</p>
            <p className="text-gray-300 mb-4">Unlock Macro Desk with a premium subscription</p>
            <button className="px-6 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition font-mono">
              Unlock Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {macroData && (
              <>
                <div className="border border-green-600/30 bg-green-900/10 rounded-lg p-4">
                  <p className="text-green-400 font-mono text-sm mb-2">OVERVIEW:</p>
                  <p className="text-gray-300">{macroData.overview}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-green-600/30 bg-green-900/10 rounded-lg p-4">
                    <p className="text-green-400 font-mono text-sm mb-2">INTEREST_RATES:</p>
                    <p className="text-gray-300">{macroData.interestRates}</p>
                  </div>
                  <div className="border border-green-600/30 bg-green-900/10 rounded-lg p-4">
                    <p className="text-green-400 font-mono text-sm mb-2">INFLATION:</p>
                    <p className="text-gray-300">{macroData.inflation}</p>
                  </div>
                </div>
                <div className="border border-green-600/30 bg-green-900/10 rounded-lg p-4">
                  <p className="text-green-400 font-mono text-sm mb-2">KEY_EVENTS:</p>
                  <ul className="space-y-1">
                    {macroData.keyEvents.map((event, i) => (
                      <li key={i} className="text-gray-300">• {event}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
