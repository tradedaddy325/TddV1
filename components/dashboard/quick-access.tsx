'use client'

import Link from 'next/link'
import { QUICK_ACCESS_ITEMS } from '@/lib/routes'

export default function QuickAccess() {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#444',
          letterSpacing: '0.08em',
          marginBottom: 14,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        QUICK ACCESS
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
        {QUICK_ACCESS_ITEMS.map(({ label, icon, href }) => (
          <Link
            key={href}
            href={href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '16px 12px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10,
              textDecoration: 'none',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(0,255,136,0.08)'
              el.style.borderColor = 'rgba(0,255,136,0.2)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(255,255,255,0.02)'
              el.style.borderColor = 'rgba(255,255,255,0.07)'
            }}
          >
            <div style={{ fontSize: 24 }}>{icon}</div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#d0d0d0',
                textAlign: 'center',
                lineHeight: 1.3,
              }}
            >
              {label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
