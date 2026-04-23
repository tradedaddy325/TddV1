// lib/alphaVantageService.ts
// Centralized Alpha Vantage API client with error handling

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = "https://www.alphavantage.co/query";

export interface PriceResponse {
  price: number | null;
  symbol: string;
  timestamp: number;
  error?: string;
}

export async function fetchPrice(symbol: string): Promise<PriceResponse> {
  if (!API_KEY) {
    return {
      symbol,
      price: null,
      timestamp: Date.now(),
      error: "API key not configured",
    };
  }

  try {
    const url = new URL(BASE_URL);
    url.searchParams.append("function", "GLOBAL_QUOTE");
    url.searchParams.append("symbol", symbol);
    url.searchParams.append("apikey", API_KEY);

    console.log("[v0] Fetching price for:", symbol);

    const response = await fetch(url.toString(), { 
      cache: "no-store",
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Check for API rate limit or error
    if (data.Note) {
      console.warn("[v0] Alpha Vantage rate limit:", data.Note);
      return {
        symbol,
        price: null,
        timestamp: Date.now(),
        error: "Rate limit exceeded",
      };
    }

    if (data.Error) {
      console.error("[v0] Alpha Vantage error:", data.Error);
      return {
        symbol,
        price: null,
        timestamp: Date.now(),
        error: data.Error,
      };
    }

    const quote = data["Global Quote"];
    if (!quote || !quote["05. price"]) {
      console.warn("[v0] No price data for symbol:", symbol);
      return {
        symbol,
        price: null,
        timestamp: Date.now(),
        error: "No price data available",
      };
    }

    const price = parseFloat(quote["05. price"]);
    if (isNaN(price)) {
      return {
        symbol,
        price: null,
        timestamp: Date.now(),
        error: "Invalid price format",
      };
    }

    console.log(`[v0] Got price for ${symbol}: $${price}`);

    return {
      symbol,
      price,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("[v0] fetchPrice error:", error);
    return {
      symbol,
      price: null,
      timestamp: Date.now(),
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
