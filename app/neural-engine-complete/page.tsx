'use client';

import React, { useState, useEffect } from 'react';
import { useNeuralEngineData } from '@/lib/hooks/useNeuralEngineData';
import { useFeatureAccess } from '@/lib/hooks/useFeatureAccess';
import { PsychologyTab } from '@/components/NeuralEngine/PsychologyTab';
import { SignalsTab } from '@/components/NeuralEngine/SignalsTab';
import { TechnicalAnalysisTab } from '@/components/NeuralEngine/TechnicalAnalysisTab';
import { PredictiveMarketsTab } from '@/components/NeuralEngine/PredictiveMarketsTab';
import { RefreshCw, Lock, CheckCircle } from 'lucide-react';

const NEURAL_ENGINE_TABS = [
  { id: 'macro-desk', label: 'Macro Desk', feature: 'macro-desk', cost: 33, icon: '⚙️' },
  { id: 'psychology', label: 'Market Psychology', feature: 'psychology', cost: 33, icon: '🧠' },
  { id: 'signals', label: 'Signals', feature: 'signals', cost: 33, icon: '📈' },
  { id: 'technical', label: 'Technical Analysis', feature: 'technical-analysis', cost: 33, icon: '📊' },
  { id: 'predictive', label: 'Predictive Markets', feature: 'predictive-markets', cost: 33, icon: '🔮' },
];

