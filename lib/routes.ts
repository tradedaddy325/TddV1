/**
 * ROUTE REGISTRY — Single source of truth for all app routes.
 * Use this to fix broken Quick Access links.
 * 
 * ⚠️  If a route shows 404, check that:
 *   1. The folder exists in /app/
 *   2. It has a page.tsx
 *   3. The href here matches exactly
 */

export const ROUTES = {
  // Core
  dashboard: "/dashboard",
  terminal: "/dashboard/terminal",
  journal: "/journal",
  education: "/education",

  // Tools
  chatbot: "/dashboard/chatbot",       // renamed from "traders-talk-room"
  markets: "/dashboard/markets",
  analytics: "/dashboard/analytics",
  signals: "/dashboard/signals",
  risk: "/dashboard/risk",
  screener: "/dashboard/screener",
  
  // Settings
  settings: "/dashboard/settings",
  profile: "/dashboard/profile",
} as const;

export type RouteKey = keyof typeof ROUTES;

/**
 * Quick Access items for the dashboard.
 * Edit labels/icons here; hrefs auto-pull from ROUTES.
 */
export const QUICK_ACCESS_ITEMS = [
  { key: "terminal",  label: "Terminal",           icon: "📟", href: ROUTES.terminal },
  { key: "journal",   label: "Trade Journal",      icon: "📒", href: ROUTES.journal },
  { key: "education", label: "Education Suite",    icon: "📚", href: ROUTES.education },
  { key: "chatbot",   label: "Trade Daddy Chatbot",icon: "🤖", href: ROUTES.chatbot },
  { key: "signals",   label: "Signals",            icon: "🎯", href: ROUTES.signals },
  { key: "risk",      label: "Risk Manager",       icon: "🛡",  href: ROUTES.risk },
  { key: "screener",  label: "Screener",           icon: "🔍", href: ROUTES.screener },
] as const;
