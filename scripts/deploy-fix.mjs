import { execSync } from 'child_process';

console.log('Fixing deployment issues...');

try {
  // Configure git
  execSync('git config user.name "v0[bot]"', { cwd: '/vercel/share/v0-project' });
  execSync('git config user.email "v0[bot]@users.noreply.github.com"', { cwd: '/vercel/share/v0-project' });

  // Stage all changes
  execSync('git add -A', { cwd: '/vercel/share/v0-project' });

  // Commit the fixes
  const commitMessage = `fix: resolve deployment issues and enable live updates

- Remove ignoreBuildErrors from Next.js config to expose build failures
- Add proper TypeScript Metadata types to all pages with metadata exports
- Fix settings, credits, and tools page metadata typing
- Ensure clean builds that can deploy to production`;

  execSync(`git commit -m "${commitMessage}"`, { cwd: '/vercel/share/v0-project' });

  console.log('✓ Deployment fixes committed successfully!');
  console.log('✓ Changes will now deploy to your live website');
} catch (error) {
  console.error('Error committing changes:', error.message);
  process.exit(1);
}
