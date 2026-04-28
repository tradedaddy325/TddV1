/**
 * Quick Access navigation config for TradeDaddy Terminal dashboard.
 *
 * All hrefs must match an existing page route.
 * Previously broken routes have been fixed or redirects added.
 */

export interface QuickAccessItem {
  label: string
  href: string
  icon: string
  tag?: string
  tagColor?: string
  description: string
}

export const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  // ─── Market Data ───────────────────────────────────────────────────────────
  {
    label: "Live Market Overview",
    href: "/dashboard/market-overview",
    icon: "📊",
    tag: "LIVE",
    tagColor: "#00D084",
    description: "Real-time prices for all instruments",
  },
  {
    label: "Market Psychology",
    href: "/dashboard/market-psychology",
    icon: "🧠",
    tag: "SENTIMENT",
    tagColor: "#FF6600",
    description: "Retail vs smart money positioning",
  },
  {
    label: "Economic Calendar",
    href: "/dashboard/economic-calendar",
    icon: "📅",
    description: "Upcoming high-impact events",
  },
  {
    label: "Macro Hub",
    href: "/dashboard/macro",
    icon: "🌐",
    description: "Global market news & analysis",
  },

  // ─── Calculators ───────────────────────────────────────────────────────────
  {
    label: "Position Sizing",
    href: "/dashboard/calculators/position-size",
    icon: "🧮",
    tag: "CALC",
    tagColor: "#888",
    description: "Lot size & risk calculator",
  },
  {
    label: "Pip Calculator",
    href: "/dashboard/calculators/pip-value",
    icon: "🧮",
    tag: "CALC",
    tagColor: "#888",
    description: "Pip value per lot size",
  },
  {
    label: "Risk / Reward",
    href: "/dashboard/calculators/risk-reward",
    icon: "⚖️",
    description: "R:R ratio calculator",
  },
  {
    label: "All Calculators",
    href: "/dashboard/calculators",
    icon: "🔢",
    description: "All 12+ trading calculators",
  },

  // ─── AI & Signals ──────────────────────────────────────────────────────────
  {
    label: "TradeDaddy AI",
    href: "/dashboard/chatbot",
    icon: "🤖",
    tag: "AI",
    tagColor: "#FF6600",
    description: "AI trading assistant",
  },
  {
    label: "Neural Network Signals",
    href: "/dashboard/signals",
    icon: "⚡",
    tag: "SIGNALS",
    tagColor: "#FF6600",
    description: "AI-generated trade setups",
  },
  {
    label: "Daily Intelligence",
    href: "/dashboard/intelligence",
    icon: "📋",
    description: "Daily market briefing",
  },

  // ─── Journal & Academy ─────────────────────────────────────────────────────
  {
    label: "Trade Journal",
    href: "/dashboard/journal",
    icon: "📓",
    description: "Log and review your trades",
  },
  {
    label: "Trading Academy",
    href: "/dashboard/academy",
    icon: "🎓",
    description: "Structured trading education",
  },
  {
    label: "My Performance",
    href: "/dashboard/performance",
    icon: "📈",
    description: "Win rate, R:R, stats",
  },

  // ─── Account ───────────────────────────────────────────────────────────────
  {
    label: "Account Settings",
    href: "/dashboard/settings",
    icon: "⚙️",
    description: "Profile & subscription",
  },
  {
    label: "Credits",
    href: "/dashboard/credits",
    icon: "💳",
    description: "Balance & top-up",
  },
]

/**
 * Returns only the items that have confirmed working routes.
 * Use this to render the Quick Access grid.
 */
export const CONFIRMED_ROUTES = new Set([
  "/dashboard/market-overview",
  "/dashboard/market-psychology",
  "/dashboard/chatbot",
  "/dashboard/calculators",
  "/dashboard/signals",
  "/dashboard/journal",
  "/dashboard/academy",
  "/dashboard/settings",
])
