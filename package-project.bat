@echo off
echo ========================================
echo POS System - Project Packager
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo Creating ZIP archive...
if exist pos-app-project.zip (
    echo Removing old ZIP file...
    del pos-app-project.zip
)

echo.
echo Packaging project...
powershell -Command "Compress-Archive -Path 'pos-app' -DestinationPath 'pos-app-project.zip' -Force"

if exist pos-app-project.zip (
    echo.
    echo ========================================
    echo SUCCESS!
    echo ========================================
    echo.
    echo Project packaged as: pos-app-project.zip
    echo Location: %CD%\pos-app-project.zip
    echo.
    echo File size:
    dir pos-app-project.zip | findstr "pos-app-project.zip"
    echo.
) else (
    echo.
    echo ERROR: Failed to create ZIP file
    echo.
)

pause
