import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { isDemoMode, getDemoGoalsByUserId, demoGoals } from '@/lib/demo-data';

/**
 * GET /api/performance/goals
 * Get goals (filtered by user role and visibility)
 */
export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // DEMO MODE: Return demo goals
  if (isDemoMode()) {
    // HR users can see all goals
    const goals = user.role === 'hr' ? demoGoals : getDemoGoalsByUserId(user.id);
    return NextResponse.json({ goals });
  }

  const { searchParams } = new URL(request.url);
  const ownerId = searchParams.get('ownerId');
  const status = searchParams.get('status');
  const quarter = searchParams.get('quarter');
  const category = searchParams.get('category');

  try {
    let query = `
      SELECT
        g.*,
        u.name as owner_name,
        u.department,
        creator.name as created_by_name
      FROM goals g
      JOIN users u ON g.owner_id = u.id
      JOIN users creator ON g.created_by = creator.id
      WHERE 1=1
    `;

    const params: any[] = [];

    // Role-based filtering
    if (user.role === 'employee' || user.role === 'candidate') {
      // Employees can see: their own goals + public goals
      query += ` AND (g.owner_id = ? OR g.visibility IN ('team', 'department', 'company'))`;
      params.push(user.id);
    } else if (user.role === 'manager') {
      // Managers can see: their own + team members' + public goals
      query += ` AND (
        g.owner_id = ? OR
        g.owner_id IN (SELECT id FROM users WHERE manager_id = ?) OR
        g.visibility IN ('team', 'department', 'company')
      )`;
      params.push(user.id, user.id);
    }
    // HR can see all goals

    // Additional filters
    if (ownerId) {
      query += ' AND g.owner_id = ?';
      params.push(parseInt(ownerId));
    }

    if (status) {
      query += ' AND g.status = ?';
      params.push(status);
    }

    if (quarter) {
      query += ' AND g.quarter = ?';
      params.push(quarter);
    }

    if (category) {
      query += ' AND g.category = ?';
      params.push(category);
    }

    query += ' ORDER BY g.due_date ASC, g.priority DESC';

    const goals = db.prepare(query).all(...params) as any[];

    // PERFORMANCE FIX: Fetch all key results in ONE query instead of N queries
    let goalsWithKRs = goals;
    if (goals.length > 0) {
      const goalIds = goals.map(g => g.id);
      const placeholders = goalIds.map(() => '?').join(',');

      const allKeyResults = db.prepare(`
        SELECT * FROM key_results
        WHERE goal_id IN (${placeholders})
        ORDER BY goal_id ASC, id ASC
      `).all(...goalIds) as any[];

      // Group key results by goal_id
      const krsByGoalId: Record<number, any[]> = {};
      allKeyResults.forEach(kr => {
        if (!krsByGoalId[kr.goal_id]) krsByGoalId[kr.goal_id] = [];
        krsByGoalId[kr.goal_id].push(kr);
      });

      // Attach key results to their respective goals
      goalsWithKRs = goals.map(goal => ({
        ...goal,
        keyResults: krsByGoalId[goal.id] || []
      }));
    }

    return NextResponse.json({ goals: goalsWithKRs });
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

/**
 * POST /api/performance/goals
 * Create a new goal
 */
export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      owner_id,
      title,
      description,
      goal_type,
      category,
      start_date,
      due_date,
      quarter,
      priority,
      visibility,
      weight,
      keyResults
    } = body;

    // Validate required fields
    if (!title || !goal_type || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, goal_type, category' },
        { status: 400 }
      );
    }

    // Determine owner
    const goalOwnerId = owner_id || user.id;

    // Check if user can create goals for this owner
    if (goalOwnerId !== user.id && user.role !== 'hr' && user.role !== 'manager') {
      return NextResponse.json({ error: 'Cannot create goals for other users' }, { status: 403 });
    }

    // Create goal
    const result = db.prepare(`
      INSERT INTO goals (
        owner_id, owner_type, title, description, goal_type, category,
        start_date, due_date, quarter, priority, visibility, weight, created_by
      )
      VALUES (?, 'individual', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      goalOwnerId,
      title,
      description || null,
      goal_type,
      category,
      start_date || null,
      due_date || null,
      quarter || null,
      priority || 'medium',
      visibility || 'team',
      weight || 1.0,
      user.id
    );

    const goalId = result.lastInsertRowid;

    // Create key results if provided
    if (keyResults && Array.isArray(keyResults) && keyResults.length > 0) {
      const insertKR = db.prepare(`
        INSERT INTO key_results (goal_id, title, description, metric_type, start_value, target_value, current_value, unit)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const kr of keyResults) {
        insertKR.run(
          goalId,
          kr.title,
          kr.description || null,
          kr.metric_type,
          kr.start_value || 0,
          kr.target_value,
          kr.current_value || kr.start_value || 0,
          kr.unit || null
        );
      }
    }

    // Get created goal with key results
    const goal = db.prepare('SELECT * FROM goals WHERE id = ?').get(goalId) as any;
    const krs = db.prepare('SELECT * FROM key_results WHERE goal_id = ?').all(goalId) as any[];

    return NextResponse.json({ goal: Object.assign({}, goal, { keyResults: krs }) }, { status: 201 });
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}
