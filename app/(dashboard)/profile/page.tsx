"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

declare global {
  interface Window {
    YocoSDK: any
  }
}

const PLANS = [
  {
    name: "SNIPER",
    price: 199,
    priceLabel: "R199",
    credits: 300,
    features: ["300 Credits/month", "Basic Signals", "Limited Market Data", "Basic AI Access", "Trade Journal"],
    cta: "GET STARTED",
    highlight: false,
    badge: null,
  },
  {
    name: "EXECUTION",
    price: 399,
    priceLabel: "R399",
    credits: 1200,
    features: ["1,200 Credits/month", "Advanced Signals", "Full Market Data", "Advanced AI Access", "Daily Intelligence"],
    cta: "START WINNING",
    highlight: true,
    badge: "MOST POPULAR",
  },
  {
    name: "DOMINANCE",
    price: 499,
    priceLabel: "R499",
    credits: 4000,
    features: ["4,000 Credits/month", "Priority Signals", "Full + Priority Data", "Priority AI + Neural Net", "VIP Community Access"],
    cta: "GO DOMINANT",
    highlight: false,
    badge: "PREMIUM",
  },
]

const CREDIT_PACKS = [
  { label: "500 Credits", credits: 500, price: 99, priceLabel: "R99" },
  { label: "1,500 Credits", credits: 1500, price: 249, priceLabel: "R249" },
  { label: "5,000 Credits", credits: 5000, price: 699, priceLabel: "R699" },
]

