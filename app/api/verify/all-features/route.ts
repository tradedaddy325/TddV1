import { NextResponse } from 'next/server'
import { Anthropic } from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: {},
    summary: {},
  }

  try {
    // TEST 1: Claude API Connection
    console.log('[v0] Testing Claude API connection...')
    try {
      const claudeTest = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: 'Respond with "Claude connection successful" only.',
          },
        ],
      })
      results.tests.claude_connection = {
        status: 'PASS',
        response: claudeTest.content[0].type === 'text' ? claudeTest.content[0].text : 'Success',
      }
    } catch (error: any) {
      results.tests.claude_connection = {
        status: 'FAIL',
        error: error.message,
      }
    }

    // TEST 2: Gemini API Connection
    console.log('[v0] Testing Gemini API connection...')
    try {
      const geminiApiKey = process.env.GEMINI_API_KEY
      if (!geminiApiKey) {
        throw new Error('GEMINI_API_KEY not set in environment')
      }

      const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: 'Return current prices for XAUUSD, EURUSD, BTC in JSON format with symbol and price fields.',
                },
              ],
            },
          ],
        }),
        next: {
          revalidate: 0,
        }
      }).then((res) => res.json())

      results.tests.gemini_connection = {
        status: geminiResponse.candidates ? 'PASS' : 'FAIL',
        hasContent: !!geminiResponse.candidates?.[0]?.content,
      }
    } catch (error: any) {
      results.tests.gemini_connection = {
        status: 'FAIL',
        error: error.message,
      }
    }

    // TEST 3: Market Data API
    console.log('[v0] Testing Market Data API...')
    try {
      const marketDataResponse = await fetch(
        `${process.env.NODE_ENV === 'production' ? 'https://tradedaddy.co.za' : 'http://localhost:3000'}/api/market/live-data`,
        {
          next: { revalidate: 0 },
        }
      )
      const marketData = await marketDataResponse.json()
      results.tests.market_data = {
        status: marketData.data ? 'PASS' : 'FAIL',
        hasData: !!marketData.data,
        symbols: marketData.data ? Object.keys(marketData.data).slice(0, 5) : [],
      }
    } catch (error: any) {
      results.tests.market_data = {
        status: 'FAIL',
        error: error.message,
      }
    }

    // TEST 4: Claude Analysis API
    console.log('[v0] Testing Claude Analysis API...')
    try {
      const analysisResponse = await fetch(
        `${process.env.NODE_ENV === 'production' ? 'https://tradedaddy.co.za' : 'http://localhost:3000'}/api/analysis/claude`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            marketData: { XAUUSD: 2050, EURUSD: 1.09, BTC: 45000 },
            analysisType: 'sentiment',
          }),
          next: { revalidate: 0 },
        }
      )
      const analysis = await analysisResponse.json()
      results.tests.claude_analysis = {
        status: analysis.analysis ? 'PASS' : 'FAIL',
        hasAnalysis: !!analysis.analysis,
        analysisLength: analysis.analysis ? analysis.analysis.length : 0,
      }
    } catch (error: any) {
      results.tests.claude_analysis = {
        status: 'FAIL',
        error: error.message,
      }
    }

    // TEST 5: Sentiment Analysis
    console.log('[v0] Testing Sentiment Analysis...')
    try {
      const sentimentResponse = await fetch(
        `${process.env.NODE_ENV === 'production' ? 'https://tradedaddy.co.za' : 'http://localhost:3000'}/api/analysis/claude`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            marketData: { XAUUSD: 2050, EURUSD: 1.09 },
            analysisType: 'sentiment',
          }),
          next: { revalidate: 0 },
        }
      )
      const sentiment = await sentimentResponse.json()
      results.tests.sentiment_analysis = {
        status: sentiment.analysis ? 'PASS' : 'FAIL',
        hasSentiment: !!sentiment.analysis,
      }
    } catch (error: any) {
      results.tests.sentiment_analysis = {
        status: 'FAIL',
        error: error.message,
      }
    }

    // TEST 6: Trading Signals (Claude)
    console.log('[v0] Testing Trading Signals...')
    try {
      const signalResponse = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content:
              'Generate a trading signal for XAUUSD at 2050 with entry, stop loss, take profit, and confidence score in JSON format.',
          },
        ],
      })
      results.tests.trading_signals = {
        status: signalResponse.content[0].type === 'text' ? 'PASS' : 'FAIL',
        hasSignal: !!signalResponse.content[0],
      }
    } catch (error: any) {
      results.tests.trading_signals = {
        status: 'FAIL',
        error: error.message,
      }
    }

    // TEST 7: Market Psychology
    console.log('[v0] Testing Market Psychology...')
    try {
      const psychologyResponse = await fetch(
        `${process.env.NODE_ENV === 'production' ? 'https://tradedaddy.co.za' : 'http://localhost:3000'}/api/analysis/claude`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            marketData: { XAUUSD: 2050, EURUSD: 1.09, BTC: 45000 },
            analysisType: 'psychology',
          }),
          next: { revalidate: 0 },
        }
      )
      const psychology = await psychologyResponse.json()
      results.tests.market_psychology = {
        status: psychology.analysis ? 'PASS' : 'FAIL',
        hasPsychology: !!psychology.analysis,
      }
    } catch (error: any) {
      results.tests.market_psychology = {
        status: 'FAIL',
        error: error.message,
      }
    }

    // TEST 8: Community Moderation (Claude)
    console.log('[v0] Testing Community Moderation...')
    try {
      const moderationResponse = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content:
              'Moderate this post for spam/scam: "Check out my new trading bot - guaranteed 1000% returns!" Reply with JSON: {approved: boolean, reason: string}',
          },
        ],
      })
      results.tests.community_moderation = {
        status: moderationResponse.content[0].type === 'text' ? 'PASS' : 'FAIL',
        hasModeration: !!moderationResponse.content[0],
      }
    } catch (error: any) {
      results.tests.community_moderation = {
        status: 'FAIL',
        error: error.message,
      }
    }

    // Calculate Summary
    const passCount = Object.values(results.tests).filter((t: any) => t.status === 'PASS').length
    const totalCount = Object.keys(results.tests).length

    results.summary = {
      totalTests: totalCount,
      passed: passCount,
      failed: totalCount - passCount,
      passPercentage: ((passCount / totalCount) * 100).toFixed(2),
      allTestsPassed: passCount === totalCount,
    }

    console.log('[v0] Verification complete:', results.summary)
    return NextResponse.json(results)
  } catch (error: any) {
    console.error('[v0] Verification error:', error)
    return NextResponse.json(
      {
        error: 'Verification failed',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
