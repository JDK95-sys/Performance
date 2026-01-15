/**
 * Demo Data Store
 * In-memory data storage for demo/presentation mode
 * No database required!
 */

// Demo users
export const demoUsers = [
  {
    id: 1,
    email: 'john.smith@company.com',
    name: 'John Smith',
    role: 'employee',
    department: 'Engineering',
    title: 'Senior Software Engineer',
    experience_years: 5,
    bio: 'Experienced full-stack developer passionate about building scalable systems.'
  },
  {
    id: 2,
    email: 'manager@company.com',
    name: 'Sarah Johnson',
    role: 'manager',
    department: 'Engineering',
    title: 'Engineering Manager',
    experience_years: 8,
    bio: 'Leading high-performance engineering teams to deliver exceptional results.'
  },
  {
    id: 3,
    email: 'admin@company.com',
    name: 'HR Admin',
    role: 'hr',
    department: 'Human Resources',
    title: 'HR Director',
    experience_years: 10,
    bio: 'Strategic HR leadership focused on employee development and culture.'
  }
];

// Demo goals
export const demoGoals = [
  {
    id: 1,
    owner_id: 1,
    title: 'Improve Code Quality Metrics',
    description: 'Reduce technical debt and improve test coverage to 80%',
    goal_type: 'performance',
    category: 'technical',
    status: 'in_progress',
    priority: 'high',
    progress_percentage: 65,
    due_date: '2026-06-30',
    visibility: 'team',
    keyResults: [
      { id: 1, title: 'Increase test coverage to 80%', current_value: 65, target_value: 80, unit: '%' },
      { id: 2, title: 'Reduce code complexity', current_value: 12, target_value: 8, unit: 'points' }
    ]
  },
  {
    id: 2,
    owner_id: 1,
    title: 'Learn AI/ML Fundamentals',
    description: 'Complete online courses and build practical ML projects',
    goal_type: 'development',
    category: 'professional',
    status: 'in_progress',
    priority: 'medium',
    progress_percentage: 40,
    due_date: '2026-12-31',
    visibility: 'private',
    keyResults: []
  }
];

// Demo feedback
export const demoFeedback = [
  {
    id: 1,
    from_user_id: 2,
    from_user_name: 'Sarah Johnson',
    to_user_id: 1,
    feedback_type: 'praise',
    category: 'technical',
    content: 'Excellent work on the API optimization project. Your solution reduced response time by 40% and showed great problem-solving skills.',
    sentiment: 'positive',
    created_at: '2026-01-10T10:00:00Z',
    acknowledged: true
  },
  {
    id: 2,
    from_user_id: 2,
    from_user_name: 'Sarah Johnson',
    to_user_id: 1,
    feedback_type: 'constructive',
    category: 'communication',
    content: 'Consider providing more detailed documentation for your code. This will help the team understand complex logic better.',
    sentiment: 'neutral',
    created_at: '2026-01-12T14:30:00Z',
    acknowledged: false
  }
];

// Demo reviews
export const demoReviews = [
  {
    id: 1,
    employee_id: 1,
    reviewer_id: 2,
    manager_name: 'Sarah Johnson',
    cycle_name: 'Q4 2025',
    review_type: 'quarterly',
    overall_rating: 4.2,
    status: 'completed',
    strengths: 'Strong technical skills, proactive problem solver',
    areas_for_improvement: 'Documentation and communication with stakeholders',
    completed_at: '2025-12-15T00:00:00Z'
  }
];

// Demo insights
export const demoInsights = [
  {
    type: 'strength',
    title: 'Technical Excellence',
    description: 'Your technical contributions have been exceptional this quarter. You delivered 3 major features ahead of schedule.',
    impact: 'high',
    recommendations: ['Consider mentoring junior developers', 'Document best practices for the team']
  },
  {
    type: 'opportunity',
    title: 'Leadership Potential',
    description: 'You demonstrate strong leadership qualities in team discussions and code reviews.',
    impact: 'medium',
    recommendations: ['Take on a tech lead role for the next project', 'Present at team knowledge sharing sessions']
  }
];

// Manager-specific demo data
export const demoTeamData = {
  teamHealth: {
    overallScore: 82,
    engagement: 85,
    performance: 88,
    satisfaction: 79
  },
  teamMembers: [
    { id: 1, name: 'John Smith', performance: 4.2, potential: 'high', status: 'active' },
    { id: 4, name: 'Emily Chen', performance: 4.5, potential: 'high', status: 'active' },
    { id: 5, name: 'Michael Brown', performance: 3.8, potential: 'medium', status: 'active' }
  ],
  talentInsights: {
    highPerformersHighPotential: 2,
    atRisk: 0,
    needsDevelopment: 1
  }
};

// HR-specific demo data
export const demoHRData = {
  companyMetrics: {
    totalEmployees: 14250,
    averageRating: 4.1,
    completedReviews: 13800,
    pendingReviews: 450
  },
  talentInsights: {
    highPerformersHighPotential: 850,
    atRisk: 125,
    needsDevelopment: 2100
  },
  departmentBreakdown: [
    { department: 'Engineering', count: 4200, avgRating: 4.2 },
    { department: 'Product', count: 1800, avgRating: 4.0 },
    { department: 'Sales', count: 3500, avgRating: 4.1 },
    { department: 'Marketing', count: 1600, avgRating: 4.0 }
  ]
};

// Helper functions
export function getDemoUserByEmail(email: string) {
  return demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function getDemoGoalsByUserId(userId: number) {
  return demoGoals.filter(g => g.owner_id === userId);
}

export function getDemoFeedbackByUserId(userId: number) {
  return demoFeedback.filter(f => f.to_user_id === userId);
}

export function getDemoReviewsByUserId(userId: number) {
  return demoReviews.filter(r => r.employee_id === userId);
}

export function isDemoMode() {
  // Demo mode when no database is configured
  const isDemo = !process.env.POSTGRES_URL && !process.env.DATABASE_PATH;
  if (typeof window === 'undefined') {
    console.log('isDemoMode check - POSTGRES_URL:', !!process.env.POSTGRES_URL, 'DATABASE_PATH:', !!process.env.DATABASE_PATH, 'Result:', isDemo);
  }
  return isDemo;
}
