"use client"

import { useState } from "react"
import { BookOpen, Play, CheckCircle, Lock, Clock, Award, ChevronRight, Star, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import useSWR from "swr"

interface Lesson {
  id: string
  title: string
  description: string
  duration: string
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
  videoUrl?: string
  content?: string
}

interface Module {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  lessons: Lesson[]
  requiredTier: "free" | "basic" | "pro" | "elite"
}

const modules: Module[] = [
  {
    id: "fundamentals",
    title: "Trading Fundamentals",
    description: "Master the basics of forex and CFD trading",
    icon: <BookOpen className="h-6 w-6" />,
    requiredTier: "free",
    lessons: [
      { id: "f1", title: "What is Forex Trading?", description: "Understanding currency pairs and the forex market", duration: "15 min", difficulty: "beginner", category: "fundamentals" },
      { id: "f2", title: "Pips, Lots, and Leverage", description: "Essential terminology every trader must know", duration: "20 min", difficulty: "beginner", category: "fundamentals" },
      { id: "f3", title: "Reading Currency Quotes", description: "How to interpret bid, ask, and spread", duration: "12 min", difficulty: "beginner", category: "fundamentals" },
      { id: "f4", title: "Types of Orders", description: "Market, limit, stop, and pending orders explained", duration: "18 min", difficulty: "beginner", category: "fundamentals" },
      { id: "f5", title: "Trading Sessions", description: "Understanding market hours and volatility", duration: "14 min", difficulty: "beginner", category: "fundamentals" },
    ],
  },
  {
    id: "technical-analysis",
    title: "Technical Analysis",
    description: "Learn to read charts and identify patterns",
    icon: <Star className="h-6 w-6" />,
    requiredTier: "basic",
    lessons: [
      { id: "t1", title: "Candlestick Patterns", description: "Reading and interpreting candlestick formations", duration: "25 min", difficulty: "intermediate", category: "technical" },
      { id: "t2", title: "Support and Resistance", description: "Finding key price levels on any chart", duration: "22 min", difficulty: "intermediate", category: "technical" },
      { id: "t3", title: "Trend Lines and Channels", description: "Drawing and trading with trend lines", duration: "20 min", difficulty: "intermediate", category: "technical" },
      { id: "t4", title: "Moving Averages", description: "Using MAs for trend identification and entries", duration: "18 min", difficulty: "intermediate", category: "technical" },
      { id: "t5", title: "Fibonacci Retracements", description: "Applying Fibonacci levels to your trading", duration: "28 min", difficulty: "intermediate", category: "technical" },
      { id: "t6", title: "Chart Patterns", description: "Head & shoulders, triangles, flags and more", duration: "35 min", difficulty: "intermediate", category: "technical" },
    ],
  },
  {
    id: "risk-management",
    title: "Risk Management",
    description: "Protect your capital and trade sustainably",
    icon: <Award className="h-6 w-6" />,
    requiredTier: "basic",
    lessons: [
      { id: "r1", title: "Position Sizing", description: "How much to risk per trade", duration: "20 min", difficulty: "intermediate", category: "risk" },
      { id: "r2", title: "Stop Loss Strategies", description: "Setting and managing stop losses effectively", duration: "25 min", difficulty: "intermediate", category: "risk" },
      { id: "r3", title: "Risk-Reward Ratios", description: "Ensuring your winners outweigh losers", duration: "18 min", difficulty: "intermediate", category: "risk" },
      { id: "r4", title: "Trading Psychology", description: "Managing emotions and avoiding FOMO", duration: "30 min", difficulty: "intermediate", category: "risk" },
      { id: "r5", title: "Building a Trading Plan", description: "Creating rules you can actually follow", duration: "35 min", difficulty: "intermediate", category: "risk" },
    ],
  },
  {
    id: "advanced-strategies",
    title: "Advanced Strategies",
    description: "Professional trading techniques and systems",
    icon: <GraduationCap className="h-6 w-6" />,
    requiredTier: "pro",
    lessons: [
      { id: "a1", title: "Smart Money Concepts", description: "Trading with institutional order flow", duration: "45 min", difficulty: "advanced", category: "advanced" },
      { id: "a2", title: "ICT Methodology", description: "Inner Circle Trader concepts explained", duration: "60 min", difficulty: "advanced", category: "advanced" },
      { id: "a3", title: "Order Blocks and Breakers", description: "Finding institutional entry points", duration: "40 min", difficulty: "advanced", category: "advanced" },
      { id: "a4", title: "Liquidity Concepts", description: "Understanding where stops are hunted", duration: "35 min", difficulty: "advanced", category: "advanced" },
      { id: "a5", title: "Multi-Timeframe Analysis", description: "Aligning the higher and lower timeframes", duration: "30 min", difficulty: "advanced", category: "advanced" },
      { id: "a6", title: "News Trading", description: "Capitalizing on economic releases", duration: "40 min", difficulty: "advanced", category: "advanced" },
    ],
  },
  {
    id: "gold-trading",
    title: "Gold Trading Mastery",
    description: "Specialized strategies for XAUUSD",
    icon: <Star className="h-6 w-6 text-terminal-yellow" />,
    requiredTier: "elite",
    lessons: [
      { id: "g1", title: "Gold Market Fundamentals", description: "What moves the gold market", duration: "25 min", difficulty: "advanced", category: "gold" },
      { id: "g2", title: "Gold Correlations", description: "DXY, yields, and geopolitical factors", duration: "30 min", difficulty: "advanced", category: "gold" },
      { id: "g3", title: "Gold Trading Sessions", description: "Best times to trade XAUUSD", duration: "20 min", difficulty: "advanced", category: "gold" },
      { id: "g4", title: "Gold Scalping Strategies", description: "Quick profits on gold volatility", duration: "45 min", difficulty: "advanced", category: "gold" },
      { id: "g5", title: "Gold Swing Trading", description: "Catching major gold moves", duration: "40 min", difficulty: "advanced", category: "gold" },
    ],
  },
]

const fetcher = async () => {
  const supabase = createClient()
  const { data, error } = await supabase.from("academy_progress").select("*")
  if (error) throw error
  return data
}

export default function AcademyPage() {
  const { data: progress } = useSWR("academy_progress", fetcher)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)

  const completedLessons = progress?.filter(p => p.completed).map(p => p.lesson_id) || []
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0)
  const overallProgress = (completedLessons.length / totalLessons) * 100

  const isLessonCompleted = (lessonId: string) => completedLessons.includes(lessonId)

  const markLessonComplete = async (lessonId: string) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from("academy_progress").upsert({
      user_id: user.id,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString(),
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "text-terminal-green border-terminal-green/30"
      case "intermediate": return "text-terminal-yellow border-terminal-yellow/30"
      case "advanced": return "text-terminal-red border-terminal-red/30"
      default: return ""
    }
  }

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "free": return <Badge variant="outline" className="border-terminal-green/30 text-terminal-green">FREE</Badge>
      case "basic": return <Badge variant="outline" className="border-terminal-cyan/30 text-terminal-cyan">BASIC</Badge>
      case "pro": return <Badge variant="outline" className="border-terminal-yellow/30 text-terminal-yellow">PRO</Badge>
      case "elite": return <Badge className="border-0 bg-gradient-to-r from-terminal-yellow to-amber-500 text-background">ELITE</Badge>
      default: return null
    }
  }

  if (selectedLesson && selectedModule) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setSelectedLesson(null)} className="text-terminal-cyan">
          {"<"} Back to {selectedModule.title}
        </Button>
        
        <Card className="border-terminal-green/20 bg-card/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="outline" className={getDifficultyColor(selectedLesson.difficulty)}>
                  {selectedLesson.difficulty.toUpperCase()}
                </Badge>
                <CardTitle className="mt-2 font-mono text-xl text-terminal-green">
                  {selectedLesson.title}
                </CardTitle>
                <CardDescription className="mt-1">{selectedLesson.description}</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{selectedLesson.duration}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="aspect-video rounded-lg border border-terminal-green/20 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <Play className="mx-auto h-16 w-16 text-terminal-green/50" />
                <p className="mt-4 font-mono text-muted-foreground">Video lesson content</p>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <h3 className="font-mono text-lg text-terminal-cyan">Lesson Notes</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground">
                  This lesson covers the essential concepts of {selectedLesson.title.toLowerCase()}. 
                  Make sure to take notes and practice these concepts in your demo account before 
                  applying them with real capital.
                </p>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                  <li>Key concept 1: Understanding the fundamentals</li>
                  <li>Key concept 2: Practical application examples</li>
                  <li>Key concept 3: Common mistakes to avoid</li>
                  <li>Key concept 4: Advanced tips and tricks</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="outline" className="border-terminal-green/30">
                Download Resources
              </Button>
              {isLessonCompleted(selectedLesson.id) ? (
                <Button disabled className="bg-terminal-green/20 text-terminal-green">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Completed
                </Button>
              ) : (
                <Button 
                  onClick={() => markLessonComplete(selectedLesson.id)}
                  className="bg-terminal-green text-background hover:bg-terminal-green/90"
                >
                  Mark as Complete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (selectedModule) {
    const moduleProgress = selectedModule.lessons.filter(l => isLessonCompleted(l.id)).length
    const moduleProgressPercent = (moduleProgress / selectedModule.lessons.length) * 100

    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setSelectedModule(null)} className="text-terminal-cyan">
          {"<"} Back to Academy
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-terminal-green/30 bg-terminal-green/10">
              {selectedModule.icon}
            </div>
            <div>
              <h1 className="font-mono text-2xl font-bold text-terminal-green">{selectedModule.title}</h1>
              <p className="text-muted-foreground">{selectedModule.description}</p>
            </div>
          </div>
          {getTierBadge(selectedModule.requiredTier)}
        </div>

        <Card className="border-terminal-green/20 bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm text-muted-foreground">Module Progress</span>
              <span className="font-mono text-sm text-terminal-green">{moduleProgress}/{selectedModule.lessons.length} lessons</span>
            </div>
            <Progress value={moduleProgressPercent} className="h-2" />
          </CardContent>
        </Card>

        <div className="space-y-3">
          {selectedModule.lessons.map((lesson, index) => (
            <Card 
              key={lesson.id} 
              className="border-terminal-green/20 bg-card/50 cursor-pointer transition-all hover:border-terminal-green/40"
              onClick={() => setSelectedLesson(lesson)}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                    isLessonCompleted(lesson.id) 
                      ? "border-terminal-green bg-terminal-green/20" 
                      : "border-terminal-green/30"
                  }`}>
                    {isLessonCompleted(lesson.id) ? (
                      <CheckCircle className="h-5 w-5 text-terminal-green" />
                    ) : (
                      <span className="font-mono text-sm text-muted-foreground">{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-mono font-medium">{lesson.title}</h3>
                    <p className="text-sm text-muted-foreground">{lesson.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className={getDifficultyColor(lesson.difficulty)}>
                    {lesson.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {lesson.duration}
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono text-2xl font-bold text-terminal-green">
          {">"} TRADE_ACADEMY
        </h1>
        <p className="text-muted-foreground font-mono text-sm">
          Master trading with our comprehensive curriculum
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="border-terminal-green/20 bg-card/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-mono text-lg text-terminal-green">Your Progress</h3>
              <p className="text-sm text-muted-foreground">
                {completedLessons.length} of {totalLessons} lessons completed
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono text-3xl font-bold text-terminal-cyan">{overallProgress.toFixed(0)}%</span>
            </div>
          </div>
          <Progress value={overallProgress} className="mt-4 h-3" />
        </CardContent>
      </Card>

      {/* Module Categories */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all" className="font-mono">All Modules</TabsTrigger>
          <TabsTrigger value="fundamentals" className="font-mono">Fundamentals</TabsTrigger>
          <TabsTrigger value="technical" className="font-mono">Technical</TabsTrigger>
          <TabsTrigger value="advanced" className="font-mono">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {modules.map((module) => {
              const moduleCompleted = module.lessons.filter(l => isLessonCompleted(l.id)).length
              const modulePercent = (moduleCompleted / module.lessons.length) * 100

              return (
                <Card 
                  key={module.id} 
                  className="border-terminal-green/20 bg-card/50 cursor-pointer transition-all hover:border-terminal-green/40"
                  onClick={() => setSelectedModule(module)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-terminal-green/30 bg-terminal-green/10 text-terminal-green">
                        {module.icon}
                      </div>
                      {getTierBadge(module.requiredTier)}
                    </div>
                    <CardTitle className="mt-4 font-mono">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{module.lessons.length} lessons</span>
                      <span className="font-mono text-terminal-green">{modulePercent.toFixed(0)}% complete</span>
                    </div>
                    <Progress value={modulePercent} className="mt-2 h-1.5" />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="fundamentals" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {modules.filter(m => m.id === "fundamentals").map((module) => (
              <Card 
                key={module.id} 
                className="border-terminal-green/20 bg-card/50 cursor-pointer transition-all hover:border-terminal-green/40"
                onClick={() => setSelectedModule(module)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-terminal-green/30 bg-terminal-green/10 text-terminal-green">
                      {module.icon}
                    </div>
                    {getTierBadge(module.requiredTier)}
                  </div>
                  <CardTitle className="mt-4 font-mono">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{module.lessons.length} lessons</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="technical" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {modules.filter(m => ["technical-analysis", "risk-management"].includes(m.id)).map((module) => (
              <Card 
                key={module.id} 
                className="border-terminal-green/20 bg-card/50 cursor-pointer transition-all hover:border-terminal-green/40"
                onClick={() => setSelectedModule(module)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-terminal-green/30 bg-terminal-green/10 text-terminal-green">
                      {module.icon}
                    </div>
                    {getTierBadge(module.requiredTier)}
                  </div>
                  <CardTitle className="mt-4 font-mono">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{module.lessons.length} lessons</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {modules.filter(m => ["advanced-strategies", "gold-trading"].includes(m.id)).map((module) => (
              <Card 
                key={module.id} 
                className="border-terminal-green/20 bg-card/50 cursor-pointer transition-all hover:border-terminal-green/40"
                onClick={() => setSelectedModule(module)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-terminal-green/30 bg-terminal-green/10 text-terminal-green">
                      {module.icon}
                    </div>
                    {getTierBadge(module.requiredTier)}
                  </div>
                  <CardTitle className="mt-4 font-mono">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{module.lessons.length} lessons</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
