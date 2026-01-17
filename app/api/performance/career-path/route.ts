import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { isDemoMode } from '@/lib/demo-data';
import { sql } from '@vercel/postgres';
import { analyzeCareerPath, type UserSkill } from '@/lib/career-analysis';

/**
 * GET /api/performance/career-path
 * Returns career path analysis with skill gaps for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    if (isDemoMode()) {
      // Demo mode: Return mock career path data
      return NextResponse.json({
        success: true,
        careerPath: getDemoCareerPath(userId),
      });
    }

    // Fetch user's current skills
    const userSkills = await sql`
      SELECT 
        s.name as skillName,
        s.category,
        us.proficiency_level as currentLevel,
        us.years_experience as yearsExperience,
        us.endorsed_count as endorsedCount
      FROM user_skills us
      JOIN skills s ON us.skill_id = s.id
      WHERE us.user_id = ${userId}
      ORDER BY us.proficiency_level DESC, s.name
    `;

    // Fetch user's career goal
    const careerGoalResult = await sql`
      SELECT 
        desired_role,
        desired_department,
        target_timeframe,
        development_areas
      FROM career_goals
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const careerGoal = careerGoalResult.rows[0];

    if (!careerGoal || !careerGoal.desired_role) {
      return NextResponse.json({
        success: true,
        careerPath: null,
        message: 'No career goal set. Please work with your manager to define your career aspirations.'
      });
    }

    // Get user's current job title
    const userResult = await sql`
      SELECT job_title, name
      FROM users
      WHERE id = ${userId}
    `;

    const userDetails = userResult.rows[0];

    // Analyze career path
    const currentSkills: UserSkill[] = userSkills.rows.map((row: any) => ({
      skillName: row.skillname,
      category: row.category,
      currentLevel: row.currentlevel,
      yearsExperience: row.yearsexperience || 0,
      endorsedCount: row.endorsedcount || 0,
    }));

    const careerPath = analyzeCareerPath(
      currentSkills,
      careerGoal.desired_role,
      userDetails?.job_title || 'Current Position',
      careerGoal.target_timeframe
    );

    return NextResponse.json({
      success: true,
      careerPath,
    });

  } catch (error: any) {
    console.error('Error fetching career path:', error);
    return NextResponse.json(
      { error: 'Failed to fetch career path data', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Demo mode career path data generator
 */
