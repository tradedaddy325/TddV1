"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  User,
  Mail,
  Wallet,
  RefreshCw,
  Gift,
  HelpCircle,
  LogOut,
  Crown,
  Calendar,
  CheckCircle,
  ChevronDown,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
} from "lucide-react"

interface ProfileData {
  username?: string
  email?: string
  credits?: number
  tier?: string
  subscriptions?: Subscription[]
  coupons?: CouponHistory[]
  referral_code?: string
}

interface Subscription {
  name: string
  credits_per_period: number
  status: "active" | "auto-renew" | "expired"
  next_renewal?: string
  access_ends?: string
}

interface CouponHistory {
  code: string
  credits: number
  date: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [topUpAmount, setTopUpAmount] = useState("100")
  const [couponCode, setCouponCode] = useState("")
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponMsg, setCouponMsg] = useState("")
  const [selectedInfluencer, setSelectedInfluencer] = useState("")
  const [logoutLoading, setLogoutLoading] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push("/auth/login")
          return
        }

        const res = await fetch("/api/profile")
        if (res.ok) {
          const data = await res.json()
          setProfile(data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleTopUp = (amount: string) => {
    router.push(`/credits?amount=${amount}`)
  }

  const handleRedeemCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    setCouponMsg("")
    try {
      const res = await fetch("/api/credits/redeem-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode }),
      })
      const data = await res.json()
      if (res.ok) {
        setCouponMsg(`✓ ${data.message || "Coupon redeemed successfully!"}`)
        setCouponCode("")
        // refresh profile
        const profileRes = await fetch("/api/profile")
        if (profileRes.ok) setProfile(await profileRes.json())
      } else {
        setCouponMsg(`✗ ${data.error || "Invalid coupon code"}`)
      }
    } catch {
      setCouponMsg("✗ Something went wrong")
    } finally {
      setCouponLoading(false)
    }
  }

  const handleLogout = async () => {
    setLogoutLoading(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/auth/login")
    } catch (e) {
      console.error(e)
      setLogoutLoading(false)
    }
  }

  const userEmail = profile?.email || ""
  const username = profile?.username || userEmail.split("@")[0] || "Trader"
  const credits = profile?.credits ?? 0
  const tier = profile?.tier || "free"
  const isPremium = tier === "premium" || tier === "pro"

  const subscriptions: Subscription[] = profile?.subscriptions || []
  const coupons: CouponHistory[] = profile?.coupons || []

  const PRESET_AMOUNTS = ["100", "250", "500", "699", "1000"]

  const getStatusColor = (status: string) => {
    if (status === "auto-renew") return "bg-green-500/20 text-green-400 border border-green-500/40"
    if (status === "active") return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
    return "bg-gray-700/50 text-gray-400 border border-gray-600/40"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-mono">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 px-4 py-4">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <button
            onClick={() => router.push("/chat")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Support
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4 pb-24">

        {/* User Card */}
        <div className="bg-[#141414] rounded-2xl border border-white/8 p-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
              <User className="w-7 h-7 text-green-400" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-lg leading-tight truncate">{username}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                <p className="text-gray-400 text-sm truncate">{userEmail}</p>
              </div>
              {isPremium && (
                <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-xs font-semibold">
                  <Crown className="w-3 h-3" />
                  PREMIUM
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Upgrade to Premium (if not premium) */}
        {!isPremium && (
          <div className="bg-[#141414] rounded-2xl border border-yellow-500/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-bold">Upgrade to Premium</h2>
            </div>
            <p className="text-gray-400 text-sm mb-4">699 credits/month — unlock everything except the trade copier.</p>
            <div className="space-y-2 mb-5">
              {[
                "Unlimited Signals & Setups",
                "Unlimited AI Signals (all pairs)",
                "Unlimited Economic News Signals",
                "Unlimited Weekend Gap Signals",
                "Full Trading Journal with AI coaching",
                "Macro Desk — macro market intelligence",
                "Sentiment Intelligence — market psychology",
                "Polymarket Pulse — prediction market data",
                "Full Trading Academy access",
                "Psychology Coaching & Tilt Monitor",
              ].map((feature) => (
                <div key={feature} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleTopUp("699")}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-yellow-500/80 hover:bg-yellow-500 text-black font-bold text-sm transition-colors"
            >
              <Crown className="w-4 h-4" />
              Use 699 credits
            </button>
            <button
              onClick={() => router.push("/credits")}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-sm mt-2 hover:bg-white/10 transition-colors"
            >
              <Crown className="w-4 h-4" />
              Pay with Yoco
            </button>
          </div>
        )}

        {/* Credits Wallet */}
        <div className="bg-[#141414] rounded-2xl border border-white/8 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/15 border border-green-500/20 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="font-bold text-base">Credits Wallet</h2>
                <p className="text-gray-500 text-xs">1 credit = R1</p>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 font-bold text-sm">
              {credits} credits
            </span>
          </div>

          {/* Preset amounts */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {PRESET_AMOUNTS.slice(0, 3).map((amt) => (
              <button
                key={amt}
                onClick={() => setTopUpAmount(amt)}
                className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  topUpAmount === amt
                    ? "bg-green-500/20 border-green-500/50 text-green-400"
                    : "bg-white/5 border-white/8 text-gray-300 hover:bg-white/10"
                }`}
              >
                Load {amt}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {PRESET_AMOUNTS.slice(3).map((amt) => (
              <button
                key={amt}
                onClick={() => setTopUpAmount(amt)}
                className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  topUpAmount === amt
                    ? "bg-green-500/20 border-green-500/50 text-green-400"
                    : "bg-white/5 border-white/8 text-gray-300 hover:bg-white/10"
                }`}
              >
                Load {amt}
              </button>
            ))}
          </div>

          {/* Custom amount + top up */}
          <div className="flex gap-2">
            <input
              type="number"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-green-500/50 focus:bg-white/8"
              placeholder="Custom amount"
              min="10"
            />
            <button
              onClick={() => handleTopUp(topUpAmount)}
              className="px-5 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold text-sm transition-colors flex-shrink-0"
            >
              Top up
            </button>
          </div>
        </div>

        {/* Subscriptions */}
        {subscriptions.length > 0 && (
          <div className="bg-[#141414] rounded-2xl border border-white/8 p-5">
            <div className="flex items-center gap-2 mb-4">
              <RefreshCw className="w-5 h-5 text-green-400" />
              <h2 className="font-bold text-base">Subscriptions</h2>
            </div>
            <div className="space-y-3">
              {subscriptions.map((sub, i) => (
                <div key={i} className="bg-white/3 rounded-xl border border-white/6 p-4">
                  <p className="font-semibold text-sm mb-0.5 font-mono">{sub.name}</p>
                  <p className="text-gray-500 text-xs mb-3">{sub.credits_per_period} credits per 30 days</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mb-3 ${getStatusColor(sub.status)}`}>
                    {sub.status === "auto-renew" ? "AUTO-RENEW" : sub.status.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{sub.next_renewal ? `Next renewal` : `Access ends`}</span>
                    <span className="text-white font-medium">{sub.next_renewal || sub.access_ends}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Coupon */}
        <div className="bg-[#141414] rounded-2xl border border-white/8 p-5">
          <div className="flex items-center gap-2 mb-1">
            <Gift className="w-5 h-5 text-green-400" />
            <h2 className="font-bold text-base">Add Coupon</h2>
          </div>
          <p className="text-gray-500 text-sm mb-4">Got a promo code? Redeem it here to receive free wallet credits.</p>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-green-500/50 placeholder:text-gray-600 mb-3"
            onKeyDown={(e) => e.key === "Enter" && handleRedeemCoupon()}
          />
          <button
            onClick={handleRedeemCoupon}
            disabled={couponLoading || !couponCode.trim()}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-500 hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-sm transition-colors"
          >
            <Gift className="w-4 h-4" />
            {couponLoading ? "Redeeming..." : "Redeem"}
          </button>
          {couponMsg && (
            <p className={`mt-2.5 text-sm text-center font-mono ${couponMsg.startsWith("✓") ? "text-green-400" : "text-red-400"}`}>
              {couponMsg}
            </p>
          )}

          {coupons.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recent Coupon Credits</p>
              <div className="space-y-2">
                {coupons.slice(0, 5).map((c, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/3 rounded-xl px-4 py-3 border border-white/6">
                    <div>
                      <p className="text-sm font-mono font-bold text-white">{c.code}</p>
                      <p className="text-xs text-gray-500">{c.date}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold">
                      +{c.credits} credits
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Change Influencer */}
        <div className="bg-[#141414] rounded-2xl border border-white/8 p-5">
          <div className="flex items-center gap-2 mb-1">
            <RefreshCw className="w-4 h-4 text-green-400" />
            <h2 className="font-bold text-base">Change Influencer</h2>
          </div>
          <p className="text-sm text-gray-400 mb-1">Current influencer: <span className="text-white font-semibold">Main TradeDaddy site</span></p>
          <p className="text-xs text-gray-500 mb-4">Choose the influencer you want to move to and send your request for approval.</p>
          <div className="relative mb-3">
            <select
              value={selectedInfluencer}
              onChange={(e) => setSelectedInfluencer(e.target.value)}
              className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-green-500/50 pr-10"
            >
              <option value="" className="bg-[#1a1a1a]">Select an influencer</option>
              <option value="main" className="bg-[#1a1a1a]">Main TradeDaddy site</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 font-semibold text-sm hover:bg-green-500/25 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Request Influencer Change
          </button>
        </div>

        {/* Need Help */}
        <div className="bg-[#141414] rounded-2xl border border-white/8 p-5">
          <div className="flex items-center gap-2 mb-1">
            <HelpCircle className="w-5 h-5 text-green-400" />
            <h2 className="font-bold text-base">Need help?</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">Open the support desk to chat with the AI assistant or get escalated to the team.</p>
          <button
            onClick={() => router.push("/chat")}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold text-sm transition-colors"
          >
            Open Support
          </button>
        </div>

        {/* Log Out */}
        <div className="bg-[#141414] rounded-2xl border border-white/8 p-5">
          <h2 className="font-bold text-base mb-0.5">Log out</h2>
          <p className="text-gray-500 text-sm mb-4">Sign out of TradeDaddy on this device.</p>
          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-colors disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            {logoutLoading ? "Signing out..." : "Log Out"}
          </button>
        </div>

      </div>
    </div>
  )
}
