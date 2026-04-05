#!/bin/bash

# Deployment Fix Script
# Fixes build errors preventing updates from showing on the live site

echo "Fixing deployment issues..."

# Configure git
git config user.name "v0[bot]"
git config user.email "v0[bot]@users.noreply.github.com"

# Stage all changes
git add -A

# Commit the fixes
git commit -m "fix: resolve deployment issues and enable live updates

- Remove ignoreBuildErrors from Next.js config to expose build failures
- Add proper TypeScript Metadata types to all pages with metadata exports
- Fix settings, credits, and tools page metadata typing
- Ensure clean builds that can deploy to production"

echo "Deployment fixes committed successfully!"
