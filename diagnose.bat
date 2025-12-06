@echo off
echo ========================================
echo POS App Diagnostic Script
echo ========================================
echo.

echo [1/6] Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    pause
    exit /b 1
)
echo.

echo [2/6] Checking npm installation...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed or not in PATH
    pause
    exit /b 1
)
echo.

echo [3/6] Checking if node_modules exists...
if not exist "node_modules" (
    echo WARNING: node_modules not found. Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo node_modules found
)
echo.

echo [4/6] Checking dist folder...
if not exist "dist" (
    echo WARNING: dist folder not found. Building application...
    call npm run build
    if %errorlevel% neq 0 (
        echo ERROR: Build failed
        pause
        exit /b 1
    )
) else (
    echo dist folder found
)
echo.

echo [5/6] Checking required files in dist...
if not exist "dist\index.html" (
    echo ERROR: dist\index.html not found
    pause
    exit /b 1
)
if not exist "dist\renderer.js" (
    echo ERROR: dist\renderer.js not found
    pause
    exit /b 1
)
if not exist "dist\main.js" (
    echo ERROR: dist\main.js not found
    pause
    exit /b 1
)
if not exist "dist\preload.js" (
    echo ERROR: dist\preload.js not found
    pause
    exit /b 1
)
echo All required files found
echo.

echo [6/6] File sizes:
dir dist\*.js /b
dir dist\index.html /b
echo.

echo ========================================
echo Diagnostic complete!
echo ========================================
echo.
echo To run the application, use: run.bat
echo.
pause

