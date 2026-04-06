#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

// Change to the project directory
const projectDir = '/vercel/share/v0-project';
process.chdir(projectDir);

console.log('[v0] Starting git operations...');

try {
  // Check git status
  console.log('[v0] Checking git status...');
  const status = execSync('git status --short').toString();
  console.log('[v0] Git status:\n', status);

  // Stage all changes
  console.log('[v0] Staging all changes...');
  execSync('git add -A');
  console.log('[v0] Changes staged');

  // Create commit
  console.log('[v0] Creating commit...');
  const commitMessage = 'fix: resolve deployment issues and remove duplicate proxy files';
  execSync(`git commit -m "${commitMessage}"`);
  console.log('[v0] Commit created successfully');

  // Push to current branch
  console.log('[v0] Pushing to repository...');
  const remoteOutput = execSync('git remote -v').toString();
  console.log('[v0] Remote info:\n', remoteOutput);
  
  execSync('git push -u origin HEAD');
  console.log('[v0] Successfully pushed to GitHub!');
  
} catch (error) {
  if (error.message.includes('nothing to commit')) {
    console.log('[v0] No changes to commit - repository is up to date');
  } else {
    console.error('[v0] Git error:', error.message);
  }
}
