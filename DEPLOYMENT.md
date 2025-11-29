# CrisisTruth Deployment Guide

## 🚀 Quick Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- Supabase project (already configured)

### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - CrisisTruth platform"

# Create GitHub repository and push
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

5. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://reijuueiauolboakjgmy.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_DXbtjctoOwE2tJIHXbCyrQ_Y8fTGF9f
   NEXT_PUBLIC_NEYSA_API_KEY=psai__aAYQI9dI_mnwynSgFbMJhQYyqXBZWaSNdXND6AHtyhWALQx
   NEXT_PUBLIC_NEYSA_API_ENDPOINT=https://api.pipeshift.ai/v1
   NEXT_PUBLIC_NEYSA_MODEL=qwen3-vl-30b-a3b
   ```

6. Click **"Deploy"**

7. Wait 2-3 minutes for deployment

8. Your app will be live at: `https://your-project.vercel.app`

### Step 3: Configure Custom Domain (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate is automatic

## 📊 Supabase Production Setup

### 1. Run Database Schema

If you haven't already:

1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase-schema.sql`
3. Run the SQL
4. Verify tables are created

### 2. Configure RLS Policies

Row Level Security is already configured in the schema, but verify:

1. Go to Authentication → Policies
2. Check that policies exist for:
   - users
   - claims
   - verifications
   - crises

### 3. Enable Realtime (Optional)

For live dashboard updates:

1. Go to Database → Replication
2. Enable replication for tables:
   - claims
   - verifications
   - crises

### 4. Set Up Backups

1. Go to Database → Backups
2. Verify daily backups are enabled
3. Consider upgrading plan for more frequent backups

## 🔐 Security Checklist

### Environment Variables

- [x] Supabase URL and keys configured
- [x] Neysa AI API key secured
- [ ] Add Stripe keys (when implementing payments)
- [ ] Add SendGrid key (when implementing emails)

### Supabase Security

- [x] RLS policies enabled
- [x] Anon key used for client-side
- [ ] Service role key kept secret (server-side only)
- [ ] API rate limiting configured

### Application Security

- [ ] CORS configured for production domain
- [ ] CSP headers configured
- [ ] Input validation on all forms
- [ ] SQL injection prevention (using Supabase client)
- [ ] XSS prevention (React default)

## 📈 Performance Optimization

### Next.js Optimizations

Already configured:
- ✅ Image optimization (Next.js Image component)
- ✅ Code splitting (automatic)
- ✅ Static generation where possible

To add:
- [ ] Configure CDN for static assets
- [ ] Enable ISR (Incremental Static Regeneration)
- [ ] Add caching headers

### Database Optimizations

Already configured:
- ✅ Indexes on frequently queried fields
- ✅ Efficient query patterns

To monitor:
- [ ] Query performance in Supabase Dashboard
- [ ] Connection pooling (automatic in Supabase)
- [ ] Database size and growth

## 🔍 Monitoring Setup

### Vercel Analytics

1. Go to Vercel Dashboard → Analytics
2. Enable Web Analytics (free)
3. View real-time traffic and performance

### Supabase Monitoring

1. Go to Supabase Dashboard → Logs
2. Monitor:
   - API requests
   - Database queries
   - Error rates

### Error Tracking (Optional)

Add Sentry for error tracking:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

## 🧪 Testing Before Production

### 1. Test All Features

- [ ] User registration/login
- [ ] Claim submission
- [ ] AI verification
- [ ] Dashboard display
- [ ] Crisis management
- [ ] Admin panel

### 2. Test on Multiple Devices

- [ ] Desktop (Chrome, Firefox, Safari)
- [ ] Mobile (iOS Safari, Android Chrome)
- [ ] Tablet

### 3. Performance Testing

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run performance audit
lighthouse https://your-app.vercel.app --view
```

Target scores:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### 4. Load Testing

Use [k6](https://k6.io/) or similar:

```bash
# Install k6
# Run load test
k6 run load-test.js
```

## 📱 Progressive Web App (PWA)

To make CrisisTruth installable:

1. Install next-pwa:
```bash
npm install next-pwa
```

2. Configure in `next.config.js`

3. Add manifest.json

4. Test installation on mobile

## 🌍 CDN and Global Distribution

Vercel automatically provides:
- ✅ Global CDN
- ✅ Edge functions
- ✅ Automatic SSL
- ✅ DDoS protection

## 💰 Cost Estimation

### Free Tier (Development)

**Vercel:**
- Hosting: Free
- Bandwidth: 100GB/month
- Builds: Unlimited

**Supabase:**
- Database: 500MB
- Bandwidth: 2GB
- API requests: Unlimited

**Neysa AI:**
- Complimentary for hackathon

**Total: $0/month**

### Production (Estimated)

**Vercel Pro ($20/month):**
- Unlimited bandwidth
- Advanced analytics
- Team collaboration

**Supabase Pro ($25/month):**
- 8GB database
- 50GB bandwidth
- Daily backups
- Point-in-time recovery

**Neysa AI:**
- Contact for pricing

**Total: ~$45/month + AI costs**

## 🚨 Troubleshooting

### Build Failures

```bash
# Check TypeScript errors
npm run type-check

# Check for missing dependencies
npm install

# Clear cache and rebuild
rm -rf .next
npm run build
```

### API Errors

1. Check Vercel logs: Dashboard → Deployments → [Latest] → Logs
2. Check Supabase logs: Dashboard → Logs → API
3. Verify environment variables are set

### Database Connection Issues

1. Verify Supabase URL is correct
2. Check API key is valid
3. Test connection:
```bash
curl https://reijuueiauolboakjgmy.supabase.co/rest/v1/ \
  -H "apikey: sb_publishable_DXbtjctoOwE2tJIHXbCyrQ_Y8fTGF9f"
```

## 📋 Post-Deployment Checklist

- [ ] Application is accessible at production URL
- [ ] All environment variables are set
- [ ] Database schema is deployed
- [ ] Demo data is loaded
- [ ] SSL certificate is active
- [ ] Custom domain configured (if applicable)
- [ ] Analytics are tracking
- [ ] Error monitoring is active
- [ ] Backups are configured
- [ ] Performance scores are acceptable
- [ ] Mobile responsiveness verified
- [ ] All features tested in production
- [ ] Documentation is updated
- [ ] Team has access to dashboards

## 🎉 Go Live!

Once all checks pass:

1. Announce launch
2. Monitor initial traffic
3. Watch for errors
4. Gather user feedback
5. Iterate and improve

## 📞 Support

- **Vercel Support**: https://vercel.com/support
- **Supabase Support**: https://supabase.com/support
- **Neysa AI Support**: Contact PipeShift

---

**Your CrisisTruth platform is ready for the world! 🌍**
