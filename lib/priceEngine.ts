// lib/priceEngine.ts
// Server-side cache and background price updater with rate-limit safety

import { fetchPrice } from "./alphaVantageService";

// Rate limit: 5 requests per minute = 1 request per 12 seconds
const ALPHA_VANTAGE_DELAY = 12000; // 12 seconds between calls

// Price cache
let prices: Record<string, number> = {};
let lastUpdated: Record<string, number> = {};
let updateInProgress = false;

// Symbols to track (EDITABLE)
export const TRACKED_SYMBOLS = [
  "AAPL",
  "BTCUSD", 
  "EURUSD",
  "TSLA",
  "NVDA",
  "MSFT",
  "GOOGL",
  "NAS100",
];

// Queue of symbols waiting to be updated
let updateQueue: string[] = [...TRACKED_SYMBOLS];
let currentSymbolIndex = 0;

// Background update loop
async function updatePriceLoop() {
  if (updateInProgress || updateQueue.length === 0) {
    // Reschedule
    setTimeout(updatePriceLoop, ALPHA_VANTAGE_DELAY);
    return;
  }

  updateInProgress = true;

  try {
    const symbol = updateQueue[currentSymbolIndex % updateQueue.length];
    const timeSinceLastUpdate = Date.now() - (lastUpdated[symbol] || 0);

    // Only fetch if enough time has passed
    if (timeSinceLastUpdate >= ALPHA_VANTAGE_DELAY) {
      const result = await fetchPrice(symbol);
      
      if (result.price !== null) {
        prices[symbol] = result.price;
        lastUpdated[symbol] = Date.now();
        console.log(`[v0] Price cache updated: ${symbol} = $${result.price}`);
      } else if (result.error) {
        // Keep last known price on error
        console.warn(`[v0] Price fetch failed for ${symbol}: ${result.error}`);
      }

      currentSymbolIndex++;
    } else {
      currentSymbolIndex++;
    }
  } catch (error) {
    console.error("[v0] Price loop error:", error);
  } finally {
    updateInProgress = false;
    // Wait 12 seconds before next update
    setTimeout(updatePriceLoop, ALPHA_VANTAGE_DELAY);
  }
}

// Start the background loop (only once)
let loopStarted = false;
export function startPriceEngine() {
  if (loopStarted) return;
  loopStarted = true;
  console.log("[v0] Price engine started, tracking:", TRACKED_SYMBOLS);
  updatePriceLoop();
}

// Get all cached prices
export function getCachedPrices(): Record<string, number> {
  return { ...prices };
}

// Get single price
export function getPrice(symbol: string): number | undefined {
  return prices[symbol];
}

// Initialize with default prices
export function initializePrices(initialPrices: Record<string, number>) {
  prices = { ...initialPrices };
  TRACKED_SYMBOLS.forEach((sym) => {
    if (prices[sym]) {
      lastUpdated[sym] = Date.now();
    }
  });
}

// Add a new symbol to tracking
export function addSymbol(symbol: string) {
  if (!TRACKED_SYMBOLS.includes(symbol)) {
    TRACKED_SYMBOLS.push(symbol);
    updateQueue = [...TRACKED_SYMBOLS];
    console.log("[v0] Added symbol to tracking:", symbol);
  }
}

// Get update status
export function getUpdateStatus() {
  return {
    prices,
    lastUpdated,
    trackedSymbols: TRACKED_SYMBOLS,
    updateInProgress,
  };
}
