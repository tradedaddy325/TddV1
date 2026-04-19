"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  TrendingUp,
  BarChart2,
  Shield,
  Brain,
  Zap,
  ChevronRight,
  Play,
  Lock,
  CheckCircle,
  Star,
  Clock,
  Target,
  ArrowRight,
} from "lucide-react"

interface Lesson {
  id: string
  title: string
  description: string
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  locked: boolean
  completed?: boolean
}

interface Course {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  lessons: Lesson[]
  totalLessons: number
  completedLessons: number
}

const COURSES: Course[] = [
  {
    id: "fundamentals",
    title: "Trading Fundamentals",
    description: "Master the core concepts every trader must know",
    icon: <BookOpen className="w-5 h-5" />,
    color: "blue",
    totalLessons: 8,
    completedLessons: 0,
    lessons: [
      { id: "f1", title: "What is Forex Trading?", description: "Understanding the foreign exchange market, how it works, and who participates in it.", duration: "8 min", difficulty: "Beginner", locked: false },
      { id: "f2", title: "Currency Pairs Explained", description: "Major, minor, and exotic pairs — how to read them and what moves them.", duration: "10 min", difficulty: "Beginner", locked: false },
      { id: "f3", title: "How to Read a Price Quote", description: "Bid, ask, spread — the building blocks of every trade.", duration: "6 min", difficulty: "Beginner", locked: false },
      { id: "f4", title: "Understanding Lots & Pip Value", description: "Calculate your exposure and know exactly what each pip is worth.", duration: "12 min", difficulty: "Beginner", locked: true },
      { id: "f5", title: "Leverage & Margin", description: "How leverage amplifies both profits and losses — and how to use it responsibly.", duration: "15 min", difficulty: "Intermediate", locked: true },
      { id: "f6", title: "Market Sessions & Best Times to Trade", description: "London, New York, Tokyo — when liquidity is highest and volatility peaks.", duration: "10 min", difficulty: "Beginner", locked: true },
      { id: "f7", title: "Order Types: Market, Limit & Stop", description: "Execute trades with precision using the right order type for every situation.", duration: "14 min", difficulty: "Intermediate", locked: true },
      { id: "f8", title: "Your First Trade Walkthrough", description: "Step-by-step: enter, manage, and close your first position confidently.", duration: "20 min", difficulty: "Beginner", locked: true },
    ],
  },
  {
    id: "technical",
    title: "Technical Analysis",
    description: "Read charts like a professional trader",
    icon: <BarChart2 className="w-5 h-5" />,
    color: "purple",
    totalLessons: 10,
    completedLessons: 0,
    lessons: [
      { id: "t1", title: "Candlestick Patterns", description: "Doji, hammer, engulfing — the signals hidden in every candle.", duration: "18 min", difficulty: "Intermediate", locked: false },
      { id: "t2", title: "Support & Resistance Levels", description: "Identify key price zones where buyers and sellers battle it out.", duration: "15 min", difficulty: "Beginner", locked: false },
      { id: "t3", title: "Trend Lines & Channels", description: "Draw and trade with high-probability trend structures.", duration: "12 min", difficulty: "Intermediate", locked: true },
      { id: "t4", title: "Moving Averages", description: "SMA vs EMA — how to use them for trend identification and signals.", duration: "16 min", difficulty: "Intermediate", locked: true },
      { id: "t5", title: "RSI & Momentum Indicators", description: "Spot overbought and oversold conditions before the crowd.", duration: "14 min", difficulty: "Intermediate", locked: true },
      { id: "t6", title: "MACD Deep Dive", description: "The go-to momentum tool explained from theory to application.", duration: "20 min", difficulty: "Intermediate", locked: true },
      { id: "t7", title: "Fibonacci Retracements", description: "How the golden ratio creates powerful entry and target levels.", duration: "22 min", difficulty: "Advanced", locked: true },
      { id: "t8", title: "Chart Patterns: Heads, Triangles & More", description: "Recognize and trade the classic patterns that repeat across all markets.", duration: "25 min", difficulty: "Advanced", locked: true },
      { id: "t9", title: "Multi-Timeframe Analysis", description: "Align the big picture with precision entries for high-probability setups.", duration: "18 min", difficulty: "Advanced", locked: true },
      { id: "t10", title: "Volume & Market Structure", description: "Understand who's really driving price and how to follow smart money.", duration: "20 min", difficulty: "Advanced", locked: true },
    ],
  },
  {
    id: "risk",
    title: "Risk Management",
    description: "Protect your capital and trade to survive long-term",
    icon: <Shield className="w-5 h-5" />,
    color: "green",
    totalLessons: 6,
    completedLessons: 0,
    lessons: [
      { id: "r1", title: "The 1% Rule", description: "Why risking just 1% per trade is the single most important habit in trading.", duration: "8 min", difficulty: "Beginner", locked: false },
      { id: "r2", title: "Stop Loss Placement", description: "Where to put your stop so the market doesn't hunt you — and when to widen it.", duration: "14 min", difficulty: "Intermediate", locked: false },
      { id: "r3", title: "Risk-to-Reward Ratios", description: "Why a 40% win rate can still be profitable — math that changes everything.", duration: "10 min", difficulty: "Beginner", locked: true },
      { id: "r4", title: "Position Sizing Formulas", description: "Calculate the perfect lot size for every single trade automatically.", duration: "16 min", difficulty: "Intermediate", locked: true },
      { id: "r5", title: "Drawdown Recovery Strategy", description: "How to respond when you're in a losing streak without blowing the account.", duration: "18 min", difficulty: "Advanced", locked: true },
      { id: "r6", title: "Building a Risk Framework", description: "Create your personal risk management system for consistent, disciplined trading.", duration: "22 min", difficulty: "Advanced", locked: true },
    ],
  },
  {
    id: "psychology",
    title: "Trading Psychology",
    description: "Master your mindset and eliminate emotional trading",
    icon: <Brain className="w-5 h-5" />,
    color: "orange",
    totalLessons: 7,
    completedLessons: 0,
    lessons: [
      { id: "p1", title: "The Two Enemies: Fear & Greed", description: "How these emotions silently destroy accounts — and practical tools to neutralize them.", duration: "12 min", difficulty: "Beginner", locked: false },
      { id: "p2", title: "What is Tilt?", description: "Recognize when you've lost your edge and exactly how to step back.", duration: "10 min", difficulty: "Beginner", locked: false },
      { id: "p3", title: "Revenge Trading", description: "The trap that turns small losses into catastrophic ones — and how to avoid it.", duration: "8 min", difficulty: "Beginner", locked: true },
      { id: "p4", title: "Building a Pre-Trade Routine", description: "A daily ritual that puts you in the optimal mental state before you open a chart.", duration: "14 min", difficulty: "Intermediate", locked: true },
      { id: "p5", title: "Journaling for Performance", description: "How professional traders use a journal to identify patterns in their own behavior.", duration: "16 min", difficulty: "Intermediate", locked: true },
      { id: "p6", title: "Detaching from Outcomes", description: "Think in probabilities, not individual trades — the pro mindset shift.", duration: "18 min", difficulty: "Advanced", locked: true },
      { id: "p7", title: "Building Long-Term Consistency", description: "The habits and systems that separate profitable traders from the 90% who quit.", duration: "20 min", difficulty: "Advanced", locked: true },
    ],
  },
  {
    id: "strategies",
    title: "Trading Strategies",
    description: "Proven setups you can apply to live markets today",
    icon: <Target className="w-5 h-5" />,
    color: "teal",
    totalLessons: 8,
    completedLessons: 0,
    lessons: [
      { id: "s1", title: "Trend Following 101", description: "The oldest and most reliable edge in markets — how to identify and ride strong trends.", duration: "16 min", difficulty: "Intermediate", locked: false },
      { id: "s2", title: "Breakout Trading", description: "Catch explosive moves as price breaks through key levels with conviction.", duration: "14 min", difficulty: "Intermediate", locked: true },
      { id: "s3", title: "Pullback Entries", description: "Wait for the market to come to you — enter with tight stops and great R:R.", duration: "18 min", difficulty: "Intermediate", locked: true },
      { id: "s4", title: "Range Trading", description: "Profit in sideways markets by trading between clearly defined support and resistance.", duration: "15 min", difficulty: "Intermediate", locked: true },
      { id: "s5", title: "News Trading Basics", description: "How to position around high-impact economic events without gambling.", duration: "20 min", difficulty: "Advanced", locked: true },
      { id: "s6", title: "The London Open Strategy", description: "One of the most consistent intraday setups — step-by-step execution.", duration: "22 min", difficulty: "Advanced", locked: true },
      { id: "s7", title: "Scalping vs Swing Trading", description: "Which style fits your personality, schedule, and risk tolerance.", duration: "14 min", difficulty: "Intermediate", locked: true },
      { id: "s8", title: "Building Your Own Strategy", description: "The framework to create, backtest, and refine a strategy that's truly yours.", duration: "30 min", difficulty: "Advanced", locked: true },
    ],
  },
]

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  blue: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", badge: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400", badge: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  green: { bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-400", badge: "bg-green-500/20 text-green-400 border-green-500/30" },
  orange: { bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400", badge: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  teal: { bg: "bg-teal-500/10", border: "border-teal-500/20", text: "text-teal-400", badge: "bg-teal-500/20 text-teal-400 border-teal-500/30" },
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: "text-green-400 bg-green-500/10 border-green-500/20",
  Intermediate: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  Advanced: "text-red-400 bg-red-500/10 border-red-500/20",
}

export default function LearnPage() {
  const router = useRouter()
  const [activeCourse, setActiveCourse] = useState<string | null>(null)
  const [activeLesson, setActiveLesson] = useState<{ courseId: string; lesson: Lesson } | null>(null)

  const course = activeCourse ? COURSES.find((c) => c.id === activeCourse) : null

  // Lesson detail view
  if (activeLesson) {
    const c = COURSES.find((x) => x.id === activeLesson.courseId)!
    const colors = COLOR_MAP[c.color]
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="sticky top-0 z-10 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 px-4 py-4">
          <div className="flex items-center gap-3 max-w-lg mx-auto">
            <button onClick={() => setActiveLesson(null)} className="text-gray-400 hover:text-white transition-colors">
              ← Back
            </button>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${DIFFICULTY_COLOR[activeLesson.lesson.difficulty]}`}>
              {activeLesson.lesson.difficulty}
            </span>
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-2">{activeLesson.lesson.title}</h1>
          <div className="flex items-center gap-3 text-sm text-gray-400 mb-8">
            <Clock className="w-4 h-4" />
            <span>{activeLesson.lesson.duration} read</span>
            <span>·</span>
            <span className={colors.text}>{c.title}</span>
          </div>

          {activeLesson.lesson.locked ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-xl font-bold mb-2">Premium Content</h2>
              <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">Upgrade to Premium to unlock all {COURSES.reduce((a, c) => a + c.totalLessons, 0)} lessons across all courses.</p>
              <button
                onClick={() => router.push("/profile")}
                className="px-8 py-3.5 rounded-xl bg-yellow-500/80 hover:bg-yellow-500 text-black font-bold text-sm transition-colors"
              >
                Upgrade to Premium
              </button>
            </div>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none">
              <p className="text-gray-300 text-base leading-relaxed mb-6">{activeLesson.lesson.description}</p>
              <div className="bg-[#141414] rounded-2xl border border-white/8 p-6 mb-6">
                <h3 className="font-bold text-base mb-3 text-white">What You'll Learn</h3>
                <ul className="space-y-2">
                  {["Core concepts and definitions", "Practical application in live markets", "Common mistakes and how to avoid them", "Key takeaways and action steps"].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-500/5 border border-green-500/15 rounded-2xl p-5">
                <p className="text-green-400 text-sm font-semibold mb-1">📖 Full lesson coming soon</p>
                <p className="text-gray-400 text-sm">This lesson is being written by professional traders. Check back soon for the full content.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Course detail view
  if (course) {
    const colors = COLOR_MAP[course.color]
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="sticky top-0 z-10 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 px-4 py-4">
          <div className="flex items-center gap-3 max-w-lg mx-auto">
            <button onClick={() => setActiveCourse(null)} className="text-gray-400 hover:text-white transition-colors">
              ← Back
            </button>
            <span className="text-gray-400 text-sm">{course.title}</span>
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 py-6 pb-24">
          <div className={`${colors.bg} border ${colors.border} rounded-2xl p-5 mb-6`}>
            <div className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-3 ${colors.text}`}>
              {course.icon}
            </div>
            <h1 className="text-2xl font-bold mb-1">{course.title}</h1>
            <p className="text-gray-400 text-sm">{course.description}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
              <span>{course.totalLessons} lessons</span>
              <span>·</span>
              <span>{course.lessons.filter((l) => !l.locked).length} free</span>
            </div>
          </div>

          <div className="space-y-2">
            {course.lessons.map((lesson, idx) => (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson({ courseId: course.id, lesson })}
                className="w-full text-left bg-[#141414] rounded-xl border border-white/8 p-4 hover:bg-[#1a1a1a] hover:border-white/15 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${lesson.locked ? "bg-white/5 text-gray-600" : `${colors.bg} ${colors.text}`}`}>
                    {lesson.locked ? <Lock className="w-3.5 h-3.5" /> : <span>{idx + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-semibold text-sm ${lesson.locked ? "text-gray-500" : "text-white"}`}>{lesson.title}</p>
                      <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{lesson.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-xs px-1.5 py-0.5 rounded border ${DIFFICULTY_COLOR[lesson.difficulty]}`}>{lesson.difficulty}</span>
                      <span className="text-gray-600 text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{lesson.duration}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Main learn page
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="sticky top-0 z-10 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 px-4 py-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold tracking-tight">Learn</h1>
          <p className="text-gray-500 text-sm mt-0.5">Trading Academy</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 pb-24 space-y-4">

        {/* Hero Banner */}
        <div className="relative bg-gradient-to-br from-green-500/15 via-green-500/5 to-transparent border border-green-500/20 rounded-2xl p-5 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -translate-y-8 translate-x-8" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-sm font-semibold">TradeDaddy Academy</span>
            </div>
            <h2 className="text-xl font-bold mb-1">Master the Markets</h2>
            <p className="text-gray-400 text-sm mb-4">
              {COURSES.reduce((a, c) => a + c.totalLessons, 0)} lessons across {COURSES.length} courses — from complete beginner to confident trader.
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /><span>Expert-written</span></div>
              <span>·</span>
              <div className="flex items-center gap-1"><Target className="w-3.5 h-3.5 text-green-400" /><span>Practical setups</span></div>
              <span>·</span>
              <div className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-blue-400" /><span>Any level</span></div>
            </div>
          </div>
        </div>

        {/* Courses */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Courses</h2>
          <div className="space-y-3">
            {COURSES.map((c) => {
              const colors = COLOR_MAP[c.color]
              const freeLessons = c.lessons.filter((l) => !l.locked).length
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCourse(c.id)}
                  className="w-full text-left bg-[#141414] rounded-2xl border border-white/8 p-5 hover:bg-[#1a1a1a] hover:border-white/15 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0 ${colors.text}`}>
                      {c.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-base">{c.title}</h3>
                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0 mt-0.5" />
                      </div>
                      <p className="text-gray-400 text-sm mt-0.5">{c.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-xs text-gray-500">{c.totalLessons} lessons</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${colors.badge}`}>
                          {freeLessons} free
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="bg-[#141414] rounded-2xl border border-yellow-500/20 p-5 text-center">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6 text-yellow-400" />
          </div>
          <h3 className="font-bold text-base mb-1">Unlock All {COURSES.reduce((a, c) => a + c.totalLessons, 0)} Lessons</h3>
          <p className="text-gray-400 text-sm mb-4">Premium members get full access to every course, including advanced strategies and live examples.</p>
          <button
            onClick={() => router.push("/profile")}
            className="w-full py-3.5 rounded-xl bg-yellow-500/80 hover:bg-yellow-500 text-black font-bold text-sm transition-colors"
          >
            Upgrade to Premium
          </button>
        </div>

      </div>
    </div>
  )
}
