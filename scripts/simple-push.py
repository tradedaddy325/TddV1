#!/usr/bin/env python3
import subprocess
import sys
import os

os.chdir('/vercel/share/v0-project')

try:
    # Check git status
    print("[v0] Checking git status...")
    status = subprocess.run(['git', 'status', '--short'], capture_output=True, text=True)
    print(status.stdout)
    
    # Add all changes
    print("[v0] Adding all changes...")
    subprocess.run(['git', 'add', '-A'], check=True)
    
    # Commit changes
    print("[v0] Committing changes...")
    result = subprocess.run(
        ['git', 'commit', '-m', 'fix: remove broken middleware causing 500 errors and deployment failures'],
        capture_output=True,
        text=True
    )
    print(result.stdout)
    print(result.stderr)
    
    # Push to GitHub
    print("[v0] Pushing to GitHub...")
    push_result = subprocess.run(
        ['git', 'push', 'origin', 'HEAD'],
        capture_output=True,
        text=True
    )
    print(push_result.stdout)
    if push_result.stderr:
        print("STDERR:", push_result.stderr)
    
    if push_result.returncode == 0:
        print("[v0] Successfully pushed changes to GitHub!")
    else:
        print(f"[v0] Push failed with return code: {push_result.returncode}")
        sys.exit(1)
        
except Exception as e:
    print(f"[v0] Error: {e}")
    sys.exit(1)
