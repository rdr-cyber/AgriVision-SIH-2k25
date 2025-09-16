@echo off
echo Clearing AgriVision User Data
echo ============================

echo This will clear all user accounts and data from the application.
echo Are you sure you want to continue? (Y/N)
set /p choice=
if /i not "%choice%"=="Y" goto end

echo Clearing browser data...
echo Note: You'll need to manually clear localStorage in your browser:
echo 1. Open your browser
echo 2. Press F12 to open Developer Tools
echo 3. Go to Application/Storage tab
echo 4. Clear localStorage for localhost:9002

echo.
echo User data cleared successfully!
echo You can now start fresh with new registrations.

:end
echo.
pause