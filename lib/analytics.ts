import { db } from './db';

/**
 * AI-Powered Performance Analytics
 * Inspired by Eightfold.ai and CultureAmp
 */

export interface PerformanceInsight {
  type: 'strength' | 'risk' | 'opportunity' | 'trend';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  recommendations?: string[];
}

export interface TeamHealthMetrics {
  overallScore: number;
  engagementScore: number;
  performanceScore: number;
  retentionRisk: number;
  growthPotential: number;
  diversityScore: number;
}

export interface TalentInsights {
  highPotential: number;
  flightRisk: number;
  promotionReady: number;
  needsDevelopment: number;
  topPerformers: number;
}

/**
 * Calculate team health metrics for a manager
 */
export function calculateTeamHealth(managerId: number): TeamHealthMetrics {
  // Get all team members
  const teamMembers = db.prepare(`
    SELECT u.*, tm.performance_rating, tm.potential_rating, tm.flight_risk
    FROM users u
    LEFT JOIN talent_matrix tm ON u.id = tm.employee_id
    WHERE u.manager_id = ?
  `).all(managerId) as any[];

  if (teamMembers.length === 0) {
    return {
      overallScore: 0,
      engagementScore: 0,
      performanceScore: 0,
      retentionRisk: 0,
      growthPotential: 0,
      diversityScore: 0,
    };
  }

  // Calculate performance score (average rating * 20 to get 0-100 scale)
  const performanceRatings = teamMembers
    .filter(m => m.performance_rating)
    .map(m => m.performance_rating);
  const performanceScore = performanceRatings.length > 0
    ? (performanceRatings.reduce((a, b) => a + b, 0) / performanceRatings.length) * 20
    : 0;

  // Calculate growth potential
  const potentialRatings = teamMembers
    .filter(m => m.potential_rating)
    .map(m => m.potential_rating);
  const growthPotential = potentialRatings.length > 0
    ? (potentialRatings.reduce((a, b) => a + b, 0) / potentialRatings.length) * 20
    : 0;

  // Calculate retention risk
  const flightRisks = teamMembers.filter(m => m.flight_risk);
  const highRiskCount = flightRisks.filter(m => m.flight_risk === 'high').length;
  const mediumRiskCount = flightRisks.filter(m => m.flight_risk === 'medium').length;
  const retentionRisk = ((highRiskCount * 3 + mediumRiskCount * 1.5) / teamMembers.length) * 10;

  // Simulated engagement score (in production, use survey data)
  const engagementScore = 75 + Math.random() * 15;

  // Simulated diversity score
  const diversityScore = 70 + Math.random() * 20;

  // Overall score
  const overallScore = (
    performanceScore * 0.3 +
    engagementScore * 0.25 +
    (100 - retentionRisk) * 0.25 +
    growthPotential * 0.2
  );

  return {
    overallScore: Math.round(overallScore),
    engagementScore: Math.round(engagementScore),
    performanceScore: Math.round(performanceScore),
    retentionRisk: Math.round(retentionRisk),
    growthPotential: Math.round(growthPotential),
    diversityScore: Math.round(diversityScore),
  };
}

/**
 * Get talent insights for a manager or HR
 */
export function getTalentInsights(managerId?: number): TalentInsights {
  let query = `
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN potential_rating >= 4 THEN 1 ELSE 0 END) as highPotential,
      SUM(CASE WHEN flight_risk = 'high' THEN 1 ELSE 0 END) as flightRisk,
      SUM(CASE WHEN succession_ready = 1 THEN 1 ELSE 0 END) as promotionReady,
      SUM(CASE WHEN development_priority = 'high' THEN 1 ELSE 0 END) as needsDevelopment,
      SUM(CASE WHEN performance_rating >= 4.5 THEN 1 ELSE 0 END) as topPerformers
    FROM talent_matrix tm
    JOIN users u ON tm.employee_id = u.id
  `;

  const params: any[] = [];
  if (managerId) {
    query += ' WHERE u.manager_id = ?';
    params.push(managerId);
  }

  const result = db.prepare(query).get(...params) as any;

  return {
    highPotential: result.highPotential || 0,
    flightRisk: result.flightRisk || 0,
    promotionReady: result.promotionReady || 0,
    needsDevelopment: result.needsDevelopment || 0,
    topPerformers: result.topPerformers || 0,
  };
}

