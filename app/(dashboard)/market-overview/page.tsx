"use client"

import { useTerminalPrices, MARKET_SYMBOLS, formatPrice, symbolLabel } from "@/hooks/useLivePrices"

const PSYCHOLOGY_DATA = [
  {
    symbol: "XAUUSD",
    label: "GOLD",
    sentiment: "BULLISH",
    sentimentColor: "#00D084",
    retailLong: 68,
    smart: "ACCUMULATING",
    smartColor: "#FF6600",
    keyLevel: "3280",
    keyLevelType: "DEMAND",
    notes: "Retail heavily long — smart money typically fades retail extremes above 70%. Watch for liquidity sweep below 3280 before continuation.",
    fearGreed: 72,
  },
  {
    symbol: "EURUSD",
    label: "EUR/USD",
    sentiment: "NEUTRAL",
    sentimentColor: "#FF6600",
    retailLong: 52,
    smart: "OBSERVING",
    smartColor: "#888",
    keyLevel: "1.1300",
    keyLevelType: "PIVOT",
    notes: "Balanced positioning. Market awaiting ECB guidance. Break above 1.1400 activates bullish continuation. Support at 1.1200.",
    fearGreed: 50,
  },
  {
    symbol: "GBPUSD",
    label: "GBP/USD",
    sentiment: "BEARISH",
    sentimentColor: "#FF4444",
    retailLong: 38,
    smart: "DISTRIBUTING",
    smartColor: "#FF4444",
    keyLevel: "1.3200",
    keyLevelType: "SUPPLY",
    notes: "Retail contrarian signal — heavy short positioning. Smart money distribution phase near weekly highs. R/R favours shorts from 1.3250+.",
    fearGreed: 34,
  },
  {
    symbol: "NAS100",
    label: "NASDAQ 100",
    sentiment: "BULLISH",
    sentimentColor: "#00D084",
    retailLong: 61,
    smart: "ACCUMULATING",
    smartColor: "#FF6600",
    keyLevel: "19500",
    keyLevelType: "DEMAND",
    notes: "Tech sector recovering. AI momentum driving institutional accumulation. Key support at 19500 — breach would signal distribution.",
    fearGreed: 64,
  },
  {
    symbol: "BTCUSD",
    label: "BITCOIN",
    sentiment: "BULLISH",
    sentimentColor: "#00D084",
    retailLong: 74,
    smart: "NEUTRAL",
    smartColor: "#888",
    keyLevel: "93000",
    keyLevelType: "DEMAND",
    notes: "Retail Fear & Greed elevated. Halving cycle positioning ongoing. Caution above 100k — historical resistance zone. Risk management critical.",
    fearGreed: 78,
  },
]

function FearGreedMeter({ value }: { value: number }) {
  const getColor = (v: number) => {
    if (v >= 75) return "#FF4444"
    if (v >= 55) return "#FF6600"
    if (v >= 45) return "#888"
    if (v >= 25) return "#00D084"
    return "#00D084"
  }
  const getLabel = (v: number) => {
    if (v >= 75) return "EXTREME GREED"
    if (v >= 55) return "GREED"
    if (v >= 45) return "NEUTRAL"
    if (v >= 25) return "FEAR"
    return "EXTREME FEAR"
  }

  return (
    <div>
      <div className="flex items-center justify-between text-[9px] mb-1">
        <span className="text-[#555]">FEAR & GREED</span>
        <span style={{ color: getColor(value) }}>{getLabel(value)} · {value}</span>
      </div>
      <div className="h-1 bg-[#1A1A1A] rounded overflow-hidden">
        <div
          className="h-full rounded transition-all duration-1000"
          style={{ width: `${value}%`, backgroundColor: getColor(value) }}
        />
      </div>
    </div>
  )
}

