# 🚀 Push to GitHub - Quick Guide

## Automated Push (Easiest)

### Windows
```bash
push-to-github.bat
```

### Mac/Linux
```bash
chmod +x push-to-github.sh
./push-to-github.sh
```

The script will:
1. ✅ Initialize Git (if needed)
2. ✅ Add all files
3. ✅ Commit changes
4. ✅ Configure remote
5. ✅ Push to GitHub

---

## Manual Push (Alternative)

### Step 1: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `crisistruth-app`
3. Description: "AI-powered fact-checking platform"
4. Choose Public or Private
5. **DO NOT** check "Initialize with README"
6. Click "Create repository"

### Step 2: Initialize Git (if not done)

```bash
git init
```

### Step 3: Add Files

```bash
git add .
```

### Step 4: Commit

```bash
git commit -m "Complete CrisisTruth platform - Market ready"
```

### Step 5: Add Remote

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/crisistruth-app.git
```

### Step 6: Push

```bash
git branch -M main
git push -u origin main
```

---

## Troubleshooting

### Authentication Error

If you get authentication errors:

**Option 1: Use Personal Access Token**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo`
4. Copy the token
5. Use it as password when pushing

**Option 2: Use SSH**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub
# Copy the public key
cat ~/.ssh/id_ed25519.pub

# Add at: https://github.com/settings/keys
```

### Push Rejected

If push is rejected:

```bash
# Force push (use with caution)
git push -u origin main --force
```

### Remote Already Exists

If remote already exists:

```bash
# Update remote URL
git remote set-url origin https://github.com/YOUR_USERNAME/crisistruth-app.git
```

---

## After Pushing

### Deploy to Vercel from GitHub

1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `crisistruth-app` repository
4. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://reijuueiauolboakjgmy.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_DXbtjctoOwE2tJIHXbCyrQ_Y8fTGF9f
   NEXT_PUBLIC_NEYSA_API_KEY=psai__aAYQI9dI_mnwynSgFbMJhQYyqXBZWaSNdXND6AHtyhWALQx
   NEXT_PUBLIC_NEYSA_API_ENDPOINT=https://api.pipeshift.ai/v1
   NEXT_PUBLIC_NEYSA_MODEL=qwen3-vl-30b-a3b
   ```
5. Click "Deploy"
6. Wait 2-3 minutes
7. Your app is live! 🎉

### Deploy to Netlify from GitHub

1. Go to: https://app.netlify.com/start
2. Click "Import from Git"
3. Select GitHub
4. Choose your repository
5. Build settings are auto-detected from `netlify.toml`
6. Click "Deploy site"
7. Your app is live! 🎉

---

## Quick Commands Reference

```bash
# Check git status
git status

# View commit history
git log --oneline

# View remote URL
git remote -v

# Pull latest changes
git pull origin main

# Push new changes
git add .
git commit -m "Your message"
git push origin main
```

---

## 🎉 Success!

Once pushed, your code is:
- ✅ Backed up on GitHub
- ✅ Version controlled
- ✅ Ready for collaboration
- ✅ Ready for deployment
- ✅ Accessible anywhere

---

## Next Steps

1. ✅ Push to GitHub (you're here!)
2. 🚀 Deploy to Vercel/Netlify
3. 📊 Set up Supabase database
4. 🧪 Test your deployment
5. 🎊 Launch to the world!

---

**Need help?** Check `DEPLOYMENT.md` for full deployment guide.
