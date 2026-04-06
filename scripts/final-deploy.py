#!/usr/bin/env python3
import subprocess
import os
import sys

os.chdir('/vercel/share/v0-project')

try:
    # Configure git if needed
    subprocess.run(['git', 'config', 'user.email', 'v0@vercel.com'], check=False)
    subprocess.run(['git', 'config', 'user.name', 'v0[bot]'], check=False)
    
    # Add all changes
    result = subprocess.run(['git', 'add', '-A'], capture_output=True, text=True)
    print(f"[v0] Git add: {result.stdout}{result.stderr}")
    
    # Check git status
    result = subprocess.run(['git', 'status', '--short'], capture_output=True, text=True)
    print(f"[v0] Git status:\n{result.stdout}")
    
    # Commit changes
    result = subprocess.run(
        ['git', 'commit', '-m', 'fix: create working middleware to fix 500 errors on Vercel deployment'],
        capture_output=True,
        text=True
    )
    print(f"[v0] Git commit: {result.stdout}{result.stderr}")
    
    # Push to current branch
    result = subprocess.run(['git', 'branch', '-v'], capture_output=True, text=True)
    print(f"[v0] Current branch:\n{result.stdout}")
    
    result = subprocess.run(['git', 'push'], capture_output=True, text=True, timeout=30)
    print(f"[v0] Git push: {result.stdout}{result.stderr}")
    
    if result.returncode == 0:
        print("[v0] SUCCESS: Changes pushed to GitHub")
    else:
        print(f"[v0] WARNING: Push completed with code {result.returncode}")
        
except Exception as e:
    print(f"[v0] ERROR: {str(e)}", file=sys.stderr)
    sys.exit(1)
