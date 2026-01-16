import { db } from './db';
import { getFlightRiskPredictor, getPerformanceTrendAnalyzer, getChurnPredictor } from './ml-models';

/**
 * AI-Powered Performance Analytics
 * Inspired by Eightfold.ai and CultureAmp
 * Phase 2: Enhanced with TensorFlow ML models
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
 * Predict flight risk using TensorFlow ML model
 * Phase 2: Enhanced with ML-based prediction
 */
export async function predictFlightRisk(employeeId: number): Promise<{
  risk: 'low' | 'medium' | 'high';
  confidence: number;
  factors: string[];
}> {
  // Get employee data
  const employee = db.prepare(`
    SELECT u.*, tm.performance_rating, tm.potential_rating, pr.overall_rating
    FROM users u
    LEFT JOIN talent_matrix tm ON u.id = tm.employee_id
    LEFT JOIN pm_reviews pr ON u.id = pr.employee_id
    WHERE u.id = ?
    LIMIT 1
  `).get(employeeId) as any;

  if (!employee) {
    return { risk: 'low', confidence: 0, factors: [] };
  }

  // Gather features for ML model
  const feedbackCount = db.prepare(`
    SELECT COUNT(*) as count FROM feedback
    WHERE to_user_id = ? AND created_at > date('now', '-90 days')
  `).get(employeeId) as any;

  const oneOnOneCount = db.prepare(`
    SELECT COUNT(*) as count FROM one_on_ones
    WHERE employee_id = ? AND scheduled_date > date('now', '-60 days')
  `).get(employeeId) as any;

  const atRiskGoals = db.prepare(`
    SELECT COUNT(*) as count FROM goals
    WHERE owner_id = ? AND status = 'at_risk'
  `).get(employeeId) as any;

  const devPlan = db.prepare(
    'SELECT * FROM development_plans WHERE employee_id = ? AND status = "active"'
  ).get(employeeId);

  // Check promotion readiness
  const review = db.prepare(`
    SELECT promotion_readiness FROM pm_reviews WHERE employee_id = ? LIMIT 1
  `).get(employeeId) as any;

  const promotionScore = review?.promotion_readiness === 'ready_now' ? 1.0 :
                         review?.promotion_readiness === 'ready_6_months' ? 0.7 :
                         review?.promotion_readiness === 'ready_12_months' ? 0.4 : 0.0;

  // Prepare features: [performanceRating, potentialRating, yearsExperience,
  //                    feedbackCount, oneOnOneCount, goalsAtRisk, hasDevPlan, promotionReadiness]
  const features = [
    employee.performance_rating || 3.0,
    employee.potential_rating || 3.0,
    employee.years_experience || 0,
    feedbackCount.count || 0,
    oneOnOneCount.count || 0,
    atRiskGoals.count || 0,
    devPlan ? 1 : 0,
    promotionScore
  ];

  try {
    // Use TensorFlow ML model for prediction
    const predictor = await getFlightRiskPredictor();
    const prediction = await predictor.predict(features);
    return prediction;
  } catch (error) {
    console.error('Error using ML model for flight risk prediction:', error);
    
    // Fallback to heuristic-based prediction
    const factors: string[] = [];
    let riskScore = 0;

    if (employee.performance_rating >= 4.0 && !devPlan) {
      riskScore += 25;
      factors.push('High performer without active development plan');
    }
    if (employee.years_experience >= 5) {
      riskScore += 15;
      factors.push('Experienced employee - review growth trajectory');
    }
    if (feedbackCount.count < 3) {
      riskScore += 10;
      factors.push('Limited recent feedback and recognition');
    }
    if (oneOnOneCount.count < 2) {
      riskScore += 15;
      factors.push('Infrequent manager check-ins');
    }
    if (atRiskGoals.count > 0) {
      riskScore += 10;
      factors.push('Goals at risk - may indicate blockers or lack of support');
    }

    const risk = riskScore >= 50 ? 'high' : riskScore >= 30 ? 'medium' : 'low';
    const confidence = Math.min(riskScore, 100);

    return { risk, confidence, factors };
  }
}

/**
 * Analyze performance trends using TensorFlow ML model
 * Phase 2: New ML-based trend analysis
 */
