'use client';

import { Lock } from 'lucide-react';

export function GapSignalsSection() {
  const gapSignals = [
    { symbol: 'GBPJPY', direction: 'BUY', confidence: 62 },
    { symbol: 'EURUSD', direction: 'SELL', confidence: 58 },
    { symbol: 'USDJPY', direction: 'BUY', confidence: 71 },
  ];

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-6 mb-8">
      <h2 className="text-lg font-bold text-white mb-2">Gap Signals</h2>
      <p className="text-slate-400 text-sm mb-3">
        AI-synthesized directional signals for daily and weekend gaps across major forex pairs and commodities using
        technical analysis, sentiment data, and news. Claude analyzes all sources to generate BUY/SELL direction for gap
        opportunities.
      </p>
      <p className="text-slate-500 text-xs mb-4">
        Signals are generated 1 hour before market close (4 PM EST). Entry within 6-10 minutes before close.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {gapSignals.map((signal) => (
          <div key={signal.symbol} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-mono font-bold">{signal.symbol}</h4>
              <span className={`text-sm font-bold ${signal.direction === 'BUY' ? 'text-emerald-400' : 'text-red-400'}`}>
                {signal.direction === 'BUY' ? '🟢' : '🔴'} {signal.confidence}%
              </span>
            </div>
            <button className="w-full py-2 px-3 bg-purple-600/50 hover:bg-purple-500/50 text-purple-200 text-xs font-semibold rounded transition-all flex items-center justify-center gap-2">
              <Lock className="w-3 h-3" />
              Unlock for 49 credits
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
