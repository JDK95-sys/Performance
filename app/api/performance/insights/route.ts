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

          insights = {
            insights: [
              {
                type: 'strength',
                title: 'Strong Team Performance',
                description: 'Your team is performing well with an average rating of 3.8/5.0, placing you in the top 25% of managers.',
                impact: 'high',
                actionable: true,
                recommendations: ['Continue current management practices', 'Recognize top performers publicly', 'Share best practices with peer managers']
              },
              {
                type: 'opportunity',
                title: 'Development Focus Needed',
                description: '2 team members show potential but need focused development plans to advance their careers.',
                impact: 'high',
                actionable: true,
                recommendations: ['Schedule career development discussions', 'Create personalized growth plans', 'Identify stretch assignments']
              },
              {
                type: 'alert',
                title: 'Flight Risk Detected',
                description: '1 high-performing team member may be at risk of leaving based on engagement patterns.',
                impact: 'high',
                actionable: true,
                recommendations: ['Schedule immediate 1-on-1 conversation', 'Review compensation and growth opportunities', 'Assess workload and job satisfaction']
              },
              {
                type: 'strength',
                title: 'Goal Achievement Rate',
                description: 'Your team achieved 78% of quarterly goals, exceeding company average of 65%.',
                impact: 'medium',
                actionable: false,
                recommendations: ['Celebrate team wins', 'Analyze what made successful goals work', 'Apply learnings to next quarter']
              },
              {
                type: 'opportunity',
                title: 'Feedback Participation',
                description: 'Team feedback exchange rate could improve. Only 60% of team members actively give peer feedback.',
                impact: 'medium',
                actionable: true,
                recommendations: ['Model feedback-giving behavior', 'Create structured feedback sessions', 'Recognize active feedback participants']
              }
            ],
            teamHealth: getDemoTeamHealthByManagerId(user.id),
            talentInsights: {
              highPotential: 5,
              flightRisk: 1,
              promotionReady: 3,
              needsDevelopment: 2,
              topPerformers: 4
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
              ...demoHRData.talentInsights,
              nineBoxMatrix: demoHRData.nineBoxMatrix
            };
          } else if (user.role === 'manager') {
            insights = {
              highPotential: 5,
              flightRisk: 1,
              promotionReady: 3,
              needsDevelopment: 2,
              topPerformers: 4
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
          flightRisk: predictFlightRisk(targetEmployeeId)
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

        insights = predictFlightRisk(empId);
        break;

      default:
        // Default: return employee insights for current user
        insights = {
          insights: generateEmployeeInsights(user.id),
          flightRisk: predictFlightRisk(user.id)
        };
    }

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
  }
}
