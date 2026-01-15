/**
 * Demo Data Store
 * In-memory data storage for demo/presentation mode
 * No database required!
 */

// Demo users - 50 employees across different departments
export const demoUsers = [
  // Login users
  {
    id: 1,
    email: 'john.smith@company.com',
    name: 'John Smith',
    role: 'employee',
    department: 'Engineering',
    title: 'Senior Software Engineer',
    experience_years: 5,
    bio: 'Experienced full-stack developer passionate about building scalable systems.',
    manager_id: 2,
    performance_rating: 4.2
  },
  {
    id: 2,
    email: 'manager@company.com',
    name: 'Sarah Johnson',
    role: 'manager',
    department: 'Engineering',
    title: 'Engineering Manager',
    experience_years: 8,
    bio: 'Leading high-performance engineering teams to deliver exceptional results.',
    manager_id: null,
    performance_rating: 4.5
  },
  {
    id: 3,
    email: 'admin@company.com',
    name: 'HR Admin',
    role: 'hr',
    department: 'Human Resources',
    title: 'HR Director',
    experience_years: 10,
    bio: 'Strategic HR leadership focused on employee development and culture.',
    manager_id: null,
    performance_rating: 4.8
  },
  
  // Engineering Team (20 employees)
  { id: 4, email: 'emily.chen@company.com', name: 'Emily Chen', role: 'employee', department: 'Engineering', title: 'Software Engineer', experience_years: 3, manager_id: 2, performance_rating: 4.5 },
  { id: 5, email: 'michael.brown@company.com', name: 'Michael Brown', role: 'employee', department: 'Engineering', title: 'Software Engineer', experience_years: 2, manager_id: 2, performance_rating: 3.8 },
  { id: 6, email: 'david.martinez@company.com', name: 'David Martinez', role: 'employee', department: 'Engineering', title: 'Senior Software Engineer', experience_years: 6, manager_id: 2, performance_rating: 4.3 },
  { id: 7, email: 'jennifer.lee@company.com', name: 'Jennifer Lee', role: 'employee', department: 'Engineering', title: 'Principal Engineer', experience_years: 10, manager_id: 2, performance_rating: 4.7 },
  { id: 8, email: 'robert.garcia@company.com', name: 'Robert Garcia', role: 'employee', department: 'Engineering', title: 'Software Engineer', experience_years: 4, manager_id: 2, performance_rating: 4.0 },
  { id: 9, email: 'lisa.anderson@company.com', name: 'Lisa Anderson', role: 'employee', department: 'Engineering', title: 'QA Engineer', experience_years: 5, manager_id: 2, performance_rating: 4.2 },
  { id: 10, email: 'james.wilson@company.com', name: 'James Wilson', role: 'employee', department: 'Engineering', title: 'DevOps Engineer', experience_years: 7, manager_id: 2, performance_rating: 4.4 },
  { id: 11, email: 'maria.rodriguez@company.com', name: 'Maria Rodriguez', role: 'employee', department: 'Engineering', title: 'Frontend Developer', experience_years: 3, manager_id: 2, performance_rating: 4.1 },
  { id: 12, email: 'william.taylor@company.com', name: 'William Taylor', role: 'employee', department: 'Engineering', title: 'Backend Developer', experience_years: 5, manager_id: 2, performance_rating: 4.3 },
  { id: 13, email: 'patricia.thomas@company.com', name: 'Patricia Thomas', role: 'employee', department: 'Engineering', title: 'Software Engineer', experience_years: 2, manager_id: 2, performance_rating: 3.9 },
  { id: 14, email: 'christopher.moore@company.com', name: 'Christopher Moore', role: 'employee', department: 'Engineering', title: 'Senior Software Engineer', experience_years: 8, manager_id: 2, performance_rating: 4.6 },
  { id: 15, email: 'jessica.jackson@company.com', name: 'Jessica Jackson', role: 'employee', department: 'Engineering', title: 'Software Engineer', experience_years: 4, manager_id: 2, performance_rating: 4.0 },
  { id: 16, email: 'daniel.white@company.com', name: 'Daniel White', role: 'employee', department: 'Engineering', title: 'Data Engineer', experience_years: 6, manager_id: 2, performance_rating: 4.4 },
  { id: 17, email: 'nancy.harris@company.com', name: 'Nancy Harris', role: 'employee', department: 'Engineering', title: 'Mobile Developer', experience_years: 5, manager_id: 2, performance_rating: 4.2 },
  { id: 18, email: 'matthew.martin@company.com', name: 'Matthew Martin', role: 'employee', department: 'Engineering', title: 'Software Engineer', experience_years: 3, manager_id: 2, performance_rating: 3.8 },
  { id: 19, email: 'karen.thompson@company.com', name: 'Karen Thompson', role: 'employee', department: 'Engineering', title: 'Cloud Architect', experience_years: 9, manager_id: 2, performance_rating: 4.7 },
  { id: 20, email: 'steven.garcia@company.com', name: 'Steven Garcia', role: 'employee', department: 'Engineering', title: 'Software Engineer', experience_years: 4, manager_id: 2, performance_rating: 4.1 },
  { id: 21, email: 'betty.martinez@company.com', name: 'Betty Martinez', role: 'employee', department: 'Engineering', title: 'Senior QA Engineer', experience_years: 7, manager_id: 2, performance_rating: 4.3 },
  { id: 22, email: 'kevin.robinson@company.com', name: 'Kevin Robinson', role: 'employee', department: 'Engineering', title: 'Software Engineer', experience_years: 2, manager_id: 2, performance_rating: 3.7 },
  { id: 23, email: 'helen.clark@company.com', name: 'Helen Clark', role: 'employee', department: 'Engineering', title: 'Site Reliability Engineer', experience_years: 6, manager_id: 2, performance_rating: 4.5 },

  // Product Team (10 employees)
  { id: 24, email: 'jason.rodriguez@company.com', name: 'Jason Rodriguez', role: 'employee', department: 'Product', title: 'Product Manager', experience_years: 6, manager_id: 2, performance_rating: 4.4 },
  { id: 25, email: 'sarah.lewis@company.com', name: 'Sarah Lewis', role: 'employee', department: 'Product', title: 'Senior Product Manager', experience_years: 8, manager_id: 2, performance_rating: 4.6 },
  { id: 26, email: 'brian.lee@company.com', name: 'Brian Lee', role: 'employee', department: 'Product', title: 'Product Designer', experience_years: 5, manager_id: 2, performance_rating: 4.2 },
  { id: 27, email: 'michelle.walker@company.com', name: 'Michelle Walker', role: 'employee', department: 'Product', title: 'UX Researcher', experience_years: 4, manager_id: 2, performance_rating: 4.0 },
  { id: 28, email: 'eric.hall@company.com', name: 'Eric Hall', role: 'employee', department: 'Product', title: 'Product Analyst', experience_years: 3, manager_id: 2, performance_rating: 3.9 },
  { id: 29, email: 'amanda.allen@company.com', name: 'Amanda Allen', role: 'employee', department: 'Product', title: 'UI/UX Designer', experience_years: 6, manager_id: 2, performance_rating: 4.3 },
  { id: 30, email: 'ryan.young@company.com', name: 'Ryan Young', role: 'employee', department: 'Product', title: 'Product Manager', experience_years: 5, manager_id: 2, performance_rating: 4.1 },
  { id: 31, email: 'laura.king@company.com', name: 'Laura King', role: 'employee', department: 'Product', title: 'Senior UX Designer', experience_years: 7, manager_id: 2, performance_rating: 4.5 },
  { id: 32, email: 'justin.wright@company.com', name: 'Justin Wright', role: 'employee', department: 'Product', title: 'Product Owner', experience_years: 6, manager_id: 2, performance_rating: 4.2 },
  { id: 33, email: 'stephanie.lopez@company.com', name: 'Stephanie Lopez', role: 'employee', department: 'Product', title: 'Product Designer', experience_years: 4, manager_id: 2, performance_rating: 4.0 },

  // Sales Team (10 employees)
  { id: 34, email: 'andrew.hill@company.com', name: 'Andrew Hill', role: 'employee', department: 'Sales', title: 'Sales Representative', experience_years: 3, manager_id: 2, performance_rating: 4.1 },
  { id: 35, email: 'rebecca.scott@company.com', name: 'Rebecca Scott', role: 'employee', department: 'Sales', title: 'Senior Sales Executive', experience_years: 7, manager_id: 2, performance_rating: 4.5 },
  { id: 36, email: 'gregory.green@company.com', name: 'Gregory Green', role: 'employee', department: 'Sales', title: 'Account Executive', experience_years: 5, manager_id: 2, performance_rating: 4.3 },
  { id: 37, email: 'christine.adams@company.com', name: 'Christine Adams', role: 'employee', department: 'Sales', title: 'Sales Manager', experience_years: 8, manager_id: 2, performance_rating: 4.6 },
  { id: 38, email: 'paul.baker@company.com', name: 'Paul Baker', role: 'employee', department: 'Sales', title: 'Business Development Rep', experience_years: 2, manager_id: 2, performance_rating: 3.8 },
  { id: 39, email: 'deborah.nelson@company.com', name: 'Deborah Nelson', role: 'employee', department: 'Sales', title: 'Sales Representative', experience_years: 4, manager_id: 2, performance_rating: 4.0 },
  { id: 40, email: 'mark.carter@company.com', name: 'Mark Carter', role: 'employee', department: 'Sales', title: 'Enterprise Sales', experience_years: 9, manager_id: 2, performance_rating: 4.7 },
  { id: 41, email: 'sandra.mitchell@company.com', name: 'Sandra Mitchell', role: 'employee', department: 'Sales', title: 'Sales Representative', experience_years: 3, manager_id: 2, performance_rating: 3.9 },
  { id: 42, email: 'donald.perez@company.com', name: 'Donald Perez', role: 'employee', department: 'Sales', title: 'Account Manager', experience_years: 6, manager_id: 2, performance_rating: 4.4 },
  { id: 43, email: 'donna.roberts@company.com', name: 'Donna Roberts', role: 'employee', department: 'Sales', title: 'Sales Coordinator', experience_years: 4, manager_id: 2, performance_rating: 4.1 },

  // Marketing Team (7 employees)
  { id: 44, email: 'kenneth.turner@company.com', name: 'Kenneth Turner', role: 'employee', department: 'Marketing', title: 'Marketing Manager', experience_years: 6, manager_id: 2, performance_rating: 4.3 },
  { id: 45, email: 'carol.phillips@company.com', name: 'Carol Phillips', role: 'employee', department: 'Marketing', title: 'Content Strategist', experience_years: 5, manager_id: 2, performance_rating: 4.2 },
  { id: 46, email: 'joshua.campbell@company.com', name: 'Joshua Campbell', role: 'employee', department: 'Marketing', title: 'Digital Marketing Specialist', experience_years: 4, manager_id: 2, performance_rating: 4.0 },
  { id: 47, email: 'margaret.parker@company.com', name: 'Margaret Parker', role: 'employee', department: 'Marketing', title: 'Brand Manager', experience_years: 7, manager_id: 2, performance_rating: 4.5 },
  { id: 48, email: 'edward.evans@company.com', name: 'Edward Evans', role: 'employee', department: 'Marketing', title: 'SEO Specialist', experience_years: 3, manager_id: 2, performance_rating: 3.9 },
  { id: 49, email: 'dorothy.edwards@company.com', name: 'Dorothy Edwards', role: 'employee', department: 'Marketing', title: 'Social Media Manager', experience_years: 4, manager_id: 2, performance_rating: 4.1 },
  { id: 50, email: 'thomas.collins@company.com', name: 'Thomas Collins', role: 'employee', department: 'Marketing', title: 'Marketing Analyst', experience_years: 5, manager_id: 2, performance_rating: 4.2 }
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
    { id: 5, name: 'Michael Brown', performance: 3.8, potential: 'medium', status: 'active' },
    { id: 6, name: 'David Martinez', performance: 4.3, potential: 'high', status: 'active' },
    { id: 7, name: 'Jennifer Lee', performance: 4.7, potential: 'high', status: 'active' },
    { id: 8, name: 'Robert Garcia', performance: 4.0, potential: 'medium', status: 'active' },
    { id: 9, name: 'Lisa Anderson', performance: 4.2, potential: 'high', status: 'active' },
    { id: 10, name: 'James Wilson', performance: 4.4, potential: 'high', status: 'active' },
    { id: 11, name: 'Maria Rodriguez', performance: 4.1, potential: 'medium', status: 'active' },
    { id: 12, name: 'William Taylor', performance: 4.3, potential: 'high', status: 'active' },
    { id: 13, name: 'Patricia Thomas', performance: 3.9, potential: 'medium', status: 'active' },
    { id: 14, name: 'Christopher Moore', performance: 4.6, potential: 'high', status: 'active' },
    { id: 15, name: 'Jessica Jackson', performance: 4.0, potential: 'medium', status: 'active' },
    { id: 16, name: 'Daniel White', performance: 4.4, potential: 'high', status: 'active' },
    { id: 17, name: 'Nancy Harris', performance: 4.2, potential: 'high', status: 'active' },
    { id: 18, name: 'Matthew Martin', performance: 3.8, potential: 'low', status: 'active' },
    { id: 19, name: 'Karen Thompson', performance: 4.7, potential: 'high', status: 'active' },
    { id: 20, name: 'Steven Garcia', performance: 4.1, potential: 'medium', status: 'active' },
    { id: 21, name: 'Betty Martinez', performance: 4.3, potential: 'high', status: 'active' },
    { id: 22, name: 'Kevin Robinson', performance: 3.7, potential: 'low', status: 'active' },
    { id: 23, name: 'Helen Clark', performance: 4.5, potential: 'high', status: 'active' },
    { id: 24, name: 'Jason Rodriguez', performance: 4.4, potential: 'high', status: 'active' },
    { id: 25, name: 'Sarah Lewis', performance: 4.6, potential: 'high', status: 'active' },
    { id: 26, name: 'Brian Lee', performance: 4.2, potential: 'medium', status: 'active' },
    { id: 27, name: 'Michelle Walker', performance: 4.0, potential: 'medium', status: 'active' },
    { id: 28, name: 'Eric Hall', performance: 3.9, potential: 'medium', status: 'active' },
    { id: 29, name: 'Amanda Allen', performance: 4.3, potential: 'high', status: 'active' },
    { id: 30, name: 'Ryan Young', performance: 4.1, potential: 'medium', status: 'active' },
    { id: 31, name: 'Laura King', performance: 4.5, potential: 'high', status: 'active' },
    { id: 32, name: 'Justin Wright', performance: 4.2, potential: 'high', status: 'active' },
    { id: 33, name: 'Stephanie Lopez', performance: 4.0, potential: 'medium', status: 'active' },
    { id: 34, name: 'Andrew Hill', performance: 4.1, potential: 'medium', status: 'active' },
    { id: 35, name: 'Rebecca Scott', performance: 4.5, potential: 'high', status: 'active' },
    { id: 36, name: 'Gregory Green', performance: 4.3, potential: 'high', status: 'active' },
    { id: 37, name: 'Christine Adams', performance: 4.6, potential: 'high', status: 'active' },
    { id: 38, name: 'Paul Baker', performance: 3.8, potential: 'low', status: 'active' },
    { id: 39, name: 'Deborah Nelson', performance: 4.0, potential: 'medium', status: 'active' },
    { id: 40, name: 'Mark Carter', performance: 4.7, potential: 'high', status: 'active' },
    { id: 41, name: 'Sandra Mitchell', performance: 3.9, potential: 'medium', status: 'active' },
    { id: 42, name: 'Donald Perez', performance: 4.4, potential: 'high', status: 'active' },
    { id: 43, name: 'Donna Roberts', performance: 4.1, potential: 'medium', status: 'active' },
    { id: 44, name: 'Kenneth Turner', performance: 4.3, potential: 'high', status: 'active' },
    { id: 45, name: 'Carol Phillips', performance: 4.2, potential: 'high', status: 'active' },
    { id: 46, name: 'Joshua Campbell', performance: 4.0, potential: 'medium', status: 'active' },
    { id: 47, name: 'Margaret Parker', performance: 4.5, potential: 'high', status: 'active' },
    { id: 48, name: 'Edward Evans', performance: 3.9, potential: 'medium', status: 'active' },
    { id: 49, name: 'Dorothy Edwards', performance: 4.1, potential: 'medium', status: 'active' },
    { id: 50, name: 'Thomas Collins', performance: 4.2, potential: 'high', status: 'active' }
  ],
  talentInsights: {
    highPerformersHighPotential: 24,
    atRisk: 3,
    needsDevelopment: 20
  }
};

// HR-specific demo data
export const demoHRData = {
  companyMetrics: {
    totalEmployees: 50,
    averageRating: 4.2,
    completedReviews: 48,
    pendingReviews: 2
  },
  talentInsights: {
    highPerformersHighPotential: 24,
    atRisk: 3,
    needsDevelopment: 20
  },
  departmentBreakdown: [
    { department: 'Engineering', count: 20, avgRating: 4.2 },
    { department: 'Product', count: 10, avgRating: 4.2 },
    { department: 'Sales', count: 10, avgRating: 4.2 },
    { department: 'Marketing', count: 7, avgRating: 4.2 },
    { department: 'Human Resources', count: 1, avgRating: 4.8 },
    { department: 'Management', count: 2, avgRating: 4.6 }
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
