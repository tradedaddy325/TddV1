'use client';
import { Radio, TrendingUp, Clock, Target } from 'lucide-react';

export default function SignalsPage() {
  const signals = [
    {
      id: 1,
      symbol: 'AAPL',
      type: 'BUY',
      entry: 175.50,
      target: 182.00,
      stopLoss: 172.00,
      confidence: 85,
      timeframe: '4H',
      status: 'active',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      symbol: 'TSLA',
      type: 'SELL',
      entry: 245.00,
      target: 235.00,
      stopLoss: 250.00,
      confidence: 78,
      timeframe: '1H',
      status: 'active',
      timestamp: '5 hours ago',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8 pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Radio className="w-8 h-8 text-emerald-500" />
          <div>
            <h1 className="text-3xl font-bold text-white">Trading Signals</h1>
            <p className="text-gray-400">AI-powered trade recommendations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {signals.map((signal) => (
            <div key={signal.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-emerald-500/50 transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">{signal.symbol}</h3>
                  <p className="text-sm text-gray-400">{signal.timeframe} Timeframe</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                  signal.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'
                }`}>
                  {signal.type}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Entry</span>
                  <span className="text-white font-semibold">${signal.entry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Target</span>
                  <span className="text-emerald-500 font-semibold">${signal.target}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Stop Loss</span>
                  <span className="text-red-500 font-semibold">${signal.stopLoss}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Confidence</span>
                  <span className="text-emerald-500 font-semibold">{signal.confidence}%</span>
                </div>
                <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${signal.confidence}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
