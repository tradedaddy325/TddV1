"use client"

import { useState, useEffect } from "react"
import Script from "next/script"

export default function ProfilePage() {
  const [couponCode, setCouponCode] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [yocoReady, setYocoReady] = useState(false)

  useEffect(() => {
    // Check if Yoco is available
    if (typeof window !== "undefined" && (window as any).Yoco) {
      setYocoReady(true)
    }
  }, [])

  const user = {
    name: "Mohammed B.",
    email: "mohammed.bhorat@icloud.com",
    plan: "EXECUTION",
    credits: 847,
    totalCredits: 1200,
    joined: "March 2026",
    avatar: "MB",
  }

  const creditPct = Math.round((user.credits / user.totalCredits) * 100)

  const handleYocoPayment = (amount: number, description: string) => {
    if (!yocoReady || !(window as any).Yoco) {
      alert("Payment system is loading. Please try again.")
      return
    }

    const yoco = (window as any).Yoco
    yoco.showPopup({
      publicKey: process.env.NEXT_PUBLIC_YOCO_PUBLIC_KEY || "",
      amount: amount * 100, // Amount in cents
      currency: "ZAR",
      name: "TradeDaddy",
      description: description,
      metadata: {
        email: user.email,
        userId: "user_" + user.avatar,
      },
      onClose: () => console.log("[v0] Payment cancelled"),
      onError: (error: any) => {
        console.error("[v0] Payment error:", error)
        alert(`Payment failed: ${error.message || "Unknown error"}`)
      },
      onSuccess: (result: any) => {
        console.log("[v0] Payment successful:", result)
        // Handle successful payment
        alert(`Payment successful! Transaction ID: ${result.id}`)
        // You can add logic here to confirm payment on your backend
      },
    })
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-mono p-4 md:p-6">
      <Script
        src="https://js.yoco.com/sdk/v1/yoco.js"
        strategy="lazyOnload"
        onLoad={() => setYocoReady(true)}
      />
      <div className="max-w-4xl mx-auto space-y-4">

        {/* Header Bar */}
        <div className="flex items-center justify-between border border-[#1A1A1A] bg-[#0D0D0D] px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF6600] flex items-center justify-center text-sm font-bold">{user.avatar}</div>
            <div>
              <p className="text-sm font-bold text-white">{user.name}</p>
              <p className="text-[11px] text-[#555]">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#FF6600] border border-[#FF6600]/30 px-2 py-1 tracking-widest">{user.plan}</span>
            <span className="text-[10px] text-[#555]">MEMBER SINCE {user.joined.toUpperCase()}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border border-[#1A1A1A] bg-[#0D0D0D]">
          {["overview", "subscription", "credits", "security"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-[11px] tracking-widest transition-colors border-b-2 ${
                activeTab === tab
                  ? "border-[#FF6600] text-white bg-[#111]"
                  : "border-transparent text-[#555] hover:text-[#888]"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Credit Meter */}
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] text-[#FF6600] tracking-widest">AI CREDITS</span>
                <span className="text-[10px] text-[#555]">RESETS MONTHLY</span>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl font-bold text-white">{user.credits.toLocaleString()}</span>
                <span className="text-[#555] text-sm">/ {user.totalCredits.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-[#1A1A1A] rounded-none overflow-hidden mb-2">
                <div
                  className="h-full bg-[#FF6600] transition-all"
                  style={{ width: `${creditPct}%` }}
                />
              </div>
              <p className="text-[11px] text-[#555]">{creditPct}% remaining this cycle</p>
            </div>

            {/* Plan Status */}
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] text-[#FF6600] tracking-widest">ACTIVE PLAN</span>
                <span className="text-[10px] text-[#00D084]">● ACTIVE</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{user.plan}</h3>
              <p className="text-[#555] text-xs mb-4">R399/mo · Renews May 1, 2026</p>
              <div className="space-y-1.5">
                {["Advanced Signals", "Full Market Data", "Advanced AI Access", "Daily Intelligence"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-[11px]">
                    <span className="text-[#FF6600] text-[10px]">▶</span>
                    <span className="text-[#888]">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Stats */}
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-5">
              <span className="text-[10px] text-[#FF6600] tracking-widest block mb-4">ACTIVITY THIS MONTH</span>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: "47", label: "SIGNALS VIEWED" },
                  { val: "12", label: "TRADES LOGGED" },
                  { val: "8", label: "LESSONS DONE" },
                  { val: "353", label: "CREDITS USED" },
                ].map((s) => (
                  <div key={s.label} className="bg-[#111] p-3 border border-[#1A1A1A]">
                    <div className="text-xl font-bold text-[#FF6600]">{s.val}</div>
                    <div className="text-[10px] text-[#555] mt-0.5 tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon */}
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-5">
              <span className="text-[10px] text-[#FF6600] tracking-widest block mb-4">REDEEM CREDIT CODE</span>
              <p className="text-[11px] text-[#555] mb-4">Have a coupon code? Enter it below to add credits to your account.</p>
              <div className="flex gap-2">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="ENTER CODE"
                  className="flex-1 bg-[#111] border border-[#222] text-white text-xs px-3 py-2.5 placeholder-[#333] focus:outline-none focus:border-[#FF6600] tracking-widest"
                />
                <button className="bg-[#FF6600] hover:bg-[#FF7722] text-white text-xs px-4 py-2.5 font-bold tracking-wider transition-colors">
                  APPLY
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "subscription" && (
          <div className="space-y-4">
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-5">
              <span className="text-[10px] text-[#FF6600] tracking-widest block mb-6">AVAILABLE PLANS</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    name: "SNIPER", price: "R199", features: ["300 Credits", "Basic Signals", "Limited Data", "Basic AI"],
                    current: false, badge: null,
                  },
                  {
                    name: "EXECUTION", price: "R399", features: ["1,200 Credits", "Advanced Signals", "Full Data", "Advanced AI"],
                    current: true, badge: "CURRENT PLAN",
                  },
                  {
                    name: "DOMINANCE", price: "R499", features: ["4,000 Credits", "Priority Signals", "Full + Priority Data", "Priority AI & Neural Net"],
                    current: false, badge: "UNLOCK EVERYTHING",
                  },
                ].map((plan) => (
                  <div key={plan.name} className={`border relative p-4 ${plan.current ? "border-[#FF6600]" : "border-[#1A1A1A] hover:border-[#333]"} transition-colors`}>
                    {plan.badge && (
                      <div className={`text-[9px] px-2 py-0.5 tracking-widest inline-block mb-3 ${plan.current ? "bg-[#FF6600] text-white" : "bg-[#FF6600]/10 text-[#FF6600] border border-[#FF6600]/30"}`}>
                        {plan.badge}
                      </div>
                    )}
                    <h3 className="text-sm font-bold text-[#888] tracking-wider mb-1">{plan.name}</h3>
                    <div className="text-3xl font-bold text-white mb-4">{plan.price}<span className="text-[#555] text-sm font-normal">/mo</span></div>
                    <ul className="space-y-2 mb-4">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-[11px] text-[#666]">
                          <span className="text-[#FF6600] text-[10px]">▶</span>{f}
                        </li>
                      ))}
                    </ul>
                    {!plan.current && (
            <button 
              onClick={() => handleYocoPayment(399, "EXECUTION Plan - Monthly Subscription")}
              className="w-full border border-[#333] hover:border-[#FF6600] text-[#888] hover:text-[#FF6600] text-[11px] py-2 tracking-widest transition-colors">
              {plan.name === "DOMINANCE" ? "UPGRADE" : "DOWNGRADE"}
            </button>
                    )}
                    {plan.current && (
                      <div className="w-full border border-[#FF6600]/30 text-[#FF6600] text-[11px] py-2 tracking-widest text-center">
                        ● ACTIVE
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* DOMINANCE upgrade callout */}
            <div className="border border-[#FF6600]/30 bg-[#FF6600]/5 p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#FF6600] tracking-wider mb-1">UPGRADE TO DOMINANCE — R499/mo</p>
                <p className="text-[11px] text-[#666]">Unlock 4,000 credits, Priority AI Neural Network, and VIP community access. The complete professional package.</p>
              </div>
            <button 
              onClick={() => handleYocoPayment(499, "DOMINANCE Plan - Monthly Subscription")}
              className="bg-[#FF6600] hover:bg-[#FF7722] text-white text-xs font-bold px-5 py-3 tracking-widest ml-4 shrink-0 transition-colors">
              UPGRADE NOW
            </button>
            </div>
          </div>
        )}

        {activeTab === "credits" && (
          <div className="space-y-4">
            {/* Top Up Section */}
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-5">
              <span className="text-[10px] text-[#FF6600] tracking-widest block mb-4">TOP UP CREDITS</span>
              <p className="text-[11px] text-[#555] mb-4">Load credits to your wallet. 1 credit = R1. All payments processed securely via Yoco.</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {["100", "500", "1000"].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => handleYocoPayment(parseInt(amt), `Top up ${amt} credits`)}
                    className="bg-[#111] border border-[#222] hover:border-[#FF6600] text-[#888] hover:text-[#FF6600] text-xs px-3 py-2.5 tracking-widest transition-colors"
                  >
                    +{amt} (R{amt})
                  </button>
                ))}
              </div>
            </div>

            {/* Credit History */}
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-5">
            <span className="text-[10px] text-[#FF6600] tracking-widest block mb-4">CREDIT HISTORY</span>
            <div className="space-y-0 divide-y divide-[#1A1A1A]">
              {[
                { date: "Apr 20", desc: "AI Signal Analysis — XAUUSD", amount: -12, type: "used" },
                { date: "Apr 19", desc: "Daily Intelligence Briefing", amount: -8, type: "used" },
                { date: "Apr 18", desc: "Neural Network Scan", amount: -25, type: "used" },
                { date: "Apr 1", desc: "Monthly Plan Renewal — EXECUTION", amount: +1200, type: "added" },
                { date: "Mar 28", desc: "Coupon: TRADEDAD50", amount: +50, type: "added" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 text-xs">
                  <span className="text-[#555] w-12">{item.date}</span>
                  <span className="text-[#888] flex-1 px-3">{item.desc}</span>
                  <span className={`font-bold ${item.amount > 0 ? "text-[#00D084]" : "text-[#FF4444]"}`}>
                    {item.amount > 0 ? "+" : ""}{item.amount}
                  </span>
                </div>
              ))}
            </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-5">
              <span className="text-[10px] text-[#FF6600] tracking-widest block mb-4">ACCOUNT DETAILS</span>
              <div className="space-y-3">
                {[
                  { label: "FULL NAME", value: user.name },
                  { label: "EMAIL", value: user.email },
                  { label: "PLAN", value: user.plan + " — R399/mo" },
                  { label: "JOINED", value: user.joined },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-xs border-b border-[#1A1A1A] pb-2">
                    <span className="text-[#555] tracking-wider">{item.label}</span>
                    <span className="text-[#888]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-5">
              <span className="text-[10px] text-[#FF6600] tracking-widest block mb-4">CHANGE PASSWORD</span>
              <div className="space-y-3">
                {["CURRENT PASSWORD", "NEW PASSWORD", "CONFIRM PASSWORD"].map((label) => (
                  <input
                    key={label}
                    type="password"
                    placeholder={label}
                    className="w-full bg-[#111] border border-[#222] text-white text-xs px-3 py-2.5 placeholder-[#333] focus:outline-none focus:border-[#FF6600] tracking-widest"
                  />
                ))}
                <button className="w-full bg-[#FF6600] hover:bg-[#FF7722] text-white text-xs font-bold py-2.5 tracking-widest mt-2 transition-colors">
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
