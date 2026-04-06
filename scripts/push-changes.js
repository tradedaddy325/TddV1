#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const projectDir = '/vercel/share/v0-project';

try {
  console.log('[v0] Starting git operations...');
  
  // Change to project directory
  process.chdir(projectDir);
  console.log('[v0] Changed to project directory:', projectDir);
  
  // Check git status
  const status = execSync('git status', { encoding: 'utf8' });
  console.log('[v0] Git status:\n', status);
  
  // Stage all changes
  console.log('[v0] Staging changes...');
  execSync('git add -A', { encoding: 'utf8' });
  
  // Get the diff
  const diff = execSync('git diff --cached', { encoding: 'utf8' });
  console.log('[v0] Staged changes:\n', diff.substring(0, 500));
  
  // Commit changes
  console.log('[v0] Committing changes...');
  const commitMsg = 'fix: remove broken middleware causing 500 errors on deployment';
  execSync(`git commit -m "${commitMsg}"`, { encoding: 'utf8' });
  console.log('[v0] Commit successful');
  
  // Push to GitHub
  console.log('[v0] Pushing to GitHub...');
  execSync('git push origin v0/mohammedbhorat-2318-ba796c05', { encoding: 'utf8' });
  console.log('[v0] Push successful! Changes are now on GitHub and Vercel will deploy them.');
  
} catch (error) {
  console.error('[v0] Error:', error.message);
  if (error.stdout) console.error('[v0] stdout:', error.stdout.toString());
  if (error.stderr) console.error('[v0] stderr:', error.stderr.toString());
  process.exit(1);
}
