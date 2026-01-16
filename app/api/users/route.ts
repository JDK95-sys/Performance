import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { sql } from '@vercel/postgres';
import { isDemoMode, demoUsers } from '@/lib/demo-data';

/**
 * GET /api/users
 * List users in the organization with pagination and search
 * Used by RequestFeedbackModal and other components
 *
 * Query params:
 * - page: Page number (default: 1)
 * - pageSize: Items per page (default: 50, max: 100)
 * - search: Search by name or email
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
    const { searchParams } = new URL(request.url);

    // Pagination parameters
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '50')));
    const search = searchParams.get('search')?.trim() || '';
    const offset = (page - 1) * pageSize;

    // Handle demo mode
    if (isDemoMode()) {
      let users = demoUsers
        .filter(u => u.id !== currentUserId)
        .map(u => ({
          id: u.id,
          email: u.email,
          name: u.name,
          title: u.title,
          department: u.department,
          role: u.role
        }));

      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        users = users.filter(u =>
          u.name.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower)
        );
      }

      const total = users.length;
      const totalPages = Math.ceil(total / pageSize);
      const paginatedUsers = users.slice(offset, offset + pageSize);

      return NextResponse.json({
        users: paginatedUsers,
        pagination: {
          page,
          pageSize,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      });
    }

    // Database mode
    let users, total;

    try {
      // Try Vercel Postgres first
      const searchCondition = search
        ? sql`AND (name ILIKE ${'%' + search + '%'} OR email ILIKE ${'%' + search + '%'})`
        : sql``;

      // Get total count
      const countResult = await sql`
        SELECT COUNT(*) as count
        FROM users
        WHERE id != ${currentUserId} ${searchCondition}
      `;
      total = parseInt(countResult.rows[0].count);

      // Get paginated results
      const result = await sql`
        SELECT id, email, name, title, department, role
        FROM users
        WHERE id != ${currentUserId} ${searchCondition}
        ORDER BY name ASC
        LIMIT ${pageSize} OFFSET ${offset}
      `;
      users = result.rows;
    } catch (vercelError) {
      // Fallback to SQLite
      const searchCondition = search
        ? `AND (name LIKE ? OR email LIKE ?)`
        : '';
      const searchParams = search ? [`%${search}%`, `%${search}%`] : [];

      // Get total count
      const countStmt = db.prepare(`
        SELECT COUNT(*) as count
        FROM users
        WHERE id != ? ${searchCondition}
      `);
      total = (countStmt.get(currentUserId, ...searchParams) as any).count;

      // Get paginated results
      const stmt = db.prepare(`
        SELECT id, email, name, job_title as title, department, role
        FROM users
        WHERE id != ? ${searchCondition}
        ORDER BY name ASC
        LIMIT ? OFFSET ?
      `);
      users = stmt.all(currentUserId, ...searchParams, pageSize, offset);
    }

    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      users,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', message: error.message },
      { status: 500 }
    );
  }
}
