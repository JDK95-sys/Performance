import type Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let _db: any = null;
let _isStub = false;

// Create a stub database for build time
const stubDb = {
  prepare: () => ({
    run: () => ({ lastInsertRowid: 0, changes: 0 }),
    get: () => null,
    all: () => []
  }),
  exec: () => {},
  pragma: () => {}
};

function getDb(): any {
  if (_db) return _db;

  // During build or when better-sqlite3 is not available, use stub
  if (process.env.SKIP_DATABASE_INIT === 'true') {
    console.log('Using stub database (build mode)');
    _db = stubDb;
    _isStub = true;
    return _db;
  }

  try {
    // Only import better-sqlite3 at runtime, not during build
    const DatabaseConstructor = require('better-sqlite3');

    const dbPath = process.env.DATABASE_PATH || './data/marketplace.db';
    const dbDir = path.dirname(dbPath);

    // Ensure data directory exists
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    _db = new DatabaseConstructor(dbPath);
    _db.pragma('journal_mode = WAL');
    return _db;
  } catch (error) {
    console.warn('Failed to initialize database, using stub:', error);
    _db = stubDb;
    _isStub = true;
    return _db;
  }
}

export const db = new Proxy({} as Database.Database, {
  get(_target, prop) {
    const database = getDb();
    const value = (database as any)[prop];
    return typeof value === 'function' ? value.bind(database) : value;
  }
});

