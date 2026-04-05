'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, TrendingDown, BarChart3, Brain, Settings, RefreshCw } from 'lucide-react'

interface MacroData {
  indicator: string
  value: string
  change: number
  timeFrame: string
}

interface AIAnalysis {
  summary: string
  sentiment: 'bullish' | 'bearish' | 'neutral'
  confidence: number
  recommendations: string[]
}

export function MacroDeskTerminal() {
  const [macroData, setMacroData] = useState<MacroData[]>([])
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTab, setSelectedTab] = useState('overview')

  useEffect(() => {
    fetchMacroData()
  }, [])

  const fetchMacroData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/macro/data', {
        cache: 'no-store',
      })

      if (!response.ok) throw new Error('Failed to fetch macro data')

      const data = await response.json()
      setMacroData(data.indicators || [])

      // Fetch AI analysis
      const analysisResponse = await fetch('/api/ai/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ macroData: data.indicators }),
      })

      if (analysisResponse.ok) {
        const analysis = await analysisResponse.json()
        setAiAnalysis(analysis)
      }
    } catch (err) {
      console.error('[v0] Macro data error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Macro Desk Terminal</h1>
          <p className="text-muted-foreground">Real-time macroeconomic analysis powered by AI</p>
        </div>
        <Button
          onClick={fetchMacroData}
          disabled={isLoading}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Update
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Macro Overview
          </TabsTrigger>
          <TabsTrigger value="analysis" className="gap-2">
            <Brain className="w-4 h-4" />
            AI Analysis
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Macro Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {macroData.map((indicator) => (
              <Card key={indicator.indicator} className="border-border/50">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-mono uppercase">
                      {indicator.indicator}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-foreground">
                        {indicator.value}
                      </span>
                      <span
                        className={`text-sm font-semibold flex items-center gap-1 ${
                          indicator.change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {indicator.change >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {Math.abs(indicator.change)}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{indicator.timeFrame}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AI Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4">
          {aiAnalysis ? (
            <>
              <Card className="border-border/50 bg-gradient-to-r from-blue-900/20 to-cyan-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-cyan-400" />
                    AI Market Sentiment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Overall Sentiment</p>
                      <p className="text-2xl font-bold uppercase tracking-wider">
                        <span
                          className={
                            aiAnalysis.sentiment === 'bullish'
                              ? 'text-green-400'
                              : aiAnalysis.sentiment === 'bearish'
                                ? 'text-red-400'
                                : 'text-yellow-400'
                          }
                        >
                          {aiAnalysis.sentiment}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-2">Confidence</p>
                      <p className="text-2xl font-bold text-cyan-400">
                        {Math.round(aiAnalysis.confidence * 100)}%
                      </p>
                    </div>
                  </div>

                  <div className="bg-background/50 p-4 rounded border border-border/30">
                    <p className="text-foreground leading-relaxed">{aiAnalysis.summary}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground mb-3">
                      Recommendations:
                    </p>
                    <ul className="space-y-2">
                      {aiAnalysis.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                          <span className="text-cyan-400">→</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-border/50">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  {isLoading ? 'Loading AI analysis...' : 'No analysis available. Click Update to generate.'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Terminal Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Data Update Frequency</label>
                <select className="w-full px-3 py-2 bg-card border border-border rounded text-sm">
                  <option>Every 5 minutes</option>
                  <option>Every 15 minutes</option>
                  <option>Every 30 minutes</option>
                  <option>Hourly</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">AI Model</label>
                <select className="w-full px-3 py-2 bg-card border border-border rounded text-sm">
                  <option>Claude 3.5 Sonnet</option>
                  <option>GPT-4 Turbo</option>
                  <option>Gemini Pro</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm text-foreground">Enable notifications</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm text-foreground">Auto-refresh on market open</span>
                </label>
              </div>

              <Button className="w-full mt-4">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
