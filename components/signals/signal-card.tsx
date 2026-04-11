'use client'

import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'

interface SignalCardProps {
  title: string
  symbol?: string
  direction?: 'up' | 'down'
  status?: 'active' | 'inactive' | 'pending'
  timeframe?: string
  confidence?: number
  entry?: number
  target?: number
  description?: string
  tags?: string[]
  onClick?: () => void
  locked?: boolean
  unlockTime?: string
}

export function SignalCard({
  title,
  symbol,
  direction,
  status = 'active',
  timeframe,
  confidence,
  entry,
  target,
  description,
  tags,
  onClick,
  locked,
  unlockTime
}: SignalCardProps) {
  const statusColors = {
    active: 'border-green-800 bg-green-900/10',
    inactive: 'border-gray-800 bg-gray-900/10',
    pending: 'border-yellow-800 bg-yellow-900/10'
  }

  const statusDot = {
    active: 'bg-green-400',
    inactive: 'bg-gray-400',
    pending: 'bg-yellow-400'
  }

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border transition-all cursor-pointer hover:border-green-700 ${statusColors[status]} ${locked ? 'opacity-60 pointer-events-none' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${statusDot[status]}`}></div>
            <h3 className="text-sm font-bold text-white">{title}</h3>
            {symbol && <span className="text-xs text-gray-400 font-mono">{symbol}</span>}
          </div>

          {description && <p className="text-xs text-gray-400 mt-2 line-clamp-2">{description}</p>}

          <div className="flex flex-wrap gap-2 mt-3">
            {timeframe && (
              <span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300 font-mono">
                {timeframe}
              </span>
            )}
            {confidence && (
              <span className="text-xs px-2 py-1 rounded bg-blue-900/20 text-blue-300 font-mono">
                {confidence}% confidence
              </span>
            )}
          </div>

          {(entry !== undefined || target !== undefined) && (
            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              {entry !== undefined && (
                <div>
                  <span className="text-gray-500">Entry</span>
                  <div className="text-white font-mono">{entry}</div>
                </div>
              )}
              {target !== undefined && (
                <div>
                  <span className="text-gray-500">Target</span>
                  <div className="text-white font-mono">{target}</div>
                </div>
              )}
            </div>
          )}

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-purple-900/30 text-purple-300">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          {direction && (
            direction === 'up' ? (
              <TrendingUp className="w-5 h-5 text-green-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400" />
            )
          )}
          {locked && (
            <div className="text-xs text-center">
              <span className="text-yellow-400 font-mono text-xs">🔒</span>
              {unlockTime && <div className="text-gray-400 text-xs">{unlockTime}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
