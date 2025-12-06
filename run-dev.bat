@echo off
title POS System - Development Mode
color 0B

echo ========================================
echo   POS System - Development Mode
echo   (Hot-reloading enabled)
echo ========================================
echo.

cd /d "%~dp0"

:: Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [1/3] Checking Node.js...
node --version
echo.

:: Check if npm is installed
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not installed!
    echo.
    pause
    exit /b 1
)

echo [2/3] Checking dependencies...
if not exist "node_modules" (
    echo Dependencies not found. Installing...
    echo This may take a few minutes...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ERROR: Failed to install dependencies!
        echo.
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
) else (
    echo Dependencies found!
)
echo.

echo [3/3] Starting development server...
echo.
echo ========================================
echo   Development Mode Starting...
echo   Changes will auto-reload
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run start:dev

echo.
echo Development server stopped.
pause

