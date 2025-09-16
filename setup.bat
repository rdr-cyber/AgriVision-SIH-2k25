@echo off
echo AgriVision Setup Script
echo ======================

echo Checking for Node.js...
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Node.js is installed
    node --version
) else (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

echo.
echo Installing dependencies...
npm install

echo.
echo Setup complete!
echo.
echo To run the application:
echo 1. Create a .env file with your GEMINI_API_KEY
echo 2. Run: npm run dev
echo 3. Open your browser to http://localhost:9002
echo.
echo For detailed instructions, see USER_GUIDE.md
echo.
pause