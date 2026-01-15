/**
 * Vercel Postgres Database Setup
 * This file provides utilities to set up the database schema on Vercel Postgres
 */

import { sql } from '@vercel/postgres';

export async function initializeVercelDatabase() {
  console.log('Initializing Vercel Postgres database...');

  try {
    // Check if we're using Vercel Postgres
    if (!process.env.POSTGRES_URL) {
      throw new Error('POSTGRES_URL environment variable not set');
    }

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        department VARCHAR(100),
        title VARCHAR(100),
        manager_id INTEGER REFERENCES users(id),
        skills TEXT,
        experience_years INTEGER DEFAULT 0,
        bio TEXT,
        location VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create goals table
    await sql`
      CREATE TABLE IF NOT EXISTS goals (
        id SERIAL PRIMARY KEY,
        owner_id INTEGER NOT NULL REFERENCES users(id),
        owner_type VARCHAR(50) DEFAULT 'individual',
        title VARCHAR(255) NOT NULL,
        description TEXT,
        goal_type VARCHAR(50) NOT NULL,
        category VARCHAR(100) NOT NULL,
        start_date DATE,
        due_date DATE,
        quarter VARCHAR(20),
        status VARCHAR(50) DEFAULT 'not_started',
        priority VARCHAR(20) DEFAULT 'medium',
        visibility VARCHAR(50) DEFAULT 'private',
        progress_percentage INTEGER DEFAULT 0,
        weight DECIMAL(3,2) DEFAULT 1.0,
        created_by INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create key_results table
    await sql`
      CREATE TABLE IF NOT EXISTS key_results (
        id SERIAL PRIMARY KEY,
        goal_id INTEGER NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        metric_type VARCHAR(50) NOT NULL,
        start_value DECIMAL(10,2) DEFAULT 0,
        target_value DECIMAL(10,2) NOT NULL,
        current_value DECIMAL(10,2) DEFAULT 0,
        unit VARCHAR(50),
        status VARCHAR(50) DEFAULT 'not_started',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create performance_reviews table
    await sql`
      CREATE TABLE IF NOT EXISTS performance_reviews (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER NOT NULL REFERENCES users(id),
        reviewer_id INTEGER NOT NULL REFERENCES users(id),
        cycle_name VARCHAR(100) NOT NULL,
        review_type VARCHAR(50) DEFAULT 'annual',
        period_start DATE,
        period_end DATE,
        overall_rating DECIMAL(3,2),
        status VARCHAR(50) DEFAULT 'draft',
        strengths TEXT,
        areas_for_improvement TEXT,
        goals_achieved TEXT,
        development_plan TEXT,
        manager_comments TEXT,
        employee_comments TEXT,
        submitted_at TIMESTAMP,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create feedback table
    await sql`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        from_user_id INTEGER NOT NULL REFERENCES users(id),
        to_user_id INTEGER NOT NULL REFERENCES users(id),
        feedback_type VARCHAR(50) NOT NULL,
        category VARCHAR(100),
        content TEXT NOT NULL,
        sentiment VARCHAR(50),
        is_anonymous BOOLEAN DEFAULT false,
        acknowledged BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create job_postings table
    await sql`
      CREATE TABLE IF NOT EXISTS job_postings (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        department VARCHAR(100) NOT NULL,
        location VARCHAR(100),
        job_type VARCHAR(50) DEFAULT 'full-time',
        level VARCHAR(50),
        description TEXT,
        requirements TEXT,
        responsibilities TEXT,
        salary_min INTEGER,
        salary_max INTEGER,
        posted_by INTEGER NOT NULL REFERENCES users(id),
        status VARCHAR(50) DEFAULT 'open',
        posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        closes_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create applications table
    await sql`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        job_id INTEGER NOT NULL REFERENCES job_postings(id),
        candidate_id INTEGER NOT NULL REFERENCES users(id),
        status VARCHAR(50) DEFAULT 'applied',
        cover_letter TEXT,
        ai_match_score INTEGER,
        ai_recommendation TEXT,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('✅ Vercel Postgres database initialized successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to initialize Vercel Postgres:', error);
    throw error;
  }
}

/**
 * Seed initial data for demo purposes
 */
export async function seedVercelDatabase() {
  console.log('Seeding Vercel Postgres database...');

  try {
    // Check if data already exists
    const existingUsers = await sql`SELECT COUNT(*) as count FROM users`;
    if (existingUsers.rows[0].count > 0) {
      console.log('Database already has data, skipping seed');
      return { success: true, skipped: true };
    }

    // Insert demo users
    await sql`
      INSERT INTO users (email, name, role, department, title, experience_years, bio) VALUES
      ('john.smith@company.com', 'John Smith', 'employee', 'Engineering', 'Senior Software Engineer', 5, 'Experienced full-stack developer'),
      ('sarah.johnson@company.com', 'Sarah Johnson', 'manager', 'Engineering', 'Engineering Manager', 8, 'Leading high-performance teams'),
      ('admin@company.com', 'HR Admin', 'hr', 'Human Resources', 'HR Director', 10, 'Strategic HR leadership'),
      ('recruiter@company.com', 'Jane Recruiter', 'recruiter', 'Human Resources', 'Senior Recruiter', 6, 'Talent acquisition specialist'),
      ('candidate@company.com', 'Alex Candidate', 'candidate', 'Engineering', 'Software Engineer', 3, 'Looking for internal opportunities'),
      ('manager@company.com', 'Mike Manager', 'manager', 'Product', 'Product Manager', 7, 'Product strategy and execution')
    `;

    console.log('✅ Vercel Postgres database seeded successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to seed Vercel Postgres:', error);
    throw error;
  }
}
