'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function NewTraderPopup() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Don't show if dismissed in this session
    const wasDismissed = sessionStorage.getItem('edu-popup-dismissed')
    if (wasDismissed) return

    // Show after 3 seconds
    const timer = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  const dismiss = () => {
    setDismissed(true)
    setVisible(false)
    sessionStorage.setItem('edu-popup-dismissed', '1')
  }

  if (dismissed || !visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
        animation: 'slideInPopup 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      }}
    >
      <style>{`
        @keyframes slideInPopup {
          from { opacity: 0; transform: translateY(20px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .edu-popup-cta:hover {
          background: rgba(0,255,136,0.25) !important;
          transform: translateY(-1px);
        }
      `}</style>

      <div
        style={{
          background: 'linear-gradient(135deg, #0f0f13 0%, #121218 100%)',
          border: '1px solid rgba(0,255,136,0.25)',
          borderRadius: 14,
          padding: '16px 20px',
          width: 280,
          boxShadow:
            '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,255,136,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {/* Close */}
        <button
          onClick={dismiss}
          style={{
            position: 'absolute',
            top: 10,
            right: 12,
            background: 'none',
            border: 'none',
            color: '#444',
            cursor: 'pointer',
            fontSize: 14,
            fontFamily: 'inherit',
          }}
          aria-label="Dismiss"
        >
          ✕
        </button>

        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(0,255,136,0.1)',
            border: '1px solid rgba(0,255,136,0.2)',
            borderRadius: 100,
            padding: '3px 10px',
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 11, color: '#00ff88', fontWeight: 700, letterSpacing: '0.06em' }}>NEW</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 6px #00ff88' }} />
        </div>

        {/* Icon + heading */}
        <div style={{ fontSize: 28, marginBottom: 8 }}>📚</div>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#e0e0e0', lineHeight: 1.3, marginBottom: 8 }}>
          New to trading?<br />
          <span style={{ color: '#00ff88' }}>Learn here.</span>
        </div>
        <div style={{ fontSize: 12, color: '#555', lineHeight: 1.6, marginBottom: 16 }}>
          Master MT5, stop losses, take profits, position sizing & more — built for beginners.
        </div>

        {/* Topics preview */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {['MT5 Basics', 'SL & TP', 'Risk:Reward', 'Candlesticks', 'Psychology'].map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 10,
                color: '#666',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 4,
                padding: '3px 8px',
                letterSpacing: '0.04em',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/education"
          onClick={dismiss}
          className="edu-popup-cta"
          style={{
            display: 'block',
            textAlign: 'center',
            background: 'rgba(0,255,136,0.12)',
            border: '1px solid rgba(0,255,136,0.35)',
            borderRadius: 8,
            color: '#00ff88',
            padding: '10px 0',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textDecoration: 'none',
            transition: 'background 0.15s, transform 0.15s',
          }}
        >
          START LEARNING →
        </Link>
      </div>
    </div>
  )
}
