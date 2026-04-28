"use client"

import { useTickerPrices, TICKER_SYMBOLS } from "@/hooks/useLivePrices"

/**
 * Landing page price ticker — updates every 4 HOURS to conserve Twelve Data credits.
 * Terminal components update every 15 seconds (see LiveMarketOverview.tsx).
 */
export default function LandingTicker() {
  const { prices } = useTickerPrices(TICKER_SYMBOLS)

  const items = TICKER_SYMBOLS.map((sym) => prices[sym]).filter(Boolean)
  const doubled = [...items, ...items]

  return (
    <div className="bg-[#111] border-b border-[#222] overflow-hidden h-8 flex items-center">
      <div
        className="flex gap-0 shrink-0"
        style={{ animation: "scroll 40s linear infinite" }}
      >
        {doubled.map((p, i) => (
          <span
            key={`${p.symbol}-${i}`}
            className="flex items-center gap-2 px-4 text-xs border-r border-[#222] h-8 whitespace-nowrap"
          >
            <span className="text-[#555]">{p.symbol}</span>
            <span className="text-white tabular-nums">
              {p.loading ? "···" : p.price}
            </span>
            {!p.loading && (
              <span
                className="text-[10px] tabular-nums"
                style={{ color: p.isPositive ? "#00D084" : "#FF4444" }}
              >
                {p.changePercent}
              </span>
            )}
          </span>
        ))}
      </div>
      <style>{`@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  )
}
