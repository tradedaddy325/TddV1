import LiveMarketOverview from "@/components/LiveMarketOverview"

export const metadata = {
  title: "Live Market Overview — TradeDaddy Terminal",
}

export default function MarketOverviewPage() {
  return (
    <div className="h-[calc(100vh-4rem)] bg-[#0A0A0A]">
      <LiveMarketOverview />
    </div>
  )
}
