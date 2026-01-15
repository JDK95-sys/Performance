# Quick Start: Deploy to Vercel with Neon (100% FREE)

**Created by Jonathan De Kryger**

---

## 🎯 **Choose Your Deployment Path**

### Option A: Demo Mode (5 minutes) - For Presentations
**Perfect for:** Demos, sales presentations, quick testing

✅ No database required  
✅ Instant deployment  
⚠️ No data persistence (resets on restart)

👉 **[Follow DEMO_MODE.md](./DEMO_MODE.md)** for this option

---

### Option B: Production Mode (10 minutes) - For Real Use
**Perfect for:** MVPs, real teams, persistent data

✅ Free Neon Postgres database  
✅ Data persists  
✅ Supports 1000+ users

👉 **Continue with this guide** for production deployment

---

## ⚡ 10-Minute Production Deployment

### Prerequisites
- GitHub account (free)
- Vercel account (free)
- Neon account (free)

---

## Step 1: Create Neon Database (2 minutes)

1. Go to **[neon.tech](https://neon.tech)** → Sign up (free, no credit card)
2. Click **"Create Project"**
3. Name: `performpro-db`
4. Region: Choose closest to you
5. Click **"Create Project"**
6. **Copy the connection string** (looks like):
   ```
   postgresql://user:password@ep-something.neon.tech/neondb
   ```

💡 **Save this connection string** - you'll need it in Step 3!

---

## Step 2: Deploy to Vercel (3 minutes)

1. Go to **[vercel.com](https://vercel.com)** → Sign in with GitHub
2. Click **"Add New Project"**
3. Import your `Test` repository
4. Click **"Deploy"** (first deployment, will succeed)

⏳ Wait for deployment to complete (~2 minutes)

---

## Step 3: Add Environment Variables (2 minutes)

In Vercel Dashboard → Your Project → **Settings** → **Environment Variables**

Add these 4 variables (click "Add" after each):

### 1. POSTGRES_URL
- **Name**: `POSTGRES_URL`
- **Value**: Paste your Neon connection string from Step 1
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

### 2. ADMIN_SETUP_KEY
- **Name**: `ADMIN_SETUP_KEY`
- **Value**: `my-secret-admin-key-123` (change this!)
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

### 3. JWT_SECRET
- **Name**: `JWT_SECRET`
- **Value**: Run this to generate:
  ```bash
  openssl rand -base64 32
  ```
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

### 4. SESSION_SECRET
- **Name**: `SESSION_SECRET`
- **Value**: Run this to generate:
  ```bash
  openssl rand -base64 32
  ```
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

Click **"Save"** after adding all variables.

---

## Step 4: Redeploy (1 minute)

1. Go to **Deployments** tab
2. Click **︙** (three dots) on latest deployment
3. Click **"Redeploy"**
4. ✅ Check "Use existing Build Cache"
5. Click **"Redeploy"**

⏳ Wait for deployment (~1 minute)

---

## Step 5: Initialize Database (2 minutes)

After deployment completes, copy your deployment URL (looks like `https://test-abc123.vercel.app`)

Run this command in your terminal (replace values):

```bash
curl -X POST https://YOUR-APP.vercel.app/api/admin/setup-db?seed=true \
  -H "Authorization: Bearer my-secret-admin-key-123"
```

**Expected response:**
```json
{
  "success": true,
  "message": "Database setup completed successfully",
  "initialized": { "success": true },
  "seeded": { "success": true }
}
```

✅ Database is ready!

---

## Step 6: Test Login

1. Visit your Vercel URL: `https://YOUR-APP.vercel.app`
2. Try these demo accounts:

| Role | Email | Features |
|------|-------|----------|
| 👤 Employee | john.smith@company.com | Goals, Feedback, Reviews |
| 👔 Manager | manager@company.com | Team Management, Analytics |
| 💼 HR | admin@company.com | Company-wide Analytics |

No password needed for demo accounts!

---

## 🎉 Done!

Your app is now live at: `https://YOUR-APP.vercel.app`

### What's Running (100% FREE):
- ✅ **Vercel Hosting**: 100 GB bandwidth/month
- ✅ **Neon Postgres**: 512 MB storage (supports 1000+ users)
- ✅ **No credit card required**
- ✅ **Auto-scaling**
- ✅ **SSL certificate included**

---

## 🔧 Next Steps (Optional)

### Add Custom Domain
1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records
4. SSL auto-configured

### Connect Your HRM System
See `HRM_INTEGRATIONS.md` for:
- Workday
- SAP SuccessFactors
- Deel
- BambooHR

### Monitor Your App
- **Logs**: Vercel Dashboard → Deployments → Function Logs
- **Analytics**: Vercel Dashboard → Analytics tab
- **Database**: neon.tech dashboard → SQL Editor

---

## 🚨 Troubleshooting

### "POSTGRES_URL not configured"
- Check that you added the `POSTGRES_URL` in Step 3
- Verify it includes the full connection string
- Redeploy after adding variables

### Database setup fails
- Check Vercel Function Logs for errors
- Ensure Neon project is active (check neon.tech dashboard)
- Verify connection string is correct
- Try the setup command again

### Neon project suspended
- Free tier projects auto-suspend after 7 days of inactivity
- Visit neon.tech dashboard to wake it up
- Or make a request to your app - it auto-wakes in 100-200ms

### Can't login
- Make sure database initialization completed successfully
- Check browser console for errors
- Try clearing cookies and cache

---

## 📊 Free Tier Limits

### Vercel (Free)
- ✅ 100 GB bandwidth/month
- ✅ 100 GB-hours function execution
- ✅ 6,000 build minutes/month

**Good for**: 100-500 users

### Neon (Free)
- ✅ 512 MB storage
- ✅ 3 GB data transfer/month
- ✅ Unlimited compute time
- ⚠️ Auto-suspends after 7 days inactivity

**Good for**: 1000+ users (with query optimization)

### When to Upgrade
- **More storage needed**: Neon Pro ($19/month) → 10 GB
- **Always-on database**: Neon Pro ($19/month) → no auto-suspend
- **More bandwidth**: Vercel Pro ($20/month) → 1 TB
- **Combined**: $39/month supports 5000+ users

---

## 💡 Pro Tips

1. **Keep it awake**: Set up a simple cron job to ping your app daily
2. **Optimize queries**: Use indexes on frequently queried columns
3. **Monitor usage**: Check Vercel and Neon dashboards weekly
4. **Backup data**: Neon Pro includes automated backups
5. **Use branches**: Neon's free tier includes unlimited branches for dev/test

---

## 📞 Need Help?

- **Full Guide**: See `VERCEL_SETUP.md`
- **Installation**: See `INSTALLATION.md`
- **HRM Setup**: See `HRM_INTEGRATIONS.md`
- **Issues**: Open GitHub issue

---

**Created by Jonathan De Kryger** | © 2026 PerformPro

🚀 **Your app is production-ready and 100% free to run!**
