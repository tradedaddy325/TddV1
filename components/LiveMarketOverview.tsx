"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { usePriceData } from "@/hooks/usePriceData";

interface MarketInstrument {
  symbol: string;
  displayName: string;
}

const instruments: MarketInstrument[] = [
  { symbol: "AAPL", displayName: "Apple" },
  { symbol: "GOOGL", displayName: "Google" },
  { symbol: "MSFT", displayName: "Microsoft" },
  { symbol: "TSLA", displayName: "Tesla" },
  { symbol: "AMZN", displayName: "Amazon" },
  { symbol: "NVDA", displayName: "NVIDIA" },
];

export function LiveMarketOverview() {
  const { prices, loading, error, lastUpdate } = usePriceData({
    symbols: instruments.map((i) => i.symbol),
    enabled: true,
    pollingInterval: 5000, // 5 seconds for live feel
    cacheTTL: 5000,
  });

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-400" />
        <div>
          <p className="font-semibold text-red-400">Error Loading Prices</p>
          <p className="text-sm text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-100">Live Market Overview</h3>
        {lastUpdate && (
          <p className="text-xs text-gray-400">
            Updated {lastUpdate.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Instruments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {instruments.map((instrument) => {
          const priceData = prices.find((p) => p.symbol === instrument.symbol);
          const isPositive = (priceData?.change_percent ?? 0) >= 0;

          return (
            <div
              key={instrument.symbol}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-green-500 transition-colors"
            >
              {/* Symbol & Trend */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-100">{instrument.symbol}</p>
                  <p className="text-xs text-gray-400">{instrument.displayName}</p>
                </div>
                <div className={`p-2 rounded ${isPositive ? "bg-green-500/10" : "bg-red-500/10"}`}>
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>

              {/* Price & Change */}
              {priceData ? (
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-gray-100">
                    ${priceData.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${
                        isPositive ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {priceData.change_percent.toFixed(2)}%
                    </span>
                    <span className="text-xs text-gray-500">
                      {isPositive ? "+" : ""}
                      ${priceData.change.toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 animate-pulse">
                  <div className="h-8 bg-gray-700 rounded w-24" />
                  <div className="h-4 bg-gray-700 rounded w-16" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Loading State */}
      {loading && (
        <p className="text-xs text-gray-500 text-center py-2">
          Updating prices...
        </p>
      )}
    </div>
  );
}
