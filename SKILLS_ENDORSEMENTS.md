# Skills Endorsements Feature

## Overview
The Skills Endorsements feature allows employees to endorse their colleagues' skills, providing peer validation and recognition. This creates a LinkedIn-like skills validation system within the performance management platform.

## Features

### 1. Skills Management
- **Skills Library**: Pre-defined skills across multiple categories:
  - Programming (JavaScript, TypeScript, Python, Java, Go, etc.)
  - Frontend (React, Vue.js, Angular, Next.js, Tailwind CSS)
  - Backend (Node.js, Express, Django, Spring Boot)
  - Database (SQL, PostgreSQL, MongoDB, Redis)
  - Cloud & DevOps (AWS, Azure, Docker, Kubernetes)
  - Analytics (Data Analysis, Machine Learning, TensorFlow)
  - Leadership & Management
  - Soft Skills (Communication, Problem Solving, Collaboration)

### 2. User Skills
- Users can have multiple skills with:
  - **Proficiency Level**: 1-5 scale (Beginner to Master)
  - **Years of Experience**: Track expertise duration
  - **Endorsement Count**: Number of peer endorsements

### 3. Skill Endorsements
- **Endorse Colleagues**: Users can endorse their colleagues' skills
- **Self-Endorsement Prevention**: Users cannot endorse their own skills
- **Duplicate Prevention**: Users can only endorse each skill once per person
- **Remove Endorsements**: Users can remove endorsements they've given

### 4. Skills Display
- **Grouped by Category**: Skills are organized by category for easy navigation
- **Proficiency Badges**: Visual indicators of skill level
- **Endorsement Counts**: Display number of endorsements received
- **Top Endorsed Skills**: Highlight most validated skills
- **Years of Experience**: Show how long user has worked with each skill

## Database Schema

### Tables

#### `skills`
Master skills table containing all available skills.
```sql
CREATE TABLE skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### `user_skills`
Junction table linking users to their skills with proficiency information.
```sql
CREATE TABLE user_skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  skill_id INTEGER NOT NULL,
  proficiency_level INTEGER DEFAULT 1 CHECK(proficiency_level BETWEEN 1 AND 5),
  years_experience REAL DEFAULT 0,
  endorsed_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE(user_id, skill_id)
);
```

#### `skill_endorsements`
Tracks individual endorsements to prevent duplicates and provide audit trail.
```sql
CREATE TABLE skill_endorsements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  endorser_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  skill_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (endorser_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE(endorser_id, user_id, skill_id)
);
```

## API Endpoints

### GET `/api/performance/skills`
Get all available skills or user-specific skills.

**Query Parameters:**
- `userId` (optional): Get skills for a specific user

**Response:**
```json
{
  "skills": [
    {
      "id": 1,
      "user_id": 1,
      "skill_id": 1,
      "skill_name": "JavaScript",
      "skill_category": "Programming",
      "proficiency_level": 5,
      "years_experience": 8,
      "endorsed_count": 12
    }
  ]
}
```

### POST `/api/performance/skills/endorse`
Endorse a user's skill.

**Request Body:**
```json
{
  "userId": 1,
  "skillId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Skill endorsed successfully",
  "endorsedCount": 13
}
```

**Validation:**
- Prevents self-endorsement
- Prevents duplicate endorsements
- Validates user has the skill

### DELETE `/api/performance/skills/endorse`
Remove an endorsement.

**Request Body:**
```json
{
  "userId": 1,
  "skillId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Endorsement removed successfully",
  "endorsedCount": 12
}
```

## UI Components

### SkillsCard Component
Located at: `components/SkillsCard.tsx`

**Props:**
- `userId` (number): User ID to display skills for
- `isOwnProfile` (boolean): Whether viewing own profile (disables endorsing)
- `onEndorse` (function): Callback when endorsement is successful

**Features:**
- Displays skills grouped by category
- Shows proficiency levels with color-coded badges
- Displays years of experience
- Shows endorsement counts
- Allows endorsing skills (if not own profile)
- Highlights top 5 most endorsed skills
- Loading and error states

## Integration

### Employee Dashboard
The SkillsCard component is integrated into the employee dashboard overview tab:

```tsx
import SkillsCard from '@/components/SkillsCard';

// In the overview tab
<SkillsCard userId={user?.id} isOwnProfile={true} />
```

## Demo Mode Support

Skills endorsements work seamlessly in demo mode:
- Pre-populated skills data for demo users
- In-memory endorsement tracking
- Sample endorsements for realistic demonstration

### Demo Data
- 40 skills across 8 categories
- 23 pre-configured user skills for demo users
- Realistic endorsement counts (7-25 endorsements)
- Varied proficiency levels and experience

## Future Enhancements

Potential improvements for future iterations:

1. **Skills Recommendations**
   - AI-powered skill suggestions based on job role
   - Recommend skills to add based on team members

2. **Skills Gap Analysis**
   - Identify missing skills for career advancement
   - Compare skills with target role requirements

3. **Skills Learning Path**
   - Link skills to learning resources
   - Track skill development over time

4. **Endorsement Notifications**
   - Notify users when their skills are endorsed
   - Celebrate endorsement milestones

5. **Skill Verification**
   - Manager verification of skill proficiency
   - Certification integration

6. **Skills Analytics**
   - Team skills heatmap
   - Organizational skills inventory
   - Skills trends and gaps

## Technical Notes

### Performance
- Database indexes on `user_skills.user_id` and `skill_endorsements` for fast lookups
- Efficient SQL queries to minimize database hits
- Client-side caching of skills data

### Security
- Authentication required for all endpoints
- Role-based access control
- Prevention of self-endorsement
- Unique constraints to prevent duplicate endorsements

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly labels
- Color-coded proficiency levels with text labels

## Usage Example

```tsx
// Display user skills on profile page
<SkillsCard 
  userId={profileUserId} 
  isOwnProfile={currentUserId === profileUserId}
  onEndorse={() => {
    // Refresh endorsement counts or show notification
    console.log('Skill endorsed!');
  }}
/>
```

## Conclusion

The Skills Endorsements feature provides a comprehensive system for tracking and validating employee skills through peer recognition. It enhances the performance management platform by adding a social validation layer similar to LinkedIn, while maintaining enterprise-grade security and data integrity.

**Status**: ✅ Complete and Production Ready

**Implementation Date**: January 16, 2026
