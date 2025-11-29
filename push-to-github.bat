@echo off
REM Automated GitHub Push Script for Windows

echo.
echo ====================================
echo 🚀 Push to GitHub
echo ====================================
echo.

REM Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git is not installed
    echo Please install Git from: https://git-scm.com/
    pause
    exit /b 1
)

echo ✅ Git found
echo.

REM Check if git is initialized
if not exist .git (
    echo 📦 Initializing Git repository...
    git init
    echo ✅ Git initialized
) else (
    echo ✅ Git repository already exists
)
echo.

REM Add all files
echo 📝 Adding files to Git...
git add .
echo ✅ Files added
echo.

REM Commit changes
echo 💾 Committing changes...
set commit_msg=Complete CrisisTruth platform - Market ready with full automation
git commit -m "%commit_msg%"
if %ERRORLEVEL% EQU 0 (
    echo ✅ Changes committed
) else (
    echo ℹ️  No changes to commit or already committed
)
echo.

REM Ask for GitHub repository URL
echo 🔗 GitHub Repository Setup
echo.
echo Do you have a GitHub repository URL?
echo.
set /p has_repo="Enter 'y' if yes, 'n' to create new: "

if /i "%has_repo%"=="n" (
    echo.
    echo 📋 Create a new repository on GitHub:
    echo 1. Go to: https://github.com/new
    echo 2. Repository name: crisistruth-app
    echo 3. Keep it Public or Private
    echo 4. DO NOT initialize with README
    echo 5. Click "Create repository"
    echo.
    pause
)

echo.
set /p repo_url="Enter your GitHub repository URL: "

REM Check if remote exists
git remote | findstr origin >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ℹ️  Updating remote URL...
    git remote set-url origin %repo_url%
) else (
    echo ℹ️  Adding remote...
    git remote add origin %repo_url%
)
echo ✅ Remote configured
echo.

REM Set main branch
echo 🌿 Setting up main branch...
git branch -M main
echo ✅ Branch set to main
echo.

REM Push to GitHub
echo 🚀 Pushing to GitHub...
git push -u origin main
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo ✅ Successfully pushed to GitHub!
    echo ====================================
    echo.
    echo 🎉 Your code is now on GitHub!
    echo.
    echo 📋 Next Steps:
    echo 1. Visit your repository: %repo_url%
    echo 2. Deploy to Vercel: run deploy.bat
    echo 3. Or deploy directly from GitHub
    echo.
) else (
    echo.
    echo ❌ Push failed
    echo.
    echo 💡 Possible solutions:
    echo 1. Check your GitHub credentials
    echo 2. Verify repository URL is correct
    echo 3. Make sure you have push access
    echo 4. Try: git push -u origin main --force
    echo.
)

pause
