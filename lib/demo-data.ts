/**
 * Demo Data Store
 * In-memory data storage for demo/presentation mode
 * No database required!
 * 
 * Enhanced with 100+ employees for realistic demonstrations
 * 
 * Data Statistics:
 * - 117 total users (107 employees, 9 managers, 1 HR admin)
 * - 152 goals with varied statuses and priorities
 * - 202 feedback items (positive, constructive, recognition, coaching)
 * - 125 performance reviews with realistic rating distribution
 * - 7 departments (Engineering, Product, Sales, Marketing, Data Science, Finance, Operations)
 * - Performance distribution: ~20% high performers, ~60% average, ~20% low performers
 * 
 * Note: Demo data is stateless and reloads fresh on each application restart.
 * This naturally prevents duplications - demo mode is read-only and data resets
 * automatically when the application restarts.
 */

// Demo users - Comprehensive employee base
export const demoUsers = [
  // Key demo accounts (IDs 1-3)
  {
    id: 1,
    email: 'john.smith@company.com',
    name: 'John Smith',
    role: 'employee',
    department: 'Engineering',
    title: 'Senior Software Engineer',
    manager_id: 10,
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
    manager_id: null,
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
    manager_id: null,
    experience_years: 10,
    bio: 'Strategic HR leadership focused on employee development and culture.'
  },

  // Additional Managers (IDs 10-19)
  {
    id: 10,
    email: 'michael.torres@company.com',
    name: 'Michael Torres',
    role: 'manager',
    department: 'Engineering',
    title: 'Senior Engineering Manager',
    manager_id: 2,
    experience_years: 12,
    bio: 'Building high-performing engineering teams with focus on innovation.'
  },
  {
    id: 11,
    email: 'lisa.wang@company.com',
    name: 'Lisa Wang',
    role: 'manager',
    department: 'Product',
    title: 'Product Director',
    manager_id: null,
    experience_years: 10,
    bio: 'Product leader focused on user experience and data-driven decisions.'
  },
  {
    id: 12,
    email: 'david.kumar@company.com',
    name: 'David Kumar',
    role: 'manager',
    department: 'Data Science',
    title: 'Data Science Manager',
    manager_id: null,
    experience_years: 14,
    bio: 'Building world-class data teams and ML infrastructure.'
  },
  {
    id: 13,
    email: 'rachel.green@company.com',
    name: 'Rachel Green',
    role: 'manager',
    department: 'Marketing',
    title: 'Marketing Director',
    manager_id: null,
    experience_years: 15,
    bio: 'Creative leader passionate about brand building and growth marketing.'
  },
  {
    id: 14,
    email: 'james.mitchell@company.com',
    name: 'James Mitchell',
    role: 'manager',
    department: 'Sales',
    title: 'Sales Manager',
    manager_id: null,
    experience_years: 11,
    bio: 'Driving sales excellence through coaching and strategic account management.'
  },
  {
    id: 15,
    email: 'emily.chen@company.com',
    name: 'Emily Chen',
    role: 'manager',
    department: 'Engineering',
    title: 'Engineering Manager',
    manager_id: 2,
    experience_years: 9,
    bio: 'Leading frontend teams to build exceptional user experiences.'
  },
  {
    id: 16,
    email: 'robert.wilson@company.com',
    name: 'Robert Wilson',
    role: 'manager',
    department: 'Finance',
    title: 'Finance Director',
    manager_id: null,
    experience_years: 16,
    bio: 'Strategic financial planning and business intelligence.'
  },
  {
    id: 17,
    email: 'maria.garcia@company.com',
    name: 'Maria Garcia',
    role: 'manager',
    department: 'Operations',
    title: 'Operations Manager',
    manager_id: null,
    experience_years: 13,
    bio: 'Optimizing processes and driving operational excellence.'
  },

  // Engineering Department Employees (High Performers - IDs 20-29)
  {
    id: 20,
    email: 'alex.johnson@company.com',
    name: 'Alex Johnson',
    role: 'employee',
    department: 'Engineering',
    title: 'Staff Engineer',
    manager_id: 10,
    experience_years: 8,
    bio: 'Technical leader specializing in distributed systems and architecture.'
  },
  {
    id: 21,
    email: 'emma.wilson@company.com',
    name: 'Emma Wilson',
    role: 'employee',
    department: 'Engineering',
    title: 'Senior Frontend Developer',
    manager_id: 15,
    experience_years: 6,
    bio: 'Creating beautiful, performant user interfaces with React and TypeScript.'
  },
  {
    id: 22,
    email: 'carlos.rodriguez@company.com',
    name: 'Carlos Rodriguez',
    role: 'employee',
    department: 'Engineering',
    title: 'Backend Engineer',
    manager_id: 10,
    experience_years: 4,
    bio: 'Building scalable microservices and APIs.'
  },
  {
    id: 23,
    email: 'sophie.martin@company.com',
    name: 'Sophie Martin',
    role: 'employee',
    department: 'Engineering',
    title: 'DevOps Engineer',
    manager_id: 10,
    experience_years: 5,
    bio: 'Infrastructure automation and cloud architecture specialist.'
  },
  {
    id: 24,
    email: 'kevin.lee@company.com',
    name: 'Kevin Lee',
    role: 'employee',
    department: 'Engineering',
    title: 'Software Engineer II',
    manager_id: 15,
    experience_years: 3,
    bio: 'Full-stack developer with passion for clean code and best practices.'
  },
  {
    id: 25,
    email: 'nina.patel@company.com',
    name: 'Nina Patel',
    role: 'employee',
    department: 'Engineering',
    title: 'Senior QA Engineer',
    manager_id: 10,
    experience_years: 7,
    bio: 'Quality advocate ensuring robust, reliable software delivery.'
  },
  {
    id: 26,
    email: 'tom.brown@company.com',
    name: 'Tom Brown',
    role: 'employee',
    department: 'Engineering',
    title: 'Mobile Developer',
    manager_id: 15,
    experience_years: 4,
    bio: 'Building native iOS and Android applications.'
  },
  {
    id: 27,
    email: 'jessica.taylor@company.com',
    name: 'Jessica Taylor',
    role: 'employee',
    department: 'Engineering',
    title: 'Security Engineer',
    manager_id: 10,
    experience_years: 6,
    bio: 'Protecting systems and data with modern security practices.'
  },
  {
    id: 28,
    email: 'ryan.davis@company.com',
    name: 'Ryan Davis',
    role: 'employee',
    department: 'Engineering',
    title: 'Platform Engineer',
    manager_id: 10,
    experience_years: 5,
    bio: 'Building developer tools and internal platforms.'
  },
  {
    id: 29,
    email: 'olivia.anderson@company.com',
    name: 'Olivia Anderson',
    role: 'employee',
    department: 'Engineering',
    title: 'Software Engineer',
    manager_id: 15,
    experience_years: 2,
    bio: 'Junior engineer eager to learn and contribute to impactful projects.'
  },

  // More Engineering (Average Performers - IDs 30-45)
  ...Array.from({ length: 16 }, (_, i) => ({
    id: 30 + i,
    email: `eng.employee${30 + i}@company.com`,
    name: `Engineer ${30 + i}`,
    role: 'employee' as const,
    department: 'Engineering',
    title: i % 3 === 0 ? 'Senior Engineer' : i % 3 === 1 ? 'Software Engineer II' : 'Software Engineer',
    manager_id: i % 2 === 0 ? 10 : 15,
    experience_years: 1 + (i % 7),
    bio: `Software engineer contributing to team success.`
  })),

  // Data Science Team (IDs 46-55)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 46 + i,
    email: `data.scientist${46 + i}@company.com`,
    name: `Data Scientist ${46 + i}`,
    role: 'employee' as const,
    department: 'Data Science',
    title: i < 3 ? 'Senior Data Scientist' : i < 7 ? 'Data Scientist' : 'Junior Data Scientist',
    manager_id: 12,
    experience_years: i < 3 ? 5 + i : i < 7 ? 2 + i : 1 + i,
    bio: `Data scientist working on ML models and analytics.`
  })),

  // Product Team (IDs 56-70)
  ...Array.from({ length: 15 }, (_, i) => ({
    id: 56 + i,
    email: `product${56 + i}@company.com`,
    name: `Product ${56 + i}`,
    role: 'employee' as const,
    department: 'Product',
    title: i < 4 ? 'Senior Product Manager' : i < 10 ? 'Product Manager' : 'Associate Product Manager',
    manager_id: 11,
    experience_years: i < 4 ? 6 + i : i < 10 ? 3 + i : 1 + i,
    bio: `Product manager driving user-centric solutions.`
  })),

  // Marketing Team (IDs 71-85)
  ...Array.from({ length: 15 }, (_, i) => ({
    id: 71 + i,
    email: `marketing${71 + i}@company.com`,
    name: `Marketing ${71 + i}`,
    role: 'employee' as const,
    department: 'Marketing',
    title: i < 3 ? 'Senior Marketing Manager' : i < 8 ? 'Marketing Manager' : i < 12 ? 'Marketing Specialist' : 'Marketing Coordinator',
    manager_id: 13,
    experience_years: i < 3 ? 7 + i : i < 8 ? 4 + i : i < 12 ? 2 + i : 1,
    bio: `Marketing professional driving brand growth.`
  })),

  // Sales Team (IDs 86-105)
  ...Array.from({ length: 20 }, (_, i) => ({
    id: 86 + i,
    email: `sales${86 + i}@company.com`,
    name: `Sales ${86 + i}`,
    role: 'employee' as const,
    department: 'Sales',
    title: i < 5 ? 'Senior Account Executive' : i < 15 ? 'Account Executive' : 'Sales Development Rep',
    manager_id: 14,
    experience_years: i < 5 ? 5 + i : i < 15 ? 2 + (i % 4) : 1 + (i % 3),
    bio: `Sales professional driving revenue growth.`
  })),

  // Finance Team (IDs 106-115)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 106 + i,
    email: `finance${106 + i}@company.com`,
    name: `Finance ${106 + i}`,
    role: 'employee' as const,
    department: 'Finance',
    title: i < 3 ? 'Senior Financial Analyst' : i < 7 ? 'Financial Analyst' : 'Junior Financial Analyst',
    manager_id: 16,
    experience_years: i < 3 ? 6 + i : i < 7 ? 3 + i : 1 + i,
    bio: `Finance professional ensuring fiscal excellence.`
  })),

  // Operations Team (IDs 116-125)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 116 + i,
    email: `ops${116 + i}@company.com`,
    name: `Operations ${116 + i}`,
    role: 'employee' as const,
    department: 'Operations',
    title: i < 3 ? 'Senior Operations Specialist' : i < 7 ? 'Operations Specialist' : 'Operations Coordinator',
    manager_id: 17,
    experience_years: i < 3 ? 5 + i : i < 7 ? 2 + i : 1,
    bio: `Operations specialist ensuring smooth business processes.`
  }))
];

