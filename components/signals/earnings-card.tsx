'use client'

interface EarningsCardProps {
  company: string
  ticker: string
  reportTime: string
  epsExpectation?: number
  sentiment?: 'bullish' | 'bearish' | 'neutral'
  lastEPS?: number
  estimate?: number
}

export function EarningsCard({
  company,
  ticker,
  reportTime,
  epsExpectation,
  sentiment = 'neutral',
  lastEPS,
  estimate
}: EarningsCardProps) {
  const sentimentColors = {
    bullish: 'border-green-800 bg-green-900/10',
    bearish: 'border-red-800 bg-red-900/10',
    neutral: 'border-gray-800 bg-gray-900/10'
  }

  const sentimentText = {
    bullish: 'text-green-400',
    bearish: 'text-red-400',
    neutral: 'text-gray-400'
  }

  return (
    <div className={`p-4 rounded-xl border ${sentimentColors[sentiment]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white">{company}</h3>
            <span className="text-xs text-gray-400 font-mono">{ticker}</span>
          </div>
          <div className="text-xs text-gray-400 mt-2">{reportTime}</div>

          {(lastEPS !== undefined || estimate !== undefined) && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              {lastEPS !== undefined && (
                <div>
                  <div className="text-xs text-gray-500">Last EPS</div>
                  <div className="text-sm font-mono font-bold text-white">${lastEPS}</div>
                </div>
              )}
              {estimate !== undefined && (
                <div>
                  <div className="text-xs text-gray-500">Estimate</div>
                  <div className="text-sm font-mono font-bold text-white">${estimate}</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-right">
          <div className={`text-xs font-bold uppercase tracking-wider ${sentimentText[sentiment]}`}>
            {sentiment}
          </div>
          {epsExpectation !== undefined && (
            <div className="text-sm font-mono font-bold text-white mt-2">
              {epsExpectation > 0 ? '+' : ''}{epsExpectation}%
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
