const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY;
const BASE_URL = "https://api.twelvedata.com";

// Simple in-memory cache
interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

interface PriceData {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  last_update: number;
  timestamp: number;
}

/**
 * Fetch price data for a single symbol
 */
export async function fetchPriceData(
  symbol: string,
  useCache = true,
  cacheTTL = 5000
): Promise<PriceData | null> {
  const cacheKey = `price_${symbol}`;

  // Check cache
  if (useCache) {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheTTL) {
      return cached.data;
    }
  }

  try {
    const response = await fetch(
      `${BASE_URL}/quote?symbol=${symbol}&apikey=${TWELVE_DATA_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === "error") {
      throw new Error(data.message || "Unknown API error");
    }

    const priceData: PriceData = {
      symbol: data.symbol,
      price: parseFloat(data.close),
      change: parseFloat(data.change),
      change_percent: parseFloat(data.percent_change),
      last_update: Math.floor(new Date(data.updated).getTime() / 1000),
      timestamp: Date.now(),
    };

    // Store in cache
    cache.set(cacheKey, { data: priceData, timestamp: Date.now() });

    return priceData;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);

    // Return cached data if available, even if expired
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached.data;
    }

    return null;
  }
}

/**
 * Fetch price data for multiple symbols efficiently
 */
export async function fetchMultiplePrices(
  symbols: string[],
  useCache = true,
  cacheTTL = 5000
): Promise<PriceData[]> {
  const promises = symbols.map((symbol) =>
    fetchPriceData(symbol, useCache, cacheTTL)
  );

  const results = await Promise.all(promises);
  return results.filter((result): result is PriceData => result !== null);
}

/**
 * Create a real-time price stream
 */
export function createPriceStream(
  symbol: string,
  interval: number,
  onUpdate: (data: PriceData) => void,
  onError: (error: string) => void
): () => void {
  const pollInterval = setInterval(async () => {
    const data = await fetchPriceData(symbol, false, 0);
    if (data) {
      onUpdate(data);
    }
  }, interval);

  return () => clearInterval(pollInterval);
}

/**
 * Clear cache
 */
export function clearCache(symbol?: string): void {
  if (symbol) {
    cache.delete(`price_${symbol}`);
  } else {
    cache.clear();
  }
}
