# Supabase Setup Guide for CrisisTruth

## Quick Setup (5 minutes)

### 1. Access Your Supabase Project

Your Supabase project is already configured:
- **Project URL**: https://reijuueiauolboakjgmy.supabase.co
- **Publishable Key**: sb_publishable_DXbtjctoOwE2tJIHXbCyrQ_Y8fTGF9f

### 2. Run Database Schema

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/reijuueiauolboakjgmy

2. Click on **SQL Editor** in the left sidebar

3. Click **New Query**

4. Copy the entire contents of `supabase-schema.sql` file

5. Paste into the SQL editor

6. Click **Run** to execute the schema

This will create:
- ✅ All database tables (users, claims, verifications, crises, etc.)
- ✅ Indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ Demo data (admin user, sources, crises)

### 3. Verify Setup

After running the schema, verify in Supabase Dashboard:

1. Go to **Table Editor**
2. You should see these tables:
   - users
   - claims
   - verifications
   - sources
   - crises
   - crisis_tags
   - fact_checker_assignments
   - flagged_content
   - subscriptions
   - usage_tracking

### 4. Test the Connection

Run the development server:

```bash
npm run dev
```

Visit http://localhost:3000/verify and try submitting a claim!

## Database Structure

### Core Tables

**users**
- Stores user accounts with roles (user, fact-checker, admin)
- Subscription tiers (free, pro, enterprise)

**claims**
- User-submitted claims for verification
- Links to users and crises

**verifications**
- AI verification results
- Confidence scores and summaries

**crises**
- Crisis events for organizing claims
- Priority levels and status tracking

**sources**
- Trusted sources for fact-checking
- Credibility ratings

### Demo Accounts

The schema creates these demo accounts:

**Admin**
- Email: admin@crisistruth.org
- Role: admin
- Tier: enterprise

**Fact-Checker**
- Email: factchecker@crisistruth.org
- Role: fact-checker
- Tier: pro

**Demo User**
- Email: demo@crisistruth.org
- Role: user
- Tier: free

## Security

### Row Level Security (RLS)

RLS is enabled on all tables with these policies:

- **Users**: Can only view/update their own data
- **Claims**: Anyone can read, authenticated users can create
- **Verifications**: Public read access
- **Crises**: Public read access, admin write access

### API Keys

Two types of keys are used:

1. **Anon/Public Key** (already in .env.local)
   - Used for client-side requests
   - Respects RLS policies
   - Safe to expose in frontend

2. **Service Role Key** (optional, for admin operations)
   - Bypasses RLS
   - Keep secret, server-side only
   - Get from: Dashboard → Settings → API

## Environment Variables

Your `.env.local` is already configured:

```env
NEXT_PUBLIC_SUPABASE_URL=https://reijuueiauolboakjgmy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_DXbtjctoOwE2tJIHXbCyrQ_Y8fTGF9f
```

## API Integration

### Verify a Claim

```typescript
// POST /api/verify
const response = await fetch('/api/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    claimText: 'Your claim here',
    userId: 'user-id'
  })
})
```

### Query Claims

```typescript
import { supabase } from '@/lib/supabase'

// Get all claims
const { data: claims } = await supabase
  .from('claims')
  .select('*')
  .order('created_at', { ascending: false })

// Get claims by status
const { data: verified } = await supabase
  .from('claims')
  .select('*')
  .eq('status', 'verified')
```

### Query Crises

```typescript
// Get all active crises
const { data: crises } = await supabase
  .from('crises')
  .select('*')
  .eq('status', 'active')
  .order('priority', { ascending: false })
```

## Real-Time Subscriptions

Enable real-time updates for live dashboard:

```typescript
// Subscribe to new claims
const subscription = supabase
  .channel('claims-channel')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'claims' },
    (payload) => {
      console.log('New claim:', payload.new)
    }
  )
  .subscribe()
```

## Backup and Maintenance

### Automatic Backups

Supabase automatically backs up your database daily.

### Manual Backup

1. Go to Dashboard → Database → Backups
2. Click **Create Backup**
3. Download when needed

### View Logs

1. Go to Dashboard → Logs
2. Select log type (API, Database, Auth)
3. Monitor errors and performance

## Troubleshooting

### Connection Issues

```bash
# Test Supabase connection
curl https://reijuueiauolboakjgmy.supabase.co/rest/v1/ \
  -H "apikey: sb_publishable_DXbtjctoOwE2tJIHXbCyrQ_Y8fTGF9f"
```

### RLS Policy Issues

If you can't access data:
1. Check RLS policies in Dashboard → Authentication → Policies
2. Verify user is authenticated
3. Check policy conditions match your use case

### Schema Changes

To modify schema:
1. Write SQL in SQL Editor
2. Test in development first
3. Apply to production
4. Update TypeScript types in `lib/supabase.ts`

## Next Steps

1. ✅ Run the schema SQL
2. ✅ Verify tables are created
3. ✅ Test claim verification
4. ✅ Set up authentication (optional)
5. ✅ Configure real-time subscriptions
6. ✅ Deploy to production

## Production Checklist

Before going live:

- [ ] Run schema in production database
- [ ] Update RLS policies for production security
- [ ] Set up database backups
- [ ] Configure monitoring and alerts
- [ ] Test all API endpoints
- [ ] Verify Neysa AI integration
- [ ] Set up error tracking
- [ ] Configure rate limiting
- [ ] Test subscription flows
- [ ] Verify email notifications

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Dashboard**: https://supabase.com/dashboard/project/reijuueiauolboakjgmy
- **Community**: https://github.com/supabase/supabase/discussions

---

**Your database is ready to power CrisisTruth! 🚀**
