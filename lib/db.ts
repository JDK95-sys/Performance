import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH || './data/marketplace.db';
const dbDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Initialize database schema
export function initDatabase() {
  db.exec(`
    -- Users table with SSO integration
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('candidate', 'manager', 'recruiter')),
      sso_id TEXT UNIQUE,
      department TEXT,
      job_title TEXT,
      manager_id INTEGER,
      profile_picture TEXT,
      bio TEXT,
      years_experience INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (manager_id) REFERENCES users(id)
    );

    -- Skills table
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- User skills with proficiency levels
    CREATE TABLE IF NOT EXISTS user_skills (
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

    -- Job postings
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      department TEXT NOT NULL,
      location TEXT NOT NULL,
      employment_type TEXT DEFAULT 'full-time',
      description TEXT NOT NULL,
      requirements TEXT NOT NULL,
      responsibilities TEXT NOT NULL,
      salary_range_min INTEGER,
      salary_range_max INTEGER,
      posted_by INTEGER NOT NULL,
      status TEXT DEFAULT 'open' CHECK(status IN ('draft', 'open', 'closed', 'filled')),
      positions_available INTEGER DEFAULT 1,
      is_internal_only BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      closed_at DATETIME,
      FOREIGN KEY (posted_by) REFERENCES users(id)
    );

    -- Job required skills
    CREATE TABLE IF NOT EXISTS job_skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER NOT NULL,
      skill_id INTEGER NOT NULL,
      required_level INTEGER DEFAULT 1 CHECK(required_level BETWEEN 1 AND 5),
      is_required BOOLEAN DEFAULT 1,
      FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
      FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
      UNIQUE(job_id, skill_id)
    );

    -- Applications
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER NOT NULL,
      candidate_id INTEGER NOT NULL,
      status TEXT DEFAULT 'submitted' CHECK(status IN ('submitted', 'under_review', 'interviewing', 'manager_review', 'approved', 'rejected', 'withdrawn')),
      cover_letter TEXT,
      match_score REAL DEFAULT 0,
      reviewed_by INTEGER,
      reviewed_at DATETIME,
      manager_approved BOOLEAN DEFAULT 0,
      manager_approved_by INTEGER,
      manager_approved_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
      FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (reviewed_by) REFERENCES users(id),
      FOREIGN KEY (manager_approved_by) REFERENCES users(id),
      UNIQUE(job_id, candidate_id)
    );

    -- Application status history
    CREATE TABLE IF NOT EXISTS application_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      application_id INTEGER NOT NULL,
      old_status TEXT,
      new_status TEXT NOT NULL,
      changed_by INTEGER NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
      FOREIGN KEY (changed_by) REFERENCES users(id)
    );

    -- Career aspirations and goals
    CREATE TABLE IF NOT EXISTS career_goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      desired_role TEXT,
      desired_department TEXT,
      target_timeframe TEXT,
      development_areas TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Learning and development activities
    CREATE TABLE IF NOT EXISTS learning_activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      type TEXT CHECK(type IN ('course', 'certification', 'workshop', 'conference', 'project')),
      provider TEXT,
      completion_status TEXT DEFAULT 'in_progress' CHECK(completion_status IN ('planned', 'in_progress', 'completed')),
      completed_at DATETIME,
      skills_gained TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Performance reviews and feedback
    CREATE TABLE IF NOT EXISTS performance_reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      reviewer_id INTEGER NOT NULL,
      review_period TEXT NOT NULL,
      rating INTEGER CHECK(rating BETWEEN 1 AND 5),
      strengths TEXT,
      areas_for_improvement TEXT,
      potential_score INTEGER CHECK(potential_score BETWEEN 1 AND 5),
      flight_risk_level TEXT DEFAULT 'low' CHECK(flight_risk_level IN ('low', 'medium', 'high')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (reviewer_id) REFERENCES users(id)
    );

    -- Notifications
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      link TEXT,
      read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    CREATE INDEX IF NOT EXISTS idx_users_manager ON users(manager_id);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
    CREATE INDEX IF NOT EXISTS idx_jobs_department ON jobs(department);
    CREATE INDEX IF NOT EXISTS idx_applications_candidate ON applications(candidate_id);
    CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
    CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
    CREATE INDEX IF NOT EXISTS idx_user_skills_user ON user_skills(user_id);
    CREATE INDEX IF NOT EXISTS idx_job_skills_job ON job_skills(job_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read);
  `);
}

// Seed initial data
export function seedDatabase() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };

  if (userCount.count === 0) {
    // Insert sample users
    const insertUser = db.prepare(`
      INSERT INTO users (email, name, role, department, job_title, years_experience, bio)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    // Sample skills
    const insertSkill = db.prepare('INSERT INTO skills (name, category) VALUES (?, ?)');
    const skills = [
      ['JavaScript', 'Programming'],
      ['TypeScript', 'Programming'],
      ['React', 'Frontend'],
      ['Node.js', 'Backend'],
      ['Python', 'Programming'],
      ['SQL', 'Database'],
      ['Project Management', 'Management'],
      ['Leadership', 'Management'],
      ['Communication', 'Soft Skills'],
      ['Problem Solving', 'Soft Skills'],
      ['Data Analysis', 'Analytics'],
      ['Machine Learning', 'AI/ML'],
    ];

    skills.forEach(([name, category]) => {
      insertSkill.run(name, category);
    });

    // Sample users
    insertUser.run('recruiter@company.com', 'Sarah Chen', 'recruiter', 'HR', 'Senior Recruiter', 8, 'Experienced talent acquisition specialist focused on internal mobility');
    insertUser.run('manager@company.com', 'Michael Torres', 'manager', 'Engineering', 'Engineering Manager', 12, 'Engineering manager with passion for team development');
    insertUser.run('candidate@company.com', 'Alex Johnson', 'candidate', 'Engineering', 'Senior Developer', 5, 'Full-stack developer looking to grow into tech lead role');

    console.log('Database seeded with initial data');
  }
}

export default db;
