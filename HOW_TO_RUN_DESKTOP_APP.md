# How to Run the Desktop Application

## 📋 Prerequisites

Before running the desktop application, ensure you have:

1. **Node.js** installed (version 16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`
   - Verify npm: `npm --version`

2. **npm** (comes with Node.js)
   - Should be installed automatically with Node.js

## 🚀 Step-by-Step Instructions

### Step 1: Navigate to Project Directory

Open Command Prompt or PowerShell and navigate to your project folder:

```bash
cd path\to\your\project\pos-app
```

Or if the project is in the current Moodmate folder:
```bash
cd pos-app
```

### Step 2: Install Dependencies

Install all required packages (this may take 5-10 minutes):

```bash
npm install
```

**What this does:**
- Downloads and installs all dependencies listed in `package.json`
- Installs Electron, React, TypeScript, Webpack, and all other required packages
- Creates `node_modules/` folder with all dependencies

### Step 3: Build the Application

Compile TypeScript and bundle the application:

```bash
npm run build
```

**What this does:**
- Compiles TypeScript files to JavaScript
- Bundles React application with Webpack
- Creates `dist/` folder with compiled files
- Builds main process, preload script, and renderer

**Expected output:**
- `dist/main.js` - Main Electron process
- `dist/preload.js` - Preload script
- `dist/renderer.js` - React application bundle
- `dist/index.html` - HTML file

### Step 4: Run the Desktop Application

Start the Electron desktop application:

```bash
npm start
```

**What happens:**
- Electron window opens
- Desktop application launches
- You'll see the POS System interface

## 🎯 Quick Start (All-in-One)

If you want to do everything in one go:

```bash
# Navigate to project
cd pos-app

# Install dependencies (first time only)
npm install

# Build the application
npm run build

# Run the application
npm start
```

## 🔧 Development Mode (Optional)

For development with hot-reloading:

### Option 1: Using Development Server

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Build main process
npm run build:main
npm run build:preload

# Terminal 3: Start Electron
npm start
```

### Option 2: All-in-One Development

```bash
npm run start:dev
```

## 📝 Troubleshooting

### Issue: "npm is not recognized"

**Solution:** 
- Make sure Node.js is installed
- Restart your terminal/command prompt
- Check PATH environment variable includes Node.js

### Issue: "Cannot find module" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Issue: Build fails

**Solution:**
```bash
# Clear cache and rebuild
npm cache clean --force
npm install
npm run build
```

### Issue: Electron window doesn't open

**Solution:**
- Make sure you ran `npm run build` first
- Check if `dist/` folder exists with files
- Check console for error messages
- Try: `npx electron .` directly

### Issue: Port 3000 already in use (development mode)

**Solution:**
- Close other applications using port 3000
- Or change port in `webpack.dev.config.js`

## 🎨 What You Should See

When the application starts successfully:

1. **License Screen** (first time):
   - Hardware ID displayed
   - License key input field
   - Enter any key for demo mode

2. **Login Screen**:
   - Username and password fields
   - Enter any values (demo mode)

3. **Main Application**:
   - Sidebar with navigation
   - Dashboard with statistics
   - All features accessible

## 📦 Creating a Desktop Shortcut (Windows)

### Method 1: Manual Shortcut

1. Right-click on desktop → New → Shortcut
2. Location: `npm start`
3. Start in: `C:\Users\User\Desktop\Moodmate\pos-app`
4. Name: "POS System"

### Method 2: Batch File

Create `start-pos.bat`:

```batch
@echo off
cd /d "%~dp0"
call npm start
pause
```

Double-click `start-pos.bat` to run the app.

## 🔄 After Making Changes

If you modify the code:

1. **Rebuild the application:**
   ```bash
   npm run build
   ```

2. **Run again:**
   ```bash
   npm start
   ```

## 📱 Package as Executable (Advanced)

To create a standalone executable:

1. Install Electron Builder:
   ```bash
   npm install --save-dev electron-builder
   ```

2. Add build script to `package.json`:
   ```json
   "build:app": "electron-builder"
   ```

3. Build executable:
   ```bash
   npm run build:app
   ```

This creates an `.exe` file you can distribute.

## ✅ Verification Checklist

Before running, verify:

- [ ] Node.js is installed (`node --version`)
- [ ] npm is installed (`npm --version`)
- [ ] Project folder exists with `package.json`
- [ ] Dependencies installed (`node_modules/` exists)
- [ ] Application built (`dist/` folder exists)
- [ ] No error messages in terminal

## 🆘 Still Having Issues?

1. Check that all files are present:
   - `package.json`
   - `src/` folder
   - `webpack.*.config.js` files
   - `tsconfig.json`

2. Verify Node.js version:
   ```bash
   node --version  # Should be 16+
   ```

3. Check for error messages in terminal

4. Try fresh installation:
   ```bash
   npm cache clean --force
   npm install
   ```

---

**Need Help?** Check the `README.md` file in your project for more details.
