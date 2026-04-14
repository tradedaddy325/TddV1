'use client';

import { Archive, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';

interface Signal {
  id: string;
  asset: string;
  direction: 'BUY' | 'SELL';
  confidence: number;
  entryPrice: number;
  takeProfit: number;
  stopLoss: number;
  technicalScore: number;
  fundamentalScore: number;
  sentimentScore: number;
  reasoning: string;
  timeframeRecommended: string;
  activeSignals: number;
}

interface SignalCardProps {
  signal: Signal;
  onArchive: (signalId: string) => void;
}

export function SignalCard({ signal, onArchive }: SignalCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isBuy = signal.direction === 'BUY';
  const directionColor = isBuy ? 'from-emerald-600 to-emerald-500' : 'from-red-600 to-red-500';
  const directionBg = isBuy ? 'bg-emerald-500/10' : 'bg-red-500/10';
  const directionBorder = isBuy ? 'border-emerald-500/30' : 'border-red-500/30';
  const confidenceColor =
    signal.confidence >= 75 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400';

  return (
    <div
      className={`relative bg-slate-800/40 border border-slate-700 rounded-lg p-6 transition-all duration-300 ${
        isHovered ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/20' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1">{signal.asset}</h3>
          <p className="text-xs text-slate-400">Timeframe: {signal.timeframeRecommended}</p>
        </div>
        <button
          onClick={() => onArchive(signal.id)}
          className="text-slate-400 hover:text-slate-300 transition-colors ml-2"
          aria-label="Archive signal"
        >
          <Archive className="w-5 h-5" />
        </button>
      </div>

      {/* Direction Badge and Confidence */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${directionColor} flex items-center gap-2`}>
          {isBuy ? (
            <TrendingUp className="w-4 h-4 text-white" />
          ) : (
            <TrendingDown className="w-4 h-4 text-white" />
          )}
          <span className="text-white text-sm font-semibold">{signal.direction}</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${confidenceColor}`}>
          {signal.confidence}% Confidence
        </div>
      </div>

      {/* Price Levels */}
      <div className="grid grid-cols-3 gap-3 mb-5 p-3 bg-slate-900/30 rounded border border-slate-700/50">
        <div>
          <p className="text-xs text-slate-400 mb-1">Entry</p>
          <p className="text-sm font-mono text-cyan-400">{signal.entryPrice}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Take Profit</p>
          <p className="text-sm font-mono text-emerald-400">{signal.takeProfit}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Stop Loss</p>
          <p className="text-sm font-mono text-red-400">{signal.stopLoss}</p>
        </div>
      </div>

      {/* AI Confluence Scores */}
      <div className="space-y-3 mb-5">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-400">Technical</span>
            <span className="text-xs font-semibold text-cyan-400">{signal.technicalScore}%</span>
          </div>
          <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              style={{ width: `${signal.technicalScore}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-400">Fundamental</span>
            <span className="text-xs font-semibold text-purple-400">{signal.fundamentalScore}%</span>
          </div>
          <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              style={{ width: `${signal.fundamentalScore}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-400">Sentiment</span>
            <span className="text-xs font-semibold text-orange-400">{signal.sentimentScore}%</span>
          </div>
          <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500"
              style={{ width: `${signal.sentimentScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* AI Reasoning */}
      <div className="p-3 bg-slate-900/50 rounded border border-slate-700/50 mb-4">
        <p className="text-xs text-slate-400 mb-2 font-semibold">AI Reasoning</p>
        <p className="text-sm text-slate-300">{signal.reasoning}</p>
      </div>

      {/* Action Button */}
      <button className="w-full py-2 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg transition-all duration-200 text-sm">
        View Details
      </button>
    </div>
  );
}
