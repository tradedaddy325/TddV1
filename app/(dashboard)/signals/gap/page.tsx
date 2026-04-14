'use client';

import React, { useState, useEffect } from 'react';
import { Lock, MessageCircle, AlertTriangle, AlertCircle } from 'lucide-react';

interface GapSignal {
  id: string;
  symbol: string;
  direction: 'BUY' | 'SELL';
  confidence: number;
  status: 'High' | 'Moderate' | 'Low';
  analysis: string;
  unlocked?: boolean;
}

const GAP_SIGNALS: GapSignal[] = [
  {
    id: '1',
    symbol: 'GBPJPY',
    direction: 'BUY',
    confidence: 62,
    status: 'Moderate',
    analysis: 'GBPJPY showing strength off support with bullish technical confluence. BOE signals hawkish stance supporting GBP. If gap occurs on market close, buyers expected to maintain edge.',
    unlocked: false,
  },
  {
    id: '2',
    symbol: 'USDJPY',
    direction: 'BUY',
    confidence: 71,
    status: 'High',
    analysis: 'USD/JPY consolidating above key technical level. Strong institutional bid evident from flow data. Risk-on sentiment supports higher levels if gap opens.',
    unlocked: false,
  },
  {
    id: '3',
    symbol: 'EURUSD',
    direction: 'SELL',
    confidence: 58,
    status: 'Moderate',
    analysis: 'EUR selling off from resistance. ECB dovish narrative weighing on currency. If market closes, shorts likely to extend the move lower before mean reversion.',
    unlocked: false,
  },
  {
    id: '4',
    symbol: 'USOIL',
    direction: 'BUY',
    confidence: 65,
    status: 'Moderate',
    analysis: 'Crude oil bouncing off support amid geopolitical premium. Technical setup clean for gap up move. OPEC production concerns remain supportive.',
    unlocked: true,
  },
];

function GapSignalsPage() {
  const [unlockedSignals, setUnlockedSignals] = useState<Set<string>>(
    new Set(GAP_SIGNALS.filter((s) => s.unlocked).map((s) => s.id))
  );
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [countdown, setCountdown] = useState('');

  // Countdown timer to market close (4 PM EST / 21:00 UTC)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const utcHour = now.getUTCHours();
      const estHour = utcHour - 5; // EST is UTC-5

      let closeTime = new Date(now);
      closeTime.setHours(21, 0, 0, 0); // 21:00 UTC = 16:00 EST

      // If market has already closed today, set to tomorrow's close
      if (now.getTime() > closeTime.getTime()) {
        closeTime.setDate(closeTime.getDate() + 1);
      }

      const diff = closeTime.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'High':
        return 'text-red-400 bg-red-500/10';
      case 'Moderate':
        return 'text-amber-400 bg-amber-500/10';
      case 'Low':
        return 'text-cyan-400 bg-cyan-500/10';
      default:
        return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'High':
        return '🔴';
      case 'Moderate':
        return '⚠️';
      case 'Low':
        return '🔵';
      default:
        return '⚪';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">Gap Signals</h1>
          <p className="text-gray-400 text-lg">Next market close countdown</p>
        </div>

        {/* Info Card */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-3xl">⚡</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-2">Gap Signals — 49 credits per signal</h2>
              <p className="text-gray-300">
                AI-synthesized directional signals for daily and weekend gaps across major forex pairs
                and commodities using technical analysis, sentiment data, and news. Claude analyzes all
                sources to generate BUY/SELL direction for gap opportunities. Signals are generated 1
                hour before market close (4 PM EST). Entry within 6-10 minutes before close.
              </p>
            </div>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="bg-gradient-to-br from-purple-900/20 to-magenta-900/20 border border-purple-500/30 rounded-lg p-8 mb-8 text-center">
          <p className="text-gray-400 text-sm mb-2">⏰ Next market close countdown</p>
          <div className="text-5xl lg:text-7xl font-mono font-bold text-purple-400 mb-2">{countdown}</div>
          <p className="text-gray-400">Market closes in {countdown}</p>
        </div>

        {/* Disclaimer Modal */}
        {!disclaimerAccepted && (
          <div className="bg-red-500/10 border-2 border-red-500/50 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-400 mb-4">⚠️ Important Disclaimer</h3>
                <div className="space-y-3 text-gray-300 text-sm mb-6">
                  <p>
                    <span className="font-semibold text-white">1. Not Every Day:</span> Markets do not gap
                    every day. These signals show the likely direction IF a gap occurs.
                  </p>
                  <p>
                    <span className="font-semibold text-white">2. Broker Verification:</span> Verify your
                    broker allows gap trading. Many brokers do not honor limit orders during gaps.
                  </p>
                  <p>
                    <span className="font-semibold text-white">3. Market Close Timing:</span> Verify exact
                    close times with your broker. Enter 6-10 minutes BEFORE close.
                  </p>
                  <p>
                    <span className="font-semibold text-white">4. Risk Warning:</span> Gap trading carries
                    substantial risk. Past performance does not guarantee future results.
                  </p>
                  <p>
                    <span className="font-semibold text-white">5. No Financial Advice:</span> Speculative
                    signals only. You are solely responsible for trading decisions and losses.
                  </p>
                  <p>
                    <span className="font-semibold text-white">6. Weekend & Daily Risk:</span> Weekend and
                    intraday gaps carry significant risk from unforeseen events.
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setDisclaimerAccepted(true)}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition-colors"
                  >
                    I Understand
                  </button>
                  <button
                    onClick={() => setDisclaimerAccepted(false)}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded transition-colors"
                  >
                    Leave
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {disclaimerAccepted && (
          <>
            {/* Active Gap Signals */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Active Gap Signals</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {GAP_SIGNALS.map((signal) => (
                  <div
                    key={signal.id}
                    className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:border-cyan-500/30 transition-colors"
                  >
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-white font-mono">{signal.symbol}</h3>
                      <span className={`px-3 py-1 rounded text-xs font-semibold border ${getStatusColor(signal.status)}`}>
                        {getStatusIcon(signal.status)} {signal.status}
                      </span>
                    </div>

                    {/* Direction & Confidence */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-3xl font-bold ${signal.direction === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                          {signal.direction === 'BUY' ? '🟢' : '🔴'} {signal.direction}
                        </span>
                      </div>
                      <p className="text-gray-300 font-mono text-sm mb-2">{signal.confidence}% confidence</p>

                      {/* Confidence Bar */}
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div
                          className={`h-full rounded-full transition-all ${
                            signal.direction === 'BUY' ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${signal.confidence}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Analysis */}
                    <p className="text-gray-300 text-sm mb-6 leading-relaxed">{signal.analysis}</p>

                    {/* Unlock Button / Unlocked State */}
                    {!unlockedSignals.has(signal.id) ? (
                      <button className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded transition-colors flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4" />
                        Unlock for 49 credits
                      </button>
                    ) : (
                      <button className="w-full px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white font-semibold rounded transition-colors flex items-center justify-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        💬 Chat
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Reminder Box */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-amber-200">
                    <span className="font-semibold">⚠️ Reminder:</span> Markets don&apos;t gap every day. These
                    signals show the likely direction IF a gap occurs. Always verify broker gap policies and
                    manage your risk. For best results consider gap trading on a Friday only.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default GapSignalsPage;
