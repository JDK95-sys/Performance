import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, canViewApplication, createNotification } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * GET /api/applications/:id - Get application details
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
    const applicationId = parseInt(params.id);
    const permission = canViewApplication(user, applicationId);

    if (!permission.allowed) {
      return NextResponse.json({ error: permission.reason }, { status: 403 });
    }

    const application = db.prepare(`
      SELECT a.*, j.title as job_title, j.department, j.description, j.requirements,
             u.name as candidate_name, u.email as candidate_email, u.job_title as current_title,
             u.department as current_department
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON a.candidate_id = u.id
      WHERE a.id = ?
    `).get(applicationId);

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Get application history
    const history = db.prepare(`
      SELECT ah.*, u.name as changed_by_name
      FROM application_history ah
      JOIN users u ON ah.changed_by = u.id
      WHERE ah.application_id = ?
      ORDER BY ah.created_at DESC
    `).all(applicationId);

    return NextResponse.json({ application, history });
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 });
  }
}

/**
 * PATCH /api/applications/:id - Update application status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const applicationId = parseInt(params.id);
    const { status, notes } = await request.json();

    const application = db.prepare(`
      SELECT a.*, u.manager_id, u.name as candidate_name
      FROM applications a
      JOIN users u ON a.candidate_id = u.id
      WHERE a.id = ?
    `).get(applicationId) as any;

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Permission checks based on role and action
    if (user.role === 'recruiter') {
      // Recruiters can update most statuses
      const allowedStatuses = ['under_review', 'interviewing', 'rejected', 'approved'];
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json({ error: 'Invalid status for recruiter' }, { status: 400 });
      }
    } else if (user.role === 'manager' && user.id === application.manager_id) {
      // Managers can only approve transfers for their team
      if (status !== 'manager_review' && status !== 'approved' && status !== 'rejected') {
        return NextResponse.json({ error: 'Managers can only approve/reject applications' }, { status: 403 });
      }

      // Update manager approval fields
      db.prepare(`
        UPDATE applications
        SET manager_approved = ?, manager_approved_by = ?, manager_approved_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(status === 'approved' ? 1 : 0, user.id, applicationId);
    } else if (user.role === 'candidate' && user.id === application.candidate_id) {
      // Candidates can only withdraw
      if (status !== 'withdrawn') {
        return NextResponse.json({ error: 'Candidates can only withdraw applications' }, { status: 403 });
      }
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update application status
    db.prepare(`
      UPDATE applications
      SET status = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, user.id, applicationId);

    // Add to history
    db.prepare(`
      INSERT INTO application_history (application_id, old_status, new_status, changed_by, notes)
      VALUES (?, ?, ?, ?, ?)
    `).run(applicationId, application.status, status, user.id, notes || null);

    // Send notifications
    if (status === 'approved') {
      createNotification(
        application.candidate_id,
        'application_approved',
        'Application Approved!',
        `Your application has been approved by ${user.name}`,
        `/candidate/applications/${applicationId}`
      );
    } else if (status === 'rejected') {
      createNotification(
        application.candidate_id,
        'application_rejected',
        'Application Status Update',
        `Your application status has been updated`,
        `/candidate/applications/${applicationId}`
      );
    } else if (status === 'interviewing') {
      createNotification(
        application.candidate_id,
        'application_interview',
        'Interview Scheduled',
        `You've been selected for an interview!`,
        `/candidate/applications/${applicationId}`
      );
    }

    return NextResponse.json({ message: 'Application updated successfully' });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}
