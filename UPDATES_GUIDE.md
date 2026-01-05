# App Updates Guide

Your app is now configured with **automatic updates**! When you change the UI and release a new version, users will automatically get the update.

## How Auto-Updates Work

```
You make UI changes
    ↓
Build new version
    ↓
Publish to GitHub Releases
    ↓
Users' apps check for updates (every hour)
    ↓
Download update in background
    ↓
Show "Update Ready" notification
    ↓
User clicks "Restart Now" or app updates on next restart
```

## Step-by-Step: Releasing an Update

### 1. Make Your Changes

Edit any UI components, add features, fix bugs, etc.

```bash
# Example: Edit a component
code components/editor/Header.tsx

# Test your changes
npm run dev:electron
```

### 2. Update Version Number

**Important:** You MUST update the version number in `package.json` for updates to work.

```json
{
  "version": "0.1.0",  // Change to "0.1.1" or "0.2.0"
  ...
}
```

**Version numbering:**
- `0.1.0` → `0.1.1`: Bug fixes, minor UI tweaks
- `0.1.0` → `0.2.0`: New features
- `0.1.0` → `1.0.0`: Major release

### 3. Commit Your Changes

```bash
git add .
git commit -m "feat: Add new feature to screenshot editor"
git push origin main
```

### 4. Create a GitHub Release

**Option A: Using GitHub Web Interface (Easier)**

1. Go to your repo: https://github.com/whynaidu/SnapBeautify
2. Click "Releases" → "Draft a new release"
3. Click "Choose a tag" → Type `v0.1.1` (match your version) → "Create new tag"
4. Set release title: `v0.1.1`
5. Describe what's new in the release notes
6. **Don't upload any files yet** - we'll do this next
7. Click "Save draft" (don't publish yet)

**Option B: Using Command Line**

```bash
# Create and push a tag
git tag v0.1.1
git push origin v0.1.1
```

### 5. Build and Publish

Set your GitHub Personal Access Token (one-time setup):

```bash
# Create token at: https://github.com/settings/tokens
# Required permissions: repo (all)

# Set the token (replace YOUR_TOKEN)
export GH_TOKEN="your_github_token_here"

# Or add to ~/.bashrc or ~/.zshrc:
echo 'export GH_TOKEN="your_token"' >> ~/.bashrc
```

Build and publish the release:

```bash
npm run release
```

This will:
- Build the app with the new version
- Create installer (SnapBeautify Setup 0.1.1.exe)
- Upload to GitHub Releases automatically
- Publish the release

### 6. Users Get the Update

**Automatic process (no user action needed):**

1. User's app checks for updates (on startup and every hour)
2. New version detected → downloads in background
3. Download complete → user sees notification:
   ```
   Update Ready
   Version 0.1.1 is ready to install.
   [Restart Now] [Later]
   ```
4. User clicks "Restart Now" or update installs on next app close

## Manual Publishing (Alternative Method)

If you prefer to publish manually:

```bash
# 1. Build the installer
npm run build:electron -- --win

# 2. Go to GitHub Releases
# https://github.com/whynaidu/SnapBeautify/releases

# 3. Upload these files from the dist/ folder:
#    - SnapBeautify Setup 0.1.1.exe
#    - latest.yml

# 4. Publish the release
```

## Update Frequency

Your app checks for updates:
- **On startup** (after 3 seconds)
- **Every hour** while running

Users don't need to do anything - updates happen automatically!

## Testing Updates Locally

To test the update process:

1. Build version 0.1.0:
   ```bash
   npm run build:electron -- --win
   ```

2. Install it on Windows

3. Change something in the UI

4. Update version to 0.1.1 in package.json

5. Build and publish:
   ```bash
   npm run release
   ```

6. Wait 3-5 minutes, open the installed app

7. You should see the "Update Ready" notification!

## Troubleshooting

### Updates not working?

1. **Check version number**: Must be higher than current (0.1.1 > 0.1.0)
2. **Check GitHub Release**: Should have `.exe` and `latest.yml` files
3. **Check GH_TOKEN**: Token must have repo permissions
4. **Check logs**: Open DevTools in app (Ctrl+Shift+I in dev mode)

### Build fails with "GH_TOKEN not set"?

```bash
export GH_TOKEN="your_github_personal_access_token"
```

### Want to disable auto-updates?

Remove or comment out the `setupAutoUpdater()` call in `electron/main.ts`.

## Quick Reference

```bash
# Make changes to UI
code components/...

# Update version in package.json
# 0.1.0 → 0.1.1

# Commit and push
git add .
git commit -m "your message"
git push

# Build and publish
npm run release

# Users get update automatically within 1 hour!
```

## Best Practices

1. ✅ **Always test locally** before releasing
2. ✅ **Update version number** for every release
3. ✅ **Write clear release notes** so users know what changed
4. ✅ **Use semantic versioning**: bug fixes (0.1.1), features (0.2.0), breaking changes (1.0.0)
5. ✅ **Test the auto-update** by installing the old version and releasing a new one

## Files Involved

- `package.json`: Version number and publish configuration
- `electron/main.ts`: Auto-update logic
- `dist/`: Built installers
- GitHub Releases: Where updates are hosted

---

**That's it!** Your app now has professional automatic updates. Make a change, run `npm run release`, and users get it automatically! 🚀
