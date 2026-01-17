import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { isDemoMode, getDemoSkills, getDemoUserSkills } from '@/lib/demo-data';

/**
 * GET /api/performance/skills
 * Get all available skills or user skills
 *
 * Query params:
 * - userId: Get skills for a specific user (optional)
 */
export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  // DEMO MODE
  if (isDemoMode()) {
    if (userId) {
      const userSkills = getDemoUserSkills(parseInt(userId));
      return NextResponse.json({ skills: userSkills });
    }
    const skills = getDemoSkills();
    return NextResponse.json({ skills });
  }

  try {
    if (userId) {
      // Get user skills with endorsement counts
      const userSkills = db.prepare(`
        SELECT
          us.id,
          us.user_id,
          us.skill_id,
          us.proficiency_level,
          us.years_experience,
          us.endorsed_count,
          us.created_at,
          s.name as skill_name,
          s.category as skill_category
        FROM user_skills us
        JOIN skills s ON us.skill_id = s.id
        WHERE us.user_id = ?
        ORDER BY us.endorsed_count DESC, s.name ASC
      `).all(userId);

      return NextResponse.json({ skills: userSkills });
    } else {
      // Get all available skills
      const skills = db.prepare(`
        SELECT id, name, category, created_at
        FROM skills
        ORDER BY category, name
      `).all();

      return NextResponse.json({ skills });
    }
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}
