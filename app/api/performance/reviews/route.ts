import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * GET /api/performance/reviews
 * Get performance reviews (filtered by user role)
 */
export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get('employeeId');
  const cycleId = searchParams.get('cycleId');
  const status = searchParams.get('status');

  try {
    let query = `
      SELECT
        pr.*,
        u.name as employee_name,
        u.email as employee_email,
        u.department,
        u.job_title,
        m.name as manager_name,
        rc.name as cycle_name
      FROM pm_reviews pr
      JOIN users u ON pr.employee_id = u.id
      JOIN users m ON pr.manager_id = m.id
      JOIN review_cycles rc ON pr.cycle_id = rc.id
      WHERE 1=1
    `;

    const params: any[] = [];

    // Role-based filtering
    if (user.role === 'employee' || user.role === 'candidate') {
      // Employees can only see their own reviews
      query += ' AND pr.employee_id = ?';
      params.push(user.id);
    } else if (user.role === 'manager') {
      // Managers can see their own reviews and their team's reviews
      query += ' AND (pr.employee_id = ? OR pr.manager_id = ?)';
      params.push(user.id, user.id);
    }
    // HR can see all reviews (no additional filter)

    // Additional filters
    if (employeeId) {
      query += ' AND pr.employee_id = ?';
      params.push(parseInt(employeeId));
    }

    if (cycleId) {
      query += ' AND pr.cycle_id = ?';
      params.push(parseInt(cycleId));
    }

    if (status) {
      query += ' AND pr.status = ?';
      params.push(status);
    }

    query += ' ORDER BY pr.created_at DESC';

    const reviews = db.prepare(query).all(...params);

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

/**
 * POST /api/performance/reviews
 * Create a new performance review
 */
export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only HR can create reviews
  if (user.role !== 'hr') {
    return NextResponse.json({ error: 'Only HR can create performance reviews' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { cycle_id, employee_id, manager_id, review_type } = body;

    // Validate required fields
    if (!cycle_id || !employee_id || !manager_id || !review_type) {
      return NextResponse.json(
        { error: 'Missing required fields: cycle_id, employee_id, manager_id, review_type' },
        { status: 400 }
      );
    }

    // Check if review already exists
    const existing = db.prepare(`
      SELECT id FROM pm_reviews
      WHERE cycle_id = ? AND employee_id = ? AND review_type = ?
    `).get(cycle_id, employee_id, review_type);

    if (existing) {
      return NextResponse.json({ error: 'Review already exists for this employee and cycle' }, { status: 400 });
    }

    // Create review
    const result = db.prepare(`
      INSERT INTO pm_reviews (cycle_id, employee_id, manager_id, review_type, status)
      VALUES (?, ?, ?, ?, 'not_started')
    `).run(cycle_id, employee_id, manager_id, review_type);

    const review = db.prepare('SELECT * FROM pm_reviews WHERE id = ?').get(result.lastInsertRowid);

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
