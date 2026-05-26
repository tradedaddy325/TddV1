'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ROUTES } from '@/lib/routes'

export default function SideNav() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Dashboard', href: ROUTES.dashboard, icon: '📊' },
    { label: 'Terminal', href: ROUTES.terminal, icon: '📟' },
    { label: 'Trade Journal', href: ROUTES.journal, icon: '📒', isNew: true },
    { label: 'Education', href: ROUTES.education, icon: '📚', isNew: true },
    { label: 'Trade Daddy Chatbot', href: ROUTES.chatbot, icon: '🤖' },
    { label: 'Markets', href: ROUTES.markets, icon: '🌍' },
    { label: 'Analytics', href: ROUTES.analytics, icon: '📈' },
    { label: 'Signals', href: ROUTES.signals, icon: '🎯' },
    { label: 'Risk Manager', href: ROUTES.risk, icon: '🛡' },
    { label: 'Screener', href: ROUTES.screener, icon: '🔍' },
    { label: 'Settings', href: ROUTES.settings, icon: '⚙️' },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <nav
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        padding: '16px 0',
        fontFamily: "'JetBrains Mono', monospace",
        height: '100%',
        overflowY: 'auto',
      }}
    >
      {navItems.map((item) => {
        const active = isActive(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 16px',
              color: active ? '#00ff88' : '#a0a0a0',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: active ? 600 : 400,
              borderLeft: active ? '2px solid #00ff88' : '2px solid transparent',
              background: active ? 'rgba(0,255,136,0.08)' : 'transparent',
              transition: 'all 0.15s',
              position: 'relative',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!active) {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'rgba(255,255,255,0.03)'
                el.style.color = '#c0c0c0'
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'transparent'
                el.style.color = '#a0a0a0'
              }
            }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.isNew && (
              <span
                style={{
                  fontSize: 9,
                  background: 'rgba(0,255,136,0.2)',
                  color: '#00ff88',
                  padding: '2px 6px',
                  borderRadius: 3,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                NEW
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
