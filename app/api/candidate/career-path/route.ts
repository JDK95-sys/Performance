import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import JobMatchingEngine from '@/lib/matching';
import { db } from '@/lib/db';

/**
 * GET /api/candidate/career-path - Get career path suggestions
 */
export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);

  if (!user || user.role !== 'candidate') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const careerPaths = JobMatchingEngine.suggestCareerPaths(user.id);

    // Get current skills
    const skills = db.prepare(`
      SELECT s.name, s.category, us.proficiency_level
      FROM user_skills us
      JOIN skills s ON us.skill_id = s.id
      WHERE us.user_id = ?
      ORDER BY us.proficiency_level DESC
    `).all(user.id);

    // Get career goals if set
    const goals = db.prepare(`
      SELECT *
      FROM career_goals
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `).get(user.id);

    return NextResponse.json({
      currentSkills: skills,
      careerGoals: goals,
      suggestedPaths: careerPaths,
    });
  } catch (error) {
    console.error('Error fetching career path:', error);
    return NextResponse.json({ error: 'Failed to fetch career path' }, { status: 500 });
  }
}

/**
 * POST /api/candidate/career-path - Set career goals
 */
export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);

  if (!user || user.role !== 'candidate') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { desired_role, desired_department, target_timeframe, development_areas, notes } = await request.json();

    db.prepare(`
      INSERT INTO career_goals (user_id, desired_role, desired_department, target_timeframe, development_areas, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(user.id, desired_role, desired_department, target_timeframe, development_areas, notes);

    return NextResponse.json({ message: 'Career goals saved successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error saving career goals:', error);
    return NextResponse.json({ error: 'Failed to save career goals' }, { status: 500 });
  }
}
