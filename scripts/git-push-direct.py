#!/usr/bin/env python3
import subprocess
import os
import sys

os.chdir('/vercel/share/v0-project')

try:
    # Stage all changes
    subprocess.run(['git', 'add', '-A'], check=True, capture_output=True)
    
    # Check git status
    result = subprocess.run(['git', 'status', '--porcelain'], capture_output=True, text=True, check=True)
    if result.stdout:
        print("Changes to commit:")
        print(result.stdout)
    else:
        print("No changes to commit")
        sys.exit(0)
    
    # Commit with message
    subprocess.run(['git', 'commit', '-m', 'fix: remove broken middleware that causes 500 errors'], check=True, capture_output=True)
    
    # Push to current branch
    result = subprocess.run(['git', 'rev-parse', '--abbrev-ref', 'HEAD'], capture_output=True, text=True, check=True)
    current_branch = result.stdout.strip()
    print(f"Current branch: {current_branch}")
    
    push_result = subprocess.run(['git', 'push', 'origin', current_branch], capture_output=True, text=True)
    
    if push_result.returncode == 0:
        print("Successfully pushed to GitHub!")
        print(push_result.stdout)
    else:
        print("Push output:", push_result.stdout)
        print("Push errors:", push_result.stderr)
        sys.exit(1)
        
except subprocess.CalledProcessError as e:
    print(f"Git command failed: {e}")
    print(f"stdout: {e.stdout}")
    print(f"stderr: {e.stderr}")
    sys.exit(1)
