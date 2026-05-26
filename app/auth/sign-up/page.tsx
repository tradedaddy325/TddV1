"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard",      label: "Dashboard",           icon: "⚡" },
  { href: "/dashboard/terminal", label: "Terminal",        icon: "📟" },
  { href: "/journal",        label: "Trade Journal",       icon: "📒", badge: "NEW" },
  { href: "/education",      label: "Education Suite",     icon: "📚", badge: "NEW" },
  { href: "/dashboard/chatbot",  label: "Trade Daddy Chatbot", icon: "🤖" },
  { href: "/dashboard/markets",  label: "Markets",         icon: "📈" },
  { href: "/dashboard/analytics","label": "Analytics",     icon: "📊" },
  { href: "/dashboard/signals",  label: "Signals",         icon: "🎯" },
  { href: "/dashboard/risk",     label: "Risk Manager",    icon: "🛡" },
  { href: "/dashboard/screener", label: "Screener",        icon: "🔍" },
  { href: "/dashboard/settings", label: "Settings",        icon: "⚙️" },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        width: 220,
        background: "#0a0a0d",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'JetBrains Mono', monospace",
        height: "100vh",
        position: "sticky",
        top: 0,
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ fontSize: 16, fontWeight: 800 }}>
          <span style={{ color: "#00ff88" }}>TRADE</span>
          <span style={{ color: "#e0e0e0" }}> DADDY</span>
        </div>
        <div style={{ fontSize: 9, color: "#333", letterSpacing: "0.1em", marginTop: 2 }}>TRADING PLATFORM</div>
      </div>

      {/* Nav items */}
      <div style={{ padding: "12px 8px", flex: 1 }}>
        {NAV_ITEMS.map(({ href, label, icon, badge }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 10px",
                borderRadius: 8,
                marginBottom: 2,
                textDecoration: "none",
                background: isActive ? "rgba(0,255,136,0.08)" : "transparent",
                border: `1px solid ${isActive ? "rgba(0,255,136,0.2)" : "transparent"}`,
                transition: "all 0.1s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.03)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              }}
            >
              <span style={{ fontSize: 14, minWidth: 18, textAlign: "center" }}>{icon}</span>
              <span style={{
                fontSize: 11,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#00ff88" : "#666",
                letterSpacing: "0.03em",
                flex: 1,
              }}>
                {label}
              </span>
              {badge && (
                <span style={{
                  fontSize: 8,
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  color: "#00ff88",
                  background: "rgba(0,255,136,0.12)",
                  border: "1px solid rgba(0,255,136,0.25)",
                  borderRadius: 4,
                  padding: "1px 5px",
                }}>
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}