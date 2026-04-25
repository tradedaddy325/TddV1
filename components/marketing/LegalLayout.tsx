import Link from "next/link"
import React from "react"

export function LegalLayout({
  title,
  activeTab,
  children,
}: {
  title: string
  activeTab: string
  children: React.ReactNode
}) {
  const tabs = [
    { href: "/legal/terms", label: "Terms of Service" },
    { href: "/legal/privacy", label: "Privacy Policy" },
    { href: "/legal/risk", label: "Risk Disclosure" },
    { href: "/legal/disclaimer", label: "Signal Disclaimer" },
    { href: "/legal/legal", label: "Legal" },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-mono">
      <header className="border-b border-[#222] bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-7 h-7 bg-[#FF6600] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M16 7h6v6" />
                  <path d="m22 7-8.5 8.5-5-5L2 17" />
                </svg>
              </div>
              <span className="text-sm font-bold tracking-[0.2em] text-white">TRADEDADDY</span>
              <span className="text-[10px] text-[#FF6600] border border-[#FF6600]/40 px-1.5 py-0.5 tracking-wider">TERMINAL</span>
            </Link>
            <Link href="/" className="text-xs text-[#555] hover:text-white transition-colors">← BACK TO HOME</Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[11px] text-[#555] mb-3">
            <span className="text-[#FF6600]">▶</span>
            <span>LEGAL DOCUMENTS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-[11px] text-[#555] mt-1">Last updated: January 2026 · Jurisdiction: South Africa</p>
        </div>

        {/* Tab nav */}
        <div className="flex flex-wrap gap-0 border border-[#1A1A1A] mb-8 overflow-hidden">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-3 py-2 text-[10px] tracking-wider border-r border-[#1A1A1A] last:border-r-0 transition-colors ${
                activeTab === tab.href
                  ? "bg-[#FF6600] text-white"
                  : "text-[#555] hover:text-[#888] bg-[#0D0D0D]"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="prose prose-sm max-w-none space-y-6 text-[#888] text-[12px] leading-relaxed">
          {children}
        </div>
      </main>

      <footer className="border-t border-[#1A1A1A] mt-16 py-8 bg-[#0A0A0A]">
        <p className="text-center text-[11px] text-[#333]">© TradeDaddy 2026. All Rights Reserved. Jurisdiction: South Africa</p>
      </footer>
    </div>
  )
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-sm font-bold text-white mb-3 tracking-wide border-l-2 border-[#FF6600] pl-3">{title}</h2>
      <div className="space-y-3 pl-3">{children}</div>
    </section>
  )
}

export function Para({ children }: { children: React.ReactNode }) {
  return <p className="text-[#777] text-[12px] leading-relaxed">{children}</p>
}
