
// components/NeuralEngine/PsychologyTab.tsx

import React from 'react';
import { PsychologyData } from '../../types/neural-engine';

interface PsychologyTabProps {
  data: PsychologyData;
  loading: boolean;
}

export function PsychologyTab({ data, loading }: PsychologyTabProps) {
  if (loading) {
    return <div className="text-gray-400 text-center py-12">Loading psychology data...</div>;
  }

  if (!data) {
    return <div className="text-gray-400 text-center py-12">No psychology data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-gray-800 rounded border-2 border-purple-600">
        <div className="text-purple-500 font-mono text-xs mb-2">NARRATIVE INTELLIGENCE ENGINE</div>
        <h2 className="text-3xl font-bold text-white font-mono mb-1">🧠 MARKET PSYCHOLOGY</h2>
        <p className="text-gray-400 font-mono text-xs">
          REAL-TIME SENTIMENT & NARRATIVE INTELLIGENCE • SOCIAL + NEWS + AI SYNTHESIS
        </p>
        <div className="flex items-center gap-4 mt-4">
          <span className="text-purple-500 font-mono text-xs">(⚫) LIVE • 1 HR REFRESH</span>
          <button className="px-3 py-1 border border-purple-500 text-purple-400 rounded hover:bg-purple-900 hover:bg-opacity-20 transition font-mono text-xs">
            🔄 REFRESH
          </button>
        </div>
      </div>

      {/* Market Mood */}
      <div className="p-6 bg-gray-800 rounded border border-gray-700">
        <div className="text-gray-500 font-mono text-xs mb-4">MARKET MOOD</div>
        <h3 className="text-4xl font-bold text-yellow-400 font-mono mb-4">{data.marketMood}</h3>
        <div className="h-3 bg-gray-700 rounded overflow-hidden mb-2">
          <div className="h-full bg-yellow-500" style={{ width: `${data.moodScore}%` }}></div>
        </div>
        <div className="text-gray-400 text-sm font-mono">
          {data.moodScore}/100 — {data.moodScore > 60 ? 'Optimistic market conditions' : data.moodScore > 40 ? 'Mixed sentiment' : 'Cautious positioning'}
        </div>
      </div>

      {/* Sentiment Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-800 rounded border border-gray-700 text-center">
          <div className="text-green-500 text-2xl mb-2">📈</div>
          <div className="text-2xl font-bold text-white">{data.bullishAssets}</div>
          <div className="text-gray-400 text-sm">Bullish Assets</div>
        </div>
        <div className="p-4 bg-gray-800 rounded border border-gray-700 text-center">
          <div className="text-red-500 text-2xl mb-2">📉</div>
          <div className="text-2xl font-bold text-white">{data.bearishAssets}</div>
          <div className="text-gray-400 text-sm">Bearish Assets</div>
        </div>
        <div className="p-4 bg-gray-800 rounded border border-gray-700 text-center">
          <div className="text-gray-400 text-2xl mb-2">➖</div>
          <div className="text-2xl font-bold text-white">{data.neutralAssets}</div>
          <div className="text-gray-400 text-sm">Neutral Assets</div>
        </div>
        <div className="p-4 bg-gray-800 rounded border border-gray-700 text-center">
          <div className="text-orange-500 text-2xl mb-2">⚡</div>
          <div className="text-2xl font-bold text-white">{data.volatileAssets}</div>
          <div className="text-gray-400 text-sm">Volatile Assets</div>
        </div>
      </div>

      {/* Emotion Breakdown */}
      <div>
        <h3 className="text-sm font-mono text-cyan-400 mb-4">EMOTIONAL BREAKDOWN</h3>
        <div className="space-y-4">
          {[
            { name: 'OPTIMISM', value: data.emotions.optimism, color: '#10b981' },
            { name: 'FEAR', value: data.emotions.fear, color: '#ef4444' },
            { name: 'GREED', value: data.emotions.greed, color: '#f59e0b' },
            { name: 'UNCERTAINTY', value: data.emotions.uncertainty, color: '#06b6d4' },
            { name: 'FOMO', value: data.emotions.fomo, color: '#a855f7' },
          ].map((emotion) => (
            <div key={emotion.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-400 font-mono text-sm">{emotion.name}</span>
                <span className="text-gray-300 font-mono text-sm">{emotion.value}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded overflow-hidden">
                <div
                  className="h-full"
                  style={{ width: `${emotion.value}%`, backgroundColor: emotion.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Narrative */}
      <div className="p-6 bg-gray-800 rounded border-2 border-purple-600">
        <div className="text-purple-500 font-mono text-xs mb-3">⭐ AI INTERPRETATION</div>
        <p className="text-gray-300 leading-relaxed text-sm mb-4">{data.narrative}</p>
      </div>

      {/* Asset Sentiment */}
      <div>
        <h3 className="text-sm font-mono text-cyan-400 mb-4">ASSET SENTIMENT ({data.sentimentByAssetClass.length})</h3>
        <div className="space-y-4">
          {data.sentimentByAssetClass.map((asset, idx) => (
            <div key={idx} className="p-6 bg-gray-800 rounded border-2 border-green-600">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-white font-bold">{asset.assets}</h4>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-500">{asset.score}</div>
                  <div className="text-green-400 font-mono text-sm uppercase">{asset.sentiment}</div>
                </div>
              </div>

              {/* Emotion bars for this asset */}
              <div className="space-y-2 mb-4">
                {[
                  { name: 'OPTIMISM', value: asset.emotions.optimism, color: '#10b981' },
                  { name: 'FEAR', value: asset.emotions.fear, color: '#ef4444' },
                  { name: 'URGENCY', value: asset.emotions.urgency, color: '#f59e0b' },
                  { name: 'CONFUSION', value: asset.emotions.confusion, color: '#06b6d4' },
                  { name: 'JOY', value: asset.emotions.joy, color: '#a855f7' },
                ].map((emotion) => (
                  <div key={emotion.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">{emotion.name}</span>
                      <span className="text-gray-300">{emotion.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded overflow-hidden">
                      <div
                        className="h-full"
                        style={{ width: `${emotion.value}%`, backgroundColor: emotion.color }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* SVC Score */}
              <div className="flex justify-between items-center p-3 bg-gray-900 rounded border border-gray-700">
                <div className="text-gray-400 text-xs font-mono">SVC SCORE</div>
                <div className="text-green-400 font-mono text-sm">
                  {asset.svcScore > 0 ? '+' : ''}{asset.svcScore.toFixed(1)} • 
                  {asset.svcScore > 10 ? ' MAJOR BULLISH' : asset.svcScore > 0 ? ' MINOR BULLISH' : asset.svcScore < -10 ? ' MAJOR BEARISH' : ' MINOR BEARISH'}
                </div>
                <div className="text-gray-400 text-xs font-mono">
                  {asset.newsVsSocialGap}PT GAP
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
