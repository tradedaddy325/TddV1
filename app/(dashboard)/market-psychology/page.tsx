import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Brain, Lightbulb, Activity, BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Market Psychology | TRADEDADDY',
  description: 'Understanding market psychology and trader behavior patterns',
}

export default async function MarketPsychologyPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <main className="flex-1 overflow-auto bg-black min-h-screen">
      <div className="p-6 space-y-6 max-w-6xl">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Market Psychology</h1>
          <p className="text-gray-400">Understanding market sentiment and trader behavior patterns</p>
        </div>

        {/* Coming Soon Banner */}
        <div className="p-8 rounded-xl border border-blue-800 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 space-y-4 text-center">
          <div className="flex justify-center">
            <Brain className="w-16 h-16 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Deep dive into market psychology with real-time sentiment analysis, behavioral pattern recognition, and trader psychology insights powered by AI.
          </p>
          <div className="flex gap-2 justify-center pt-4">
            <div className="px-4 py-2 bg-blue-600/20 border border-blue-600 rounded-lg text-sm text-blue-300 font-mono">
              Sentiment Analysis
            </div>
            <div className="px-4 py-2 bg-cyan-600/20 border border-cyan-600 rounded-lg text-sm text-cyan-300 font-mono">
              Behavioral Patterns
            </div>
            <div className="px-4 py-2 bg-purple-600/20 border border-purple-600 rounded-lg text-sm text-purple-300 font-mono">
              Psychological Levels
            </div>
          </div>
        </div>

        {/* Key Topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/30 space-y-3">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-bold text-white">Trader Sentiment</h3>
            </div>
            <p className="text-sm text-gray-400">
              Real-time analysis of trader sentiment across social media, forums, and market data to gauge collective market mood.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/30 space-y-3">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-bold text-white">Psychological Levels</h3>
            </div>
            <p className="text-sm text-gray-400">
              Identify key psychological price levels where traders often act, creating natural support and resistance.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/30 space-y-3">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Cognitive Biases</h3>
            </div>
            <p className="text-sm text-gray-400">
              Learn about common cognitive biases like FOMO, panic selling, and anchoring that affect trading decisions.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/30 space-y-3">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Market Dynamics</h3>
            </div>
            <p className="text-sm text-gray-400">
              Understand how collective trader psychology influences market movements and creates trading opportunities.
            </p>
          </div>
        </div>

        {/* Lessons Preview */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Learn About</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              'Fear & Greed Index',
              'Support & Resistance Psychology',
              'Volume Profile Analysis',
              'Market Cycles & Phases',
              'Risk Management Mindset',
              'Discipline & Patience',
            ].map((topic) => (
              <div
                key={topic}
                className="p-4 rounded-lg border border-gray-800 bg-gray-900/30 text-center hover:border-blue-600 hover:bg-blue-900/20 transition-colors cursor-pointer group"
              >
                <p className="text-sm font-semibold text-gray-300 group-hover:text-blue-300 transition-colors">
                  {topic}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="p-6 rounded-xl border border-green-800 bg-green-900/20 text-center space-y-4">
          <p className="text-white font-semibold">Master the psychological aspects of trading</p>
          <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
            Get Notified
          </button>
        </div>
      </div>
    </main>
  )
}
