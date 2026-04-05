#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const projectDir = path.resolve(__dirname, '..');

try {
  console.log('[DEPLOY] Starting deployment process...');
  
  // Stage all changes
  console.log('[DEPLOY] Staging all changes...');
  execSync('git add -A', { cwd: projectDir, stdio: 'inherit' });
  
  // Commit changes
  console.log('[DEPLOY] Committing changes...');
  const commitMessage = `TRADEDADDY V0 Complete Platform Update

- Removed global terms acceptance modal from root layout
- Legal acceptance now shows only after login in dashboard
- Integrated premium dashboard components:
  * Macro Desk Terminal with AI analysis
  * Market Psychology Tab with sentiment analysis
  * Session Status Pills with real-time countdown timers
  * Live Market Carousel with 5-second refresh
  * AI Pause Banner for market closures
  * Post-Login Legal Modal with database tracking
- Created API routes for market data (Gemini), AI analysis (Claude), and legal acceptance
- Updated branding to "TradeDaddy Terminal"
- Professional trading terminal favicon
- Corrected user auth flow: Landing → Signup → Dashboard → Legal → Terminal`;
  
  execSync(`git commit -m "${commitMessage}"`, { cwd: projectDir, stdio: 'inherit' });
  
  // Push to current branch
  console.log('[DEPLOY] Pushing to GitHub...');
  execSync('git push origin HEAD', { cwd: projectDir, stdio: 'inherit' });
  
  console.log('[DEPLOY] ✅ Successfully deployed all changes to GitHub!');
  console.log('[DEPLOY] Vercel will automatically deploy within moments...');
  process.exit(0);
} catch (error) {
  console.error('[DEPLOY] ❌ Deployment failed:', error.message);
  process.exit(1);
}
