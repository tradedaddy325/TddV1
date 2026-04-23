// store/marketStore.ts
// Global market data store using Zustand

import { create } from "zustand";

interface MarketStore {
  prices: Record<string, number>;
  setPrices: (prices: Record<string, number>) => void;
  getPrice: (symbol: string) => number | undefined;
  fetchPrices: () => Promise<void>;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useMarketStore = create<MarketStore>((set, get) => ({
  prices: {},
  loading: false,
  error: null,

  setPrices: (prices) => {
    set({ prices, error: null });
  },

  getPrice: (symbol: string) => {
    return get().prices[symbol];
  },

  setError: (error) => {
    set({ error });
  },

  fetchPrices: async () => {
    try {
      set({ loading: true, error: null });

      const response = await fetch("/api/prices", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      set({
        prices: data.prices || {},
        loading: false,
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("[v0] fetchPrices error:", errorMsg);
      set({
        error: errorMsg,
        loading: false,
      });
    }
  },
}));
