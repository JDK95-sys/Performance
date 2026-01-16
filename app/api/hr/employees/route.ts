import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { isDemoMode, demoUsers } from '@/lib/demo-data';
import { db } from '@/lib/db';
import { sql } from '@vercel/postgres';

/**
 * GET /api/hr/employees
 * Get employees filtered by performance and potential
 * 
 * Query params:
 * - performance: 'high' | 'medium' | 'low' (optional)
 * - potential: 'high' | 'medium' | 'low' (optional)
 * - rating: performance rating threshold (optional)
 */
export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only HR can access this endpoint
  if (user.role !== 'hr' && user.role !== 'recruiter') {
    return NextResponse.json({ error: 'Access denied. HR role required.' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const performance = searchParams.get('performance'); // 'high', 'medium', 'low'
  const potential = searchParams.get('potential'); // 'high', 'medium', 'low'
  const minRating = searchParams.get('minRating');
  const maxRating = searchParams.get('maxRating');

  try {
    if (isDemoMode()) {
      let employees = demoUsers.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        title: u.title || u.job_title || '',
        department: u.department || '',
        performance_rating: u.performance_rating || 3.5,
        potential: u.potential || 'medium'
      }));

      // Filter by potential
      if (potential) {
        employees = employees.filter(e => e.potential === potential);
      }

      // Filter by performance level
      if (performance) {
        if (performance === 'high') {
          employees = employees.filter(e => e.performance_rating >= 4.0);
        } else if (performance === 'medium') {
          employees = employees.filter(e => e.performance_rating >= 3.5 && e.performance_rating < 4.0);
        } else if (performance === 'low') {
          employees = employees.filter(e => e.performance_rating < 3.5);
        }
      }

      // Filter by rating range
      if (minRating) {
        const min = parseFloat(minRating);
        employees = employees.filter(e => e.performance_rating >= min);
      }
      if (maxRating) {
        const max = parseFloat(maxRating);
        employees = employees.filter(e => e.performance_rating < max);
      }

      return NextResponse.json({ employees });
    }

    // Database mode
    let employees;

    try {
      // Build the WHERE clause dynamically
      const conditions: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      if (potential) {
        conditions.push(`potential = $${paramIndex++}`);
        params.push(potential);
      }

      if (performance === 'high') {
        conditions.push(`performance_rating >= $${paramIndex++}`);
        params.push(4.0);
      } else if (performance === 'medium') {
        conditions.push(`performance_rating >= $${paramIndex++} AND performance_rating < $${paramIndex++}`);
        params.push(3.5, 4.0);
      } else if (performance === 'low') {
        conditions.push(`performance_rating < $${paramIndex++}`);
        params.push(3.5);
      }

      if (minRating) {
        conditions.push(`performance_rating >= $${paramIndex++}`);
        params.push(parseFloat(minRating));
      }

      if (maxRating) {
        conditions.push(`performance_rating < $${paramIndex++}`);
        params.push(parseFloat(maxRating));
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      // Try Vercel Postgres first
      const query = `
        SELECT id, name, email, title, department, performance_rating, potential
        FROM users
        ${whereClause}
        ORDER BY performance_rating DESC, name ASC
      `;

      const result = await sql.query(query, params);
      employees = result.rows;
    } catch (vercelError) {
      // Fallback to SQLite
      const conditions: string[] = [];
      const params: any[] = [];

      if (potential) {
        conditions.push('potential = ?');
        params.push(potential);
      }

      if (performance === 'high') {
        conditions.push('performance_rating >= ?');
        params.push(4.0);
      } else if (performance === 'medium') {
        conditions.push('performance_rating >= ? AND performance_rating < ?');
        params.push(3.5, 4.0);
      } else if (performance === 'low') {
        conditions.push('performance_rating < ?');
        params.push(3.5);
      }

      if (minRating) {
        conditions.push('performance_rating >= ?');
        params.push(parseFloat(minRating));
      }

      if (maxRating) {
        conditions.push('performance_rating < ?');
        params.push(parseFloat(maxRating));
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const stmt = db.prepare(`
        SELECT id, name, email, job_title as title, department, performance_rating, potential
        FROM users
        ${whereClause}
        ORDER BY performance_rating DESC, name ASC
      `);

      employees = stmt.all(...params);
    }

    return NextResponse.json({ employees });
  } catch (error: any) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees', message: error.message },
      { status: 500 }
    );
  }
}
