import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, canViewJob } from '@/lib/auth';
import { db } from '@/lib/db';
import JobMatchingEngine from '@/lib/matching';

/**
 * GET /api/jobs/:id - Get job details with skills and match score
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const jobId = parseInt(params.id);
    const permission = canViewJob(user, jobId);

    if (!permission.allowed) {
      return NextResponse.json({ error: permission.reason }, { status: 403 });
    }

    // Get job details
    const job = db.prepare(`
      SELECT j.*, u.name as posted_by_name
      FROM jobs j
      LEFT JOIN users u ON j.posted_by = u.id
      WHERE j.id = ?
    `).get(jobId);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Get required skills
    const skills = db.prepare(`
      SELECT s.name, s.category, js.required_level, js.is_required
      FROM job_skills js
      JOIN skills s ON js.skill_id = s.id
      WHERE js.job_id = ?
    `).all(jobId);

    // Get match score for candidates
    let matchScore = null;
    if (user.role === 'candidate') {
      matchScore = JobMatchingEngine.calculateMatchScore(user.id, jobId);
    }

    // Get application status if exists
    const application = db.prepare(`
      SELECT id, status, created_at
      FROM applications
      WHERE job_id = ? AND candidate_id = ?
    `).get(jobId, user.id);

    return NextResponse.json({
      job,
      skills,
      matchScore,
      application,
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}

/**
 * PATCH /api/jobs/:id - Update job (Recruiter only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUserFromRequest(request);

  if (!user || user.role !== 'recruiter') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const jobId = parseInt(params.id);
    const updates = await request.json();

    const allowedFields = ['title', 'department', 'location', 'description', 'requirements', 'responsibilities', 'status'];
    const updateFields: string[] = [];
    const values: any[] = [];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        values.push(updates[field]);
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    values.push(jobId);

    db.prepare(`
      UPDATE jobs
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(...values);

    return NextResponse.json({ message: 'Job updated successfully' });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

/**
 * DELETE /api/jobs/:id - Delete job (Recruiter only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUserFromRequest(request);

  if (!user || user.role !== 'recruiter') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const jobId = parseInt(params.id);

    db.prepare('DELETE FROM jobs WHERE id = ?').run(jobId);

    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}
