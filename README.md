# PerformPro - AI-Powered Performance Management System

**Created by Jonathan De Kryger**

A comprehensive enterprise-grade performance management platform designed for organizations with 14K+ employees. Built with modern AI insights and inspired by Eightfold.ai and CultureAmp's industry-leading UX design.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)
[![Neon](https://img.shields.io/badge/Database-Neon-green)](https://neon.tech)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 🚀 **Choose Your Deployment**

### 🎭 Demo Mode (5 Minutes) - **FASTEST FOR DEMOS**
Zero database, instant deployment!

```bash
✅ Perfect for: Presentations, Sales Demos, Quick Testing
⚡ Setup: 5 minutes | Cost: $0/month
📊 Includes: 3 pre-loaded demo accounts with realistic data
```

**Deploy:** [DEMO_MODE.md](./DEMO_MODE.md) | **Accounts**: john.smith@company.com, manager@company.com, admin@company.com

---

### 🗄️ Neon Database (10 Minutes) - **RECOMMENDED FOR PRODUCTION**
100% free with persistent data!

```bash
✅ Perfect for: MVPs, Small Teams (100-500 users), Production
⚡ Setup: 10 minutes | Cost: $0/month (Vercel + Neon)
💾 Storage: 512 MB (1000+ users) | Bandwidth: 100 GB/month
```

**Deploy:** [QUICK_START.md](./QUICK_START.md)

---

### 🔧 Self-Hosted (1-2 Hours) - **FULL CONTROL**
Custom infrastructure, unlimited scale.

```bash
✅ Perfect for: Enterprise, Custom Requirements, 1000+ users
⚡ Setup: 1-2 hours | Cost: $20-100/month
```

**Deploy:** [INSTALLATION.md](./INSTALLATION.md)

---

## 🚀 Overview

PerformPro is a modern performance management system that combines continuous feedback, goal tracking, performance reviews, and AI-powered insights into a unified platform. Designed for scale and built with security in mind.

### ✨ Key Features

- 📊 **Performance Reviews** - Self, manager, and 360-degree reviews with competency assessments
- 🎯 **Goals & OKRs** - Hierarchical goal tracking with key results and progress monitoring
- 💬 **Continuous Feedback** - Real-time feedback exchange between employees
- 🤖 **AI Insights** - Flight risk prediction, team health scoring, and talent analytics
- 👥 **Role-Based Dashboards** - Tailored interfaces for Employees, Managers, and HR
- 📈 **9-Box Talent Matrix** - Visual talent segmentation and succession planning
- 🔒 **Enterprise Security** - JWT authentication, role-based access control, and audit logs

## 🎨 Design Philosophy

Inspired by:
- **Eightfold.ai** - Clean, modern AI-driven interface
- **CultureAmp** - Employee-centric UX with actionable insights
- Modern design principles with gradients, glassmorphism, and micro-interactions

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Frontend                        │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│   │   Employee   │  │   Manager    │  │  HR Analytics │    │
│   │  Dashboard   │  │  Dashboard   │  │   Dashboard   │    │
│   └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│               Performance Management APIs                    │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│   │ Reviews  │  │  Goals   │  │ Feedback │  │ Insights │  │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│              Database Layer (SQLite/PostgreSQL)             │
│    25+ Tables | 30+ Indexes | Optimized for 14K+ Users     │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Features by Role

### 👤 Employee Dashboard

**Personal Performance Hub**
- AI-powered performance insights and recommendations
- Active goals and OKRs with progress tracking
- Feedback history (given and received)
- Performance review status and history
- Development plan and learning activities
- 1-on-1 meeting tracking
- Recognition and achievements

**Key Metrics Displayed:**
- Overall performance rating
- Goal completion rate
- Feedback received count
- Development progress

### 👥 Manager Dashboard

**Team Performance Management**
- Team health score with AI insights
- Performance distribution across team
- Flight risk indicators for team members
- Pending reviews and calibration tasks
- Team goals alignment and progress
- Feedback culture metrics
- 1-on-1 meeting schedules

**AI-Powered Insights:**
- Team performance trends
- Retention risk analysis
- Development recommendations
- Calibration suggestions

### 📊 HR Analytics Dashboard

**Organization-Wide Insights**
- Executive performance summary
- 9-box talent matrix visualization
- Performance distribution analytics
- Goal completion rates across organization
- Feedback culture health
- Succession planning gaps
- Flight risk trending

**Workforce Analytics:**
- High performers identification
- High potential employees
- Performance vs. potential mapping
- Calibration consistency
- Review cycle completion rates

## 🗄️ Database Schema

### Core Performance Tables

**Review System:**
- `review_cycles` - Annual, semi-annual, quarterly cycles
- `pm_reviews` - Performance reviews (self, manager, 360)
- `competencies` - Competency framework (5-level assessments)
- `competency_assessments` - Individual competency ratings

**Goals & OKRs:**
- `goals` - Individual, team, and company goals
- `key_results` - Measurable outcomes for each goal
- Goal alignment and cascading support

**Continuous Feedback:**
- `feedback` - Real-time feedback with categories
- `feedback_requests` - Structured feedback requests
- `recognition` - Kudos and awards
- `one_on_ones` - 1-on-1 meeting tracking

**Development:**
- `development_plans` - Career development plans
- `development_actions` - Specific development activities
- `learning_activities` - Training and learning records

**Talent Management:**
- `talent_matrix` - 9-box positioning
- `succession_plans` - Critical role succession
- `calibration_sessions` - HR calibration meetings
- `engagement_surveys` - Pulse and annual surveys

### Performance Optimizations

- **30+ optimized indexes** for 14K+ employee scalability
- Efficient query patterns for real-time dashboards
- Batch processing support for large datasets
- Prepared statements for security and performance

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/JDK95-sys/Test.git
cd Test
```

2. **Checkout the performance management branch**
```bash
git checkout claude/ai-performance-management-tool-toNN1
```

3. **Install dependencies**
```bash
npm install
```

4. **Start development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Accounts

The system comes with pre-seeded demo data:

| Role | Email | What You'll See |
|------|-------|-----------------|
| **Employee** | `john.smith@company.com` | Personal performance dashboard with AI insights |
| **Manager** | `manager@company.com` | Team overview with health scores and analytics |
| **HR** | `recruiter@company.com` | Organization-wide analytics and talent matrix |

**Note:** No password required for demo - just enter the email.

## 📁 Project Structure

```
Test/
├── app/
│   ├── api/
│   │   ├── auth/              # Authentication endpoints
│   │   ├── performance/       # Performance management APIs
│   │   │   ├── reviews/       # Performance reviews
│   │   │   ├── goals/         # Goals and OKRs
│   │   │   ├── feedback/      # Continuous feedback
│   │   │   └── insights/      # AI insights
│   │   └── manager/           # Manager-specific APIs
│   ├── employee/              # Employee dashboard
│   ├── manager/               # Manager dashboard
│   ├── recruiter/             # HR analytics dashboard
│   ├── page.tsx               # Login page
│   └── layout.tsx             # Root layout
├── lib/
│   ├── db.ts                  # Database schema and seed data
│   ├── auth.ts                # Authentication and permissions
│   ├── analytics.ts           # AI analytics engine
│   └── utils.ts               # Utility functions
├── data/                      # SQLite database (gitignored)
├── public/                    # Static assets
└── README.md                  # This file
```

## 🔐 Security & Permissions

### Authentication
- JWT token-based authentication
- Secure session management
- Role-based access control (RBAC)

### Permission System

```typescript
// Example permission checks
canViewPerformanceReview(user, reviewId)
canEditPerformanceReview(user, reviewId, reviewType)
canGiveFeedback(user, toUserId)
canAccessHRFeatures(user)
canAccessManagerFeatures(user)
```

### Data Privacy
- Employees can only see their own reviews
- Managers see their direct reports' data
- HR has organization-wide visibility
- Granular visibility controls on feedback and goals

## 🤖 AI & Analytics

### Flight Risk Prediction

AI algorithm analyzes multiple factors:
- Performance review trends
- Feedback sentiment
- Goal completion rates
- Engagement survey responses
- Time since last promotion
- Salary competitiveness

**Output:** Low, Medium, or High risk with recommendations

### Team Health Scoring

Calculates team health based on:
- Average performance ratings
- Goal completion rates
- Feedback frequency and sentiment
- Engagement levels
- Retention metrics

**Output:** 0-100 health score with insights

### Talent Analytics

- 9-box matrix positioning
- High performer identification
- High potential employee detection
- Succession planning gaps
- Performance distribution analysis

## 📈 Performance Review Workflow

1. **Review Cycle Setup** (HR)
   - Define review period and deadlines
   - Select review type (annual, semi-annual, quarterly)
   - Set self-review and manager review deadlines

2. **Self Review** (Employee)
   - Reflect on achievements
   - Self-assess competencies
   - Set development priorities

3. **Manager Review** (Manager)
   - Review employee self-assessment
   - Provide manager assessment
   - Rate competencies (5-level scale)
   - Determine promotion readiness

4. **Calibration** (HR + Managers)
   - Normalize ratings across teams
   - Ensure fairness and consistency
   - Finalize ratings

5. **Delivery** (Manager)
   - Schedule 1-on-1 discussion
   - Share feedback and development plan
   - Employee acknowledgment

## 🎯 Goals & OKRs

### Goal Hierarchy
- **Company Goals** - Organization-wide objectives
- **Department Goals** - Department-level objectives
- **Team Goals** - Team-specific objectives
- **Individual Goals** - Personal objectives

### Goal Structure
```
Goal
├── Title & Description
├── Type (Performance, Development, Strategic)
├── Priority (Critical, High, Medium, Low)
├── Timeline (Q1, Q2, Q3, Q4, Annual)
├── Weight (% of total goals)
├── Visibility (Private, Team, Department, Company)
└── Key Results
    ├── KR 1 (Target, Current, Unit)
    ├── KR 2 (Target, Current, Unit)
    └── KR 3 (Target, Current, Unit)
```

### Progress Tracking
- Automatic progress calculation from key results
- Status indicators (Not Started, On Track, At Risk, Off Track, Completed)
- Real-time updates
- Quarterly check-ins

## 💬 Continuous Feedback

### Feedback Types
- **Positive** - Recognition and appreciation
- **Constructive** - Developmental feedback
- **Recognition** - Formal awards and kudos
- **Request** - Seeking specific feedback

### Feedback Categories
- Leadership
- Communication
- Technical Skills
- Collaboration
- Innovation
- Problem Solving
- Customer Focus

### Visibility Controls
- Private (1-on-1)
- Manager visibility
- Team visibility
- Public (organization-wide)

## 🔄 API Endpoints

### Authentication
```
POST   /api/auth/login          # Login
POST   /api/auth/logout         # Logout
GET    /api/auth/me             # Get current user
```

### Performance Reviews
```
GET    /api/performance/reviews              # List reviews
POST   /api/performance/reviews              # Create review (HR)
GET    /api/performance/reviews/:id          # Get review details
PATCH  /api/performance/reviews/:id          # Update review
```

### Goals & OKRs
```
GET    /api/performance/goals                # List goals
POST   /api/performance/goals                # Create goal
PATCH  /api/performance/goals/:id            # Update goal progress
DELETE /api/performance/goals/:id            # Delete goal
```

### Continuous Feedback
```
GET    /api/performance/feedback             # List feedback
POST   /api/performance/feedback             # Give feedback
```

### AI Insights
```
GET    /api/performance/insights?type=employee    # Employee insights
GET    /api/performance/insights?type=manager     # Manager insights
GET    /api/performance/insights?type=team_health # Team health
GET    /api/performance/insights?type=talent      # Talent insights
GET    /api/performance/insights?type=flight_risk # Flight risk analysis
```

### Manager
```
GET    /api/manager/team                     # Get team data with insights
```

## 🎨 UI Components & Design

### Design System
- **Color Palette:** Indigo, Purple, Pink gradients
- **Typography:** Inter font family
- **Effects:** Glassmorphism, backdrop blur, subtle animations
- **Responsive:** Mobile-first design approach

### Key Components
- Performance review cards
- Goal progress bars with OKR breakdown
- Feedback timeline
- 9-box talent matrix visualization
- Team health scorecard
- AI insight banners

## 📊 Seed Data

The system includes comprehensive demo data:
- **24+ users** across all roles
- **50+ skills** for competency assessments
- **Performance reviews** with ratings and feedback
- **Goals and OKRs** at individual and team levels
- **Continuous feedback** examples
- **1-on-1 meetings** and development plans
- **Competency assessments** across 6 core competencies

## 🚀 Deployment

### Production Considerations

**Database:**
- Migrate from SQLite to PostgreSQL or MySQL
- Set up replication and backups
- Configure connection pooling

**Security:**
- Enable HTTPS
- Set strong JWT secrets
- Configure CORS properly
- Implement rate limiting
- Enable CSP headers
- Set secure cookie flags

**Performance:**
- Enable Next.js caching
- Configure CDN for static assets
- Optimize database indexes
- Implement API request throttling

**Monitoring:**
- Set up error tracking (Sentry)
- Monitor API performance (DataDog, New Relic)
- Track user analytics
- Alert on critical errors

### Environment Variables

```env
# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Authentication
JWT_SECRET=your-production-secret-key
SESSION_SECRET=your-session-secret

# Database (Production)
DATABASE_URL=postgresql://user:pass@host:5432/performpro

# Optional: SAP SuccessFactors Integration
SF_API_URL=https://api.successfactors.com/odata/v2
SF_COMPANY_ID=your-company-id
SF_CLIENT_ID=your-client-id
SF_CLIENT_SECRET=your-client-secret
```

## 🔄 Migrating from SQLite to PostgreSQL

```typescript
// Update lib/db.ts to use PostgreSQL
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Run schema migration
// Use tools like Prisma, TypeORM, or custom migrations
```

## 📚 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | TailwindCSS with custom design system |
| **Backend** | Next.js API Routes |
| **Database** | SQLite (demo), PostgreSQL (production) |
| **Authentication** | JWT tokens |
| **AI/Analytics** | Custom algorithms (extensible to ML models) |
| **Deployment** | Vercel, AWS, or self-hosted |

## 🗺️ Roadmap

### Phase 1: Foundation (Complete ✅)
- [x] Core performance review system
- [x] Goals and OKRs
- [x] Continuous feedback
- [x] AI insights
- [x] Role-based dashboards

### Phase 2: Enhancement (Planned)
- [ ] Advanced ML models with TensorFlow
- [ ] Skills endorsements
- [ ] Career path visualization
- [ ] Integration with learning platforms
- [ ] Mobile app (React Native)

### Phase 3: Scale (Future)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Slack/Teams integration
- [ ] Custom report builder
- [ ] API for third-party integrations

## 🤝 Contributing

This is a proprietary enterprise system. For internal contributions:
1. Create a feature branch from `main`
2. Follow TypeScript and React best practices
3. Write tests for new features
4. Submit PR with detailed description

## 📄 License

**Proprietary** - Internal Use Only
Copyright © 2025 PerformPro. All rights reserved.

## 🆘 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Contact: [Your support email]
- Documentation: [Your docs URL]

---

**Built with ❤️ for modern performance management**
