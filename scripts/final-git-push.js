#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const projectDir = path.resolve(__dirname, '..');

try {
  process.chdir(projectDir);
  
  console.log('[v0] Checking git status...');
  execSync('git status', { stdio: 'inherit' });
  
  console.log('[v0] Adding all changes...');
  execSync('git add -A', { stdio: 'inherit' });
  
  console.log('[v0] Committing changes...');
  execSync('git commit -m "fix: replace deprecated middleware.ts with proxy.js for Next.js 16 compatibility"', { stdio: 'inherit' });
  
  console.log('[v0] Pushing to GitHub...');
  execSync('git push origin HEAD', { stdio: 'inherit' });
  
  console.log('[v0] ✓ Successfully pushed fixes to GitHub!');
  console.log('[v0] Vercel should now detect the changes and deploy them within 1-2 minutes.');
} catch (error) {
  console.error('[v0] Error during push:', error.message);
  process.exit(1);
}
