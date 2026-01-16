/**
 * Shared TypeScript Types for PerformPro
 * Eliminates 30+ usages of 'any' type across the codebase
 */

// ============================================
// USER & AUTHENTICATION
// ============================================

export type UserRole = 'employee' | 'manager' | 'hr' | 'candidate' | 'recruiter';
export type Potential = 'low' | 'medium' | 'high';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  title?: string;
  job_title?: string;
  manager_id?: number | null;
  skills?: string;
  experience_years?: number;
  years_experience?: number;
  bio?: string;
  location?: string;
  performance_rating?: number;
  potential?: Potential;
  created_at?: string;
  updated_at?: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// ============================================
// GOALS & KEY RESULTS
// ============================================

export type GoalStatus = 'not_started' | 'on_track' | 'at_risk' | 'off_track' | 'completed' | 'cancelled' | 'in_progress';
export type GoalType = 'okr' | 'smart' | 'development' | 'project' | 'performance' | 'strategic' | 'operational';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Visibility = 'private' | 'team' | 'department' | 'company' | 'manager' | 'public';

export interface KeyResult {
  id: number;
  goal_id: number;
  title: string;
  description?: string;
  metric_type: 'number' | 'percentage' | 'currency' | 'boolean';
  start_value: number;
  target_value: number;
  current_value: number;
  unit?: string;
  status: GoalStatus;
  created_at?: string;
  updated_at?: string;
}

export interface Goal {
  id: number;
  owner_id: number;
  owner_type: 'individual' | 'team' | 'company';
  title: string;
  description?: string;
  goal_type: GoalType;
  category: string;
  start_date?: string;
  due_date?: string;
  quarter?: string;
  status: GoalStatus;
  priority: Priority;
  visibility: Visibility;
  progress_percentage: number;
  weight?: number;
  created_by: number;
  created_at?: string;
  updated_at?: string;
  keyResults?: KeyResult[];
}

// ============================================
// FEEDBACK & REVIEWS
// ============================================

export type FeedbackType = 'positive' | 'constructive' | 'recognition' | 'coaching' | 'request';
export type ReviewStatus = 'not_started' | 'in_progress' | 'submitted' | 'acknowledged' | 'calibrated' | 'completed' | 'draft';
export type ReviewType = 'self' | 'manager' | 'peer' | '360' | 'probation' | 'annual';

export interface Feedback {
  id: number;
  from_user_id: number;
  to_user_id: number;
  feedback_type: FeedbackType;
  category: string;
  content: string;
  sentiment?: string;
  is_anonymous: boolean;
  acknowledged: boolean;
  created_at: string;
  from_user_name?: string;
  from_user_title?: string;
  to_user_name?: string;
  to_user_title?: string;
}

export interface PerformanceReview {
  id: number;
  employee_id: number;
  reviewer_id: number;
  cycle_name: string;
  review_type: ReviewType;
  period_start?: string;
  period_end?: string;
  overall_rating?: number;
  status: ReviewStatus;
  strengths?: string;
  areas_for_improvement?: string;
  goals_achieved?: string;
  development_plan?: string;
  manager_comments?: string;
  employee_comments?: string;
  submitted_at?: string;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
  manager_name?: string;
  employee_name?: string;
}

// ============================================
// INSIGHTS & ANALYTICS
// ============================================

export type InsightType = 'strength' | 'risk' | 'opportunity' | 'trend';
export type ImpactLevel = 'high' | 'medium' | 'low';

export interface Insight {
  type: InsightType;
  title: string;
  description: string;
  impact: ImpactLevel;
  recommendations?: string[];
  message?: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface FlightRisk {
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  factors: string[];
  recommendations: string[];
}

export interface TeamMember extends User {
  latestReview?: {
    rating: number;
    cycle_name?: string;
  };
  flightRisk?: FlightRisk;
  careerGoal?: {
    desiredRole?: string;
    timeframe?: string;
  };
}

export interface TeamHealth {
  overallScore: number;
  performance: number;
  engagement: number;
  retention: number;
  growth: number;
  diversity: number;
  collaboration: number;
}

export interface TalentInsights {
  highPerformers: number;
  highPotential: number;
  flightRisk: number;
  promotionReady?: number;
  needsDevelopment?: number;
}

// ============================================
// DEVELOPMENT & RECOGNITION
// ============================================

export type DevelopmentActionType = 'training' | 'project' | 'mentoring' | 'shadowing' | 'stretch_assignment' | 'reading';
export type ActionStatus = 'not_started' | 'in_progress' | 'completed' | 'cancelled';

export interface DevelopmentAction {
  id: number;
  plan_id: number;
  action_type: DevelopmentActionType;
  title: string;
  description?: string;
  target_date?: string;
  status: ActionStatus;
  progress_notes?: string;
  completed_at?: string;
  created_at?: string;
}

export interface DevelopmentPlan {
  id: number;
  employee_id: number;
  manager_id: number;
  plan_name: string;
  target_role?: string;
  target_date?: string;
  status: 'draft' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  overview?: string;
  created_at?: string;
  updated_at?: string;
  manager_name?: string;
  employee_name?: string;
  actions?: DevelopmentAction[];
}

export type RecognitionType = 'kudos' | 'award' | 'thank_you' | 'milestone';

export interface Recognition {
  id: number;
  from_user_id: number;
  to_user_id: number;
  recognition_type: RecognitionType;
  title: string;
  message: string;
  core_value?: string;
  visibility: Visibility;
  likes_count: number;
  created_at: string;
  from_user_name?: string;
  to_user_name?: string;
}

// ============================================
// API RESPONSES
// ============================================

export interface APIResponse<T = any> {
  success?: boolean;
  error?: string;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ============================================
// HR ANALYTICS
// ============================================

export interface DepartmentStats {
  department: string;
  count: number;
  avgRating: number;
  managersCount?: number;
  headcountGrowth?: number;
}

export interface LocationStats {
  location: string;
  count: number;
  avgRating: number;
}

export interface PerformanceDistribution {
  exceptional: number;
  exceeds: number;
  meets: number;
  developing: number;
  improvement: number;
}

export interface HRData {
  companyMetrics: {
    totalEmployees: number;
    averageRating: number;
    completedReviews: number;
    pendingReviews: number;
    averageTenure?: number;
    headcountGrowth?: string;
  };
  talentInsights: TalentInsights & {
    highPerformersHighPotential: number;
    atRisk: number;
    needsDevelopment: number;
    promotionReady: number;
    flightRisk: number;
  };
  departmentBreakdown: DepartmentStats[];
  locationBreakdown?: LocationStats[];
  performanceDistribution: PerformanceDistribution;
}

// ============================================
// FORM DATA TYPES
// ============================================

export interface LoginFormData {
  email: string;
  password?: string;
}

export interface GoalFormData {
  title: string;
  description?: string;
  goal_type: GoalType;
  category: string;
  due_date?: string;
  priority: Priority;
  visibility: Visibility;
  keyResults?: Array<{
    title: string;
    metric_type: string;
    target_value: number;
    unit?: string;
  }>;
}

export interface FeedbackFormData {
  to_user_id: number;
  feedback_type: FeedbackType;
  category: string;
  content: string;
  visibility?: Visibility;
  is_anonymous?: boolean;
}
