# Demo Mode Deployment (ZERO Setup!)

**Created by Jonathan De Kryger**

---

## 🎯 **Perfect For**

- 📊 **Presentations & Demos**: Show off the platform instantly
- 🚀 **Quick Testing**: Test features without database setup
- 👨‍💼 **Stakeholder Reviews**: Let decision-makers try it immediately
- 🎓 **Training**: Safe environment for learning the platform

---

## ⚡ **5-Minute Deployment (NO Database Required)**

### What You Get:
- ✅ **Zero configuration**: No database, no setup
- ✅ **Instant deployment**: Deploy and use immediately
- ✅ **Full features**: All dashboards and features work
- ✅ **Demo accounts**: Pre-loaded with realistic data
- ⚠️ **No persistence**: Data resets on restart (perfect for demos!)

### How Demo Mode Works:
Demo mode automatically activates when **NO database** is configured. Simply deploy without adding `POSTGRES_URL` or `DATABASE_PATH` environment variables, and the app will use in-memory demo data.

---

## 🚀 **Deploy Now**

### Step 1: Deploy to Vercel (3 minutes)

1. Go to [vercel.com](https://vercel.com) → Sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Click **"Deploy"**

⏳ Wait 2 minutes... Done!

### Step 2: Add Minimal Environment Variables (1 minute)

**CRITICAL:** In Vercel Dashboard → Your Project → **Settings** → **Environment Variables**

Add these 3 variables (and ONLY these - do NOT add POSTGRES_URL for demo mode):

| Name | Value | Environments |
|------|-------|--------------|
| `JWT_SECRET` | `demo-jwt-secret-replace-in-production` | ✅ All |
| `SESSION_SECRET` | `demo-session-secret-replace-in-production` | ✅ All |
| `NODE_ENV` | `production` | ✅ All |

**Important:** 
- ❌ Do NOT add `POSTGRES_URL` - this would disable demo mode
- ❌ Do NOT add `DATABASE_PATH` - this would disable demo mode
- ✅ Check all three environment checkboxes (Production, Preview, Development)

**That's it!** No `POSTGRES_URL` = Demo Mode activated automatically!

### Step 3: Redeploy (1 minute)

1. Deployments tab → ︙ → **Redeploy**
2. Wait 1 minute

✅ **Your demo is live!**

---

## 🎭 **Demo Accounts**

Your app now has 3 pre-loaded demo accounts:

| Role | Email | Features |
|------|-------|----------|
| 👤 **Employee** | john.smith@company.com | Goals, Feedback, Reviews, AI Insights |
| 👔 **Manager** | manager@company.com | Team Management, Performance Analytics |
| 💼 **HR** | admin@company.com | Company-wide Analytics, 9-Box Matrix |

**No password needed** - just enter the email and click "Sign in"!

---

## 📊 **What's Included (Demo Data)**

### Employee Dashboard:
- ✅ 2 active goals with progress tracking
- ✅ 2 feedback items (1 praise, 1 constructive)
- ✅ 1 completed performance review
- ✅ AI-powered insights and recommendations
- ✅ Key metrics dashboard

### Manager Dashboard:
- ✅ Team health score (82/100)
- ✅ 3 team members with performance data
- ✅ Talent distribution metrics
- ✅ Performance analytics

### HR Dashboard:
- ✅ Company-wide metrics (14,250 employees)
- ✅ Performance distribution charts
- ✅ 9-Box talent matrix
- ✅ Department breakdown
- ✅ Talent insights

---

## 🎪 **Demo Mode Features**

### ✅ Everything Works:
- Role-based dashboards
- Goal tracking with OKRs
- Continuous feedback
- Performance reviews
- AI insights
- 9-Box talent matrix
- All navigation and UI

### ⚠️ Limitations (By Design):
- **No persistence**: Data resets when Vercel restarts (every ~7 days)
- **Fixed data**: Can't create new users/goals (demo accounts only)
- **Read-only**: Viewing works, creating/editing returns to demo state

### 💡 **Perfect For Demos Because**:
- Always shows clean, consistent data
- No "empty state" screens
- Can't be broken by test users
- Instant reset by redeploying

---

## 🔄 **Upgrade to Full Version**

When you're ready for production with real data:

### Option 1: Add Neon Database (Still FREE!)
1. Create [neon.tech](https://neon.tech) account (free)
2. Create project → Copy connection string
3. Add to Vercel: `POSTGRES_URL=postgresql://...`
4. Redeploy
5. Run database setup: `/api/admin/setup-db?seed=true`

**Time**: 10 minutes | **Cost**: $0/month

### Option 2: Add Vercel KV (Lightweight)
1. Vercel Dashboard → Storage → Create → KV
2. Auto-configured, no setup needed
3. Redeploy

**Time**: 5 minutes | **Cost**: $0/month (256 MB free)

### Option 3: Add Vercel Postgres
1. Vercel Dashboard → Storage → Create → Postgres
2. Auto-configured
3. Redeploy
4. Run database setup

**Time**: 10 minutes | **Cost**: Free tier (256 MB)

---

## 💡 **Pro Tips for Demos**

### Before Presenting:
1. **Test all accounts**: Login as each role (Employee, Manager, HR)
2. **Check deployment**: Ensure it's on latest version
3. **Open in incognito**: Clear cookies for clean demo
4. **Bookmark**: Save each dashboard URL for quick switching

### During Demo:
1. **Start with Employee**: Shows end-user perspective
2. **Move to Manager**: Show team features
3. **Finish with HR**: Impressive company-wide analytics
4. **Highlight AI features**: Insights are attention-grabbing

### Demo Script:
```
1. Login Page (30 sec)
   - "Enterprise SSO authentication"
   - Show demo account options

2. Employee Dashboard (2 min)
   - Overview with AI insights
   - Active goals with progress
   - Feedback system
   - Performance reviews

3. Manager Dashboard (2 min)
   - Team health score
   - Performance distribution
   - Talent management

4. HR Dashboard (2 min)
   - Company-wide analytics
   - 9-Box talent matrix
   - Department insights
```

---

## 🚨 **Important Notes**

### Demo Mode is Active When:
- ❌ No `POSTGRES_URL` environment variable
- ❌ No `DATABASE_PATH` environment variable
- ✅ Application detects no database and activates demo mode automatically

### Check if Demo Mode is Active:
Look at the browser console (F12) - it will show:
```
Using demo data (no database configured)
```

### Deactivate Demo Mode:
Add any database connection string to Vercel environment variables and redeploy.

---

## 📊 **Demo Mode vs. Production**

| Feature | Demo Mode | Production |
|---------|-----------|------------|
| **Setup Time** | 5 minutes | 15 minutes |
| **Database** | None | Postgres/Neon |
| **Cost** | $0 | $0-$39/month |
| **Data Persistence** | ❌ No | ✅ Yes |
| **User Creation** | ❌ Fixed accounts | ✅ Unlimited |
| **Best For** | Demos, presentations | Real usage |
| **Scalability** | N/A | 1000+ users |

---

## 🎯 **Use Cases**

### Perfect For:
- 🎤 **Sales Demos**: Show prospects the platform
- 📊 **Investor Pitches**: Demonstrate functionality
- 👨‍💼 **Stakeholder Reviews**: Get executive buy-in
- 🎓 **Training Sessions**: Safe learning environment
- 🧪 **A/B Testing UI**: Test design changes

### Not Suitable For:
- ❌ Real user data
- ❌ Long-term testing
- ❌ Integration testing with real HRM systems
- ❌ Load testing

---

## 🔧 **Troubleshooting**

### "Demo user not found" or "User isn't registered in database"
This usually means demo mode isn't properly activated. Follow these steps:

1. **Check environment variables in Vercel:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Verify `JWT_SECRET` and `SESSION_SECRET` are set
   - **Verify `POSTGRES_URL` is NOT set** (this disables demo mode)
   - **Verify `DATABASE_PATH` is NOT set** (this disables demo mode)

2. **Use the correct demo email addresses:**
   - ✅ john.smith@company.com (Employee)
   - ✅ manager@company.com (Manager)
   - ✅ admin@company.com (HR Admin)
   - ❌ Any other email will fail

3. **Redeploy after checking environment variables:**
   - Go to Deployments tab
   - Click ︙ (three dots) → Redeploy
   - Wait for deployment to complete

### App shows empty dashboards
- Check browser console (F12) for errors
- Ensure demo mode is active (check for "Using demo data" message in console)
- Try clearing cookies and cache, then login again
- Verify you're using one of the three demo email addresses

### "Not authenticated" or session issues
- Clear browser cookies for your Vercel domain
- Try in an incognito/private window
- Check that JWT_SECRET and SESSION_SECRET are set in Vercel environment variables
- Redeploy if you just added the environment variables

### Want to add custom demo data?
Edit `/lib/demo-data.ts` and redeploy:
- Add more demo users
- Customize goals and feedback
- Adjust metrics and scores

---

## 📞 **Questions?**

- **Setup Issues**: Check `QUICK_START.md`
- **Want Database**: See `VERCEL_SETUP.md`
- **Production Deploy**: See `DEPLOYMENT_SUMMARY.md`

---

## 🎉 **You're Ready to Demo!**

Your app is now deployed in demo mode. Just visit your Vercel URL and start presenting!

**Demo URL**: `https://your-app.vercel.app`

**Created by Jonathan De Kryger** | © 2026 PerformPro

---

**🚀 Deploy in 5 minutes. Present in 5 minutes. Impress stakeholders.** ✨