// Initialize database schema
export function initDatabase() {
  db.exec(`
    -- Users table with SSO integration
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('employee', 'manager', 'hr', 'candidate', 'recruiter')),
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

    -- Skill endorsements to track who endorsed whom
    CREATE TABLE IF NOT EXISTS skill_endorsements (
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

    -- ========================================
    -- PERFORMANCE MANAGEMENT SYSTEM
    -- ========================================

    -- Review Cycles (Annual, Semi-Annual, Quarterly)
    CREATE TABLE IF NOT EXISTS review_cycles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      cycle_type TEXT CHECK(cycle_type IN ('annual', 'semi_annual', 'quarterly', 'probation')),
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      self_review_deadline DATE,
      manager_review_deadline DATE,
      calibration_deadline DATE,
      status TEXT DEFAULT 'planning' CHECK(status IN ('planning', 'self_review', 'manager_review', 'calibration', 'completed', 'cancelled')),
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Comprehensive Performance Reviews
    CREATE TABLE IF NOT EXISTS pm_reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cycle_id INTEGER NOT NULL,
      employee_id INTEGER NOT NULL,
      manager_id INTEGER NOT NULL,
      review_type TEXT CHECK(review_type IN ('self', 'manager', 'peer', '360', 'probation')),
      status TEXT DEFAULT 'not_started' CHECK(status IN ('not_started', 'in_progress', 'submitted', 'acknowledged', 'calibrated')),

      -- Overall ratings
      overall_rating REAL CHECK(overall_rating BETWEEN 1 AND 5),
      potential_rating INTEGER CHECK(potential_rating BETWEEN 1 AND 5),

      -- Core sections
      achievements TEXT,
      strengths TEXT,
      areas_for_improvement TEXT,
      development_priorities TEXT,
      manager_comments TEXT,
      employee_comments TEXT,

      -- Future planning
      career_aspirations TEXT,
      recommended_next_role TEXT,
      promotion_readiness TEXT CHECK(promotion_readiness IN ('not_ready', 'ready_6_months', 'ready_12_months', 'ready_now')),

      -- Risk assessment
      flight_risk TEXT DEFAULT 'low' CHECK(flight_risk IN ('low', 'medium', 'high')),
      flight_risk_factors TEXT,
      retention_actions TEXT,

      -- Calibration
      pre_calibration_rating REAL,
      post_calibration_rating REAL,
      calibration_notes TEXT,

      -- Timestamps
      self_submitted_at DATETIME,
      manager_submitted_at DATETIME,
      employee_acknowledged_at DATETIME,
      calibrated_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (cycle_id) REFERENCES review_cycles(id) ON DELETE CASCADE,
      FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (manager_id) REFERENCES users(id),
      UNIQUE(cycle_id, employee_id, review_type)
    );

    -- Competency Framework
    CREATE TABLE IF NOT EXISTS competencies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT CHECK(category IN ('technical', 'leadership', 'behavioral', 'core_values')),
      description TEXT,
      level_1_description TEXT,
      level_2_description TEXT,
      level_3_description TEXT,
      level_4_description TEXT,
      level_5_description TEXT,
      applicable_roles TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Competency Assessments
    CREATE TABLE IF NOT EXISTS competency_assessments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      review_id INTEGER NOT NULL,
      competency_id INTEGER NOT NULL,
      rating INTEGER CHECK(rating BETWEEN 1 AND 5),
      comments TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (review_id) REFERENCES pm_reviews(id) ON DELETE CASCADE,
      FOREIGN KEY (competency_id) REFERENCES competencies(id),
      UNIQUE(review_id, competency_id)
    );

    -- Goals and OKRs
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      owner_type TEXT CHECK(owner_type IN ('individual', 'team', 'company')),
      parent_goal_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      goal_type TEXT CHECK(goal_type IN ('okr', 'smart', 'development', 'project')),
      category TEXT CHECK(category IN ('performance', 'development', 'project', 'behavioral')),

      -- Timeline
      start_date DATE,
      due_date DATE,
      quarter TEXT,

      -- Progress tracking
      progress_percentage INTEGER DEFAULT 0 CHECK(progress_percentage BETWEEN 0 AND 100),
      status TEXT DEFAULT 'not_started' CHECK(status IN ('not_started', 'on_track', 'at_risk', 'off_track', 'completed', 'cancelled')),

      -- Weight and priority
      weight REAL DEFAULT 1.0,
      priority TEXT CHECK(priority IN ('low', 'medium', 'high', 'critical')),

      -- Visibility and privacy
      visibility TEXT DEFAULT 'team' CHECK(visibility IN ('private', 'team', 'department', 'company')),

      -- Alignment
      aligned_with_team BOOLEAN DEFAULT 0,
      aligned_with_company BOOLEAN DEFAULT 0,

      created_by INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,

      FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (parent_goal_id) REFERENCES goals(id),
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    -- Key Results (for OKRs)
    CREATE TABLE IF NOT EXISTS key_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goal_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      metric_type TEXT CHECK(metric_type IN ('number', 'percentage', 'currency', 'boolean')),
      start_value REAL DEFAULT 0,
      target_value REAL NOT NULL,
      current_value REAL DEFAULT 0,
      unit TEXT,
      status TEXT DEFAULT 'not_started' CHECK(status IN ('not_started', 'on_track', 'at_risk', 'off_track', 'completed')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
    );

    -- Goal Progress Updates
    CREATE TABLE IF NOT EXISTS goal_updates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goal_id INTEGER NOT NULL,
      updated_by INTEGER NOT NULL,
      progress_percentage INTEGER CHECK(progress_percentage BETWEEN 0 AND 100),
      status TEXT CHECK(status IN ('not_started', 'on_track', 'at_risk', 'off_track', 'completed', 'cancelled')),
      update_text TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE,
      FOREIGN KEY (updated_by) REFERENCES users(id)
    );

    -- Continuous Feedback
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_user_id INTEGER NOT NULL,
      to_user_id INTEGER NOT NULL,
      feedback_type TEXT CHECK(feedback_type IN ('positive', 'constructive', 'recognition', 'coaching')),
      category TEXT CHECK(category IN ('technical', 'collaboration', 'leadership', 'communication', 'other')),
      content TEXT NOT NULL,
      is_anonymous BOOLEAN DEFAULT 0,
      visibility TEXT DEFAULT 'private' CHECK(visibility IN ('private', 'manager', 'public')),
      related_goal_id INTEGER,
      related_project TEXT,
      request_id INTEGER,
      acknowledged BOOLEAN DEFAULT 0,
      acknowledged_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (related_goal_id) REFERENCES goals(id),
      FOREIGN KEY (request_id) REFERENCES feedback_requests(id)
    );

    -- Feedback Requests
    CREATE TABLE IF NOT EXISTS feedback_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      requester_id INTEGER NOT NULL,
      requested_from_id INTEGER NOT NULL,
      context TEXT,
      specific_questions TEXT,
      deadline DATE,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'declined', 'expired')),
      completed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (requested_from_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 1-on-1 Meetings
    CREATE TABLE IF NOT EXISTS one_on_ones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      manager_id INTEGER NOT NULL,
      scheduled_date DATETIME NOT NULL,
      duration_minutes INTEGER DEFAULT 30,
      status TEXT DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),

      -- Agenda and notes
      agenda TEXT,
      employee_notes TEXT,
      manager_notes TEXT,
      shared_notes TEXT,

      -- Topics discussed
      topics_discussed TEXT,
      action_items TEXT,

      -- Mood check
      employee_mood INTEGER CHECK(employee_mood BETWEEN 1 AND 5),
      employee_mood_notes TEXT,

      -- Follow-up
      next_meeting_date DATETIME,

      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,

      FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Recognition and Kudos
    CREATE TABLE IF NOT EXISTS recognition (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_user_id INTEGER NOT NULL,
      to_user_id INTEGER NOT NULL,
      recognition_type TEXT CHECK(recognition_type IN ('kudos', 'award', 'thank_you', 'milestone')),
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      core_value TEXT,
      visibility TEXT DEFAULT 'team' CHECK(visibility IN ('private', 'team', 'department', 'company')),
      likes_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Development Plans
    CREATE TABLE IF NOT EXISTS development_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      manager_id INTEGER NOT NULL,
      plan_name TEXT NOT NULL,
      target_role TEXT,
      target_date DATE,
      status TEXT DEFAULT 'active' CHECK(status IN ('draft', 'active', 'on_hold', 'completed', 'cancelled')),
      overview TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (manager_id) REFERENCES users(id)
    );

    -- Development Plan Actions
    CREATE TABLE IF NOT EXISTS development_actions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plan_id INTEGER NOT NULL,
      action_type TEXT CHECK(action_type IN ('training', 'project', 'mentoring', 'shadowing', 'stretch_assignment', 'reading')),
      title TEXT NOT NULL,
      description TEXT,
      target_date DATE,
      status TEXT DEFAULT 'not_started' CHECK(status IN ('not_started', 'in_progress', 'completed', 'cancelled')),
      progress_notes TEXT,
      completed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (plan_id) REFERENCES development_plans(id) ON DELETE CASCADE
    );

    -- Calibration Sessions
    CREATE TABLE IF NOT EXISTS calibration_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cycle_id INTEGER NOT NULL,
      session_name TEXT NOT NULL,
      department TEXT,
      facilitator_id INTEGER NOT NULL,
      scheduled_date DATETIME NOT NULL,
      status TEXT DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      FOREIGN KEY (cycle_id) REFERENCES review_cycles(id) ON DELETE CASCADE,
      FOREIGN KEY (facilitator_id) REFERENCES users(id)
    );

    -- Calibration Session Participants
    CREATE TABLE IF NOT EXISTS calibration_participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      participant_id INTEGER NOT NULL,
      role TEXT CHECK(role IN ('facilitator', 'manager', 'hr_partner', 'observer')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES calibration_sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (participant_id) REFERENCES users(id),
      UNIQUE(session_id, participant_id)
    );

    -- Calibration Ratings (for tracking changes)
    CREATE TABLE IF NOT EXISTS calibration_ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      review_id INTEGER NOT NULL,
      original_rating REAL NOT NULL,
      proposed_rating REAL,
      final_rating REAL,
      rationale TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES calibration_sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (review_id) REFERENCES pm_reviews(id) ON DELETE CASCADE,
      UNIQUE(session_id, review_id)
    );

    -- Engagement Surveys
    CREATE TABLE IF NOT EXISTS engagement_surveys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      survey_type TEXT CHECK(survey_type IN ('pulse', 'annual', 'onboarding', 'exit', 'custom')),
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'active', 'closed', 'archived')),
      is_anonymous BOOLEAN DEFAULT 1,
      target_audience TEXT,
      created_by INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    -- Survey Questions
    CREATE TABLE IF NOT EXISTS survey_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      survey_id INTEGER NOT NULL,
      question_text TEXT NOT NULL,
      question_type TEXT CHECK(question_type IN ('rating_5', 'rating_10', 'yes_no', 'text', 'multiple_choice')),
      category TEXT,
      is_required BOOLEAN DEFAULT 1,
      order_index INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (survey_id) REFERENCES engagement_surveys(id) ON DELETE CASCADE
    );

    -- Survey Responses
    CREATE TABLE IF NOT EXISTS survey_responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      survey_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      respondent_id INTEGER,
      response_value TEXT,
      response_score INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (survey_id) REFERENCES engagement_surveys(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES survey_questions(id) ON DELETE CASCADE,
      FOREIGN KEY (respondent_id) REFERENCES users(id) ON DELETE SET NULL
    );

    -- Talent Matrix / 9-Box
    CREATE TABLE IF NOT EXISTS talent_matrix (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cycle_id INTEGER NOT NULL,
      employee_id INTEGER NOT NULL,
      performance_rating REAL NOT NULL CHECK(performance_rating BETWEEN 1 AND 5),
      potential_rating INTEGER NOT NULL CHECK(potential_rating BETWEEN 1 AND 5),
      box_position INTEGER CHECK(box_position BETWEEN 1 AND 9),
      succession_ready BOOLEAN DEFAULT 0,
      key_talent BOOLEAN DEFAULT 0,
      flight_risk TEXT CHECK(flight_risk IN ('low', 'medium', 'high')),
      development_priority TEXT CHECK(development_priority IN ('high', 'medium', 'low')),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cycle_id) REFERENCES review_cycles(id) ON DELETE CASCADE,
      FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(cycle_id, employee_id)
    );

    -- Succession Planning
    CREATE TABLE IF NOT EXISTS succession_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      position_title TEXT NOT NULL,
      department TEXT NOT NULL,
      incumbent_id INTEGER,
      criticality TEXT CHECK(criticality IN ('low', 'medium', 'high', 'critical')),
      risk_level TEXT CHECK(risk_level IN ('low', 'medium', 'high')),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (incumbent_id) REFERENCES users(id)
    );

    -- Succession Candidates
    CREATE TABLE IF NOT EXISTS succession_candidates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      succession_plan_id INTEGER NOT NULL,
      candidate_id INTEGER NOT NULL,
      readiness TEXT CHECK(readiness IN ('ready_now', 'ready_1_year', 'ready_2_years', 'ready_3_years')),
      development_needs TEXT,
      ranking INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (succession_plan_id) REFERENCES succession_plans(id) ON DELETE CASCADE,
      FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE
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
    CREATE INDEX IF NOT EXISTS idx_users_department ON users(department);
    CREATE INDEX IF NOT EXISTS idx_user_skills_user ON user_skills(user_id);
    CREATE INDEX IF NOT EXISTS idx_skill_endorsements_user ON skill_endorsements(user_id);
    CREATE INDEX IF NOT EXISTS idx_skill_endorsements_endorser ON skill_endorsements(endorser_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read);

    -- Performance Management Indexes
    CREATE INDEX IF NOT EXISTS idx_review_cycles_status ON review_cycles(status);
    CREATE INDEX IF NOT EXISTS idx_pm_reviews_cycle ON pm_reviews(cycle_id);
    CREATE INDEX IF NOT EXISTS idx_pm_reviews_employee ON pm_reviews(employee_id);
    CREATE INDEX IF NOT EXISTS idx_pm_reviews_manager ON pm_reviews(manager_id);
    CREATE INDEX IF NOT EXISTS idx_pm_reviews_status ON pm_reviews(status);
    CREATE INDEX IF NOT EXISTS idx_competency_assessments_review ON competency_assessments(review_id);
    CREATE INDEX IF NOT EXISTS idx_goals_owner ON goals(owner_id);
    CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
    CREATE INDEX IF NOT EXISTS idx_goals_due_date ON goals(due_date);
    CREATE INDEX IF NOT EXISTS idx_key_results_goal ON key_results(goal_id);
    CREATE INDEX IF NOT EXISTS idx_goal_updates_goal ON goal_updates(goal_id);
    CREATE INDEX IF NOT EXISTS idx_feedback_to_user ON feedback(to_user_id);
    CREATE INDEX IF NOT EXISTS idx_feedback_from_user ON feedback(from_user_id);
    CREATE INDEX IF NOT EXISTS idx_feedback_requests_requester ON feedback_requests(requester_id);
    CREATE INDEX IF NOT EXISTS idx_feedback_requests_requested_from ON feedback_requests(requested_from_id);
    CREATE INDEX IF NOT EXISTS idx_one_on_ones_employee ON one_on_ones(employee_id);
    CREATE INDEX IF NOT EXISTS idx_one_on_ones_manager ON one_on_ones(manager_id);
    CREATE INDEX IF NOT EXISTS idx_one_on_ones_date ON one_on_ones(scheduled_date);
    CREATE INDEX IF NOT EXISTS idx_recognition_to_user ON recognition(to_user_id);
    CREATE INDEX IF NOT EXISTS idx_development_plans_employee ON development_plans(employee_id);
    CREATE INDEX IF NOT EXISTS idx_calibration_sessions_cycle ON calibration_sessions(cycle_id);
    CREATE INDEX IF NOT EXISTS idx_calibration_participants_session ON calibration_participants(session_id);
    CREATE INDEX IF NOT EXISTS idx_survey_responses_survey ON survey_responses(survey_id);
    CREATE INDEX IF NOT EXISTS idx_talent_matrix_cycle ON talent_matrix(cycle_id);
    CREATE INDEX IF NOT EXISTS idx_talent_matrix_employee ON talent_matrix(employee_id);
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
    const insertCareerGoal = db.prepare(`
      INSERT INTO career_goals (user_id, desired_role, desired_department, target_timeframe, development_areas)
      VALUES (?, ?, ?, ?, ?)
    `);

    if (alexId) {
      insertCareerGoal.run(
        alexId.id,
        'Engineering Team Lead',
        'Engineering',
        '12-18 months',
        'Leadership, Project Management, System Design at Scale'
      );
    }

    // ========================================
    // PERFORMANCE MANAGEMENT SEED DATA
    // ========================================

    // Add HR users
    const hrId = db.prepare('SELECT id FROM users WHERE email = ?').get('recruiter@company.com') as any;
    if (hrId) {
      db.prepare('UPDATE users SET role = ? WHERE id = ?').run('hr', hrId.id);
    }

    // Add more employees for realistic 14K simulation
    const moreEmployees = [
      ['john.smith@company.com', 'John Smith', 'employee', 'Engineering', 'Software Engineer', 4],
      ['sarah.johnson@company.com', 'Sarah Johnson', 'employee', 'Engineering', 'QA Engineer', 3],
      ['michael.brown@company.com', 'Michael Brown', 'employee', 'Product', 'Product Designer', 5],
      ['jennifer.davis@company.com', 'Jennifer Davis', 'employee', 'Data Science', 'Data Scientist', 3],
      ['robert.wilson@company.com', 'Robert Wilson', 'employee', 'Engineering', 'Senior Engineer', 7],
      ['jessica.taylor@company.com', 'Jessica Taylor', 'employee', 'Marketing', 'Content Manager', 4],
      ['david.anderson@company.com', 'David Anderson', 'employee', 'Engineering', 'Tech Lead', 8],
      ['emily.thomas@company.com', 'Emily Thomas', 'employee', 'Product', 'Product Manager', 6],
    ];

    moreEmployees.forEach(([email, name, role, dept, title, exp]) => {
      insertUser.run(email, name, role, dept, title, exp, `${(name as string).split(' ')[0]} is a talented professional at our company.`);
    });

    // Assign these employees to managers
    const allEmployees = db.prepare("SELECT id, email FROM users WHERE role = 'employee' OR role = 'candidate'").all() as any[];
    allEmployees.forEach((emp, idx) => {
      const managerIndex = idx % 4 + 1;
      const manager = [managerId1, managerId2, managerId3, managerId4][managerIndex - 1];
      if (manager && emp.email !== 'candidate@company.com' && emp.email !== 'emma.wilson@company.com' &&
          emp.email !== 'carlos.rodriguez@company.com' && emp.email !== 'sophie.martin@company.com' &&
          emp.email !== 'kevin.lee@company.com' && emp.email !== 'omar.hassan@company.com' &&
          emp.email !== 'nina.jones@company.com' && emp.email !== 'priya.patel@company.com' &&
          emp.email !== 'tom.brown@company.com' && emp.email !== 'maria.garcia@company.com') {
        updateManager.run(manager.id, emp.email);
      }
    });

    // Create Competencies Framework
    const insertCompetency = db.prepare(`
      INSERT INTO competencies (name, category, description, level_1_description, level_2_description, level_3_description, level_4_description, level_5_description, applicable_roles)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const competencies = [
      ['Problem Solving', 'technical', 'Ability to analyze and solve complex problems',
        'Solves simple, well-defined problems', 'Solves moderately complex problems with guidance',
        'Independently solves complex problems', 'Solves highly complex problems and helps others',
        'Defines new approaches to solve unprecedented challenges', 'All'],
      ['Communication', 'behavioral', 'Clear and effective communication skills',
        'Communicates basic information clearly', 'Effectively communicates within team',
        'Communicates complex ideas to diverse audiences', 'Influences through exceptional communication',
        'Shapes organizational communication standards', 'All'],
      ['Leadership', 'leadership', 'Ability to lead and inspire others',
        'Emerging leadership potential', 'Leads small projects or initiatives',
        'Leads teams and drives results', 'Leads across teams and functions',
        'Provides strategic leadership across organization', 'Manager'],
      ['Technical Excellence', 'technical', 'Mastery of technical skills and best practices',
        'Basic technical proficiency', 'Solid technical foundation',
        'Advanced technical skills', 'Expert-level technical mastery',
        'Industry-recognized technical authority', 'Engineering,Data Science'],
      ['Collaboration', 'behavioral', 'Works effectively with others',
        'Participates in team activities', 'Actively contributes to team success',
        'Drives collaboration across teams', 'Builds collaborative networks',
        'Creates culture of collaboration', 'All'],
      ['Innovation', 'core_values', 'Drives innovation and creative thinking',
        'Open to new ideas', 'Suggests improvements',
        'Implements innovative solutions', 'Drives innovation initiatives',
        'Shapes innovation strategy', 'All'],
    ];

    competencies.forEach(comp => insertCompetency.run(...comp));

    // Create Review Cycle
    const insertCycle = db.prepare(`
      INSERT INTO review_cycles (name, cycle_type, start_date, end_date, self_review_deadline, manager_review_deadline, calibration_deadline, status, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertCycle.run(
      '2025 Annual Performance Review',
      'annual',
      '2025-01-01',
      '2025-12-31',
      '2026-01-15',
      '2026-01-31',
      '2026-02-15',
      'manager_review',
      'Annual performance review cycle for 2025'
    );

    const cycleId = db.prepare('SELECT id FROM review_cycles WHERE name = ?').get('2025 Annual Performance Review') as any;

    // Create Performance Reviews
    const insertPMReview = db.prepare(`
      INSERT INTO pm_reviews (cycle_id, employee_id, manager_id, review_type, status, overall_rating, potential_rating, achievements, strengths, areas_for_improvement, development_priorities, manager_comments, flight_risk, promotion_readiness, pre_calibration_rating, manager_submitted_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', ?))
    `);

    if (alexId && managerId1 && cycleId) {
      insertPMReview.run(
        cycleId.id, alexId.id, managerId1.id, 'manager', 'submitted', 4.5, 5,
        'Led migration to microservices architecture, mentored 3 junior engineers, delivered Q4 platform improvements ahead of schedule',
        'Exceptional technical skills, strong leadership potential, great team player, proactive problem solver',
        'Could improve public speaking, needs more experience with system design at scale',
        'Technical leadership, System architecture, Public speaking',
        'Alex has been outstanding this year. Ready for tech lead role within 6 months.',
        'low', 'ready_6_months', 4.5, '-10 days'
      );
    }

    const emmaWilson = db.prepare('SELECT id FROM users WHERE email = ?').get('emma.wilson@company.com') as any;
    if (emmaWilson && managerId1 && cycleId) {
      insertPMReview.run(
        cycleId.id, emmaWilson.id, managerId1.id, 'manager', 'submitted', 4.0, 4,
        'Redesigned checkout flow increasing conversion by 15%, built component library, collaborated cross-functionally',
        'Strong UI/UX skills, detail-oriented, excellent collaboration',
        'Could take on more complex features, grow backend skills',
        'Full-stack development, System design',
        'Emma has grown significantly. Consistently delivers high-quality work.',
        'low', 'ready_12_months', 4.0, '-8 days'
      );
    }

    // Create Goals and OKRs
    const insertGoal = db.prepare(`
      INSERT INTO goals (owner_id, owner_type, title, description, goal_type, category, start_date, due_date, quarter, progress_percentage, status, weight, priority, visibility, aligned_with_team, aligned_with_company, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    if (alexId) {
      const goalId1 = insertGoal.run(
        alexId.id, 'individual',
        'Lead Microservices Migration',
        'Successfully migrate monolith to microservices architecture',
        'okr', 'performance',
        '2025-01-01', '2025-06-30', 'Q1-Q2 2025',
        75, 'on_track', 1.0, 'high', 'team', 1, 1, alexId.id
      ).lastInsertRowid;

      // Add Key Results
      const insertKR = db.prepare(`
        INSERT INTO key_results (goal_id, title, metric_type, start_value, target_value, current_value, unit, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertKR.run(goalId1, 'Migrate 5 core services', 'number', 0, 5, 4, 'services', 'on_track');
      insertKR.run(goalId1, 'Zero production incidents during migration', 'number', 0, 0, 0, 'incidents', 'on_track');
      insertKR.run(goalId1, 'Reduce API latency by 30%', 'percentage', 0, 30, 22, '%', 'on_track');
    }

    if (emmaWilson) {
      insertGoal.run(
        emmaWilson.id, 'individual',
        'Improve Checkout Conversion',
        'Optimize checkout flow to increase conversion rate',
        'smart', 'performance',
        '2025-10-01', '2025-12-31', 'Q4 2025',
        100, 'completed', 1.0, 'critical', 'department', 1, 1, emmaWilson.id
      );

      insertGoal.run(
        emmaWilson.id, 'individual',
        'Master React Performance Optimization',
        'Deep dive into React performance patterns',
        'development', 'development',
        '2025-01-01', '2025-06-30', 'Q1-Q2 2025',
        60, 'on_track', 0.5, 'medium', 'private', 0, 0, emmaWilson.id
      );
    }

    // Create Continuous Feedback
    const insertFeedback = db.prepare(`
      INSERT INTO feedback (from_user_id, to_user_id, feedback_type, category, content, visibility, acknowledged, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', ?))
    `);

    if (managerId1 && alexId) {
      insertFeedback.run(
        managerId1.id, alexId.id, 'positive', 'leadership',
        'Great job leading the sprint planning meeting today. Your preparation and communication were excellent. The team responded really well to your facilitation.',
        'private', 1, '-5 days'
      );
    }

    if (emmaWilson && alexId) {
      insertFeedback.run(
        emmaWilson.id, alexId.id, 'positive', 'collaboration',
        'Thanks for the thorough code review on my PR. Your suggestions really improved the performance of the component. Appreciate you taking the time to explain the concepts!',
        'private', 1, '-3 days'
      );
    }

    // Create 1-on-1 Meetings
    const insertOneOnOne = db.prepare(`
      INSERT INTO one_on_ones (employee_id, manager_id, scheduled_date, duration_minutes, status, shared_notes, employee_mood, created_at)
      VALUES (?, ?, datetime('now', ?), ?, ?, ?, ?, datetime('now', ?))
    `);

    if (alexId && managerId1) {
      insertOneOnOne.run(
        alexId.id, managerId1.id, '+7 days', 30, 'scheduled',
        'Agenda: Career progression, Q1 goals review, technical challenges',
        null, '-14 days'
      );

      insertOneOnOne.run(
        alexId.id, managerId1.id, '-7 days', 30, 'completed',
        'Discussed microservices progress. Alex is doing great. Talked about tech lead opportunity.',
        5, '-21 days'
      );
    }

    // Create Recognition
    const insertRecognition = db.prepare(`
      INSERT INTO recognition (from_user_id, to_user_id, recognition_type, title, message, core_value, visibility, likes_count, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now', ?))
    `);

    if (managerId1 && alexId) {
      insertRecognition.run(
        managerId1.id, alexId.id, 'kudos',
        '🌟 Exceptional Mentorship',
        'Alex has been doing an amazing job mentoring our junior engineers. Kevin has grown tremendously under Alex\'s guidance. Thank you for investing in our team!',
        'Collaboration', 'team', 12, '-4 days'
      );
    }

    // Create Development Plans
    const insertDevPlan = db.prepare(`
      INSERT INTO development_plans (employee_id, manager_id, plan_name, target_role, target_date, status, overview)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    if (alexId && managerId1) {
      const devPlanId = insertDevPlan.run(
        alexId.id, managerId1.id,
        'Path to Technical Lead',
        'Engineering Tech Lead',
        '2026-07-01',
        'active',
        'Structured development plan to prepare Alex for tech lead role focusing on system design, leadership, and communication skills.'
      ).lastInsertRowid;

      // Add development actions
      const insertDevAction = db.prepare(`
        INSERT INTO development_actions (plan_id, action_type, title, description, target_date, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      insertDevAction.run(
        devPlanId, 'training',
        'Complete System Design Course',
        'Finish "Designing Data-Intensive Applications" and complete Grokking System Design',
        '2026-03-31', 'in_progress'
      );

      insertDevAction.run(
        devPlanId, 'project',
        'Lead Q2 Architecture Initiative',
        'Take ownership of Q2 microservices migration',
        '2026-06-30', 'in_progress'
      );

      insertDevAction.run(
        devPlanId, 'mentoring',
        'Mentor 2 Junior Engineers',
        'Provide regular mentorship to junior team members',
        '2026-12-31', 'in_progress'
      );
    }

    // Create Engagement Survey
    if (hrId) {
      const insertSurvey = db.prepare(`
        INSERT INTO engagement_surveys (title, description, survey_type, start_date, end_date, status, is_anonymous, target_audience, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const surveyId = insertSurvey.run(
        'Q4 2025 Pulse Survey',
        'Quarterly pulse check on employee engagement and satisfaction',
        'pulse',
        '2025-12-01',
        '2025-12-15',
        'closed',
        1,
        'All Employees',
        hrId.id
      ).lastInsertRowid;

      // Add survey questions
      const insertQuestion = db.prepare(`
        INSERT INTO survey_questions (survey_id, question_text, question_type, category, is_required, order_index)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      insertQuestion.run(surveyId, 'I am satisfied with my role and responsibilities', 'rating_5', 'Engagement', 1, 1);
      insertQuestion.run(surveyId, 'My manager supports my growth and development', 'rating_5', 'Management', 1, 2);
      insertQuestion.run(surveyId, 'I have the resources I need to do my job effectively', 'rating_5', 'Resources', 1, 3);
      insertQuestion.run(surveyId, 'I would recommend this company as a great place to work', 'rating_5', 'Overall', 1, 4);

      // Add some responses
      const insertResponse = db.prepare(`
        INSERT INTO survey_responses (survey_id, question_id, respondent_id, response_score)
        VALUES (?, ?, ?, ?)
      `);

      const questions = db.prepare('SELECT id FROM survey_questions WHERE survey_id = ?').all(surveyId) as any[];

      if (alexId) {
        questions.forEach(q => {
          insertResponse.run(surveyId, q.id, alexId.id, 5);
        });
      }
    }

    // Create Talent Matrix entries
    if (cycleId && alexId && emmaWilson) {
      const insertTalentMatrix = db.prepare(`
        INSERT INTO talent_matrix (cycle_id, employee_id, performance_rating, potential_rating, box_position, succession_ready, key_talent, flight_risk, development_priority)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      // Alex - High Performer, High Potential (Box 9)
      insertTalentMatrix.run(cycleId.id, alexId.id, 4.5, 5, 9, 1, 1, 'low', 'high');

      // Emma - Solid Performer, Good Potential (Box 5)
      insertTalentMatrix.run(cycleId.id, emmaWilson.id, 4.0, 4, 5, 0, 1, 'low', 'medium');
    }

    // Create Calibration Session
    if (cycleId && hrId) {
      const insertCalibration = db.prepare(`
        INSERT INTO calibration_sessions (cycle_id, session_name, department, facilitator_id, scheduled_date, status)
        VALUES (?, ?, ?, ?, datetime('now', ?), ?)
      `);

      const calibSessionId = insertCalibration.run(
        cycleId.id,
        'Engineering Department Calibration',
        'Engineering',
        hrId.id,
        '+3 days',
        'scheduled'
      ).lastInsertRowid;

      // Add participants
      const insertCalibParticipant = db.prepare(`
        INSERT INTO calibration_participants (session_id, participant_id, role)
        VALUES (?, ?, ?)
      `);

      insertCalibParticipant.run(calibSessionId, hrId.id, 'facilitator');
      insertCalibParticipant.run(calibSessionId, managerId1.id, 'manager');
    }

    console.log('✅ Database seeded with comprehensive performance management data!');
    console.log('   - 24+ users (HR, managers, employees)');
    console.log('   - 50+ skills for competency assessments');
    console.log('   - Performance reviews with ratings and feedback');
    console.log('   - Goals and OKRs with key results');
    console.log('   - Continuous feedback and 1-on-1 tracking');
    console.log('   - Continuous feedback and recognition');
    console.log('   - 1-on-1 meetings and development plans');
    console.log('   - Engagement surveys and talent matrix');
    console.log('   - Competency framework and calibration sessions');
  }
}

export default db;
