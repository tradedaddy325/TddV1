import { Clock, TrendingUp, Eye, Zap, Globe, BookOpen } from 'lucide-react'

interface MetricPill {
  label: string
  value?: string
  icon: React.ComponentType<{ className?: string }>
  color: 'red' | 'green' | 'purple' | 'teal' | 'blue' | 'orange'
}

const colorMap: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  red: { bg: 'bg-red-900/20', border: 'border-red-600', text: 'text-red-400', icon: 'text-red-400' },
  green: { bg: 'bg-green-900/20', border: 'border-green-600', text: 'text-green-400', icon: 'text-green-400' },
  purple: { bg: 'bg-purple-900/20', border: 'border-purple-600', text: 'text-purple-400', icon: 'text-purple-400' },
  teal: { bg: 'bg-teal-900/20', border: 'border-teal-600', text: 'text-teal-400', icon: 'text-teal-400' },
  blue: { bg: 'bg-blue-900/20', border: 'border-blue-600', text: 'text-blue-400', icon: 'text-blue-400' },
  orange: { bg: 'bg-orange-900/20', border: 'border-orange-600', text: 'text-orange-400', icon: 'text-orange-400' },
}

const defaultPills: MetricPill[] = [
  { label: 'New York Open', value: 'Neutral 50', icon: Clock, color: 'yellow' as any },
  { label: 'Global Greed Gauge', value: 'Extreme Greed', icon: TrendingUp, color: 'green' },
  { label: 'Trump Social Monitor', value: 'Neutral USD 55', icon: Eye, color: 'purple' },
  { label: 'Fed Rate Prob.', value: 'Hawkish', icon: Zap, color: 'red' },
  { label: 'Global', value: '', icon: Globe, color: 'teal' },
  { label: 'Start News Live Stream', value: '', icon: BookOpen, color: 'green' },
]

export function MetricPills() {
  return (
    <div className="space-y-3">
      {defaultPills.map((pill) => {
        const colors = colorMap[pill.color] || colorMap.green
        const Icon = pill.icon

        return (
          <div
            key={pill.label}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border ${colors.border} ${colors.bg} w-fit cursor-pointer hover:opacity-80 transition-opacity`}
          >
            <Icon className={`w-4 h-4 ${colors.icon}`} />
            <span className={`text-sm font-mono ${colors.text}`}>{pill.label}</span>
            {pill.value && (
              <>
                <div className={`w-2 h-2 rounded-full ${colors.icon}`}></div>
                <span className={`text-sm font-mono ${colors.text}`}>{pill.value}</span>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