/**
 * Generate AI-powered insights for an employee
 */
export function generateEmployeeInsights(employeeId: number): PerformanceInsight[] {
  const insights: PerformanceInsight[] = [];

  // Get employee data
  const employee = db.prepare(`
    SELECT u.*, tm.performance_rating, tm.potential_rating, tm.flight_risk, tm.development_priority,
           pr.overall_rating, pr.promotion_readiness
    FROM users u
    LEFT JOIN talent_matrix tm ON u.id = tm.employee_id
    LEFT JOIN pm_reviews pr ON u.id = pr.employee_id
    WHERE u.id = ?
    LIMIT 1
  `).get(employeeId) as any;

  if (!employee) return insights;

  // Check performance trend
  if (employee.performance_rating >= 4.5) {
    insights.push({
      type: 'strength',
      title: 'Top Performer',
      description: `${employee.name} is a top performer with a rating of ${employee.performance_rating}/5. Consider for stretch assignments or leadership opportunities.`,
      impact: 'high',
      actionable: true,
      recommendations: [
        'Assign high-visibility projects',
        'Include in leadership development programs',
        'Consider for promotion within 6-12 months'
      ]
    });
  }

  // Check flight risk
  if (employee.flight_risk === 'high') {
    insights.push({
      type: 'risk',
      title: 'High Flight Risk',
      description: `${employee.name} has been identified as high flight risk. Immediate action recommended to improve retention.`,
      impact: 'high',
      actionable: true,
      recommendations: [
        'Schedule 1-on-1 to understand concerns',
        'Review compensation and growth opportunities',
        'Create personalized retention plan',
        'Ensure meaningful work assignments'
      ]
    });
  }

  // Check promotion readiness
  if (employee.promotion_readiness === 'ready_now' || employee.promotion_readiness === 'ready_6_months') {
    insights.push({
      type: 'opportunity',
      title: 'Promotion Ready',
      description: `${employee.name} is ready for the next level. Consider promotion or expanded responsibilities.`,
      impact: 'high',
      actionable: true,
      recommendations: [
        'Identify open positions matching career goals',
        'Discuss promotion timeline',
        'Provide leadership opportunities'
      ]
    });
  }

  // Check goals progress
  const goals = db.prepare(`
    SELECT * FROM goals WHERE owner_id = ? AND status = 'at_risk'
  `).all(employeeId) as any[];

  if (goals.length > 0) {
    insights.push({
      type: 'risk',
      title: 'Goals At Risk',
      description: `${goals.length} goal(s) are at risk of not being completed on time.`,
      impact: 'medium',
      actionable: true,
      recommendations: [
        'Review blockers in next 1-on-1',
        'Assess if additional resources needed',
        'Consider adjusting timelines or scope'
      ]
    });
  }

  // Check feedback activity
  const recentFeedback = db.prepare(`
    SELECT COUNT(*) as count FROM feedback
    WHERE to_user_id = ? AND created_at > date('now', '-30 days')
  `).get(employeeId) as any;

  if (recentFeedback.count === 0) {
    insights.push({
      type: 'opportunity',
      title: 'Limited Recent Feedback',
      description: `No feedback received in the last 30 days. Regular feedback helps with growth and development.`,
      impact: 'medium',
      actionable: true,
      recommendations: [
        'Request feedback from peers and manager',
        'Schedule regular check-ins',
        'Set up feedback channels'
      ]
    });
  }

  // Check development plan
  const devPlan = db.prepare(`
    SELECT * FROM development_plans WHERE employee_id = ? AND status = 'active'
  `).get(employeeId) as any;

  if (!devPlan && employee.potential_rating >= 4) {
    insights.push({
      type: 'opportunity',
      title: 'High Potential Without Development Plan',
      description: `${employee.name} has high potential but no active development plan. Creating a structured growth plan could accelerate career progression.`,
      impact: 'high',
      actionable: true,
      recommendations: [
        'Create personalized development plan',
        'Identify skill gaps and training needs',
        'Set career progression milestones'
      ]
    });
  }

  return insights;
}

/**
 * Generate AI-powered insights for a manager
 */