export default function ProfilePage() {
  const searchParams = useSearchParams()
  const tabParam = searchParams?.get("tab") || "overview"
  const [activeTab, setActiveTab] = useState(tabParam)
  const [coupon, setCoupon] = useState("")
  const [couponMsg, setCouponMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [payLoading, setPayLoading] = useState<string | null>(null)

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

  // Load Yoco SDK script - NOT NEEDED anymore since we use REST API
  // Removed: yocoReady state and SDK loading useEffect

  const handleYocoPay = async (amountRands: number, description: string, metadata: object) => {
    setPayLoading(description)
    try {
      console.log("[v0] Starting Yoco payment:", { amountRands, description, metadata })
      
      // Create checkout session via Yoco API
      const res = await fetch("https://payments.yoco.com/api/checkouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_YOCO_PUBLIC_KEY}`,
        },
        body: JSON.stringify({
          amount: amountRands * 100, // Convert to cents
          currency: "ZAR",
          description,
          metadata,
          successUrl: `${window.location.origin}/profile?payment=success&tab=${
            metadata.type === "subscription" ? "subscription" : "credits"
          }`,
          cancelUrl: `${window.location.origin}/profile?payment=cancelled&tab=${
            metadata.type === "subscription" ? "subscription" : "credits"
          }`,
        }),
      })

      const data = await res.json()
      console.log("[v0] Checkout created:", data)

      if (data.redirectUrl) {
        // Redirect to Yoco's hosted payment page
        window.location.href = data.redirectUrl
      } else if (data.id) {
        // Fallback: Show redirect message
        alert("Redirecting to Yoco payment page...")
        // Some Yoco implementations might need manual redirect
        window.location.href = `https://checkout.yoco.com/${data.id}`
      } else {
        throw new Error(data.error?.message || "Failed to create checkout")
      }
    } catch (error) {
      console.error("[v0] Payment error:", error)
      alert("Payment failed: " + String(error))
      setPayLoading(null)
    }
  }

  const applyCoupon = async () => {
    if (!coupon.trim()) {
      setCouponMsg({ text: "Please enter a code", ok: false })
      return
    }
    setCouponMsg(null)
    try {
      const res = await fetch("/api/credits/redeem-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon }),
      })
      const data = await res.json()
      if (data.success) {
        setCouponMsg({ text: `✓ Added ${data.creditsAdded} credits!`, ok: true })
        setCoupon("")
      } else {
        setCouponMsg({ text: data.error || "Invalid code", ok: false })
      }
    } catch (e) {
      setCouponMsg({ text: "Error applying code", ok: false })
    }
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
              onClick={() => setActiveTab(tab)}
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

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Credits */}
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

            {/* Plan */}
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

            {/* Stats */}
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

            {/* Coupon */}
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-5">
              <span className="text-[10px] text-[#00C853] tracking-widest font-mono block mb-3">REDEEM CREDIT CODE</span>
              <p className="text-[11px] text-[#444] mb-4">Have a coupon? Enter it below to add credits.</p>
              <div className="flex gap-2">
                <input
                  value={coupon}
                  onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponMsg(null) }}
                  placeholder="ENTER CODE"
                  className="flex-1 bg-[#111] border border-[#222] text-white text-xs px-3 py-2.5 placeholder-[#2A2A2A] focus:outline-none focus:border-[#00C853] font-mono tracking-widest"
                />
                <button
                  onClick={applyCoupon}
                  className="bg-[#00C853] hover:bg-[#00B547] text-black text-xs px-4 py-2.5 font-bold tracking-wider transition-colors"
                >
                  APPLY
                </button>
              </div>
              {couponMsg && (
                <p className={`text-[11px] mt-2 font-mono ${couponMsg.ok ? "text-[#00C853]" : "text-[#FF4444]"}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>
          </div>
        )}

        {/* SUBSCRIPTION */}
        {activeTab === "subscription" && (
          <div className="space-y-4">
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-5">
              <span className="text-[10px] text-[#00C853] tracking-widest font-mono block mb-6">CHOOSE YOUR PLAN</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PLANS.map((plan) => {
                  const isCurrent = plan.name === user.plan
                  return (
                    <div key={plan.name} className={`border relative p-5 ${isCurrent ? "border-[#00C853]" : "border-[#1A1A1A] hover:border-[#252525]"} transition-colors`}>
                      {plan.badge && (
                        <div className={`text-[9px] px-2 py-0.5 tracking-widest inline-block mb-3 font-mono ${isCurrent ? "bg-[#00C853] text-black" : "bg-[#00C853]/10 text-[#00C853] border border-[#00C853]/20"}`}>
                          {isCurrent ? "CURRENT PLAN" : plan.badge}
                        </div>
                      )}
                      {!plan.badge && isCurrent && (
                        <div className="text-[9px] px-2 py-0.5 tracking-widest inline-block mb-3 font-mono bg-[#00C853] text-black">
                          CURRENT PLAN
                        </div>
                      )}
                      <h3 className="text-sm font-bold text-[#666] tracking-wider font-mono mb-1">{plan.name}</h3>
                      <div className="text-3xl font-bold mb-4">
                        {plan.priceLabel}
                        <span className="text-[#333] text-sm font-normal font-mono">/mo</span>
                      </div>
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
                          onClick={() => handleYocoPay(plan.price, `TradeDaddy ${plan.name} Plan - Monthly`, { plan: plan.name, type: "subscription" })}
                          disabled={payLoading !== null}
                          className={`w-full text-[11px] py-2.5 font-bold tracking-widest font-mono transition-colors ${
                            plan.highlight
                              ? "bg-[#00C853] hover:bg-[#00B547] text-black"
                              : "border border-[#252525] hover:border-[#00C853]/40 text-[#666] hover:text-[#00C853]"
                          } disabled:opacity-50`}
                        >
                          {payLoading === `TradeDaddy ${plan.name} Plan - Monthly`
                            ? "PROCESSING..."
                            : plan.name === "DOMINANCE" ? "UPGRADE NOW" : plan.name === "SNIPER" ? "DOWNGRADE" : plan.cta}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Dominance upgrade callout */}
            <div className="border border-[#00C853]/20 bg-[#00C853]/5 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-[#00C853] tracking-wider mb-1 font-mono">UPGRADE TO DOMINANCE — R499/mo</p>
                <p className="text-[11px] text-[#555]">Unlock 4,000 credits, Priority AI Neural Network, and VIP community access.</p>
              </div>
              <button
                onClick={() => handleYocoPay(499, "TradeDaddy DOMINANCE Plan - Monthly", { plan: "DOMINANCE", type: "subscription" })}
                disabled={payLoading !== null}
                className="bg-[#00C853] hover:bg-[#00B547] text-black text-xs font-bold px-6 py-3 tracking-widest font-mono shrink-0 transition-colors disabled:opacity-50"
              >
                {payLoading ? "PROCESSING..." : "UPGRADE NOW"}
              </button>
            </div>

            <p className="text-[10px] text-[#333] font-mono text-center">
              Payments processed securely via Yoco. All amounts in ZAR. Cancel anytime.
            </p>
          </div>
        )}

        {/* CREDITS */}
        {activeTab === "credits" && (
          <div className="space-y-4">
            {/* Buy credit packs */}
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-5">
              <span className="text-[10px] text-[#00C853] tracking-widest font-mono block mb-5">BUY ADDITIONAL CREDITS</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {CREDIT_PACKS.map((pack) => (
                  <div key={pack.label} className="border border-[#1A1A1A] hover:border-[#252525] p-4 transition-colors">
                    <div className="text-2xl font-bold text-[#00C853] mb-1">{pack.credits.toLocaleString()}</div>
                    <div className="text-[11px] text-[#444] font-mono mb-3">Credits</div>
                    <div className="text-xl font-bold mb-4">{pack.priceLabel}</div>
                    <button
                      onClick={() => handleYocoPay(pack.price, `${pack.label} Credit Pack`, { type: "credits", credits: pack.credits })}
                      disabled={payLoading !== null}
                      className="w-full border border-[#222] hover:border-[#00C853]/40 text-[#666] hover:text-[#00C853] text-[11px] py-2.5 font-mono tracking-widest transition-colors disabled:opacity-50"
                    >
                      {payLoading === `${pack.label} Credit Pack` ? "PROCESSING..." : "PURCHASE"}
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[#333] font-mono">Credits do not expire. Processed via Yoco secure checkout.</p>
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

        {/* SECURITY */}
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
                  <input key={l} type="password" placeholder={l}
                    className="w-full bg-[#111] border border-[#1A1A1A] text-white text-xs px-3 py-2.5 placeholder-[#2A2A2A] focus:outline-none focus:border-[#00C853] font-mono tracking-widest"
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
