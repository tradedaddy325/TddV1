// app/api/prices/route.ts
// Returns cached prices only (no direct Alpha Vantage calls)

import { NextResponse } from "next/server";
import { getCachedPrices, startPriceEngine } from "@/lib/priceEngine";

// Start the price engine when the API is first called
let engineStarted = false;

export async function GET() {
  try {
    // Ensure engine is running
    if (!engineStarted) {
      engineStarted = true;
      startPriceEngine();
    }

    const prices = getCachedPrices();

    // Return cached prices
    return NextResponse.json({
      prices,
      timestamp: Date.now(),
      cached: true,
    });
  } catch (error) {
    console.error("[v0] Prices API error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve prices", prices: {} },
      { status: 500 }
    );
  }
}

// POST endpoint to manually trigger an update (optional, for admin use)
export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 }
    );
  }

  try {
    if (!engineStarted) {
      engineStarted = true;
      startPriceEngine();
    }

    const prices = getCachedPrices();
    return NextResponse.json({
      message: "Price engine triggered",
      prices,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("[v0] Manual update error:", error);
    return NextResponse.json(
      { error: "Failed to trigger update" },
      { status: 500 }
    );
  }
}
