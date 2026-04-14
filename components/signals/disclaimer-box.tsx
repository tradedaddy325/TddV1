'use client';

import { AlertCircle } from 'lucide-react';

interface DisclaimerBoxProps {
  onAccept: () => void;
  onLeave: () => void;
  embedded?: boolean;
}

export function DisclaimerBox({ onAccept, onLeave, embedded = false }: DisclaimerBoxProps) {
  const disclaimerPoints = [
    'Not Every Day: Markets do not gap every day. This analysis determines which direction price could continue in IF a gap occurs.',
    'Broker Verification: Verify your broker allows gap trading. Many brokers do not honor limit orders during gaps.',
    'Market Close Timing: Verify exact close times with your broker. Enter 6-10 minutes BEFORE close.',
    'Risk Warning: Gap trading carries substantial risk. Past performance does not guarantee future results.',
    'No Financial Advice: Speculative signals only. You are solely responsible for trading decisions and losses.',
    'Weekend & Daily Risk: Weekend and intraday gaps carry significant risk from unforeseen events.',
  ];

  const content = (
    <div className="space-y-4">
      <div className="flex items-start gap-3 mb-4">
        <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
        <h2 className="text-xl font-bold text-white">⚠️ Important Disclaimer</h2>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {disclaimerPoints.map((point, index) => (
          <div key={index} className="flex gap-3">
            <span className="text-red-500 font-bold flex-shrink-0">{index + 1}.</span>
            <p className="text-slate-300 text-sm leading-relaxed">{point}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onAccept}
          className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-all"
        >
          I Understand
        </button>
        <button
          onClick={onLeave}
          className="flex-1 py-3 px-4 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-all"
        >
          Leave
        </button>
      </div>
    </div>
  );

  if (embedded) {
    return <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">{content}</div>;
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-8 max-w-2xl w-full shadow-2xl">
      {content}
    </div>
  );
}
