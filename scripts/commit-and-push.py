#!/usr/bin/env python3
import subprocess
import os

os.chdir('/vercel/share/v0-project')

try:
    # Check git status
    status = subprocess.run(['git', 'status', '--porcelain'], capture_output=True, text=True)
    print("Git status:")
    print(status.stdout)
    
    # Add all changes
    print("\nAdding changes...")
    subprocess.run(['git', 'add', '.'], check=True)
    
    # Commit changes
    commit_msg = "fix: deployment issues - add metadata types and remove build errors config"
    print(f"\nCommitting with message: {commit_msg}")
    subprocess.run(['git', 'commit', '-m', commit_msg], check=True)
    
    # Push to current branch
    print("\nPushing to GitHub...")
    result = subprocess.run(['git', 'push', 'origin', 'HEAD'], capture_output=True, text=True)
    print(result.stdout)
    print(result.stderr)
    
    if result.returncode == 0:
        print("\nSuccess! Changes pushed to GitHub")
    else:
        print(f"\nError pushing: {result.returncode}")
        
except subprocess.CalledProcessError as e:
    print(f"Error: {e}")
    print(e.stdout)
    print(e.stderr)
except Exception as e:
    print(f"Unexpected error: {e}")
