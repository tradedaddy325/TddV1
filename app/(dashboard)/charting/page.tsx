'use client'

export default function ChartingPage() {
  return (
    <div className="flex-1 overflow-auto bg-black p-6">
      <div className="max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white font-mono mb-2">CHARTING TERMINAL</h1>
          <p className="text-gray-400">Professional-grade charting with technical analysis tools</p>
        </div>

        <div className="border border-green-600/30 bg-green-900/10 rounded-lg p-8 aspect-video flex flex-col items-center justify-center">
          <p className="text-green-400 font-mono text-lg mb-4">📊 CHARTING_ENGINE</p>
          <p className="text-gray-400 text-center">
            Interactive charting platform with multi-timeframe analysis
          </p>
          <p className="text-gray-600 text-xs mt-2">Indicators • Drawing Tools • Volume Analysis • Real-time Data</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white font-mono">Available Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Trend Lines', 'Support/Resistance', 'Fibonacci', 'Moving Averages', 'RSI', 'MACD', 'Volume', 'Alerts'].map(tool => (
              <div key={tool} className="p-3 bg-gray-900/50 border border-gray-700 text-center rounded hover:border-green-600/50 transition-colors cursor-pointer">
                <p className="text-sm font-mono text-gray-300">{tool}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
