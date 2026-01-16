import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, canAccessManagerFeatures } from '@/lib/auth';
import {
  calculateTeamHealth,
  getTalentInsights,
  generateEmployeeInsights,
  generateManagerInsights,
  predictFlightRisk
} from '@/lib/analytics';
import {
  isDemoMode,
  demoInsights,
  getDemoTeamHealthByManagerId,
  demoHRData
} from '@/lib/demo-data';

/**
 * GET /api/performance/insights
 * Get AI-powered performance insights
 */
export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'employee', 'manager', 'team_health', 'talent', 'flight_risk'
  const employeeId = searchParams.get('employeeId');

  try {
    // DEMO MODE: Return demo insights
    if (isDemoMode()) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let insights: any = {};

      switch (type) {
        case 'employee':
          insights = {
            insights: demoInsights,
            flightRisk: { risk: 'low', confidence: 75, factors: [] }
          };
          break;

        case 'manager':
          const permission = canAccessManagerFeatures(user);
          if (!permission.allowed) {
            return NextResponse.json({ error: permission.reason }, { status: 403 });
          }

          const teamHealth = getDemoTeamHealthByManagerId(user.id);
          
          insights = {
            insights: [
              {
                type: 'strength',
                title: 'Strong Team Performance',
                message: `Strong Team Performance: Your team is performing well with an average rating of ${teamHealth.averageRating}/5.0, placing you in the top 25% of managers.`,
                description: `Your team maintains a strong performance rating of ${teamHealth.averageRating}/5.0 with ${teamHealth.highPerformers} high performers (rating ≥ 4.0). This places you in the top quartile of managers company-wide.`,
                impact: 'high',
                actionable: true,
                recommendations: ['Continue current management practices', 'Recognize top performers publicly', 'Share best practices with peer managers', 'Document your successful leadership strategies']
              },
              {
                type: 'opportunity',
                title: 'Development Focus Needed',
                message: 'Development Focus Needed: 2 team members show potential but need focused development plans to advance their careers.',
                description: '2 team members demonstrate high potential but lack structured development plans. Investing in their growth now can increase retention and build your leadership pipeline.',
                impact: 'high',
                actionable: true,
                recommendations: ['Schedule career development discussions', 'Create personalized growth plans with 90-day milestones', 'Identify stretch assignments and shadowing opportunities', 'Connect them with mentors in desired career paths']
              },
              {
                type: 'alert',
                title: 'Flight Risk Detected',
                message: `Flight Risk Alert: ${teamHealth.atRisk} team member${teamHealth.atRisk > 1 ? 's' : ''} may be at risk based on performance and engagement patterns.`,
                description: `${teamHealth.atRisk} team member${teamHealth.atRisk > 1 ? 's show' : ' shows'} concerning patterns including lower performance ratings and reduced engagement. Early intervention can prevent turnover.`,
                impact: 'high',
                actionable: true,
                recommendations: ['Schedule immediate 1-on-1 conversations', 'Review compensation and growth opportunities', 'Assess workload, work-life balance, and job satisfaction', 'Create 30-60-90 day improvement plans if needed']
              },
              {
                type: 'strength',
                title: 'Goal Achievement Rate',
                message: 'Excellent Goal Achievement: Your team achieved 78% of quarterly goals, exceeding company average of 65%.',
                description: 'Your team\'s goal completion rate of 78% significantly exceeds the company average (65%), indicating strong execution and effective goal-setting practices.',
                impact: 'medium',
                actionable: false,
                recommendations: ['Celebrate team wins in team meetings', 'Analyze what made successful goals work', 'Apply learnings to next quarter\'s planning', 'Consider sharing your team\'s approach in manager forums']
              },
              {
                type: 'opportunity',
                title: 'Feedback Culture Enhancement',
                message: 'Feedback Opportunity: Team feedback exchange rate could improve - currently 60% of team members actively give peer feedback.',
                description: 'Only 60% of your team actively participates in peer feedback. Increasing participation to 80%+ can improve collaboration, knowledge sharing, and team cohesion.',
                impact: 'medium',
                actionable: true,
                recommendations: ['Model feedback-giving behavior by publicly recognizing team members', 'Create structured feedback sessions (e.g., weekly kudos)', 'Gamify feedback with monthly recognition for most helpful feedback', 'Provide feedback training focusing on constructive delivery']
              },
              {
                type: 'insight',
                title: 'Team Engagement Trend',
                message: `Team Health Score: ${teamHealth.engagementScore}/100 indicates good overall team health and morale.`,
                description: `Your team\'s engagement score of ${teamHealth.engagementScore}/100 reflects positive team dynamics. Maintaining this requires consistent attention to work-life balance, growth opportunities, and open communication.`,
                impact: 'medium',
                actionable: true,
                recommendations: ['Continue regular 1-on-1s', 'Survey team quarterly on engagement factors', 'Address concerns proactively', 'Maintain transparent communication about team and company goals']
              },
              {
                type: 'opportunity',
                title: 'Review Cycle Completion',
                message: '3 performance reviews are pending completion. Timely reviews improve team morale and clarity.',
                description: 'Completing performance reviews on time shows respect for your team\'s development and provides crucial feedback they need to grow. Delayed reviews can negatively impact engagement.',
                impact: 'high',
                actionable: true,
                recommendations: ['Block calendar time this week to complete pending reviews', 'Gather 360 feedback before reviews', 'Prepare specific examples of achievements and growth areas', 'Schedule review discussions within 5 days of completion']
              }
            ],
            teamHealth: teamHealth,
            talentInsights: {
              highPotential: 2,
              flightRisk: teamHealth.atRisk || 0,
              promotionReady: 2,
              needsDevelopment: teamHealth.turnoverRisk || 2,
              topPerformers: Math.floor(teamHealth.highPerformers * 0.6) || 3,
              highPerformers: teamHealth.highPerformers || 3
            }
          };
          break;

        case 'team_health':
          const managerPermission = canAccessManagerFeatures(user);
          if (!managerPermission.allowed) {
            return NextResponse.json({ error: managerPermission.reason }, { status: 403 });
          }

          insights = getDemoTeamHealthByManagerId(user.id);
          break;

        case 'talent':
          if (user.role === 'hr') {
            insights = {
              // Root level metrics for HR page display
              totalEmployees: demoHRData.companyMetrics.totalEmployees,
              completedReviews: demoHRData.companyMetrics.completedReviews,
              pendingReviews: demoHRData.companyMetrics.pendingReviews,
              activeGoals: demoHRData.companyMetrics.activeGoals,
              // Nested data includes highPerformers, highPotential, flightRisk
              ...demoHRData.talentInsights,
              companyMetrics: demoHRData.companyMetrics,
              nineBoxMatrix: demoHRData.nineBoxMatrix,
              departmentBreakdown: demoHRData.departmentBreakdown,
              performanceDistribution: demoHRData.performanceDistribution
            };
          } else if (user.role === 'manager') {
            insights = {
              highPotential: 2,
              flightRisk: 1,
              promotionReady: 2,
              needsDevelopment: 2,
              topPerformers: 3,
              highPerformers: 3
            };
          } else {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
          }
          break;

        case 'flight_risk':
          insights = { risk: 'low', confidence: 75, factors: ['Strong performance', 'Regular feedback', 'Active development plan'] };
          break;

        default:
          insights = {
            insights: demoInsights,
            flightRisk: { risk: 'low', confidence: 75, factors: [] }
          };
      }

      return NextResponse.json(insights);
    }

    // PRODUCTION MODE: Use database analytics
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let insights: any = {};

    switch (type) {
      case 'employee':
        // Get insights for a specific employee
        const targetEmployeeId = employeeId ? parseInt(employeeId) : user.id;

        // Check permission
        if (targetEmployeeId !== user.id && user.role !== 'hr' && user.role !== 'manager') {
          return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        insights = {
          insights: generateEmployeeInsights(targetEmployeeId),
          flightRisk: await predictFlightRisk(targetEmployeeId)
        };
        break;

      case 'manager':
        // Get insights for a manager
        const permission = canAccessManagerFeatures(user);
        if (!permission.allowed) {
          return NextResponse.json({ error: permission.reason }, { status: 403 });
        }

        insights = {
          insights: generateManagerInsights(user.id),
          teamHealth: calculateTeamHealth(user.id),
          talentInsights: getTalentInsights(user.id)
        };
        break;

      case 'team_health':
        // Get team health metrics
        const managerPermission = canAccessManagerFeatures(user);
        if (!managerPermission.allowed) {
          return NextResponse.json({ error: managerPermission.reason }, { status: 403 });
        }

        insights = calculateTeamHealth(user.id);
        break;

      case 'talent':
        // Get talent insights (HR only for org-wide, managers for their team)
        if (user.role === 'hr') {
          insights = getTalentInsights();
        } else if (user.role === 'manager') {
          insights = getTalentInsights(user.id);
        } else {
          return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }
        break;

      case 'flight_risk':
        // Predict flight risk for an employee
        const empId = employeeId ? parseInt(employeeId) : user.id;

        // Check permission
        if (empId !== user.id && user.role !== 'hr' && user.role !== 'manager') {
          return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        insights = await predictFlightRisk(empId);
        break;

      default:
        // Default: return employee insights for current user
        insights = {
          insights: generateEmployeeInsights(user.id),
          flightRisk: await predictFlightRisk(user.id)
        };
    }

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
  }
}
