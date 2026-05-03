import { useState, useEffect, useCallback } from "react";

interface PriceData {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  last_update: number;
  timestamp: number;
}

interface UsePriceDataOptions {
  symbols: string[];
  pollingInterval?: number;
  cacheTTL?: number;
  enabled?: boolean;
}

/**
 * Hook for fetching and updating price data
 * Handles polling, caching, and error states
 */
export function usePriceData({
  symbols,
  pollingInterval = 5000,
  cacheTTL = 5000,
  enabled = true,
}: UsePriceDataOptions) {
  const [prices, setPrices] = useState<Map<string, PriceData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchPrices = useCallback(async () => {
    if (!enabled || symbols.length === 0) return;

    try {
      setError(null);

      const symbolsParam = symbols.join(",");
      const response = await fetch(
        `/api/prices?symbols=${symbolsParam}&cache_ttl=${cacheTTL}`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      const newPrices = new Map(prices);
      if (Array.isArray(data)) {
        data.forEach((price) => {
          newPrices.set(price.symbol, price);
        });
      } else if (data.symbol) {
        newPrices.set(data.symbol, data);
      }

      setPrices(newPrices);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Price fetch error:", err);
      setLoading(false);
    }
  }, [symbols, cacheTTL, enabled, prices]);

  // Initial fetch
  useEffect(() => {
    fetchPrices();
  }, [symbols.join(","), cacheTTL]);

  // Polling
  useEffect(() => {
    if (!enabled || symbols.length === 0) return;

    const pollInterval = setInterval(fetchPrices, pollingInterval);

    return () => clearInterval(pollInterval);
  }, [enabled, symbols.join(","), pollingInterval, fetchPrices]);

  const getPrice = useCallback(
    (symbol: string): PriceData | null => {
      return prices.get(symbol) || null;
    },
    [prices]
  );

  const refetch = useCallback(() => {
    fetchPrices();
  }, [fetchPrices]);

  return {
    prices: Array.from(prices.values()),
    priceMap: prices,
    getPrice,
    loading,
    error,
    lastUpdate,
    refetch,
  };
}
