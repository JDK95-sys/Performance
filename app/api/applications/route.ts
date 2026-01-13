import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * GET /api/applications - Get applications based on user role
 */
export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    let query = '';
    let params: any[] = [];

    if (user.role === 'candidate') {
      // Candidates see their own applications
      query = `
        SELECT a.*, j.title as job_title, j.department, j.location
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        WHERE a.candidate_id = ?
      `;
      params = [user.id];
    } else if (user.role === 'recruiter') {
      // Recruiters see all applications
      query = `
        SELECT a.*, j.title as job_title, j.department, u.name as candidate_name, u.email as candidate_email
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        JOIN users u ON a.candidate_id = u.id
        WHERE 1=1
      `;
    } else if (user.role === 'manager') {
      // Managers see their team members' applications
      query = `
        SELECT a.*, j.title as job_title, j.department, u.name as candidate_name
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        JOIN users u ON a.candidate_id = u.id
        WHERE u.manager_id = ?
      `;
      params = [user.id];
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (status) {
      query += ' AND a.status = ?';
      params.push(status);
    }

    query += ' ORDER BY a.created_at DESC';

    const applications = db.prepare(query).all(...params);

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}
