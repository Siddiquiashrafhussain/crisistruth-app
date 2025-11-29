# CrisisTruth Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Neysa AI Configuration (Optional - will use enhanced mock if not configured)
NEXT_PUBLIC_NEYSA_API_KEY=your_neysa_api_key
NEXT_PUBLIC_NEYSA_API_ENDPOINT=https://api.neysa.ai/v1
NEXT_PUBLIC_NEYSA_MODEL=meta-llama/Meta-Llama-3.1-8B-Instruct
```

### 3. Set Up Supabase Database

#### Option A: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the following SQL files in order:
   - `supabase-schema.sql` (main database schema)
   - `supabase-community-votes-migration.sql` (community verification feature)

#### Option B: Using Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 4. Run Development Server
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features Overview

### ✅ Working Features

1. **Real-Time Verification**
   - Navigate to `/verify`
   - Enter any claim
   - Watch real-time progress updates
   - See live verification results

2. **Multi-Source Analysis**
   - Each claim is verified against 3-5 sources
   - Sources include scientific authorities, news, fact-checkers
   - Credibility scores for each source
   - Visual credibility indicators

3. **Community Verification**
   - Vote on verifications (Agree/Disagree/Unsure)
   - See community consensus
   - View community confidence scores
   - Track your voting history

4. **AI-Powered Analysis**
   - Neysa AI integration (if configured)
   - Enhanced fallback system (works without AI API)
   - Smart keyword-based analysis
   - Comprehensive evidence breakdown

## Testing the Features

### Test Real-Time Verification
1. Go to http://localhost:3000/verify
2. Try these example claims:
   - "Vaccines contain microchips for tracking people"
   - "Climate change is a hoax"
   - "5G towers cause coronavirus"
   - "The moon landing was filmed in a studio"

### Test Multi-Source Display
1. After verification completes
2. Click the "Sources" tab
3. You should see 3-5 sources with:
   - Source name and type
   - Credibility score (0-100%)
   - Excerpt from source
   - Link to full source

### Test Community Verification
1. After verification completes
2. Scroll to "Community Verification" card
3. Click Agree, Disagree, or Unsure
4. See updated statistics
5. Click "Community" tab for detailed insights

### Test Real-Time Updates
1. Open verification page in two browser windows
2. Submit a claim in one window
3. Watch for live updates indicator
4. Both windows should show synchronized data

## Troubleshooting

### Issue: "Verification service temporarily unavailable"
**Solution**: This means Neysa AI is not configured. The system will use enhanced mock verification instead. This is normal and the mock system provides realistic results.

### Issue: Community votes not saving
**Solution**: 
1. Check that `supabase-community-votes-migration.sql` was run
2. Verify Supabase connection in `.env.local`
3. Check browser console for errors

### Issue: Real-time updates not working
**Solution**:
1. Verify Supabase Realtime is enabled in your project
2. Check that Row Level Security policies are set correctly
3. Ensure WebSocket connections are not blocked by firewall

### Issue: TypeScript errors
**Solution**:
```bash
npm run type-check
```
If errors persist, try:
```bash
rm -rf node_modules .next
npm install
```

## Configuration Options

### Using Neysa AI (Optional)
If you have a Neysa AI API key:
1. Add credentials to `.env.local`
2. Restart development server
3. Verifications will use real AI analysis

### Using Mock Verification (Default)
If Neysa AI is not configured:
- System automatically uses enhanced mock verification
- Provides realistic results based on keywords
- Includes 3-5 relevant sources
- Calculates confidence scores
- No API key required

## Database Schema

### Main Tables
- `users` - User accounts and profiles
- `claims` - Submitted claims for verification
- `verifications` - AI verification results
- `sources` - Trusted information sources
- `crises` - Crisis events for claim aggregation
- `community_votes` - Community verification votes

### Key Features
- Row Level Security (RLS) enabled
- Automatic timestamps
- Foreign key constraints
- Indexed for performance
- Real-time subscriptions enabled

## API Endpoints

### POST /api/verify
Submit a claim for verification
```json
{
  "claimText": "string",
  "userId": "string"
}
```

### POST /api/community-vote
Submit a community vote
```json
{
  "claimId": "string",
  "userId": "string",
  "vote": "agree|disagree|unsure",
  "comment": "string (optional)"
}
```

### GET /api/community-vote?claimId=xxx&userId=xxx
Get community statistics for a claim

## Development Tips

### Hot Reload
The development server supports hot reload. Changes to:
- React components
- API routes
- Styles
Will automatically refresh the browser.

### Debugging
1. Check browser console for client-side errors
2. Check terminal for server-side errors
3. Use React DevTools for component inspection
4. Use Network tab to inspect API calls

### Code Structure
```
app/
  ├── api/              # API routes
  ├── verify/           # Verification page
  └── dashboard/        # Dashboard page
lib/
  ├── neysa-ai.ts      # AI verification service
  ├── realtime-service.ts  # Real-time updates
  ├── community-verification.ts  # Community features
  └── supabase.ts      # Database client
components/
  └── ui/              # Reusable UI components
```

## Next Steps

1. **Add Authentication**
   - Replace 'demo-user' with real user IDs
   - Implement login/signup flows
   - Add user profiles

2. **Deploy to Production**
   - Deploy to Vercel
   - Configure production environment variables
   - Set up monitoring and analytics

3. **Enhance Features**
   - Add email notifications
   - Implement fact-checker workflow
   - Create admin dashboard
   - Add subscription tiers

## Support

For issues or questions:
1. Check the `FEATURES_IMPLEMENTATION.md` file
2. Review the design document in `.kiro/specs/real-time-crisis-verification/design.md`
3. Check Supabase logs for database issues
4. Review browser console for client errors

## Success Checklist

- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Supabase database set up
- [ ] Development server running
- [ ] Can access http://localhost:3000
- [ ] Can submit claims for verification
- [ ] Real-time progress updates working
- [ ] Multi-source display showing
- [ ] Community voting functional
- [ ] All icons and elements displaying correctly

If all items are checked, you're ready to go! 🎉