export function generateManagerInsights(managerId: number): PerformanceInsight[] {
  const insights: PerformanceInsight[] = [];

  // Get team data
  const teamMembers = db.prepare(`
    SELECT u.*, tm.performance_rating, tm.flight_risk
    FROM users u
    LEFT JOIN talent_matrix tm ON u.id = tm.employee_id
    WHERE u.manager_id = ?
  `).all(managerId) as any[];

  if (teamMembers.length === 0) return insights;

  // Check for flight risk concentration
  const highRiskMembers = teamMembers.filter(m => m.flight_risk === 'high');
  if (highRiskMembers.length > 0) {
    insights.push({
      type: 'risk',
      title: 'Team Retention Risk',
      description: `${highRiskMembers.length} team member(s) identified as high flight risk. Urgent attention needed.`,
      impact: 'high',
      actionable: true,
      recommendations: [
        'Conduct skip-level interviews',
        'Review team engagement and workload',
        'Create individual retention plans',
        'Address systemic team issues'
      ]
    });
  }

  // Check for 1-on-1 frequency
  const oneOnOnes = db.prepare(`
    SELECT COUNT(*) as count FROM one_on_ones
    WHERE manager_id = ? AND scheduled_date > date('now', '-30 days')
  `).get(managerId) as any;

  const expectedOneOnOnes = teamMembers.length * 2; // Bi-weekly
  if (oneOnOnes.count < expectedOneOnOnes * 0.7) {
    insights.push({
      type: 'opportunity',
      title: '1-on-1 Cadence Below Target',
      description: `Regular 1-on-1s are below recommended frequency. Consistent check-ins improve engagement and performance.`,
      impact: 'medium',
      actionable: true,
      recommendations: [
        'Schedule recurring bi-weekly 1-on-1s',
        'Use structured agenda templates',
        'Track action items and follow-up'
      ]
    });
  }

  // Check for feedback culture
  const teamFeedback = db.prepare(`
    SELECT COUNT(*) as count FROM feedback
    WHERE from_user_id IN (SELECT id FROM users WHERE manager_id = ?)
    AND created_at > date('now', '-30 days')
  `).get(managerId) as any;

  if (teamFeedback.count < teamMembers.length * 2) {
    insights.push({
      type: 'opportunity',
      title: 'Low Feedback Activity',
      description: `Team feedback exchange is below optimal levels. Fostering a feedback culture drives continuous improvement.`,
      impact: 'medium',
      actionable: true,
      recommendations: [
        'Model giving regular feedback',
        'Encourage peer-to-peer recognition',
        'Create psychologically safe environment'
      ]
    });
  }

  // Check for performance distribution
  const performanceRatings = teamMembers
    .filter(m => m.performance_rating)
    .map(m => m.performance_rating);

  if (performanceRatings.length > 3) {
    const avg = performanceRatings.reduce((a, b) => a + b, 0) / performanceRatings.length;
    const variance = performanceRatings.reduce((sum, rating) => sum + Math.pow(rating - avg, 2), 0) / performanceRatings.length;

    if (variance < 0.2) {
      insights.push({
        type: 'trend',
        title: 'Low Performance Variance',
        description: `Team ratings show limited differentiation. Consider calibrating to ensure accurate performance assessment.`,
        impact: 'medium',
        actionable: true,
        recommendations: [
          'Review rating distribution with HR',
          'Ensure clear performance standards',
          'Differentiate top performers from others'
        ]
      });
    }
  }

  return insights;
}

/**
 * Calculate 9-box position
 */
export function calculate9BoxPosition(performance: number, potential: number): number {
  // Map performance and potential (1-5) to 9-box position (1-9)
  // Box numbering:
  // 7 8 9  (High Potential)
  // 4 5 6  (Medium Potential)
  // 1 2 3  (Low Potential)

  const perfBucket = performance <= 2.5 ? 0 : performance <= 3.5 ? 1 : 2;
  const potBucket = potential <= 2 ? 0 : potential <= 3 ? 1 : 2;

  return perfBucket + potBucket * 3 + 1;
}

/**
 * Get performance distribution for calibration
 */
