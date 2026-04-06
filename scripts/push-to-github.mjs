import { execSync } from 'child_process';
import { resolve } from 'path';

const projectDir = '/vercel/share/v0-project';

try {
  console.log('[v0] Starting deployment push...');
  
  // Set git user for commits
  execSync('git config user.email "v0[bot]@users.noreply.github.com"', { cwd: projectDir });
  execSync('git config user.name "v0[bot]"', { cwd: projectDir });
  
  // Check git status
  const status = execSync('git status --short', { cwd: projectDir }).toString();
  console.log('[v0] Git status:\n', status);
  
  // Add all changes
  console.log('[v0] Adding changes...');
  execSync('git add .', { cwd: projectDir });
  
  // Commit changes
  console.log('[v0] Committing changes...');
  const commitMessage = 'fix: resolve Vercel deployment issues\n\nRemove ignoreBuildErrors and fix TypeScript metadata exports\n- Removed ignoreBuildErrors: true from next.config.mjs to enable proper error reporting\n- Added Metadata type imports to settings, credits, and tools pages\n- Created middleware proxy for authentication routing\n\nThis enables Vercel to properly report and deploy updates.';
  
  execSync(`git commit -m "${commitMessage.split('\n')[0]}" --allow-empty`, { cwd: projectDir });
  
  // Get current branch
  const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: projectDir }).toString().trim();
  console.log('[v0] Current branch:', branch);
  
  // Push to origin
  console.log('[v0] Pushing to GitHub...');
  execSync(`git push origin ${branch}`, { cwd: projectDir });
  
  console.log('[v0] ✅ Successfully pushed changes to GitHub!');
  console.log('[v0] Vercel will now detect the changes and deploy the updates automatically.');
  
} catch (error) {
  console.error('[v0] Error:', error.message);
  process.exit(1);
}