// Demo goals - Comprehensive with varied statuses and progress
export const demoGoals = [
  // John Smith's goals (high performer)
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
  },

  // Generate goals for all employees with realistic distribution
  ...Array.from({ length: 150 }, (_, i) => {
    const goalId = 3 + i;
    const ownerId = 20 + (i % 106); // Distribute across employees
    const statusOptions = ['not_started', 'in_progress', 'on_track', 'at_risk', 'completed'];
    const priorityOptions = ['low', 'medium', 'high', 'critical'];
    const typeOptions = ['performance', 'development', 'project'];
    const categoryOptions = ['technical', 'professional', 'leadership', 'behavioral'];
    
    // Determine status based on realistic distribution
    let status = statusOptions[i % 5];
    if (i % 7 === 0) status = 'completed'; // 14% completed
    if (i % 11 === 0) status = 'at_risk'; // 9% at risk
    if (i % 3 === 0) status = 'on_track'; // 33% on track
    
    const progress = status === 'completed' ? 100 :
                    status === 'at_risk' ? 20 + (i % 30) :
                    status === 'on_track' ? 50 + (i % 40) :
                    status === 'in_progress' ? 30 + (i % 50) :
                    0;

    const monthsOffset = 3 + (i % 9);
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + monthsOffset);

    return {
      id: goalId,
      owner_id: ownerId,
      title: `Goal ${goalId}: ${['Improve Performance', 'Complete Project', 'Develop Skills', 'Lead Initiative', 'Increase Efficiency'][i % 5]}`,
      description: `Detailed description for goal ${goalId} focusing on measurable outcomes.`,
      goal_type: typeOptions[i % 3] as 'performance' | 'development' | 'project',
      category: categoryOptions[i % 4] as 'technical' | 'professional' | 'leadership' | 'behavioral',
      status: status as 'not_started' | 'in_progress' | 'on_track' | 'at_risk' | 'completed',
      priority: priorityOptions[i % 4] as 'low' | 'medium' | 'high' | 'critical',
      progress_percentage: progress,
      due_date: dueDate.toISOString().split('T')[0],
      visibility: (i % 5 === 0 ? 'company' : i % 5 === 1 ? 'department' : i % 5 === 2 ? 'team' : 'private') as 'company' | 'department' | 'team' | 'private',
      keyResults: []
    };
  })
];

