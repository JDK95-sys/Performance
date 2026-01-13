import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * GET /api/notifications - Get user notifications
 */
export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const unreadOnly = request.nextUrl.searchParams.get('unread') === 'true';

    let query = 'SELECT * FROM notifications WHERE user_id = ?';
    if (unreadOnly) {
      query += ' AND read = 0';
    }
    query += ' ORDER BY created_at DESC LIMIT 50';

    const notifications = db.prepare(query).all(user.id);

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

/**
 * PATCH /api/notifications/:id - Mark notification as read
 */
export async function PATCH(request: NextRequest) {
  const user = getUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { id, read } = await request.json();

    db.prepare('UPDATE notifications SET read = ? WHERE id = ? AND user_id = ?').run(
      read ? 1 : 0,
      id,
      user.id
    );

    return NextResponse.json({ message: 'Notification updated' });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
