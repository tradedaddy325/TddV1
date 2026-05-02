'use client';
import { useState } from 'react';
import { Calendar, TrendingUp, Target, Tag, Upload } from 'lucide-react';

export default function TradingJournalPage() {
  const [view, setView] = useState<'calendar' | 'list' | 'analytics'>('calendar');
  const [showAddTrade, setShowAddTrade] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Trading Journal</h1>
            <p className="text-gray-400">Track, analyze, and improve your trading performance</p>
          </div>
          <button
            onClick={() => setShowAddTrade(true)}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition flex items-center gap-2 justify-center"
          >
            <Upload className="w-5 h-5" />
            Log Trade
          </button>
        </div>

        {/* Stats */}
        <JournalStats />

        {/* View Toggle */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-2 flex gap-2">
          <button
            onClick={() => setView('calendar')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              view === 'calendar'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Calendar
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              view === 'list'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Trades
          </button>
          <button
            onClick={() => setView('analytics')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              view === 'analytics'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Analytics
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {view === 'calendar' && <div>Calendar view coming soon</div>}
            {view === 'list' && <div>Trades list coming soon</div>}
            {view === 'analytics' && (
              <div className="space-y-6">
                <WinRateCard />
                <RiskRewardCard />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RecentTrades />
            <TopStrategies />
            <CommonMistakes />
          </div>
        </div>
      </div>
    </div>
  );
}

function JournalStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[
        { label: 'Total Trades', value: '50', change: '+5 this week' },
        { label: 'Win Rate', value: '68%', change: '+2% this week' },
        { label: 'P&L', value: '$2,450', change: '+$150 this week' },
        { label: 'Best Strategy', value: 'Breakout', change: '75% win rate' },
      ].map((stat, idx) => (
        <div key={idx} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
          <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
          <p className="text-xs text-emerald-500">{stat.change}</p>
        </div>
      ))}
    </div>
  );
}

function WinRateCard() {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Win Rate</h3>
      <div className="flex items-end gap-4">
        <div className="text-5xl font-bold text-emerald-500">68%</div>
        <div className="text-sm text-gray-400 pb-2">
          <p>34 wins / 50 trades</p>
          <p className="text-emerald-500">+2% this week</p>
        </div>
      </div>
      <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '68%' }} />
      </div>
    </div>
  );
}

function RiskRewardCard() {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Avg Risk/Reward</h3>
      <div className="flex items-end gap-4">
        <div className="text-5xl font-bold text-blue-500">1:2.3</div>
        <div className="text-sm text-gray-400 pb-2">
          <p>Target: 1:2.0</p>
          <p className="text-blue-500">Above average</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-400">Avg Win</p>
          <p className="text-lg text-emerald-500 font-semibold">$230</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Avg Loss</p>
          <p className="text-lg text-red-500 font-semibold">$100</p>
        </div>
      </div>
    </div>
  );
}

function RecentTrades() {
  const trades = [
    { symbol: 'AAPL', pnl: 150, type: 'LONG', time: '2h ago' },
    { symbol: 'TSLA', pnl: -80, type: 'SHORT', time: '5h ago' },
    { symbol: 'MSFT', pnl: 220, type: 'LONG', time: '1d ago' },
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Trades</h3>
      <div className="space-y-3">
        {trades.map((trade, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
            <div>
              <p className="text-white font-semibold">{trade.symbol}</p>
              <p className="text-xs text-gray-400">{trade.type} • {trade.time}</p>
            </div>
            <div className={`text-lg font-bold ${trade.pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {trade.pnl >= 0 ? '+' : ''}${trade.pnl}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopStrategies() {
  const strategies = [
    { name: 'Breakout', winRate: 75, trades: 20 },
    { name: 'Reversal', winRate: 62, trades: 15 },
    { name: 'Trend Follow', winRate: 58, trades: 12 },
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Tag className="w-5 h-5 text-emerald-500" />
        Top Strategies
      </h3>
      <div className="space-y-3">
        {strategies.map((strategy, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white text-sm">{strategy.name}</span>
              <span className="text-emerald-500 text-sm font-semibold">{strategy.winRate}%</span>
            </div>
            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${strategy.winRate}%` }} />
            </div>
            <p className="text-xs text-gray-400">{strategy.trades} trades</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommonMistakes() {
  const mistakes = [
    { name: 'Early Exit', count: 8 },
    { name: 'No Stop Loss', count: 5 },
    { name: 'Overtrading', count: 4 },
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Common Mistakes</h3>
      <div className="space-y-3">
        {mistakes.map((mistake, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <span className="text-white text-sm">{mistake.name}</span>
            <span className="text-red-500 text-sm font-semibold">{mistake.count}x</span>
          </div>
        ))}
      </div>
    </div>
  );
}
