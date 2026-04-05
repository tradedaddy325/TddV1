#!/bin/bash

# Deploy TradeDaddy Terminal changes to production
# This script commits and pushes all changes to the main branch

cd /vercel/share/v0-project

# Configure git
git config user.name "v0[bot]"
git config user.email "v0[bot]@users.noreply.github.com"

# Add all changes
git add -A

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "No changes to deploy"
    exit 0
fi

# Commit changes
git commit -m "Deploy TradeDaddy Terminal upgrades: Macro Desk, Market Psychology, Predictive Markets, enhanced Signals, AI Coach, Community, Charting pages"

# Push to main branch
git push origin HEAD:main

echo "✓ Changes deployed to production"
echo "✓ Vercel will automatically deploy within seconds"
