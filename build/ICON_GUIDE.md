# App Icon Guide

Your app now has a custom icon configured! However, for the best quality across all platforms and screen resolutions, you should create high-resolution icon files.

## Current Setup

The app is currently using `build/icon.ico` which is based on your favicon (low resolution).

## Recommended: Create High-Resolution Icons

### Option 1: Use an Online Icon Generator (Easiest)

1. Create a **1024x1024 PNG** icon with your app's branding:
   - Use your gradient theme: indigo (#6366f1) to purple (#9333ea)
   - Add the Sparkles icon or your logo in the center
   - Tools you can use:
     - Figma, Canva, or Photoshop
     - Online icon makers: https://icon.kitchen/ or https://www.appicon.co/

2. Once you have the 1024x1024 PNG:
   - Use https://www.icoconverter.com/ or https://cloudconvert.com/png-to-ico
   - Generate:
     - **icon.ico** for Windows (with sizes: 16, 24, 32, 48, 64, 128, 256)
     - **icon.icns** for macOS
     - **icon.png** at 512x512 or 1024x1024 for Linux

3. Place the generated files in the `build/` directory

### Option 2: Design Your Icon

Based on your app's branding (from Header.tsx):

```
Logo: Gradient box (indigo-500 to purple-600) with white Sparkles icon
Colors:
  - Gradient start: #6366f1 (indigo-500)
  - Gradient end: #9333ea (purple-600)
  - Icon color: white
```

Create a 1024x1024 PNG with:
- Rounded square background with the gradient
- White sparkles icon in the center
- Optional: slight shadow or glow effect

### Option 3: Use Command-Line Tools

If you have a 1024x1024 PNG ready as `icon.png`:

```bash
# Install electron-icon-builder
npm install -g electron-icon-builder

# Generate all formats
electron-icon-builder --input=./icon.png --output=./build
```

## File Structure

After adding proper icons, your `build/` directory should have:

```
build/
├── icon.ico       # Windows icon (current: low-res, should replace)
├── icon.icns      # macOS icon (optional, auto-generated from .ico)
├── icon.png       # Linux icon (optional, recommended 512x512 or 1024x1024)
└── ICON_GUIDE.md  # This file
```

## Quick Test

After replacing the icon files:

1. Rebuild the app:
   ```bash
   npm run build:electron -- --win
   ```

2. Install the new `.exe` and check if the icon appears in:
   - Windows taskbar
   - App window title bar
   - Desktop shortcut
   - Start menu

## Current Configuration

The icon is configured in `package.json` under the `build` section:
- Windows: `build/icon.ico`
- macOS: `build/icon.ico` (electron-builder converts it)
- Linux: `build/icon.ico` (electron-builder converts it)

For best results, create platform-specific icons (.ico for Windows, .icns for macOS, .png for Linux).
