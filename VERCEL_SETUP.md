# Vercel Deployment Guide for PerformPro

This guide will help you deploy PerformPro to Vercel with full database support.

## Prerequisites

- GitHub account
- Vercel account (free tier works!)
- Git repository with your code

## Step 1: Push Code to GitHub

```bash
git add -A
git commit -m "Ready for Vercel deployment"
git push origin main
```

## Step 2: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Click "Deploy" (initial deployment)

## Step 3: Add Neon Postgres Database (FREE)

**Why Neon?** Vercel Postgres is a paid service. Neon offers a generous free tier (512 MB storage, 3 GB data transfer) that's perfect for MVPs and small teams.

1. Go to [neon.tech](https://neon.tech) and sign up (free)
2. Click **Create Project**
3. Choose a name: `performpro-db`
4. Select region (choose closest to your users)
5. Click **Create Project**
6. Copy the connection string (looks like: `postgresql://user:pass@ep-*.neon.tech/neondb`)

### Add Neon to Vercel

1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add a new variable:
   - **Name**: `POSTGRES_URL`
   - **Value**: Your Neon connection string
   - **Environments**: Production, Preview, Development
3. Click **Save**

**Neon Free Tier Limits:**
- ✅ 512 MB storage (sufficient for 1000+ users)
- ✅ 3 GB data transfer/month
- ✅ Unlimited queries
- ✅ No credit card required

## Step 4: Add Additional Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```bash
# Admin setup key (change this!)
ADMIN_SETUP_KEY=your-secret-admin-key-here

# JWT Secret for authentication (generate a random string)
JWT_SECRET=your-jwt-secret-here

# Session Secret (generate a random string)
SESSION_SECRET=your-session-secret-here

# Node Environment
NODE_ENV=production
```

**To generate random secrets:**
```bash
# On Mac/Linux
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Step 5: Redeploy with Environment Variables

1. Go to **Deployments** tab
2. Click the three dots on the latest deployment
3. Select **Redeploy**
4. Check "Use existing Build Cache"
5. Click **Redeploy**

## Step 6: Initialize Database Schema

After successful deployment, initialize your database:

**Option A: Using cURL**
```bash
curl -X POST https://your-app.vercel.app/api/admin/setup-db?seed=true \
  -H "Authorization: Bearer your-secret-admin-key-here"
```

**Option B: Using Browser**
1. Visit `https://your-app.vercel.app/api/admin/setup-db`
2. It will show you the setup instructions
3. Use a tool like Postman or Thunder Client to make the POST request with auth header

**Expected Response:**
```json
{
  "success": true,
  "message": "Database setup completed successfully",
  "initialized": { "success": true },
  "seeded": { "success": true }
}
```

## Step 7: Test Your Application

1. Visit your Vercel deployment URL
2. Try logging in with demo accounts:
   - **Employee**: john.smith@company.com
   - **Manager**: manager@company.com
   - **HR**: admin@company.com

## Troubleshooting

### Build Fails with "better-sqlite3" Error

This is expected! The app uses SQLite for local development but Postgres on Vercel. The build should work because we've configured it to skip database initialization during build.

If you still see errors:
1. Check that `SKIP_DATABASE_INIT` is being set correctly in `next.config.js`
2. Verify environment variables are set in Vercel dashboard

### "POSTGRES_URL not configured" Error

1. Make sure you created the Neon database in Step 3
2. Verify the `POSTGRES_URL` environment variable is set in Vercel Settings → Environment Variables
3. Make sure the connection string includes `?sslmode=require` at the end if not already present
4. Redeploy the application

### Database Setup Fails

1. Check Vercel logs: Deployments → [your deployment] → Function Logs
2. Verify the POSTGRES_URL connection string is correct
3. Test the connection string in Neon's SQL Editor to ensure it works
4. Check that Neon project is not suspended (free tier projects suspend after 7 days of inactivity)
5. Try running the setup endpoint again

### Neon Connection Issues

1. Ensure your Neon project is active (check neon.tech dashboard)
2. Verify the connection string includes the correct database name
3. Check that SSL is enabled (Neon requires SSL connections)
4. Free tier projects auto-suspend after inactivity - visit your Neon dashboard to wake it up

### Authentication Not Working

1. Make sure JWT_SECRET and SESSION_SECRET are set
2. Try clearing cookies and logging in again
3. Check browser console for errors

## Production Checklist

Before going live with real users:

- [ ] Changed ADMIN_SETUP_KEY from default
- [ ] Set secure JWT_SECRET and SESSION_SECRET
- [ ] Database is initialized and seeded
- [ ] Tested all three user roles (Employee, Manager, HR)
- [ ] Removed or secured the `/api/admin/setup-db` endpoint
- [ ] Set up custom domain (optional)
- [ ] Configured proper CORS if using API from other domains

## Custom Domain Setup (Optional)

1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions
4. Wait for SSL certificate to be issued (automatic)

## Monitoring and Logs

- **Function Logs**: Deployments → [deployment] → Function Logs
- **Real-time Logs**: Install Vercel CLI and run `vercel logs`
- **Analytics**: Available in Vercel dashboard (Analytics tab)

## Free Tier Limits

**Vercel Free Tier:**
- **Bandwidth**: 100 GB/month
- **Function Execution**: 100 GB-hours
- **Build Minutes**: 6,000/month
- **Serverless Functions**: Unlimited

**Neon Free Tier:**
- **Storage**: 512 MB (sufficient for 1000+ users)
- **Data Transfer**: 3 GB/month
- **Compute**: Unlimited
- **Projects**: 1 project
- **Branches**: Unlimited (great for dev/staging)
- **Auto-suspend**: After 7 days of inactivity (instant wake-up)

**This combination is sufficient for:**
- Small to medium teams (100-500 users)
- MVPs and demos
- Development and testing
- Side projects

## Scaling to Production

**When you outgrow the free tier:**

**Option 1: Stay Free**
- Optimize queries to reduce data transfer
- Archive old data
- Use Neon's branching for dev/test environments

**Option 2: Upgrade Selectively**
- Keep Vercel free, upgrade Neon to Pro ($19/month) for more storage
- Or upgrade Vercel to Pro ($20/month) for more bandwidth
- Total cost: $19-39/month for 1000+ users

**Option 3: Full Upgrade**
- Vercel Pro ($20/month) + Neon Pro ($19/month)
- Supports 5000+ users
- Priority support on both platforms
3. Add monitoring and error tracking (Sentry, LogRocket)
4. Set up CI/CD with GitHub Actions
5. Add rate limiting to API endpoints

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres
- **Issues**: Open an issue in your GitHub repository

---

**Ready to deploy? Start with Step 1!**
