# Neural Engine Complete

A comprehensive Next.js application featuring the Neural Engine platform with multiple market analysis tabs, feature access control, and Supabase integration placeholders.

## Project Structure

```
├── app/
│   ├── neural-engine-complete/
│   │   └── page.tsx              # Main Neural Engine page (5 tabs)
│   └── layout.tsx                # Root layout
│
├── components/
│   └── NeuralEngine/
│       ├── TechnicalAnalysisTab.tsx   # Technical analysis component
│       ├── PsychologyTab.tsx          # Market psychology component
│       ├── SignalsTab.tsx             # AI, News, Earnings signals
│       └── PredictiveMarketsTab.tsx   # Predictive markets component
│
├── lib/
│   ├── hooks/
│   │   ├── useNeuralEngineData.ts     # Hook for fetching neural engine data
│   │   └── useFeatureAccess.ts        # Hook for feature access control
│   └── supabase/
│       └── client.ts                   # Supabase client with placeholder queries
│
├── types/
│   └── neural-engine.ts          # TypeScript interfaces for all data types
│
└── package.json                  # Dependencies (includes Supabase, Tailwind, etc.)
```

## Components

### 1. **TechnicalAnalysisTab**
- Displays real-time technical analysis for multiple assets
- Shows key support/resistance levels
- Displays technical indicators (RSI, MACD, Moving Averages, Bollinger Bands)
- Styled with Tailwind CSS dark theme

### 2. **PsychologyTab**
- Market mood and sentiment analysis
- Emotional breakdowns (Optimism, Fear, Greed, Uncertainty, FOMO)
- Asset class sentiment with SVC scores
- AI narrative interpretation

### 3. **SignalsTab**
- Three sub-tabs: AI Signals, News Signals, Earnings Signals
- AI Signals: Trading setups with confidence levels, entry/exit points
- News Signals: Economic events with impact levels
- Earnings Signals: Company earnings predictions

### 4. **PredictiveMarketsTab**
- Macro event probability predictions
- Active/Bullish/Bearish signal counts
- Market impact descriptions
- 2000+ market monitoring capability

### 5. **Macro Desk (Main Page)**
- Desk note with market commentary
- Overall market sentiment gauge
- Metal prices (Gold & Silver) with technical analysis
- Active macro events listing

## Hooks

### `useNeuralEngineData`
Centralized data fetching hook with placeholder implementation:
- Fetches all 7 data types: Macro Desk, Psychology, Signals (AI/News/Earnings), Technical Analysis, Predictive Markets
- Loading state management
- Refresh functionality
- Ready for Supabase integration

### `useFeatureAccess`
Feature unlock/paywall system:
- Tracks unlocked features per user
- Credit-based access (33 credits per feature)
- 30-day expiry management
- Renewal functionality
- Ready for Supabase integration

## Supabase Integration Placeholders

Located in `/lib/supabase/client.ts`:

```typescript
// Example implementation ready to uncomment:
export async function fetchMacroDeskData(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('macro_desk_data')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  if (error) throw error;
  return data;
}
```

**Required Supabase Tables:**
- `macro_desk_data`
- `psychology_data`
- `ai_signals`
- `news_signals`
- `earnings_signals`
- `technical_analysis`
- `predictive_markets`
- `feature_access`
- `user_credits` (for credit management)

## Environment Variables

Add to your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Styling

- **Framework**: Tailwind CSS v4
- **Color Scheme**: Dark theme (gray-950 background)
- **Components**: Lucide React icons
- **Typography**: Monospace font for terminal aesthetic
- **Responsive**: Mobile-first grid layouts

## Key Features

✅ **Modular Component Design**: Each tab is a separate, reusable component
✅ **Type-Safe**: Full TypeScript implementation with dedicated types
✅ **Dark Theme**: Professional dark UI suitable for traders
✅ **Feature Access Control**: Credit-based system for premium features
✅ **Placeholder Data**: Realistic demo data for development
✅ **Supabase Ready**: All queries documented and ready for implementation
✅ **Next.js 16 Compatible**: App Router, server components ready
✅ **Vercel Deployable**: Follows Vercel best practices

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Create `.env.local` with Supabase credentials

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Navigate to**:
   ```
   http://localhost:3000/neural-engine-complete
   ```

5. **Implement Supabase integration**:
   - Uncomment queries in `/lib/supabase/client.ts`
   - Create required tables in Supabase
   - Update hooks to call API endpoints instead of placeholder data

## Deployment

The app is ready to deploy to Vercel:

```bash
npm run build
vercel deploy
```

Vercel will automatically detect environment variables from your project settings.

## Next Steps for Supabase Integration

1. Create database schema in Supabase
2. Set up Row Level Security (RLS) policies
3. Uncomment query functions in `client.ts`
4. Update hooks to call actual API endpoints
5. Implement user authentication (currently using hardcoded userId)
6. Add credit system logic for feature unlocks
