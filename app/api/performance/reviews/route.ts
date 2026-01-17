import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { isDemoMode, getDemoReviewsByUserId } from '@/lib/demo-data';

/**
 * GET /api/performance/reviews
 * Get performance reviews (filtered by user role) with pagination
 *
 * Query params:
 * - page: Page number (default: 1)
 * - pageSize: Items per page (default: 50, max: 100)
 * - employeeId: Filter by employee
 * - cycleId: Filter by review cycle
 * - status: Filter by status
 */
export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // DEMO MODE: Return demo reviews
  if (isDemoMode()) {
    const reviews = getDemoReviewsByUserId(user.id, user.role);
    return NextResponse.json({
      reviews,
      pagination: {
        page: 1,
        pageSize: reviews.length,
        total: reviews.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      }
    });
  }

  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get('employeeId');
  const cycleId = searchParams.get('cycleId');
  const status = searchParams.get('status');

  // Pagination parameters
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '50')));
  const offset = (page - 1) * pageSize;

  try{
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

    let countQuery = `
      SELECT COUNT(*) as count
      FROM pm_reviews pr
      WHERE 1=1
    `;

    const params: any[] = [];
    const countParams: any[] = [];

    // Role-based filtering
    if (user.role === 'employee' || user.role === 'candidate') {
      // Employees can only see their own reviews
      const roleFilter = ' AND pr.employee_id = ?';
      query += roleFilter;
      countQuery += roleFilter;
      params.push(user.id);
      countParams.push(user.id);
    } else if (user.role === 'manager') {
      // Managers can see their own reviews and their team's reviews
      const roleFilter = ' AND (pr.employee_id = ? OR pr.manager_id = ?)';
      query += roleFilter;
      countQuery += roleFilter;
      params.push(user.id, user.id);
      countParams.push(user.id, user.id);
    }
    // HR can see all reviews (no additional filter)

    // Additional filters
    if (employeeId) {
      const filter = ' AND pr.employee_id = ?';
      query += filter;
      countQuery += filter;
      const id = parseInt(employeeId);
      params.push(id);
      countParams.push(id);
    }

    if (cycleId) {
      const filter = ' AND pr.cycle_id = ?';
      query += filter;
      countQuery += filter;
      const id = parseInt(cycleId);
      params.push(id);
      countParams.push(id);
    }

    if (status) {
      const filter = ' AND pr.status = ?';
      query += filter;
      countQuery += filter;
      params.push(status);
      countParams.push(status);
    }

    // Get total count
    const total = (db.prepare(countQuery).get(...countParams) as any).count;
    const totalPages = Math.ceil(total / pageSize);

    // Get paginated results
    query += ' ORDER BY pr.created_at DESC LIMIT ? OFFSET ?';
    params.push(pageSize, offset);

    const reviews = db.prepare(query).all(...params);

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
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
