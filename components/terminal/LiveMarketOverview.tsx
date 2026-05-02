'use client';
import { useEffect, useState } from 'react';
import { twelveDataService, MarketQuote } from '@/lib/services/twelvedata';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const DEFAULT_INSTRUMENTS = [
  'AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN',
  'SPY', 'QQQ', 'DIA',
  'EURUSD', 'GBPUSD', 'BTC/USD', 'ETH/USD'
];

export default function LiveMarketOverview() {
  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchMarketData = async () => {
    try {
      setError(null);
      const data = await twelveDataService.getMultipleQuotes(DEFAULT_INSTRUMENTS, true);
      setQuotes(data);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch market data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading live market data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-400 mb-2">{error}</p>
          <button
            onClick={fetchMarketData}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500" />
          <h3 className="text-lg font-semibold text-white">Live Market Overview</h3>
        </div>
        {lastUpdate && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {quotes.map((quote) => (
          <MarketCard key={quote.symbol} quote={quote} />
        ))}
      </div>
    </div>
  );
}

function MarketCard({ quote }: { quote: MarketQuote }) {
  const isPositive = quote.change >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 hover:border-emerald-500/50 transition">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-white">{quote.symbol}</h4>
          <p className="text-xs text-gray-400 truncate">{quote.name}</p>
        </div>
        <Icon className={`w-4 h-4 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`} />
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold text-white">
          ${quote.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{quote.change.toFixed(2)}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded ${
            isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
          }`}>
            {isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-700/50">
          <div>
            <p className="text-xs text-gray-400">High</p>
            <p className="text-sm text-white">${quote.high.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Low</p>
            <p className="text-sm text-white">${quote.low.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
