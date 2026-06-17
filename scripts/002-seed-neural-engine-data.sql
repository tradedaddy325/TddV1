-- Insert sample Macro Desk data
INSERT INTO public.macro_desk (desk_note, overall_sentiment, sentiment_score, metals, macro_events)
VALUES (
  'Market sentiment is cautiously optimistic. US indices showing consolidation. Gold continues its bull run.',
  'BULLISH',
  72,
  jsonb_build_object(
    'xauusd', jsonb_build_object(
      'direction', 'BUY',
      'price', '$2,450.50',
      'change', 2.3,
      'analysis', 'Gold is trading near all-time highs. Technical chart shows strong uptrend with support at $2,420.'
    ),
    'xagusd', jsonb_build_object(
      'direction', 'BUY',
      'price', '$29.15',
      'change', 1.8,
      'analysis', 'Silver follows gold higher. Momentum is positive, but watch for resistance at $30 level.'
    )
  ),
  jsonb_build_array(
    jsonb_build_object(
      'title', 'Fed Interest Rate Decision',
      'probability', 78,
      'affectedSymbols', 'USD, SPX, NQ',
      'impact', 'High volatility expected. Market pricing in 25bp cut probability.'
    )
  )
);

-- Insert sample Psychology data
INSERT INTO public.psychology (market_mood, mood_score, bullish_assets, bearish_assets, neutral_assets, volatile_assets, emotions, narrative, sentiment_by_asset_class)
VALUES (
  'CAUTIOUSLY OPTIMISTIC',
  68,
  12,
  5,
  8,
  3,
  jsonb_build_object(
    'optimism', 65,
    'fear', 18,
    'greed', 35,
    'uncertainty', 22,
    'fomo', 28
  ),
  'Investors are navigating a complex environment with strong earnings offsetting macro uncertainty. Tech sector remains resilient.',
  jsonb_build_array(
    jsonb_build_object(
      'assets', 'US EQUITIES (SPX, NQ, RUSS)',
      'score', 72,
      'sentiment', 'BULLISH',
      'emotions', jsonb_build_object(
        'optimism', 70,
        'fear', 15,
        'urgency', 20,
        'confusion', 10,
        'joy', 55
      ),
      'svcScore', 12.5,
      'newsVsSocialGap', 8
    )
  )
);

-- Insert sample AI Signals
INSERT INTO public.signals (asset, timeframe, type, confidence, entry, stop_loss, take_profit, reasoning, active)
VALUES (
  'BTC/USD',
  '4H',
  'BUY',
  82,
  '$42,150',
  '$41,500',
  '$43,200',
  'Golden cross on 4H chart with strong volume confirmation. Bullish divergence on RSI.',
  true
),
(
  'SPX',
  '1D',
  'BUY',
  75,
  '5,850',
  '5,800',
  '5,950',
  'Breakout above key resistance with strong momentum.',
  true
);

-- Insert sample News Signals
INSERT INTO public.news_signals (event, time, impact, forecast, previous)
VALUES (
  'US Core CPI',
  '13:30 UTC',
  'HIGH',
  '3.2%',
  '3.4%'
),
(
  'Fed Minutes',
  '18:00 UTC',
  'MEDIUM',
  'N/A',
  'N/A'
);

-- Insert sample Earnings Signals
INSERT INTO public.earnings_signals (company, report_time, previous_eps, estimate_eps, revenue_est, prediction)
VALUES (
  'Apple Inc',
  '21:00 UTC',
  2.18,
  2.25,
  '$93.2B',
  jsonb_build_object(
    'direction', 'BEAT',
    'confidence', 76
  )
),
(
  'Microsoft',
  '22:30 UTC',
  2.86,
  3.10,
  '$61.9B',
  jsonb_build_object(
    'direction', 'BEAT',
    'confidence', 68
  )
);

-- Insert sample Technical Analysis
INSERT INTO public.technical_analysis (asset, timeframe, price, trend, key_levels, indicators, analysis)
VALUES (
  'SPX',
  '1D',
  '5,847.34',
  'UPTREND',
  jsonb_build_object(
    'resistance', jsonb_build_array('5,900', '5,950'),
    'support', jsonb_build_array('5,800', '5,750')
  ),
  jsonb_build_object(
    'rsi', 58,
    'macd', jsonb_build_object('histogram', 3.2),
    'movingAverages', jsonb_build_object(
      'ma20', '5,810',
      'ma50', '5,720'
    ),
    'bollinger', jsonb_build_object(
      'upper', '5,920',
      'middle', '5,850',
      'lower', '5,780'
    )
  ),
  'Strong uptrend intact with all moving averages in proper sequence. RSI in neutral zone.'
);

-- Insert sample Predictive Markets
INSERT INTO public.predictive_markets (active_signals, bullish_signals, bearish_signals, markets)
VALUES (
  42,
  28,
  14,
  jsonb_build_array(
    jsonb_build_object(
      'name', 'Fed Cuts Rates in 2024',
      'prediction', 'Probability of at least 3 rate cuts by year-end',
      'probability', 73,
      'symbols', 'EUR/USD, GBP/USD, JPY',
      'date', '2024-12-31',
      'impact', 'High impact event. Affects major currency pairs and bond yields.'
    )
  )
);
