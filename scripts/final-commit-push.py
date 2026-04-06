#!/usr/bin/env python3
import subprocess
import os

os.chdir('/vercel/share/v0-project')

try:
    # Check git status
    status = subprocess.run(['git', 'status', '--short'], capture_output=True, text=True)
    print("Git status:")
    print(status.stdout)
    
    # Add all changes
    subprocess.run(['git', 'add', '-A'], check=True)
    
    # Commit with a descriptive message
    commit_message = """fix: resolve deployment issues preventing updates from showing

- Remove middleware.ts that was causing 500 errors on every request
- Remove ignoreBuildErrors from next.config.mjs to enable proper error reporting
- Fix TypeScript metadata exports with proper Metadata type imports
- These fixes allow Vercel to successfully build and deploy the website"""
    
    subprocess.run(['git', 'commit', '-m', commit_message], check=True)
    
    # Push to the current branch
    result = subprocess.run(['git', 'push', 'origin', 'HEAD'], capture_output=True, text=True)
    print("Push result:")
    print(result.stdout)
    print(result.stderr)
    
    if result.returncode == 0:
        print("\n✅ Successfully pushed all fixes to GitHub!")
        print("Vercel should now automatically detect the changes and deploy your website with all updates visible.")
    else:
        print("\n❌ Push failed:")
        print(result.stderr)
        
except Exception as e:
    print(f"Error: {e}")
