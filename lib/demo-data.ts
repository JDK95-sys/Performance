/**
 * Demo Data Store - Realistic 100+ Employee Company
 * In-memory data storage for demo/presentation mode
 * No database required!
 */

// Generate realistic demo users (100+ employees)
const departments = ['Engineering', 'Product', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Customer Success'];
const titles = {
  Engineering: ['Junior Software Engineer', 'Software Engineer', 'Senior Software Engineer', 'Staff Engineer', 'Principal Engineer', 'Engineering Manager', 'Director of Engineering'],
  Product: ['Associate Product Manager', 'Product Manager', 'Senior Product Manager', 'Director of Product', 'VP of Product'],
  Sales: ['Sales Development Rep', 'Account Executive', 'Senior Account Executive', 'Sales Manager', 'Director of Sales'],
  Marketing: ['Marketing Coordinator', 'Marketing Manager', 'Senior Marketing Manager', 'Director of Marketing', 'CMO'],
  HR: ['HR Coordinator', 'HR Business Partner', 'Senior HR Manager', 'HR Director', 'CHRO'],
  Finance: ['Financial Analyst', 'Senior Financial Analyst', 'Finance Manager', 'Director of Finance', 'CFO'],
  Operations: ['Operations Coordinator', 'Operations Manager', 'Senior Operations Manager', 'Director of Operations', 'COO'],
  'Customer Success': ['Customer Success Associate', 'Customer Success Manager', 'Senior CSM', 'Director of Customer Success']
};

const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'James', 'Jennifer', 'Robert', 'Lisa', 'William', 'Michelle', 'Richard', 'Ashley', 'Thomas', 'Amanda', 'Charles', 'Melissa', 'Daniel', 'Laura', 'Matthew', 'Stephanie', 'Anthony', 'Rebecca', 'Mark', 'Rachel', 'Donald', 'Nicole', 'Steven', 'Elizabeth'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Hall', 'Allen'];

// Core demo accounts
export const demoUsers = [
  {
    id: 1,
    email: 'john.smith@company.com',
    name: 'John Smith',
    role: 'employee',
    department: 'Engineering',
    title: 'Senior Software Engineer',
    manager_id: 2,
    experience_years: 5,
    bio: 'Experienced full-stack developer passionate about building scalable systems.',
    performance_rating: 4.2,
    potential: 'high'
  },
  {
    id: 2,
    email: 'manager@company.com',
    name: 'Sarah Johnson',
    role: 'manager',
    department: 'Engineering',
    title: 'Engineering Manager',
    manager_id: null,
    experience_years: 8,
    bio: 'Leading high-performance engineering teams to deliver exceptional results.',
    performance_rating: 4.5,
    potential: 'high'
  },
  {
    id: 3,
    email: 'admin@company.com',
    name: 'Alex Chen',
    role: 'hr',
    department: 'Human Resources',
    title: 'HR Director',
    manager_id: null,
    experience_years: 10,
    bio: 'Strategic HR leadership focused on employee development and culture.',
    performance_rating: 4.3,
    potential: 'high'
  },
  {
    id: 4,
    email: 'recruiter@company.com',
    name: 'Jane Recruiter',
    role: 'recruiter',
    department: 'Human Resources',
    title: 'Senior Recruiter',
    manager_id: 3,
    experience_years: 6,
    bio: 'Talent acquisition specialist focused on building diverse high-performing teams.',
    performance_rating: 4.0,
    potential: 'medium'
  },
  {
    id: 5,
    email: 'candidate@company.com',
    name: 'Chris Candidate',
    role: 'candidate',
    department: 'Engineering',
    title: 'Software Engineer',
    manager_id: 2,
    experience_years: 3,
    bio: 'Looking for internal growth opportunities and career advancement.',
    performance_rating: 3.8,
    potential: 'high'
  }
];

// Generate 100 more employees with realistic data
let currentId = 6;
for (let i = 0; i < 100; i++) {
  const department = departments[i % departments.length];
  const titleList = titles[department as keyof typeof titles];
  const title = titleList[Math.floor(Math.random() * titleList.length)];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const role = title.includes('Manager') || title.includes('Director') || title.includes('VP') || title.includes('C') ? 'manager' : 'employee';

  // Performance rating distribution (bell curve, mostly 3-4)
  const rand = Math.random();
  let rating;
  if (rand < 0.10) rating = 2.5 + Math.random() * 0.5; // 10% low performers
  else if (rand < 0.30) rating = 3.0 + Math.random() * 0.5; // 20% below average
  else if (rand < 0.70) rating = 3.5 + Math.random() * 0.5; // 40% average
  else if (rand < 0.90) rating = 4.0 + Math.random() * 0.5; // 20% above average
  else rating = 4.5 + Math.random() * 0.5; // 10% high performers

  const potential = rating > 4.0 ? 'high' : rating > 3.5 ? 'medium' : 'low';

  demoUsers.push({
    id: currentId++,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
    name: `${firstName} ${lastName}`,
    role,
    department,
    title,
    manager_id: role === 'manager' ? null : (2 + (i % 10)), // Assign to various managers
    experience_years: Math.floor(Math.random() * 15) + 1,
    bio: `${title} at PerformPro with expertise in ${department.toLowerCase()}.`,
    performance_rating: Math.round(rating * 10) / 10,
    potential
  });
}

// Demo goals (varied by user)
export const demoGoals = [
  // High performer goals
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
    keyResults: [
      { id: 3, title: 'Complete 3 online courses', current_value: 1, target_value: 3, unit: 'courses' },
      { id: 4, title: 'Build 2 ML projects', current_value: 0, target_value: 2, unit: 'projects' }
    ]
  },
  {
    id: 3,
    owner_id: 1,
    title: 'Mentor Junior Developers',
    description: 'Help onboard and mentor 2 junior team members',
    goal_type: 'development',
    category: 'leadership',
    status: 'on_track',
    priority: 'medium',
    progress_percentage: 80,
    due_date: '2026-09-30',
    visibility: 'team',
    keyResults: []
  },
  // Manager goals
  {
    id: 4,
    owner_id: 2,
    title: 'Improve Team Velocity by 20%',
    description: 'Optimize processes and remove blockers to increase team output',
    goal_type: 'performance',
    category: 'leadership',
    status: 'in_progress',
    priority: 'high',
    progress_percentage: 55,
    due_date: '2026-08-31',
    visibility: 'department',
    keyResults: [
      { id: 5, title: 'Increase sprint points', current_value: 45, target_value: 54, unit: 'points' },
      { id: 6, title: 'Reduce cycle time', current_value: 8, target_value: 6, unit: 'days' }
    ]
  },
  {
    id: 5,
    owner_id: 2,
    title: 'Reduce Team Attrition',
    description: 'Improve team satisfaction and retention',
    goal_type: 'strategic',
    category: 'leadership',
    status: 'in_progress',
    priority: 'high',
    progress_percentage: 70,
    due_date: '2026-12-31',
    visibility: 'private',
    keyResults: [
      { id: 7, title: 'Team satisfaction score', current_value: 82, target_value: 90, unit: '%' },
      { id: 8, title: 'Voluntary attrition rate', current_value: 12, target_value: 5, unit: '%' }
    ]
  },
  // Add goals for other users
  {
    id: 6,
    owner_id: 5,
    title: 'Complete React Advanced Training',
    description: 'Master React performance optimization and advanced patterns',
    goal_type: 'development',
    category: 'technical',
    status: 'in_progress',
    priority: 'medium',
    progress_percentage: 30,
    due_date: '2026-07-31',
    visibility: 'private',
    keyResults: []
  },
  {
    id: 7,
    owner_id: 6,
    title: 'Ship 3 Major Features',
    description: 'Deliver high-impact features for Q2',
    goal_type: 'performance',
    category: 'technical',
    status: 'on_track',
    priority: 'high',
    progress_percentage: 90,
    due_date: '2026-06-30',
    visibility: 'team',
    keyResults: [
      { id: 9, title: 'Features completed', current_value: 2, target_value: 3, unit: 'features' }
    ]
  }
];

