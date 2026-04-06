#!/usr/bin/env python3
import subprocess
import os
import sys

os.chdir('/vercel/share/v0-project')

try:
    # Check git status
    print("[v0] Checking git status...")
    result = subprocess.run(['git', 'status', '--short'], capture_output=True, text=True, timeout=10)
    print(f"[v0] Git status output:\n{result.stdout}")
    
    # Add all changes
    print("[v0] Adding all changes...")
    subprocess.run(['git', 'add', '-A'], check=True, timeout=10)
    
    # Check what was staged
    result = subprocess.run(['git', 'diff', '--cached', '--name-only'], capture_output=True, text=True, timeout=10)
    print(f"[v0] Staged files:\n{result.stdout}")
    
    # Commit
    print("[v0] Committing changes...")
    subprocess.run([
        'git', 'commit', 
        '-m', 'fix: remove broken middleware causing 500 errors and deployment failures'
    ], check=True, timeout=10)
    print("[v0] Commit successful!")
    
    # Get current branch
    branch_result = subprocess.run(['git', 'rev-parse', '--abbrev-ref', 'HEAD'], capture_output=True, text=True, timeout=10)
    current_branch = branch_result.stdout.strip()
    print(f"[v0] Current branch: {current_branch}")
    
    # Push to GitHub
    print(f"[v0] Pushing to GitHub on branch {current_branch}...")
    subprocess.run(['git', 'push', 'origin', current_branch], check=True, timeout=30)
    print("[v0] Push successful!")
    
except subprocess.CalledProcessError as e:
    print(f"[v0] Git command failed: {e}")
    print(f"[v0] stdout: {e.stdout}")
    print(f"[v0] stderr: {e.stderr}")
    sys.exit(1)
except Exception as e:
    print(f"[v0] Error: {e}")
    sys.exit(1)

print("[v0] All changes committed and pushed to GitHub successfully!")
print("[v0] Vercel will automatically detect the push and deploy within 1-2 minutes.")
