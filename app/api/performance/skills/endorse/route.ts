import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { isDemoMode, endorseDemoSkill } from '@/lib/demo-data';

/**
 * POST /api/performance/skills/endorse
 * Endorse a user's skill
 *
 * Body:
 * - userId: User ID to endorse
 * - skillId: Skill ID to endorse
 */
export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, skillId } = body;

    if (!userId || !skillId) {
      return NextResponse.json(
        { error: 'userId and skillId are required' },
        { status: 400 }
      );
    }

    // Prevent self-endorsement
    if (user.id === parseInt(userId)) {
      return NextResponse.json(
        { error: 'You cannot endorse your own skills' },
        { status: 400 }
      );
    }

    // DEMO MODE
    if (isDemoMode()) {
      const result = endorseDemoSkill(user.id, parseInt(userId), parseInt(skillId));
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        message: 'Skill endorsed successfully',
        endorsedCount: result.endorsedCount
      });
    }

    // Check if user skill exists
    const userSkill = db.prepare(`
      SELECT id, endorsed_count
      FROM user_skills
      WHERE user_id = ? AND skill_id = ?
    `).get(userId, skillId) as any;

    if (!userSkill) {
      return NextResponse.json(
        { error: 'User does not have this skill' },
        { status: 404 }
      );
    }

    // Check if already endorsed
    const existingEndorsement = db.prepare(`
      SELECT id
      FROM skill_endorsements
      WHERE endorser_id = ? AND user_id = ? AND skill_id = ?
    `).get(user.id, userId, skillId);

    if (existingEndorsement) {
      return NextResponse.json(
        { error: 'You have already endorsed this skill' },
        { status: 400 }
      );
    }

    // Create endorsement and increment count
    db.prepare(`
      INSERT INTO skill_endorsements (endorser_id, user_id, skill_id)
      VALUES (?, ?, ?)
    `).run(user.id, userId, skillId);

    const result = db.prepare(`
      UPDATE user_skills
      SET endorsed_count = endorsed_count + 1
      WHERE user_id = ? AND skill_id = ?
    `).run(userId, skillId);

    // Get updated count
    const updatedSkill = db.prepare(`
      SELECT endorsed_count
      FROM user_skills
      WHERE user_id = ? AND skill_id = ?
    `).get(userId, skillId) as any;

    return NextResponse.json({
      success: true,
      message: 'Skill endorsed successfully',
      endorsedCount: updatedSkill.endorsed_count
    });
  } catch (error) {
    console.error('Error endorsing skill:', error);
    return NextResponse.json(
      { error: 'Failed to endorse skill' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/performance/skills/endorse
 * Remove endorsement from a user's skill
 *
 * Body:
 * - userId: User ID
 * - skillId: Skill ID
 */
export async function DELETE(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, skillId } = body;

    if (!userId || !skillId) {
      return NextResponse.json(
        { error: 'userId and skillId are required' },
        { status: 400 }
      );
    }

    // DEMO MODE
    if (isDemoMode()) {
      return NextResponse.json(
        { error: 'Cannot remove endorsements in demo mode' },
        { status: 400 }
      );
    }

    // Check if endorsement exists
    const existingEndorsement = db.prepare(`
      SELECT id
      FROM skill_endorsements
      WHERE endorser_id = ? AND user_id = ? AND skill_id = ?
    `).get(user.id, userId, skillId) as any;

    if (!existingEndorsement) {
      return NextResponse.json(
        { error: 'Endorsement not found' },
        { status: 404 }
      );
    }

    // Delete endorsement and decrement count
    db.prepare(`
      DELETE FROM skill_endorsements
      WHERE endorser_id = ? AND user_id = ? AND skill_id = ?
    `).run(user.id, userId, skillId);

    db.prepare(`
      UPDATE user_skills
      SET endorsed_count = MAX(0, endorsed_count - 1)
      WHERE user_id = ? AND skill_id = ?
    `).run(userId, skillId);

    // Get updated count
    const updatedSkill = db.prepare(`
      SELECT endorsed_count
      FROM user_skills
      WHERE user_id = ? AND skill_id = ?
    `).get(userId, skillId) as any;

    return NextResponse.json({
      success: true,
      message: 'Endorsement removed successfully',
      endorsedCount: updatedSkill?.endorsed_count || 0
    });
  } catch (error) {
    console.error('Error removing endorsement:', error);
    return NextResponse.json(
      { error: 'Failed to remove endorsement' },
      { status: 500 }
    );
  }
}
