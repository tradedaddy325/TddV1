// app/strings/page.tsx
"use client"

import { useState, useRef, useEffect } from "react"

type Tag = "XAUUSD" | "EURUSD" | "NAS100" | "BTCUSD" | "GBPUSD" | "US500" | "STRATEGY" | "GENERAL"
type Reaction = { emoji: string; count: number; reacted: boolean }

interface StringPost {
  id: string
  author: string
  avatar: string
  plan: "SNIPER" | "EXECUTION" | "DOMINANCE"
  tag: Tag
  content: string
  time: string
  likes: number
  liked: boolean
  replies: number
  pinned?: boolean
  reactions: Reaction[]
}

const TAG_COLORS: Record<Tag, string> = {
  XAUUSD:   "bg-[#FF8C00]/10 text-[#FF8C00] border-[#FF8C00]/20",
  EURUSD:   "bg-[#FF6600]/10 text-[#FF6600] border-[#FF6600]/20",
  NAS100:   "bg-[#FF4444]/10 text-[#FF4444] border-[#FF4444]/20",
  BTCUSD:   "bg-[#FFB800]/10 text-[#FFB800] border-[#FFB800]/20",
  GBPUSD:   "bg-[#FF6600]/10 text-[#FF9955] border-[#FF9955]/20",
  US500:    "bg-[#FF4444]/10 text-[#FF6644] border-[#FF6644]/20",
  STRATEGY: "bg-[#888]/10 text-[#888] border-[#555]/20",
  GENERAL:  "bg-[#444]/10 text-[#666] border-[#444]/20",
}

const PLAN_COLOR: Record<string, string> = {
  DOMINANCE: "text-[#FF6600]",
  EXECUTION: "text-[#FF9955]",
  SNIPER:    "text-[#888]",
}

const SEED_STRINGS: StringPost[] = [
  {
    id: "1", author: "TradeDaddy", avatar: "TD", plan: "DOMINANCE",
    tag: "XAUUSD", pinned: true,
    content: "📌 Gold broke above 3340 with strong momentum. Watching 3365 resistance — if we hold above 3340 on retrace this setup looks clean for continuation. R:R sitting at 1:3. Stay patient, don't chase.",
    time: "2m ago", likes: 47, liked: false, replies: 12,
    reactions: [{ emoji: "🔥", count: 18, reacted: false }, { emoji: "💰", count: 11, reacted: false }],
  },
  {
    id: "2", author: "M. Bhorat", avatar: "MB", plan: "EXECUTION",
    tag: "STRATEGY",
    content: "Anyone else using the risk calculator for position sizing before every trade? Changed my whole game — stops getting blown from over-leveraging is a thing of the past 💪",
    time: "8m ago", likes: 23, liked: false, replies: 7,
    reactions: [{ emoji: "💯", count: 14, reacted: false }, { emoji: "👊", count: 6, reacted: false }],
  },
  {
    id: "3", author: "SigmaTrader_ZA", avatar: "ST", plan: "DOMINANCE",
    tag: "NAS100",
    content: "NAS100 gap filled at 19810 perfectly. Entered long, tight stop at 19780. Target 20100. Claude's neural network called this one hours before the move. This AI is scary accurate 😳",
    time: "15m ago", likes: 31, liked: true, replies: 4,
    reactions: [{ emoji: "🤖", count: 22, reacted: true }, { emoji: "📈", count: 9, reacted: false }],
  },
  {
    id: "4", author: "ForexFiona", avatar: "FF", plan: "EXECUTION",
    tag: "EURUSD",
    content: "EURUSD consolidating between 1.1280 – 1.1400 for 3 days now. Key level to watch: break above 1.1400 with close = long setup. Break below 1.1280 = bearish continuation to 1.1200.",
    time: "22m ago", likes: 19, liked: false, replies: 3,
    reactions: [{ emoji: "📊", count: 8, reacted: false }],
  },
  {
    id: "5", author: "CryptoKingZN", avatar: "CK", plan: "DOMINANCE",
    tag: "BTCUSD",
    content: "BTC at extreme greed (84 on the psychology index). If you're long from lower, consider taking partial profits. The psychology tab is showing too many retail longs — smart money loves trapping these.",
    time: "35m ago", likes: 42, liked: false, replies: 9,
    reactions: [{ emoji: "⚠️", count: 25, reacted: false }, { emoji: "🧠", count: 17, reacted: false }],
  },
  {
    id: "6", author: "PipHunter99", avatar: "PH", plan: "SNIPER",
    tag: "GBPUSD",
    content: "Cable looking heavy. Retail is 62% short but price hasn't made new lows in 3 sessions. Classic short squeeze setup incoming? Watching 1.3280 closely.",
    time: "1h ago", likes: 14, liked: false, replies: 5,
    reactions: [{ emoji: "👀", count: 11, reacted: false }],
  },
  {
    id: "7", author: "TradeJournalPro", avatar: "TJ", plan: "EXECUTION",
    tag: "GENERAL",
    content: "Reminder to everyone: log your trades in the journal. Took me 3 months to realise I was losing money on Tuesday mornings consistently. You can't fix what you can't see.",
    time: "2h ago", likes: 38, liked: false, replies: 6,
    reactions: [{ emoji: "📓", count: 21, reacted: false }, { emoji: "💡", count: 12, reacted: false }],
  },
]

