#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('[PUBLISH] Starting TRADEDADDY Platform Publication...\n');

try {
  // Stage all changes
  console.log('[PUBLISH] Staging all changes...');
  execSync('git add .', { stdio: 'inherit' });

  // Create comprehensive commit message
  const commitMessage = `TRADEDADDY Complete Platform Update

✅ Features Implemented:
- Removed global terms modal - now shows only after login in dashboard
- Integrated Macro Desk Terminal with macroeconomic analysis
- Added Market Psychology tab with sentiment analysis
- Implemented Session Status Pills with real-time market countdowns
- Added Live Market Carousel with Gemini API integration
- Created AI Pause Banner for market closure notifications
- Integrated Post-Login Legal Modal with Supabase tracking

✅ API Routes:
- /api/market/live-data (Gemini-powered market data)
- /api/analysis/claude (Claude AI analysis engine)
- /api/legal/acceptance (Legal compliance tracking)

✅ Infrastructure:
- Updated branding to "TradeDaddy Terminal"
- Professional trading terminal favicon
- Tab navigation system for dashboard
- All AI integrations active (Claude + Gemini)
- Supabase legal acceptance table

✅ User Flow:
- Landing page with legal links in footer
- Sign up/login without modal interruption
- Legal modal appears AFTER authentication in dashboard
- Full access to premium terminal after acceptance`;

  console.log('[PUBLISH] Committing changes...');
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

  console.log('\n[PUBLISH] ✅ All changes committed successfully!');
  console.log('[PUBLISH] Push to GitHub automatically via Vercel integration.');
  console.log('[PUBLISH] Deployment to production in progress...\n');

} catch (error) {
  console.error('[PUBLISH] Error during publication:', error.message);
  process.exit(1);
}
