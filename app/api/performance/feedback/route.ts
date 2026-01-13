import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, canGiveFeedback } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * GET /api/performance/feedback
 * Get feedback (filtered by user role)
 */
export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const toUserId = searchParams.get('toUserId');
  const fromUserId = searchParams.get('fromUserId');
  const feedbackType = searchParams.get('feedbackType');

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

    const params: any[] = [];

    // Role-based filtering
    if (user.role === 'employee' || user.role === 'candidate') {
      // Employees can see feedback they sent or received
      query += ' AND (f.from_user_id = ? OR f.to_user_id = ?)';
      params.push(user.id, user.id);
    } else if (user.role === 'manager') {
      // Managers can see their own + their team's feedback
      query += ` AND (
        f.from_user_id = ? OR
        f.to_user_id = ? OR
        f.to_user_id IN (SELECT id FROM users WHERE manager_id = ?)
      )`;
      params.push(user.id, user.id, user.id);
    }
    // HR can see all feedback

    // Additional filters
    if (toUserId) {
      query += ' AND f.to_user_id = ?';
      params.push(parseInt(toUserId));
    }

    if (fromUserId) {
      query += ' AND f.from_user_id = ?';
      params.push(parseInt(fromUserId));
    }

    if (feedbackType) {
      query += ' AND f.feedback_type = ?';
      params.push(feedbackType);
    }

    query += ' ORDER BY f.created_at DESC LIMIT 100';

    const feedback = db.prepare(query).all(...params);

    return NextResponse.json({ feedback });
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
