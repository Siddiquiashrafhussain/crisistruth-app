@echo off
REM CrisisTruth Setup Script for Windows
REM This script helps you set up the CrisisTruth platform quickly

echo.
echo ================================
echo 🚀 CrisisTruth Setup Script
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 20+ first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% detected
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm %NPM_VERSION% detected
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo ⚠️  .env.local not found
    echo    Creating .env.local with default values...
    
    (
        echo # Supabase Configuration
        echo NEXT_PUBLIC_SUPABASE_URL=https://reijuueiauolboakjgmy.supabase.co
        echo NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_DXbtjctoOwE2tJIHXbCyrQ_Y8fTGF9f
        echo.
        echo # Neysa AI Configuration ^(PipeShift API^)
        echo NEXT_PUBLIC_NEYSA_API_KEY=psai__aAYQI9dI_mnwynSgFbMJhQYyqXBZWaSNdXND6AHtyhWALQx
        echo NEXT_PUBLIC_NEYSA_API_ENDPOINT=https://api.pipeshift.ai/v1
        echo NEXT_PUBLIC_NEYSA_MODEL=qwen3-vl-30b-a3b
        echo.
        echo # Application Configuration
        echo NEXT_PUBLIC_APP_URL=http://localhost:3000
        echo NODE_ENV=development
    ) > .env.local

    echo ✅ .env.local created
) else (
    echo ✅ .env.local already exists
)

echo.
echo ================================
echo ✅ Setup Complete!
echo ================================
echo.
echo 📋 Next Steps:
echo.
echo 1. Set up Supabase database:
echo    - Go to: https://supabase.com/dashboard/project/reijuueiauolboakjgmy
echo    - Click 'SQL Editor'
echo    - Run the SQL from 'supabase-schema.sql'
echo    - See SUPABASE_SETUP.md for details
echo.
echo 2. Start the development server:
echo    npm run dev
echo.
echo 3. Open your browser:
echo    http://localhost:3000
echo.
echo 4. Test claim verification:
echo    - Go to /verify
echo    - Submit a test claim
echo    - Watch AI verification in action!
echo.
echo 📚 Documentation:
echo    - README.md - Project overview
echo    - QUICKSTART.md - Quick start guide
echo    - SUPABASE_SETUP.md - Database setup
echo    - DEPLOYMENT.md - Deployment guide
echo    - MARKET_READY_CHECKLIST.md - Launch checklist
echo.
echo 🎉 Happy fact-checking!
echo.
pause