// Demo feedback (varied types and sentiments)
export const demoFeedback = [
  // Positive feedback
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
    from_user_id: 6,
    from_user_name: 'Emily Davis',
    to_user_id: 1,
    feedback_type: 'praise',
    category: 'teamwork',
    content: 'Thank you for helping me debug that complex issue. Your patience and clear explanations made all the difference.',
    sentiment: 'positive',
    created_at: '2026-01-08T15:30:00Z',
    acknowledged: true
  },
  // Constructive feedback
  {
    id: 3,
    from_user_id: 2,
    from_user_name: 'Sarah Johnson',
    to_user_id: 1,
    feedback_type: 'constructive',
    category: 'communication',
    content: 'Consider providing more detailed documentation for your code. This will help the team understand complex logic better.',
    sentiment: 'neutral',
    created_at: '2026-01-12T14:30:00Z',
    acknowledged: false
  },
  {
    id: 4,
    from_user_id: 3,
    from_user_name: 'Alex Chen',
    to_user_id: 2,
    feedback_type: 'praise',
    category: 'leadership',
    content: 'Your team members consistently speak highly of your supportive leadership style. The 1-on-1s you conduct are particularly effective.',
    sentiment: 'positive',
    created_at: '2026-01-05T11:00:00Z',
    acknowledged: true
  },
  {
    id: 5,
    from_user_id: 1,
    from_user_name: 'John Smith',
    to_user_id: 2,
    feedback_type: 'praise',
    category: 'leadership',
    content: 'Really appreciate how you protected the team from unnecessary meetings this sprint. We were able to focus and deliver exceptional work.',
    sentiment: 'positive',
    created_at: '2026-01-14T09:00:00Z',
    acknowledged: true
  },
  {
    id: 6,
    from_user_id: 5,
    from_user_name: 'Chris Candidate',
    to_user_id: 1,
    feedback_type: 'request',
    category: 'technical',
    content: 'Could you share your approach to system design? I\'d love to learn from your experience.',
    sentiment: 'neutral',
    created_at: '2026-01-11T16:00:00Z',
    acknowledged: false
  }
];

