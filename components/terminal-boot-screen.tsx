'use client'

import { useEffect, useState } from 'react'

interface TerminalBootScreenProps {
  onComplete?: () => void
}

export function TerminalBootScreen({ onComplete }: TerminalBootScreenProps) {
  const [bootComplete, setBootComplete] = useState(false)
  const [progress, setProgress] = useState(0)
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    const bootMessages = [
      'TRADEHUB TERMINAL STARTUP SEQUENCE',
      'SESSION VERIFIED',
      '...',
      'INITIALISING MODULES',
      '[SYS] Firmware revision 7.4.1 loaded',
      '[SYS] Performing terminal integrity checks',
      '[OK] BOOTING TRADEHUB TERMINAL CORE',
      '[OK] MOUNTING NEURAL NETWORK ENGINES',
      '[OK] LOADING MACRO DESK ANALYTICS',
      '[OK] CALIBRATING AI SIGNAL ENGINE',
      '[OK] CONNECTING ECONOMIC SIGNALS FEED',
      '[...] SYNCING MARKET _',
    ]

    let messageIndex = 0
    let progressValue = 0

    const messageInterval = setInterval(() => {
      if (messageIndex < bootMessages.length) {
        setMessages((prev) => [...prev, bootMessages[messageIndex]])
        messageIndex++
        progressValue = (messageIndex / bootMessages.length) * 100
        setProgress(progressValue)
      } else {
        clearInterval(messageInterval)
        setBootComplete(true)
        setTimeout(() => {
          onComplete?.()
        }, 500)
      }
    }, 150)

    return () => clearInterval(messageInterval)
  }, [onComplete])

  if (bootComplete) return null

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="w-full max-w-2xl px-6">
        <div className="space-y-4 font-mono text-green-400 text-sm leading-relaxed">
          {messages.map((msg, i) => (
            <div key={i} className="text-green-400">
              {msg}
            </div>
          ))}

          {/* Progress Bar */}
          <div className="mt-8 space-y-2">
            <div className="text-xs text-gray-500">STARTUP DIAGNOSTICS</div>
            <div className="text-xs text-gray-400 mb-2">Boot progress</div>
            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 text-right">{Math.round(progress)}%</div>
          </div>

          {/* Status Indicators */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg border border-gray-700 bg-gray-900/50">
              <div className="text-xs text-gray-400 mb-1">AI Core</div>
              <div className="text-green-400 font-bold">ONLINE</div>
            </div>
            <div className="p-3 rounded-lg border border-gray-700 bg-gray-900/50">
              <div className="text-xs text-gray-400 mb-1">Data Streams</div>
              <div className={progress >= 80 ? 'text-green-400 font-bold' : 'text-yellow-400 font-bold'}>
                {progress >= 80 ? 'SYNCED' : 'SYNCING'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
