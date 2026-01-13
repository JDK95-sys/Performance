import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import JobMatchingEngine from '@/lib/matching';

/**
 * GET /api/jobs - List jobs with optional filtering and AI matching
 */
export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const department = searchParams.get('department');
    const status = searchParams.get('status') || 'open';
    const withMatching = searchParams.get('matching') === 'true';

    let query = 'SELECT j.*, u.name as posted_by_name FROM jobs j LEFT JOIN users u ON j.posted_by = u.id WHERE 1=1';
    const params: any[] = [];

    // Filter by status
    if (status) {
      query += ' AND j.status = ?';
      params.push(status);
    }

    // Filter by department
    if (department) {
      query += ' AND j.department = ?';
      params.push(department);
    }

    // Only show internal jobs to non-recruiters
    if (user.role !== 'recruiter') {
      query += ' AND j.is_internal_only = 1';
    }

    query += ' ORDER BY j.created_at DESC';

    const jobs = db.prepare(query).all(...params);

    // Add AI matching scores for candidates
    if (withMatching && user.role === 'candidate') {
      const jobsWithScores = jobs.map((job: any) => {
        const matchScore = JobMatchingEngine.calculateMatchScore(user.id, job.id);
        return { ...job, matchScore };
      });

      // Sort by match score
      jobsWithScores.sort((a, b) => b.matchScore.overallScore - a.matchScore.overallScore);

      return NextResponse.json({ jobs: jobsWithScores });
    }

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

/**
 * POST /api/jobs - Create new job posting (Recruiter only)
 */
export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);

  if (!user || user.role !== 'recruiter') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const data = await request.json();
    const {
      title,
      department,
      location,
      employment_type,
      description,
      requirements,
      responsibilities,
      salary_range_min,
      salary_range_max,
      positions_available,
      required_skills,
    } = data;

    // Validate required fields
    if (!title || !department || !description || !requirements || !responsibilities) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert job
    const result = db.prepare(`
      INSERT INTO jobs (title, department, location, employment_type, description, requirements,
                        responsibilities, salary_range_min, salary_range_max, posted_by, positions_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title,
      department,
      location || 'Remote',
      employment_type || 'full-time',
      description,
      requirements,
      responsibilities,
      salary_range_min || null,
      salary_range_max || null,
      user.id,
      positions_available || 1
    );

    const jobId = result.lastInsertRowid;

    // Add required skills
    if (required_skills && Array.isArray(required_skills)) {
      const insertSkill = db.prepare(`
        INSERT INTO job_skills (job_id, skill_id, required_level, is_required)
        VALUES (?, ?, ?, ?)
      `);

      for (const skill of required_skills) {
        // Find or create skill
        let skillRecord = db.prepare('SELECT id FROM skills WHERE name = ?').get(skill.name) as { id: number } | undefined;

        if (!skillRecord) {
          const skillResult = db.prepare('INSERT INTO skills (name, category) VALUES (?, ?)').run(
            skill.name,
            skill.category || 'Other'
          );
          skillRecord = { id: Number(skillResult.lastInsertRowid) };
        }

        insertSkill.run(jobId, skillRecord.id, skill.required_level || 3, skill.is_required ? 1 : 0);
      }
    }

    return NextResponse.json({
      message: 'Job created successfully',
      jobId,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