// Demo reviews (varied ratings)
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
    strengths: 'Strong technical skills, proactive problem solver, excellent code quality, mentors junior team members effectively',
    areas_for_improvement: 'Documentation and communication with stakeholders. Consider presenting technical decisions more broadly.',
    completed_at: '2025-12-15T00:00:00Z'
  },
  {
    id: 2,
    employee_id: 1,
    reviewer_id: 2,
    manager_name: 'Sarah Johnson',
    cycle_name: 'Q3 2025',
    review_type: 'quarterly',
    overall_rating: 4.0,
    status: 'completed',
    strengths: 'Delivers high-quality code consistently, takes ownership of complex problems',
    areas_for_improvement: 'Time management during sprint planning',
    completed_at: '2025-09-20T00:00:00Z'
  },
  {
    id: 3,
    employee_id: 5,
    reviewer_id: 2,
    manager_name: 'Sarah Johnson',
    cycle_name: 'Q4 2025',
    review_type: 'quarterly',
    overall_rating: 3.8,
    status: 'completed',
    strengths: 'Quick learner, enthusiastic, willing to take on challenges',
    areas_for_improvement: 'Code review skills, testing practices, asking for help earlier when blocked',
    completed_at: '2025-12-18T00:00:00Z'
  }
];

// Demo insights
export const demoInsights = [
  {
    type: 'strength',
    title: 'Technical Excellence',
    description: 'Your technical contributions have been exceptional this quarter. You delivered 3 major features ahead of schedule.',
    impact: 'high',
    recommendations: ['Consider mentoring junior developers', 'Document best practices for the team', 'Present at tech talks']
  },
  {
    type: 'opportunity',
    title: 'Leadership Potential',
    description: 'You demonstrate strong leadership qualities in team discussions and code reviews.',
    impact: 'medium',
    recommendations: ['Take on a tech lead role for the next project', 'Present at team knowledge sharing sessions']
  },
  {
    type: 'trend',
    title: 'Increasing Impact',
    description: 'Your performance ratings have improved consistently over the past 3 quarters (3.8 → 4.0 → 4.2).',
    impact: 'high',
    recommendations: ['Continue current trajectory', 'Consider stretch assignments']
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
    { id: 1, name: 'John Smith', performance: 4.2, potential: 'high', status: 'active', title: 'Senior Software Engineer' },
    { id: 5, name: 'Chris Candidate', performance: 3.8, potential: 'high', status: 'active', title: 'Software Engineer' },
    { id: 6, name: 'Emily Davis', performance: 4.5, potential: 'high', status: 'active', title: 'Staff Engineer' },
    { id: 7, name: 'Michael Brown', performance: 3.5, potential: 'medium', status: 'active', title: 'Software Engineer' },
    { id: 8, name: 'Jessica Martinez', performance: 4.0, potential: 'high', status: 'active', title: 'Senior Software Engineer' },
    { id: 9, name: 'David Wilson', performance: 3.2, potential: 'low', status: 'pip', title: 'Junior Software Engineer' },
    { id: 10, name: 'Lisa Anderson', performance: 4.3, potential: 'high', status: 'active', title: 'Senior Software Engineer' }
  ],
  talentInsights: {
    highPerformersHighPotential: 4,
    atRisk: 1,
    needsDevelopment: 2
  }
};

