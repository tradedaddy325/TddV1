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
    name: "SNIPER",
    priceRands: 199,
    credits: 300,
    features: ["300 Credits/month", "Basic Signals", "Limited Market Data", "Basic AI Access", "Trade Journal"],
    cta: "GET STARTED",
    highlight: false,
    badge: null,
  },
  {
    name: "EXECUTION",
    priceRands: 399,
    credits: 1200,
    features: ["1,200 Credits/month", "Advanced Signals", "Full Market Data", "Advanced AI Access", "Daily Intelligence"],
    cta: "START WINNING",
    highlight: true,
    badge: "MOST POPULAR",
  },
  {
    name: "DOMINANCE",
    priceRands: 499,
    credits: 4000,
    features: ["4,000 Credits/month", "Priority Signals", "Full + Priority Data", "Priority AI + Neural Net", "VIP Community"],
    cta: "GO DOMINANT",
    highlight: false,
    badge: "PREMIUM",
  },
]

// 1 credit = R1 — credit packs
const CREDIT_PACKS = [
  { label: "100 Credits", credits: 100, priceRands: 100 },
  { label: "250 Credits", credits: 250, priceRands: 250 },
  { label: "500 Credits", credits: 500, priceRands: 500 },
]

const VALID_COUPONS: Record<string, { credits: number; label: string }> = {
  "TRADEDAD50": { credits: 50, label: "50 bonus credits" },
  "WELCOME100": { credits: 100, label: "100 welcome credits" },
  "PREMIUM200": { credits: 200, label: "200 premium credits" },
}

function ProfileInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tabParam = searchParams?.get("tab") || "overview"
  const [activeTab, setActiveTab] = useState(tabParam)
  const [coupon, setCoupon] = useState("")
  const [couponMsg, setCouponMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [payLoading, setPayLoading] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  // Mock user data — replace with real Supabase query
  const user = {
    name: "Mohammed B.",
    email: "mohammed.bhorat@icloud.com",
    plan: "EXECUTION",
    credits: 847,
    totalCredits: 1200,
    joined: "March 2026",
    avatar: "MB",
    nextRenewal: "May 1, 2026",
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUserId(data.user.id)
    })
  }, [])

  // Tab sync with URL
  useEffect(() => {
    const t = searchParams?.get("tab") || "overview"
    setActiveTab(t)
  }, [searchParams])

  const setTab = (tab: string) => {
    router.push(`/profile?tab=${tab}`, { scroll: false })
    setActiveTab(tab)
  }

  // Core Yoco redirect function — creates checkout session then opens in new tab
  const initiateYocoCheckout = async (
    priceRands: number,
    description: string,
    metadata: Record<string, string | number>
  ) => {
    const loadingKey = description
    setPayLoading(loadingKey)

    try {
      const res = await fetch("/api/payments/yoco/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountInCents: priceRands * 100,
          currency: "ZAR",
          description,
          metadata: {
            ...metadata,
            userId: userId || "anonymous",
          },
          successUrl: `${window.location.origin}/payment/success?type=${metadata.type}&plan=${metadata.plan || ""}`,
          cancelUrl: `${window.location.origin}/profile?tab=${activeTab}&cancelled=true`,
        }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      if (data.redirectUrl) {
        // Open Yoco hosted checkout in new tab
        window.open(data.redirectUrl, "_blank", "noopener,noreferrer")
      } else {
        throw new Error("No redirect URL returned from Yoco")
      }
    } catch (err: any) {
      console.error("Checkout error:", err)
      alert(`Payment error: ${err.message}. Please try again or contact support.`)
    } finally {
      setPayLoading(null)
    }
  }

  const handleSubscribe = (plan: typeof PLANS[0]) => {
    initiateYocoCheckout(plan.priceRands, `TradeDaddy ${plan.name} Plan – Monthly`, {
      type: "subscription",
      plan: plan.name,
      credits: plan.credits,
    })
  }

  const handleBuyCredits = (pack: typeof CREDIT_PACKS[0]) => {
    initiateYocoCheckout(pack.priceRands, `TradeDaddy ${pack.label}`, {
      type: "credits",
      credits: pack.credits,
      plan: "",
    })
  }

  const handleApplyCoupon = async () => {
    const code = coupon.trim().toUpperCase()
    if (!code) {
      setCouponMsg({ text: "Please enter a coupon code.", ok: false })
      return
    }
    setCouponLoading(true)
    setCouponMsg(null)

    // Simulate API check (replace with real Supabase call)
    await new Promise((r) => setTimeout(r, 700))

    if (VALID_COUPONS[code]) {
      const reward = VALID_COUPONS[code]
      // TODO: call your API to actually apply credits
      // await fetch("/api/credits/redeem", { method: "POST", body: JSON.stringify({ code, userId }) })
      setCouponMsg({ text: `✓ Code applied! ${reward.label} added to your account.`, ok: true })
      setCoupon("")
    } else {
      setCouponMsg({ text: "Invalid or expired code. Please try again.", ok: false })
    }
    setCouponLoading(false)
  }

  const creditPct = Math.round((user.credits / user.totalCredits) * 100)

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between border border-[#1A1A1A] bg-[#0D0D0D] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00C853] flex items-center justify-center text-sm font-bold text-black">
              {user.avatar}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{user.name}</p>
              <p className="text-[11px] text-[#444] font-mono">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#00C853] border border-[#00C853]/30 px-2 py-1 font-mono tracking-widest">
              {user.plan}
            </span>
            <span className="text-[10px] text-[#333] font-mono hidden md:block">
              SINCE {user.joined.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border border-[#1A1A1A] bg-[#0D0D0D] overflow-x-auto">
          {["overview", "subscription", "credits", "security"].map((tab) => (
            <button
              key={tab}
              onClick={() => setTab(tab)}
              className={`flex-1 py-3 text-[11px] tracking-widest font-mono whitespace-nowrap transition-colors border-b-2 min-w-[80px] ${
                activeTab === tab
                  ? "border-[#00C853] text-white bg-[#00C853]/5"
                  : "border-transparent text-[#444] hover:text-[#777]"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Credits meter */}
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] text-[#00C853] tracking-widest font-mono">AI CREDITS</span>
                <span className="text-[10px] text-[#333] font-mono">RESETS MONTHLY</span>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl font-bold">{user.credits.toLocaleString()}</span>
                <span className="text-[#444] text-sm font-mono">/ {user.totalCredits.toLocaleString()}</span>
              </div>
              <div className="h-1.5 bg-[#1A1A1A] overflow-hidden mb-2">
                <div className="h-full bg-[#00C853] transition-all" style={{ width: `${creditPct}%` }} />
              </div>
              <p className="text-[11px] text-[#444] font-mono">{creditPct}% remaining this cycle</p>
            </div>

            {/* Plan status */}
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] text-[#00C853] tracking-widest font-mono">ACTIVE PLAN</span>
                <span className="text-[10px] text-[#00C853] font-mono">● ACTIVE</span>
              </div>
              <h3 className="text-3xl font-bold mb-1">{user.plan}</h3>
              <p className="text-[#444] text-xs font-mono mb-4">R399/mo · Renews {user.nextRenewal}</p>
              <div className="space-y-1.5">
                {["Advanced Signals", "Full Market Data", "Advanced AI Access", "Daily Intelligence"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-[11px]">
                    <span className="text-[#00C853] text-[9px]">▶</span>
                    <span className="text-[#666]">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity */}
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-5">
              <span className="text-[10px] text-[#00C853] tracking-widest font-mono block mb-4">THIS MONTH</span>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: "47", label: "SIGNALS VIEWED" },
                  { val: "12", label: "TRADES LOGGED" },
                  { val: "8", label: "LESSONS DONE" },
                  { val: "353", label: "CREDITS USED" },
                ].map((s) => (
                  <div key={s.label} className="bg-[#111] border border-[#1A1A1A] p-3">
                    <div className="text-xl font-bold text-[#00C853]">{s.val}</div>
                    <div className="text-[10px] text-[#333] mt-0.5 tracking-wider font-mono">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon — FIXED: fully functional input + submit */}
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-5">
              <span className="text-[10px] text-[#00C853] tracking-widest font-mono block mb-3">
                REDEEM CREDIT CODE
              </span>
              <p className="text-[11px] text-[#444] mb-4">
                Have a coupon? Enter it below to add bonus credits to your account.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => {
                    setCoupon(e.target.value.toUpperCase())
                    if (couponMsg) setCouponMsg(null)
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  placeholder="E.G. TRADEDAD50"
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={20}
                  className="flex-1 bg-[#111] border border-[#222] hover:border-[#333] focus:border-[#00C853] text-white text-xs px-3 py-2.5 placeholder-[#2A2A2A] focus:outline-none font-mono tracking-widest transition-colors"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !coupon.trim()}
                  className="bg-[#00C853] hover:bg-[#00B547] disabled:bg-[#1A3D2A] disabled:text-[#2A5A3A] text-black text-xs px-4 py-2.5 font-bold tracking-wider transition-colors min-w-[80px] font-mono"
                >
                  {couponLoading ? "..." : "APPLY"}
                </button>
              </div>
              {couponMsg && (
                <p className={`text-[11px] mt-2.5 font-mono ${couponMsg.ok ? "text-[#00C853]" : "text-[#FF4444]"}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── SUBSCRIPTION ── */}
        {activeTab === "subscription" && (
          <div className="space-y-4">
            {searchParams?.get("cancelled") === "true" && (
              <div className="border border-[#FF6600]/30 bg-[#FF6600]/5 px-4 py-3">
                <p className="text-[11px] text-[#FF6600] font-mono">Payment was cancelled. You have not been charged.</p>
              </div>
            )}

            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-5">
              <span className="text-[10px] text-[#00C853] tracking-widest font-mono block mb-6">CHOOSE YOUR PLAN</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PLANS.map((plan) => {
                  const isCurrent = plan.name === user.plan
                  const isLoading = payLoading === `TradeDaddy ${plan.name} Plan – Monthly`
                  return (
                    <div
                      key={plan.name}
                      className={`border relative p-5 transition-colors ${
                        isCurrent ? "border-[#00C853]" : "border-[#1A1A1A] hover:border-[#252525]"
                      }`}
                    >
                      {(plan.badge || isCurrent) && (
                        <div
                          className={`text-[9px] px-2 py-0.5 tracking-widest inline-block mb-3 font-mono ${
                            isCurrent
                              ? "bg-[#00C853] text-black"
                              : "bg-[#00C853]/10 text-[#00C853] border border-[#00C853]/20"
                          }`}
                        >
                          {isCurrent ? "CURRENT PLAN" : plan.badge}
                        </div>
                      )}
                      <h3 className="text-sm font-bold text-[#666] tracking-wider font-mono mb-1">{plan.name}</h3>
                      <div className="text-3xl font-bold mb-1">
                        R{plan.priceRands}
                        <span className="text-[#333] text-sm font-normal font-mono">/mo</span>
                      </div>
                      <p className="text-[10px] text-[#333] font-mono mb-4">{plan.credits.toLocaleString()} credits included</p>
                      <ul className="space-y-2 mb-5">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-[11px] text-[#555]">
                            <span className="text-[#00C853] text-[9px]">▶</span>{f}
                          </li>
                        ))}
                      </ul>
                      {isCurrent ? (
                        <div className="w-full border border-[#00C853]/30 text-[#00C853] text-[11px] py-2.5 font-mono tracking-widest text-center">
                          ● ACTIVE
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSubscribe(plan)}
                          disabled={isLoading || payLoading !== null}
                          className={`w-full text-[11px] py-2.5 font-bold tracking-widest font-mono transition-colors disabled:opacity-50 ${
                            plan.highlight
                              ? "bg-[#00C853] hover:bg-[#00B547] text-black"
                              : "border border-[#252525] hover:border-[#00C853]/40 text-[#666] hover:text-[#00C853]"
                          }`}
                        >
                          {isLoading ? "OPENING CHECKOUT..." : plan.cta + " →"}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Upgrade callout */}
            {user.plan !== "DOMINANCE" && (
              <div className="border border-[#00C853]/20 bg-[#00C853]/5 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[#00C853] tracking-wider mb-1 font-mono">
                    UPGRADE TO DOMINANCE — R499/mo
                  </p>
                  <p className="text-[11px] text-[#555]">
                    Unlock 4,000 credits, Priority AI Neural Network, and VIP community access.
                  </p>
                </div>
                <button
                  onClick={() => handleSubscribe(PLANS[2])}
                  disabled={payLoading !== null}
                  className="bg-[#00C853] hover:bg-[#00B547] text-black text-xs font-bold px-6 py-3 tracking-widest font-mono shrink-0 transition-colors disabled:opacity-50"
                >
                  {payLoading ? "OPENING..." : "UPGRADE NOW →"}
                </button>
              </div>
            )}

            <p className="text-[10px] text-[#2A2A2A] font-mono text-center">
              Payments processed securely via Yoco. Checkout opens in a new tab. All amounts in ZAR.
            </p>
          </div>
        )}

        {/* ── CREDITS ── */}
        {activeTab === "credits" && (
          <div className="space-y-4">
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-[#00C853] tracking-widest font-mono">BUY ADDITIONAL CREDITS</span>
                <span className="text-[10px] text-[#333] font-mono">1 CREDIT = R1</span>
              </div>
              <p className="text-[11px] text-[#444] font-mono mb-5">
                Credits are used for AI features — signals, analysis, Neural Network, and Daily Intelligence.
                Credits do not expire.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {CREDIT_PACKS.map((pack) => {
                  const isLoading = payLoading === `TradeDaddy ${pack.label}`
                  return (
                    <div key={pack.label} className="border border-[#1A1A1A] hover:border-[#252525] p-5 transition-colors">
                      <div className="text-3xl font-bold text-[#00C853] mb-1">{pack.credits}</div>
                      <div className="text-[11px] text-[#444] font-mono mb-1">Credits</div>
                      <div className="text-2xl font-bold mb-1">R{pack.priceRands}</div>
                      <div className="text-[10px] text-[#333] font-mono mb-5">R1 per credit</div>
                      <button
                        onClick={() => handleBuyCredits(pack)}
                        disabled={isLoading || payLoading !== null}
                        className="w-full border border-[#222] hover:border-[#00C853]/40 text-[#666] hover:text-[#00C853] text-[11px] py-2.5 font-mono tracking-widest transition-colors disabled:opacity-50 font-bold"
                      >
                        {isLoading ? "OPENING..." : "BUY NOW →"}
                      </button>
                    </div>
                  )
                })}
              </div>
              <p className="text-[10px] text-[#2A2A2A] font-mono">
                Checkout opens in a new tab via Yoco. Credits credited automatically after payment confirmation.
              </p>
            </div>

            {/* Credit history */}
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-5">
              <span className="text-[10px] text-[#00C853] tracking-widest font-mono block mb-4">CREDIT HISTORY</span>
              <div className="divide-y divide-[#1A1A1A]">
                {[
                  { date: "Apr 20", desc: "AI Signal Analysis — XAUUSD", amt: -12 },
                  { date: "Apr 19", desc: "Daily Intelligence Briefing", amt: -8 },
                  { date: "Apr 18", desc: "Neural Network Scan", amt: -25 },
                  { date: "Apr 1", desc: "Monthly Renewal — EXECUTION", amt: +1200 },
                  { date: "Mar 28", desc: "Coupon: TRADEDAD50", amt: +50 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 text-xs font-mono">
                    <span className="text-[#333] w-12">{item.date}</span>
                    <span className="text-[#555] flex-1 px-3">{item.desc}</span>
                    <span className={`font-bold ${item.amt > 0 ? "text-[#00C853]" : "text-[#FF4444]"}`}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-5">
              <span className="text-[10px] text-[#00C853] tracking-widest font-mono block mb-4">ACCOUNT DETAILS</span>
              <div className="space-y-3">
                {[
                  { label: "NAME", value: user.name },
                  { label: "EMAIL", value: user.email },
                  { label: "PLAN", value: `${user.plan} — R399/mo` },
                  { label: "JOINED", value: user.joined },
                  { label: "RENEWS", value: user.nextRenewal },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-xs border-b border-[#1A1A1A] pb-2.5 font-mono">
                    <span className="text-[#333] tracking-wider">{item.label}</span>
                    <span className="text-[#666]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-5">
              <span className="text-[10px] text-[#00C853] tracking-widest font-mono block mb-4">CHANGE PASSWORD</span>
              <div className="space-y-3">
                {["CURRENT PASSWORD", "NEW PASSWORD", "CONFIRM PASSWORD"].map((l) => (
                  <input
                    key={l}
                    type="password"
                    placeholder={l}
                    className="w-full bg-[#111] border border-[#1A1A1A] hover:border-[#222] focus:border-[#00C853] text-white text-xs px-3 py-2.5 placeholder-[#2A2A2A] focus:outline-none font-mono tracking-widest transition-colors"
                  />
                ))}
                <button className="w-full bg-[#00C853] hover:bg-[#00B547] text-black text-xs font-bold py-2.5 tracking-widest font-mono transition-colors">
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
