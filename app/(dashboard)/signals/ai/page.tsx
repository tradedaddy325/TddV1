'use client';

import { useState } from 'react';
import { Search, MessageCircle, Archive } from 'lucide-react';
import { SignalCard } from '@/components/signals/signal-card';
import { SignalStats } from '@/components/signals/signal-stats';
import { SignalFilters } from '@/components/signals/signal-filters';

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

export default function AiSignalsPage() {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [selectedConfidence, setSelectedConfidence] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [archivedSignals, setArchivedSignals] = useState<string[]>([]);

  const allSignals: Signal[] = [
    {
      id: 'gbpusd-001',
      asset: 'GBPUSD',
      direction: 'BUY',
      confidence: 78,
      entryPrice: 1.2645,
      takeProfit: 1.2745,
      stopLoss: 1.2595,
      technicalScore: 85,
      fundamentalScore: 72,
      sentimentScore: 75,
      reasoning: 'Strong bullish divergence on 4H chart with support breakout',
      timeframeRecommended: '4H',
      activeSignals: 17,
    },
    {
      id: 'xauusd-001',
      asset: 'XAUUSD',
      direction: 'BUY',
      confidence: 82,
      entryPrice: 2385.50,
      takeProfit: 2420.00,
      stopLoss: 2360.00,
      technicalScore: 88,
      fundamentalScore: 80,
      sentimentScore: 78,
      reasoning: 'Triple bottom formation with RSI oversold divergence confirmed',
      timeframeRecommended: '1D',
      activeSignals: 17,
    },
    {
      id: 'eurusd-001',
      asset: 'EURUSD',
      direction: 'SELL',
      confidence: 65,
      entryPrice: 1.0850,
      takeProfit: 1.0780,
      stopLoss: 1.0920,
      technicalScore: 72,
      fundamentalScore: 65,
      sentimentScore: 58,
      reasoning: 'Resistance breakout rejection with bearish engulfing pattern',
      timeframeRecommended: '4H',
      activeSignals: 17,
    },
  ];

  const filteredSignals = allSignals.filter((signal) => {
    const matchesSearch = signal.asset.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAssets = selectedAssets.length === 0 || selectedAssets.includes(signal.asset);
    const matchesConfidence =
      selectedConfidence === 'all' ||
      (selectedConfidence === 'high' && signal.confidence >= 75) ||
      (selectedConfidence === 'medium' && signal.confidence >= 60 && signal.confidence < 75) ||
      (selectedConfidence === 'low' && signal.confidence < 60);
    const notArchived = !archivedSignals.includes(signal.id);

    return matchesSearch && matchesAssets && matchesConfidence && notArchived;
  });

  const handleArchive = (signalId: string) => {
    setArchivedSignals((prev) => [...prev, signalId]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">AI Trading Signals</h1>
        <p className="text-slate-400">Multi-confluence AI-generated trading opportunities</p>
      </div>

      {/* Stats Cards */}
      <SignalStats signals={allSignals} filteredCount={filteredSignals.length} />

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by asset symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>

        <SignalFilters
          selectedAssets={selectedAssets}
          setSelectedAssets={setSelectedAssets}
          selectedConfidence={selectedConfidence}
          setSelectedConfidence={setSelectedConfidence}
        />
      </div>

      {/* Signals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {filteredSignals.length > 0 ? (
          filteredSignals.map((signal) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              onArchive={handleArchive}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-400 text-lg">No signals match your filters</p>
          </div>
        )}
      </div>

      {/* Floating Chat Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
        <MessageCircle className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
