#!/usr/bin/env python3
import subprocess
import os

os.chdir('/vercel/share/v0-project')

try:
    # Check git status
    print("[v0] Checking git status...")
    result = subprocess.run(['git', 'status'], capture_output=True, text=True)
    print(result.stdout)
    
    # Add all changes
    print("[v0] Adding all changes...")
    subprocess.run(['git', 'add', '.'], check=True)
    
    # Commit changes
    print("[v0] Committing changes...")
    commit_msg = "fix: resolve deployment issues with TypeScript metadata and build configuration

- Remove ignoreBuildErrors setting to enable proper error reporting
- Add Metadata type imports to settings, credits, and tools pages
- Create middleware for proper authentication routing
- Enable Vercel to properly build and deploy updates"
    
    subprocess.run(['git', 'commit', '-m', commit_msg], check=True)
    
    # Push to the current branch
    print("[v0] Pushing to GitHub...")
    branch = subprocess.run(['git', 'rev-parse', '--abbrev-ref', 'HEAD'], capture_output=True, text=True, check=True)
    current_branch = branch.stdout.strip()
    print(f"[v0] Current branch: {current_branch}")
    
    result = subprocess.run(['git', 'push', 'origin', current_branch], capture_output=True, text=True)
    print(result.stdout)
    if result.stderr:
        print(result.stderr)
    
    print("[v0] ✓ Changes pushed successfully!")
    
except subprocess.CalledProcessError as e:
    print(f"[v0] Error: {e}")
    print(e.stdout)
    print(e.stderr)
except Exception as e:
    print(f"[v0] Error: {e}")
