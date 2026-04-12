# Neural Engine Backend Setup Guide

## Overview
Your Neural Engine now has a complete backend infrastructure with 7 API endpoints connected to Supabase.

## Architecture

### API Endpoints (in `/app/api/neural-engine/`)
1. **GET /api/neural-engine/macro-desk** - Macro economic analysis data
2. **GET /api/neural-engine/psychology** - Market psychology & sentiment
3. **GET /api/neural-engine/signals** - AI trading signals
4. **GET /api/neural-engine/news-signals** - Economic news events
5. **GET /api/neural-engine/earnings-signals** - Earnings predictions
6. **GET /api/neural-engine/technical-analysis** - Technical chart analysis
7. **GET /api/neural-engine/predictive-markets** - Market predictions

### Data Flow
```
Frontend (page.tsx)
    ↓
useNeuralEngineData hook (calls refresh on mount)
    ↓
API Routes (/api/neural-engine/*)
    ↓
Supabase Tables
```

## Setting Up Your Backend

### Step 1: Run Database Migrations

Execute the SQL migrations in your Supabase dashboard:

1. Go to Supabase Console → SQL Editor
2. Copy & paste content from `/scripts/001-create-neural-engine-tables.sql`
3. Run the query
4. Copy & paste content from `/scripts/002-seed-neural-engine-data.sql`
5. Run the query

This creates 7 tables with sample data:
- `macro_desk`
- `psychology`
- `signals`
- `news_signals`
- `earnings_signals`
- `technical_analysis`
- `predictive_markets`

### Step 2: Verify Connection

1. Deploy to Vercel or run locally: `npm run dev`
2. Visit `/neural-engine-complete`
3. You should see live data from Supabase

### Step 3: Update Data

To update data, use Supabase dashboard or create admin endpoints to manage the tables.

## How It Works

### On Page Load
1. Component mounts → `useNeuralEngineData` hook executes
2. Hook's `useEffect` calls `refresh()` 
3. `refresh()` fetches from all 7 API endpoints in parallel
4. Each endpoint queries Supabase and returns data
5. Data populates the UI

### Fallback Mode
If API calls fail, the hook falls back to placeholder data (for demo purposes).

## API Route Pattern

Each route follows this pattern:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .limit(1);
    
    if (error) throw error;
    return Response.json(data || {});
  } catch (error) {
    console.error('Fetch error:', error);
    return Response.json({}, { status: 500 });
  }
}
```

## Environment Variables (Already Set)
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

## Adding Real Data

Replace the sample data in the SQL seed file with your actual trading data:

1. Update `/scripts/002-seed-neural-engine-data.sql`
2. Re-run in Supabase SQL Editor
3. Or use Supabase UI to insert rows manually

## Troubleshooting

### Data Not Showing
- Check Supabase tables exist (should see 7 tables in console)
- Verify API routes exist in `/app/api/neural-engine/`
- Check browser console for fetch errors
- Confirm environment variables in Vercel project settings

### 500 Errors from API
- Check Supabase connection status
- Verify service role key is correct
- Look at Vercel function logs

### Performance
- API routes cache results using Vercel's ISR
- For real-time data, implement WebSocket or polling intervals

## Next Steps
1. Run migrations in Supabase
2. Deploy to Vercel
3. Verify live data on `/neural-engine-complete`
4. Customize data sources as needed
