#!/bin/bash

# Automated GitHub Push Script

set -e

echo ""
echo "===================================="
echo "🚀 Push to GitHub"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed"
    echo "Please install Git from: https://git-scm.com/"
    exit 1
fi

print_success "Git found"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    print_info "Initializing Git repository..."
    git init
    print_success "Git initialized"
else
    print_success "Git repository already exists"
fi
echo ""

# Add all files
print_info "Adding files to Git..."
git add .
print_success "Files added"
echo ""

# Commit changes
print_info "Committing changes..."
commit_msg="Complete CrisisTruth platform - Market ready with full automation"
if git commit -m "$commit_msg"; then
    print_success "Changes committed"
else
    print_info "No changes to commit or already committed"
fi
echo ""

# Ask for GitHub repository URL
echo "🔗 GitHub Repository Setup"
echo ""
echo "Do you have a GitHub repository URL?"
echo ""
read -p "Enter 'y' if yes, 'n' to create new: " has_repo

if [[ "$has_repo" == "n" || "$has_repo" == "N" ]]; then
    echo ""
    echo "📋 Create a new repository on GitHub:"
    echo "1. Go to: https://github.com/new"
    echo "2. Repository name: crisistruth-app"
    echo "3. Keep it Public or Private"
    echo "4. DO NOT initialize with README"
    echo "5. Click 'Create repository'"
    echo ""
    read -p "Press Enter when ready..."
fi

echo ""
read -p "Enter your GitHub repository URL: " repo_url

# Check if remote exists
if git remote | grep -q origin; then
    print_info "Updating remote URL..."
    git remote set-url origin "$repo_url"
else
    print_info "Adding remote..."
    git remote add origin "$repo_url"
fi
print_success "Remote configured"
echo ""

# Set main branch
print_info "Setting up main branch..."
git branch -M main
print_success "Branch set to main"
echo ""

# Push to GitHub
print_info "Pushing to GitHub..."
if git push -u origin main; then
    echo ""
    echo "===================================="
    print_success "Successfully pushed to GitHub!"
    echo "===================================="
    echo ""
    echo "🎉 Your code is now on GitHub!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Visit your repository: $repo_url"
    echo "2. Deploy to Vercel: run ./deploy.sh"
    echo "3. Or deploy directly from GitHub"
    echo ""
else
    echo ""
    print_error "Push failed"
    echo ""
    echo "💡 Possible solutions:"
    echo "1. Check your GitHub credentials"
    echo "2. Verify repository URL is correct"
    echo "3. Make sure you have push access"
    echo "4. Try: git push -u origin main --force"
    echo ""
fi