// Demo feedback - Comprehensive with varied types and sentiments
export const demoFeedback = [
  // Original feedback for John Smith
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
  },

  // Generate feedback for employees with realistic distribution
  ...Array.from({ length: 200 }, (_, i) => {
    const feedbackId = 3 + i;
    const toUserId = 20 + (i % 106); // Distribute across employees
    const fromUserId = i % 5 === 0 ? 10 : i % 7 === 0 ? 15 : i % 3 === 0 ? 12 : 2; // From managers
    const managerNames = ['Michael Torres', 'Emily Chen', 'David Kumar', 'Sarah Johnson'];
    const fromUserName = managerNames[fromUserId % 4];
    
    const types = ['positive', 'constructive', 'recognition', 'coaching'] as const;
    const categories = ['technical', 'collaboration', 'leadership', 'communication', 'other'] as const;
    const feedbackType = types[i % 4];
    const category = categories[i % 5];
    
    // Deterministic sentiment mapping
    const sentimentMap: Record<typeof feedbackType, 'positive' | 'neutral'> = {
      positive: 'positive',
      recognition: 'positive',
      constructive: 'neutral',
      coaching: 'positive'
    };
    const sentiment = sentimentMap[feedbackType];
    
    const contents = {
      positive: [
        'Great work on the recent project delivery. Your attention to detail was impressive.',
        'Excellent collaboration with the team. Your contributions made a real difference.',
        'Outstanding technical implementation. The solution was both elegant and efficient.',
        'Your proactive communication kept everyone aligned. Well done!'
      ],
      constructive: [
        'Consider improving response time on code reviews to help maintain team velocity.',
        'Documentation could be more detailed to help onboarding and knowledge sharing.',
        'Try to be more vocal in team meetings - your insights are valuable.',
        'Focus on breaking down tasks into smaller deliverables for better tracking.'
      ],
      recognition: [
        'Thank you for going above and beyond to help teammates. True team player!',
        'Recognition for consistently delivering high-quality work on time.',
        'Your mentorship of junior team members has been invaluable.',
        'Appreciate your positive attitude and willingness to tackle challenges.'
      ],
      coaching: [
        'Let\'s work together on improving your presentation skills for stakeholder meetings.',
        'Consider deepening your expertise in system design for the next level.',
        'Would be great to see you take ownership of larger initiatives.',
        'Let\'s focus on building your leadership presence in team discussions.'
      ]
    };
    
    const daysAgo = 1 + (i % 90);
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - daysAgo);
    
    const contentMap: Record<string, string[]> = contents;
    const selectedContent = contentMap[feedbackType]?.[i % contentMap[feedbackType].length] || 'Great work on the project!';
    
    return {
      id: feedbackId,
      from_user_id: fromUserId,
      from_user_name: fromUserName,
      to_user_id: toUserId,
      feedback_type: feedbackType,
      category: category,
      content: selectedContent,
      sentiment: sentiment,
      created_at: createdDate.toISOString(),
      acknowledged: i % 3 !== 0
    };
  })
];

