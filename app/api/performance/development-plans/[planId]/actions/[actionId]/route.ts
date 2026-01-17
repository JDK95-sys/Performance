import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { sql } from '@vercel/postgres';
import { isDemoMode } from '@/lib/demo-data';

/**
 * PATCH /api/performance/development-plans/[planId]/actions/[actionId]
 * Update a development action's status or progress notes
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { planId: string; actionId: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value || request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const planId = parseInt(params.planId);
    const actionId = parseInt(params.actionId);
    const body = await request.json();
    const { status, progress_notes } = body;

    // Handle demo mode
    if (isDemoMode()) {
      console.log('Demo mode: Development action updated', {
        planId,
        actionId,
        status,
        progress_notes
      });

      return NextResponse.json({
        success: true,
        message: 'Development action updated successfully (Demo Mode)',
        action: {
          id: actionId,
          plan_id: planId,
          status: status || 'in_progress',
          progress_notes: progress_notes || '',
          updated_at: new Date().toISOString()
        }
      });
    }

    // Database mode
    let updatedAction;

    try {
      // Try Vercel Postgres first
      const result = await sql`
        UPDATE development_actions
        SET
          status = COALESCE(${status}, status),
          progress_notes = COALESCE(${progress_notes}, progress_notes),
          updated_at = NOW()
        WHERE id = ${actionId} AND plan_id = ${planId}
        RETURNING *
      `;

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Action not found' },
          { status: 404 }
        );
      }

      updatedAction = result.rows[0];
    } catch (vercelError) {
      // Fallback to SQLite
      const stmt = db.prepare(`
        UPDATE development_actions
        SET
          status = COALESCE(?, status),
          progress_notes = COALESCE(?, progress_notes),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND plan_id = ?
      `);

      const updateResult = stmt.run(status || null, progress_notes || null, actionId, planId);

      if (updateResult.changes === 0) {
        return NextResponse.json(
          { error: 'Action not found' },
          { status: 404 }
        );
      }

      const selectStmt = db.prepare('SELECT * FROM development_actions WHERE id = ?');
      updatedAction = selectStmt.get(actionId);
    }

    return NextResponse.json({
      success: true,
      message: 'Development action updated successfully',
      action: updatedAction
    });
  } catch (error: any) {
    console.error('Error updating development action:', error);
    return NextResponse.json(
      { error: 'Failed to update development action', message: error.message },
      { status: 500 }
    );
  }
}
