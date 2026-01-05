# Auto-Update Setup - Complete Beginner's Guide

## What Are Auto-Updates?

**Right now:** When you change the UI, users have to download and install the new .exe manually.

**With auto-updates:** When you change the UI, users' installed apps automatically download and install the update. They just click "Restart" and get the new version!

---

## Setup (Do This Once)

### Step 1: Create a GitHub Personal Access Token

This lets your app upload new versions to GitHub.

**Follow these exact steps:**

1. Open this link: https://github.com/settings/tokens

2. Click the green button: **"Generate new token"** → **"Generate new token (classic)"**

3. Fill in the form:
   - **Note:** Type `SnapBeautify Updates`
   - **Expiration:** Choose `No expiration` or `90 days`
   - **Select scopes:** ✓ Check the **`repo`** box (this automatically checks all sub-boxes under it)

4. Scroll down and click **"Generate token"** (green button at bottom)

5. **IMPORTANT:** Copy the token that appears (starts with `ghp_...`)
   - Save it in a safe place (like a password manager)
   - You won't be able to see it again!

### Step 2: Set the Token on Your Computer

Open your terminal and run this command (replace `YOUR_TOKEN` with the token you just copied):

```bash
echo 'export GH_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"' >> ~/.bashrc
source ~/.bashrc
```

**To verify it worked:**
```bash
echo $GH_TOKEN
```
You should see your token printed.

---

## How to Release Updates (Every Time You Change UI)

Let's say you just changed the header color and want to send it to users.

### Step 1: Make Your Changes

```bash
# Edit whatever you want
code components/editor/Header.tsx

# Test it works
npm run dev:electron
```

### Step 2: Update the Version Number

Open `package.json` and change the version:

```json
{
  "name": "snapbeautify-temp",
  "version": "0.1.0",    ← Change this to "0.1.1"
  ...
}
```

**Version rules:**
- Fix a bug or small change: `0.1.0` → `0.1.1`
- Add a new feature: `0.1.0` → `0.2.0`
- Major changes: `0.1.0` → `1.0.0`

### Step 3: Save, Commit, and Push

```bash
git add .
git commit -m "Updated header color"
git push origin main
```

### Step 4: Create a Git Tag

```bash
# Create a tag matching your version (v + version number)
git tag v0.1.1
git push origin v0.1.1
```

### Step 5: Build and Publish

```bash
npm run release
```

This will:
- Build your app (takes 2-3 minutes)
- Upload to GitHub Releases automatically
- Your users will get it within 1 hour!

**You'll see output like:**
```
• electron-builder version=...
• loaded configuration...
• packaging...
• building...
• publishing...
• published to GitHub Releases
```

### Step 6: Verify on GitHub

1. Go to: https://github.com/whynaidu/SnapBeautify/releases
2. You should see your new release (v0.1.1)
3. It should have these files:
   - `SnapBeautify Setup 0.1.1.exe`
   - `latest.yml`

✅ **Done!** Users will get the update automatically!

---

## Testing Auto-Updates Work

Want to see it in action? Here's how:

### Test Setup:

**Day 1 - Install Old Version:**
```bash
# Build version 0.1.0
npm run build:electron -- --win

# Install dist/SnapBeautify Setup 0.1.0.exe on Windows
# Keep the app running
```

**Day 2 - Release New Version:**
```bash
# 1. Change something visible (like header text)
# Edit components/editor/Header.tsx:
# Change "SnapBeautify" to "SnapBeautify v2"

# 2. Update version in package.json
# "0.1.0" → "0.1.1"

# 3. Commit and tag
git add .
git commit -m "test: Update header text"
git push
git tag v0.1.1
git push origin v0.1.1

# 4. Publish
npm run release
```

**Day 2 - Check the Installed App:**

Wait 3-5 minutes, then on Windows:
1. Open the installed SnapBeautify app (version 0.1.0)
2. Wait 10 seconds
3. You should see a popup: **"Update Ready - Version 0.1.1 is ready to install"**
4. Click **"Restart Now"**
5. App restarts and you see "SnapBeautify v2" in the header!

🎉 **It worked!** That's auto-updates in action!

---

## Quick Reference Card

Save this for later:

```bash
# 1. Make changes
code src/...

# 2. Update version in package.json
"version": "0.1.1"

# 3. Commit
git add .
git commit -m "your message"
git push

# 4. Tag
git tag v0.1.1
git push origin v0.1.1

# 5. Release
npm run release

# Done! Users get it automatically.
```

---

## Troubleshooting

### "Error: GitHub token not set"

Your GH_TOKEN isn't set. Run:
```bash
export GH_TOKEN="ghp_your_token_here"
echo 'export GH_TOKEN="ghp_your_token_here"' >> ~/.bashrc
```

### "Error: Tag already exists"

You forgot to update the version number. Change it in `package.json` and use a new tag.

### Users aren't getting updates

1. **Check version number:** New version must be higher (0.1.1 > 0.1.0)
2. **Check GitHub Releases:** https://github.com/whynaidu/SnapBeautify/releases
   - Should show your new version
   - Should have .exe and latest.yml files
3. **Wait longer:** Can take up to 1 hour for users to check for updates

### How to check if auto-update is working in dev

The app only checks for updates in production (not in dev mode). You must:
1. Build with `npm run build:electron -- --win`
2. Install the .exe
3. Run the installed app (not `npm run dev:electron`)

---

## Common Questions

**Q: Do I need to do Step 1 (GitHub token) every time?**
A: No, only once. After that, just use `npm run release`.

**Q: What if I make a mistake in a release?**
A: Just release a new version with a higher number (0.1.2) with the fix.

**Q: Can users skip updates?**
A: Yes, they can click "Later" and update whenever they want.

**Q: How often does the app check for updates?**
A: On startup and every 1 hour while running.

**Q: Do users need internet?**
A: Yes, only when downloading the update. After that it works offline.

---

## Visual Summary

```
YOU (Developer)                         USERS (After Installing)
─────────────────                       ────────────────────────

1. Change UI code                       [App running normally]
2. Update version (0.1.1)                      ↓
3. git push                             [App checks for update]
4. git tag v0.1.1                              ↓
5. npm run release                      [Update downloading...]
   ↓                                           ↓
[Uploads to GitHub]                     [Notification appears]
   ↓                                    "Update Ready v0.1.1"
✅ Done!                                 [Restart Now] [Later]
                                               ↓
Users get update                        [User clicks Restart]
automatically!                                 ↓
                                        [App restarts with v0.1.1]
                                               ↓
                                        ✅ User has latest version!
```

---

## Next Steps

1. **Now:** Set up your GitHub token (Step 1 above)
2. **Test it:** Follow the "Testing Auto-Updates Work" section
3. **Then:** Every time you change UI, just run the 5 commands in "Quick Reference Card"

That's it! You now have professional automatic updates like VS Code, Slack, and Discord! 🚀

**Need help?** Check the UPDATES_GUIDE.md for more details.
