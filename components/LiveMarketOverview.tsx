"use client"

import { useTerminalPrices, MARKET_SYMBOLS, formatPrice, symbolLabel } from "@/hooks/useLivePrices"

const SYMBOL_GROUPS = [
  { label: "METALS", symbols: ["XAUUSD"] },
  { label: "FOREX MAJORS", symbols: ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD"] },
  { label: "INDICES", symbols: ["NAS100", "US500", "US30"] },
  { label: "CRYPTO", symbols: ["BTCUSD", "ETHUSD"] },
  { label: "COMMODITIES", symbols: ["WTI"] },
]

export default function LiveMarketOverview() {
  const { prices, lastUpdated, refresh } = useTerminalPrices(MARKET_SYMBOLS)

  const updatedStr = lastUpdated
    ? lastUpdated.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "LOADING..."

  return (
    <div className="h-full flex flex-col bg-[#0A0A0A] font-mono">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0D0D0D] border-b border-[#1A1A1A] shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D084] animate-pulse" />
          <span className="text-[10px] text-[#FF6600] tracking-widest font-bold">LIVE MARKET OVERVIEW</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#444] tracking-wider">
            {lastUpdated ? `UPDATED ${updatedStr}` : "CONNECTING..."}
          </span>
          <button
            onClick={refresh}
            className="text-[10px] text-[#444] hover:text-[#FF6600] transition-colors tracking-wider border border-[#1A1A1A] hover:border-[#FF6600]/30 px-2 py-0.5"
          >
            ↻ REFRESH
          </button>
        </div>
      </div>

      {/* Price table */}
      <div className="flex-1 overflow-y-auto">
        {SYMBOL_GROUPS.map((group) => (
          <div key={group.label}>
            {/* Group header */}
            <div className="px-4 py-1.5 bg-[#111] border-y border-[#1A1A1A] sticky top-0">
              <span className="text-[9px] text-[#444] tracking-[0.2em]">{group.label}</span>
            </div>

            {group.symbols.map((sym) => {
              const p = prices[sym]
              const isLoading = !p || p.loading

              return (
                <div
                  key={sym}
                  className="flex items-center px-4 py-2.5 border-b border-[#0F0F0F] hover:bg-[#0D0D0D] transition-colors group"
                >
                  {/* Symbol */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white tracking-wide">{sym}</div>
                    <div className="text-[10px] text-[#444] mt-0.5">{symbolLabel(sym)}</div>
                  </div>

                  {/* Price */}
                  <div className="text-right min-w-[100px]">
                    {isLoading ? (
                      <div className="h-4 w-20 bg-[#1A1A1A] animate-pulse rounded ml-auto" />
                    ) : (
                      <div className="text-sm font-bold text-white tabular-nums">
                        {formatPrice(sym, p.price)}
                      </div>
                    )}
                  </div>

                  {/* Change % */}
                  <div className="min-w-[70px] text-right ml-3">
                    {isLoading ? (
                      <div className="h-4 w-14 bg-[#1A1A1A] animate-pulse rounded ml-auto" />
                    ) : (
                      <span
                        className="text-xs font-bold tabular-nums"
                        style={{ color: p.isPositive ? "#00D084" : "#FF4444" }}
                      >
                        {p.changePercent}
                      </span>
                    )}
                  </div>

                  {/* Mini bar */}
                  <div className="ml-3 w-16 h-1 bg-[#1A1A1A] rounded overflow-hidden">
                    {!isLoading && (
                      <div
                        className="h-full rounded transition-all duration-500"
                        style={{
                          width: `${Math.min(100, 40 + Math.abs(parseFloat(p.changePercent)) * 15)}%`,
                          backgroundColor: p.isPositive ? "#00D084" : "#FF4444",
                        }}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-[#1A1A1A] bg-[#0D0D0D] shrink-0">
        <div className="flex items-center justify-between text-[9px] text-[#333]">
          <span>DATA VIA TWELVE DATA · 15s REFRESH</span>
          <span>TRADEDADDY TERMINAL</span>
        </div>
      </div>
    </div>
  )
}