// Demo reviews - Comprehensive with realistic ratings distribution
export const demoReviews = [
  // Original review for John Smith (high performer)
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
  },

  // Generate reviews for all employees with realistic performance distribution
  // Performance distribution: 20% high (4.0-5.0), 60% average (3.0-3.9), 20% low (2.0-2.9)
  ...Array.from({ length: 124 }, (_, i) => {
    const reviewId = 2 + i;
    const employeeId = 20 + i;
    const managerId = employeeId >= 46 && employeeId <= 55 ? 12 : // Data Science
                     employeeId >= 56 && employeeId <= 70 ? 11 : // Product
                     employeeId >= 71 && employeeId <= 85 ? 13 : // Marketing
                     employeeId >= 86 && employeeId <= 105 ? 14 : // Sales
                     employeeId >= 106 && employeeId <= 115 ? 16 : // Finance
                     employeeId >= 116 && employeeId <= 125 ? 17 : // Operations
                     i % 2 === 0 ? 10 : 15; // Engineering
    
    const managerNames: { [key: number]: string } = {
      2: 'Sarah Johnson',
      10: 'Michael Torres',
      11: 'Lisa Wang',
      12: 'David Kumar',
      13: 'Rachel Green',
      14: 'James Mitchell',
      15: 'Emily Chen',
      16: 'Robert Wilson',
      17: 'Maria Garcia'
    };
    
    // Realistic performance distribution
    let rating: number;
    if (i < 25) { // 20% high performers
      rating = 4.0 + (Math.random() * 1.0);
    } else if (i < 100) { // 60% average performers  
      rating = 3.0 + (Math.random() * 0.9);
    } else { // 20% low performers
      rating = 2.0 + (Math.random() * 0.9);
    }
    rating = Math.round(rating * 10) / 10; // Round to 1 decimal

    const strengthsPool = [
      'Strong technical skills and problem-solving ability',
      'Excellent team player with great collaboration',
      'Consistently delivers high-quality work on time',
      'Proactive in identifying and solving problems',
      'Great communication and stakeholder management',
      'Shows initiative and takes ownership',
      'Strong analytical and critical thinking skills',
      'Adaptable and quick learner',
      'Positive attitude and cultural contributor',
      'Good attention to detail and quality'
    ];

    const improvementPool = [
      'Could improve documentation and knowledge sharing',
      'Needs to work on time management and prioritization',
      'Should be more proactive in communication',
      'Could benefit from additional technical training',
      'Needs to improve presentation and public speaking',
      'Should focus more on strategic thinking',
      'Could improve code review quality and feedback',
      'Needs to be more consistent in delivery',
      'Should work on conflict resolution skills',
      'Could improve stakeholder communication'
    ];

    return {
      id: reviewId,
      employee_id: employeeId,
      reviewer_id: managerId,
      manager_name: managerNames[managerId] || 'Manager',
      cycle_name: i % 4 === 0 ? 'Q4 2025' : i % 4 === 1 ? 'Q3 2025' : i % 4 === 2 ? 'Q2 2025' : 'Annual 2025',
      review_type: (i % 4 === 3 ? 'annual' : 'quarterly') as 'annual' | 'quarterly',
      overall_rating: rating,
      status: 'completed' as const,
      strengths: strengthsPool[i % strengthsPool.length],
      areas_for_improvement: improvementPool[i % improvementPool.length],
      completed_at: new Date(2025, 11 - (i % 12), 15).toISOString()
    };
  })
];

