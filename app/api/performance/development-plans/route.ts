import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { sql } from '@vercel/postgres';
import { isDemoMode } from '@/lib/demo-data';

// Demo development plan data
const demoDevelopmentPlans = [
  {
    id: 1,
    employee_id: 1,
    manager_id: 2,
    plan_name: '2026 Career Development Plan',
    target_role: 'Tech Lead',
    target_date: '2026-12-31',
    status: 'active',
    overview: 'Focus on developing leadership skills and technical architecture expertise to prepare for Tech Lead role',
    created_at: '2026-01-01',
    updated_at: '2026-01-10',
    manager_name: 'Sarah Johnson',
    actions: [
      {
        id: 1,
        plan_id: 1,
        action_type: 'training',
        title: 'Complete System Design Course',
        description: 'Complete "Grokking System Design" course to strengthen architecture skills',
        target_date: '2026-03-31',
        status: 'in_progress',
        progress_notes: '60% complete - finished 6 out of 10 modules',
        created_at: '2026-01-01'
      },
      {
        id: 2,
        plan_id: 1,
        action_type: 'mentoring',
        title: 'Mentor Junior Engineers',
        description: 'Mentor 2 junior engineers to develop coaching and leadership skills',
        target_date: '2026-06-30',
        status: 'in_progress',
        progress_notes: 'Currently mentoring Alex and Jamie, meeting weekly',
        created_at: '2026-01-01'
      },
      {
        id: 3,
        plan_id: 1,
        action_type: 'project',
        title: 'Lead Microservices Migration',
        description: 'Lead the migration of monolith to microservices architecture',
        target_date: '2026-09-30',
        status: 'not_started',
        progress_notes: null,
        created_at: '2026-01-01'
      },
      {
        id: 4,
        plan_id: 1,
        action_type: 'stretch_assignment',
        title: 'Present at Engineering All-Hands',
        description: 'Present quarterly technical deep-dive at engineering all-hands meetings',
        target_date: '2026-12-31',
        status: 'not_started',
        progress_notes: null,
        created_at: '2026-01-01'
      }
    ]
  }
];

