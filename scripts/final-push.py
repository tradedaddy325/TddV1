#!/usr/bin/env python3
import subprocess
import os
import sys

# Change to project directory
os.chdir('/vercel/share/v0-project')

try:
    # Check git status
    print("[v0] Checking git status...")
    result = subprocess.run(['git', 'status', '--porcelain'], capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error checking git status: {result.stderr}")
        sys.exit(1)
    
    print(f"Changed files:\n{result.stdout}")
    
    # Add all changes
    print("\n[v0] Adding all changes...")
    result = subprocess.run(['git', 'add', '.'], capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error adding changes: {result.stderr}")
        sys.exit(1)
    
    # Commit changes
    print("[v0] Committing changes...")
    commit_msg = "fix: resolve deployment issues - fix middleware export, remove build errors config, and remove duplicate proxy file"
    result = subprocess.run(
        ['git', 'commit', '-m', commit_msg],
        capture_output=True,
        text=True
    )
    
    if result.returncode != 0:
        if "nothing to commit" in result.stdout or "nothing to commit" in result.stderr:
            print("[v0] No changes to commit - already committed")
        else:
            print(f"Error committing: {result.stderr}")
            sys.exit(1)
    else:
        print(f"[v0] Commit successful: {result.stdout}")
    
    # Push to GitHub
    print("\n[v0] Pushing to GitHub...")
    result = subprocess.run(
        ['git', 'push', 'origin', 'v0/mohammedbhorat-2318-ba796c05'],
        capture_output=True,
        text=True
    )
    
    if result.returncode != 0:
        print(f"Error pushing to GitHub: {result.stderr}")
        sys.exit(1)
    
    print(f"[v0] Push successful!\n{result.stdout}")
    print("\n✅ All deployment fixes have been pushed to GitHub!")
    print("Vercel should now automatically deploy your updated website with all your changes visible.")
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
