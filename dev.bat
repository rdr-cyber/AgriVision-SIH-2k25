@echo off
echo Starting AgriVision Development Server
echo =====================================

echo Checking if port 9002 is in use...
netstat -ano | findstr :9002 >nul
if %errorlevel% == 0 (
    echo Port 9002 is in use. Attempting to free it...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :9002') do (
        echo Killing process %%a
        taskkill /PID %%a /F >nul 2>&1
    )
)

echo.
echo Starting development server...
npm run dev