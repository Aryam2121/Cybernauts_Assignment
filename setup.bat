@echo off
echo ================================
echo User Network Setup Script
echo ================================
echo.

echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found!
echo.

echo [2/4] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..
echo Backend dependencies installed!
echo.

echo [3/4] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..
echo Frontend dependencies installed!
echo.

echo [4/4] Setup complete!
echo.
echo ================================
echo Next Steps:
echo ================================
echo.
echo 1. Make sure MongoDB is running
echo    - If using local MongoDB, it should auto-start
echo    - If using MongoDB Atlas, update backend/.env
echo.
echo 2. Open TWO terminal windows:
echo.
echo    Terminal 1 (Backend):
echo    cd backend
echo    npm run dev
echo.
echo    Terminal 2 (Frontend):
echo    cd frontend
echo    npm start
echo.
echo 3. Open browser to http://localhost:3000
echo.
echo ================================
echo For detailed instructions, see:
echo - QUICK_START.md
echo - README.md
echo ================================
echo.
pause
