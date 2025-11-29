#!/bin/bash

# CrisisTruth Setup Script
# This script helps you set up the CrisisTruth platform quickly

echo "🚀 CrisisTruth Setup Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm --version) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found"
    echo "   Creating .env.local with default values..."
    
    cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://reijuueiauolboakjgmy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_DXbtjctoOwE2tJIHXbCyrQ_Y8fTGF9f

# Neysa AI Configuration (PipeShift API)
NEXT_PUBLIC_NEYSA_API_KEY=psai__aAYQI9dI_mnwynSgFbMJhQYyqXBZWaSNdXND6AHtyhWALQx
NEXT_PUBLIC_NEYSA_API_ENDPOINT=https://api.pipeshift.ai/v1
NEXT_PUBLIC_NEYSA_MODEL=qwen3-vl-30b-a3b

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
EOF

    echo "✅ .env.local created"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Set up Supabase database:"
echo "   - Go to: https://supabase.com/dashboard/project/reijuueiauolboakjgmy"
echo "   - Click 'SQL Editor'"
echo "   - Run the SQL from 'supabase-schema.sql'"
echo "   - See SUPABASE_SETUP.md for details"
echo ""
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. Open your browser:"
echo "   http://localhost:3000"
echo ""
echo "4. Test claim verification:"
echo "   - Go to /verify"
echo "   - Submit a test claim"
echo "   - Watch AI verification in action!"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Project overview"
echo "   - QUICKSTART.md - Quick start guide"
echo "   - SUPABASE_SETUP.md - Database setup"
echo "   - DEPLOYMENT.md - Deployment guide"
echo "   - MARKET_READY_CHECKLIST.md - Launch checklist"
echo ""
echo "🎉 Happy fact-checking!"
echo ""
