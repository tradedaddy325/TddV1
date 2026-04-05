#!/usr/bin/env node

import { execSync } from 'child_process'

console.log('[v0] Publishing all TRADEDADDY updates to GitHub and Vercel...')

try {
  // Add all changes
  console.log('[v0] Staging changes...')
  execSync('git add -A', { cwd: process.cwd() })

  // Commit with descriptive message
  console.log('[v0] Committing changes...')
  execSync(
    `git commit -m "feat: Complete TRADEDADDY platform update with Macro Desk Terminal, Market Psychology, Session Status Pills, Live Market Carousel, AI Pause Banner, Legal Acceptance Modal, and Claude/Gemini AI integration"`,
    { cwd: process.cwd() }
  )

  // Push to current branch
  console.log('[v0] Pushing to GitHub...')
  execSync('git push origin HEAD', { cwd: process.cwd() })

  console.log('[v0] ✅ All changes published successfully!')
  console.log('[v0] Vercel deployment will begin automatically...')
  process.exit(0)
} catch (error) {
  console.error('[v0] ❌ Error publishing changes:', error)
  process.exit(1)
}