// Demo insights - AI-powered performance insights
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

// Manager-specific demo data - Enhanced with realistic team metrics
export const demoTeamData = {
  teamHealth: {
    overallScore: 82,
    engagement: 85,
    performance: 88,
    satisfaction: 79
  },
  teamMembers: [
    { id: 1, name: 'John Smith', performance: 4.2, potential: 'high', status: 'active' },
    { id: 20, name: 'Alex Johnson', performance: 4.5, potential: 'high', status: 'active' },
    { id: 21, name: 'Emma Wilson', performance: 4.0, potential: 'high', status: 'active' },
    { id: 22, name: 'Carlos Rodriguez', performance: 3.8, potential: 'medium', status: 'active' },
    { id: 23, name: 'Sophie Martin', performance: 4.1, potential: 'high', status: 'active' },
    { id: 25, name: 'Nina Patel', performance: 3.9, potential: 'medium', status: 'active' },
    { id: 27, name: 'Jessica Taylor', performance: 4.3, potential: 'high', status: 'active' },
    { id: 28, name: 'Ryan Davis', performance: 3.7, potential: 'medium', status: 'active' }
  ],
  talentInsights: {
    highPerformersHighPotential: 5,
    atRisk: 1,
    needsDevelopment: 2
  }
};

// HR-specific demo data - Enhanced with comprehensive company metrics
export const demoHRData = {
  companyMetrics: {
    totalEmployees: 125,
    averageRating: 3.6,
    completedReviews: 125,
    pendingReviews: 0,
    highPerformers: 25, // 20%
    averagePerformers: 75, // 60%
    lowPerformers: 25 // 20%
  },
  talentInsights: {
    highPerformersHighPotential: 25,
    atRisk: 15,
    needsDevelopment: 30,
    promotionReady: 18,
    flightRisk: 12
  },
  departmentBreakdown: [
    { department: 'Engineering', count: 46, avgRating: 3.7, highPerformers: 10 },
    { department: 'Sales', count: 20, avgRating: 3.5, highPerformers: 4 },
    { department: 'Product', count: 15, avgRating: 3.8, highPerformers: 4 },
    { department: 'Marketing', count: 15, avgRating: 3.6, highPerformers: 3 },
    { department: 'Data Science', count: 10, avgRating: 3.9, highPerformers: 3 },
    { department: 'Finance', count: 10, avgRating: 3.5, highPerformers: 1 },
    { department: 'Operations', count: 10, avgRating: 3.4, highPerformers: 0 }
  ],
  performanceDistribution: [
    { rating: 5, count: 8, percentage: 6 },
    { rating: 4, count: 42, percentage: 34 },
    { rating: 3, count: 50, percentage: 40 },
    { rating: 2, count: 25, percentage: 20 }
  ],
  nineBoxMatrix: {
    box9: 15, // High performance, high potential (Stars)
    box8: 10, // High performance, medium potential
    box7: 5,  // High performance, low potential
    box6: 15, // Medium performance, high potential
    box5: 35, // Medium performance, medium potential (Solid performers)
    box4: 10, // Medium performance, low potential
    box3: 5,  // Low performance, high potential (Enigmas)
    box2: 15, // Low performance, medium potential
    box1: 15  // Low performance, low potential
  }
};

