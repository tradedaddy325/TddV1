
// components/NeuralEngine/TechnicalAnalysisTab.tsx

import React from 'react';
import { TechnicalAnalysisData } from '../../types';

interface TechnicalAnalysisTabProps {
  analysis: TechnicalAnalysisData[];
  loading: boolean;
}

export function TechnicalAnalysisTab({ analysis, loading }: TechnicalAnalysisTabProps) {
  if (loading) {
    return <div className="text-gray-400 text-center py-12">Loading technical analysis...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white font-mono">Technical Analysis Hub</h2>
      <p className="text-gray-400 text-sm">Real-time technical analysis charts for multiple asset classes</p>

      <div className="space-y-6">
        {analysis.map((asset) => (
          <div key={asset.id} className="p-6 bg-gray-800 rounded border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white font-mono">{asset.asset}</h3>
                <p className="text-gray-400 text-sm">{asset.timeframe}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-cyan-400 font-mono">{asset.price}</div>
                <div className={`font-mono text-sm ${
                  asset.trend === 'UPTREND'
                    ? 'text-green-400'
                    : asset.trend === 'DOWNTREND'
                      ? 'text-red-400'
                      : 'text-yellow-400'
                }`}>
                  {asset.trend === 'UPTREND' ? '↑' : asset.trend === 'DOWNTREND' ? '↓' : '→'} {asset.trend}
                </div>
              </div>
            </div>

            {/* Key Levels */}
            <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-t border-gray-700">
              <div>
                <div className="text-gray-500 text-xs font-mono mb-2">RESISTANCE LEVELS</div>
                <div className="space-y-1">
                  {asset.keyLevels.resistance.map((level, idx) => (
                    <div key={idx} className="text-red-400 font-mono text-sm">{level}</div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-xs font-mono mb-2">SUPPORT LEVELS</div>
                <div className="space-y-1">
                  {asset.keyLevels.support.map((level, idx) => (
                    <div key={idx} className="text-green-400 font-mono text-sm">{level}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="p-3 bg-gray-900 rounded border border-gray-700">
                <div className="text-gray-500 text-xs font-mono mb-1">RSI</div>
                <div className={`text-lg font-bold font-mono ${
                  asset.indicators.rsi > 70
                    ? 'text-red-400'
                    : asset.indicators.rsi < 30
                      ? 'text-green-400'
                      : 'text-white'
                }`}>
                  {asset.indicators.rsi}
                </div>
              </div>
              <div className="p-3 bg-gray-900 rounded border border-gray-700">
                <div className="text-gray-500 text-xs font-mono mb-1">MACD</div>
                <div className={`text-lg font-bold font-mono ${
                  asset.indicators.macd.histogram > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {asset.indicators.macd.histogram > 0 ? '+' : ''}{asset.indicators.macd.histogram.toFixed(1)}
                </div>
              </div>
              <div className="p-3 bg-gray-900 rounded border border-gray-700">
                <div className="text-gray-500 text-xs font-mono mb-1">MA20</div>
                <div className="text-cyan-400 font-mono text-sm">{asset.indicators.movingAverages.ma20}</div>
              </div>
              <div className="p-3 bg-gray-900 rounded border border-gray-700">
                <div className="text-gray-500 text-xs font-mono mb-1">MA50</div>
                <div className="text-cyan-400 font-mono text-sm">{asset.indicators.movingAverages.ma50}</div>
              </div>
            </div>

            {/* Bollinger Bands */}
            <div className="p-3 bg-gray-900 rounded border border-gray-700 mb-4">
              <div className="text-gray-500 text-xs font-mono mb-2">BOLLINGER BANDS</div>
              <div className="flex justify-between font-mono text-sm">
                <div className="text-red-400">Upper: {asset.indicators.bollinger.upper}</div>
                <div className="text-white">Mid: {asset.indicators.bollinger.middle}</div>
                <div className="text-green-400">Lower: {asset.indicators.bollinger.lower}</div>
              </div>
            </div>

            {/* Analysis */}
            <p className="text-gray-300 text-sm">{asset.analysis}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========================================
// components/NeuralEngine/PredictiveMarketsTab.tsx

import React from 'react';
import { PredictiveMarketsData } from '../../types';

interface PredictiveMarketsTabProps {
  data: PredictiveMarketsData;
  loading: boolean;
}

export function PredictiveMarketsTab({ data, loading }: PredictiveMarketsTabProps) {
  if (loading) {
    return <div className="text-gray-400 text-center py-12">Loading predictive markets...</div>;
  }

  if (!data) {
    return <div className="text-gray-400 text-center py-12">No predictive markets data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-gray-800 rounded border-2 border-cyan-600">
        <div className="text-cyan-500 font-mono text-xs mb-2">PREDICTION MARKET INTELLIGENCE</div>
        <h2 className="text-3xl font-bold text-white font-mono mb-2">PREDICTIVE MARKETS</h2>
        <p className="text-gray-400 font-mono text-sm">
          2000 MARKETS → {data.activeSignals} ACTIVE | {data.bullishSignals} BULLISH | {data.bearishSignals} BEARISH
        </p>
      </div>

      {/* Market Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-800 rounded border border-gray-700 text-center">
          <div className="text-2xl font-bold text-white mb-1">{data.activeSignals}</div>
          <div className="text-gray-400 text-sm">Active Signals</div>
        </div>
        <div className="p-4 bg-gray-800 rounded border border-gray-700 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">{data.bullishSignals}</div>
          <div className="text-gray-400 text-sm">Bullish Signals</div>
        </div>
        <div className="p-4 bg-gray-800 rounded border border-gray-700 text-center">
          <div className="text-2xl font-bold text-red-400 mb-1">{data.bearishSignals}</div>
          <div className="text-gray-400 text-sm">Bearish Signals</div>
        </div>
      </div>

      {/* Markets List */}
      <div>
        <h3 className="text-lg font-bold text-white font-mono mb-4">MAJOR MACRO EVENTS</h3>
        <div className="space-y-4">
          {data.markets.map((market, idx) => (
            <div key={idx} className="p-6 bg-gray-800 rounded border border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">{market.name}</h4>
                  <p className="text-gray-400 text-sm">{market.prediction}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-cyan-400">{market.probability}%</div>
                  <div className="text-gray-400 text-xs">Probability</div>
                </div>
              </div>

              {/* Probability bar */}
              <div className="h-2 bg-gray-700 rounded overflow-hidden mb-3">
                <div
                  className="h-full bg-cyan-500"
                  style={{ width: `${market.probability}%` }}
                ></div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-3 py-3 border-t border-gray-700">
                <div>
                  <div className="text-gray-500 text-xs font-mono mb-1">AFFECTED SYMBOLS</div>
                  <div className="text-white font-mono">{market.symbols}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs font-mono mb-1">DATE</div>
                  <div className="text-cyan-400 font-mono">{market.date}</div>
                </div>
              </div>

              {/* Impact description */}
              <div className="p-3 bg-gray-900 rounded border border-gray-700">
                <div className="text-yellow-500 font-mono text-xs mb-1">⚡ MARKET IMPACT</div>
                <p className="text-gray-300 text-sm">{market.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}