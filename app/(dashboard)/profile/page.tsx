// app/profile/page.tsx
"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const PLANS = [
  {
    name: "SNIPER", priceRands: 199, credits: 300, badge: null, highlight: false, cta: "GET STARTED",
    features: ["300 Credits/month", "Basic Signals", "Limited Market Data", "Basic AI Access", "Trade Journal"],
  },
  {
    name: "EXECUTION", priceRands: 399, credits: 1200, badge: "MOST POPULAR", highlight: true, cta: "START WINNING",
    features: ["1,200 Credits/month", "Advanced Signals", "Full Market Data", "Advanced AI Access", "Daily Intelligence"],
  },
  {
    name: "DOMINANCE", priceRands: 499, credits: 4000, badge: "PREMIUM", highlight: false, cta: "GO DOMINANT",
    features: ["4,000 Credits/month", "Priority Signals", "Full + Priority Data", "Priority AI + Neural Net", "VIP Community"],
  },
]

// 1 credit = R1
const CREDIT_PACKS = [
  { label: "100 Credits",  credits: 100,  priceRands: 100 },
  { label: "250 Credits",  credits: 250,  priceRands: 250 },
  { label: "500 Credits",  credits: 500,  priceRands: 500 },
]

const VALID_COUPONS: Record<string, { credits: number; label: string }> = {
  "TRADEDAD50": { credits: 50,  label: "50 bonus credits" },
  "WELCOME100": { credits: 100, label: "100 welcome credits" },
  "PREMIUM200": { credits: 200, label: "200 premium credits" },
}

function ProfileInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(searchParams?.get("tab") || "overview")
  const [coupon, setCoupon] = useState("")
  const [couponMsg, setCouponMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [payLoading, setPayLoading] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const user = {
    name: "Mohammed B.", email: "mohammed.bhorat@icloud.com",
    plan: "EXECUTION", credits: 847, totalCredits: 1200,
    joined: "March 2026", avatar: "MB", nextRenewal: "May 1, 2026",
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUserId(data.user.id)
    })
  }, [])

  useEffect(() => {
    setActiveTab(searchParams?.get("tab") || "overview")
  }, [searchParams])

  const setTab = (tab: string) => {
    router.push(`/profile?tab=${tab}`, { scroll: false })
    setActiveTab(tab)
  }

  const initiateYocoCheckout = async (
    priceRands: number,
    description: string,
    metadata: Record<string, string | number>
  ) => {
    setPayLoading(description)
    try {
      const res = await fetch("/api/payments/yoco/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountInCents: priceRands * 100,
          currency: "ZAR",
          description,
          metadata: { ...metadata, userId: userId || "anonymous" },
          successUrl: `${window.location.origin}/payment/success?type=${metadata.type}&plan=${metadata.plan || ""}`,
          cancelUrl: `${window.location.origin}/profile?tab=${activeTab}&cancelled=true`,
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || "Checkout failed")
      if (data.redirectUrl) {
        window.open(data.redirectUrl, "_blank", "noopener,noreferrer")
      } else {
        throw new Error("No redirect URL from Yoco")
      }
    } catch (err: any) {
      alert(`Payment error: ${err.message}`)
    } finally {
      setPayLoading(null)
    }
  }

  const handleSubscribe = (plan: typeof PLANS[0]) =>
    initiateYocoCheckout(plan.priceRands, `TradeDaddy ${plan.name} Plan – Monthly`, {
      type: "subscription", plan: plan.name, credits: plan.credits,
    })

  const handleBuyCredits = (pack: typeof CREDIT_PACKS[0]) =>
    initiateYocoCheckout(pack.priceRands, `TradeDaddy ${pack.label}`, {
      type: "credits", credits: pack.credits, plan: "",
    })

  const handleApplyCoupon = async () => {
    const code = coupon.trim().toUpperCase()
    if (!code) { setCouponMsg({ text: "Please enter a coupon code.", ok: false }); return }
    setCouponLoading(true); setCouponMsg(null)
    await new Promise((r) => setTimeout(r, 700))
    if (VALID_COUPONS[code]) {
      setCouponMsg({ text: `✓ Code applied! ${VALID_COUPONS[code].label} added to your account.`, ok: true })
      setCoupon("")
    } else {
      setCouponMsg({ text: "Invalid or expired code. Please try again.", ok: false })
    }
    setCouponLoading(false)
  }

  const creditPct = Math.round((user.credits / user.totalCredits) * 100)

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-3 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between border border-[#1A1A1A] bg-[#0D0D0D] px-4 sm:px-5 py-3 sm:py-4">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#FF6600] flex items-center justify-center text-xs sm:text-sm font-bold text-white shrink-0">
              {user.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] sm:text-[11px] text-[#444] font-mono truncate">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[9px] sm:text-[10px] text-[#FF6600] border border-[#FF6600]/30 px-2 py-1 font-mono tracking-widest">
              {user.plan}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border border-[#1A1A1A] bg-[#0D0D0D] overflow-x-auto scrollbar-hide">
          {["overview", "subscription", "credits", "security"].map((tab) => (
            <button key={tab} onClick={() => setTab(tab)}
              className={`flex-1 py-2.5 sm:py-3 text-[10px] sm:text-[11px] tracking-widest font-mono whitespace-nowrap transition-colors border-b-2 min-w-[72px] ${
                activeTab === tab
                  ? "border-[#FF6600] text-white bg-[#FF6600]/5"
                  : "border-transparent text-[#444] hover:text-[#777]"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

            {/* Credits */}
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="text-[9px] sm:text-[10px] text-[#FF6600] tracking-widest font-mono">AI CREDITS</span>
                <span className="text-[9px] sm:text-[10px] text-[#333] font-mono">RESETS MONTHLY</span>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl sm:text-4xl font-bold">{user.credits.toLocaleString()}</span>
                <span className="text-[#444] text-xs sm:text-sm font-mono">/ {user.totalCredits.toLocaleString()}</span>
              </div>
              <div className="h-1.5 bg-[#1A1A1A] overflow-hidden mb-2">
                <div className="h-full bg-[#FF6600] transition-all" style={{ width: `${creditPct}%` }} />
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#444] font-mono">{creditPct}% remaining this cycle</p>
            </div>

            {/* Plan */}
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="text-[9px] sm:text-[10px] text-[#FF6600] tracking-widest font-mono">ACTIVE PLAN</span>
                <span className="text-[9px] sm:text-[10px] text-[#FF6600] font-mono">● ACTIVE</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-1">{user.plan}</h3>
              <p className="text-[#444] text-xs font-mono mb-3 sm:mb-4">R399/mo · Renews {user.nextRenewal}</p>
              <div className="space-y-1.5">
                {["Advanced Signals", "Full Market Data", "Advanced AI", "Daily Intelligence"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-[10px] sm:text-[11px]">
                    <span className="text-[#FF6600] text-[8px] sm:text-[9px]">▶</span>
                    <span className="text-[#666]">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity */}
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-4 sm:p-5">
              <span className="text-[9px] sm:text-[10px] text-[#FF6600] tracking-widest font-mono block mb-3 sm:mb-4">THIS MONTH</span>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[
                  { val: "47", label: "SIGNALS VIEWED" },
                  { val: "12", label: "TRADES LOGGED" },
                  { val: "8",  label: "LESSONS DONE" },
                  { val: "353", label: "CREDITS USED" },
                ].map((s) => (
                  <div key={s.label} className="bg-[#111] border border-[#1A1A1A] p-2.5 sm:p-3">
                    <div className="text-lg sm:text-xl font-bold text-[#FF6600]">{s.val}</div>
                    <div className="text-[9px] sm:text-[10px] text-[#333] mt-0.5 tracking-wider font-mono">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon */}
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-4 sm:p-5">
              <span className="text-[9px] sm:text-[10px] text-[#FF6600] tracking-widest font-mono block mb-2 sm:mb-3">
                REDEEM CREDIT CODE
              </span>
              <p className="text-[10px] sm:text-[11px] text-[#444] mb-3 sm:mb-4">
                Have a coupon? Enter it below to add bonus credits.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponMsg(null) }}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  placeholder="E.G. TRADEDAD50"
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={20}
                  className="flex-1 min-w-0 bg-[#111] border border-[#222] hover:border-[#333] focus:border-[#FF6600] text-white text-[11px] sm:text-xs px-3 py-2.5 placeholder-[#2A2A2A] focus:outline-none font-mono tracking-widest transition-colors"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !coupon.trim()}
                  className="bg-[#FF6600] hover:bg-[#FF7722] disabled:bg-[#2A1500] disabled:text-[#3A2000] text-white text-[11px] sm:text-xs px-3 sm:px-4 py-2.5 font-bold tracking-wider transition-colors min-w-[70px] sm:min-w-[80px] font-mono shrink-0"
                >
                  {couponLoading ? "..." : "APPLY"}
                </button>
              </div>
              {couponMsg && (
                <p className={`text-[10px] sm:text-[11px] mt-2.5 font-mono ${couponMsg.ok ? "text-[#FF6600]" : "text-[#FF4444]"}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── SUBSCRIPTION ── */}
        {activeTab === "subscription" && (
          <div className="space-y-3 sm:space-y-4">
            {searchParams?.get("cancelled") === "true" && (
              <div className="border border-[#FF8C00]/30 bg-[#FF8C00]/5 px-3 sm:px-4 py-2.5 sm:py-3">
                <p className="text-[10px] sm:text-[11px] text-[#FF8C00] font-mono">Payment was cancelled. You have not been charged.</p>
              </div>
            )}

            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-4 sm:p-5">
              <span className="text-[9px] sm:text-[10px] text-[#FF6600] tracking-widest font-mono block mb-4 sm:mb-6">CHOOSE YOUR PLAN</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {PLANS.map((plan) => {
                  const isCurrent = plan.name === user.plan
                  const isLoading = payLoading === `TradeDaddy ${plan.name} Plan – Monthly`
                  return (
                    <div key={plan.name} className={`border relative p-4 sm:p-5 transition-colors ${isCurrent ? "border-[#FF6600]" : "border-[#1A1A1A] hover:border-[#252525]"}`}>
                      {(plan.badge || isCurrent) && (
                        <div className={`text-[8px] sm:text-[9px] px-2 py-0.5 tracking-widest inline-block mb-2 sm:mb-3 font-mono ${
                          isCurrent ? "bg-[#FF6600] text-white" : "bg-[#FF6600]/10 text-[#FF6600] border border-[#FF6600]/20"
                        }`}>
                          {isCurrent ? "CURRENT PLAN" : plan.badge}
                        </div>
                      )}
                      <h3 className="text-xs sm:text-sm font-bold text-[#666] tracking-wider font-mono mb-1">{plan.name}</h3>
                      <div className="text-2xl sm:text-3xl font-bold mb-1">
                        R{plan.priceRands}<span className="text-[#333] text-xs sm:text-sm font-normal font-mono">/mo</span>
                      </div>
                      <p className="text-[9px] sm:text-[10px] text-[#333] font-mono mb-3 sm:mb-4">{plan.credits.toLocaleString()} credits</p>
                      <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-5">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-[#555]">
                            <span className="text-[#FF6600] text-[8px] sm:text-[9px]">▶</span>{f}
                          </li>
                        ))}
                      </ul>
                      {isCurrent ? (
                        <div className="w-full border border-[#FF6600]/30 text-[#FF6600] text-[10px] sm:text-[11px] py-2 sm:py-2.5 font-mono tracking-widest text-center">
                          ● ACTIVE
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSubscribe(plan)}
                          disabled={isLoading || payLoading !== null}
                          className={`w-full text-[10px] sm:text-[11px] py-2 sm:py-2.5 font-bold tracking-widest font-mono transition-colors disabled:opacity-50 ${
                            plan.highlight
                              ? "bg-[#FF6600] hover:bg-[#FF7722] text-white"
                              : "border border-[#252525] hover:border-[#FF6600]/40 text-[#666] hover:text-[#FF6600]"
                          }`}
                        >
                          {isLoading ? "OPENING..." : plan.cta + " →"}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {user.plan !== "DOMINANCE" && (
              <div className="border border-[#FF6600]/20 bg-[#FF6600]/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#FF6600] tracking-wider mb-1 font-mono">UPGRADE TO DOMINANCE — R499/mo</p>
                  <p className="text-[10px] sm:text-[11px] text-[#555]">4,000 credits, Priority AI Neural Network, and VIP community access.</p>
                </div>
                <button
                  onClick={() => handleSubscribe(PLANS[2])}
                  disabled={payLoading !== null}
                  className="bg-[#FF6600] hover:bg-[#FF7722] text-white text-xs font-bold px-5 sm:px-6 py-2.5 sm:py-3 tracking-widest font-mono shrink-0 transition-colors disabled:opacity-50 w-full sm:w-auto"
                >
                  {payLoading ? "OPENING..." : "UPGRADE NOW →"}
                </button>
              </div>
            )}
            <p className="text-[9px] sm:text-[10px] text-[#2A2A2A] font-mono text-center">
              Payments processed via Yoco. Checkout opens in a new tab. All amounts in ZAR.
            </p>
          </div>
        )}

        {/* ── CREDITS ── */}
        {activeTab === "credits" && (
          <div className="space-y-3 sm:space-y-4">
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-4 sm:p-5">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-[9px] sm:text-[10px] text-[#FF6600] tracking-widest font-mono">BUY ADDITIONAL CREDITS</span>
                <span className="text-[9px] sm:text-[10px] text-[#333] font-mono">1 CREDIT = R1</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#444] font-mono mb-4 sm:mb-5">
                Credits power AI features — signals, analysis, Neural Network, Daily Intelligence. They never expire.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                {CREDIT_PACKS.map((pack) => {
                  const isLoading = payLoading === `TradeDaddy ${pack.label}`
                  return (
                    <div key={pack.label} className="border border-[#1A1A1A] hover:border-[#252525] p-4 sm:p-5 transition-colors">
                      <div className="text-2xl sm:text-3xl font-bold text-[#FF6600] mb-0.5 sm:mb-1">{pack.credits}</div>
                      <div className="text-[10px] sm:text-[11px] text-[#444] font-mono mb-0.5 sm:mb-1">Credits</div>
                      <div className="text-xl sm:text-2xl font-bold mb-0.5 sm:mb-1">R{pack.priceRands}</div>
                      <div className="text-[9px] sm:text-[10px] text-[#333] font-mono mb-4 sm:mb-5">R1 per credit</div>
                      <button
                        onClick={() => handleBuyCredits(pack)}
                        disabled={isLoading || payLoading !== null}
                        className="w-full border border-[#222] hover:border-[#FF6600]/40 text-[#666] hover:text-[#FF6600] text-[10px] sm:text-[11px] py-2 sm:py-2.5 font-mono tracking-widest transition-colors disabled:opacity-50 font-bold"
                      >
                        {isLoading ? "OPENING..." : "BUY NOW →"}
                      </button>
                    </div>
                  )
                })}
              </div>
              <p className="text-[9px] sm:text-[10px] text-[#2A2A2A] font-mono">
                Opens Yoco checkout in a new tab. Credits added automatically after payment.
              </p>
            </div>

            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-4 sm:p-5">
              <span className="text-[9px] sm:text-[10px] text-[#FF6600] tracking-widest font-mono block mb-3 sm:mb-4">CREDIT HISTORY</span>
              <div className="divide-y divide-[#1A1A1A]">
                {[
                  { date: "Apr 20", desc: "AI Signal Analysis — XAUUSD", amt: -12 },
                  { date: "Apr 19", desc: "Daily Intelligence Briefing",  amt: -8 },
                  { date: "Apr 18", desc: "Neural Network Scan",          amt: -25 },
                  { date: "Apr 1",  desc: "Monthly Renewal — EXECUTION",  amt: +1200 },
                  { date: "Mar 28", desc: "Coupon: TRADEDAD50",           amt: +50 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 sm:py-3 text-xs font-mono">
                    <span className="text-[#333] w-10 sm:w-12 shrink-0">{item.date}</span>
                    <span className="text-[#555] flex-1 px-2 sm:px-3 text-[10px] sm:text-xs truncate">{item.desc}</span>
                    <span className={`font-bold text-[10px] sm:text-xs shrink-0 ${item.amt > 0 ? "text-[#FF6600]" : "text-[#FF4444]"}`}>
                      {item.amt > 0 ? "+" : ""}{item.amt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SECURITY ── */}
        {activeTab === "security" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-4 sm:p-5">
              <span className="text-[9px] sm:text-[10px] text-[#FF6600] tracking-widest font-mono block mb-3 sm:mb-4">ACCOUNT DETAILS</span>
              <div className="space-y-2.5 sm:space-y-3">
                {[
                  { label: "NAME",   value: user.name },
                  { label: "EMAIL",  value: user.email },
                  { label: "PLAN",   value: `${user.plan} — R399/mo` },
                  { label: "JOINED", value: user.joined },
                  { label: "RENEWS", value: user.nextRenewal },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-xs border-b border-[#1A1A1A] pb-2 sm:pb-2.5 font-mono">
                    <span className="text-[#333] tracking-wider text-[9px] sm:text-[10px]">{item.label}</span>
                    <span className="text-[#666] text-[10px] sm:text-xs truncate ml-2 max-w-[60%] text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-4 sm:p-5">
              <span className="text-[9px] sm:text-[10px] text-[#FF6600] tracking-widest font-mono block mb-3 sm:mb-4">CHANGE PASSWORD</span>
              <div className="space-y-2.5 sm:space-y-3">
                {["CURRENT PASSWORD", "NEW PASSWORD", "CONFIRM PASSWORD"].map((l) => (
                  <input key={l} type="password" placeholder={l}
                    className="w-full bg-[#111] border border-[#1A1A1A] hover:border-[#222] focus:border-[#FF6600] text-white text-[11px] sm:text-xs px-3 py-2.5 placeholder-[#2A2A2A] focus:outline-none font-mono tracking-widest transition-colors"
                  />
                ))}
                <button className="w-full bg-[#FF6600] hover:bg-[#FF7722] text-white text-[11px] sm:text-xs font-bold py-2.5 tracking-widest font-mono transition-colors">
                  UPDATE PASSWORD
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-[#333] font-mono text-sm">Loading...</p>
      </div>
    }>
      <ProfileInner />
    </Suspense>
  )
}
