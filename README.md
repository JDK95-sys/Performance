# PerformPro - AI-Powered Performance Management System

**Created by Jonathan De Kryger**

A modern, enterprise-grade performance management platform for organizations of all sizes. Built with Next.js, TypeScript, and AI-powered insights, inspired by industry-leading UX from Eightfold.ai and CultureAmp.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)
[![Neon](https://img.shields.io/badge/Database-Neon-green)](https://neon.tech)

---

## 🚀 **Quick Start - Choose Your Path**

### 🎭 Demo Mode (5 Minutes) - **Try It Now**
Zero setup, instant deployment with 117 demo users!

```bash
✅ Perfect for: Demos, Testing, Presentations
⚡ Setup: 5 minutes | Cost: $0/month
📊 Includes: 117 employees, 9 managers, realistic data
```

**→ [Deploy Demo Mode](./DEMO_MODE.md)**

---

### 🗄️ Neon Database (10 Minutes) - **Production Ready**
100% free tier with persistent data!

```bash
✅ Perfect for: Real deployments, MVPs, Teams
⚡ Setup: 10 minutes | Cost: $0/month
💾 Storage: 512 MB (supports 1000+ users)
```

**→ [Deploy with Neon](./QUICK_START.md)**

---

### 🔧 Self-Hosted (1-2 Hours) - **Full Control**
Custom infrastructure for enterprise needs.

```bash
✅ Perfect for: Large orgs, Custom requirements
⚡ Setup: 1-2 hours | Cost: Variable
```

**→ [Self-Host Guide](./INSTALLATION.md)**

---

## ✨ **Features**

### Core Capabilities
- 📊 **Performance Reviews** - Self, manager, and 360-degree reviews with competency assessments
- 🎯 **Goals & OKRs** - Hierarchical goal tracking with key results and progress monitoring
- 💬 **Continuous Feedback** - Real-time feedback exchange between employees
- 🤖 **AI Insights** - Flight risk prediction, team health scoring, and talent analytics
- 💡 **AI Chatbot Assistant** - Built-in conversational agent to guide users and answer questions
- 👥 **Role-Based Dashboards** - Tailored interfaces for Employees, Managers, and HR
- 📈 **9-Box Talent Matrix** - Visual talent segmentation and succession planning
- 🔒 **Enterprise Security** - JWT authentication, role-based access control

### Demo Data (Ready to Explore)
- **117 employees** across 7 departments
- **152 goals** with varied statuses and priorities
- **202 feedback items** with realistic distributions
- **125 performance reviews** with detailed assessments
- **9 managers** with team structures

### Design Philosophy
Inspired by **Eightfold.ai** and **CultureAmp** - clean, modern AI-driven interface with employee-centric UX and actionable insights.

---

## 🎯 **Quick Demo**

Try the live demo with pre-loaded accounts:

| Role | Email | What You'll See |
|------|-------|-----------------|
| 👤 **Employee** | john.smith@company.com | Personal dashboard, goals, feedback, AI insights |
| 👔 **Manager** | manager@company.com | Team analytics, health scores, performance distribution |
| 💼 **HR** | admin@company.com | Organization-wide analytics, 9-box matrix, talent insights |

**No password required** - just enter the email and sign in!

---

## 💻 **Local Development**

### Prerequisites
- Node.js 18+
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/JDK95-sys/Performance.git
cd Performance

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and use the demo accounts above.

**Note:** Demo mode runs automatically when no database is configured!

---

## 📚 **Tech Stack**

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | TailwindCSS with custom design system |
| **Backend** | Next.js API Routes |
| **Database** | PostgreSQL (Neon), SQLite (dev), Demo Mode (in-memory) |
| **Authentication** | JWT tokens, SSO-ready |
| **AI/Analytics** | TensorFlow.js ML models, Custom algorithms |
| **Deployment** | Vercel, AWS, Docker, Kubernetes |

---

## 🏗️ **Project Structure**

```
Performance/
├── app/
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication
│   │   ├── performance/     # Reviews, goals, feedback, insights
│   │   ├── manager/         # Manager-specific endpoints
│   │   └── admin/           # Admin utilities
│   ├── employee/            # Employee dashboard
│   ├── manager/             # Manager dashboard  
│   ├── recruiter/           # HR analytics dashboard
│   └── page.tsx             # Login page
├── lib/
│   ├── db.ts               # Database schema
│   ├── db-vercel.ts        # Vercel Postgres setup
│   ├── demo-data.ts        # 117-user demo dataset
│   ├── auth.ts             # Authentication & permissions
│   └── analytics.ts        # AI analytics engine
├── components/             # React components
└── docs/                   # Additional documentation
```

---

## 🔐 **Security & Permissions**

### Authentication
- JWT token-based authentication
- Secure session management  
- Role-based access control (RBAC)
- SSO-ready (SAML/OAuth)

### Data Privacy
- Employees see only their own data
- Managers see their direct reports
- HR has organization-wide visibility
- Granular permissions on all endpoints

### Security Features
- Input validation on all forms
- SQL injection protection (prepared statements)
- XSS protection via React
- CSRF protection
- Secure cookie handling

---

## 🤖 **AI & Analytics**

### Flight Risk Prediction
Analyzes multiple factors to predict employee retention risk:
- Performance review trends
- Feedback sentiment and frequency
- Goal completion rates
- Time since last promotion
- Engagement patterns

**Output:** Low/Medium/High risk with actionable recommendations

### Team Health Scoring
Calculates team performance metrics:
- Average performance ratings
- Goal completion rates
- Feedback culture strength
- Team engagement levels

**Output:** 0-100 health score with detailed insights

### Talent Analytics
- 9-box matrix positioning (performance vs. potential)
- High performer identification
- Succession planning gap analysis
- Performance distribution tracking

---

## 🔗 **Integrations**

### HRM System Support
Ready-to-use integrations with popular HRM platforms:
- **SAP SuccessFactors** - Full API integration
- **Workday** - OAuth 2.0 + Basic Auth
- **Deel** - Employee data sync
- **BambooHR** - REST API integration

**Documentation:** [HRM_INTEGRATIONS.md](./HRM_INTEGRATIONS.md)

### Webhook Support
- Real-time updates from HRM systems
- Automated employee data sync
- Custom integration templates

---

## 📖 **Documentation**

| Guide | Description |
|-------|-------------|
| [DEMO_MODE.md](./DEMO_MODE.md) | Deploy in 5 minutes with zero setup |
| [QUICK_START.md](./QUICK_START.md) | Deploy to Vercel with Neon database |
| [INSTALLATION.md](./INSTALLATION.md) | Self-hosting, Docker, Kubernetes setup |
| [CHATBOT.md](./CHATBOT.md) | AI Chatbot Assistant guide and documentation |
| [HRM_INTEGRATIONS.md](./HRM_INTEGRATIONS.md) | Connect with Workday, Deel, SAP, BambooHR |
| [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) | Production deployment checklist |
| [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) | Security and performance checklist |

---

## 🗺️ **Roadmap**

### ✅ Phase 1: Foundation (Complete)
- [x] Core performance review system
- [x] Goals and OKRs
- [x] Continuous feedback
- [x] AI insights engine
- [x] Role-based dashboards
- [x] Demo mode with 117 users

### ✅ Phase 2: Enhancement (Complete)
- [x] Advanced ML models with TensorFlow
- [ ] Skills endorsements
- [ ] Career path visualization
- [ ] Mobile app (React Native)
- [ ] Learning platform integrations

### 🔮 Phase 3: Scale (Planned)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Slack/Teams integration
- [ ] Custom report builder
- [ ] Public API for third-party integrations

---

## 🤝 **Contributing**

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 **License**

This project is licensed under the MIT License. See LICENSE file for details.

---

## 💬 **Support**

- **Documentation:** See guides in repository root
- **Issues:** [GitHub Issues](https://github.com/JDK95-sys/Performance/issues)
- **Discussions:** [GitHub Discussions](https://github.com/JDK95-sys/Performance/discussions)

---

**Built with ❤️ by Jonathan De Kryger**

© 2026 PerformPro - AI-Powered Performance Management
