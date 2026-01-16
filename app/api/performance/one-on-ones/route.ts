import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { sql } from '@vercel/postgres';
import { isDemoMode } from '@/lib/demo-data';

/**
 * GET /api/performance/one-on-ones
 * Get one-on-one meetings for the current user
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
    const employeeId = searchParams.get('employeeId');

    // Handle demo mode
    if (isDemoMode()) {
      return NextResponse.json({
        oneOnOnes: [],
        message: 'Demo mode - no stored 1:1 meetings'
      });
    }

    // Database mode
    let oneOnOnes;

    try {
      // Try Vercel Postgres first
      let query;
      if (employeeId) {
        query = sql`
          SELECT
            o.*,
            e.name as employee_name,
            e.title as employee_title,
            m.name as manager_name,
            m.title as manager_title
          FROM one_on_ones o
          JOIN users e ON o.employee_id = e.id
          JOIN users m ON o.manager_id = m.id
          WHERE o.employee_id = ${employeeId}
             OR o.manager_id = ${decoded.userId}
          ORDER BY o.scheduled_date DESC
        `;
      } else {
        query = sql`
          SELECT
            o.*,
            e.name as employee_name,
            e.title as employee_title,
            m.name as manager_name,
            m.title as manager_title
          FROM one_on_ones o
          JOIN users e ON o.employee_id = e.id
          JOIN users m ON o.manager_id = m.id
          WHERE o.employee_id = ${decoded.userId}
             OR o.manager_id = ${decoded.userId}
          ORDER BY o.scheduled_date DESC
        `;
      }

      const result = await query;
      oneOnOnes = result.rows;
    } catch (vercelError) {
      // Fallback to SQLite
      let query;
      const params = [decoded.userId];

      if (employeeId) {
        query = `
          SELECT
            o.*,
            e.name as employee_name,
            e.job_title as employee_title,
            m.name as manager_name,
            m.job_title as manager_title
          FROM one_on_ones o
          JOIN users e ON o.employee_id = e.id
          JOIN users m ON o.manager_id = m.id
          WHERE o.employee_id = ?
             OR o.manager_id = ?
          ORDER BY o.scheduled_date DESC
        `;
        params.push(decoded.userId);
      } else {
        query = `
          SELECT
            o.*,
            e.name as employee_name,
            e.job_title as employee_title,
            m.name as manager_name,
            m.job_title as manager_title
          FROM one_on_ones o
          JOIN users e ON o.employee_id = e.id
          JOIN users m ON o.manager_id = m.id
          WHERE o.employee_id = ?
             OR o.manager_id = ?
          ORDER BY o.scheduled_date DESC
        `;
        params.push(decoded.userId);
      }

      const stmt = db.prepare(query);
      oneOnOnes = stmt.all(...params);
    }

    return NextResponse.json({
      oneOnOnes,
      count: oneOnOnes.length
    });
  } catch (error: any) {
    console.error('Error fetching one-on-ones:', error);
    return NextResponse.json(
      { error: 'Failed to fetch one-on-ones', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/performance/one-on-ones
 * Schedule a new one-on-one meeting
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
      employee_id,
      scheduled_date,
      duration_minutes,
      agenda
    } = body;

    // Validate required fields
    if (!employee_id || !scheduled_date) {
      return NextResponse.json(
        { error: 'Missing required fields: employee_id, scheduled_date' },
        { status: 400 }
      );
    }

    // Check permission - can only schedule for your team (if manager)
    if (!['manager', 'hr'].includes(decoded.role)) {
      return NextResponse.json(
        { error: 'Only managers can schedule 1:1 meetings' },
        { status: 403 }
      );
    }

    // Handle demo mode
    if (isDemoMode()) {
      console.log('Demo mode: 1:1 meeting scheduled', {
        employee_id,
        manager_id: decoded.userId,
        scheduled_date,
        duration_minutes
      });

      return NextResponse.json({
        success: true,
        message: '1:1 meeting scheduled successfully (Demo Mode)',
        oneOnOne: {
          id: Math.floor(Math.random() * 10000),
          employee_id,
          manager_id: decoded.userId,
          scheduled_date,
          duration_minutes: duration_minutes || 30,
          status: 'scheduled',
          agenda,
          created_at: new Date().toISOString()
        }
      }, { status: 201 });
    }

    // Database mode
    let oneOnOne;

    try {
      // Try Vercel Postgres first
      const result = await sql`
        INSERT INTO one_on_ones (
          employee_id,
          manager_id,
          scheduled_date,
          duration_minutes,
          status,
          agenda
        )
        VALUES (
          ${employee_id},
          ${decoded.userId},
          ${scheduled_date},
          ${duration_minutes || 30},
          'scheduled',
          ${agenda || null}
        )
        RETURNING *
      `;

      oneOnOne = result.rows[0];
    } catch (vercelError) {
      // Fallback to SQLite
      const stmt = db.prepare(`
        INSERT INTO one_on_ones (
          employee_id,
          manager_id,
          scheduled_date,
          duration_minutes,
          status,
          agenda
        )
        VALUES (?, ?, ?, ?, 'scheduled', ?)
      `);

      const insertResult = stmt.run(
        employee_id,
        decoded.userId,
        scheduled_date,
        duration_minutes || 30,
        agenda || null
      );

      // Get the inserted record
      const selectStmt = db.prepare('SELECT * FROM one_on_ones WHERE id = ?');
      oneOnOne = selectStmt.get(insertResult.lastInsertRowid);
    }

    return NextResponse.json({
      success: true,
      message: '1:1 meeting scheduled successfully',
      oneOnOne
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating one-on-one:', error);
    return NextResponse.json(
      { error: 'Failed to schedule 1:1 meeting', message: error.message },
      { status: 500 }
    );
  }
}
