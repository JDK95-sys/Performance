import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, getTeamMembers } from '@/lib/auth';
import { db } from '@/lib/db';
import JobMatchingEngine from '@/lib/matching';
import { isDemoMode, getDemoTeamMembersByManagerId } from '@/lib/demo-data';

/**
 * GET /api/manager/team - Get team members and their career insights
 */
export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);

  if (!user || user.role !== 'manager') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    // DEMO MODE: Return demo team data
    if (isDemoMode()) {
      const teamMembers = getDemoTeamMembersByManagerId(user.id);
      return NextResponse.json({ team: teamMembers });
    }

    const teamMembers = getTeamMembers(user.id);

    // Enrich with career insights
    const enrichedTeam = teamMembers.map(member => {
      // Get recent applications
      const applications = db.prepare(`
        SELECT COUNT(*) as count
        FROM applications
        WHERE candidate_id = ? AND created_at > datetime('now', '-90 days')
      `).get(member.id) as { count: number };

      // Get career goals
      const goals = db.prepare(`
        SELECT desired_role, desired_department, target_timeframe
        FROM career_goals
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 1
      `).get(member.id);

      // Get recent performance review
      const review = db.prepare(`
        SELECT rating, potential_score, flight_risk_level
        FROM performance_reviews
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 1
      `).get(member.id);

      // Analyze flight risk
      const flightRisk = JobMatchingEngine.analyzeFlightRisk(member.id);

      return {
        ...member,
        recentApplications: applications.count,
        careerGoals: goals,
        latestReview: review,
        flightRisk,
      };
    });

    return NextResponse.json({ team: enrichedTeam });
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
  }
}
