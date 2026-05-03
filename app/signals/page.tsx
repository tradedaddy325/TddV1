"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  PieChart,
} from "lucide-react";

interface TradingSignal {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  strength: "weak" | "medium" | "strong";
  entry_point: number;
  target_price: number;
  stop_loss: number;
  risk_reward: number;
  confidence: number;
  timeframe: string;
  created_at: Date;
  status: "active" | "executed" | "expired";
}

// Mock signals - replace with real API calls
const mockSignals: TradingSignal[] = [
  {
    id: "1",
    symbol: "AAPL",
    type: "BUY",
    strength: "strong",
    entry_point: 175.5,
    target_price: 185.0,
    stop_loss: 170.0,
    risk_reward: 2.0,
    confidence: 85,
    timeframe: "4H",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "active",
  },
  {
    id: "2",
    symbol: "TSLA",
    type: "SELL",
    strength: "medium",
    entry_point: 242.3,
    target_price: 230.0,
    stop_loss: 250.0,
    risk_reward: 1.65,
    confidence: 72,
    timeframe: "1H",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: "active",
  },
  {
    id: "3",
    symbol: "GOOGL",
    type: "BUY",
    strength: "medium",
    entry_point: 138.2,
    target_price: 148.0,
    stop_loss: 132.0,
    risk_reward: 1.85,
    confidence: 68,
    timeframe: "D",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: "executed",
  },
  {
    id: "4",
    symbol: "MSFT",
    type: "BUY",
    strength: "strong",
    entry_point: 378.5,
    target_price: 395.0,
    stop_loss: 370.0,
    risk_reward: 2.2,
    confidence: 89,
    timeframe: "4H",
    created_at: new Date(Date.now() - 30 * 60 * 1000),
    status: "active",
  },
];

const strengthColors = {
  weak: "bg-yellow-500/20 border-yellow-500 text-yellow-400",
  medium: "bg-orange-500/20 border-orange-500 text-orange-400",
  strong: "bg-green-500/20 border-green-500 text-green-400",
};

const statusIcons = {
  active: { icon: AlertCircle, color: "text-green-400" },
  executed: { icon: CheckCircle, color: "text-blue-400" },
  expired: { icon: Clock, color: "text-gray-400" },
};

export default function SignalsPage() {
  const [signals, setSignals] = useState<TradingSignal[]>(mockSignals);
  const [filter, setFilter] = useState<"all" | "BUY" | "SELL">("all");
  const [sortBy, setSortBy] = useState<"newest" | "confidence" | "rr">("newest");

  // Filter and sort signals
  const filteredSignals = signals
    .filter((s) => filter === "all" || s.type === filter)
    .sort((a, b) => {
      if (sortBy === "newest") {
        return b.created_at.getTime() - a.created_at.getTime();
      } else if (sortBy === "confidence") {
        return b.confidence - a.confidence;
      } else if (sortBy === "rr") {
        return b.risk_reward - a.risk_reward;
      }
      return 0;
    });

  const stats = {
    active: signals.filter((s) => s.status === "active").length,
    win_rate: 65,
    avg_rr: (
      signals.reduce((acc, s) => acc + s.risk_reward, 0) / signals.length
    ).toFixed(2),
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Trading Signals</h1>
          </div>
          <p className="text-green-100 text-lg">
            AI-powered trading signals with real-time analysis and risk management
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Active Signals</p>
              <p className="text-3xl font-bold text-green-400 mt-1">
                {stats.active}
              </p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Historical Win Rate</p>
              <p className="text-3xl font-bold text-green-400 mt-1">
                {stats.win_rate}%
              </p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Avg Risk/Reward</p>
              <p className="text-3xl font-bold text-green-400 mt-1">
                1:{stats.avg_rr}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-3">
            {(["all", "BUY", "SELL"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === type
                    ? type === "BUY"
                      ? "bg-green-600 text-white"
                      : type === "SELL"
                      ? "bg-red-600 text-white"
                      : "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {type === "all" ? "All Signals" : type}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-green-500"
            >
              <option value="newest">Newest First</option>
              <option value="confidence">Highest Confidence</option>
              <option value="rr">Best Risk/Reward</option>
            </select>
          </div>
        </div>

        {/* Signals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSignals.map((signal) => {
            const StatusIcon = statusIcons[signal.status].icon;
            const strengthClass = strengthColors[signal.strength];

            return (
              <div
                key={signal.id}
                className={`border rounded-lg p-6 transition-colors ${
                  signal.status === "active"
                    ? "bg-gray-800 border-gray-700 hover:border-green-500"
                    : "bg-gray-800/50 border-gray-700/50"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold text-gray-100">
                        {signal.symbol}
                      </h3>
                      <div className={`px-3 py-1 rounded border text-sm font-semibold ${strengthClass}`}>
                        {signal.strength.toUpperCase()}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">
                      {signal.timeframe} Timeframe
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusIcon className={`w-5 h-5 ${statusIcons[signal.status].color}`} />
                    <span className="text-sm font-semibold text-gray-400">
                      {signal.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Signal Direction */}
                <div className="mb-4 p-3 rounded-lg bg-gray-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    {signal.type === "BUY" ? (
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-400" />
                    )}
                    <span
                      className={`font-bold text-lg ${
                        signal.type === "BUY"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {signal.type}
                    </span>
                  </div>
                </div>

                {/* Price Levels */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gray-700/30 rounded p-3">
                    <p className="text-xs text-gray-400 mb-1">Entry</p>
                    <p className="font-semibold text-gray-100">
                      ${signal.entry_point.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-green-600/20 border border-green-500/30 rounded p-3">
                    <p className="text-xs text-gray-400 mb-1">Target</p>
                    <p className="font-semibold text-green-400">
                      ${signal.target_price.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-red-600/20 border border-red-500/30 rounded p-3">
                    <p className="text-xs text-gray-400 mb-1">Stop Loss</p>
                    <p className="font-semibold text-red-400">
                      ${signal.stop_loss.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="text-xs text-gray-400">Risk/Reward</p>
                      <p className="font-semibold text-gray-100">
                        1:{signal.risk_reward.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="text-xs text-gray-400">Confidence</p>
                      <p className="font-semibold text-gray-100">
                        {signal.confidence}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                {signal.status === "active" && (
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors">
                    Take Trade
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredSignals.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No signals found for current filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
