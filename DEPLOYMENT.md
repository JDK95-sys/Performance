# PerformPro - Production Deployment Guide

This guide covers deploying PerformPro to production for enterprise use with 14K+ employees.

## 📋 Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Infrastructure Requirements](#infrastructure-requirements)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Deployment Options](#deployment-options)
- [Security Hardening](#security-hardening)
- [Monitoring & Logging](#monitoring--logging)
- [Backup & Recovery](#backup--recovery)
- [Performance Optimization](#performance-optimization)
- [Post-Deployment](#post-deployment)

---

## 🔍 Pre-Deployment Checklist

### Critical Items

- [ ] **Strong secrets generated** for JWT_SECRET and SESSION_SECRET
- [ ] **PostgreSQL database** provisioned and configured
- [ ] **SSL certificates** obtained for HTTPS
- [ ] **Environment variables** configured for production
- [ ] **Backup strategy** implemented
- [ ] **Monitoring** tools configured (Sentry, DataDog, etc.)
- [ ] **Load testing** completed
- [ ] **Security audit** performed
- [ ] **Disaster recovery plan** documented

### Recommended Items

- [ ] **Redis** configured for caching
- [ ] **CDN** set up for static assets
- [ ] **Email service** configured for notifications
- [ ] **Rate limiting** enabled
- [ ] **CORS** properly configured
- [ ] **CI/CD pipeline** set up
- [ ] **Staging environment** tested
- [ ] **User documentation** prepared

---

## 🏗️ Infrastructure Requirements

### Minimum Production Specs (14K Users)

**Application Server:**
- **CPU:** 4+ cores
- **RAM:** 16GB+
- **Storage:** 100GB SSD
- **OS:** Linux (Ubuntu 22.04 LTS recommended)

**Database Server (PostgreSQL):**
- **CPU:** 8+ cores
- **RAM:** 32GB+
- **Storage:** 500GB SSD with automatic backups
- **Version:** PostgreSQL 14+

**Cache Server (Optional but Recommended):**
- **Redis:** 4GB+ RAM
- **Purpose:** Session storage, API caching

### Recommended Architecture

```
┌──────────────┐
│ Load Balancer│ (HTTPS, SSL termination)
└──────┬───────┘
       │
   ┌───┴────┐
   │        │
┌──▼──┐  ┌─▼───┐
│App 1│  │App 2│  (Multiple instances for HA)
└──┬──┘  └──┬──┘
   │        │
   └───┬────┘
       │
   ┌───▼────────┐
   │ PostgreSQL │  (Primary + Replica)
   └────────────┘
       │
   ┌───▼─────┐
   │  Redis  │  (Cache)
   └─────────┘
```

---

## 🗄️ Database Setup

### 1. Install PostgreSQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql-14 postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Create Database and User

```sql
-- Connect to PostgreSQL
sudo -u postgres psql

-- Create database
CREATE DATABASE performpro;

-- Create user with strong password
CREATE USER performpro_user WITH ENCRYPTED PASSWORD 'CHANGE_THIS_STRONG_PASSWORD';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE performpro TO performpro_user;

-- Enable UUID extension (if needed)
\c performpro
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\q
```

### 3. Configure PostgreSQL for Performance

Edit `/etc/postgresql/14/main/postgresql.conf`:

```conf
# Connection Settings
max_connections = 200
shared_buffers = 8GB          # 25% of total RAM
effective_cache_size = 24GB   # 75% of total RAM
work_mem = 64MB
maintenance_work_mem = 2GB

# Write Performance
wal_buffers = 16MB
checkpoint_completion_target = 0.9
random_page_cost = 1.1        # For SSD

# Query Planning
default_statistics_target = 100
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

### 4. Migrate Database Schema

Since PerformPro currently uses SQLite, you'll need to migrate:

**Option A: Manual Migration (Recommended for first time)**

1. Run the app once with PostgreSQL configured to create tables
2. Or use a migration tool like Prisma/TypeORM

**Option B: Export/Import (If migrating from SQLite)**

```bash
# Export from SQLite
sqlite3 data/marketplace.db .dump > dump.sql

# Import to PostgreSQL (after editing dump.sql for compatibility)
psql -U performpro_user -d performpro < dump.sql
```

---

## ⚙️ Environment Configuration

### 1. Generate Secure Secrets

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate Session secret
openssl rand -base64 32
```

### 2. Create Production .env File

```bash
cp .env.example .env
nano .env
```

### 3. Critical Production Variables

```env
# Application
NEXT_PUBLIC_APP_URL=https://performpro.yourcompany.com
NODE_ENV=production

# Security (USE YOUR GENERATED SECRETS!)
JWT_SECRET=your_generated_jwt_secret_here
SESSION_SECRET=your_generated_session_secret_here

# Database
DATABASE_URL=postgresql://performpro_user:PASSWORD@localhost:5432/performpro?sslmode=require
DATABASE_SSL=true
DATABASE_POOL_MAX=20

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🚀 Deployment Options

### Option 1: Vercel (Easiest, Recommended for Quick Start)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel --prod
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard > Project Settings > Environment Variables
   - Add all production variables from .env

3. **Configure PostgreSQL**
   - Use Vercel Postgres or external PostgreSQL (recommended)

**Pros:** Easy setup, automatic SSL, CDN included, serverless
**Cons:** Cold starts, vendor lock-in

### Option 2: AWS EC2 (Full Control)

1. **Launch EC2 Instance**
   - Choose Ubuntu 22.04 LTS
   - Instance type: t3.xlarge or larger
   - Configure security group (allow 80, 443, 22)

2. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install PM2
   sudo npm install -g pm2

   # Install Nginx
   sudo apt install -y nginx
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/JDK95-sys/Test.git /var/www/performpro
   cd /var/www/performpro

   # Checkout production branch
   git checkout main

   # Install dependencies
   npm install --production

   # Build application
   npm run build

   # Start with PM2
   pm2 start npm --name "performpro" -- start
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx**
   ```nginx
   # /etc/nginx/sites-available/performpro
   server {
       listen 80;
       server_name performpro.yourcompany.com;

       # Redirect to HTTPS
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name performpro.yourcompany.com;

       ssl_certificate /etc/letsencrypt/live/performpro.yourcompany.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/performpro.yourcompany.com/privkey.pem;

       # Security headers
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-XSS-Protection "1; mode=block" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Enable SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d performpro.yourcompany.com
   ```

### Option 3: Docker (Containerized)

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS base

   # Dependencies
   FROM base AS deps
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production

   # Builder
   FROM base AS builder
   WORKDIR /app
   COPY . .
   COPY --from=deps /app/node_modules ./node_modules
   RUN npm run build

   # Runner
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV production

   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs

   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

   USER nextjs
   EXPOSE 3000
   ENV PORT 3000

   CMD ["node", "server.js"]
   ```

2. **Build and Run**
   ```bash
   docker build -t performpro:latest .
   docker run -p 3000:3000 --env-file .env performpro:latest
   ```

---

## 🔒 Security Hardening

### 1. Enable HTTPS Only

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ]
  }
}
```

### 2. Configure Rate Limiting

Create `lib/rate-limit.ts`:
```typescript
import { LRUCache } from 'lru-cache'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  })

  return {
    check: (res: Response, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0]
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount)
        }
        tokenCount[0] += 1

        const currentUsage = tokenCount[0]
        const isRateLimited = currentUsage >= limit
        res.headers.set('X-RateLimit-Limit', limit.toString())
        res.headers.set('X-RateLimit-Remaining', isRateLimited ? '0' : (limit - currentUsage).toString())

        return isRateLimited ? reject() : resolve()
      }),
  }
}
```

### 3. Database Security

```sql
-- Create read-only user for reporting
CREATE USER performpro_readonly WITH PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE performpro TO performpro_readonly;
GRANT USAGE ON SCHEMA public TO performpro_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO performpro_readonly;

