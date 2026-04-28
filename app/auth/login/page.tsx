"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

function TerminalBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#FF6600 1px, transparent 1px), linear-gradient(90deg, #FF6600 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FF6600]/20 to-transparent"
        style={{ animation: "scanline 6s linear infinite", top: 0 }}
      />
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

const PLANS = [
  { id: "sniper", label: "SNIPER", price: "R199/mo", credits: "300 credits" },
  { id: "execution", label: "EXECUTION", price: "R399/mo", credits: "1,200 credits", popular: true },
  { id: "dominance", label: "DOMINANCE", price: "R499/mo", credits: "4,000 credits" },
]

export default function SignUpPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [selectedPlan, setSelectedPlan] = useState("execution")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530)
    return () => clearInterval(interval)
  }, [])

  function handleStep1(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    setStep(2)
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const supabase = createClient()
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            plan: selectedPlan,
          },
        },
      })
      if (err) {
        setError(err.message)
        setLoading(false)
        return
      }
      // Redirect to dashboard with boot screen
      router.push("/dashboard?boot=1&new=1")
    } catch {
      setError("Connection error. Try again.")
      setLoading(false)
    }
  }

  const passwordStrength = () => {
    if (password.length === 0) return null
    if (password.length < 6) return { label: "WEAK", color: "#FF4444", width: "25%" }
    if (password.length < 10) return { label: "FAIR", color: "#FF6600", width: "55%" }
    if (password.length < 14) return { label: "STRONG", color: "#00D084", width: "80%" }
    return { label: "EXCELLENT", color: "#00D084", width: "100%" }
  }
  const strength = passwordStrength()

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-mono flex flex-col items-center justify-center px-4 py-8">
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

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-4 border border-[#1A1A1A]">
          <div className={`flex-1 py-2 text-center text-[10px] tracking-widest font-bold transition-colors ${step === 1 ? "bg-[#FF6600] text-white" : "bg-[#111] text-[#555]"}`}>
            01_CREDENTIALS
          </div>
          <div className={`flex-1 py-2 text-center text-[10px] tracking-widest font-bold transition-colors ${step === 2 ? "bg-[#FF6600] text-white" : "bg-[#111] text-[#555]"}`}>
            02_SELECT_PLAN
          </div>
        </div>

        {/* Panel */}
        <div className="border border-[#222] bg-[#0D0D0D]">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#111] border-b border-[#222]">
            <div className="flex items-center gap-2">
              <span className="text-[#FF6600] text-[10px]">▶</span>
              <span className="text-[10px] text-[#FF6600] tracking-widest font-bold">
                {step === 1 ? "NEW OPERATOR REGISTRATION" : "ASSIGN ACCESS TIER"}
              </span>
            </div>
            <span className="text-[10px] text-[#333]">STEP {step}/2</span>
          </div>

          <div className="p-6">
            {/* Terminal prompt */}
            <div className="mb-6 font-mono text-xs space-y-1">
              <div className="text-[#333]">{`>`} INIT NEW ACCOUNT</div>
              <div className="text-[#555]">
                {step === 1 ? `> SET CREDENTIALS` : `> SELECT SUBSCRIPTION TIER`}
                <span className={`ml-0.5 ${cursorVisible ? "opacity-100" : "opacity-0"}`}>█</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 border border-[#FF4444]/40 bg-[#FF4444]/5 px-3 py-2.5 flex items-center gap-2">
                <span className="text-[#FF4444] text-[10px]">✕</span>
                <span className="text-[11px] text-[#FF4444]">{error}</span>
              </div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <form onSubmit={handleStep1} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-[#555] tracking-widest mb-1.5">FULL_NAME</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333] text-xs select-none">{`>`}</span>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="Your full name"
                      className="w-full bg-[#0A0A0A] border border-[#222] focus:border-[#FF6600] text-white text-xs pl-7 pr-3 py-2.5 outline-none transition-colors placeholder:text-[#333] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-[#555] tracking-widest mb-1.5">EMAIL_ADDRESS</label>
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

                <div>
                  <label className="block text-[10px] text-[#555] tracking-widest mb-1.5">PASSWORD</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333] text-xs select-none">{`>`}</span>
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      placeholder="Min. 8 characters"
                      className="w-full bg-[#0A0A0A] border border-[#222] focus:border-[#FF6600] text-white text-xs pl-7 pr-10 py-2.5 outline-none transition-colors placeholder:text-[#333] font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888] text-[10px] tracking-wider"
                    >
                      {showPass ? "HIDE" : "SHOW"}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {strength && (
                    <div className="mt-1.5">
                      <div className="h-0.5 bg-[#1A1A1A] w-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-300"
                          style={{ width: strength.width, backgroundColor: strength.color }}
                        />
                      </div>
                      <span className="text-[9px] tracking-widest mt-0.5 block" style={{ color: strength.color }}>
                        {strength.label}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] text-[#555] tracking-widest mb-1.5">CONFIRM_PASSWORD</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333] text-xs select-none">{`>`}</span>
                    <input
                      type={showPass ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Repeat password"
                      className={`w-full bg-[#0A0A0A] border focus:border-[#FF6600] text-white text-xs pl-7 pr-3 py-2.5 outline-none transition-colors placeholder:text-[#333] font-mono ${
                        confirmPassword && confirmPassword !== password
                          ? "border-[#FF4444]"
                          : confirmPassword && confirmPassword === password
                          ? "border-[#00D084]"
                          : "border-[#222]"
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FF6600] hover:bg-[#FF7722] text-white text-xs font-bold py-3 tracking-widest transition-colors mt-2"
                >
                  NEXT: SELECT PLAN →
                </button>
              </form>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <form onSubmit={handleSignUp} className="space-y-3">
                {PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full border p-3 text-left transition-all ${
                      selectedPlan === plan.id
                        ? "border-[#FF6600] bg-[#FF6600]/5"
                        : "border-[#1A1A1A] hover:border-[#333] bg-[#0A0A0A]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 border flex items-center justify-center ${selectedPlan === plan.id ? "border-[#FF6600]" : "border-[#333]"}`}>
                          {selectedPlan === plan.id && (
                            <div className="w-1.5 h-1.5 bg-[#FF6600]" />
                          )}
                        </div>
                        <span className={`text-xs font-bold tracking-wider ${selectedPlan === plan.id ? "text-white" : "text-[#555]"}`}>
                          {plan.label}
                        </span>
                        {plan.popular && (
                          <span className="text-[8px] bg-[#FF6600] text-white px-1.5 py-0.5 tracking-widest">POPULAR</span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-bold ${selectedPlan === plan.id ? "text-[#FF6600]" : "text-[#444]"}`}>{plan.price}</div>
                        <div className="text-[9px] text-[#333]">{plan.credits}</div>
                      </div>
                    </div>
                  </button>
                ))}

                <div className="border border-[#1A1A1A] bg-[#0A0A0A] p-2.5 text-[10px] text-[#555] text-center">
                  14-DAY FREE TRIAL · NO CARD REQUIRED
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FF6600] hover:bg-[#FF7722] disabled:bg-[#FF6600]/40 disabled:cursor-not-allowed text-white text-xs font-bold py-3 tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                      CREATING ACCOUNT...
                    </>
                  ) : (
                    "ACTIVATE TERMINAL →"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-[10px] text-[#444] hover:text-[#888] py-1 tracking-widest transition-colors"
                >
                  ← BACK
                </button>
              </form>
            )}

            <div className="flex items-center gap-3 mt-5 mb-4">
              <div className="flex-1 border-t border-[#1A1A1A]" />
              <span className="text-[10px] text-[#333] tracking-widest">OR</span>
              <div className="flex-1 border-t border-[#1A1A1A]" />
            </div>

            <p className="text-center text-[11px] text-[#555]">
              Already have access?{" "}
              <Link href="/auth/login" className="text-[#FF6600] hover:text-[#FF7722] transition-colors tracking-wide">
                LOGIN →
              </Link>
            </p>
          </div>
        </div>

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
