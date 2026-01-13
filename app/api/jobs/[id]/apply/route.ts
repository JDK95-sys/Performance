import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, canApplyToJob, createNotification } from '@/lib/auth';
import { db } from '@/lib/db';
import JobMatchingEngine from '@/lib/matching';

/**
 * POST /api/jobs/:id/apply - Apply to job (Candidate only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const jobId = parseInt(params.id);
    const permission = canApplyToJob(user, jobId);

    if (!permission.allowed) {
      return NextResponse.json({ error: permission.reason }, { status: 403 });
    }

    const { cover_letter } = await request.json();

    // Calculate match score
    const matchScore = JobMatchingEngine.calculateMatchScore(user.id, jobId);

    // Create application
    const result = db.prepare(`
      INSERT INTO applications (job_id, candidate_id, cover_letter, match_score, status)
      VALUES (?, ?, ?, ?, 'submitted')
    `).run(jobId, user.id, cover_letter || null, matchScore.overallScore);

    const applicationId = result.lastInsertRowid;

    // Create history entry
    db.prepare(`
      INSERT INTO application_history (application_id, new_status, changed_by)
      VALUES (?, 'submitted', ?)
    `).run(applicationId, user.id);

    // Notify recruiters
    const recruiters = db.prepare("SELECT id FROM users WHERE role = 'recruiter'").all() as Array<{ id: number }>;
    const job = db.prepare('SELECT title FROM jobs WHERE id = ?').get(jobId) as { title: string };

    recruiters.forEach(recruiter => {
      createNotification(
        recruiter.id,
        'new_application',
        'New Application Received',
        `${user.name} applied for ${job.title}`,
        `/recruiter/applications/${applicationId}`
      );
    });

    // Notify manager if exists
    if (user.manager_id) {
      createNotification(
        user.manager_id,
        'team_application',
        'Team Member Applied for Internal Role',
        `${user.name} applied for ${job.title}`,
        `/manager/team/${user.id}/applications`
      );
    }

    return NextResponse.json({
      message: 'Application submitted successfully',
      applicationId,
      matchScore: matchScore.overallScore,
    }, { status: 201 });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
