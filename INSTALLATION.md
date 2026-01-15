# PerformPro Installation Guide

**Created by Jonathan De Kryger**

This guide covers multiple installation methods for PerformPro, from quick Vercel deployment to self-hosted enterprise setups.

---

## Table of Contents

1. [Quick Start (Vercel - Recommended)](#quick-start-vercel)
2. [Self-Hosted Installation](#self-hosted-installation)
3. [Docker Installation](#docker-installation)
4. [Enterprise Kubernetes Deployment](#kubernetes-deployment)
5. [Database Setup](#database-setup)
6. [Environment Configuration](#environment-configuration)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start (Vercel)

**Best for**: MVP, demos, small-medium teams (<100 users)

### Prerequisites
- GitHub account
- Vercel account (free tier available)

### Steps

1. **Fork/Clone this repository**
   ```bash
   git clone https://github.com/JDK95-sys/Test.git
   cd Test
   ```

2. **Deploy to Vercel**

   Click the button below or import manually:

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/JDK95-sys/Test)

   Or manually:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Add Vercel Postgres Database**

   In your Vercel project dashboard:
   - Go to **Storage** tab
   - Click **Create Database** → **Postgres**
   - Name it `performpro-db`
   - Select your region
   - Click **Create**

4. **Configure Environment Variables**

   In Vercel Dashboard → Settings → Environment Variables:

   ```bash
   ADMIN_SETUP_KEY=your-secret-admin-key-here
   JWT_SECRET=generate-random-32-char-string
   SESSION_SECRET=generate-random-32-char-string
   NODE_ENV=production
   ```

   Generate secrets:
   ```bash
   openssl rand -base64 32
   ```

5. **Redeploy with Environment Variables**
   - Deployments tab → Latest deployment → Redeploy

6. **Initialize Database**

   After deployment, run:
   ```bash
   curl -X POST https://your-app.vercel.app/api/admin/setup-db?seed=true \
     -H "Authorization: Bearer your-secret-admin-key-here"
   ```

7. **Test Your Application**

   Visit your Vercel URL and login with:
   - **Employee**: john.smith@company.com
   - **Manager**: manager@company.com
   - **HR**: admin@company.com

**Full Vercel guide**: See [VERCEL_SETUP.md](./VERCEL_SETUP.md)

---

## Self-Hosted Installation

**Best for**: Custom infrastructure, air-gapped environments, full control

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+ OR SQLite (for development)
- Git

### Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/JDK95-sys/Test.git
   cd Test
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**

   **Option A: PostgreSQL (Production)**
   ```bash
   # Install PostgreSQL
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib

   # macOS
   brew install postgresql@14

   # Create database
   createdb performpro

   # Create user
   psql -d performpro
   CREATE USER performpro_user WITH PASSWORD 'your-secure-password';
   GRANT ALL PRIVILEGES ON DATABASE performpro TO performpro_user;
   ```

   **Option B: SQLite (Development)**
   - No setup needed, works out of the box

4. **Configure Environment Variables**

   Create `.env.local`:
   ```bash
   # Database (choose one)
   # For PostgreSQL:
   POSTGRES_URL=postgresql://performpro_user:password@localhost:5432/performpro

   # For SQLite (development):
   DATABASE_PATH=./data/performpro.db

   # Authentication
   JWT_SECRET=your-jwt-secret-here
   SESSION_SECRET=your-session-secret-here

   # Admin
   ADMIN_SETUP_KEY=your-admin-key

   # Environment
   NODE_ENV=production
   ```

5. **Initialize Database**

   **For PostgreSQL**:
   ```bash
   npm run setup-db
   ```

   Or call the API:
   ```bash
   curl -X POST http://localhost:3000/api/admin/setup-db?seed=true \
     -H "Authorization: Bearer your-admin-key"
   ```

   **For SQLite**: Database auto-initializes on first run

6. **Build and Run**

   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   npm start
   ```

7. **Access Application**

   Open http://localhost:3000

### Production Deployment (PM2)

For production on VPS/dedicated servers:

```bash
# Install PM2
npm install -g pm2

# Build application
npm run build

# Start with PM2
pm2 start npm --name "performpro" -- start

# Auto-restart on reboot
pm2 startup
pm2 save

# Monitor
pm2 monit
pm2 logs performpro
```

---

## Docker Installation

**Best for**: Containerized environments, easy deployment

### Prerequisites
- Docker 20+
- Docker Compose

### Quick Start

1. **Create docker-compose.yml**
   ```yaml
   version: '3.8'

   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - POSTGRES_URL=postgresql://performpro:password@db:5432/performpro
         - JWT_SECRET=${JWT_SECRET}
         - SESSION_SECRET=${SESSION_SECRET}
         - NODE_ENV=production
       depends_on:
         - db
       restart: unless-stopped

     db:
       image: postgres:14-alpine
       environment:
         - POSTGRES_DB=performpro
         - POSTGRES_USER=performpro
         - POSTGRES_PASSWORD=password
       volumes:
         - postgres_data:/var/lib/postgresql/data
       restart: unless-stopped

   volumes:
     postgres_data:
   ```

2. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS builder

   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM node:18-alpine AS runner

   WORKDIR /app
   ENV NODE_ENV=production

   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static

   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

3. **Create .env file**
   ```bash
   JWT_SECRET=your-jwt-secret
   SESSION_SECRET=your-session-secret
   ```

4. **Run**
   ```bash
   docker-compose up -d
   ```

5. **Initialize Database**
   ```bash
   docker-compose exec app curl -X POST http://localhost:3000/api/admin/setup-db?seed=true \
     -H "Authorization: Bearer your-admin-key"
   ```

6. **Access**
   Open http://localhost:3000

---

## Kubernetes Deployment

**Best for**: Enterprise scale, high availability, auto-scaling

### Prerequisites
- Kubernetes cluster (1.20+)
- kubectl configured
- Helm 3+ (optional)

### Deployment

1. **Create namespace**
   ```bash
   kubectl create namespace performpro
   ```

2. **Create secrets**
   ```bash
   kubectl create secret generic performpro-secrets \
     --from-literal=jwt-secret=$(openssl rand -base64 32) \
     --from-literal=session-secret=$(openssl rand -base64 32) \
     --from-literal=postgres-password=$(openssl rand -base64 32) \
     -n performpro
   ```

3. **Deploy PostgreSQL**
   ```bash
   # Using Helm
   helm install postgresql bitnami/postgresql \
     --set auth.username=performpro \
     --set auth.database=performpro \
     --set auth.existingSecret=performpro-secrets \
     --set auth.secretKeys.adminPasswordKey=postgres-password \
     -n performpro
   ```

4. **Create deployment YAML** (`k8s-deployment.yaml`)
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: performpro
     namespace: performpro
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: performpro
     template:
       metadata:
         labels:
           app: performpro
       spec:
         containers:
         - name: performpro
           image: your-registry/performpro:latest
           ports:
           - containerPort: 3000
           env:
           - name: POSTGRES_URL
             value: "postgresql://performpro:$(POSTGRES_PASSWORD)@postgresql:5432/performpro"
           - name: JWT_SECRET
             valueFrom:
               secretKeyRef:
                 name: performpro-secrets
                 key: jwt-secret
           - name: SESSION_SECRET
             valueFrom:
               secretKeyRef:
                 name: performpro-secrets
                 key: session-secret
           - name: POSTGRES_PASSWORD
             valueFrom:
               secretKeyRef:
                 name: performpro-secrets
                 key: postgres-password
           resources:
             requests:
               memory: "256Mi"
               cpu: "250m"
             limits:
               memory: "512Mi"
               cpu: "500m"
   ---
   apiVersion: v1
   kind: Service
   metadata:
     name: performpro
     namespace: performpro
   spec:
     type: LoadBalancer
     selector:
       app: performpro
     ports:
     - port: 80
       targetPort: 3000
   ```

5. **Apply configuration**
   ```bash
   kubectl apply -f k8s-deployment.yaml
   ```

6. **Verify deployment**
   ```bash
   kubectl get pods -n performpro
   kubectl get svc -n performpro
   ```

---

## Database Setup

### PostgreSQL Schema

The database schema is automatically created when you run the setup endpoint. Manual SQL scripts are available in `lib/db-vercel.ts`.

### Migrations

For production updates, run migrations carefully:

```bash
# Backup first!
pg_dump performpro > backup_$(date +%Y%m%d).sql

# Run migration endpoint (create if needed)
curl -X POST https://your-app/api/admin/migrate \
  -H "Authorization: Bearer your-admin-key"
```

### Backup Strategy

**Automated backups**:
```bash
# Daily backup cron
0 2 * * * pg_dump performpro | gzip > /backups/performpro_$(date +\%Y\%m\%d).sql.gz
```

---

## Environment Configuration

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | JWT signing secret (32+ chars) | `generated-random-string` |
| `SESSION_SECRET` | Session encryption key | `generated-random-string` |
| `ADMIN_SETUP_KEY` | Admin API authentication | `your-secret-key` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_PATH` | SQLite path (dev only) | `./data/marketplace.db` |
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `3000` |

### HRM Integration Variables

See [HRM_INTEGRATIONS.md](./HRM_INTEGRATIONS.md) for SuccessFactors, Workday, and Deel configuration.

---

## Troubleshooting

### Build Fails with "better-sqlite3" Error

This is expected on Vercel/serverless. The app uses SQLite for local dev and Postgres for production.

**Solution**: Ensure `POSTGRES_URL` is set in production environments.

### Database Connection Fails

1. Check connection string format
2. Verify database exists
3. Check firewall rules
4. Test connection:
   ```bash
   psql $POSTGRES_URL
   ```

### Port Already in Use

```bash
# Find process
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port
PORT=3001 npm start
```

### Permission Denied Errors

```bash
# Fix data directory permissions
chmod 755 data/
chown -R $(whoami) data/
```

---

## Production Checklist

Before going live:

- [ ] Changed all default secrets and passwords
- [ ] Set up automated database backups
- [ ] Configured SSL/TLS certificates
- [ ] Set up monitoring and alerting
- [ ] Enabled rate limiting
- [ ] Reviewed security settings
- [ ] Set up logging aggregation
- [ ] Configured CDN for static assets
- [ ] Load tested with expected user count
- [ ] Set up disaster recovery plan

---

## Support

- **Documentation**: See [README.md](./README.md)
- **Issues**: [GitHub Issues](https://github.com/JDK95-sys/Test/issues)
- **Author**: Jonathan De Kryger

---

**Created by Jonathan De Kryger** | © 2026 PerformPro
