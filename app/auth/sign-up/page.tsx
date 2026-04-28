"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

// Animated scanline background
function TerminalBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#FF6600 1px, transparent 1px), linear-gradient(90deg, #FF6600 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Scanline sweep */}
      <div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FF6600]/20 to-transparent"
        style={{ animation: "scanline 6s linear infinite", top: 0 }}
      />
      {/* Corner brackets */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[#FF6600]/20" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[#FF6600]/20" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#FF6600]/20" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-[#FF6600]/20" />
      <style>{`
        @keyframes scanline {
          0% { top: -2px; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { top: 100vh; opacity: 0; }
        }
      `}</style>
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530)
    return () => clearInterval(interval)
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const supabase = createClient()
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) {
        setError(err.message)
        setLoading(false)
        return
      }
      // Redirect to dashboard — BootScreen will show there
      router.push("/dashboard?boot=1")
    } catch {
      setError("Connection error. Try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-mono flex flex-col items-center justify-center px-4">
      <TerminalBg />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-[#FF6600] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M16 7h6v6" />
                <path d="m22 7-8.5 8.5-5-5L2 17" />
              </svg>
            </div>
            <div>
              <div className="text-lg font-bold tracking-[0.3em]">TRADEDADDY</div>
              <div className="text-[10px] text-[#FF6600] tracking-[0.4em]">TERMINAL</div>
            </div>
          </Link>
        </div>

        {/* Panel */}
        <div className="border border-[#222] bg-[#0D0D0D]">
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#111] border-b border-[#222]">
            <div className="flex items-center gap-2">
              <span className="text-[#FF6600] text-[10px]">▶</span>
              <span className="text-[10px] text-[#FF6600] tracking-widest font-bold">OPERATOR LOGIN</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1A1A1A] border border-[#333]" />
              <span className="w-2 h-2 rounded-full bg-[#1A1A1A] border border-[#333]" />
              <span className="w-2 h-2 rounded-full bg-[#FF6600]/60" />
            </div>
          </div>

          <div className="p-6">
            {/* Terminal prompt header */}
            <div className="mb-6 font-mono text-xs space-y-1">
              <div className="text-[#333]">
                {`>`} TRADEDADDY TERMINAL v2.4.1
              </div>
              <div className="text-[#333]">
                {`>`} AUTH MODULE ACTIVE
              </div>
              <div className="text-[#555]">
                {`>`} ENTER CREDENTIALS TO PROCEED
                <span className={`ml-0.5 ${cursorVisible ? "opacity-100" : "opacity-0"}`}>█</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 border border-[#FF4444]/40 bg-[#FF4444]/5 px-3 py-2.5 flex items-center gap-2">
                <span className="text-[#FF4444] text-[10px]">✕</span>
                <span className="text-[11px] text-[#FF4444]">{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email field */}
              <div>
                <label className="block text-[10px] text-[#555] tracking-widest mb-1.5">
                  EMAIL_ADDRESS
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333] text-xs select-none">{`>`}</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="operator@domain.com"
                    className="w-full bg-[#0A0A0A] border border-[#222] focus:border-[#FF6600] text-white text-xs pl-7 pr-3 py-2.5 outline-none transition-colors placeholder:text-[#333] font-mono"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-[10px] text-[#555] tracking-widest mb-1.5">
                  PASSWORD
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333] text-xs select-none">{`>`}</span>
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    className="w-full bg-[#0A0A0A] border border-[#222] focus:border-[#FF6600] text-white text-xs pl-7 pr-10 py-2.5 outline-none transition-colors placeholder:text-[#333] font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888] transition-colors text-[10px] tracking-wider"
                  >
                    {showPass ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF6600] hover:bg-[#FF7722] disabled:bg-[#FF6600]/40 disabled:cursor-not-allowed text-white text-xs font-bold py-3 tracking-widest transition-colors flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                    AUTHENTICATING...
                  </>
                ) : (
                  "ACCESS TERMINAL →"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 border-t border-[#1A1A1A]" />
              <span className="text-[10px] text-[#333] tracking-widest">OR</span>
              <div className="flex-1 border-t border-[#1A1A1A]" />
            </div>

            {/* Sign up link */}
            <p className="text-center text-[11px] text-[#555]">
              No account?{" "}
              <Link href="/auth/sign-up" className="text-[#FF6600] hover:text-[#FF7722] transition-colors tracking-wide">
                REGISTER ACCESS →
              </Link>
            </p>

            <div className="mt-4 text-center">
              <Link href="/auth/forgot-password" className="text-[10px] text-[#333] hover:text-[#555] transition-colors tracking-wider">
                FORGOT PASSWORD
              </Link>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-[#333]">
          <span>256-BIT ENCRYPTED</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D084] animate-pulse" />
            SECURE CONNECTION
          </span>
        </div>

        <p className="text-center text-[10px] text-[#2A2A2A] mt-6">
          <Link href="/" className="hover:text-[#444] transition-colors">← BACK TO TRADEDADDY.CO.ZA</Link>
        </p>
      </div>
    </div>
  )
}
