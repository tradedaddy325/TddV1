'use client';

import { TrendingUp } from 'lucide-react';

interface SignalStatsProps {
  signals: any[];
  filteredCount: number;
}

export function SignalStats({ signals, filteredCount }: SignalStatsProps) {
  const buySignals = signals.filter((s) => s.direction === 'BUY').length;
  const sellSignals = signals.filter((s) => s.direction === 'SELL').length;
  const avgConfidence = Math.round(signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length);

  const stats = [
    {
      label: 'Active Signals',
      value: signals.length,
      icon: '📊',
      color: 'from-blue-600 to-blue-500',
    },
    {
      label: 'BUY Signals',
      value: buySignals,
      icon: '📈',
      color: 'from-emerald-600 to-emerald-500',
    },
    {
      label: 'SELL Signals',
      value: sellSignals,
      icon: '📉',
      color: 'from-red-600 to-red-500',
    },
    {
      label: 'Avg Confidence',
      value: `${avgConfidence}%`,
      icon: '🎯',
      color: 'from-purple-600 to-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
            <span className="text-2xl">{stat.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