export async function analyzePerformanceTrend(employeeId: number): Promise<{
  trend: 'improving' | 'stable' | 'declining';
  predictedRating: number;
  confidence: number;
  insights: string[];
}> {
  // Get historical performance ratings
  const historicalRatings = db.prepare(`
    SELECT overall_rating FROM pm_reviews
    WHERE employee_id = ?
    ORDER BY created_at DESC
    LIMIT 5
  `).all(employeeId) as any[];

  const ratings = historicalRatings.map(r => r.overall_rating || 3.0);

  // Get current metrics
  const goalCompletion = getGoalCompletionRate(employeeId);
  
  const feedbackScore = db.prepare(`
    SELECT AVG(CASE 
      WHEN feedback_type = 'positive' THEN 4.5
      WHEN feedback_type = 'constructive' THEN 3.5
      ELSE 3.0
    END) as avg_score
    FROM feedback
    WHERE to_user_id = ? AND created_at > date('now', '-90 days')
  `).get(employeeId) as any;

  const oneOnOneFreq = db.prepare(`
    SELECT COUNT(*) as count FROM one_on_ones
    WHERE employee_id = ? AND scheduled_date > date('now', '-60 days')
  `).get(employeeId) as any;

  // Simulate additional metrics (in production, these would come from actual data)
  const skillGrowth = 3.5 + Math.random();
  const projectImpact = 3.5 + Math.random();
  const teamCollaboration = 3.5 + Math.random();

  const features = [
    goalCompletion,
    feedbackScore?.avg_score || 3.5,
    oneOnOneFreq.count || 0,
    skillGrowth,
    projectImpact,
    teamCollaboration
  ];

  try {
    const analyzer = await getPerformanceTrendAnalyzer();
    return await analyzer.analyzeTrend(ratings, features);
  } catch (error) {
    console.error('Error using ML model for trend analysis:', error);
    
    // Fallback to simple trend calculation
    const recentAvg = ratings.slice(0, 2).reduce((a, b) => a + b, 0) / Math.min(ratings.length, 2);
    const previousAvg = ratings.slice(2).reduce((a, b) => a + b, 0) / Math.max(ratings.length - 2, 1);
    
    let trend: 'improving' | 'stable' | 'declining';
    if (recentAvg > previousAvg + 0.3) {
      trend = 'improving';
    } else if (recentAvg < previousAvg - 0.3) {
      trend = 'declining';
    } else {
      trend = 'stable';
    }

    return {
      trend,
      predictedRating: recentAvg,
      confidence: 60,
      insights: [`Performance trend: ${trend}`]
    };
  }
}

/**
 * Predict employee churn using TensorFlow ML model
 * Phase 2: New ML-based churn prediction
 */
export async function predictChurn(employeeId: number): Promise<{
  churnProbability: number;
  risk: 'low' | 'medium' | 'high';
  recommendations: string[];
}> {
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
    return { churnProbability: 0, risk: 'low', recommendations: [] };
  }

  // Simulate features (in production, these would come from actual data)
  const satisfactionScore = 3 + Math.random() * 2; // 3-5
  const promotionHistory = Math.floor(Math.random() * 3);
  const compensationLevel = 5 + Math.random() * 5; // 5-10
  const workLifeBalance = 3 + Math.random() * 2; // 3-5
  const managerRating = 3 + Math.random() * 2; // 3-5
  const peerFeedbackScore = 3 + Math.random() * 2; // 3-5
  const trainingHours = Math.random() * 60;
  const careerGrowthScore = 3 + Math.random() * 2; // 3-5

  const features = [
    employee.performance_rating || 3.0,
    satisfactionScore,
    employee.years_experience || 0,
    promotionHistory,
    compensationLevel,
    workLifeBalance,
    managerRating,
    peerFeedbackScore,
    trainingHours,
    careerGrowthScore
  ];

  try {
    const predictor = await getChurnPredictor();
    return await predictor.predictChurn(features);
  } catch (error) {
    console.error('Error using ML model for churn prediction:', error);
    
    // Fallback to simple calculation
    let churnProb = 30;
    const recommendations: string[] = [];

    if (employee.years_experience >= 5 && promotionHistory === 0) {
      churnProb += 20;
      recommendations.push('Review promotion opportunities');
    }
    if (employee.performance_rating >= 4.0) {
      churnProb -= 10;
    }

    const risk = churnProb >= 70 ? 'high' : churnProb >= 40 ? 'medium' : 'low';

    return {
      churnProbability: churnProb,
      risk,
      recommendations: recommendations.length > 0 ? recommendations : ['Continue current practices']
    };
  }
}
