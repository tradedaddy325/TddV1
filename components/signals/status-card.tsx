'use client'

interface StatusCardProps {
  label: string
  value: string | number
  unit?: string
  color?: 'green' | 'red' | 'blue' | 'purple' | 'yellow'
  icon?: string
}

export function StatusCard({ label, value, unit, color = 'blue', icon }: StatusCardProps) {
  const colorMap = {
    green: 'border-green-800 bg-green-900/10 text-green-400',
    red: 'border-red-800 bg-red-900/10 text-red-400',
    blue: 'border-blue-800 bg-blue-900/10 text-blue-400',
    purple: 'border-purple-800 bg-purple-900/10 text-purple-400',
    yellow: 'border-yellow-800 bg-yellow-900/10 text-yellow-400'
  }

  return (
    <div className={`p-4 rounded-lg border ${colorMap[color]}`}>
      <div className="flex items-center gap-3">
        {icon && <span className="text-2xl">{icon}</span>}
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">{label}</div>
          <div className="text-2xl font-bold mt-1">
            {value}
            {unit && <span className="text-lg text-gray-400 ml-1">{unit}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
