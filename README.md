# Internal Job Marketplace - Talent Mobility Platform

An AI-powered internal job marketplace inspired by Eightfold.ai, designed for enterprise talent mobility and career development. Features secure role-based access for Candidates, Managers, and Recruiters with SAP SuccessFactors integration.

## Features

### 🎯 AI-Powered Talent Matching
- **Intelligent Job Matching**: AI algorithms match candidates to jobs based on skills, experience, potential, and career aspirations
- **Skills Gap Analysis**: Identify missing skills and get personalized development recommendations
- **Career Path Planning**: Suggest career progression paths based on current role and skills
- **Flight Risk Analysis**: Predictive analytics to identify retention risks and recommend interventions

### 👥 Role-Based Access Control

#### Candidate View
- Browse internal job opportunities
- AI-powered job recommendations with match scores
- Apply to positions with one click
- Track application status in real-time
- Set career goals and aspirations
- View personalized skill development recommendations

#### Manager View
- Team overview with career insights
- Approve/decline internal transfer requests
- Flight risk monitoring for team members
- Career aspiration tracking
- Retention recommendations
- Performance and potential analytics

#### Recruiter View
- Post and manage internal job openings
- View AI-matched candidates for each role
- Manage application pipeline
- Update application status (Review, Interview, Approve, Reject)
- Sync employee data from SAP SuccessFactors
- Access to full talent pool analytics

### 🔐 Enterprise Security
- **SSO Authentication**: Secure single sign-on integration
- **Role-Based Permissions**: Granular access control for each user role
- **SAP SuccessFactors Integration**: Automated employee sync with role mapping
- **JWT Token Authentication**: Secure session management

### 📊 SAP SuccessFactors Integration

The platform integrates with SAP SuccessFactors to:
- Automatically sync employee information (name, title, department, manager)
- Pull role-based permissions from SuccessFactors role assignments
- Map SuccessFactors roles to marketplace roles (Candidate, Manager, Recruiter)
- Keep organizational hierarchy up to date
- Sync on-demand or scheduled basis

**Supported Authentication Methods:**
- OAuth2 (recommended)
- Basic authentication (fallback)

**Synced Data:**
- Employee profiles (name, email, job title, department)
- Organizational structure (manager relationships)
- Role-based permissions
- Years of experience (calculated from hire date)

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT tokens with SSO integration
- **AI/ML**: Custom matching algorithms
- **Integration**: SAP SuccessFactors OData API

## Prerequisites

- Node.js 18+
- npm or yarn
- SAP SuccessFactors account (optional, for integration)

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Test
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication
JWT_SECRET=your-secret-key-change-this-in-production
NEXTAUTH_SECRET=your-nextauth-secret-change-this
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_PATH=./data/marketplace.db

# SAP SuccessFactors Integration (Optional)
SF_API_URL=https://api.successfactors.com/odata/v2
SF_COMPANY_ID=your-company-id
SF_USERNAME=your-sf-username
SF_PASSWORD=your-sf-password

# SAP SuccessFactors OAuth (Recommended)
SF_OAUTH_URL=https://api.successfactors.com/oauth
SF_CLIENT_ID=your-client-id
SF_CLIENT_SECRET=your-client-secret
```

4. **Run development server**
```bash
npm run dev
```

5. **Open browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

The database is automatically initialized on first run with:
- Schema creation
- Sample users (candidate, manager, recruiter)
- Sample skills

**Demo Accounts:**
- Candidate: `candidate@company.com`
- Manager: `manager@company.com`
- Recruiter: `recruiter@company.com`

## SAP SuccessFactors Configuration

### Prerequisites
1. SAP SuccessFactors instance with API access
2. API user credentials or OAuth client credentials
3. Permissions to read User and Role entities

### OAuth2 Setup (Recommended)

1. Register your application in SuccessFactors:
   - Go to Admin Center > OAuth2 Token Manager
   - Create new OAuth2 client
   - Note the Client ID and Client Secret

2. Configure in `.env`:
```env
SF_OAUTH_URL=https://api.successfactors.com/oauth
SF_CLIENT_ID=your-client-id
SF_CLIENT_SECRET=your-client-secret
SF_COMPANY_ID=your-company-id
```

### Basic Authentication Setup

1. Create an API user in SuccessFactors
2. Grant permissions to read User and RoleEntity data
3. Configure in `.env`:
```env
SF_API_URL=https://api.successfactors.com/odata/v2
SF_COMPANY_ID=your-company-id
SF_USERNAME=your-sf-username
SF_PASSWORD=your-sf-password
```

### Role Mapping

The integration automatically maps SuccessFactors roles to marketplace roles:

| SuccessFactors Role | Marketplace Role |
|---------------------|------------------|
| Recruiter, Talent Acquisition | Recruiter |
| Manager, Supervisor | Manager |
| HR Admin, Talent Management | Recruiter (with full permissions) |
| All others | Candidate |

### Syncing Data

**Manual Sync (via UI):**
1. Log in as Recruiter
2. Click "Sync SuccessFactors" button in header
3. Wait for sync to complete

**Programmatic Sync:**
```bash
curl -X POST http://localhost:3000/api/sync/successfactors \
  -H "Authorization: Bearer <recruiter-jwt-token>"
