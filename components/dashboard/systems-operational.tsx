'use client'

import { CheckCircle2, AlertCircle, Server, Database, Signal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface SystemStatus {
  name: string
  status: 'operational' | 'warning' | 'degraded'
  uptime: string
  icon: React.ReactNode
}

export function SystemsOperational() {
  const systems: SystemStatus[] = [
    {
      name: 'API Gateway',
      status: 'operational',
      uptime: '99.98%',
      icon: <Server className="w-4 h-4" />,
    },
    {
      name: 'Database',
      status: 'operational',
      uptime: '99.99%',
      icon: <Database className="w-4 h-4" />,
    },
    {
      name: 'Market Data',
      status: 'operational',
      uptime: '99.95%',
      icon: <Signal className="w-4 h-4" />,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-900/20 text-green-300 border-green-700'
      case 'warning':
        return 'bg-yellow-900/20 text-yellow-300 border-yellow-700'
      case 'degraded':
        return 'bg-red-900/20 text-red-300 border-red-700'
      default:
        return 'bg-gray-900/20 text-gray-300 border-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />
      case 'degraded':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return null
    }
  }

  return (
    <div className="rounded-lg border border-green-600/30 bg-green-900/5 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-green-300 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Systems Operational
        </h3>
        <Badge className="bg-green-600/30 text-green-300 border-0">All Systems Online</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {systems.map((system) => (
          <div key={system.name} className={`rounded-lg border p-3 ${getStatusColor(system.status)}`}>
            <div className="flex items-start gap-2 mb-2">
              {getStatusIcon(system.status)}
              <span className="text-sm font-medium">{system.name}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="opacity-75">Uptime</span>
              <span className="font-mono font-semibold">{system.uptime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
