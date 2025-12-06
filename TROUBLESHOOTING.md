# Troubleshooting Guide

## Application Shows White Screen

If you see only a white/dark background with no UI components, follow these steps:

### 1. Check Developer Tools
- Press `F12` or go to `View → Toggle Developer Tools`
- Check the **Console** tab for error messages
- Look for messages starting with `[Renderer]` - these indicate React initialization

### 2. Common Issues and Solutions

#### Issue: "global is not defined"
**Solution:** Already fixed. The app includes polyfills for the `global` variable.

#### Issue: "Root element not found"
**Solution:** This means `index.html` is not loading correctly. Check:
- `dist/index.html` exists
- `dist/renderer.js` exists
- File paths are correct

#### Issue: React not mounting
**Solution:** Check console for:
- `[Renderer] Starting React app...`
- `[Renderer] Root element found...`
- `[Renderer] App rendered successfully!`

If these messages don't appear, the JavaScript may not be loading.

### 3. Rebuild the Application

If issues persist, rebuild everything:

```bash
npm run build
```

Or use the batch file:
```bash
run.bat
```

### 4. Check File Structure

Ensure these files exist in `dist/`:
- `index.html`
- `renderer.js`
- `main.js`
- `preload.js`

### 5. Verify Electron is Loading Correctly

Check the main process console (terminal where you ran `npm start`) for:
- `Loading file from: [path]`
- `File exists: true`
- Any error messages

### 6. Clear Cache and Rebuild

If nothing works:
1. Delete `dist/` folder
2. Delete `node_modules/` folder
3. Run `npm install`
4. Run `npm run build`
5. Run `npm start`

## Diagnostic Script

Run `diagnose.bat` to check:
- Node.js installation
- npm installation
- Dependencies
- Build files
- Required files in dist/

## Getting Help

If the issue persists:
1. Open Developer Tools (F12)
2. Go to Console tab
3. Copy all error messages
4. Check the Elements tab to see if `#root` has content
5. Share the error messages for debugging