export function getPerformanceDistribution(department?: string): {
  rating: number;
  count: number;
  percentage: number;
}[] {
  let query = `
    SELECT overall_rating, COUNT(*) as count
    FROM pm_reviews pr
    JOIN users u ON pr.employee_id = u.id
    WHERE overall_rating IS NOT NULL
  `;

  const params: any[] = [];
  if (department) {
    query += ' AND u.department = ?';
    params.push(department);
  }

  query += ' GROUP BY CAST(overall_rating AS INTEGER)';

  const results = db.prepare(query).all(...params) as any[];
  const total = results.reduce((sum, r) => sum + r.count, 0);

  return results.map(r => ({
    rating: Math.floor(r.overall_rating),
    count: r.count,
    percentage: total > 0 ? Math.round((r.count / total) * 100) : 0
  }));
}

/**
 * Calculate engagement score from survey responses
 */
export function calculateEngagementScore(surveyId?: number): number {
  let query = `
    SELECT AVG(response_score) as avg_score
    FROM survey_responses
    WHERE response_score IS NOT NULL
  `;

  const params: any[] = [];
  if (surveyId) {
    query += ' AND survey_id = ?';
    params.push(surveyId);
  }

  const result = db.prepare(query).get(...params) as any;
  return result.avg_score ? Math.round((result.avg_score / 5) * 100) : 0;
}

/**
 * Get goal completion rate
 */
export function getGoalCompletionRate(userId?: number, quarter?: string): number {
  let query = `
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
    FROM goals
    WHERE 1=1
  `;

  const params: any[] = [];
  if (userId) {
    query += ' AND owner_id = ?';
    params.push(userId);
  }
  if (quarter) {
    query += ' AND quarter = ?';
    params.push(quarter);
  }

  const result = db.prepare(query).get(...params) as any;
  return result.total > 0 ? Math.round((result.completed / result.total) * 100) : 0;
}

/**
 * Predict flight risk using simple heuristics (in production, use ML model)
 */
export function predictFlightRisk(employeeId: number): {
  risk: 'low' | 'medium' | 'high';
  confidence: number;
  factors: string[];
} {
  const factors: string[] = [];
  let riskScore = 0;

  // Get employee data
  const employee = db.prepare(`
    SELECT u.*, tm.performance_rating, pr.overall_rating
    FROM users u
    LEFT JOIN talent_matrix tm ON u.id = tm.employee_id
    LEFT JOIN pm_reviews pr ON u.id = pr.employee_id
    WHERE u.id = ?
    LIMIT 1
  `).get(employeeId) as any;

  if (!employee) {
    return { risk: 'low', confidence: 0, factors: [] };
  }

  // Factor 1: High performer without growth opportunities
  if (employee.performance_rating >= 4.0) {
    const devPlan = db.prepare('SELECT * FROM development_plans WHERE employee_id = ? AND status = "active"').get(employeeId);
    if (!devPlan) {
      riskScore += 25;
      factors.push('High performer without active development plan');
    }
  }

  // Factor 2: Long time without promotion (simulated)
  if (employee.years_experience >= 5) {
    riskScore += 15;
    factors.push('Experienced employee - review growth trajectory');
  }

  // Factor 3: Low feedback activity
  const feedbackCount = db.prepare(`
    SELECT COUNT(*) as count FROM feedback
    WHERE to_user_id = ? AND created_at > date('now', '-90 days')
  `).get(employeeId) as any;

  if (feedbackCount.count < 3) {
    riskScore += 10;
    factors.push('Limited recent feedback and recognition');
  }

  // Factor 4: Infrequent 1-on-1s
  const oneOnOneCount = db.prepare(`
    SELECT COUNT(*) as count FROM one_on_ones
    WHERE employee_id = ? AND scheduled_date > date('now', '-60 days')
  `).get(employeeId) as any;

  if (oneOnOneCount.count < 2) {
    riskScore += 15;
    factors.push('Infrequent manager check-ins');
  }

  // Factor 5: Goals at risk
  const atRiskGoals = db.prepare(`
    SELECT COUNT(*) as count FROM goals
    WHERE owner_id = ? AND status = 'at_risk'
  `).get(employeeId) as any;

  if (atRiskGoals.count > 0) {
    riskScore += 10;
    factors.push('Goals at risk - may indicate blockers or lack of support');
  }

  // Determine risk level
  const risk = riskScore >= 50 ? 'high' : riskScore >= 30 ? 'medium' : 'low';
  const confidence = Math.min(riskScore, 100);

  return { risk, confidence, factors };
}