-- Enable row-level security
ALTER TABLE pm_reviews ENABLE ROW LEVEL SECURITY;

-- Create policy (example)
CREATE POLICY review_privacy ON pm_reviews
  USING (employee_id = current_user_id());
```

---

## 📊 Monitoring & Logging

### 1. Set Up Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

Configure `sentry.client.config.ts`:
```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
})
```

### 2. Application Logging

Create `lib/logger.ts`:
```typescript
import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }))
}

export default logger
```

### 3. Database Monitoring

```sql
-- Enable query logging (PostgreSQL)
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_duration = on;
SELECT pg_reload_conf();

-- Monitor slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

---

## 💾 Backup & Recovery

### 1. Automated Database Backups

```bash
# Create backup script
#!/bin/bash
# /usr/local/bin/backup-performpro.sh

BACKUP_DIR="/backups/performpro"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="performpro"
DB_USER="performpro_user"

# Create backup
pg_dump -U $DB_USER -Fc $DB_NAME > $BACKUP_DIR/backup_$DATE.dump

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.dump" -mtime +30 -delete

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR/backup_$DATE.dump s3://your-bucket/performpro/backups/
```

Add to crontab:
```bash
# Backup daily at 2 AM
0 2 * * * /usr/local/bin/backup-performpro.sh
```

