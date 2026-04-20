import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TrendingUp, Target, BarChart3, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Predictive Markets | TRADEDADDY',
  description: 'AI-powered market predictions and forecasting tools',
}

export default async function PredictiveMarketsPage() {
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
          <h1 className="text-3xl font-bold text-white">Predictive Markets</h1>
          <p className="text-gray-400">AI-powered market predictions and forecasting tools</p>
        </div>

        {/* Coming Soon Banner */}
        <div className="p-8 rounded-xl border border-purple-800 bg-gradient-to-r from-purple-900/30 to-pink-900/30 space-y-4 text-center">
          <div className="flex justify-center">
            <TrendingUp className="w-16 h-16 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our advanced predictive market analysis tools are being developed to help you forecast market movements with AI-powered insights. Stay tuned for the release!
          </p>
          <div className="flex gap-2 justify-center pt-4">
            <div className="px-4 py-2 bg-purple-600/20 border border-purple-600 rounded-lg text-sm text-purple-300 font-mono">
              AI Powered
            </div>
            <div className="px-4 py-2 bg-pink-600/20 border border-pink-600 rounded-lg text-sm text-pink-300 font-mono">
              Real-time Data
            </div>
            <div className="px-4 py-2 bg-blue-600/20 border border-blue-600 rounded-lg text-sm text-blue-300 font-mono">
              Accuracy Tracking
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/30 space-y-3">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-bold text-white">Price Targets</h3>
            </div>
            <p className="text-sm text-gray-400">
              Get AI-generated price targets for your favorite trading pairs with confidence levels and timeframes.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/30 space-y-3">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Trend Analysis</h3>
            </div>
            <p className="text-sm text-gray-400">
              Comprehensive trend forecasting using advanced machine learning models trained on historical data.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/30 space-y-3">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-bold text-white">Volatility Predictions</h3>
            </div>
            <p className="text-sm text-gray-400">
              Anticipate market volatility and adjust your trading strategies accordingly with predictive insights.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/30 space-y-3">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Market Correlations</h3>
            </div>
            <p className="text-sm text-gray-400">
              Discover hidden correlations between different assets and use them to optimize your portfolio.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="p-6 rounded-xl border border-green-800 bg-green-900/20 text-center space-y-4">
          <p className="text-white font-semibold">Be among the first to access Predictive Markets</p>
          <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
            Notify Me
          </button>
        </div>
      </div>
    </main>
  )
}
