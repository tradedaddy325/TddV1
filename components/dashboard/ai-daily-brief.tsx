import { Sparkles } from 'lucide-react'

interface AIDailyBriefProps {
  briefText?: string
}

export function AIDailyBrief({ briefText }: AIDailyBriefProps) {
  const defaultText = "Today, the market is in a Risk-Off environment with no major economic events affecting trading. The notable gain in WTI Oil, up 11.15%, signals a bullish opportunity amidst bearish movements in Silver and Gold, which are showing extreme weakness."

  return (
    <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 space-y-4">
      <div className="flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-green-400" />
        <h3 className="text-lg font-bold text-white">AI Daily Brief</h3>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-red-600 bg-red-900/20 ml-auto">
          <span className="text-red-400 text-xs font-mono font-bold">Risk-Off</span>
        </div>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed">
        {briefText || defaultText}
      </p>
    </div>
  )
}
