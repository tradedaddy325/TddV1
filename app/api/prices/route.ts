import { NextRequest, NextResponse } from "next/server";
import { fetchPriceData, fetchMultiplePrices } from "@/services/twelveDataService";

/**
 * GET /api/prices?symbol=AAPL
 * GET /api/prices?symbols=AAPL,GOOGL,MSFT
 * 
 * Query Parameters:
 * - symbol: Single symbol to fetch
 * - symbols: Comma-separated symbols
 * - cache_ttl: Cache duration in milliseconds (optional)
 * - fresh: Force fresh data, bypass cache (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get("symbol");
    const symbolsStr = searchParams.get("symbols");
    const cacheTTL = searchParams.get("cache_ttl");
    const fresh = searchParams.get("fresh") === "true";

    if (!symbol && !symbolsStr) {
      return NextResponse.json(
        { error: "Provide either 'symbol' or 'symbols' parameter" },
        { status: 400 }
      );
    }

    // Parse cache TTL (default 5 seconds for fresh data)
    const parsedTTL = cacheTTL ? parseInt(cacheTTL) : 5000;

    let priceData;

    if (symbol) {
      // Single symbol
      priceData = await fetchPriceData(symbol, !fresh, parsedTTL);
    } else {
      // Multiple symbols
      const symbols = (symbolsStr as string).split(",").map((s) => s.trim());
      priceData = await fetchMultiplePrices(symbols, !fresh, parsedTTL);
    }

    return NextResponse.json(priceData, {
      headers: {
        "Cache-Control": `public, max-age=${Math.floor(parsedTTL / 1000)}`,
      },
    });
  } catch (error) {
    console.error("Price API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch price data" },
      { status: 500 }
    );
  }
}
