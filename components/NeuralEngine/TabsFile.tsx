
// components/NeuralEngine/SignalsTab.tsx

import React, { useState } from 'react';
import { Signal, NewsSignal, EarningsSignal } from '../../types';

interface SignalsTabProps {
  aiSignals: Signal[];
  newsSignals: NewsSignal[];
  earningsSignals: EarningsSignal[];
  loading: boolean;
}

export function SignalsTab({
  aiSignals,
  newsSignals,
  earningsSignals,
  loading,
}: SignalsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'ai' | 'news' | 'earnings'>('ai');

  if (loading) {
    return <div className="text-gray-400 text-center py-12">Loading signals...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Subtabs */}
      <div className="flex gap-2 border-b border-gray-700">
        <button
          onClick={() => setActiveSubTab('ai')}
          className={`px-4 py-3 font-mono text-sm transition ${
            activeSubTab === 'ai'
              ? 'border-b-2 border-cyan-500 text-cyan-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          📊 AI Signals & Setups
        </button>
        <button
          onClick={() => setActiveSubTab('news')}
          className={`px-4 py-3 font-mono text-sm transition ${
            activeSubTab === 'news'
              ? 'border-b-2 border-cyan-500 text-cyan-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          ⚡ News Signals
        </button>
        <button
          onClick={() => setActiveSubTab('earnings')}
          className={`px-4 py-3 font-mono text-sm transition ${
            activeSubTab === 'earnings'
              ? 'border-b-2 border-cyan-500 text-cyan-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          📈 Earnings Signals
        </button>
      </div>

      {/* AI Signals */}
      {activeSubTab === 'ai' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white font-mono">AI SIGNALS & SETUPS</h2>
          {aiSignals.length === 0 ? (
            <div className="text-gray-400 text-center py-8">No active AI signals</div>
          ) : (
            aiSignals.map((signal) => (
              <div key={signal.id} className="p-6 bg-gray-800 rounded border border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-cyan-400 font-mono">{signal.asset}</h3>
                    <div className="text-gray-400 text-sm">{signal.timeframe}</div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`px-3 py-1 rounded text-sm font-mono mb-2 ${
                        signal.type === 'BUY'
                          ? 'bg-green-900 text-green-300'
                          : 'bg-red-900 text-red-300'
                      }`}
                    >
                      {signal.type === 'BUY' ? '🟢' : '🔴'} {signal.type}
                    </div>
                    <div className="text-2xl font-bold text-white">{signal.confidence}%</div>
                    <div className="text-gray-400 text-xs">Confidence</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4 py-4 border-t border-gray-700">
                  <div>
                    <div className="text-gray-500 text-xs font-mono mb-1">ENTRY</div>
                    <div className="text-cyan-400 font-mono">{signal.entry}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs font-mono mb-1">STOP LOSS</div>
                    <div className="text-red-400 font-mono">{signal.stopLoss}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs font-mono mb-1">TAKE PROFIT</div>
                    <div className="text-green-400 font-mono">{signal.takeProfit}</div>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4">{signal.reasoning}</p>

                <div className="flex gap-2">
                  <button className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-mono transition">
                    + WATCHLIST
                  </button>
                  <button className="flex-1 py-2 px-4 border border-green-500 text-green-400 hover:bg-green-900 hover:bg-opacity-20 rounded text-sm font-mono transition">
                    DETAILS →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* News Signals */}
      {activeSubTab === 'news' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white font-mono">NEWS SIGNALS</h2>
          <p className="text-gray-400 text-sm">Locked 1 hour before economic events</p>
          {newsSignals.length === 0 ? (
            <div className="text-gray-400 text-center py-8">No upcoming economic events</div>
          ) : (
            newsSignals.map((signal) => (
              <div key={signal.id} className="p-6 bg-gray-800 rounded border border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{signal.event}</h3>
                    <div className="text-gray-400 text-sm">{signal.time}</div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded text-sm font-mono ${
                      signal.impact === 'HIGH'
                        ? 'bg-red-900 text-red-300'
                        : signal.impact === 'MEDIUM'
                          ? 'bg-yellow-900 text-yellow-300'
                          : 'bg-blue-900 text-blue-300'
                    }`}
                  >
                    {signal.impact} Impact
                  </div>
                </div>

                {signal.locked ? (
                  <div className="p-4 bg-gray-900 rounded border border-gray-700 mb-4">
                    <div className="flex items-center justify-center">
                      <span className="text-yellow-400 font-mono text-sm">
                        🔒 LOCKED - Available in {Math.floor(signal.unlocksIn / 3600)}h {Math.floor((signal.unlocksIn % 3600) / 60)}m
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-900 rounded border border-gray-700 mb-4">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-gray-400 text-xs mb-1">FORECAST</div>
                        <div className="text-white font-mono">{signal.forecast}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs mb-1">PREVIOUS</div>
                        <div className="text-gray-300 font-mono">{signal.previous}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs mb-1">EXPECTED MOVE</div>
                        <div className="text-green-400 font-mono">±2-3%</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Earnings Signals */}
      {activeSubTab === 'earnings' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white font-mono">EARNINGS SIGNALS</h2>
          <p className="text-gray-400 text-sm">Locked 1 hour before earnings release</p>
          {earningsSignals.length === 0 ? (
            <div className="text-gray-400 text-center py-8">No upcoming earnings</div>
          ) : (
            earningsSignals.map((signal) => (
              <div key={signal.id} className="p-6 bg-gray-800 rounded border border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{signal.company}</h3>
                    <div className="text-gray-400 text-sm">{signal.reportTime}</div>
                  </div>
                  <div className={`px-3 py-1 rounded text-sm font-mono ${
                    signal.prediction.direction === 'BEAT'
                      ? 'bg-green-900 text-green-300'
                      : signal.prediction.direction === 'MISS'
                        ? 'bg-red-900 text-red-300'
                        : 'bg-yellow-900 text-yellow-300'
                  }`}>
                    {signal.prediction.direction} | {signal.prediction.confidence}% confidence
                  </div>
                </div>

                {signal.locked ? (
                  <div className="p-4 bg-gray-900 rounded border border-gray-700 mb-4">
                    <div className="flex items-center justify-center">
                      <span className="text-yellow-400 font-mono text-sm">
                        🔒 LOCKED - Available in {signal.hoursUntil}h
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-900 rounded border border-gray-700 mb-4">
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div>
                        <div className="text-gray-400 text-xs mb-1">PREVIOUS EPS</div>
                        <div className="text-white font-mono">${signal.previousEPS}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs mb-1">ESTIMATE</div>
                        <div className="text-gray-300 font-mono">${signal.estimateEPS}</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <div className="text-gray-400 text-xs mb-1">REVENUE ESTIMATE</div>
                      <div className="text-green-400 font-mono">{signal.revenueEst}</div>
                    </div>
                  </div>
                )}

                <button className="w-full py-2 px-4 rounded border border-green-500 text-green-400 hover:bg-green-900 hover:bg-opacity-20 transition text-sm font-mono">
                  VIEW DETAILS →
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}