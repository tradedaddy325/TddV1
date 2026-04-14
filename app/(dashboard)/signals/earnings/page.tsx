'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface EarningsSignal {
  id: string;
  company: string;
  ticker: string;
  index: 'NASDAQ' | 'DOW';
  timeRemaining: string;
  reportDate: string;
  reportTime: 'Before Market Open' | 'After Market Close';
  epsEstimate: string;
  revenueEstimate: string;
  predictions: {
    earnings: 'Beat' | 'Miss';
    stock: 'Positive' | 'Negative';
    index: 'Positive' | 'Negative' | 'Caution';
  };
  analysis: string[];
}

const EARNINGS_SIGNALS: EarningsSignal[] = [
  {
    id: '1',
    company: 'UNH',
    ticker: 'UNH',
    index: 'DOW',
    timeRemaining: '🔥 In 3d',
    reportDate: '2026-04-14',
    reportTime: 'Before Market Open',
    epsEstimate: '$8.02',
    revenueEstimate: '$112.45 billion',
    predictions: {
      earnings: 'Beat',
      stock: 'Positive',
      index: 'Positive',
    },
    analysis: [
      'Medical Care Ratio (MCR) stability and utilization trends',
      'Expansion of value-based contracts in Optum Health',
      'Medicare Advantage growth amid CMS policy shifts',
    ],
  },
  {
    id: '2',
    company: 'MSFT',
    ticker: 'MSFT',
    index: 'NASDAQ',
    timeRemaining: '🔥 In 2d',
    reportDate: '2026-04-16',
    reportTime: 'After Market Close',
    epsEstimate: '$3.24',
    revenueEstimate: '$67.8 billion',
    predictions: {
      earnings: 'Beat',
      stock: 'Positive',
      index: 'Positive',
    },
    analysis: [
      'AI revenue acceleration from Copilot and Azure services',
      'Data center demand exceeds supply',
      'Cloud infrastructure margins expanding',
    ],
  },
  {
    id: '3',
    company: 'JPM',
    ticker: 'JPM',
    index: 'DOW',
    timeRemaining: 'In 5d',
    reportDate: '2026-04-19',
    reportTime: 'Before Market Open',
    epsEstimate: '$4.15',
    revenueEstimate: '$43.2 billion',
    predictions: {
      earnings: 'Beat',
      stock: 'Positive',
      index: 'Positive',
    },
    analysis: [
      'Net Interest Margin benefits from rate environment',
      'Investment banking fees rebound with M&A activity',
      'Trading desk performance strong amid volatility',
    ],
  },
  {
    id: '4',
    company: 'TSLA',
    ticker: 'TSLA',
    index: 'NASDAQ',
    timeRemaining: 'In 6d',
    reportDate: '2026-04-20',
    reportTime: 'After Market Close',
    epsEstimate: '$1.12',
    revenueEstimate: '$32.5 billion',
    predictions: {
      earnings: 'Miss',
      stock: 'Negative',
      index: 'Caution',
    },
    analysis: [
      'Demand concerns in key markets (China, Europe)',
      'Pricing pressure from competition',
      'Execution risk on new models',
    ],
  },
];

function EarningsSignalsPage() {
  const [selectedIndex, setSelectedIndex] = useState<'All' | 'NASDAQ' | 'DOW'>('All');

  const filteredSignals = EARNINGS_SIGNALS.filter((signal) => {
    if (selectedIndex === 'All') return true;
    return signal.index === selectedIndex;
  });

  const getPredictionColor = (prediction: string) => {
    if (prediction === 'Beat' || prediction === 'Positive') return 'bg-green-500/20 text-green-400 border-green-500/50';
    if (prediction === 'Miss' || prediction === 'Negative') return 'bg-red-500/20 text-red-400 border-red-500/50';
    return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
  };

  const getPredictionEmoji = (prediction: string) => {
    if (prediction === 'Beat') return '📊';
    if (prediction === 'Miss') return '📊';
    if (prediction === 'Positive') return '📈';
    if (prediction === 'Negative') return '📉';
    return '⚠️';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">Earnings Reports</h1>
          <p className="text-gray-400 text-lg">
            NASDAQ & DOW earnings analysis — free for all members
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-3xl">📊</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-2">
                Earnings Reports — Free Analysis
              </h2>
              <p className="text-gray-300 mb-2">
                Track upcoming earnings for NASDAQ & DOW companies. Our analyst researches
                estimates, recent performance, and macro context to give you a free prediction
                on whether results will beat/miss and how it may impact the stock and broader index.
              </p>
              <p className="text-sm text-gray-500">Daily shared cache</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-700/50">
          {(['All', 'NASDAQ', 'DOW'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedIndex(tab)}
              className={`pb-3 px-1 font-semibold transition-colors ${
                selectedIndex === tab
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Upcoming Earnings Header */}
        <div className="flex items-center gap-2 mb-6 text-white">
          <div className="text-xl">📅</div>
          <h2 className="text-2xl font-bold">Upcoming Earnings</h2>
        </div>

        {/* Earnings Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSignals.map((signal) => (
            <div
              key={signal.id}
              className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:border-cyan-500/30 transition-colors"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {signal.company} — {signal.ticker}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-slate-700/50 text-gray-300 rounded text-sm font-semibold">
                    {signal.index}
                  </span>
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded text-sm font-semibold">
                    {signal.timeRemaining}
                  </span>
                </div>
              </div>

              {/* Signal Details */}
              <div className="space-y-2 mb-4 text-gray-300 font-mono text-sm">
                <p>📅 {signal.reportDate}</p>
                <p>⏰ {signal.reportTime}</p>
                <p className="text-white font-bold">EPS Est: {signal.epsEstimate}</p>
                <p>Rev Est: {signal.revenueEstimate}</p>
              </div>

              {/* Predictions */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-3 py-1 rounded text-sm font-semibold border ${getPredictionColor(signal.predictions.earnings)}`}>
                    📊 Earnings: {signal.predictions.earnings}
                  </span>
                  <span className={`px-3 py-1 rounded text-sm font-semibold border ${getPredictionColor(signal.predictions.stock)}`}>
                    📈 Stock: {signal.predictions.stock}
                  </span>
                  <span className={`px-3 py-1 rounded text-sm font-semibold border ${getPredictionColor(signal.predictions.index)}`}>
                    📈 {signal.index.substring(0, 3)}: {signal.predictions.index}
                  </span>
                </div>
              </div>

              {/* Analysis */}
              <div className="space-y-2 text-gray-300 text-sm">
                {signal.analysis.map((point, idx) => (
                  <p key={idx}>• {point}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EarningsSignalsPage;
