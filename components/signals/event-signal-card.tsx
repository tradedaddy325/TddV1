'use client';

import { Lock, Unlock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface UnlockedSignal {
  symbol: string;
  direction: 'BUY' | 'SELL';
  confidence: number;
  analysis: string;
  entryLevel: number;
  riskReward: string;
}

interface EventSignalCardProps {
  event: {
    id: string;
    type: string;
    description: string;
    lockTime: string;
    eventTime: string;
    locked: boolean;
    unlockedSignals: UnlockedSignal[];
  };
  isSelected: boolean;
}

export function EventSignalCard({ event, isSelected }: EventSignalCardProps) {
  const [isLocked, setIsLocked] = useState(event.locked);
  const [timeUntilUnlock, setTimeUntilUnlock] = useState('');

  useEffect(() => {
    const calculateTimeUntilUnlock = () => {
      const now = new Date().getTime();
      const lockTime = new Date(event.lockTime).getTime();
      const distance = lockTime - now;

      if (distance < 0) {
        setIsLocked(false);
        setTimeUntilUnlock('');
      } else {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        setTimeUntilUnlock(`${hours}h ${minutes}m`);
      }
    };

    calculateTimeUntilUnlock();
    const interval = setInterval(calculateTimeUntilUnlock, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [event.lockTime]);

  return (
    <div
      className={`rounded-lg border transition-all ${
        isSelected
          ? 'bg-gradient-to-br from-purple-600/20 to-magenta-600/20 border-2 border-purple-500'
          : 'bg-slate-800/40 border border-slate-700'
      } p-6`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className={`text-xl font-bold mb-1 font-mono ${isSelected ? 'text-purple-300' : 'text-white'}`}>
            {event.type}
          </h3>
          <p className="text-slate-400 text-sm">{event.description}</p>
        </div>
        {isLocked && (
          <div className="flex items-center gap-2 text-amber-500 text-xs">
            <Lock className="w-4 h-4" />
            <span>🔒 Locked</span>
          </div>
        )}
      </div>

      {isLocked && (
        <div className="mb-4 p-3 bg-slate-900/50 rounded border border-slate-700/50">
          <p className="text-slate-400 text-xs mb-2">Unlocks in:</p>
          <p className="text-amber-400 font-mono text-sm font-bold">{timeUntilUnlock}</p>
          <p className="text-slate-500 text-xs mt-2">Unlocks 3 hours before event</p>
        </div>
      )}

      {!isLocked && event.unlockedSignals.length > 0 && (
        <div className="mb-4 space-y-3">
          {event.unlockedSignals.map((signal, index) => (
            <div key={index} className="p-3 bg-slate-900/50 rounded border border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-mono font-bold">{signal.symbol}</h4>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${signal.direction === 'BUY' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {signal.direction === 'BUY' ? '🟢' : '🔴'} {signal.direction}
                  </span>
                </div>
              </div>
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-400">Confidence</span>
                  <span className="text-xs font-semibold text-cyan-400">{signal.confidence}%</span>
                </div>
                <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{ width: `${signal.confidence}%` }}
                  />
                </div>
              </div>
              <p className="text-slate-400 text-xs mb-2">{signal.analysis}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Entry Level:</span>
                  <p className="text-cyan-400 font-mono">{signal.entryLevel}</p>
                </div>
                <div>
                  <span className="text-slate-500">Risk/Reward:</span>
                  <p className="text-emerald-400 font-mono">{signal.riskReward}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-500 hover:to-magenta-500 text-white font-semibold rounded-lg transition-all text-sm flex items-center justify-center gap-2">
        <Lock className="w-4 h-4" />
        Unlock for 49 credits
      </button>
    </div>
  );
}
