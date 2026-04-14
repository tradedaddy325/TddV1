'use client';

import { useState, useEffect } from 'react';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { EventTypeCards } from '@/components/signals/event-type-cards';
import { CountdownTimer } from '@/components/signals/countdown-timer';
import { EventSignalCard } from '@/components/signals/event-signal-card';
import { GapSignalsSection } from '@/components/signals/gap-signals-section';
import { DisclaimerBox } from '@/components/signals/disclaimer-box';

interface UnlockedSignal {
  symbol: string;
  direction: 'BUY' | 'SELL';
  confidence: number;
  analysis: string;
  entryLevel: number;
  riskReward: string;
}

interface EconomicEvent {
  id: string;
  type: string;
  description: string;
  lockTime: string;
  eventTime: string;
  locked: boolean;
  unlockedSignals: UnlockedSignal[];
}

export default function EconomicEventSignalsPage() {
  const [selectedEventType, setSelectedEventType] = useState('FED_RATE');
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(true);

  const eventTypes = [
    { id: 'NFP', title: 'NFP', description: 'Non-Farm Payrolls', date: '08 May' },
    { id: 'CPI', title: 'CPI', description: 'Consumer Price Index', date: '12 May' },
    { id: 'FOMC', title: 'FOMC', description: 'FOMC Minutes', date: '20 May' },
    { id: 'FED_RATE', title: 'FED_RATE', description: 'Fed Rate Decision', date: '29 Apr' },
  ];

  const upcomingEvents: EconomicEvent[] = [
    {
      id: 'fed_rate_001',
      type: 'FED_RATE',
      description: 'Interest rate announcement — highest impact event',
      lockTime: '2026-04-29T18:00:00', // 3 hours before 21:00
      eventTime: '2026-04-29T21:00:00',
      locked: true,
      unlockedSignals: [],
    },
    {
      id: 'nfp_001',
      type: 'NFP',
      description: 'Non-Farm Payrolls — employment data',
      lockTime: '2026-05-08T09:00:00',
      eventTime: '2026-05-08T12:00:00',
      locked: true,
      unlockedSignals: [
        {
          symbol: 'GBPJPY',
          direction: 'BUY',
          confidence: 62,
          analysis: 'Technical confluence with oversold RSI and support breakdown resistance',
          entryLevel: 187.50,
          riskReward: '1:2.5',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* Disclaimer Modal */}
      {showDisclaimerModal && !disclaimerAccepted && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <DisclaimerBox
            onAccept={() => {
              setDisclaimerAccepted(true);
              setShowDisclaimerModal(false);
            }}
            onLeave={() => setShowDisclaimerModal(false)}
          />
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Economic Event Signals</h1>
        <p className="text-slate-400">NFP, CPI, FOMC & Fed Rate — directional signals for major events</p>
      </div>

      {/* Pricing Card */}
      <div className="mb-8 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg p-6 flex items-start gap-4">
        <div className="text-3xl">⚡</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-2">Economic Event Signals — 49 credits per signal</h3>
          <p className="text-slate-400 text-sm">
            AI-researched directional bias for major economic releases. Signals are generated once, stored in our
            database, and unlocked 3 hours before each event for all users. Not financial advice — always apply your
            own risk management.
          </p>
        </div>
      </div>

      {/* Next Event Countdown */}
      <div className="mb-8 bg-slate-800/40 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Next Major Event</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-2">April 2026 Fed Rate Decision</h3>
            <p className="text-slate-400 text-sm mb-1">📅 29 Apr 2026</p>
            <p className="text-slate-400 text-sm">⏰ 21:00 SAST</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600/20 to-magenta-600/20 border border-purple-500/50 rounded-lg p-6 min-w-[200px]">
            <p className="text-slate-400 text-xs mb-2 font-semibold">Signals unlock in:</p>
            <CountdownTimer targetTime="2026-04-29T21:00:00" />
          </div>
        </div>
      </div>

      {/* Event Type Selection */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Select Event Type</h2>
        <EventTypeCards
          eventTypes={eventTypes}
          selectedEventType={selectedEventType}
          onSelectEventType={setSelectedEventType}
        />
      </div>

      {/* Upcoming Events List */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Upcoming Events</h2>
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <EventSignalCard key={event.id} event={event} isSelected={event.type === selectedEventType} />
          ))}
        </div>
      </div>

      {/* Gap Signals Section */}
      <GapSignalsSection />

      {/* Disclaimer Box */}
      {!showDisclaimerModal && disclaimerAccepted && (
        <div className="mt-8">
          <DisclaimerBox
            onAccept={() => {}}
            onLeave={() => {}}
            embedded
          />
        </div>
      )}
    </div>
  );
}
