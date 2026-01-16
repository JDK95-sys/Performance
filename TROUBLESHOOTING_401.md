# Troubleshooting 401 Authentication Errors

**Quick Reference Guide for Demo Mode Login Issues**

---

## 🔍 Symptoms

- ✗ "Failed to load resource: the server responded with a status of 401"
- ✗ Cannot sign in to demo page
- ✗ "User isn't registered in database" error

---

## 🎯 Most Common Causes

### 1. DATABASE_PATH Environment Variable Set (90% of cases)

**Problem:** If `DATABASE_PATH` is set in Vercel, demo mode won't activate.

**How to Check:**
1. Go to Vercel Dashboard
2. Select your project
3. Click **Settings** → **Environment Variables**
4. Look for `DATABASE_PATH` or `POSTGRES_URL`

**Fix:**
- ❌ If you see `DATABASE_PATH` → **DELETE IT**
- ❌ If you see `POSTGRES_URL` → **DELETE IT** (for demo mode)
- ✅ After deleting, click "Redeploy"

### 2. JWT_SECRET Not Set or Inconsistent

**Problem:** JWT token generation/validation fails if secret is missing or different.

**How to Check:**
1. Vercel Dashboard → Settings → Environment Variables
2. Look for `JWT_SECRET`

**Fix:**
- ✅ Make sure `JWT_SECRET` is set
- ✅ Make sure it's the same value in all environments (Production, Preview, Development)
- ✅ Can be any string, e.g., `demo-secret-key-123`

### 3. Wrong Email Address

**Problem:** Only 3 demo emails work in demo mode.

**Valid Emails:**
- ✅ `john.smith@company.com` (Employee)
- ✅ `manager@company.com` (Manager)
- ✅ `admin@company.com` (HR Admin)

**Common Mistakes:**
- ❌ `admin@company.com` vs `admin@demo.com`
- ❌ Using uppercase letters (case insensitive but be careful)
- ❌ Using any other email

---

## 🛠️ Debugging Steps (With Logging)

Starting with commit `cb92675`, the application includes detailed logging to help diagnose issues.

### Step 1: Check Vercel Function Logs

**Where to look:**
```
Vercel Dashboard → Deployments → [Latest] → Functions → /api/auth/login
```

**What to look for:**

```log
✅ GOOD - Demo mode is working:
Demo mode active: true
Demo user lookup for john.smith@company.com: true
Generated token for demo user: john.smith@company.com
Login successful for demo user: john.smith@company.com
```

```log
❌ BAD - Demo mode is NOT active (database variables set):
Demo mode active: false
POSTGRES_URL: true   ← This means POSTGRES_URL is set!
DATABASE_PATH: false
```

```log
❌ BAD - Demo user not found:
Demo mode active: true
Demo user lookup for wrong@email.com: false
Returning 401 error
```

### Step 2: Check Browser Developer Console

**How to open:**
- Chrome/Edge: Press `F12` or `Ctrl+Shift+I`
- Firefox: Press `F12` or `Ctrl+Shift+K`
- Safari: Enable Developer Menu, then press `Cmd+Opt+I`

**What to look for:**

```
Network tab → Filter: /api/auth/login → Look at response
```

**Good Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "john.smith@company.com",
    "name": "John Smith",
    "role": "employee"
  },
  "token": "eyJhbGc..."
}
```

**Bad Response (401):**
```json
{
  "error": "Demo user not found. Try: john.smith@company.com, manager@company.com, or admin@company.com",
  "demoMode": true
}
```

### Step 3: Check Server Logs for Environment Detection

Look for these log messages in Vercel function logs:

```log
✅ CORRECT SETUP:
isDemoMode check - POSTGRES_URL: false DATABASE_PATH: false Result: true
JWT_SECRET configured: true Length: 24
```

```log
❌ INCORRECT SETUP (DATABASE_PATH is set):
isDemoMode check - POSTGRES_URL: false DATABASE_PATH: true Result: false
This means demo mode is DISABLED because DATABASE_PATH is set!
```

---

## ✅ Correct Environment Variable Configuration

### For Demo Mode (No Database)

| Variable | Value | Required? |
|----------|-------|-----------|
| `JWT_SECRET` | Any string (e.g., `demo-jwt-secret-123`) | ✅ Required |
| `SESSION_SECRET` | Any string (e.g., `demo-session-secret-123`) | ✅ Required |
| `NODE_ENV` | `production` | ✅ Required |
| `POSTGRES_URL` | **NOT SET** | ❌ Must be empty |
| `DATABASE_PATH` | **NOT SET** | ❌ Must be empty |

**How to verify:**
```bash
# In Vercel function logs, you should see:
Demo mode active: true
POSTGRES_URL: false
DATABASE_PATH: false
```

---

## 🔄 After Making Changes

1. **Delete** any unwanted environment variables
2. **Redeploy** in Vercel:
   - Go to Deployments tab
   - Click ︙ (three dots) on latest deployment
   - Click "Redeploy"
3. **Wait** for deployment to complete (~1-2 minutes)
4. **Check logs** after redeployment
5. **Try logging in** again

---

## 📊 Quick Diagnostic Checklist

Run through this checklist:

- [ ] Environment Variables
  - [ ] JWT_SECRET is set
  - [ ] SESSION_SECRET is set
  - [ ] NODE_ENV is set to 'production'
  - [ ] POSTGRES_URL is NOT set
  - [ ] DATABASE_PATH is NOT set
  
- [ ] Email Address
  - [ ] Using one of the 3 valid demo emails
  - [ ] Email is spelled correctly
  - [ ] No extra spaces

- [ ] Deployment
  - [ ] Latest code is deployed (commit `cb92675` or later)
  - [ ] Redeployed after changing environment variables
  - [ ] Deployment shows "Ready" status

- [ ] Logs Show
  - [ ] "Demo mode active: true"
  - [ ] "JWT_SECRET configured: true"
  - [ ] "Demo user lookup: true"

---

## 🆘 Still Having Issues?

If you've checked everything above and still getting 401 errors:

1. **Capture the logs:**
   - Screenshot of Vercel environment variables (hide sensitive values)
   - Screenshot of Vercel function logs for `/api/auth/login`
   - Screenshot of browser console errors

2. **Share in GitHub issue:**
   - Email you're trying to use
   - Vercel deployment URL
   - Screenshots from step 1

3. **Temporary workaround:**
   - Try deploying in production mode with a Neon database instead
   - See `QUICK_START.md` for instructions

---

## 💡 Understanding Demo Mode

**Demo mode activates automatically when:**
```typescript
!process.env.POSTGRES_URL && !process.env.DATABASE_PATH
```

**This means:**
- ✅ Both variables must be EMPTY/NOT SET
- ❌ If either is set, demo mode is DISABLED
- ❌ Even if set to empty string `""`, it counts as "set"

**To verify demo mode is active:**
- Check Vercel function logs for: `Demo mode active: true`
- Check browser console for: `Using demo data (no database configured)`

---

**Created by Jonathan De Kryger**  
© 2026 PerformPro
