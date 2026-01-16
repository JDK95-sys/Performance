import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { sql } from '@vercel/postgres';
import { isDemoMode } from '@/lib/demo-data';

/**
 * POST /api/performance/feedback/request
 * Request feedback from a colleague
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
      from_user_id,
      category,
      message
    } = body;

    // Validate required fields
    if (!from_user_id) {
      return NextResponse.json(
        { error: 'Missing required field: from_user_id' },
        { status: 400 }
      );
    }

    // Prevent requesting feedback from yourself
    if (parseInt(from_user_id) === decoded.userId) {
      return NextResponse.json(
        { error: 'Cannot request feedback from yourself' },
        { status: 400 }
      );
    }

    // Handle demo mode
    if (isDemoMode()) {
      // In demo mode, just return success without actually storing
      console.log('Demo mode: Feedback request created', {
        requester_id: decoded.userId,
        requested_from_id: from_user_id,
        category,
        message
      });

      return NextResponse.json({
        success: true,
        message: 'Feedback request sent successfully (Demo Mode)',
        feedbackRequest: {
          id: Math.floor(Math.random() * 10000),
          requester_id: decoded.userId,
          requested_from_id: from_user_id,
          context: category,
          specific_questions: message,
          status: 'pending',
          created_at: new Date().toISOString()
        }
      }, { status: 201 });
    }

    // Database mode
    let feedbackRequest;

    try {
      // Try Vercel Postgres first
      const result = await sql`
        INSERT INTO feedback_requests (
          requester_id,
          requested_from_id,
          context,
          specific_questions,
          status,
          deadline
        )
        VALUES (
          ${decoded.userId},
          ${from_user_id},
          ${category || 'general'},
          ${message || null},
          'pending',
          ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
        )
        RETURNING *
      `;
      feedbackRequest = result.rows[0];
    } catch (vercelError) {
      // Fallback to SQLite
      const stmt = db.prepare(`
        INSERT INTO feedback_requests (
          requester_id,
          requested_from_id,
          context,
          specific_questions,
          status,
          deadline
        )
        VALUES (?, ?, ?, ?, 'pending', date('now', '+14 days'))
      `);

      const insertResult = stmt.run(
        decoded.userId,
        from_user_id,
        category || 'general',
        message || null
      );

      // Get the inserted record
      const selectStmt = db.prepare('SELECT * FROM feedback_requests WHERE id = ?');
      feedbackRequest = selectStmt.get(insertResult.lastInsertRowid);
    }

    return NextResponse.json({
      success: true,
      message: 'Feedback request sent successfully',
      feedbackRequest
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating feedback request:', error);
    return NextResponse.json(
      { error: 'Failed to create feedback request', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/performance/feedback/request
 * Get feedback requests for the current user
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
    const type = searchParams.get('type'); // 'sent' or 'received'

    // Handle demo mode
    if (isDemoMode()) {
      return NextResponse.json({
        feedbackRequests: [],
        message: 'Demo mode - no stored feedback requests'
      });
    }

    // Database mode
    let feedbackRequests;

    try {
      // Try Vercel Postgres first
      let query;
      if (type === 'sent') {
        query = sql`
          SELECT fr.*,
                 u.name as requested_from_name,
                 u.title as requested_from_title,
                 u.department as requested_from_department
          FROM feedback_requests fr
          JOIN users u ON fr.requested_from_id = u.id
          WHERE fr.requester_id = ${decoded.userId}
          ORDER BY fr.created_at DESC
        `;
      } else if (type === 'received') {
        query = sql`
          SELECT fr.*,
                 u.name as requester_name,
                 u.title as requester_title,
                 u.department as requester_department
          FROM feedback_requests fr
          JOIN users u ON fr.requester_id = u.id
          WHERE fr.requested_from_id = ${decoded.userId}
          ORDER BY fr.created_at DESC
        `;
      } else {
        // Both sent and received
        query = sql`
          SELECT fr.*,
                 req.name as requester_name,
                 req.title as requester_title,
                 from_user.name as requested_from_name,
                 from_user.title as requested_from_title
          FROM feedback_requests fr
          JOIN users req ON fr.requester_id = req.id
          JOIN users from_user ON fr.requested_from_id = from_user.id
          WHERE fr.requester_id = ${decoded.userId} OR fr.requested_from_id = ${decoded.userId}
          ORDER BY fr.created_at DESC
        `;
      }

      const result = await query;
      feedbackRequests = result.rows;
    } catch (vercelError) {
      // Fallback to SQLite
      let query;
      const params = [decoded.userId];

      if (type === 'sent') {
        query = `
          SELECT fr.*,
                 u.name as requested_from_name,
                 u.job_title as requested_from_title,
                 u.department as requested_from_department
          FROM feedback_requests fr
          JOIN users u ON fr.requested_from_id = u.id
          WHERE fr.requester_id = ?
          ORDER BY fr.created_at DESC
        `;
      } else if (type === 'received') {
        query = `
          SELECT fr.*,
                 u.name as requester_name,
                 u.job_title as requester_title,
                 u.department as requester_department
          FROM feedback_requests fr
          JOIN users u ON fr.requester_id = u.id
          WHERE fr.requested_from_id = ?
          ORDER BY fr.created_at DESC
        `;
      } else {
        query = `
          SELECT fr.*,
                 req.name as requester_name,
                 req.job_title as requester_title,
                 from_user.name as requested_from_name,
                 from_user.job_title as requested_from_title
          FROM feedback_requests fr
          JOIN users req ON fr.requester_id = req.id
          JOIN users from_user ON fr.requested_from_id = from_user.id
          WHERE fr.requester_id = ? OR fr.requested_from_id = ?
          ORDER BY fr.created_at DESC
        `;
        params.push(decoded.userId);
      }

      const stmt = db.prepare(query);
      feedbackRequests = stmt.all(...params);
    }

    return NextResponse.json({
      feedbackRequests,
      count: feedbackRequests.length
    });
  } catch (error: any) {
    console.error('Error fetching feedback requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback requests', message: error.message },
      { status: 500 }
    );
  }
}