export default function NeuralEngineCompletePage() {
  const [activeTab, setActiveTab] = useState('macro-desk');
  const [userId, setUserId] = useState('user-1');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // TODO: Get userId from auth context
    // const { user } = useAuth();
    // setUserId(user?.id || 'user-1');
  }, []);

  const {
    macroDeskData,
    psychologyData,
    aiSignals,
    newsSignals,
    earningsSignals,
    technicalAnalysis,
    predictiveMarkets,
    loading,
    refresh,
  } = useNeuralEngineData();

  const macroAccess = useFeatureAccess(userId, 'macro-desk');
  const psyAccess = useFeatureAccess(userId, 'psychology');
  const signalAccess = useFeatureAccess(userId, 'signals');
  const techAccess = useFeatureAccess(userId, 'technical-analysis');
  const predictAccess = useFeatureAccess(userId, 'predictive-markets');

  const accessMap: { [key: string]: ReturnType<typeof useFeatureAccess> } = {
    'macro-desk': macroAccess,
    'psychology': psyAccess,
    'signals': signalAccess,
    'technical': techAccess,
    'predictive': predictAccess,
  };

  const currentAccess = accessMap[activeTab];
  const currentTab = NEURAL_ENGINE_TABS.find((t) => t.id === activeTab);

  const renderLockedState = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <Lock size={48} className="text-yellow-600 mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">🔒 {currentTab?.label.toUpperCase()}</h2>
      <p className="text-gray-400 text-center mb-6 max-w-md">{currentAccess.message}</p>

      {currentAccess.expiresAt ? (
        <div className="flex gap-3 flex-col items-center">
          <div className="text-sm text-yellow-400 font-mono">
            Expired on {currentAccess.expiresAt.toLocaleDateString()}
          </div>
          <button
            onClick={() => currentAccess.renew()}
            disabled={currentAccess.loading}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded font-mono transition"
          >
            {currentAccess.loading ? 'Processing...' : 'Renew (30 days)'}
          </button>
        </div>
      ) : (
        <button
          onClick={() => currentAccess.unlock()}
          disabled={
            currentAccess.loading ||
            !currentAccess.creditsAvailable ||
            currentAccess.creditsAvailable < currentAccess.creditsRequired
          }
          className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white rounded font-mono transition"
        >
          {currentAccess.loading
            ? 'Processing...'
            : currentAccess.creditsAvailable < currentAccess.creditsRequired
              ? `Need ${currentAccess.creditsRequired - currentAccess.creditsAvailable} more credits`
              : `Unlock (${currentAccess.creditsRequired} credits)`}
        </button>
      )}
    </div>
  );

  const renderMacroDeskContent = () => {
    if (!macroDeskData) return <div className="text-gray-400">Loading macro desk data...</div>;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="p-6 bg-gray-800 rounded border-2 border-yellow-600">
          <div className="text-yellow-500 font-mono text-xs mb-2">TRADEHUB // MACRO DESK SHARED CACHE</div>
          <h2 className="text-3xl font-bold text-white font-mono mb-2">MACRO DESK TERMINAL</h2>
          <p className="text-gray-400 font-mono text-sm">
            Condensed retro desk with cached market reads, symbol snapshots, and deeper tactical drill-downs.
          </p>
        </div>

        {/* Desk Note */}
        <div className="p-6 bg-gray-800 rounded border-2 border-yellow-600">
          <div className="text-yellow-500 font-mono text-xs mb-3">DESK NOTE</div>
          <p className="text-gray-300 font-mono text-sm leading-relaxed">{macroDeskData.deskNote}</p>
        </div>

        {/* Overall Sentiment */}
        <div className="p-6 bg-gray-800 rounded border-2 border-yellow-600">
          <div className="text-yellow-500 font-mono text-xs mb-3">
            OVERALL SENTIMENT // {macroDeskData.overallSentiment}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold text-yellow-500">{macroDeskData.sentimentScore}</div>
            <div className="flex-1">
              <div className="h-3 bg-gray-700 rounded overflow-hidden">
                <div
                  className="h-full bg-yellow-500"
                  style={{ width: `${macroDeskData.sentimentScore}%` }}
                ></div>
              </div>
              <p className="text-gray-400 text-sm mt-2">Market sentiment gauge</p>
            </div>
          </div>
        </div>

        {/* Metals */}
        <div>
          <h3 className="text-sm font-mono text-yellow-500 mb-4">
            METALS - Gold and Silver Trend, Momentum, and Key Levels
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gold Card */}
            <div className="p-6 bg-gray-800 rounded border-t-4 border-t-yellow-600">
              <div className="text-yellow-500 font-mono text-xs mb-2">METAL</div>
              <h4 className="text-2xl font-bold text-white font-mono">XAUUSD</h4>
              <p className="text-gray-400 text-sm mb-4">GOLD</p>

              <div className="inline-block px-3 py-1 rounded border border-yellow-600 bg-yellow-900 bg-opacity-20 text-yellow-400 text-sm font-mono mb-4">
                {macroDeskData.metals.xauusd.direction}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-t border-gray-700">
                <div>
                  <div className="text-gray-500 text-xs font-mono mb-1">LAST PRICE</div>
                  <div className="text-cyan-400 font-mono text-lg">{macroDeskData.metals.xauusd.price}</div>
                  <div className="text-green-500 text-sm font-mono">
                    {macroDeskData.metals.xauusd.change > 0 ? '+' : ''}
                    {macroDeskData.metals.xauusd.change}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs font-mono mb-1">DIRECTION</div>
                  <div className="text-green-400 font-mono text-lg">
                    {macroDeskData.metals.xauusd.direction === 'BUY'
                      ? '↑'
                      : macroDeskData.metals.xauusd.direction === 'SELL'
                        ? '↘'
                        : '→'}{' '}
                    {macroDeskData.metals.xauusd.direction}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-900 rounded border-2 border-yellow-600 mb-4">
                <div className="text-yellow-500 font-mono text-xs mb-2">⭐ AI ANALYSIS</div>
                <p className="text-gray-300 text-sm">{macroDeskData.metals.xauusd.analysis}</p>
              </div>

              <button className="w-full py-2 px-4 rounded border border-green-500 text-green-400 hover:bg-green-900 hover:bg-opacity-20 transition text-sm font-mono">
                DEEP DIVE →
              </button>
            </div>

            {/* Silver Card */}
            <div className="p-6 bg-gray-800 rounded border-t-4 border-t-yellow-600">
              <div className="text-yellow-500 font-mono text-xs mb-2">METAL</div>
              <h4 className="text-2xl font-bold text-white font-mono">XAGUSD</h4>
              <p className="text-gray-400 text-sm mb-4">SILVER</p>

              <div className="inline-block px-3 py-1 rounded border border-yellow-600 bg-yellow-900 bg-opacity-20 text-yellow-400 text-sm font-mono mb-4">
                {macroDeskData.metals.xagusd.direction}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-t border-gray-700">
                <div>
                  <div className="text-gray-500 text-xs font-mono mb-1">LAST PRICE</div>
                  <div className="text-cyan-400 font-mono text-lg">{macroDeskData.metals.xagusd.price}</div>
                  <div className="text-green-500 text-sm font-mono">
                    {macroDeskData.metals.xagusd.change > 0 ? '+' : ''}
                    {macroDeskData.metals.xagusd.change}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs font-mono mb-1">DIRECTION</div>
                  <div className="text-green-400 font-mono text-lg">
                    {macroDeskData.metals.xagusd.direction === 'BUY'
                      ? '↑'
                      : macroDeskData.metals.xagusd.direction === 'SELL'
                        ? '↘'
                        : '→'}{' '}
                    {macroDeskData.metals.xagusd.direction}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-900 rounded border-2 border-yellow-600 mb-4">
                <div className="text-yellow-500 font-mono text-xs mb-2">⭐ AI ANALYSIS</div>
                <p className="text-gray-300 text-sm">{macroDeskData.metals.xagusd.analysis}</p>
              </div>

              <button className="w-full py-2 px-4 rounded border border-green-500 text-green-400 hover:bg-green-900 hover:bg-opacity-20 transition text-sm font-mono">
                DEEP DIVE →
              </button>
            </div>
          </div>
        </div>

        {/* Macro Events */}
        {macroDeskData.macroEvents.length > 0 && (
          <div className="p-6 bg-gray-800 rounded border-2 border-yellow-600">
            <div className="text-yellow-500 font-mono text-xs mb-4">ACTIVE MACRO EVENTS</div>
            <div className="space-y-3">
              {macroDeskData.macroEvents.map((event, idx) => (
                <div key={idx} className="p-4 bg-gray-900 rounded border border-yellow-600">
                  <h4 className="text-white font-bold mb-1">{event.title}</h4>
                  <div className="text-gray-400 text-sm mb-2">
                    <div>Probability: {event.probability}%</div>
                    <div>Affected Symbols: {event.affectedSymbols}</div>
                  </div>
                  <p className="text-gray-300 text-sm">{event.impact}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (!currentAccess.unlocked) {
      return renderLockedState();
    }

    switch (activeTab) {
      case 'macro-desk':
        return renderMacroDeskContent();
      case 'psychology':
        return psychologyData ? (
          <PsychologyTab data={psychologyData} loading={loading} />
        ) : (
          <div className="text-gray-400">Loading...</div>
        );
      case 'signals':
        return (
          <SignalsTab
            aiSignals={aiSignals}
            newsSignals={newsSignals}
            earningsSignals={earningsSignals}
            loading={loading}
          />
        );
      case 'technical':
        return <TechnicalAnalysisTab analysis={technicalAnalysis} loading={loading} />;
      case 'predictive':
        return predictiveMarkets ? (
          <PredictiveMarketsTab data={predictiveMarkets} loading={loading} />
        ) : (
          <div className="text-gray-400">Loading...</div>
        );
      default:
        return null;
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-gray-950" />;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Claude&apos;s Neural Engine</h1>
          <button
            onClick={refresh}
            disabled={loading}
            className="p-2 rounded border border-cyan-500 text-cyan-400 hover:bg-cyan-900 hover:bg-opacity-20 transition disabled:opacity-50"
            title="Refresh all data"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-gray-900 border-b border-gray-800 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex gap-1 p-4">
          {NEURAL_ENGINE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded font-mono text-sm transition whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gray-800 text-cyan-400 border-l-4 border-cyan-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              {accessMap[tab.id]?.unlocked ? (
                <CheckCircle size={14} />
              ) : (
                <Lock size={14} />
              )}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {renderContent()}
      </div>
    </div>
  );
}
