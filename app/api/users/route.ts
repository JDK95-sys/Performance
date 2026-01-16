import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { sql } from '@vercel/postgres';
import { isDemoMode, demoUsers } from '@/lib/demo-data';

/**
 * GET /api/users
 * List all users in the organization (for colleague selection)
 * Used by RequestFeedbackModal and other components
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const currentUserId = decoded.userId;

    // Handle demo mode
    if (isDemoMode()) {
      // Return all users except the current user
      const users = demoUsers
        .filter(u => u.id !== currentUserId)
        .map(u => ({
          id: u.id,
          email: u.email,
          name: u.name,
          title: u.title,
          department: u.department,
          role: u.role
        }));

      return NextResponse.json({ users, count: users.length });
    }

    // Database mode
    let users;

    try {
      // Try Vercel Postgres first
      const result = await sql`
        SELECT id, email, name, title, department, role
        FROM users
        WHERE id != ${currentUserId}
        ORDER BY name ASC
      `;
      users = result.rows;
    } catch (vercelError) {
      // Fallback to SQLite
      const stmt = db.prepare(`
        SELECT id, email, name, job_title as title, department, role
        FROM users
        WHERE id != ?
        ORDER BY name ASC
      `);
      users = stmt.all(currentUserId);
    }

    return NextResponse.json({ users, count: users.length });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', message: error.message },
      { status: 500 }
    );
  }
}
