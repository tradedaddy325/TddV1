// hooks/useMarketPrices.ts
// Auto-refresh market prices every 5 seconds

import { useEffect, useCallback } from "react";
import { useMarketStore } from "@/store/marketStore";

export function useMarketPrices(symbols?: string[]) {
  const { prices, fetchPrices, loading, error } = useMarketStore();

  // Initial fetch
  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPrices();
    }, 5000); // 5 second poll

    return () => clearInterval(interval);
  }, [fetchPrices]);

  // Helper to get price or fallback
  const getPrice = useCallback(
    (symbol: string): string => {
      const price = prices[symbol];
      return price ? `$${price.toFixed(2)}` : "—";
    },
    [prices]
  );

  // Get prices for specific symbols
  const getSymbolPrices = useCallback(
    () => {
      if (!symbols) return prices;
      return symbols.reduce((acc, sym) => {
        if (prices[sym]) acc[sym] = prices[sym];
        return acc;
      }, {} as Record<string, number>);
    },
    [prices, symbols]
  );

  return {
    prices,
    loading,
    error,
    getPrice,
    getSymbolPrices,
    refresh: fetchPrices,
  };
}