function getDemoCareerPath(userId: number): any {
  // Different demo scenarios based on user ID
  const scenarios = [
    {
      currentRole: 'Software Engineer',
      targetRole: 'Senior Software Engineer',
      timeframe: '12-18 months',
      overallReadiness: 72,
      currentSkills: [
        { skillName: 'JavaScript', category: 'Programming', currentLevel: 4, yearsExperience: 3, endorsedCount: 5 },
        { skillName: 'TypeScript', category: 'Programming', currentLevel: 3, yearsExperience: 2, endorsedCount: 3 },
        { skillName: 'React', category: 'Frontend', currentLevel: 4, yearsExperience: 3, endorsedCount: 4 },
        { skillName: 'Node.js', category: 'Backend', currentLevel: 3, yearsExperience: 2, endorsedCount: 2 },
        { skillName: 'Git', category: 'Tools', currentLevel: 4, yearsExperience: 3, endorsedCount: 3 },
        { skillName: 'Problem Solving', category: 'Soft Skills', currentLevel: 4, yearsExperience: 3, endorsedCount: 6 },
        { skillName: 'Communication', category: 'Soft Skills', currentLevel: 3, yearsExperience: 3, endorsedCount: 4 },
      ],
      requiredSkills: [
        { skillName: 'JavaScript', category: 'Programming', requiredLevel: 4, priority: 'critical' },
        { skillName: 'TypeScript', category: 'Programming', requiredLevel: 4, priority: 'critical' },
        { skillName: 'React', category: 'Frontend', requiredLevel: 4, priority: 'critical' },
        { skillName: 'Node.js', category: 'Backend', requiredLevel: 4, priority: 'important' },
        { skillName: 'System Design', category: 'Architecture', requiredLevel: 4, priority: 'critical' },
        { skillName: 'Mentoring', category: 'Leadership', requiredLevel: 3, priority: 'important' },
        { skillName: 'Problem Solving', category: 'Soft Skills', requiredLevel: 4, priority: 'critical' },
        { skillName: 'Communication', category: 'Soft Skills', requiredLevel: 4, priority: 'critical' },
      ],
      skillGaps: [
        { skillName: 'System Design', category: 'Architecture', requiredLevel: 4, currentLevel: 0, gap: 4, priority: 'critical', status: 'missing' },
        { skillName: 'Mentoring', category: 'Leadership', requiredLevel: 3, currentLevel: 0, gap: 3, priority: 'important', status: 'missing' },
        { skillName: 'TypeScript', category: 'Programming', requiredLevel: 4, currentLevel: 3, gap: 1, priority: 'critical', status: 'developing' },
        { skillName: 'Node.js', category: 'Backend', requiredLevel: 4, currentLevel: 3, gap: 1, priority: 'important', status: 'developing' },
        { skillName: 'Communication', category: 'Soft Skills', requiredLevel: 4, currentLevel: 3, gap: 1, priority: 'critical', status: 'developing' },
        { skillName: 'JavaScript', category: 'Programming', requiredLevel: 4, currentLevel: 4, gap: 0, priority: 'critical', status: 'proficient' },
        { skillName: 'React', category: 'Frontend', requiredLevel: 4, currentLevel: 4, gap: 0, priority: 'critical', status: 'proficient' },
        { skillName: 'Problem Solving', category: 'Soft Skills', requiredLevel: 4, currentLevel: 4, gap: 0, priority: 'critical', status: 'proficient' },
      ],
      strengths: ['JavaScript', 'React', 'Problem Solving'],
      developmentAreas: ['System Design', 'Mentoring', 'TypeScript', 'Node.js', 'Communication'],
      nextSteps: [
        'Start learning System Design through online courses or workshops',
        'Advance TypeScript from level 3 to 4',
        'Develop Mentoring through projects or mentorship',
        'Discuss development plan with your manager'
      ]
    },
    {
      currentRole: 'Product Analyst',
      targetRole: 'Product Manager',
      timeframe: '18-24 months',
      overallReadiness: 58,
      currentSkills: [
        { skillName: 'Data Analysis', category: 'Analytics', currentLevel: 4, yearsExperience: 2, endorsedCount: 4 },
        { skillName: 'SQL', category: 'Database', currentLevel: 3, yearsExperience: 2, endorsedCount: 3 },
        { skillName: 'Communication', category: 'Soft Skills', currentLevel: 4, yearsExperience: 2, endorsedCount: 5 },
        { skillName: 'Problem Solving', category: 'Soft Skills', currentLevel: 4, yearsExperience: 2, endorsedCount: 4 },
      ],
      requiredSkills: [
        { skillName: 'Product Strategy', category: 'Product', requiredLevel: 4, priority: 'critical' },
        { skillName: 'User Research', category: 'Product', requiredLevel: 4, priority: 'important' },
        { skillName: 'Data Analysis', category: 'Analytics', requiredLevel: 4, priority: 'important' },
        { skillName: 'Communication', category: 'Soft Skills', requiredLevel: 5, priority: 'critical' },
        { skillName: 'Stakeholder Management', category: 'Management', requiredLevel: 4, priority: 'critical' },
        { skillName: 'Strategic Thinking', category: 'Leadership', requiredLevel: 4, priority: 'critical' },
      ],
      skillGaps: [
        { skillName: 'Product Strategy', category: 'Product', requiredLevel: 4, currentLevel: 0, gap: 4, priority: 'critical', status: 'missing' },
        { skillName: 'Stakeholder Management', category: 'Management', requiredLevel: 4, currentLevel: 0, gap: 4, priority: 'critical', status: 'missing' },
        { skillName: 'Strategic Thinking', category: 'Leadership', requiredLevel: 4, currentLevel: 0, gap: 4, priority: 'critical', status: 'missing' },
        { skillName: 'User Research', category: 'Product', requiredLevel: 4, currentLevel: 0, gap: 4, priority: 'important', status: 'missing' },
        { skillName: 'Communication', category: 'Soft Skills', requiredLevel: 5, currentLevel: 4, gap: 1, priority: 'critical', status: 'developing' },
        { skillName: 'Data Analysis', category: 'Analytics', requiredLevel: 4, currentLevel: 4, gap: 0, priority: 'important', status: 'proficient' },
      ],
      strengths: ['Data Analysis'],
      developmentAreas: ['Product Strategy', 'Stakeholder Management', 'Strategic Thinking', 'User Research', 'Communication'],
      nextSteps: [
        'Start learning Product Strategy through online courses or workshops',
        'Advance Communication from level 4 to 5',
        'Develop User Research through projects or mentorship',
        'Discuss development plan with your manager'
      ]
    }
  ];

  // Return appropriate scenario based on userId
  return scenarios[userId % scenarios.length];
}
