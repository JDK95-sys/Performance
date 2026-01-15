# HRM System Integrations Guide

**Created by Jonathan De Kryger**

Integrate PerformPro with popular HRM platforms: SAP SuccessFactors, Workday, Deel, BambooHR, and more.

---

## Table of Contents

1. [Overview](#overview)
2. [SAP SuccessFactors Integration](#sap-successfactors)
3. [Workday Integration](#workday)
4. [Deel Integration](#deel)
5. [BambooHR Integration](#bamboohr)
6. [Generic HRIS Integration](#generic-hris)
7. [Webhook Setup](#webhooks)
8. [Troubleshooting](#troubleshooting)

---

## Overview

PerformPro can integrate with your existing HRM system to:
- **Sync employee data** (names, departments, managers)
- **Import organizational structure**
- **Export performance reviews**
- **Sync goals and OKRs**
- **Bi-directional feedback sync**

### Supported Integration Methods

| HRM System | OAuth 2.0 | API Key | SCIM | Webhooks | SSO |
|------------|-----------|---------|------|----------|-----|
| SuccessFactors | ✅ | ✅ | ✅ | ✅ | ✅ |
| Workday | ✅ | ✅ | ✅ | ✅ | ✅ |
| Deel | ❌ | ✅ | ❌ | ✅ | ✅ |
| BambooHR | ❌ | ✅ | ❌ | ✅ | ❌ |

---

## SAP SuccessFactors

PerformPro includes built-in SuccessFactors integration.

### Prerequisites

- SuccessFactors company ID
- API user credentials
- OAuth client credentials (for OAuth flow)

### Setup Steps

1. **Get API Credentials**

   In SuccessFactors Admin Center:
   - Go to **Company Settings** → **API Center**
   - Create new OAuth client
   - Note: Client ID, Client Secret, Company ID

2. **Configure Environment Variables**

   Add to `.env.local` or Vercel environment variables:

   ```bash
   # SuccessFactors API
   SUCCESSFACTORS_COMPANY_ID=your-company-id
   SUCCESSFACTORS_API_URL=https://api.successfactors.com
   SUCCESSFACTORS_CLIENT_ID=your-client-id
   SUCCESSFACTORS_CLIENT_SECRET=your-client-secret

   # For API Key authentication (alternative)
   SUCCESSFACTORS_API_KEY=your-api-key
   ```

3. **Enable Integration**

   The integration is already coded in `lib/integrations/successfactors.ts`. Just set the environment variables and restart.

4. **Test Connection**

   ```bash
   curl https://your-app.com/api/integrations/successfactors/test \
     -H "Authorization: Bearer your-admin-key"
   ```

### Data Sync

**Manual Sync**:
```bash
curl -X POST https://your-app.com/api/integrations/successfactors/sync \
  -H "Authorization: Bearer your-admin-key" \
  -H "Content-Type: application/json" \
  -d '{"syncType": "employees"}'
```

**Automated Sync** (add to cron or Vercel Cron):
```javascript
// app/api/cron/sync-sf/route.ts
export async function GET() {
  const { syncEmployees } = await import('@/lib/integrations/successfactors');
  await syncEmployees();
  return Response.json({ success: true });
}
```

### SSO Setup

1. In SuccessFactors, configure SAML SSO
2. Set redirect URL: `https://your-app.com/api/auth/sso/callback`
3. Map attributes:
   - Email → `email`
   - Name → `name`
   - Department → `department`

---

## Workday

### Prerequisites

- Workday tenant name
- Integration System User (ISU) credentials
- Web Services API access

### Setup Steps

1. **Create Integration System User**

   In Workday:
   - **Workday Admin** → **Create Integration System User**
   - Username: `performpro_api`
   - Generate password
   - Note credentials

2. **Grant Permissions**

   Required domain permissions:
   - `Worker Data: Public Worker Reports`
   - `Organization Data: View Organizations`
   - `Performance Management: View and Edit Performance`
   - `Goals: View and Edit Goals`

3. **Configure Environment Variables**

   ```bash
   # Workday API
   WORKDAY_TENANT=your-tenant-name
   WORKDAY_API_URL=https://wd2-impl-services1.workday.com
   WORKDAY_USERNAME=performpro_api@tenant
   WORKDAY_PASSWORD=your-secure-password

   # Optional: OAuth (recommended for production)
   WORKDAY_CLIENT_ID=your-client-id
   WORKDAY_CLIENT_SECRET=your-client-secret
   WORKDAY_REFRESH_TOKEN=your-refresh-token
   ```

4. **Install Workday Integration Package**

   ```bash
   npm install @performpro/workday-integration
   ```

5. **Create Integration File**

   Create `lib/integrations/workday.ts`:

   ```typescript
   import axios from 'axios';

   const WORKDAY_API_URL = process.env.WORKDAY_API_URL;
   const WORKDAY_TENANT = process.env.WORKDAY_TENANT;
   const WORKDAY_USERNAME = process.env.WORKDAY_USERNAME;
   const WORKDAY_PASSWORD = process.env.WORKDAY_PASSWORD;

   const workdayClient = axios.create({
     baseURL: `${WORKDAY_API_URL}/ccx/service/${WORKDAY_TENANT}`,
     auth: {
       username: WORKDAY_USERNAME!,
       password: WORKDAY_PASSWORD!
     },
     headers: {
       'Content-Type': 'application/json',
       'Accept': 'application/json'
     }
   });

   export async function syncWorkdayEmployees() {
     try {
       const response = await workdayClient.get('/Human_Resources/v39.2/Workers');
       const workers = response.data.Report_Entry;

       for (const worker of workers) {
         await db.prepare(`
           INSERT INTO users (email, name, department, title, manager_id)
           VALUES (?, ?, ?, ?, ?)
           ON CONFLICT(email) DO UPDATE SET
             name = excluded.name,
             department = excluded.department,
             title = excluded.title
         `).run(
           worker.Email,
           worker.Legal_Name,
           worker.Department,
           worker.Job_Title,
           null // Map manager separately
         );
       }

       return { success: true, synced: workers.length };
     } catch (error) {
       console.error('Workday sync error:', error);
       throw error;
     }
   }

   export async function syncWorkdayPerformance() {
     // Sync performance reviews from Workday
     const response = await workdayClient.get('/Performance_Management/v39.2/Performance_Reviews');
     // Process and store in PerformPro database
   }

   export async function pushGoalsToWorkday(goal: any) {
     // Push PerformPro goals to Workday
     await workdayClient.post('/Goals/v39.2/Goals', {
       Goal_Name: goal.title,
       Goal_Description: goal.description,
       Due_Date: goal.due_date
       // Map other fields
     });
   }
   ```

6. **Create Sync API Endpoint**

   ```typescript
   // app/api/integrations/workday/sync/route.ts
   import { NextRequest, NextResponse } from 'next/server';
   import { syncWorkdayEmployees } from '@/lib/integrations/workday';

   export async function POST(request: NextRequest) {
     try {
       const result = await syncWorkdayEmployees();
       return NextResponse.json(result);
     } catch (error: any) {
       return NextResponse.json({ error: error.message }, { status: 500 });
     }
   }
   ```

### OAuth 2.0 Setup (Recommended)

1. Register OAuth client in Workday
2. Get authorization code
3. Exchange for access token
4. Store refresh token securely

```typescript
async function getWorkdayAccessToken() {
   const response = await axios.post(
     `${WORKDAY_API_URL}/ccx/oauth2/${WORKDAY_TENANT}/token`,
     new URLSearchParams({
       grant_type: 'refresh_token',
       refresh_token: process.env.WORKDAY_REFRESH_TOKEN!,
       client_id: process.env.WORKDAY_CLIENT_ID!,
       client_secret: process.env.WORKDAY_CLIENT_SECRET!
     })
   );
   return response.data.access_token;
 }
```

---

## Deel

Deel is a payroll and compliance platform. Integration focuses on employee data sync.

### Prerequisites

- Deel API key
- Organization ID

### Setup Steps

1. **Get API Key**

   - Login to Deel dashboard
   - Go to **Settings** → **API**
   - Generate API key
   - Copy key

2. **Configure Environment**

   ```bash
   DEEL_API_KEY=your-deel-api-key
   DEEL_API_URL=https://api.deel.com/v1
   DEEL_ORG_ID=your-organization-id
   ```

3. **Create Integration**

   ```typescript
   // lib/integrations/deel.ts
   import axios from 'axios';

   const deelClient = axios.create({
     baseURL: process.env.DEEL_API_URL,
     headers: {
       'Authorization': `Bearer ${process.env.DEEL_API_KEY}`,
       'Content-Type': 'application/json'
     }
   });

   export async function syncDeelEmployees() {
     try {
       const response = await deelClient.get('/contracts', {
         params: {
           organization_id: process.env.DEEL_ORG_ID,
           status: 'active'
         }
       });

       const contracts = response.data.data;

       for (const contract of contracts) {
         await db.prepare(`
           INSERT INTO users (email, name, department, title, location)
           VALUES (?, ?, ?, ?, ?)
           ON CONFLICT(email) DO UPDATE SET
             name = excluded.name,
             department = excluded.department,
             title = excluded.title,
             location = excluded.location
         `).run(
           contract.worker.email,
           `${contract.worker.first_name} ${contract.worker.last_name}`,
           contract.team_name || 'General',
           contract.job_title,
           contract.worker.country
         );
       }

       return { success: true, synced: contracts.length };
     } catch (error: any) {
       console.error('Deel sync error:', error);
       throw error;
     }
   }

   export async function getDeelContractInfo(email: string) {
     const response = await deelClient.get('/contracts', {
       params: { worker_email: email }
     });
     return response.data.data[0];
   }
   ```

4. **Create Sync Endpoint**

   ```typescript
   // app/api/integrations/deel/sync/route.ts
   import { NextRequest, NextResponse } from 'next/server';
   import { syncDeelEmployees } from '@/lib/integrations/deel';

   export async function POST(request: NextRequest) {
     const authHeader = request.headers.get('authorization');
     if (authHeader !== `Bearer ${process.env.ADMIN_SETUP_KEY}`) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }

     try {
       const result = await syncDeelEmployees();
       return NextResponse.json(result);
     } catch (error: any) {
       return NextResponse.json({ error: error.message }, { status: 500 });
     }
   }
   ```

### Webhook Setup (Optional)

Deel can send webhooks for contract updates:

```typescript
// app/api/webhooks/deel/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const signature = request.headers.get('x-deel-signature');

  // Verify webhook signature
  // ... verification logic

  switch (payload.event_type) {
    case 'contract.created':
    case 'contract.updated':
      // Update user in database
      await syncSingleDeelEmployee(payload.data.worker.email);
      break;
    case 'contract.terminated':
      // Mark user as inactive
      await deactivateUser(payload.data.worker.email);
      break;
  }

  return NextResponse.json({ received: true });
}
```

---

## BambooHR

### Prerequisites

- BambooHR subdomain
- API key

### Setup

1. **Get API Key**
   - BambooHR → **Account** → **API Keys**
   - Generate new key

2. **Configure Environment**

   ```bash
   BAMBOOHR_SUBDOMAIN=your-company
   BAMBOOHR_API_KEY=your-api-key
   ```

3. **Integration Code**

   ```typescript
   // lib/integrations/bamboohr.ts
   import axios from 'axios';

   const bambooClient = axios.create({
     baseURL: `https://api.bamboohr.com/api/gateway.php/${process.env.BAMBOOHR_SUBDOMAIN}/v1`,
     auth: {
       username: process.env.BAMBOOHR_API_KEY!,
       password: 'x' // BambooHR uses API key as username
     },
     headers: {
       'Accept': 'application/json'
     }
   });

   export async function syncBambooHREmployees() {
     const response = await bambooClient.get('/employees/directory');
     const employees = response.data.employees;

     for (const emp of employees) {
       await db.prepare(`
         INSERT INTO users (email, name, department, title)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(email) DO UPDATE SET
           name = excluded.name,
           department = excluded.department,
           title = excluded.title
       `).run(
         emp.workEmail,
         `${emp.firstName} ${emp.lastName}`,
         emp.department,
         emp.jobTitle
       );
     }

     return { success: true, synced: employees.length };
   }
   ```

---

## Generic HRIS Integration

For custom or less common HR systems:

### REST API Integration

```typescript
// lib/integrations/generic.ts
export async function syncGenericHRIS(config: {
  apiUrl: string;
  apiKey: string;
  mappings: {
    email: string;
    name: string;
    department: string;
    title: string;
  };
}) {
  const client = axios.create({
    baseURL: config.apiUrl,
    headers: {
       'Authorization': `Bearer ${config.apiKey}`,
       'Content-Type': 'application/json'
    }
  });

  const response = await client.get('/employees');
  const employees = response.data;

  for (const emp of employees) {
    await db.prepare(`
      INSERT INTO users (email, name, department, title)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET
        name = excluded.name,
        department = excluded.department,
        title = excluded.title
    `).run(
      emp[config.mappings.email],
      emp[config.mappings.name],
      emp[config.mappings.department],
      emp[config.mappings.title]
    );
  }

  return { success: true };
}
```

### CSV Import

```typescript
// app/api/integrations/csv/import/route.ts
import { parse } from 'csv-parse/sync';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const content = await file.text();

  const records = parse(content, {
    columns: true,
    skip_empty_lines: true
  });

  for (const record of records) {
    await db.prepare(`
      INSERT INTO users (email, name, department, title)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET
        name = excluded.name,
        department = excluded.department,
        title = excluded.title
    `).run(record.email, record.name, record.department, record.title);
  }

  return NextResponse.json({ imported: records.length });
}
```

---

## Webhooks

Set up webhooks to receive real-time updates from HRM systems.

### Webhook Endpoint Template

```typescript
// app/api/webhooks/[provider]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const payload = await request.json();
  const signature = request.headers.get('x-webhook-signature');

  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET!)
    .update(JSON.stringify(payload))
    .digest('hex');

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // Process webhook
  switch (params.provider) {
    case 'workday':
      await handleWorkdayWebhook(payload);
      break;
    case 'successfactors':
      await handleSuccessFactorsWebhook(payload);
      break;
    case 'deel':
      await handleDeelWebhook(payload);
      break;
  }

  return NextResponse.json({ received: true });
}
```

### Configure Webhook URLs

Add these URLs in your HRM system:

- **Workday**: `https://your-app.com/api/webhooks/workday`
- **SuccessFactors**: `https://your-app.com/api/webhooks/successfactors`
- **Deel**: `https://your-app.com/api/webhooks/deel`

---

## Automated Sync (Cron)

### Vercel Cron

Create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-employees",
      "schedule": "0 2 * * *"
    }
  ]
}
```

Create endpoint:

```typescript
// app/api/cron/sync-employees/route.ts
import { syncWorkdayEmployees } from '@/lib/integrations/workday';
import { syncDeelEmployees } from '@/lib/integrations/deel';

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Sync all integrations
  const results = await Promise.all([
    syncWorkdayEmployees(),
    syncDeelEmployees()
  ]);

  return Response.json({ success: true, results });
}
```

### Self-Hosted Cron

Add to crontab:

```bash
# Daily at 2 AM
0 2 * * * curl -X GET https://your-app.com/api/cron/sync-employees \
  -H "Authorization: Bearer your-cron-secret"
```

---

## Troubleshooting

### Authentication Fails

1. **Verify credentials** in environment variables
2. **Check API key** hasn't expired
3. **Test connection** with curl
4. **Check IP whitelist** if applicable

### Sync Errors

```bash
# Check sync logs
curl https://your-app.com/api/integrations/logs \
  -H "Authorization: Bearer your-admin-key"
```

### Rate Limiting

Most APIs have rate limits:
- **Workday**: 1000 requests/hour
- **SuccessFactors**: 500 requests/minute
- **Deel**: 100 requests/minute

Implement retry with exponential backoff:

```typescript
async function retryWithBackoff(fn: Function, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (error.response?.status === 429 && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      } else {
        throw error;
      }
    }
  }
}
```

---

## Support

For integration support:
- **Documentation**: See individual HRM system docs
- **Issues**: [GitHub Issues](https://github.com/JDK95-sys/Test/issues)
- **Author**: Jonathan De Kryger

---

**Created by Jonathan De Kryger** | © 2026 PerformPro