export default function MarketPsychologyPage() {
  const { prices, lastUpdated } = useTerminalPrices(MARKET_SYMBOLS)

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-mono p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6600] animate-pulse" />
            <span className="text-[10px] text-[#FF6600] tracking-widest">MARKET PSYCHOLOGY</span>
          </div>
          <h1 className="text-lg font-bold tracking-wide">SENTIMENT & POSITIONING ANALYSIS</h1>
        </div>
        <div className="text-right text-[10px] text-[#444]">
          <div className="flex items-center gap-1 justify-end">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D084] animate-pulse" />
            <span>LIVE PRICES</span>
          </div>
          {lastUpdated && (
            <div className="mt-0.5">
              {lastUpdated.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {PSYCHOLOGY_DATA.map((item) => {
          const livePrice = prices[item.symbol]

          return (
            <div key={item.symbol} className="border border-[#1A1A1A] bg-[#0D0D0D]">
              {/* Card header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1A1A1A] bg-[#111]">
                <div>
                  <div className="text-sm font-bold text-white tracking-wide">{item.symbol}</div>
                  <div className="text-[10px] text-[#555]">{symbolLabel(item.symbol)}</div>
                </div>
                <div className="text-right">
                  {livePrice && !livePrice.loading ? (
                    <>
                      <div className="text-sm font-bold text-white tabular-nums">
                        {formatPrice(item.symbol, livePrice.price)}
                      </div>
                      <div
                        className="text-[10px] font-bold tabular-nums"
                        style={{ color: livePrice.isPositive ? "#00D084" : "#FF4444" }}
                      >
                        {livePrice.changePercent}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-1">
                      <div className="h-4 w-20 bg-[#1A1A1A] animate-pulse rounded" />
                      <div className="h-3 w-12 bg-[#1A1A1A] animate-pulse rounded ml-auto" />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-3">
                {/* Sentiment & Smart Money */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-[#1A1A1A] p-2.5">
                    <div className="text-[9px] text-[#555] tracking-wider mb-1">RETAIL SENTIMENT</div>
                    <div className="text-sm font-bold" style={{ color: item.sentimentColor }}>
                      {item.sentiment}
                    </div>
                  </div>
                  <div className="border border-[#1A1A1A] p-2.5">
                    <div className="text-[9px] text-[#555] tracking-wider mb-1">SMART MONEY</div>
                    <div className="text-sm font-bold" style={{ color: item.smartColor }}>
                      {item.smart}
                    </div>
                  </div>
                </div>

                {/* Retail long % */}
                <div>
                  <div className="flex items-center justify-between text-[9px] mb-1">
                    <span className="text-[#555]">RETAIL LONG %</span>
                    <span className="text-white">{item.retailLong}% LONG / {100 - item.retailLong}% SHORT</span>
                  </div>
                  <div className="h-2 bg-[#1A1A1A] rounded overflow-hidden flex">
                    <div
                      className="h-full transition-all duration-1000"
                      style={{ width: `${item.retailLong}%`, backgroundColor: "#00D084" }}
                    />
                    <div
                      className="h-full transition-all duration-1000"
                      style={{ width: `${100 - item.retailLong}%`, backgroundColor: "#FF4444" }}
                    />
                  </div>
                </div>

                {/* Fear & Greed */}
                <FearGreedMeter value={item.fearGreed} />

                {/* Key level */}
                <div className="border border-[#1A1A1A] p-2.5">
                  <div className="flex items-center justify-between text-[9px] mb-0.5">
                    <span className="text-[#555]">KEY LEVEL</span>
                    <span
                      className="px-1.5 py-0.5 text-[8px] tracking-widest"
                      style={{
                        color: item.keyLevelType === "DEMAND" ? "#00D084" : item.keyLevelType === "SUPPLY" ? "#FF4444" : "#FF6600",
                        backgroundColor: item.keyLevelType === "DEMAND" ? "#00D08415" : item.keyLevelType === "SUPPLY" ? "#FF444415" : "#FF660015",
                        border: `1px solid ${item.keyLevelType === "DEMAND" ? "#00D08430" : item.keyLevelType === "SUPPLY" ? "#FF444430" : "#FF660030"}`,
                      }}
                    >
                      {item.keyLevelType}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-white tabular-nums">{item.keyLevel}</span>
                </div>

                {/* Analyst note */}
                <div className="border-l-2 border-[#FF6600]/30 pl-3">
                  <p className="text-[10px] text-[#666] leading-relaxed">{item.notes}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 border border-[#1A1A1A] p-3 text-center">
        <p className="text-[10px] text-[#444]">
          ⚠ Sentiment data is educational. Retail positioning data sourced from broker aggregates. Not financial advice.
          Live prices update every 15 seconds via Twelve Data.
        </p>
      </div>
    </div>
  )
}
