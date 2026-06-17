import React from 'react';
import { Signal, NewsSignal, EarningsSignal } from '../../types/neural-engine';

interface SignalsTabProps {
  signals: Signal[];
  newsSignals: NewsSignal[];
  earningsSignals: EarningsSignal[];
  loading: boolean;
}

export function SignalsTab({ 
  signals, 
  newsSignals, 
  earningsSignals, 
  loading 
}: SignalsTabProps) {
  const [activeTab, setActiveTab] = React.useState<'signals' | 'news' | 'earnings'>('signals');

  if (loading) {
    return <div className="text-gray-400 text-center py-12">Loading signals...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-gray-800 rounded border-2 border-cyan-600">
        <div className="text-cyan-500 font-mono text-xs mb-2">NEURAL SIGNAL ENGINE</div>
        <h2 className="text-3xl font-bold text-white font-mono mb-2">TRADING SIGNALS</h2>
        <p className="text-gray-400 font-mono text-sm">
          {signals.length} ACTIVE | {newsSignals.length} NEWS | {earningsSignals.length} EARNINGS
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-gray-700">
        {(['signals', 'news', 'earnings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-mono text-sm font-bold border-b-2 transition ${
              activeTab === tab
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab === 'signals' && 'AI SIGNALS'}
            {tab === 'news' && 'NEWS SIGNALS'}
            {tab === 'earnings' && 'EARNINGS'}
          </button>
        ))}
      </div>

      {/* AI Signals Tab */}
      {activeTab === 'signals' && (
        <div className="space-y-4">
          {signals.length > 0 ? (
            signals.map((signal, idx) => (
              <div key={idx} className="p-6 bg-gray-800 rounded border border-gray-700">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">{signal.asset}</h4>
                    <p className="text-gray-400 text-sm">{signal.timeframe} timeframe</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold font-mono ${
                      signal.type === 'BUY' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {signal.type}
                    </div>
                    <div className="text-cyan-400 font-mono text-sm">{signal.confidence}% confidence</div>
                  </div>
                </div>
                <div className="py-3 border-t border-gray-700 text-sm text-gray-300">
                  {signal.reasoning}
                </div>
                <div className="grid grid-cols-3 gap-4 mt-3 text-xs">
                  <div>
                    <div className="text-gray-500 font-mono mb-1">ENTRY</div>
                    <div className="text-white font-mono">{signal.entry}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 font-mono mb-1">STOP LOSS</div>
                    <div className="text-white font-mono">{signal.stopLoss}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 font-mono mb-1">TAKE PROFIT</div>
                    <div className="text-white font-mono">{signal.takeProfit}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-center py-8">No active signals</div>
          )}
        </div>
      )}

      {/* News Signals Tab */}
      {activeTab === 'news' && (
        <div className="space-y-4">
          {newsSignals.length > 0 ? (
            newsSignals.map((news, idx) => (
              <div key={idx} className="p-6 bg-gray-800 rounded border border-yellow-700">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">{news.event}</h4>
                    <p className="text-gray-400 text-sm">{news.time}</p>
                  </div>
                  <div className="text-right">
                    <div className={`font-mono text-xs font-bold ${
                      news.impact === 'HIGH' ? 'text-red-400' : news.impact === 'MEDIUM' ? 'text-yellow-400' : 'text-gray-400'
                    }`}>
                      {news.impact} IMPACT
                    </div>
                    {news.locked && (
                      <div className="text-yellow-500 text-xs mt-1">Locked {news.unlocksIn}h</div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-700 text-sm">
                  <div>
                    <div className="text-gray-500 text-xs font-mono mb-1">FORECAST</div>
                    <div className="text-white font-mono">{news.forecast}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs font-mono mb-1">PREVIOUS</div>
                    <div className="text-white font-mono">{news.previous}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-center py-8">No news signals</div>
          )}
        </div>
      )}

      {/* Earnings Signals Tab */}
      {activeTab === 'earnings' && (
        <div className="space-y-4">
          {earningsSignals.length > 0 ? (
            earningsSignals.map((earning, idx) => (
              <div key={idx} className="p-6 bg-gray-800 rounded border border-purple-700">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">{earning.company}</h4>
                    <p className="text-gray-400 text-sm">Earnings Report</p>
                  </div>
                  <div className="text-right">
                    <div className="text-purple-400 font-mono text-sm">{earning.reportTime}</div>
                    {earning.locked && (
                      <div className="text-purple-500 text-xs mt-1">Unlocks in {earning.hoursUntil}h</div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-3 border-t border-gray-700">
                  <div>
                    <div className="text-gray-500 text-xs font-mono mb-1">EST. EPS</div>
                    <div className="text-white font-mono">${earning.estimateEPS.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs font-mono mb-1">PREV. EPS</div>
                    <div className="text-white font-mono">${earning.previousEPS.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs font-mono mb-1">REVENUE EST.</div>
                    <div className="text-white font-mono">{earning.revenueEst}</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className={`text-sm font-mono font-bold ${
                    earning.prediction.direction === 'BEAT' ? 'text-green-400' :
                    earning.prediction.direction === 'MISS' ? 'text-red-400' :
                    'text-gray-400'
                  }`}>
                    {earning.prediction.direction} ({earning.prediction.confidence}% confidence)
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-center py-8">No upcoming earnings</div>
          )}
        </div>
      )}
    </div>
  );
}
