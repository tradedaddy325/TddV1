import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MessageSquare, TrendingUp, AlertCircle, Radio } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Market Strings | TRADEDADDY',
  description: 'Real-time market sentiment and social trading analytics',
}

export default async function MarketStringsPage() {
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
          <h1 className="text-3xl font-bold text-white">Market Strings</h1>
          <p className="text-gray-400">Real-time market sentiment, trading discussions, and social analytics</p>
        </div>

        {/* Coming Soon Banner */}
        <div className="p-8 rounded-xl border border-cyan-800 bg-gradient-to-r from-cyan-900/30 to-green-900/30 space-y-4 text-center">
          <div className="flex justify-center">
            <MessageSquare className="w-16 h-16 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Connect with the TRADEDADDY community, share trading ideas, analyze market sentiment, and get real-time insights from fellow traders.
          </p>
          <div className="flex gap-2 justify-center pt-4">
            <div className="px-4 py-2 bg-cyan-600/20 border border-cyan-600 rounded-lg text-sm text-cyan-300 font-mono">
              Live Chat
            </div>
            <div className="px-4 py-2 bg-green-600/20 border border-green-600 rounded-lg text-sm text-green-300 font-mono">
              Sentiment Tracking
            </div>
            <div className="px-4 py-2 bg-blue-600/20 border border-blue-600 rounded-lg text-sm text-blue-300 font-mono">
              Community Ideas
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/30 space-y-3">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Community Chat</h3>
            </div>
            <p className="text-sm text-gray-400">
              Join live discussions with traders, share trading ideas, and get real-time feedback from the community.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/30 space-y-3">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-bold text-white">Sentiment Analysis</h3>
            </div>
            <p className="text-sm text-gray-400">
              Track overall market sentiment by analyzing discussions and trading activity across the platform.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/30 space-y-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-bold text-white">Alerts & Notifications</h3>
            </div>
            <p className="text-sm text-gray-400">
              Get notified when significant sentiment shifts occur or when your peers share important market insights.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/30 space-y-3">
            <div className="flex items-center gap-3">
              <Radio className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Live Trading Room</h3>
            </div>
            <p className="text-sm text-gray-400">
              Participate in live trading sessions with expert traders and fellow community members.
            </p>
          </div>
        </div>

        {/* Sentiment Breakdown */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">What You'll Track</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Bullish Posts', value: '65%', color: 'green' },
              { label: 'Bearish Posts', value: '25%', color: 'red' },
              { label: 'Neutral Posts', value: '10%', color: 'gray' },
              { label: 'Active Traders', value: '1,234', color: 'blue' },
            ].map((item) => (
              <div
                key={item.label}
                className={`p-4 rounded-lg border border-${item.color}-800 bg-${item.color}-900/20 text-center`}
              >
                <div className={`text-2xl font-bold text-${item.color}-400 mb-1`}>{item.value}</div>
                <p className="text-sm text-gray-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Topics */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Popular Discussion Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { topic: 'Bitcoin Analysis', members: 342, trend: 'up' },
              { topic: 'Gold Trading', members: 289, trend: 'down' },
              { topic: 'Forex Pairs', members: 456, trend: 'up' },
              { topic: 'Risk Management', members: 178, trend: 'up' },
              { topic: 'Technical Analysis', members: 512, trend: 'stable' },
              { topic: 'News & Events', members: 298, trend: 'up' },
            ].map((item) => (
              <div
                key={item.topic}
                className="p-4 rounded-lg border border-gray-800 bg-gray-900/30 hover:border-cyan-600 hover:bg-cyan-900/20 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {item.topic}
                  </h3>
                  <span className={`text-xs font-mono ${
                    item.trend === 'up' ? 'text-green-400' : 
                    item.trend === 'down' ? 'text-red-400' : 
                    'text-gray-400'
                  }`}>
                    {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{item.members} members</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="p-6 rounded-xl border border-green-800 bg-green-900/20 text-center space-y-4">
          <p className="text-white font-semibold">Join the TRADEDADDY trading community</p>
          <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
            Get Early Access
          </button>
        </div>
      </div>
    </main>
  )
}
