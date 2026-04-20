"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BrainCircuit,
  TrendingUp,
  Calculator,
  GraduationCap,
  Users,
  User,
  MessageSquare,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    children: null,
  },
  {
    label: "Claude's Neural Network",
    icon: BrainCircuit,
    href: "/neural-network",
    children: [
      { label: "Daily Intelligence", href: "/neural-network/daily-intelligence" },
      { label: "AI Signals", href: "/neural-network/signals" },
      { label: "Market Psychology", href: "/neural-network/psychology" },
      { label: "Macro Terminal", href: "/neural-network/macro" },
    ],
  },
  {
    label: "Signals",
    icon: TrendingUp,
    href: "/signals",
    children: [
      { label: "AI Signals", href: "/signals/ai" },
      { label: "News Signals", href: "/signals/news" },
      { label: "Setups", href: "/signals/setups" },
      { label: "Earnings", href: "/signals/earnings" },
      { label: "Gaps", href: "/signals/gaps" },
    ],
  },
  {
    label: "Trading Tools",
    icon: Calculator,
    href: "/trading-tools",
    children: [
      { label: "All Calculators", href: "/trading-tools/calculators" },
      { label: "Trade Journal", href: "/trading-tools/journal" },
      { label: "Position Sizer", href: "/trading-tools/position-sizer" },
      { label: "Risk Manager", href: "/trading-tools/risk" },
    ],
  },
  {
    label: "Learn",
    icon: GraduationCap,
    href: "/learn",
    children: [
      { label: "Trading Academy", href: "/learn/academy" },
      { label: "Course Library", href: "/learn/courses" },
      { label: "Quizzes", href: "/learn/quizzes" },
    ],
  },
  {
    label: "Community",
    icon: Users,
    href: "/community",
    children: [
      { label: "Members", href: "/community/members" },
      { label: "Leaderboard", href: "/community/leaderboard" },
    ],
  },
  {
    label: "Profile",
    icon: User,
    href: "/profile",
    children: null,
  },
  {
    label: "Traders Talk Room",
    icon: MessageSquare,
    href: "/chat",
    children: null,
    badge: 2,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<string[]>(["Claude's Neural Network"])

  const toggle = (label: string) => {
    setExpanded((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )
  }

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/")

  return (
    <aside className="w-[240px] min-h-screen bg-[#0D0D0D] border-r border-[#1A1A1A] flex flex-col font-mono">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-[#1A1A1A]">
        <div className="w-7 h-7 bg-[#FF6600] flex items-center justify-center shrink-0">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-bold tracking-[0.15em] text-white">TRADEDADDY</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          const open = expanded.includes(item.label)
          const hasChildren = item.children && item.children.length > 0

          return (
            <div key={item.label}>
              {/* Main Item */}
              <div
                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors group ${
                  active
                    ? "bg-[#FF6600]/10 border-l-2 border-[#FF6600]"
                    : "border-l-2 border-transparent hover:bg-[#111] hover:border-l-2 hover:border-[#FF6600]/30"
                }`}
                onClick={() => {
                  if (hasChildren) toggle(item.label)
                }}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${active ? "text-[#FF6600]" : "text-[#555] group-hover:text-[#888]"}`}
                />
                <span
                  className={`flex-1 text-[12px] tracking-wide truncate ${active ? "text-white font-bold" : "text-[#888] group-hover:text-[#aaa]"}`}
                >
                  {item.label}
                </span>

                {/* Badge */}
                {item.badge && (
                  <span className="bg-[#FF4444] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                    {item.badge}
                  </span>
                )}

                {/* Chevron */}
                {hasChildren && (
                  <span className={`text-[#444] transition-transform ${open ? "rotate-0" : ""}`}>
                    {open ? (
                      <ChevronDown className="w-3.5 h-3.5 text-[#444]" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-[#444]" />
                    )}
                  </span>
                )}
              </div>

              {/* Sub Items */}
              {hasChildren && open && (
                <div className="bg-[#0A0A0A] border-l border-[#1A1A1A] ml-4">
                  {item.children!.map((child) => {
                    const childActive = pathname === child.href
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`flex items-center gap-2 pl-6 pr-4 py-2 text-[11px] tracking-wide transition-colors ${
                          childActive
                            ? "text-[#FF6600] bg-[#FF6600]/5"
                            : "text-[#555] hover:text-[#888] hover:bg-[#111]"
                        }`}
                      >
                        <span className={`w-1 h-1 rounded-full shrink-0 ${childActive ? "bg-[#FF6600]" : "bg-[#333]"}`} />
                        {child.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Bottom User Card */}
      <div className="border-t border-[#1A1A1A] p-3">
        <Link href="/profile" className="flex items-center gap-2.5 hover:bg-[#111] p-2 transition-colors">
          <div className="w-7 h-7 bg-[#FF6600] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
            MB
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-white font-bold truncate">Mohammed B.</p>
            <p className="text-[10px] text-[#555] truncate">EXECUTION PLAN</p>
          </div>
          <div className="w-2 h-2 bg-[#00D084] rounded-full shrink-0" />
        </Link>
      </div>
    </aside>
  )
}