// Helper functions
export function getDemoUserByEmail(email: string) {
  return demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function getDemoUserById(id: number) {
  return demoUsers.find(u => u.id === id);
}

export function getDemoGoalsByUserId(userId: number) {
  const user = getDemoUserById(userId);
  if (!user) return [];
  
  // For demo purposes, show more data based on role
  if (user.role === 'hr') {
    // HR sees all goals
    return demoGoals;
  } else if (user.role === 'manager') {
    // Managers see their own goals + their team's goals + department/company goals
    const teamMemberIds = demoUsers.filter(u => u.manager_id === userId).map(u => u.id);
    return demoGoals.filter(g => 
      g.owner_id === userId || 
      teamMemberIds.includes(g.owner_id) ||
      g.visibility === 'company' ||
      g.visibility === 'department'
    );
  } else {
    // Employees see their own goals + team/department/company goals
    return demoGoals.filter(g => 
      g.owner_id === userId || 
      g.visibility === 'team' || 
      g.visibility === 'department' ||
      g.visibility === 'company'
    );
  }
}

export function getDemoFeedbackByUserId(userId: number) {
  const user = getDemoUserById(userId);
  if (!user) return [];
  
  // For demo purposes, show more data based on role
  if (user.role === 'hr') {
    // HR sees all feedback
    return demoFeedback;
  } else if (user.role === 'manager') {
    // Managers see feedback they sent/received + their team's feedback
    const teamMemberIds = demoUsers.filter(u => u.manager_id === userId).map(u => u.id);
    return demoFeedback.filter(f => 
      f.from_user_id === userId || 
      f.to_user_id === userId ||
      teamMemberIds.includes(f.to_user_id)
    );
  } else {
    // Employees see feedback they sent or received
    return demoFeedback.filter(f => f.to_user_id === userId || f.from_user_id === userId);
  }
}

export function getDemoReviewsByUserId(userId: number) {
  const user = getDemoUserById(userId);
  if (!user) return [];
  
  // For demo purposes, show more data based on role
  if (user.role === 'hr') {
    // HR sees all reviews
    return demoReviews;
  } else if (user.role === 'manager') {
    // Managers see their own review + their team's reviews
    const teamMemberIds = demoUsers.filter(u => u.manager_id === userId).map(u => u.id);
    return demoReviews.filter(r => 
      r.employee_id === userId || 
      teamMemberIds.includes(r.employee_id)
    );
  } else {
    // Employees see only their own reviews
    return demoReviews.filter(r => r.employee_id === userId);
  }
}

export function getDemoTeamMembersByManagerId(managerId: number) {
  const teamMembers = demoUsers.filter(u => u.manager_id === managerId);
  
  // Enrich with performance data
  return teamMembers.map(member => {
    const review = demoReviews.find(r => r.employee_id === member.id);
    const goals = getDemoGoalsByUserId(member.id);
    const feedback = getDemoFeedbackByUserId(member.id);
    
    return {
      ...member,
      performance_rating: review?.overall_rating || 3.0,
      goals_count: goals.length,
      goals_on_track: goals.filter(g => g.status === 'on_track' || g.status === 'completed').length,
      feedback_count: feedback.length,
      recent_feedback: feedback.slice(0, 3)
    };
  });
}

export function getDemoTeamHealthByManagerId(managerId: number) {
  const teamMembers = getDemoTeamMembersByManagerId(managerId);
  
  if (teamMembers.length === 0) {
    return demoTeamData.teamHealth;
  }
  
  // Calculate real metrics from team data
  const avgPerformance = teamMembers.reduce((sum, m) => sum + (m.performance_rating || 3.0), 0) / teamMembers.length;
  const performanceScore = Math.round(avgPerformance * 20); // Convert to 0-100 scale
  
  const goalsOnTrack = teamMembers.reduce((sum, m) => sum + m.goals_on_track, 0);
  const totalGoals = teamMembers.reduce((sum, m) => sum + m.goals_count, 0);
  const goalCompletionRate = totalGoals > 0 ? Math.round((goalsOnTrack / totalGoals) * 100) : 0;
  
  return {
    overallScore: Math.round((performanceScore * 0.4 + goalCompletionRate * 0.3 + 85 * 0.3)),
    engagement: 85,
    performance: performanceScore,
    satisfaction: 79,
    goalCompletion: goalCompletionRate
  };
}

export function getAllDemoManagers() {
  return demoUsers.filter(u => u.role === 'manager');
}

export function getDemoCompanyMetrics() {
  // Calculate real metrics from demo data
  const employees = demoUsers.filter(u => u.role === 'employee');
  const reviews = demoReviews;
  
  const avgRating = reviews.reduce((sum, r) => sum + r.overall_rating, 0) / reviews.length;
  const highPerformers = reviews.filter(r => r.overall_rating >= 4.0).length;
  const lowPerformers = reviews.filter(r => r.overall_rating < 3.0).length;
  
  return {
    totalEmployees: employees.length,
    averageRating: Math.round(avgRating * 10) / 10,
    completedReviews: reviews.length,
    pendingReviews: employees.length - reviews.length,
    highPerformers,
    averagePerformers: reviews.length - highPerformers - lowPerformers,
    lowPerformers
  };
}

export function isDemoMode() {
  // Demo mode when no database is configured
  return !process.env.POSTGRES_URL && !process.env.DATABASE_PATH;
}