```

**Automated Sync:**
Set up a cron job or scheduled task to run periodic syncs:
```bash
# Example: Sync daily at 2 AM
0 2 * * * curl -X POST http://localhost:3000/api/sync/successfactors \
  -H "Authorization: Bearer <token>"
```

## API Routes

### Authentication
- `POST /api/auth/login` - SSO login with SuccessFactors integration
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - List jobs (with optional filtering)
- `POST /api/jobs` - Create job (Recruiter only)
- `GET /api/jobs/:id` - Get job details with match score
- `PATCH /api/jobs/:id` - Update job (Recruiter only)
- `DELETE /api/jobs/:id` - Delete job (Recruiter only)
- `POST /api/jobs/:id/apply` - Apply to job (Candidate only)
- `GET /api/jobs/:id/matches` - Get candidate matches (Recruiter only)

### Applications
- `GET /api/applications` - Get applications (role-filtered)
- `GET /api/applications/:id` - Get application details
- `PATCH /api/applications/:id` - Update application status

### Candidate
- `GET /api/candidate/matches` - Get AI job matches
- `GET /api/candidate/career-path` - Get career path suggestions
- `POST /api/candidate/career-path` - Set career goals

### Manager
- `GET /api/manager/team` - Get team overview with insights

### Integration
- `POST /api/sync/successfactors` - Sync from SuccessFactors (Recruiter only)
- `GET /api/sync/successfactors` - Get sync status

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications` - Mark as read

## AI Matching Algorithm

The platform uses a sophisticated weighted scoring algorithm:

```
Overall Score = (Skills × 45%) + (Experience × 20%) + (Department × 15%) + (Potential × 20%)
```

### Components:

1. **Skills Score (45%)**
   - Matches required skills with candidate skills
   - Considers proficiency levels
   - Weights required vs. preferred skills

2. **Experience Score (20%)**
   - Years of relevant experience
   - Industry experience
   - Role progression

3. **Department Score (15%)**
   - Internal vs. cross-functional moves
   - Domain expertise alignment

4. **Potential Score (20%)**
   - Performance review ratings
   - Growth trajectory
   - Learning agility indicators

### Recommendations Engine

Provides personalized recommendations:
- Skill development suggestions
- Career path guidance
- Application strategy tips
- Retention interventions for managers

## Production Deployment

### Environment Variables
Ensure all production values are set:
- Strong JWT secrets
- Production database path
- Correct SuccessFactors credentials
- HTTPS URLs

### Database
For production, consider:
- PostgreSQL or MySQL instead of SQLite
- Regular backups
- Connection pooling

### Security
- Enable HTTPS
- Configure CORS properly
- Set secure cookie flags
- Implement rate limiting
- Enable CSP headers

### Monitoring
- Set up error tracking (Sentry, etc.)
- Monitor API performance
- Track sync job success/failures
- Alert on authentication failures

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │Candidate │  │ Manager  │  │Recruiter │         │
│  │   View   │  │   View   │  │   View   │         │
│  └──────────┘  └──────────┘  └──────────┘         │
└─────────────────────────────────────────────────────┘
                       ↕
┌─────────────────────────────────────────────────────┐
│              API Routes (Next.js)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │   Auth   │  │   Jobs   │  │   Apps   │         │
│  └──────────┘  └──────────┘  └──────────┘         │
└─────────────────────────────────────────────────────┘
         ↕                                ↕
┌─────────────────┐              ┌─────────────────┐
│   Database      │              │  SuccessFactors │
│   (SQLite)      │              │      API        │
└─────────────────┘              └─────────────────┘
```

## Features Comparison with Eightfold.ai

| Feature | Eightfold.ai | This Platform |
|---------|--------------|---------------|
| AI Job Matching | ✅ | ✅ |
| Skills Gap Analysis | ✅ | ✅ |
| Career Path Planning | ✅ | ✅ |
| Internal Mobility | ✅ | ✅ |
| Manager Insights | ✅ | ✅ |
| Flight Risk Analysis | ✅ | ✅ |
| SAP Integration | ✅ | ✅ (SuccessFactors) |
| SSO Authentication | ✅ | ✅ |
| Role-Based Access | ✅ | ✅ |
| Real-time Notifications | ✅ | ✅ |
| Advanced ML Models | ✅ | ⚠️ (Simplified) |
| External Recruiting | ✅ | ❌ (Internal only) |

## Future Enhancements

- [ ] Advanced ML models with TensorFlow/PyTorch
- [ ] Skills endorsements and peer reviews
- [ ] Integration with learning platforms (LinkedIn Learning, Coursera)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Interview scheduling integration
- [ ] Slack/Teams notifications
- [ ] Multi-language support
- [ ] External job board integration
- [ ] Video interview integration

## Support

For issues, questions, or contributions, please open an issue on GitHub.

## License

Proprietary - Internal Use Only
