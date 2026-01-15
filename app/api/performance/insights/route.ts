import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, canAccessManagerFeatures } from '@/lib/auth';
import {
  calculateTeamHealth,
  getTalentInsights,
  generateEmployeeInsights,
  generateManagerInsights,
  predictFlightRisk
} from '@/lib/analytics';
import { isDemoMode, demoInsights, demoTeamData, demoHRData } from '@/lib/demo-data';

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

  // DEMO MODE: Return demo insights
  if (isDemoMode()) {
    console.log('[INSIGHTS] Demo mode active, type:', type, 'user role:', user.role);
    let insights: any = {};

    switch (type) {
      case 'employee':
        const targetId = employeeId ? parseInt(employeeId) : user.id;
        insights = { insights: demoInsights }; // Return all insights for demo
        break;
      case 'manager':
        insights = {
          insights: demoInsights,
          teamHealth: demoTeamData.teamHealth,
          talentInsights: demoTeamData.talentInsights
        };
        break;
      case 'team_health':
        insights = demoTeamData.teamHealth;
        break;
      case 'talent':
        insights = user.role === 'hr' ? demoHRData.talentInsights : demoTeamData.talentInsights;
        break;
      default:
        // Default based on role
        if (user.role === 'manager') {
          insights = {
            insights: demoInsights,
            teamHealth: demoTeamData.teamHealth,
            talentInsights: demoTeamData.talentInsights
          };
        } else if (user.role === 'hr') {
          insights = {
            insights: demoInsights,
            companyMetrics: demoHRData.companyMetrics,
            talentInsights: demoHRData.talentInsights,
            departmentBreakdown: demoHRData.departmentBreakdown
          };
        } else {
          insights = { insights: demoInsights };
        }
    }

    return NextResponse.json(insights);
  }

  try {
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