// HR-specific demo data (realistic company-wide metrics)
export const demoHRData = {
  companyMetrics: {
    totalEmployees: demoUsers.length,
    averageRating: 3.9,
    completedReviews: Math.floor(demoUsers.length * 0.85),
    pendingReviews: Math.floor(demoUsers.length * 0.15)
  },
  talentInsights: {
    highPerformersHighPotential: demoUsers.filter(u => u.performance_rating >= 4.0 && u.potential === 'high').length,
    atRisk: demoUsers.filter(u => u.performance_rating < 3.0).length,
    needsDevelopment: demoUsers.filter(u => u.performance_rating >= 3.0 && u.performance_rating < 3.5).length
  },
  departmentBreakdown: departments.map(dept => {
    const deptUsers = demoUsers.filter(u => u.department === dept);
    const avgRating = deptUsers.length > 0
      ? deptUsers.reduce((sum, u) => sum + (u.performance_rating || 3.5), 0) / deptUsers.length
      : 3.5;
    return {
      department: dept,
      count: deptUsers.length,
      avgRating: Math.round(avgRating * 10) / 10
    };
  })
};

// Helper functions
export function getDemoUserByEmail(email: string) {
  const user = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  console.log('Demo mode: Looking up user:', email, 'Found:', !!user);
  return user;
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

export function getDemoInsightsByUserId(userId: number) {
  // Return insights for the logged-in user
  return demoInsights;
}

export function getAllDemoUsers() {
  return demoUsers;
}

export function getDemoTeamMembersByManagerId(managerId: number) {
  return demoUsers.filter(u => u.manager_id === managerId);
}

export function isDemoMode() {
  // Demo mode when no database is configured
  const isDemo = !process.env.POSTGRES_URL && !process.env.DATABASE_PATH;
  console.log('Checking demo mode:', isDemo, 'POSTGRES_URL:', !!process.env.POSTGRES_URL, 'DATABASE_PATH:', !!process.env.DATABASE_PATH);
  return isDemo;
}