### 2. Recovery Procedure

```bash
# Restore from backup
pg_restore -U performpro_user -d performpro -c backup_YYYYMMDD_HHMMSS.dump
```

---

## ⚡ Performance Optimization

### 1. Enable Caching with Redis

```bash
# Install Redis
sudo apt install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf
# Set: maxmemory 4gb
# Set: maxmemory-policy allkeys-lru

# Restart
sudo systemctl restart redis
```

### 2. Database Optimization

```sql
-- Create indexes for common queries
CREATE INDEX CONCURRENTLY idx_pm_reviews_employee_status
ON pm_reviews(employee_id, status);

CREATE INDEX CONCURRENTLY idx_goals_owner_status
ON goals(owner_id, status);

CREATE INDEX CONCURRENTLY idx_feedback_to_user
ON feedback(to_user_id, created_at DESC);

-- Analyze tables
ANALYZE pm_reviews;
ANALYZE goals;
ANALYZE feedback;

-- Vacuum
VACUUM ANALYZE;
```

### 3. Next.js Optimizations

```javascript
// next.config.js
module.exports = {
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // Image optimization
  images: {
    domains: ['yourcdn.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
}
```

---

## ✅ Post-Deployment

### 1. Smoke Tests

```bash
# Test homepage
curl -I https://performpro.yourcompany.com

# Test API
curl https://performpro.yourcompany.com/api/auth/me

# Test database connection
# Login and verify data loads
```

### 2. Load Testing

```bash
# Install k6
sudo apt install k6

# Run load test
k6 run load-test.js
```

Example `load-test.js`:
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
};

export default function () {
  let response = http.get('https://performpro.yourcompany.com');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```

### 3. User Acceptance Testing

- [ ] HR can view organization-wide analytics
- [ ] Managers can see team performance
- [ ] Employees can view their reviews and goals
- [ ] Feedback system works
- [ ] Performance is acceptable (< 2s page load)
- [ ] Mobile responsiveness verified

### 4. Go-Live Checklist

- [ ] DNS configured
- [ ] SSL certificate valid
- [ ] Monitoring alerts configured
- [ ] Backup tested and verified
- [ ] Support team briefed
- [ ] User documentation published
- [ ] Rollback plan prepared
- [ ] Stakeholders notified

---

## 🆘 Troubleshooting

### Common Issues

**Database Connection Errors:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -U performpro_user -d performpro -h localhost
```

**High Memory Usage:**
```bash
# Check PM2 processes
pm2 monit

# Restart if needed
pm2 restart performpro
```

**Slow Queries:**
```sql
-- Find slow queries
SELECT query, mean_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

---

## 📞 Support

For deployment assistance:
- Technical Lead: [Your Contact]
- DevOps Team: [Team Contact]
- Emergency Hotline: [Emergency Contact]

---

**Last Updated:** January 2025
**Version:** 1.0.0
