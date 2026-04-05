import { execSync } from 'child_process'

async function deploy() {
  try {
    console.log('[v0] Starting deployment...')
    
    // Stage all changes
    execSync('git add -A', { cwd: '/vercel/share/v0-project' })
    console.log('[v0] Staged all changes')
    
    // Check if there are changes to commit
    const status = execSync('git status --porcelain', { cwd: '/vercel/share/v0-project' }).toString()
    if (!status.trim()) {
      console.log('[v0] No changes to commit')
      return
    }
    
    // Commit changes
    const commitMsg = 'Deploy: TradeDaddy Terminal v2 upgrade with Macro Desk, Market Psychology, Predictive Markets, enhanced Signals, Community, Charting, and AI Coach features'
    execSync(`git commit -m "${commitMsg}"`, { cwd: '/vercel/share/v0-project' })
    console.log('[v0] Committed changes')
    
    // Push to main
    execSync('git push origin main', { cwd: '/vercel/share/v0-project' })
    console.log('[v0] Pushed to main branch')
    
    console.log('[v0] Deployment complete! Changes are now live on Vercel.')
  } catch (error) {
    console.error('[v0] Deployment error:', error.message)
    process.exit(1)
  }
}

deploy()
