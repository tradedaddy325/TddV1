"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, Globe, TrendingUp, Brain, MessageCircle,
  Zap, BookOpen, Users, User, X, ChevronDown, ChevronRight, Lock,
} from "lucide-react"

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Macro Desk", icon: Globe, href: "/macro" },
  { label: "Predictive Markets", icon: TrendingUp, href: "/markets" },
  { label: "Market Psychology", icon: Brain, href: "/market-psychology" },
  { label: "Strings", icon: MessageCircle, href: "/strings" },
  {
    label: "Signals", icon: TrendingUp, href: "/signals",
    children: [
      { label: "Signals & Setups", href: "/signals/setups" },
      { label: "AI Signals", href: "/signals/ai" },
      { label: "News Signals", href: "/signals/news" },
      { label: "Gap Signals", href: "/signals/gaps" },
      { label: "Earnings Signals", href: "/signals/earnings" },
    ],
  },
  {
    label: "Trading Tools", icon: Zap, href: "/tools",
    children: [
      { label: "Risk Calculator", href: "/tools/risk-calculator" },
      { label: "Trading Sessions", href: "/tools/sessions" },
      { label: "Economic Calendar", href: "/tools/economic-calendar" },
      { label: "Market Heatmap", href: "/tools/heatmap" },
      { label: "Market News", href: "/tools/news" },
      { label: "Charting", href: "/tools/charting" },
      { label: "Trade Journal", href: "/tools/journal" },
      { label: "Copy Trade Daddy's Strategy", href: "/tools/copy-strategy" },
      { label: "Trade Copier Setup", href: "/tools/copier-setup" },
    ],
  },
  { label: "Learn", icon: BookOpen, href: "/learn" },
  { label: "Community", icon: Users, href: "/community" },
  {
    label: "Profile", icon: User, href: "/profile",
    children: [
      { label: "My Account", href: "/profile" },
      { label: "Subscription & Billing", href: "/profile?tab=subscription" },
      { label: "Credits", href: "/profile?tab=credits" },
      { label: "Security", href: "/profile?tab=security" },
    ],
  },
  { label: "Traders Talk Room", icon: MessageCircle, href: "/chat", badge: 2 },
]

export default function Sidebar({ onClose, mobile }: { onClose?: () => void; mobile?: boolean }) {
  const pathname = usePathname()
  const [open, setOpen] = useState<string[]>([])

  const toggle = (l: string) =>
    setOpen((p) => (p.includes(l) ? p.filter((x) => x !== l) : [...p, l]))

  const active = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname?.startsWith(href + "/"))

  return (
    <aside className="w-[255px] min-h-screen bg-[#0B0B0B] border-r border-[#1A1A1A] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-[14px] border-b border-[#1A1A1A]">
        {mobile ? (
          <>
            <span className="text-xs font-bold tracking-[0.25em] text-white">MENU</span>
            <button onClick={onClose} className="text-[#555] hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#FF6600] flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-black" />
              </div>
              <span className="text-[13px] font-bold tracking-[0.12em] text-white">TRADEDADDY</span>
            </div>
          </>
        )}
      </div>

      {/* Nav list */}
      <nav className="flex-1 overflow-y-auto py-1">
        {NAV.map((item) => {
          const Icon = item.icon
          const isActive = active(item.href)
          const isOpen = open.includes(item.label)
          const hasSub = !!(item as any).children?.length

          return (
            <div key={item.label}>
              {hasSub ? (
                <button
                  onClick={() => toggle(item.label)}
                  className={`w-full flex items-center gap-3 px-4 py-[11px] border-l-[3px] transition-colors text-left group ${
                    isActive
                      ? "border-[#FF6600] bg-[#FF6600]/[0.07]"
                      : "border-transparent hover:bg-[#141414]"
                  }`}
                >
                  <Icon className={`w-[17px] h-[17px] shrink-0 ${isActive ? "text-[#FF6600]" : "text-[#4A4A4A] group-hover:text-[#777]"}`} />
                  <span className={`flex-1 text-[13px] font-medium ${isActive ? "text-white" : "text-[#7A7A7A] group-hover:text-[#aaa]"}`}>
                    {item.label}
                  </span>
                  {(item as any).locked && <Lock className="w-3 h-3 text-[#333]" />}
                  {isOpen
                    ? <ChevronDown className="w-3.5 h-3.5 text-[#3A3A3A]" />
                    : <ChevronRight className="w-3.5 h-3.5 text-[#3A3A3A]" />}
                </button>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-[11px] border-l-[3px] transition-colors group ${
                    isActive
                      ? "border-[#FF6600] bg-[#FF6600]/[0.07]"
                      : "border-transparent hover:bg-[#141414]"
                  }`}
                >
                  <Icon className={`w-[17px] h-[17px] shrink-0 ${isActive ? "text-[#FF6600]" : "text-[#4A4A4A] group-hover:text-[#777]"}`} />
                  <span className={`flex-1 text-[13px] font-medium ${isActive ? "text-white" : "text-[#7A7A7A] group-hover:text-[#aaa]"}`}>
                    {item.label}
                  </span>
                  {(item as any).locked && <Lock className="w-3 h-3 text-[#333]" />}
                  {(item as any).badge && (
                    <span className="bg-[#FF3B30] text-white text-[9px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 leading-none">
                      {(item as any).badge}
                    </span>
                  )}
                </Link>
              )}

              {/* Sub-items */}
              {hasSub && isOpen && (
                <div className="ml-[43px] border-l border-[#1E1E1E]">
                  {(item as any).children.map((c: { label: string; href: string }) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      onClick={onClose}
                      className={`flex items-center gap-2 pl-3.5 pr-4 py-[9px] text-[12px] transition-colors ${
                        pathname === c.href
                          ? "text-[#FF6600]"
                          : "text-[#4A4A4A] hover:text-[#888]"
                      }`}
                    >
                      <span className={`w-[5px] h-[5px] rounded-full shrink-0 ${pathname === c.href ? "bg-[#FF6600]" : "bg-[#242424]"}`} />
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-[#1A1A1A] p-3">
        <Link href="/profile" className="flex items-center gap-2.5 p-2 hover:bg-[#141414] rounded transition-colors">
          <div className="w-8 h-8 bg-[#FF6600] flex items-center justify-center text-[11px] font-bold text-black shrink-0">
            MB
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] text-white font-semibold truncate">Mohammed B.</p>
            <p className="text-[10px] text-[#3A3A3A] truncate tracking-wider">EXECUTION PLAN</p>
          </div>
          <div className="w-2 h-2 bg-[#FF6600] rounded-full" />
        </Link>
      </div>
    </aside>
  )
}
