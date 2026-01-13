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
    // Sample skills - comprehensive list
    const insertSkill = db.prepare('INSERT INTO skills (name, category) VALUES (?, ?)');
    const skills = [
      // Programming Languages
      ['JavaScript', 'Programming'],
      ['TypeScript', 'Programming'],
      ['Python', 'Programming'],
      ['Java', 'Programming'],
      ['Go', 'Programming'],
      ['Ruby', 'Programming'],
      ['C#', 'Programming'],
      ['PHP', 'Programming'],

      // Frontend
      ['React', 'Frontend'],
      ['Vue.js', 'Frontend'],
      ['Angular', 'Frontend'],
      ['HTML/CSS', 'Frontend'],
      ['Next.js', 'Frontend'],
      ['Tailwind CSS', 'Frontend'],

      // Backend
      ['Node.js', 'Backend'],
      ['Express', 'Backend'],
      ['Django', 'Backend'],
      ['FastAPI', 'Backend'],
      ['Spring Boot', 'Backend'],
      ['Ruby on Rails', 'Backend'],

      // Database
      ['SQL', 'Database'],
      ['PostgreSQL', 'Database'],
      ['MongoDB', 'Database'],
      ['Redis', 'Database'],
      ['MySQL', 'Database'],

      // DevOps & Cloud
      ['AWS', 'Cloud'],
      ['Azure', 'Cloud'],
      ['Google Cloud', 'Cloud'],
      ['Docker', 'DevOps'],
      ['Kubernetes', 'DevOps'],
      ['CI/CD', 'DevOps'],
      ['Terraform', 'DevOps'],

      // Data & AI
      ['Data Analysis', 'Analytics'],
      ['Machine Learning', 'AI/ML'],
      ['TensorFlow', 'AI/ML'],
      ['PyTorch', 'AI/ML'],
      ['Data Visualization', 'Analytics'],
      ['SQL Analytics', 'Analytics'],

      // Management & Leadership
      ['Project Management', 'Management'],
      ['Leadership', 'Management'],
      ['Agile/Scrum', 'Management'],
      ['Strategic Planning', 'Management'],
      ['Team Building', 'Management'],
      ['Stakeholder Management', 'Management'],

      // Soft Skills
      ['Communication', 'Soft Skills'],
      ['Problem Solving', 'Soft Skills'],
      ['Critical Thinking', 'Soft Skills'],
      ['Collaboration', 'Soft Skills'],
      ['Mentoring', 'Soft Skills'],
      ['Presentation', 'Soft Skills'],
    ];

    skills.forEach(([name, category]) => {
      insertSkill.run(name, category);
    });

    // Insert sample users
    const insertUser = db.prepare(`
      INSERT INTO users (email, name, role, department, job_title, years_experience, bio)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    // Recruiters
    insertUser.run('recruiter@company.com', 'Sarah Chen', 'recruiter', 'HR', 'Senior Talent Acquisition Partner', 8, 'Passionate about internal mobility and career development. Helping employees find their dream roles.');
    insertUser.run('recruiter2@company.com', 'James Mitchell', 'recruiter', 'HR', 'Technical Recruiter', 6, 'Specialized in technical hiring with focus on diversity and inclusion.');

    // Managers
    insertUser.run('manager@company.com', 'Michael Torres', 'manager', 'Engineering', 'Engineering Manager', 12, 'Leading a high-performing engineering team. Believer in growing talent from within.');
    insertUser.run('manager2@company.com', 'Lisa Wang', 'manager', 'Product', 'Product Manager', 10, 'Product leader focused on user experience and team empowerment.');
    insertUser.run('manager3@company.com', 'David Kumar', 'manager', 'Data Science', 'Data Science Manager', 14, 'Building world-class data teams. Mentor and advocate for career growth.');
    insertUser.run('manager4@company.com', 'Rachel Green', 'manager', 'Marketing', 'Marketing Director', 15, 'Creative leader passionate about brand building and team development.');

    // Candidates
    insertUser.run('candidate@company.com', 'Alex Johnson', 'candidate', 'Engineering', 'Senior Software Engineer', 5, 'Full-stack developer passionate about building scalable systems. Ready for the next challenge.');
    insertUser.run('emma.wilson@company.com', 'Emma Wilson', 'candidate', 'Engineering', 'Frontend Developer', 3, 'Creating beautiful user experiences with React and modern web technologies.');
    insertUser.run('carlos.rodriguez@company.com', 'Carlos Rodriguez', 'candidate', 'Engineering', 'Backend Engineer', 4, 'Distributed systems enthusiast. Love working with microservices and cloud infrastructure.');
    insertUser.run('priya.patel@company.com', 'Priya Patel', 'candidate', 'Data Science', 'Data Analyst', 2, 'Turning data into insights. Excited about machine learning and predictive analytics.');
    insertUser.run('omar.hassan@company.com', 'Omar Hassan', 'candidate', 'Product', 'Product Analyst', 3, 'Data-driven product professional. Passionate about user research and A/B testing.');
    insertUser.run('sophie.martin@company.com', 'Sophie Martin', 'candidate', 'Engineering', 'DevOps Engineer', 4, 'Infrastructure automation expert. Building reliable systems at scale.');
    insertUser.run('kevin.lee@company.com', 'Kevin Lee', 'candidate', 'Engineering', 'Software Engineer', 2, 'Early career engineer eager to learn and grow. Strong foundation in algorithms and system design.');
    insertUser.run('maria.garcia@company.com', 'Maria Garcia', 'candidate', 'Marketing', 'Marketing Specialist', 4, 'Digital marketing pro with focus on content strategy and SEO.');
    insertUser.run('tom.brown@company.com', 'Tom Brown', 'candidate', 'Data Science', 'ML Engineer', 5, 'Building production ML systems. Experience with NLP and computer vision.');
    insertUser.run('nina.jones@company.com', 'Nina Jones', 'candidate', 'Product', 'Junior Product Manager', 2, 'New to product management but bringing strong technical background and user empathy.');

    // Set manager relationships
    const managerId1 = db.prepare('SELECT id FROM users WHERE email = ?').get('manager@company.com') as any;
    const managerId2 = db.prepare('SELECT id FROM users WHERE email = ?').get('manager2@company.com') as any;
    const managerId3 = db.prepare('SELECT id FROM users WHERE email = ?').get('manager3@company.com') as any;
    const managerId4 = db.prepare('SELECT id FROM users WHERE email = ?').get('manager4@company.com') as any;

    // Assign team members to managers
    const updateManager = db.prepare('UPDATE users SET manager_id = ? WHERE email = ?');
    updateManager.run(managerId1.id, 'candidate@company.com');
    updateManager.run(managerId1.id, 'emma.wilson@company.com');
    updateManager.run(managerId1.id, 'carlos.rodriguez@company.com');
    updateManager.run(managerId1.id, 'sophie.martin@company.com');
    updateManager.run(managerId1.id, 'kevin.lee@company.com');

    updateManager.run(managerId2.id, 'omar.hassan@company.com');
    updateManager.run(managerId2.id, 'nina.jones@company.com');

    updateManager.run(managerId3.id, 'priya.patel@company.com');
    updateManager.run(managerId3.id, 'tom.brown@company.com');

    updateManager.run(managerId4.id, 'maria.garcia@company.com');

    // Add user skills
    const insertUserSkill = db.prepare('INSERT INTO user_skills (user_id, skill_id, proficiency_level, years_experience) VALUES (?, ?, ?, ?)');

    const alexId = db.prepare('SELECT id FROM users WHERE email = ?').get('candidate@company.com') as any;
    const reactSkill = db.prepare('SELECT id FROM skills WHERE name = ?').get('React') as any;
    const nodeSkill = db.prepare('SELECT id FROM skills WHERE name = ?').get('Node.js') as any;
    const tsSkill = db.prepare('SELECT id FROM skills WHERE name = ?').get('TypeScript') as any;
    const pythonSkill = db.prepare('SELECT id FROM skills WHERE name = ?').get('Python') as any;
    const awsSkill = db.prepare('SELECT id FROM skills WHERE name = ?').get('AWS') as any;

    if (alexId && reactSkill) insertUserSkill.run(alexId.id, reactSkill.id, 4, 4);
    if (alexId && nodeSkill) insertUserSkill.run(alexId.id, nodeSkill.id, 4, 3);
    if (alexId && tsSkill) insertUserSkill.run(alexId.id, tsSkill.id, 5, 3);
    if (alexId && pythonSkill) insertUserSkill.run(alexId.id, pythonSkill.id, 3, 2);
    if (alexId && awsSkill) insertUserSkill.run(alexId.id, awsSkill.id, 3, 2);

    // Create sample jobs
    const recruiterId = db.prepare('SELECT id FROM users WHERE email = ?').get('recruiter@company.com') as any;
    const insertJob = db.prepare(`
      INSERT INTO jobs (title, department, location, employment_type, description, requirements, responsibilities, salary_range_min, salary_range_max, posted_by, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertJob.run(
      'Senior Full Stack Engineer',
      'Engineering',
      'San Francisco, CA / Remote',
      'full-time',
      'Join our core platform team to build scalable systems that power our products. Work with cutting-edge technologies and collaborate with talented engineers.',
      'Strong experience with React, Node.js, TypeScript. Experience with cloud infrastructure (AWS/GCP). Understanding of microservices architecture.',
      'Design and implement new features. Mentor junior engineers. Participate in architecture decisions. Contribute to technical strategy.',
      140000,
      180000,
      recruiterId.id,
      'open'
    );

    insertJob.run(
      'Engineering Team Lead',
      'Engineering',
      'San Francisco, CA',
      'full-time',
      'Lead a team of 5-7 engineers building our next-generation platform. This is a hands-on leadership role combining technical expertise with people management.',
      'Strong technical background. 2+ years of people management experience. Excellent communication skills. Track record of delivering complex projects.',
      'Lead and mentor engineering team. Drive technical decisions. Collaborate with product and design. Build high-performing team culture.',
      160000,
      200000,
      recruiterId.id,
      'open'
    );

    insertJob.run(
      'Machine Learning Engineer',
      'Data Science',
      'New York, NY / Remote',
      'full-time',
      'Build production ML systems that impact millions of users. Work on recommendation systems, search relevance, and personalization.',
      'Experience with Python, TensorFlow/PyTorch. Strong ML fundamentals. Experience deploying models to production. SQL and data analysis skills.',
      'Develop and deploy ML models. Collaborate with data scientists. Optimize model performance. Monitor and improve production systems.',
      150000,
      190000,
      recruiterId.id,
      'open'
    );

    insertJob.run(
      'Product Manager - Growth',
      'Product',
      'Remote',
      'full-time',
      'Drive user acquisition and engagement. Work cross-functionally to launch experiments and features that move key metrics.',
      'Product management experience. Data-driven mindset. Experience with A/B testing. Strong communication skills.',
      'Define product roadmap. Launch experiments. Analyze metrics. Work with engineering and design teams.',
      130000,
      170000,
      recruiterId.id,
      'open'
    );

    insertJob.run(
      'Senior Frontend Developer',
      'Engineering',
      'Austin, TX / Remote',
      'full-time',
      'Build beautiful, performant user interfaces. Work on our design system and create exceptional user experiences.',
      'Expert in React and modern JavaScript. Strong CSS skills. Eye for design and UX. Experience with testing and accessibility.',
      'Build UI components. Contribute to design system. Optimize performance. Mentor team members.',
      130000,
      170000,
      recruiterId.id,
      'open'
    );

    insertJob.run(
      'DevOps Engineer',
      'Engineering',
      'Seattle, WA / Remote',
      'full-time',
      'Build and maintain our cloud infrastructure. Improve deployment pipelines and system reliability.',
      'Experience with AWS/GCP/Azure. Docker and Kubernetes. Infrastructure as code (Terraform). CI/CD pipelines.',
      'Manage cloud infrastructure. Automate deployments. Monitor system health. Improve reliability and scalability.',
      140000,
      180000,
      recruiterId.id,
      'open'
    );

    // Add job skills
    const insertJobSkill = db.prepare('INSERT INTO job_skills (job_id, skill_id, required_level, is_required) VALUES (?, ?, ?, ?)');
    const job1 = db.prepare('SELECT id FROM jobs WHERE title = ?').get('Senior Full Stack Engineer') as any;

    if (job1 && reactSkill) insertJobSkill.run(job1.id, reactSkill.id, 4, 1);
    if (job1 && nodeSkill) insertJobSkill.run(job1.id, nodeSkill.id, 4, 1);
    if (job1 && tsSkill) insertJobSkill.run(job1.id, tsSkill.id, 4, 1);
    if (job1 && awsSkill) insertJobSkill.run(job1.id, awsSkill.id, 3, 0);

    // Add some applications
    const insertApp = db.prepare(`
      INSERT INTO applications (job_id, candidate_id, status, match_score, created_at)
      VALUES (?, ?, ?, ?, datetime('now', ?))
    `);

    if (alexId && job1) {
      insertApp.run(job1.id, alexId.id, 'under_review', 87.5, '-3 days');
    }

    const emmaId = db.prepare('SELECT id FROM users WHERE email = ?').get('emma.wilson@company.com') as any;
    const job5 = db.prepare('SELECT id FROM jobs WHERE title = ?').get('Senior Frontend Developer') as any;
    if (emmaId && job5) {
      insertApp.run(job5.id, emmaId.id, 'interviewing', 92.3, '-5 days');
    }

    // Add performance reviews
    const insertReview = db.prepare(`
      INSERT INTO performance_reviews (user_id, reviewer_id, review_period, rating, potential_score, strengths, areas_for_improvement, flight_risk_level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    if (alexId && managerId1) {
      insertReview.run(
        alexId.id,
        managerId1.id,
        'Q4 2025',
        5,
        5,
        'Excellent technical skills, great team player, consistently delivers high-quality work',
        'Could take on more leadership responsibilities, public speaking',
        'medium'
      );
    }

    // Add career goals
    const insertGoal = db.prepare(`
      INSERT INTO career_goals (user_id, desired_role, desired_department, target_timeframe, development_areas)
      VALUES (?, ?, ?, ?, ?)
    `);

    if (alexId) {
      insertGoal.run(
        alexId.id,
        'Engineering Team Lead',
        'Engineering',
        '12-18 months',
        'Leadership, Project Management, System Design at Scale'
      );
    }

    console.log('✅ Database seeded with rich demo data!');
    console.log('   - 16 users (2 recruiters, 4 managers, 10 candidates)');
    console.log('   - 50+ skills across multiple categories');
    console.log('   - 6 open job positions');
    console.log('   - Sample applications and performance data');
  }
}

export default db;
