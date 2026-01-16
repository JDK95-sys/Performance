import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { sql } from '@vercel/postgres';
import { isDemoMode } from '@/lib/demo-data';

/**
 * POST /api/performance/recognition
 * Give recognition/kudos to a team member
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const {
      to_user_id,
      recognition_type,
      title,
      message,
      core_value,
      visibility
    } = body;

    // Validate required fields
    if (!to_user_id || !recognition_type || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: to_user_id, recognition_type, title, message' },
        { status: 400 }
      );
    }

    // Handle demo mode
    if (isDemoMode()) {
      console.log('Demo mode: Recognition given', {
        from_user_id: decoded.userId,
        to_user_id,
        recognition_type,
        title
      });

      return NextResponse.json({
        success: true,
        message: 'Recognition sent successfully (Demo Mode)',
        recognition: {
          id: Math.floor(Math.random() * 10000),
          from_user_id: decoded.userId,
          to_user_id,
          recognition_type,
          title,
          message,
          core_value,
          visibility: visibility || 'team',
          likes_count: 0,
          created_at: new Date().toISOString()
        }
      }, { status: 201 });
    }

    // Database mode
    let recognition;

    try {
      // Try Vercel Postgres first
      const result = await sql`
        INSERT INTO recognition (
          from_user_id,
          to_user_id,
          recognition_type,
          title,
          message,
          core_value,
          visibility,
          likes_count
        )
        VALUES (
          ${decoded.userId},
          ${to_user_id},
          ${recognition_type},
          ${title},
          ${message},
          ${core_value || null},
          ${visibility || 'team'},
          0
        )
        RETURNING *
      `;

      recognition = result.rows[0];
    } catch (vercelError) {
      // Fallback to SQLite
      const stmt = db.prepare(`
        INSERT INTO recognition (
          from_user_id,
          to_user_id,
          recognition_type,
          title,
          message,
          core_value,
          visibility,
          likes_count
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 0)
      `);

      const insertResult = stmt.run(
        decoded.userId,
        to_user_id,
        recognition_type,
        title,
        message,
        core_value || null,
        visibility || 'team'
      );

      // Get the inserted record
      const selectStmt = db.prepare('SELECT * FROM recognition WHERE id = ?');
      recognition = selectStmt.get(insertResult.lastInsertRowid);
    }

    return NextResponse.json({
      success: true,
      message: 'Recognition sent successfully',
      recognition
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating recognition:', error);
    return NextResponse.json(
      { error: 'Failed to give recognition', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/performance/recognition
 * Get recognition for current user or team
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

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Handle demo mode
    if (isDemoMode()) {
      return NextResponse.json({
        recognition: [],
        message: 'Demo mode - no stored recognition'
      });
    }

    // Database mode
    let recognition;

    try {
      // Try Vercel Postgres first
      let query;
      if (userId) {
        query = sql`
          SELECT
            r.*,
            from_user.name as from_user_name,
            from_user.title as from_user_title,
            to_user.name as to_user_name,
            to_user.title as to_user_title
          FROM recognition r
          JOIN users from_user ON r.from_user_id = from_user.id
          JOIN users to_user ON r.to_user_id = to_user.id
          WHERE r.to_user_id = ${userId} OR r.from_user_id = ${userId}
          ORDER BY r.created_at DESC
        `;
      } else {
        query = sql`
          SELECT
            r.*,
            from_user.name as from_user_name,
            from_user.title as from_user_title,
            to_user.name as to_user_name,
            to_user.title as to_user_title
          FROM recognition r
          JOIN users from_user ON r.from_user_id = from_user.id
          JOIN users to_user ON r.to_user_id = to_user.id
          WHERE r.to_user_id = ${decoded.userId} OR r.from_user_id = ${decoded.userId}
             OR r.visibility IN ('company', 'department', 'team')
          ORDER BY r.created_at DESC
          LIMIT 50
        `;
      }

      const result = await query;
      recognition = result.rows;
    } catch (vercelError) {
      // Fallback to SQLite
      let query;
      const params = [decoded.userId];

      if (userId) {
        query = `
          SELECT
            r.*,
            from_user.name as from_user_name,
            from_user.job_title as from_user_title,
            to_user.name as to_user_name,
            to_user.job_title as to_user_title
          FROM recognition r
          JOIN users from_user ON r.from_user_id = from_user.id
          JOIN users to_user ON r.to_user_id = to_user.id
          WHERE r.to_user_id = ? OR r.from_user_id = ?
          ORDER BY r.created_at DESC
        `;
        params.push(decoded.userId);
      } else {
        query = `
          SELECT
            r.*,
            from_user.name as from_user_name,
            from_user.job_title as from_user_title,
            to_user.name as to_user_name,
            to_user.job_title as to_user_title
          FROM recognition r
          JOIN users from_user ON r.from_user_id = from_user.id
          JOIN users to_user ON r.to_user_id = to_user.id
          WHERE r.to_user_id = ? OR r.from_user_id = ?
             OR r.visibility IN ('company', 'department', 'team')
          ORDER BY r.created_at DESC
          LIMIT 50
        `;
        params.push(decoded.userId);
      }

      const stmt = db.prepare(query);
      recognition = stmt.all(...params);
    }

    return NextResponse.json({
      recognition,
      count: recognition.length
    });
  } catch (error: any) {
    console.error('Error fetching recognition:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recognition', message: error.message },
      { status: 500 }
    );
  }
}
