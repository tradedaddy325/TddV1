"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"

const BOOT_LINES = [
  { text: "TRADEDADDY TERMINAL v2.4.1", delay: 0, color: "#FF6600" },
  { text: "© 2026 TRADEDADDY (PTY) LTD · SOUTH AFRICA", delay: 80, color: "#333" },
  { text: "", delay: 120 },
  { text: "[ SYS ] Initializing kernel modules...", delay: 200, color: "#555" },
  { text: "[ SYS ] Memory allocation: 512MB", delay: 320, color: "#555" },
  { text: "[ OK  ] System clock synchronized", delay: 440, color: "#00D084" },
  { text: "", delay: 500 },
  { text: "[ NET ] Establishing secure connection...", delay: 600, color: "#555" },
  { text: "[ OK  ] TLS 1.3 handshake complete", delay: 760, color: "#00D084" },
  { text: "[ OK  ] Market data feed connected", delay: 900, color: "#00D084" },
  { text: "[ OK  ] Supabase auth verified", delay: 1040, color: "#00D084" },
  { text: "", delay: 1100 },
  { text: "[ DAT ] Loading market instruments...", delay: 1200, color: "#555" },
  { text: "[ OK  ] XAUUSD · EURUSD · GBPUSD · USDJPY", delay: 1340, color: "#00D084" },
  { text: "[ OK  ] NAS100 · US500 · BTCUSD · WTI", delay: 1460, color: "#00D084" },
  { text: "", delay: 1520 },
  { text: "[ AI  ] Claude Neural Network warming up...", delay: 1620, color: "#555" },
  { text: "[ OK  ] AI signal engine ready", delay: 1800, color: "#00D084" },
  { text: "[ OK  ] Daily intelligence loaded", delay: 1920, color: "#00D084" },
  { text: "", delay: 1980 },
  { text: "[ USR ] Session authenticated", delay: 2080, color: "#00D084" },
  { text: "[ OK  ] Permissions granted: FULL ACCESS", delay: 2200, color: "#FF6600" },
  { text: "", delay: 2260 },
  { text: "TERMINAL READY. WELCOME, OPERATOR.", delay: 2400, color: "#FF6600" },
]

const TOTAL_DURATION = 3200 // ms until redirect

export default function BootScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const shouldBoot = searchParams.get("boot") === "1"
  const isNew = searchParams.get("new") === "1"

  const [visible, setVisible] = useState(false)
  const [visibleLines, setVisibleLines] = useState<number[]>([])
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!shouldBoot) return
    setVisible(true)

    // Schedule each line to appear
    const timeouts: ReturnType<typeof setTimeout>[] = []

    BOOT_LINES.forEach((line, i) => {
      timeouts.push(
        setTimeout(() => {
          setVisibleLines((prev) => [...prev, i])
          // Auto-scroll
          if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
          }
        }, line.delay)
      )
    })

    // Progress bar
    const startTime = Date.now()
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const pct = Math.min(100, (elapsed / TOTAL_DURATION) * 100)
      setProgress(pct)
      if (pct >= 100) clearInterval(progressInterval)
    }, 30)

    // Done state
    timeouts.push(
      setTimeout(() => {
        setDone(true)
      }, TOTAL_DURATION - 400)
    )

    // Fade out and redirect
    timeouts.push(
      setTimeout(() => {
        setFadeOut(true)
      }, TOTAL_DURATION - 200)
    )

    timeouts.push(
      setTimeout(() => {
        setVisible(false)
        // Remove boot param from URL cleanly
        const url = isNew ? "/dashboard?welcome=1" : "/dashboard"
        router.replace(url)
      }, TOTAL_DURATION + 300)
    )

    return () => timeouts.forEach(clearTimeout)
  }, [shouldBoot, router, isNew])

  if (!visible || !shouldBoot) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#0A0A0A] font-mono flex flex-col transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}
    >
      {/* Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
        }}
      />

      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#1A1A1A] bg-[#0D0D0D] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[#FF6600] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M16 7h6v6" />
              <path d="m22 7-8.5 8.5-5-5L2 17" />
            </svg>
          </div>
          <span className="text-xs font-bold tracking-[0.3em] text-white">TRADEDADDY</span>
          <span className="text-[9px] text-[#FF6600] border border-[#FF6600]/40 px-1.5 py-0.5 tracking-wider">TERMINAL</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-[#333]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6600] animate-pulse" />
          BOOTING SYSTEM
        </div>
      </div>

      {/* Terminal output */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-0.5"
        style={{ scrollbarWidth: "none" }}
      >
        {BOOT_LINES.map((line, i) => (
          <div
            key={i}
            className={`text-xs leading-5 transition-opacity duration-100 ${visibleLines.includes(i) ? "opacity-100" : "opacity-0"}`}
            style={{ color: line.color || "#555", minHeight: "20px" }}
          >
            {line.text}
          </div>
        ))}

        {/* Blinking cursor at end */}
        {visibleLines.length > 0 && !done && (
          <div className="text-xs text-[#555] flex items-center gap-0">
            <span className="animate-pulse">█</span>
          </div>
        )}

        {done && (
          <div className="mt-4 text-xs text-[#FF6600] animate-pulse">
            █ LAUNCHING DASHBOARD...
          </div>
        )}
      </div>

      {/* Progress bar footer */}
      <div className="shrink-0 border-t border-[#1A1A1A] bg-[#0D0D0D] px-6 py-4">
        <div className="flex items-center justify-between text-[10px] text-[#555] mb-2">
          <span>SYSTEM INITIALIZATION</span>
          <span className="text-[#FF6600] font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-[#1A1A1A] w-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FF6600] to-[#FF8833] transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-[9px] text-[#2A2A2A]">
          <span>TRADEDADDY TERMINAL</span>
          <span>ZAF · {new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
        </div>
      </div>
    </div>
  )
}
