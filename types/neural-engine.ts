// Type definitions for Neural Engine components

export interface TechnicalAnalysisData {
  id: string;
  asset: string;
  timeframe: string;
  price: string;
  trend: 'UPTREND' | 'DOWNTREND' | 'SIDEWAYS';
  keyLevels: {
    resistance: string[];
    support: string[];
  };
  indicators: {
    rsi: number;
    macd: {
      histogram: number;
    };
    movingAverages: {
      ma20: string;
      ma50: string;
    };
    bollinger: {
      upper: string;
      middle: string;
      lower: string;
    };
  };
  analysis: string;
}

export interface PsychologyData {
  marketMood: string;
  moodScore: number;
  bullishAssets: number;
  bearishAssets: number;
  neutralAssets: number;
  volatileAssets: number;
  emotions: {
    optimism: number;
    fear: number;
    greed: number;
    uncertainty: number;
    fomo: number;
  };
  narrative: string;
  sentimentByAssetClass: Array<{
    assets: string;
    score: number;
    sentiment: string;
    emotions: {
      optimism: number;
      fear: number;
      urgency: number;
      confusion: number;
      joy: number;
    };
    svcScore: number;
    newsVsSocialGap: number;
  }>;
}

export interface Signal {
  id: string;
  asset: string;
  timeframe: string;
  type: 'BUY' | 'SELL';
  confidence: number;
  entry: string;
  stopLoss: string;
  takeProfit: string;
  reasoning: string;
}

export interface NewsSignal {
  id: string;
  event: string;
  time: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  locked: boolean;
  unlocksIn: number;
  forecast: string;
  previous: string;
}

export interface EarningsSignal {
  id: string;
  company: string;
  reportTime: string;
  locked: boolean;
  hoursUntil: number;
  previousEPS: number;
  estimateEPS: number;
  revenueEst: string;
  prediction: {
    direction: 'BEAT' | 'MISS' | 'IN_LINE';
    confidence: number;
  };
}

export interface PredictiveMarketsData {
  activeSignals: number;
  bullishSignals: number;
  bearishSignals: number;
  markets: Array<{
    name: string;
    prediction: string;
    probability: number;
    symbols: string;
    date: string;
    impact: string;
  }>;
}

export interface MacroDeskData {
  deskNote: string;
  overallSentiment: string;
  sentimentScore: number;
  metals: {
    xauusd: {
      direction: string;
      price: string;
      change: number;
      analysis: string;
    };
    xagusd: {
      direction: string;
      price: string;
      change: number;
      analysis: string;
    };
  };
  macroEvents: Array<{
    title: string;
    probability: number;
    affectedSymbols: string;
    impact: string;
  }>;
}
