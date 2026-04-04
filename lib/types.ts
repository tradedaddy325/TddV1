export interface Profile {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  credits: number
  subscription_tier: 'free' | 'basic' | 'pro' | 'elite'
  subscription_expires_at: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface JournalEntry {
  id: string
  user_id: string
  pair: string
  direction: 'long' | 'short'
  entry_price: number
  exit_price: number | null
  lot_size: number
  stop_loss: number | null
  take_profit: number | null
  pnl: number | null
  pnl_percent: number | null
  notes: string | null
  screenshot_url: string | null
  tags: string[]
  status: 'open' | 'closed' | 'cancelled'
  entry_date: string
  exit_date: string | null
  created_at: string
  updated_at: string
}

export interface CreditTransaction {
  id: string
  user_id: string
  amount: number
  type: 'purchase' | 'usage' | 'bonus' | 'refund'
  description: string | null
  reference_id: string | null
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  tier: 'basic' | 'pro' | 'elite'
  status: 'active' | 'cancelled' | 'expired' | 'past_due'
  yoco_subscription_id: string | null
  current_period_start: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}

export interface AcademyProgress {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  score: number | null
  completed_at: string | null
  created_at: string
}

export interface Watchlist {
  id: string
  user_id: string
  name: string
  symbols: string[]
  created_at: string
  updated_at: string
}

export interface PriceAlert {
  id: string
  user_id: string
  symbol: string
  condition: 'above' | 'below' | 'crosses'
  target_price: number
  triggered: boolean
  triggered_at: string | null
  created_at: string
}

// Market Data Types
export interface MarketPrice {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  high24h?: number
  low24h?: number
  volume?: number
  lastUpdated: string
}

export interface MarketCategory {
  id: string
  name: string
  icon: string
  prices: MarketPrice[]
}

// Credit Packages
export interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number // in ZAR cents
  popular?: boolean
}

// Subscription Tiers
export interface SubscriptionTier {
  id: 'basic' | 'pro' | 'elite'
  name: string
  price: number // in ZAR cents per month
  features: string[]
  creditsPerMonth: number
  popular?: boolean
}

// Calculator Types
export interface PipCalculatorResult {
  pipValue: number
  pipValueUSD: number
}

export interface LotSizeResult {
  lots: number
  units: number
  margin: number
}

export interface RiskRewardResult {
  ratio: number
  potentialProfit: number
  potentialLoss: number
  breakEvenWinRate: number
}

// Academy Types
export interface Lesson {
  id: string
  title: string
  description: string
  duration: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  videoUrl?: string
  content: string
  quiz?: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

// Navigation Types
export interface NavItem {
  title: string
  href: string
  icon: string
  badge?: string | number
  children?: NavItem[]
}