const ALL_TAGS: Tag[] = ["XAUUSD", "EURUSD", "NAS100", "BTCUSD", "GBPUSD", "US500", "STRATEGY", "GENERAL"]

export default function StringsPage() {
  const [posts, setPosts] = useState<StringPost[]>(SEED_STRINGS)
  const [activeTag, setActiveTag] = useState<Tag | "ALL">("ALL")
  const [newString, setNewString] = useState("")
  const [newTag, setNewTag] = useState<Tag>("GENERAL")
  const [submitting, setSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Filter posts
  const filtered = activeTag === "ALL"
    ? posts
    : posts.filter((p) => p.tag === activeTag)

  // Sort: pinned first
  const sorted = [...filtered].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))

  const handleLike = (id: string) => {
    setPosts((prev) => prev.map((p) =>
      p.id === id
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ))
  }

  const handleReact = (postId: string, emoji: string) => {
    setPosts((prev) => prev.map((p) =>
      p.id === postId
        ? {
            ...p,
            reactions: p.reactions.map((r) =>
              r.emoji === emoji
                ? { ...r, count: r.reacted ? r.count - 1 : r.count + 1, reacted: !r.reacted }
                : r
            ),
          }
        : p
    ))
  }

  const handlePost = async () => {
    if (!newString.trim()) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 400))
    const post: StringPost = {
      id: Date.now().toString(),
      author: "Mohammed B.",
      avatar: "MB",
      plan: "EXECUTION",
      tag: newTag,
      content: newString.trim(),
      time: "just now",
      likes: 0,
      liked: false,
      replies: 0,
      reactions: [{ emoji: "🔥", count: 0, reacted: false }],
    }
    setPosts((prev) => [post, ...prev])
    setNewString("")
    setSubmitting(false)
    textareaRef.current?.blur()
  }

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = "auto"
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px"
  }, [newString])

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-4 space-y-3 sm:space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between border border-[#1A1A1A] bg-[#0D0D0D] px-3 sm:px-4 py-2.5 sm:py-3">
          <div>
            <p className="text-[9px] sm:text-[10px] text-[#333] font-mono tracking-widest">COMMUNITY</p>
            <p className="text-sm sm:text-base font-bold">STRINGS</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#FF6600] rounded-full animate-pulse" />
            <span className="text-[10px] sm:text-[11px] text-[#FF6600] font-mono">
              {posts.length} STRINGS
            </span>
          </div>
        </div>

        {/* Compose box */}
        <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-3 sm:p-4">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#FF6600] flex items-center justify-center text-[10px] sm:text-[11px] font-bold text-white shrink-0 mt-0.5">
              MB
            </div>
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={newString}
                onChange={(e) => setNewString(e.target.value)}
                placeholder="Drop a string — share a setup, insight, or trade idea..."
                rows={2}
                className="w-full bg-[#111] border border-[#1A1A1A] focus:border-[#FF6600]/40 text-white text-[12px] sm:text-[13px] px-3 py-2.5 placeholder-[#2A2A2A] focus:outline-none font-mono resize-none leading-relaxed transition-colors"
              />
              <div className="flex items-center justify-between mt-2 gap-2">
                {/* Tag selector */}
                <div className="flex gap-1.5 overflow-x-auto scrollbar-hide flex-1">
                  {ALL_TAGS.slice(0, 6).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setNewTag(tag)}
                      className={`text-[9px] sm:text-[10px] px-2 py-1 border font-mono shrink-0 tracking-wider transition-colors ${
                        newTag === tag
                          ? TAG_COLORS[tag] + " opacity-100"
                          : "border-[#1A1A1A] text-[#333] hover:text-[#555]"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handlePost}
                  disabled={submitting || !newString.trim()}
                  className="bg-[#FF6600] hover:bg-[#FF7722] disabled:bg-[#2A1A00] disabled:text-[#3A2A00] text-white text-[11px] font-bold px-3 sm:px-4 py-1.5 sm:py-2 font-mono tracking-wider transition-colors shrink-0"
                >
                  {submitting ? "..." : "POST"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tag filter */}
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          <button
            onClick={() => setActiveTag("ALL")}
            className={`text-[10px] sm:text-[11px] px-3 py-1.5 border font-mono shrink-0 tracking-wider transition-colors ${
              activeTag === "ALL"
                ? "border-[#FF6600] bg-[#FF6600]/10 text-[#FF6600]"
                : "border-[#1A1A1A] text-[#444] hover:text-[#777]"
            }`}
          >
            ALL
          </button>
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`text-[10px] sm:text-[11px] px-3 py-1.5 border font-mono shrink-0 tracking-wider transition-colors ${
                activeTag === tag
                  ? TAG_COLORS[tag]
                  : "border-[#1A1A1A] text-[#444] hover:text-[#777]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Strings feed */}
        <div className="space-y-2 sm:space-y-3">
          {sorted.map((post) => (
            <div
              key={post.id}
              className={`border bg-[#0D0D0D] p-3 sm:p-4 transition-colors ${
                post.pinned ? "border-[#FF6600]/30" : "border-[#1A1A1A] hover:border-[#252525]"
              }`}
            >
              {/* Post header */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#1A1A1A] border border-[#252525] flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-[#888] shrink-0">
                    {post.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[12px] sm:text-[13px] font-bold text-white truncate">{post.author}</span>
                      <span className={`text-[8px] sm:text-[9px] font-mono tracking-wider ${PLAN_COLOR[post.plan]}`}>
                        {post.plan}
                      </span>
                      {post.pinned && (
                        <span className="text-[8px] sm:text-[9px] text-[#FF6600] font-mono tracking-wider">📌 PINNED</span>
                      )}
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-[#333] font-mono">{post.time}</span>
                  </div>
                </div>
                <span className={`text-[8px] sm:text-[9px] px-1.5 py-0.5 border font-mono tracking-wider shrink-0 ${TAG_COLORS[post.tag]}`}>
                  {post.tag}
                </span>
              </div>

              {/* Content */}
              <p className="text-[12px] sm:text-[13px] text-[#999] leading-relaxed mb-3 font-mono">
                {post.content}
              </p>

              {/* Reactions + actions */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  {post.reactions.map((r) => (
                    <button
                      key={r.emoji}
                      onClick={() => handleReact(post.id, r.emoji)}
                      className={`flex items-center gap-1 text-[10px] sm:text-[11px] px-2 py-1 border transition-colors font-mono ${
                        r.reacted
                          ? "border-[#FF6600]/40 bg-[#FF6600]/10 text-[#FF6600]"
                          : "border-[#1A1A1A] text-[#444] hover:border-[#252525] hover:text-[#666]"
                      }`}
                    >
                      {r.emoji}
                      {r.count > 0 && <span>{r.count}</span>}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  {/* Replies */}
                  <button className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#333] hover:text-[#666] font-mono transition-colors">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {post.replies}
                  </button>

                  {/* Like */}
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1 text-[10px] sm:text-[11px] font-mono transition-colors ${
                      post.liked ? "text-[#FF6600]" : "text-[#333] hover:text-[#666]"
                    }`}
                  >
                    <svg className="w-3 h-3" fill={post.liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {post.likes}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {sorted.length === 0 && (
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-8 text-center">
              <p className="text-[#333] font-mono text-sm">No strings for {activeTag} yet. Be the first.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
