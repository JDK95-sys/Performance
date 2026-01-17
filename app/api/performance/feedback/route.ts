import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, canGiveFeedback } from '@/lib/auth';
import { db } from '@/lib/db';
import { isDemoMode, getDemoFeedbackByUserId, demoFeedback } from '@/lib/demo-data';

/**
 * GET /api/performance/feedback
 * Get feedback (filtered by user role) with pagination
 *
 * Query params:
 * - page: Page number (default: 1)
 * - pageSize: Items per page (default: 50, max: 100)
 * - toUserId: Filter by recipient
 * - fromUserId: Filter by sender
 * - feedbackType: Filter by type
 */
export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // DEMO MODE: Return demo feedback
  if (isDemoMode()) {
    // HR users can see all feedback
    const feedback = user.role === 'hr' ? demoFeedback : getDemoFeedbackByUserId(user.id);
    return NextResponse.json({
      feedback,
      pagination: {
        page: 1,
        pageSize: feedback.length,
        total: feedback.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      }
    });
  }

  const { searchParams } = new URL(request.url);
  const toUserId = searchParams.get('toUserId');
  const fromUserId = searchParams.get('fromUserId');
  const feedbackType = searchParams.get('feedbackType');

  // Pagination parameters
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '50')));
  const offset = (page - 1) * pageSize;

  try {
    let query = `
      SELECT
        f.*,
        from_user.name as from_user_name,
        from_user.job_title as from_user_title,
        to_user.name as to_user_name,
        to_user.job_title as to_user_title
      FROM feedback f
      JOIN users from_user ON f.from_user_id = from_user.id
      JOIN users to_user ON f.to_user_id = to_user.id
      WHERE 1=1
    `;

    let countQuery = `
      SELECT COUNT(*) as count
      FROM feedback f
      WHERE 1=1
    `;

    const params: any[] = [];
    const countParams: any[] = [];

    // Role-based filtering
    if (user.role === 'employee' || user.role === 'candidate') {
      // Employees can see feedback they sent or received
      const roleFilter = ' AND (f.from_user_id = ? OR f.to_user_id = ?)';
      query += roleFilter;
      countQuery += roleFilter;
      params.push(user.id, user.id);
      countParams.push(user.id, user.id);
    } else if (user.role === 'manager') {
      // Managers can see their own + their team's feedback
      const roleFilter = ` AND (
        f.from_user_id = ? OR
        f.to_user_id = ? OR
        f.to_user_id IN (SELECT id FROM users WHERE manager_id = ?)
      )`;
      query += roleFilter;
      countQuery += roleFilter;
      params.push(user.id, user.id, user.id);
      countParams.push(user.id, user.id, user.id);
    }
    // HR can see all feedback

    // Additional filters
    if (toUserId) {
      const filter = ' AND f.to_user_id = ?';
      query += filter;
      countQuery += filter;
      const id = parseInt(toUserId);
      params.push(id);
      countParams.push(id);
    }

    if (fromUserId) {
      const filter = ' AND f.from_user_id = ?';
      query += filter;
      countQuery += filter;
      const id = parseInt(fromUserId);
      params.push(id);
      countParams.push(id);
    }

    if (feedbackType) {
      const filter = ' AND f.feedback_type = ?';
      query += filter;
      countQuery += filter;
      params.push(feedbackType);
      countParams.push(feedbackType);
    }

    // Get total count
    const total = (db.prepare(countQuery).get(...countParams) as any).count;
    const totalPages = Math.ceil(total / pageSize);

    // Get paginated results
    query += ' ORDER BY f.created_at DESC LIMIT ? OFFSET ?';
    params.push(pageSize, offset);

    const feedback = db.prepare(query).all(...params);

    return NextResponse.json({
      feedback,
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
    console.error('Error fetching feedback:', error);
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
  }
}

/**
 * POST /api/performance/feedback
 * Give feedback to another user
 */
export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      to_user_id,
      feedback_type,
      category,
      content,
      visibility,
      is_anonymous,
      related_goal_id
    } = body;

    // Validate required fields
    if (!to_user_id || !feedback_type || !category || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: to_user_id, feedback_type, category, content' },
        { status: 400 }
      );
    }

    // Check permission
    const permission = canGiveFeedback(user, to_user_id);
    if (!permission.allowed) {
      return NextResponse.json({ error: permission.reason }, { status: 403 });
    }

    // Create feedback
    const result = db.prepare(`
      INSERT INTO feedback (
        from_user_id, to_user_id, feedback_type, category, content,
        visibility, is_anonymous, related_goal_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      user.id,
      to_user_id,
      feedback_type,
      category,
      content,
      visibility || 'private',
      is_anonymous ? 1 : 0,
      related_goal_id || null
    );

    const feedback = db.prepare('SELECT * FROM feedback WHERE id = ?').get(result.lastInsertRowid);

    return NextResponse.json({ feedback }, { status: 201 });
  } catch (error) {
    console.error('Error creating feedback:', error);
    return NextResponse.json({ error: 'Failed to create feedback' }, { status: 500 });
  }
}