/**
 * GET /api/performance/development-plans
 * Get development plans for the current user or their team
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
    const userId = employeeId ? parseInt(employeeId) : decoded.userId;

    // Handle demo mode
    if (isDemoMode()) {
      const userPlans = demoDevelopmentPlans.filter(p =>
        p.employee_id === userId || p.manager_id === decoded.userId
      );

      return NextResponse.json({
        plans: userPlans,
        count: userPlans.length
      });
    }

    // Database mode
    let plans;

    try {
      // Try Vercel Postgres first
      const result = await sql`
        SELECT
          dp.*,
          u.name as employee_name,
          u.title as employee_title,
          m.name as manager_name,
          m.title as manager_title
        FROM development_plans dp
        JOIN users u ON dp.employee_id = u.id
        LEFT JOIN users m ON dp.manager_id = m.id
        WHERE dp.employee_id = ${userId}
           OR (dp.manager_id = ${decoded.userId} AND ${decoded.role} IN ('manager', 'hr'))
        ORDER BY dp.created_at DESC
      `;

      plans = result.rows;

      // PERFORMANCE FIX: Fetch all actions in ONE query instead of N queries
      if (plans.length > 0) {
        const planIds = plans.map(p => p.id);

        // For Vercel Postgres, we need to use ANY() for array matching
        const actionsResult = await sql`
          SELECT * FROM development_actions
          WHERE plan_id = ANY(${planIds})
          ORDER BY plan_id ASC, target_date ASC
        `;

        // Group actions by plan_id
        const actionsByPlanId: Record<number, any[]> = {};
        actionsResult.rows.forEach((action: any) => {
          if (!actionsByPlanId[action.plan_id]) actionsByPlanId[action.plan_id] = [];
          actionsByPlanId[action.plan_id].push(action);
        });

        // Attach actions to their respective plans
        plans.forEach(plan => {
          plan.actions = actionsByPlanId[plan.id] || [];
        });
      } else {
        plans.forEach(plan => { plan.actions = []; });
      }
    } catch (vercelError) {
      // Fallback to SQLite
      const stmt = db.prepare(`
        SELECT
          dp.*,
          u.name as employee_name,
          u.job_title as employee_title,
          m.name as manager_name,
          m.job_title as manager_title
        FROM development_plans dp
        JOIN users u ON dp.employee_id = u.id
        LEFT JOIN users m ON dp.manager_id = m.id
        WHERE dp.employee_id = ?
           OR (dp.manager_id = ? AND ? IN ('manager', 'hr'))
        ORDER BY dp.created_at DESC
      `);

      plans = stmt.all(userId, decoded.userId, decoded.role);

      // PERFORMANCE FIX: Fetch all actions in ONE query instead of N queries
      if (plans.length > 0) {
        const planIds = plans.map(p => p.id);
        const placeholders = planIds.map(() => '?').join(',');

        const actionsStmt = db.prepare(`
          SELECT * FROM development_actions
          WHERE plan_id IN (${placeholders})
          ORDER BY plan_id ASC, target_date ASC
        `);
        const allActions = actionsStmt.all(...planIds) as any[];

        // Group actions by plan_id
        const actionsByPlanId: Record<number, any[]> = {};
        allActions.forEach(action => {
          if (!actionsByPlanId[action.plan_id]) actionsByPlanId[action.plan_id] = [];
          actionsByPlanId[action.plan_id].push(action);
        });

        // Attach actions to their respective plans
        plans.forEach(plan => {
          plan.actions = actionsByPlanId[plan.id] || [];
        });
      } else {
        plans.forEach(plan => { plan.actions = []; });
      }
    }

    return NextResponse.json({
      plans,
      count: plans.length
    });
  } catch (error: any) {
    console.error('Error fetching development plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch development plans', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/performance/development-plans
 * Create a new development plan
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
      plan_name,
      target_role,
      target_date,
      overview,
      actions
    } = body;

    // Validate required fields
    if (!employee_id || !plan_name) {
      return NextResponse.json(
        { error: 'Missing required fields: employee_id, plan_name' },
        { status: 400 }
      );
    }

    // Check permission - can only create plans for yourself or your team (if manager/hr)
    if (employee_id !== decoded.userId && !['manager', 'hr'].includes(decoded.role)) {
      return NextResponse.json(
        { error: 'You can only create development plans for yourself' },
        { status: 403 }
      );
    }

    // Handle demo mode
    if (isDemoMode()) {
      console.log('Demo mode: Development plan created', {
        employee_id,
        plan_name,
        target_role,
        manager_id: decoded.userId
      });

      return NextResponse.json({
        success: true,
        message: 'Development plan created successfully (Demo Mode)',
        plan: {
          id: Math.floor(Math.random() * 10000),
          employee_id,
          manager_id: decoded.userId,
          plan_name,
          target_role,
          target_date,
          status: 'active',
          overview,
          created_at: new Date().toISOString()
        }
      }, { status: 201 });
    }

    // Database mode
    let plan;

    try {
      // Try Vercel Postgres first
      const result = await sql`
        INSERT INTO development_plans (
          employee_id,
          manager_id,
          plan_name,
          target_role,
          target_date,
          status,
          overview
        )
        VALUES (
          ${employee_id},
          ${decoded.userId},
          ${plan_name},
          ${target_role || null},
          ${target_date || null},
          'active',
          ${overview || null}
        )
        RETURNING *
      `;

      plan = result.rows[0];

      // Create actions if provided
      if (actions && actions.length > 0) {
        for (const action of actions) {
          await sql`
            INSERT INTO development_actions (
              plan_id,
              action_type,
              title,
              description,
              target_date,
              status
            )
            VALUES (
              ${plan.id},
              ${action.action_type},
              ${action.title},
              ${action.description || null},
              ${action.target_date || null},
              'not_started'
            )
          `;
        }

        // Fetch actions
        const actionsResult = await sql`SELECT * FROM development_actions WHERE plan_id = ${plan.id}`;
        plan.actions = actionsResult.rows;
      }
    } catch (vercelError) {
      // Fallback to SQLite
      const stmt = db.prepare(`
        INSERT INTO development_plans (
          employee_id,
          manager_id,
          plan_name,
          target_role,
          target_date,
          status,
          overview
        )
        VALUES (?, ?, ?, ?, ?, 'active', ?)
      `);

      const insertResult = stmt.run(
        employee_id,
        decoded.userId,
        plan_name,
        target_role || null,
        target_date || null,
        overview || null
      );

      const planId = insertResult.lastInsertRowid;

      // Create actions if provided
      if (actions && actions.length > 0) {
        const actionStmt = db.prepare(`
          INSERT INTO development_actions (
            plan_id, action_type, title, description, target_date, status
          )
          VALUES (?, ?, ?, ?, ?, 'not_started')
        `);

        for (const action of actions) {
          actionStmt.run(
            planId,
            action.action_type,
            action.title,
            action.description || null,
            action.target_date || null
          );
        }
      }

      // Fetch the created plan with actions
      const selectStmt = db.prepare('SELECT * FROM development_plans WHERE id = ?');
      plan = selectStmt.get(planId);

      const actionsStmt = db.prepare('SELECT * FROM development_actions WHERE plan_id = ?');
      plan.actions = actionsStmt.all(planId);
    }

    return NextResponse.json({
      success: true,
      message: 'Development plan created successfully',
      plan
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating development plan:', error);
    return NextResponse.json(
      { error: 'Failed to create development plan', message: error.message },
      { status: 500 }
    );
  }
}
