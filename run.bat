@echo off
title POS System - Desktop Application
color 0A

echo ========================================
echo   POS System - Desktop Application
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

echo [1/4] Checking Node.js...
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

echo [2/4] Checking dependencies...
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

echo [3/4] Building application...
if not exist "dist" (
    echo Building for the first time...
) else (
    echo Rebuilding application...
)
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Build failed!
    echo.
    pause
    exit /b 1
)
echo Build complete!
echo.

echo [4/4] Launching POS System...
echo.
echo ========================================
echo   Application Starting...
echo ========================================
echo.

call npm start

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Application failed to start!
    echo.
    pause
    exit /b 1
)

echo.
echo Application closed.
pause

