#!/bin/bash

# Navigate to project directory
cd /vercel/share/v0-project

# Stage all changes
git add -A

# Commit with comprehensive message
git commit -m "feat: Complete TRADEDADDY V0 implementation

- Boot screen: Removed triangle, improved progress bar animation
- Legal framework: Added Terms of Service, Privacy Policy, Risk Disclosure, Signal Disclaimer pages
- Terms acceptance: Simplified to single-button modal with clear risk acknowledgments
- Price ticker: Implemented real-time market data polling with smooth animations
- Subscriptions: Updated to Pro (R249) and Elite (R499) tiers only
- Landing page: Added blinking green LIVE indicator for market data feature
- UI/UX: Enhanced visual hierarchy and terminal-style aesthetics throughout"

# Push to remote repository
git push origin HEAD:v0/mohammedbhorat-2318-b0c14129

echo "✓ Changes published successfully"
