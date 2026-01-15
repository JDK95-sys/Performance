/**
 * Demo Data Store
 * In-memory data storage for demo/presentation mode
 * No database required! Fully populated with rich, realistic data.
 */

// Demo users - 20 employees + 3 login users (23 total) - all fully populated
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
    bio: 'Experienced full-stack developer passionate about building scalable systems. Specializes in React, Node.js, and cloud architecture. Led the migration to microservices architecture.',
    manager_id: 2,
    performance_rating: 4.2,
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'PostgreSQL'],
    location: 'San Francisco, CA',
    hire_date: '2021-03-15'
  },
  {
    id: 2,
    email: 'manager@company.com',
    name: 'Sarah Johnson',
    role: 'manager',
    department: 'Engineering',
    title: 'Engineering Manager',
    experience_years: 8,
    bio: 'Leading high-performance engineering teams to deliver exceptional results. Former Principal Engineer with deep technical expertise and proven track record of building teams.',
    manager_id: null,
    performance_rating: 4.5,
    skills: ['Leadership', 'Team Building', 'System Design', 'Agile', 'Mentoring'],
    location: 'San Francisco, CA',
    hire_date: '2018-01-10'
  },
  {
    id: 3,
    email: 'admin@company.com',
    name: 'HR Admin',
    role: 'hr',
    department: 'Human Resources',
    title: 'HR Director',
    experience_years: 10,
    bio: 'Strategic HR leadership focused on employee development and culture. Implemented performance management system and diversity initiatives.',
    manager_id: null,
    performance_rating: 4.8,
    skills: ['HR Strategy', 'Talent Management', 'Employee Relations', 'DEI', 'Compensation'],
    location: 'San Francisco, CA',
    hire_date: '2016-06-01'
  },
  
  // Engineering Team (10 employees)
  {
    id: 4,
    email: 'emily.chen@company.com',
    name: 'Emily Chen',
    role: 'employee',
    department: 'Engineering',
    title: 'Software Engineer',
    experience_years: 3,
    bio: 'Full-stack developer with focus on frontend technologies. Built the new dashboard UI and improved page load times by 60%.',
    manager_id: 2,
    performance_rating: 4.5,
    skills: ['React', 'JavaScript', 'CSS', 'GraphQL', 'Jest'],
    location: 'San Francisco, CA',
    hire_date: '2023-02-01'
  },
  {
    id: 5,
    email: 'michael.brown@company.com',
    name: 'Michael Brown',
    role: 'employee',
    department: 'Engineering',
    title: 'Junior Software Engineer',
    experience_years: 1,
    bio: 'Recent graduate eager to learn. Working on API development and improving test coverage. Completed bootcamp specializing in Python and Django.',
    manager_id: 2,
    performance_rating: 3.8,
    skills: ['Python', 'Django', 'REST APIs', 'Git', 'MySQL'],
    location: 'Remote - Austin, TX',
    hire_date: '2025-01-15'
  },
  {
    id: 6,
    email: 'david.martinez@company.com',
    name: 'David Martinez',
    role: 'employee',
    department: 'Engineering',
    title: 'Senior Software Engineer',
    experience_years: 6,
    bio: 'Backend specialist with expertise in distributed systems. Architected the current payment processing system handling 10M+ transactions monthly.',
    manager_id: 2,
    performance_rating: 4.3,
    skills: ['Java', 'Kubernetes', 'Kafka', 'Redis', 'Microservices', 'AWS'],
    location: 'New York, NY',
    hire_date: '2020-08-01'
  },
  {
    id: 7,
    email: 'jennifer.lee@company.com',
    name: 'Jennifer Lee',
    role: 'employee',
    department: 'Engineering',
    title: 'Principal Engineer',
    experience_years: 10,
    bio: 'Technical leader driving architecture decisions across the organization. Previously at Google and Facebook. Expert in system design and scalability.',
    manager_id: 2,
    performance_rating: 4.7,
    skills: ['System Design', 'Go', 'Distributed Systems', 'Performance Optimization', 'Mentoring'],
    location: 'San Francisco, CA',
    hire_date: '2019-03-01'
  },
  {
    id: 8,
    email: 'robert.garcia@company.com',
    name: 'Robert Garcia',
    role: 'employee',
    department: 'Engineering',
    title: 'Software Engineer',
    experience_years: 4,
    bio: 'Fullstack engineer working on core product features. Implemented real-time collaboration features using WebSockets.',
    manager_id: 2,
    performance_rating: 4.0,
    skills: ['TypeScript', 'Node.js', 'React', 'WebSockets', 'MongoDB'],
    location: 'Los Angeles, CA',
    hire_date: '2022-04-15'
  },
  {
    id: 9,
    email: 'lisa.anderson@company.com',
    name: 'Lisa Anderson',
    role: 'employee',
    department: 'Engineering',
    title: 'QA Engineer',
    experience_years: 5,
    bio: 'Quality champion ensuring product excellence. Built automated testing framework that increased test coverage from 40% to 85%.',
    manager_id: 2,
    performance_rating: 4.2,
    skills: ['Selenium', 'Cypress', 'Test Automation', 'CI/CD', 'Performance Testing'],
    location: 'Seattle, WA',
    hire_date: '2021-07-01'
  },
  {
    id: 10,
    email: 'james.wilson@company.com',
    name: 'James Wilson',
    role: 'employee',
    department: 'Engineering',
    title: 'DevOps Engineer',
    experience_years: 7,
    bio: 'Infrastructure expert focused on reliability and automation. Reduced deployment time by 75% and achieved 99.99% uptime.',
    manager_id: 2,
    performance_rating: 4.4,
    skills: ['Kubernetes', 'Terraform', 'AWS', 'CI/CD', 'Monitoring', 'Docker'],
    location: 'Remote - Portland, OR',
    hire_date: '2019-11-01'
  },
  {
    id: 11,
    email: 'maria.rodriguez@company.com',
    name: 'Maria Rodriguez',
    role: 'employee',
    department: 'Engineering',
    title: 'Frontend Developer',
    experience_years: 3,
    bio: 'UI/UX focused developer creating delightful user experiences. Redesigned the onboarding flow increasing completion rate by 45%.',
    manager_id: 2,
    performance_rating: 4.1,
    skills: ['React', 'TypeScript', 'CSS/SCSS', 'Figma', 'Accessibility'],
    location: 'Chicago, IL',
    hire_date: '2023-05-01'
  },
  {
    id: 12,
    email: 'william.taylor@company.com',
    name: 'William Taylor',
    role: 'employee',
    department: 'Engineering',
    title: 'Backend Developer',
    experience_years: 5,
    bio: 'API architect designing scalable backend systems. Built the GraphQL API layer serving millions of requests daily.',
    manager_id: 2,
    performance_rating: 4.3,
    skills: ['Node.js', 'GraphQL', 'PostgreSQL', 'Redis', 'API Design'],
    location: 'Boston, MA',
    hire_date: '2021-09-15'
  },
  {
    id: 13,
    email: 'patricia.thomas@company.com',
    name: 'Patricia Thomas',
    role: 'employee',
    department: 'Engineering',
    title: 'Software Engineer',
    experience_years: 2,
    bio: 'Growing engineer contributing to feature development. Currently working on improving search functionality and learning system architecture.',
    manager_id: 2,
    performance_rating: 3.9,
    skills: ['Python', 'Flask', 'SQL', 'Docker', 'Git'],
    location: 'Remote - Denver, CO',
    hire_date: '2024-03-01'
  },

  // Product Team (5 employees)
  {
    id: 14,
    email: 'jason.rodriguez@company.com',
    name: 'Jason Rodriguez',
    role: 'employee',
    department: 'Product',
    title: 'Senior Product Manager',
    experience_years: 6,
    bio: 'Product leader with successful track record of launching features that drive user growth. Led launch of mobile app with 1M+ downloads.',
    manager_id: 2,
    performance_rating: 4.4,
    skills: ['Product Strategy', 'User Research', 'A/B Testing', 'Analytics', 'Roadmap Planning'],
    location: 'San Francisco, CA',
    hire_date: '2020-05-01'
  },
  {
    id: 15,
    email: 'sarah.lewis@company.com',
    name: 'Sarah Lewis',
    role: 'employee',
    department: 'Product',
    title: 'Product Manager',
    experience_years: 4,
    bio: 'Data-driven PM focused on analytics platform. Increased feature adoption by 120% through user-centric design approach.',
    manager_id: 2,
    performance_rating: 4.2,
    skills: ['Product Management', 'SQL', 'Mixpanel', 'User Stories', 'Agile'],
    location: 'New York, NY',
    hire_date: '2022-01-10'
  },
  {
    id: 16,
    email: 'brian.lee@company.com',
    name: 'Brian Lee',
    role: 'employee',
    department: 'Product',
    title: 'Product Designer',
    experience_years: 5,
    bio: 'Design systems expert creating consistent, beautiful interfaces. Built design system used across all products.',
    manager_id: 2,
    performance_rating: 4.5,
    skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Prototyping', 'User Testing'],
    location: 'Los Angeles, CA',
    hire_date: '2021-06-01'
  },
  {
    id: 17,
    email: 'michelle.walker@company.com',
    name: 'Michelle Walker',
    role: 'employee',
    department: 'Product',
    title: 'UX Researcher',
    experience_years: 4,
    bio: 'User research specialist uncovering insights that drive product decisions. Conducted 200+ user interviews and usability tests.',
    manager_id: 2,
    performance_rating: 4.0,
    skills: ['User Research', 'Usability Testing', 'Surveys', 'Data Analysis', 'UserTesting'],
    location: 'Seattle, WA',
    hire_date: '2022-08-01'
  },
  {
    id: 18,
    email: 'amanda.allen@company.com',
    name: 'Amanda Allen',
    role: 'employee',
    department: 'Product',
    title: 'Senior UI/UX Designer',
    experience_years: 6,
    bio: 'Award-winning designer creating intuitive interfaces. Portfolio includes redesign that increased conversion by 35%.',
    manager_id: 2,
    performance_rating: 4.6,
    skills: ['UI Design', 'UX Design', 'Sketch', 'Adobe XD', 'Animation', 'Interaction Design'],
    location: 'San Francisco, CA',
    hire_date: '2020-02-15'
  },

  // Sales Team (3 employees)
  {
    id: 19,
    email: 'rebecca.scott@company.com',
    name: 'Rebecca Scott',
    role: 'employee',
    department: 'Sales',
    title: 'Senior Sales Executive',
    experience_years: 7,
    bio: 'Top performer consistently exceeding quota by 150%+. Closed $5M in deals last quarter. Enterprise sales specialist.',
    manager_id: 2,
    performance_rating: 4.7,
    skills: ['Enterprise Sales', 'Salesforce', 'Negotiation', 'Account Management', 'Prospecting'],
    location: 'New York, NY',
    hire_date: '2019-04-01'
  },
  {
    id: 20,
    email: 'gregory.green@company.com',
    name: 'Gregory Green',
    role: 'employee',
    department: 'Sales',
    title: 'Account Executive',
    experience_years: 5,
    bio: 'Relationship builder focused on mid-market accounts. Achieved 130% of quota and expanded 15 existing accounts.',
    manager_id: 2,
    performance_rating: 4.3,
    skills: ['B2B Sales', 'CRM', 'Pipeline Management', 'Cold Outreach', 'Closing'],
    location: 'Chicago, IL',
    hire_date: '2021-03-01'
  },
  {
    id: 21,
    email: 'mark.carter@company.com',
    name: 'Mark Carter',
    role: 'employee',
    department: 'Sales',
    title: 'Enterprise Account Executive',
    experience_years: 9,
    bio: 'Enterprise specialist with proven track record at Fortune 500 companies. Closed largest deal in company history at $10M ARR.',
    manager_id: 2,
    performance_rating: 4.8,
    skills: ['Enterprise Sales', 'Strategic Partnerships', 'Executive Relationships', 'Contract Negotiation'],
    location: 'San Francisco, CA',
    hire_date: '2018-07-01'
  },

  // Marketing Team (2 employees)
  {
    id: 22,
    email: 'kenneth.turner@company.com',
    name: 'Kenneth Turner',
    role: 'employee',
    department: 'Marketing',
    title: 'Marketing Manager',
    experience_years: 6,
    bio: 'Growth marketer driving customer acquisition. Implemented campaigns that reduced CAC by 40% while increasing lead quality.',
    manager_id: 2,
    performance_rating: 4.3,
    skills: ['Growth Marketing', 'SEO', 'Content Marketing', 'Google Analytics', 'Marketing Automation'],
    location: 'Austin, TX',
    hire_date: '2020-10-01'
  },
  {
    id: 23,
    email: 'margaret.parker@company.com',
    name: 'Margaret Parker',
    role: 'employee',
    department: 'Marketing',
    title: 'Brand Manager',
    experience_years: 7,
    bio: 'Brand strategist building company identity and awareness. Led rebrand initiative that increased brand recognition by 200%.',
    manager_id: 2,
    performance_rating: 4.5,
    skills: ['Brand Strategy', 'Campaign Management', 'Creative Direction', 'Social Media', 'PR'],
    location: 'Los Angeles, CA',
    hire_date: '2019-09-01'
  }
];

// Demo goals - 45 comprehensive goals across all employees
export const demoGoals = [
  // John Smith (id: 1) - Senior Software Engineer
  {
    id: 1,
    owner_id: 1,
    title: 'Improve Code Quality Metrics',
    description: 'Reduce technical debt and improve test coverage to 80% across all microservices',
    goal_type: 'performance',
    category: 'technical',
    status: 'in_progress',
    priority: 'high',
    progress_percentage: 65,
    due_date: '2026-06-30',
    visibility: 'team',
    keyResults: [
      { id: 1, title: 'Increase test coverage to 80%', current_value: 65, target_value: 80, unit: '%' },
      { id: 2, title: 'Reduce code complexity from 12 to 8', current_value: 12, target_value: 8, unit: 'points' },
      { id: 3, title: 'Eliminate critical security vulnerabilities', current_value: 3, target_value: 0, unit: 'issues' }
    ]
  },
  {
    id: 2,
    owner_id: 1,
    title: 'Learn AI/ML Fundamentals',
    description: 'Complete online courses and build practical ML projects to integrate AI features',
    goal_type: 'development',
    category: 'professional',
    status: 'in_progress',
    priority: 'medium',
    progress_percentage: 40,
    due_date: '2026-12-31',
    visibility: 'private',
    keyResults: [
      { id: 4, title: 'Complete 3 ML courses', current_value: 1, target_value: 3, unit: 'courses' },
      { id: 5, title: 'Build 2 ML demo projects', current_value: 0, target_value: 2, unit: 'projects' }
    ]
  },
  {
    id: 3,
    owner_id: 1,
    title: 'Mentor Junior Developers',
    description: 'Provide guidance and mentorship to help junior team members grow their skills',
    goal_type: 'development',
    category: 'leadership',
    status: 'on_track',
    priority: 'high',
    progress_percentage: 75,
    due_date: '2026-09-30',
    visibility: 'team',
    keyResults: [
      { id: 6, title: 'Conduct weekly 1-on-1s', current_value: 18, target_value: 24, unit: 'sessions' },
      { id: 7, title: 'Code review response time < 4 hours', current_value: 3, target_value: 4, unit: 'hours' }
    ]
  },

  // Sarah Johnson (id: 2) - Engineering Manager
  {
    id: 4,
    owner_id: 2,
    title: 'Build High-Performing Engineering Culture',
    description: 'Increase team engagement and reduce turnover through better processes and culture',
    goal_type: 'performance',
    category: 'leadership',
    status: 'in_progress',
    priority: 'high',
    progress_percentage: 55,
    due_date: '2026-12-31',
    visibility: 'team',
    keyResults: [
      { id: 8, title: 'Achieve 85% team engagement score', current_value: 78, target_value: 85, unit: '%' },
      { id: 9, title: 'Reduce voluntary attrition to <5%', current_value: 8, target_value: 5, unit: '%' },
      { id: 10, title: 'Implement quarterly team building', current_value: 1, target_value: 4, unit: 'events' }
    ]
  },
  {
    id: 5,
    owner_id: 2,
    title: 'Scale Engineering Team',
    description: 'Grow team from 20 to 30 engineers while maintaining quality bar',
    goal_type: 'performance',
    category: 'operational',
    status: 'in_progress',
    priority: 'high',
    progress_percentage: 30,
    due_date: '2026-10-31',
    visibility: 'management',
    keyResults: [
      { id: 11, title: 'Hire 10 senior engineers', current_value: 3, target_value: 10, unit: 'hires' },
      { id: 12, title: 'Maintain offer acceptance rate >80%', current_value: 75, target_value: 80, unit: '%' },
      { id: 13, title: 'Time to hire < 30 days', current_value: 42, target_value: 30, unit: 'days' }
    ]
  },

  // Emily Chen (id: 4) - Software Engineer
  {
    id: 6,
    owner_id: 4,
    title: 'Master Advanced React Patterns',
    description: 'Deep dive into React performance optimization and advanced patterns',
    goal_type: 'development',
    category: 'technical',
    status: 'completed',
    priority: 'medium',
    progress_percentage: 100,
    due_date: '2026-03-31',
    visibility: 'team',
    keyResults: [
      { id: 14, title: 'Implement 5 performance optimizations', current_value: 5, target_value: 5, unit: 'items' },
      { id: 15, title: 'Reduce bundle size by 30%', current_value: 35, target_value: 30, unit: '%' },
      { id: 16, title: 'Lighthouse score > 95', current_value: 97, target_value: 95, unit: 'score' }
    ]
  },
  {
    id: 7,
    owner_id: 4,
    title: 'Lead Dashboard Redesign',
    description: 'Redesign and rebuild user dashboard with modern UI and better UX',
    goal_type: 'performance',
    category: 'technical',
    status: 'in_progress',
    priority: 'high',
    progress_percentage: 80,
    due_date: '2026-05-15',
    visibility: 'team',
    keyResults: [
      { id: 17, title: 'Complete design mockups', current_value: 8, target_value: 8, unit: 'screens' },
      { id: 18, title: 'Implement responsive components', current_value: 12, target_value: 15, unit: 'components' },
      { id: 19, title: 'User satisfaction score > 4.5', current_value: 0, target_value: 4.5, unit: 'rating' }
    ]
  },

  // Michael Brown (id: 5) - Junior Software Engineer
  {
    id: 8,
    owner_id: 5,
    title: 'Build Strong Backend Foundation',
    description: 'Master Django framework and REST API best practices',
    goal_type: 'development',
    category: 'technical',
    status: 'in_progress',
    priority: 'high',
    progress_percentage: 45,
    due_date: '2026-08-31',
    visibility: 'private',
    keyResults: [
      { id: 20, title: 'Complete Django advanced course', current_value: 60, target_value: 100, unit: '%' },
      { id: 21, title: 'Build 3 production APIs', current_value: 1, target_value: 3, unit: 'APIs' },
      { id: 22, title: 'Achieve 70% test coverage', current_value: 45, target_value: 70, unit: '%' }
    ]
  },
  {
    id: 9,
    owner_id: 5,
    title: 'Contribute to Open Source',
    description: 'Make meaningful contributions to open source projects to build reputation',
    goal_type: 'development',
    category: 'professional',
    status: 'in_progress',
    priority: 'low',
    progress_percentage: 25,
    due_date: '2026-12-31',
    visibility: 'team',
    keyResults: [
      { id: 23, title: 'Submit 10 pull requests', current_value: 3, target_value: 10, unit: 'PRs' },
      { id: 24, title: 'Get 5 PRs merged', current_value: 1, target_value: 5, unit: 'merged' }
    ]
  },

  // David Martinez (id: 6) - Senior Software Engineer
  {
    id: 10,
    owner_id: 6,
    title: 'Modernize Payment System Architecture',
    description: 'Refactor legacy payment processing to handle 50M transactions/month',
    goal_type: 'performance',
    category: 'technical',
    status: 'in_progress',
    priority: 'critical',
    progress_percentage: 60,
    due_date: '2026-07-31',
    visibility: 'team',
    keyResults: [
      { id: 25, title: 'Handle 50M transactions/month', current_value: 35, target_value: 50, unit: 'M txns' },
      { id: 26, title: 'Reduce processing latency to <100ms', current_value: 150, target_value: 100, unit: 'ms' },
      { id: 27, title: 'Achieve 99.99% uptime', current_value: 99.95, target_value: 99.99, unit: '%' }
    ]
  },
  {
    id: 11,
    owner_id: 6,
    title: 'Become Kubernetes Expert',
    description: 'Master Kubernetes and cloud-native patterns for distributed systems',
    goal_type: 'development',
    category: 'technical',
    status: 'on_track',
    priority: 'medium',
    progress_percentage: 70,
    due_date: '2026-06-30',
    visibility: 'team',
    keyResults: [
      { id: 28, title: 'Get CKA certification', current_value: 85, target_value: 100, unit: '%' },
      { id: 29, title: 'Migrate 5 services to K8s', current_value: 3, target_value: 5, unit: 'services' }
    ]
  },

  // Jennifer Lee (id: 7) - Principal Engineer
  {
    id: 12,
    owner_id: 7,
    title: 'Define Technical Strategy 2026-2028',
    description: 'Create comprehensive 3-year technical roadmap and architecture vision',
    goal_type: 'performance',
    category: 'leadership',
    status: 'in_progress',
    priority: 'critical',
    progress_percentage: 50,
    due_date: '2026-06-30',
    visibility: 'management',
    keyResults: [
      { id: 30, title: 'Complete architecture review', current_value: 1, target_value: 1, unit: 'review' },
      { id: 31, title: 'Present to executive team', current_value: 0, target_value: 1, unit: 'presentation' },
      { id: 32, title: 'Get buy-in from 100% of eng leadership', current_value: 80, target_value: 100, unit: '%' }
    ]
  },
  {
    id: 13,
    owner_id: 7,
    title: 'Mentor Senior Engineers',
    description: 'Develop next generation of technical leadership through mentorship',
    goal_type: 'development',
    category: 'leadership',
    status: 'on_track',
    priority: 'high',
    progress_percentage: 65,
    due_date: '2026-12-31',
    visibility: 'team',
    keyResults: [
      { id: 33, title: 'Mentor 4 senior engineers', current_value: 3, target_value: 4, unit: 'mentees' },
      { id: 34, title: 'Promote 2 to staff engineer', current_value: 0, target_value: 2, unit: 'promotions' }
    ]
  },

  // Robert Garcia (id: 8) - Software Engineer
  {
    id: 14,
    owner_id: 8,
    title: 'Build Real-time Collaboration Features',
    description: 'Implement WebSocket-based real-time collaboration with conflict resolution',
    goal_type: 'performance',
    category: 'technical',
    status: 'in_progress',
    priority: 'high',
    progress_percentage: 55,
    due_date: '2026-08-31',
    visibility: 'team',
    keyResults: [
      { id: 35, title: 'Support 100 concurrent users', current_value: 50, target_value: 100, unit: 'users' },
      { id: 36, title: 'Message latency < 50ms', current_value: 80, target_value: 50, unit: 'ms' },
      { id: 37, title: 'Zero data conflicts', current_value: 2, target_value: 0, unit: 'conflicts' }
    ]
  },
  {
    id: 15,
    owner_id: 8,
    title: 'Master TypeScript Advanced Types',
    description: 'Deep dive into TypeScript type system and functional programming',
    goal_type: 'development',
    category: 'technical',
    status: 'in_progress',
    priority: 'medium',
    progress_percentage: 40,
    due_date: '2026-09-30',
    visibility: 'private',
    keyResults: [
      { id: 38, title: 'Refactor 10 components with strict types', current_value: 4, target_value: 10, unit: 'components' },
      { id: 39, title: 'Zero type errors in codebase', current_value: 12, target_value: 0, unit: 'errors' }
    ]
  },

  // Lisa Anderson (id: 9) - QA Engineer
  {
    id: 16,
    owner_id: 9,
    title: 'Achieve 90% Test Coverage',
    description: 'Expand automated test suite to cover 90% of critical user paths',
    goal_type: 'performance',
    category: 'quality',
    status: 'in_progress',
    priority: 'high',
    progress_percentage: 70,
    due_date: '2026-06-30',
    visibility: 'team',
    keyResults: [
      { id: 40, title: 'E2E test coverage 90%', current_value: 78, target_value: 90, unit: '%' },
      { id: 41, title: 'Unit test coverage 85%', current_value: 82, target_value: 85, unit: '%' },
      { id: 42, title: 'Reduce test flakiness to <2%', current_value: 5, target_value: 2, unit: '%' }
    ]
  },
  {
    id: 17,
    owner_id: 9,
    title: 'Implement Visual Regression Testing',
    description: 'Set up automated visual regression testing for UI components',
    goal_type: 'performance',
    category: 'quality',
    status: 'on_track',
    priority: 'medium',
    progress_percentage: 85,
    due_date: '2026-04-30',
    visibility: 'team',
    keyResults: [
      { id: 43, title: 'Cover 50 critical screens', current_value: 45, target_value: 50, unit: 'screens' },
      { id: 44, title: 'Run tests on every PR', current_value: 1, target_value: 1, unit: 'integration' }
    ]
  },

  // James Wilson (id: 10) - DevOps Engineer
  {
    id: 18,
    owner_id: 10,
    title: 'Achieve 99.99% Uptime',
    description: 'Improve infrastructure reliability and monitoring to achieve four nines',
    goal_type: 'performance',
    category: 'operational',
    status: 'in_progress',
    priority: 'critical',
    progress_percentage: 80,
    due_date: '2026-12-31',
    visibility: 'team',
    keyResults: [
      { id: 45, title: 'System uptime 99.99%', current_value: 99.95, target_value: 99.99, unit: '%' },
      { id: 46, title: 'MTTR < 15 minutes', current_value: 25, target_value: 15, unit: 'min' },
      { id: 47, title: 'Zero critical incidents', current_value: 1, target_value: 0, unit: 'incidents' }
    ]
  },
  {
    id: 19,
    owner_id: 10,
    title: 'Automate All Deployments',
    description: 'Implement fully automated CI/CD pipeline with zero-downtime deployments',
    goal_type: 'performance',
    category: 'operational',
    status: 'completed',
    priority: 'high',
    progress_percentage: 100,
    due_date: '2026-03-31',
    visibility: 'team',
    keyResults: [
      { id: 48, title: 'Deploy time < 5 minutes', current_value: 4, target_value: 5, unit: 'min' },
      { id: 49, title: 'Automate 100% of deployments', current_value: 100, target_value: 100, unit: '%' },
      { id: 50, title: 'Zero failed deployments', current_value: 0, target_value: 0, unit: 'failures' }
    ]
  },

  // Maria Rodriguez (id: 11) - Frontend Developer
  {
    id: 20,
    owner_id: 11,
    title: 'Improve Accessibility Compliance',
    description: 'Achieve WCAG 2.1 AA compliance across all product pages',
    goal_type: 'performance',
    category: 'quality',
    status: 'in_progress',
    priority: 'high',
    progress_percentage: 60,
    due_date: '2026-07-31',
    visibility: 'team',
    keyResults: [
      { id: 51, title: 'Pass WCAG 2.1 AA audit', current_value: 75, target_value: 100, unit: '%' },
      { id: 52, title: 'Fix 50 accessibility issues', current_value: 32, target_value: 50, unit: 'issues' },
      { id: 53, title: 'Implement keyboard navigation', current_value: 8, target_value: 12, unit: 'flows' }
    ]
  },
  {
    id: 21,
    owner_id: 11,
    title: 'Learn Design Systems',
    description: 'Master design systems and component library architecture',
    goal_type: 'development',
    category: 'technical',
    status: 'in_progress',
    priority: 'medium',
    progress_percentage: 50,
    due_date: '2026-09-30',
    visibility: 'team',
    keyResults: [
      { id: 54, title: 'Build 20 reusable components', current_value: 12, target_value: 20, unit: 'components' },
      { id: 55, title: 'Create design tokens system', current_value: 1, target_value: 1, unit: 'system' }
    ]
  },

  // William Taylor (id: 12) - Backend Developer
  {
    id: 22,
    owner_id: 12,
    title: 'Scale GraphQL API Performance',
    description: 'Optimize GraphQL layer to handle 10M requests per day',
    goal_type: 'performance',
    category: 'technical',
    status: 'in_progress',
    priority: 'high',
    progress_percentage: 65,
    due_date: '2026-06-30',
    visibility: 'team',
    keyResults: [
      { id: 56, title: 'Handle 10M requests/day', current_value: 7, target_value: 10, unit: 'M req' },
      { id: 57, title: 'P95 latency < 100ms', current_value: 150, target_value: 100, unit: 'ms' },
      { id: 58, title: 'Implement DataLoader caching', current_value: 8, target_value: 12, unit: 'resolvers' }
    ]
  },
  {
    id: 23,
    owner_id: 12,
    title: 'Database Performance Optimization',
    description: 'Optimize database queries and implement proper indexing strategy',
    goal_type: 'performance',
    category: 'technical',
    status: 'on_track',
    priority: 'medium',
    progress_percentage: 75,
    due_date: '2026-05-31',
    visibility: 'team',
    keyResults: [
      { id: 59, title: 'Reduce slow queries by 90%', current_value: 70, target_value: 90, unit: '%' },
      { id: 60, title: 'Add indexes to 20 tables', current_value: 16, target_value: 20, unit: 'tables' }
    ]
  },

  // Patricia Thomas (id: 13) - Software Engineer
  {
    id: 24,
    owner_id: 13,
    title: 'Improve Search Functionality',
    description: 'Implement Elasticsearch-based search with autocomplete and filters',
    goal_type: 'performance',
    category: 'technical',
    status: 'in_progress',
    priority: 'medium',
    progress_percentage: 40,
    due_date: '2026-08-31',
    visibility: 'team',
    keyResults: [
      { id: 61, title: 'Search response time < 200ms', current_value: 450, target_value: 200, unit: 'ms' },
      { id: 62, title: 'Implement 10 search filters', current_value: 4, target_value: 10, unit: 'filters' },
      { id: 63, title: 'User satisfaction > 4.0', current_value: 0, target_value: 4.0, unit: 'rating' }
    ]
  },
  {
    id: 25,
    owner_id: 13,
    title: 'Learn System Architecture',
    description: 'Study distributed systems patterns and scalability principles',
    goal_type: 'development',
    category: 'technical',
    status: 'in_progress',
    priority: 'low',
    progress_percentage: 30,
    due_date: '2026-12-31',
    visibility: 'private',
    keyResults: [
      { id: 64, title: 'Read 5 architecture books', current_value: 2, target_value: 5, unit: 'books' },
      { id: 65, title: 'Design 3 system architectures', current_value: 1, target_value: 3, unit: 'designs' }
    ]
  },

  // Jason Rodriguez (id: 14) - Senior Product Manager
  {
    id: 26,
    owner_id: 14,
    title: 'Launch Mobile App V2',
    description: 'Ship redesigned mobile app with 50% better engagement metrics',
    goal_type: 'performance',
    category: 'product',
    status: 'in_progress',
    priority: 'critical',
    progress_percentage: 70,
    due_date: '2026-06-30',
    visibility: 'company',
    keyResults: [
      { id: 66, title: 'Launch to 100% of users', current_value: 50, target_value: 100, unit: '%' },
      { id: 67, title: 'DAU increase by 50%', current_value: 30, target_value: 50, unit: '%' },
      { id: 68, title: 'App store rating > 4.5', current_value: 4.2, target_value: 4.5, unit: 'rating' }
    ]
  },
  {
    id: 27,
    owner_id: 14,
    title: 'Develop Product Vision 2027',
    description: 'Create strategic product roadmap aligned with company vision',
    goal_type: 'performance',
    category: 'leadership',
    status: 'in_progress',
    priority: 'high',
    progress_percentage: 45,
    due_date: '2026-09-30',
    visibility: 'management',
    keyResults: [
      { id: 69, title: 'Complete market research', current_value: 1, target_value: 1, unit: 'research' },
      { id: 70, title: 'Get executive approval', current_value: 0, target_value: 1, unit: 'approval' }
    ]
  },

  // Sarah Lewis (id: 15) - Product Manager
  {
    id: 28,
    owner_id: 15,
    title: 'Increase Analytics Dashboard Adoption',
    description: 'Drive 80% user adoption of new analytics features',
    goal_type: 'performance',
    category: 'product',
    status: 'in_progress',
    priority: 'high',
    progress_percentage: 55,
    due_date: '2026-07-31',
    visibility: 'team',
    keyResults: [
      { id: 71, title: 'User adoption 80%', current_value: 48, target_value: 80, unit: '%' },
      { id: 72, title: 'Daily active users 1000+', current_value: 650, target_value: 1000, unit: 'users' },
      { id: 73, title: 'NPS score > 50', current_value: 42, target_value: 50, unit: 'score' }
    ]
  },
  {
    id: 29,
    owner_id: 15,
    title: 'Master Data Analytics',
    description: 'Become proficient in SQL and data analysis for product decisions',
    goal_type: 'development',
    category: 'technical',
    status: 'on_track',
    priority: 'medium',
    progress_percentage: 70,
    due_date: '2026-08-31',
    visibility: 'private',
    keyResults: [
      { id: 74, title: 'Complete SQL advanced course', current_value: 80, target_value: 100, unit: '%' },
      { id: 75, title: 'Build 5 custom dashboards', current_value: 3, target_value: 5, unit: 'dashboards' }
    ]
  },

  // Brian Lee (id: 16) - Product Designer
  {
    id: 30,
    owner_id: 16,
    title: 'Build Comprehensive Design System',
    description: 'Create and document design system used across all products',
    goal_type: 'performance',
    category: 'design',
    status: 'in_progress',
    priority: 'high',
    progress_percentage: 60,
    due_date: '2026-08-31',
    visibility: 'company',
    keyResults: [
      { id: 76, title: 'Document 100 components', current_value: 65, target_value: 100, unit: 'components' },
      { id: 77, title: 'Achieve 90% design adoption', current_value: 70, target_value: 90, unit: '%' },
      { id: 78, title: 'Reduce design inconsistencies by 80%', current_value: 55, target_value: 80, unit: '%' }
    ]
  },
  {
    id: 31,
    owner_id: 16,
    title: 'Lead Accessibility Initiative',
    description: 'Champion accessibility best practices across design and engineering',
    goal_type: 'performance',
    category: 'quality',
    status: 'on_track',
    priority: 'medium',
    progress_percentage: 65,
    due_date: '2026-10-31',
    visibility: 'team',
    keyResults: [
      { id: 79, title: 'Train 20 team members', current_value: 14, target_value: 20, unit: 'people' },
      { id: 80, title: 'Audit 50 designs', current_value: 35, target_value: 50, unit: 'designs' }
    ]
  },

  // Michelle Walker (id: 17) - UX Researcher
  {
    id: 32,
    owner_id: 17,
    title: 'Establish User Research Program',
    description: 'Build systematic user research practice with continuous insights',
    goal_type: 'performance',
    category: 'research',
    status: 'in_progress',
    priority: 'high',
    progress_percentage: 50,
    due_date: '2026-09-30',
    visibility: 'team',
    keyResults: [
      { id: 81, title: 'Conduct 50 user interviews', current_value: 28, target_value: 50, unit: 'interviews' },
      { id: 82, title: 'Run 10 usability tests', current_value: 6, target_value: 10, unit: 'tests' },
      { id: 83, title: 'Present findings to leadership monthly', current_value: 3, target_value: 6, unit: 'presentations' }
    ]
  },

  // Amanda Allen (id: 18) - Senior UI/UX Designer
  {
    id: 33,
    owner_id: 18,
    title: 'Redesign Onboarding Experience',
    description: 'Create seamless onboarding flow to increase completion rate by 50%',
    goal_type: 'performance',
    category: 'design',
    status: 'in_progress',
    priority: 'critical',
    progress_percentage: 75,
    due_date: '2026-05-31',
    visibility: 'company',
    keyResults: [
      { id: 84, title: 'Completion rate 85%', current_value: 65, target_value: 85, unit: '%' },
      { id: 85, title: 'Time to value < 5 minutes', current_value: 8, target_value: 5, unit: 'min' },
      { id: 86, title: 'User satisfaction > 4.5', current_value: 3.8, target_value: 4.5, unit: 'rating' }
    ]
  },
  {
    id: 34,
    owner_id: 18,
    title: 'Mentor Junior Designers',
    description: 'Provide mentorship and guidance to help junior designers grow',
    goal_type: 'development',
    category: 'leadership',
    status: 'on_track',
    priority: 'medium',
    progress_percentage: 80,
    due_date: '2026-12-31',
    visibility: 'team',
    keyResults: [
      { id: 87, title: 'Hold weekly design critiques', current_value: 18, target_value: 24, unit: 'sessions' },
      { id: 88, title: 'Review 100% of junior work', current_value: 85, target_value: 100, unit: '%' }
    ]
  },

  // Rebecca Scott (id: 19) - Senior Sales Executive
  {
    id: 35,
    owner_id: 19,
    title: 'Exceed Q2 Sales Quota by 150%',
    description: 'Close $7.5M in new business to exceed quota by 150%',
    goal_type: 'performance',
    category: 'sales',
    status: 'on_track',
    priority: 'critical',
    progress_percentage: 80,
    due_date: '2026-06-30',
    visibility: 'team',
    keyResults: [
      { id: 89, title: 'Close $7.5M in deals', current_value: 6.2, target_value: 7.5, unit: 'M' },
      { id: 90, title: 'Win rate > 40%', current_value: 42, target_value: 40, unit: '%' },
      { id: 91, title: 'Average deal size $500K+', current_value: 520, target_value: 500, unit: 'K' }
    ]
  },
  {
    id: 36,
    owner_id: 19,
    title: 'Develop Enterprise Sales Playbook',
    description: 'Document best practices and strategies for enterprise sales',
    goal_type: 'performance',
    category: 'leadership',
    status: 'in_progress',
    priority: 'medium',
    progress_percentage: 60,
    due_date: '2026-08-31',
    visibility: 'team',
    keyResults: [
      { id: 92, title: 'Document 10 sales plays', current_value: 6, target_value: 10, unit: 'plays' },
      { id: 93, title: 'Train 5 sales reps', current_value: 3, target_value: 5, unit: 'reps' }
    ]
  },

  // Gregory Green (id: 20) - Account Executive
  {
    id: 37,
    owner_id: 20,
    title: 'Achieve 140% of Sales Quota',
    description: 'Close $2.8M in new and expansion deals',
    goal_type: 'performance',
    category: 'sales',
    status: 'in_progress',
    priority: 'high',
    progress_percentage: 65,
    due_date: '2026-06-30',
    visibility: 'team',
    keyResults: [
      { id: 94, title: 'New business $1.8M', current_value: 1.2, target_value: 1.8, unit: 'M' },
      { id: 95, title: 'Expansion revenue $1M', current_value: 0.7, target_value: 1.0, unit: 'M' },
      { id: 96, title: 'Maintain >30% win rate', current_value: 32, target_value: 30, unit: '%' }
    ]
  },
  {
    id: 38,
    owner_id: 20,
    title: 'Expand Key Accounts',
    description: 'Grow top 10 accounts by 50% through upsell and cross-sell',
    goal_type: 'performance',
    category: 'sales',
    status: 'on_track',
    priority: 'high',
    progress_percentage: 70,
    due_date: '2026-09-30',
    visibility: 'team',
    keyResults: [
      { id: 97, title: 'Upsell 8 accounts', current_value: 6, target_value: 8, unit: 'accounts' },
      { id: 98, title: 'Average expansion 50%', current_value: 42, target_value: 50, unit: '%' }
    ]
  },

  // Mark Carter (id: 21) - Enterprise Account Executive
  {
    id: 39,
    owner_id: 21,
    title: 'Close Fortune 100 Mega Deal',
    description: 'Land $15M ARR deal with Fortune 100 company',
    goal_type: 'performance',
    category: 'sales',
    status: 'in_progress',
    priority: 'critical',
    progress_percentage: 85,
    due_date: '2026-07-31',
    visibility: 'management',
    keyResults: [
      { id: 99, title: 'Reach legal stage', current_value: 1, target_value: 1, unit: 'milestone' },
      { id: 100, title: 'Get executive sponsor sign-off', current_value: 1, target_value: 1, unit: 'approval' },
      { id: 101, title: 'Close by July 31', current_value: 0, target_value: 1, unit: 'close' }
    ]
  },
  {
    id: 40,
    owner_id: 21,
    title: 'Build Strategic Partner Relationships',
    description: 'Establish partnerships with 3 major consulting firms',
    goal_type: 'performance',
    category: 'sales',
    status: 'on_track',
    priority: 'high',
    progress_percentage: 65,
    due_date: '2026-12-31',
    visibility: 'management',
    keyResults: [
      { id: 102, title: 'Sign 3 partner agreements', current_value: 2, target_value: 3, unit: 'partners' },
      { id: 103, title: 'Generate $2M in partner-sourced pipeline', current_value: 1.3, target_value: 2.0, unit: 'M' }
    ]
  },

  // Kenneth Turner (id: 22) - Marketing Manager
  {
    id: 41,
    owner_id: 22,
    title: 'Reduce Customer Acquisition Cost',
    description: 'Optimize marketing funnel to reduce CAC by 50% while maintaining lead quality',
    goal_type: 'performance',
    category: 'marketing',
    status: 'in_progress',
    priority: 'high',
    progress_percentage: 60,
    due_date: '2026-08-31',
    visibility: 'team',
    keyResults: [
      { id: 104, title: 'Reduce CAC to $500', current_value: 650, target_value: 500, unit: '$' },
      { id: 105, title: 'Maintain MQL quality >70%', current_value: 72, target_value: 70, unit: '%' },
      { id: 106, title: 'Increase organic traffic by 100%', current_value: 60, target_value: 100, unit: '%' }
    ]
  },
  {
    id: 42,
    owner_id: 22,
    title: 'Launch Content Marketing Program',
    description: 'Build comprehensive content strategy driving 50K monthly visitors',
    goal_type: 'performance',
    category: 'marketing',
    status: 'on_track',
    priority: 'medium',
    progress_percentage: 70,
    due_date: '2026-10-31',
    visibility: 'team',
    keyResults: [
      { id: 107, title: 'Publish 40 blog posts', current_value: 28, target_value: 40, unit: 'posts' },
      { id: 108, title: 'Reach 50K monthly visitors', current_value: 35, target_value: 50, unit: 'K visitors' },
      { id: 109, title: 'Generate 500 MQLs from content', current_value: 320, target_value: 500, unit: 'MQLs' }
    ]
  },

  // Margaret Parker (id: 23) - Brand Manager
  {
    id: 43,
    owner_id: 23,
    title: 'Execute Brand Refresh Campaign',
    description: 'Launch comprehensive rebrand with 300% increase in brand awareness',
    goal_type: 'performance',
    category: 'marketing',
    status: 'in_progress',
    priority: 'critical',
    progress_percentage: 75,
    due_date: '2026-06-30',
    visibility: 'company',
    keyResults: [
      { id: 110, title: 'Launch new brand identity', current_value: 90, target_value: 100, unit: '%' },
      { id: 111, title: 'Brand awareness increase 300%', current_value: 250, target_value: 300, unit: '%' },
      { id: 112, title: 'Social media engagement up 200%', current_value: 180, target_value: 200, unit: '%' }
    ]
  },
  {
    id: 44,
    owner_id: 23,
    title: 'Build Influencer Partnership Program',
    description: 'Establish relationships with 20 industry influencers for brand advocacy',
    goal_type: 'performance',
    category: 'marketing',
    status: 'on_track',
    priority: 'medium',
    progress_percentage: 65,
    due_date: '2026-09-30',
    visibility: 'team',
    keyResults: [
      { id: 113, title: 'Sign 20 influencer partners', current_value: 14, target_value: 20, unit: 'partners' },
      { id: 114, title: 'Generate 5M impressions', current_value: 3.2, target_value: 5.0, unit: 'M' },
      { id: 115, title: 'Drive 1000 qualified leads', current_value: 650, target_value: 1000, unit: 'leads' }
    ]
  },

  // HR Admin (id: 3) - HR Director
  {
    id: 45,
    owner_id: 3,
    title: 'Improve Employee Engagement to 90%',
    description: 'Implement initiatives to achieve 90% employee engagement score',
    goal_type: 'performance',
    category: 'people',
    status: 'in_progress',
    priority: 'critical',
    progress_percentage: 70,
    due_date: '2026-12-31',
    visibility: 'management',
    keyResults: [
      { id: 116, title: 'Engagement score 90%', current_value: 78, target_value: 90, unit: '%' },
      { id: 117, title: 'Reduce turnover to <8%', current_value: 12, target_value: 8, unit: '%' },
      { id: 118, title: 'eNPS score >50', current_value: 42, target_value: 50, unit: 'score' }
    ]
  }
];

// Demo feedback - 58 comprehensive feedback entries showing active performance culture
export const demoFeedback = [
  // Feedback to John Smith (id: 1)
  {
    id: 1,
    from_user_id: 2,
    from_user_name: 'Sarah Johnson',
    to_user_id: 1,
    feedback_type: 'praise',
    category: 'technical',
    content: 'Excellent work on the API optimization project. Your solution reduced response time by 40% and showed great problem-solving skills. The way you approached profiling and identified the bottleneck was textbook.',
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
    content: 'Consider providing more detailed documentation for your code. This will help the team understand complex logic better. Adding architectural decision records (ADRs) would be valuable for the microservices you own.',
    sentiment: 'neutral',
    created_at: '2026-01-12T14:30:00Z',
    acknowledged: true
  },
  {
    id: 3,
    from_user_id: 4,
    from_user_name: 'Emily Chen',
    to_user_id: 1,
    feedback_type: 'praise',
    category: 'collaboration',
    content: 'Thank you for the thorough code reviews! Your feedback on my React components helped me understand performance optimization patterns much better. Really appreciate you taking the time to explain the "why" behind your suggestions.',
    sentiment: 'positive',
    created_at: '2026-01-15T09:20:00Z',
    acknowledged: true
  },
  {
    id: 4,
    from_user_id: 7,
    from_user_name: 'Jennifer Lee',
    to_user_id: 1,
    feedback_type: 'coaching',
    category: 'leadership',
    content: 'You have strong technical skills and the team respects your expertise. Consider stepping up more in architecture discussions - your insights on microservices would add a lot of value. Think about the staff engineer track.',
    sentiment: 'positive',
    created_at: '2026-01-18T14:00:00Z',
    acknowledged: true
  },

  // Feedback to Sarah Johnson (id: 2) - Manager
  {
    id: 5,
    from_user_id: 1,
    from_user_name: 'John Smith',
    to_user_id: 2,
    feedback_type: 'praise',
    category: 'leadership',
    content: 'Your support during the incident last week was invaluable. You kept everyone calm, made quick decisions, and handled stakeholder communication perfectly. Great crisis leadership.',
    sentiment: 'positive',
    created_at: '2026-01-20T11:30:00Z',
    acknowledged: true
  },
  {
    id: 6,
    from_user_id: 7,
    from_user_name: 'Jennifer Lee',
    to_user_id: 2,
    feedback_type: 'praise',
    category: 'collaboration',
    content: 'The new sprint planning process you introduced is working really well. The team feels more engaged and the scope is much clearer. Love how you incorporated team feedback into the design.',
    sentiment: 'positive',
    created_at: '2026-01-22T10:15:00Z',
    acknowledged: true
  },
  {
    id: 7,
    from_user_id: 5,
    from_user_name: 'Michael Brown',
    to_user_id: 2,
    feedback_type: 'praise',
    category: 'leadership',
    content: 'Thank you for the career development conversation. Your advice on building backend skills and the learning resources you shared are super helpful. I really appreciate having a manager who invests in my growth.',
    sentiment: 'positive',
    created_at: '2026-01-25T16:45:00Z',
    acknowledged: true
  },

  // Feedback to Emily Chen (id: 4)
  {
    id: 8,
    from_user_id: 2,
    from_user_name: 'Sarah Johnson',
    to_user_id: 4,
    feedback_type: 'praise',
    category: 'technical',
    content: 'The dashboard redesign is phenomenal! The 60% improvement in load time is impressive, and the new UI is getting rave reviews from users. Outstanding work balancing aesthetics with performance.',
    sentiment: 'positive',
    created_at: '2026-02-01T09:00:00Z',
    acknowledged: true
  },
  {
    id: 9,
    from_user_id: 11,
    from_user_name: 'Maria Rodriguez',
    to_user_id: 4,
    feedback_type: 'praise',
    category: 'collaboration',
    content: 'Working with you on the UI components has been great! You always have time to pair program and explain your thinking. I learned so much about CSS Grid from our sessions.',
    sentiment: 'positive',
    created_at: '2026-02-03T14:20:00Z',
    acknowledged: true
  },
  {
    id: 10,
    from_user_id: 16,
    from_user_name: 'Brian Lee',
    to_user_id: 4,
    feedback_type: 'constructive',
    category: 'process',
    content: 'Love your implementation work! One suggestion: it would help to check in with design before starting implementation when you have questions. A couple times we had to redo work because of assumptions. Quick Slack message would save time.',
    sentiment: 'neutral',
    created_at: '2026-02-05T11:00:00Z',
    acknowledged: true
  },

  // Feedback to Michael Brown (id: 5)
  {
    id: 11,
    from_user_id: 2,
    from_user_name: 'Sarah Johnson',
    to_user_id: 5,
    feedback_type: 'coaching',
    category: 'technical',
    content: 'Great progress on the API work! Your code quality has improved significantly. Focus next on understanding the broader system architecture - how do all the services fit together? This will help you debug issues faster.',
    sentiment: 'positive',
    created_at: '2026-02-07T10:30:00Z',
    acknowledged: true
  },
  {
    id: 12,
    from_user_id: 1,
    from_user_name: 'John Smith',
    to_user_id: 5,
    feedback_type: 'praise',
    category: 'growth',
    content: 'I see you taking on more challenging tasks each sprint. Your willingness to learn and ask good questions is impressive. Keep up the momentum - you\'re making excellent progress!',
    sentiment: 'positive',
    created_at: '2026-02-10T15:45:00Z',
    acknowledged: true
  },
  {
    id: 13,
    from_user_id: 6,
    from_user_name: 'David Martinez',
    to_user_id: 5,
    feedback_type: 'constructive',
    category: 'technical',
    content: 'When writing tests, try to cover edge cases more thoroughly. The happy path is important but thinking about what could go wrong will make your code more robust. Happy to pair on this if helpful.',
    sentiment: 'neutral',
    created_at: '2026-02-12T09:15:00Z',
    acknowledged: false
  },

  // Feedback to David Martinez (id: 6)
  {
    id: 14,
    from_user_id: 2,
    from_user_name: 'Sarah Johnson',
    to_user_id: 6,
    feedback_type: 'praise',
    category: 'technical',
    content: 'The payment system refactoring is going extremely well. Your technical design was thorough and the incremental rollout strategy is smart. Love how you\'re balancing speed with risk management.',
    sentiment: 'positive',
    created_at: '2026-02-14T11:00:00Z',
    acknowledged: true
  },
  {
    id: 15,
    from_user_id: 10,
    from_user_name: 'James Wilson',
    to_user_id: 6,
    feedback_type: 'praise',
    category: 'collaboration',
    content: 'Thanks for working so closely with me on the Kubernetes migration. Your knowledge of the payment service internals was crucial for getting the deployment config right. Great partnership!',
    sentiment: 'positive',
    created_at: '2026-02-16T14:30:00Z',
    acknowledged: true
  },

  // Feedback to Jennifer Lee (id: 7)
  {
    id: 16,
    from_user_id: 2,
    from_user_name: 'Sarah Johnson',
    to_user_id: 7,
    feedback_type: 'praise',
    category: 'leadership',
    content: 'Your technical strategy presentation was outstanding. You did a brilliant job balancing technical depth with business value. The executive team was very impressed with your vision.',
    sentiment: 'positive',
    created_at: '2026-02-18T10:00:00Z',
    acknowledged: true
  },
  {
    id: 17,
    from_user_id: 6,
    from_user_name: 'David Martinez',
    to_user_id: 7,
    feedback_type: 'praise',
    category: 'leadership',
    content: 'Thank you for the mentorship on system design. Your feedback on my architecture proposal was invaluable - you pointed out scalability issues I completely missed. I learned a ton.',
    sentiment: 'positive',
    created_at: '2026-02-20T13:15:00Z',
    acknowledged: true
  },
  {
    id: 18,
    from_user_id: 1,
    from_user_name: 'John Smith',
    to_user_id: 7,
    feedback_type: 'praise',
    category: 'technical',
    content: 'Your deep dive on distributed tracing was exactly what the team needed. The implementation guide you created will be super useful. Thanks for sharing your expertise!',
    sentiment: 'positive',
    created_at: '2026-02-22T09:30:00Z',
    acknowledged: true
  },

  // Feedback to Robert Garcia (id: 8)
  {
    id: 19,
    from_user_id: 2,
    from_user_name: 'Sarah Johnson',
    to_user_id: 8,
    feedback_type: 'praise',
    category: 'technical',
    content: 'The real-time collaboration feature is coming along nicely! The WebSocket implementation is solid and the conflict resolution algorithm is clever. Great technical work.',
    sentiment: 'positive',
    created_at: '2026-02-24T11:45:00Z',
    acknowledged: true
  },
  {
    id: 20,
    from_user_id: 14,
    from_user_name: 'Jason Rodriguez',
    to_user_id: 8,
    feedback_type: 'constructive',
    category: 'communication',
    content: 'Would love more frequent updates on the collaboration feature progress. When delays happen, earlier heads up helps me manage stakeholder expectations. Let\'s sync weekly?',
    sentiment: 'neutral',
    created_at: '2026-02-26T10:20:00Z',
    acknowledged: true
  },

  // Feedback to Lisa Anderson (id: 9)
  {
    id: 21,
    from_user_id: 2,
    from_user_name: 'Sarah Johnson',
    to_user_id: 9,
    feedback_type: 'praise',
    category: 'quality',
    content: 'The test automation framework you built is a game changer! Going from 40% to 85% coverage is incredible. Your work is making the entire team more productive and confident.',
    sentiment: 'positive',
    created_at: '2026-02-28T09:00:00Z',
    acknowledged: true
  },
  {
    id: 22,
    from_user_id: 4,
    from_user_name: 'Emily Chen',
    to_user_id: 9,
    feedback_type: 'praise',
    category: 'collaboration',
    content: 'Thanks for catching that edge case bug in the dashboard! Your thorough testing saved us from a bad user experience. Really appreciate the detailed bug reports too.',
    sentiment: 'positive',
    created_at: '2026-03-02T14:15:00Z',
    acknowledged: true
  },
  {
    id: 23,
    from_user_id: 8,
    from_user_name: 'Robert Garcia',
    to_user_id: 9,
    feedback_type: 'praise',
    category: 'quality',
    content: 'The visual regression testing setup is fantastic! Already caught two styling bugs that would have made it to production. Great proactive work.',
    sentiment: 'positive',
    created_at: '2026-03-04T11:30:00Z',
    acknowledged: true
  },

  // Feedback to James Wilson (id: 10)
  {
    id: 24,
    from_user_id: 2,
    from_user_name: 'Sarah Johnson',
    to_user_id: 10,
    feedback_type: 'praise',
    category: 'operational',
    content: 'The deployment automation is brilliant! Reducing deploy time by 75% is huge. And achieving 99.99% uptime shows your commitment to reliability. Exceptional work.',
    sentiment: 'positive',
    created_at: '2026-03-06T10:00:00Z',
    acknowledged: true
  },
  {
    id: 25,
    from_user_id: 6,
    from_user_name: 'David Martinez',
    to_user_id: 10,
    feedback_type: 'praise',
    category: 'collaboration',
    content: 'Working with you on the K8s migration has been great. You make complex infrastructure topics accessible and you\'re always patient with questions. Thanks for being a great partner!',
    sentiment: 'positive',
    created_at: '2026-03-08T13:45:00Z',
    acknowledged: true
  },

  // Feedback to Maria Rodriguez (id: 11)
  {
    id: 26,
    from_user_id: 2,
    from_user_name: 'Sarah Johnson',
    to_user_id: 11,
    feedback_type: 'praise',
    category: 'quality',
    content: 'Your focus on accessibility is making a real difference. The keyboard navigation improvements and WCAG compliance work is important and often overlooked. Thank you for championing this!',
    sentiment: 'positive',
    created_at: '2026-03-10T09:30:00Z',
    acknowledged: true
  },
  {
    id: 27,
    from_user_id: 16,
    from_user_name: 'Brian Lee',
    to_user_id: 11,
    feedback_type: 'praise',
    category: 'collaboration',
    content: 'Love collaborating with you! You implement designs pixel-perfect and always bring good questions about edge cases. The design system components you built are beautiful.',
    sentiment: 'positive',
    created_at: '2026-03-12T11:15:00Z',
    acknowledged: true
  },

  // Feedback to William Taylor (id: 12)
  {
    id: 28,
    from_user_id: 2,
    from_user_name: 'Sarah Johnson',
    to_user_id: 12,
    feedback_type: 'praise',
    category: 'technical',
    content: 'The GraphQL API performance improvements are impressive! Going from 10M to supporting higher load with lower latency is exactly what we needed. Great technical execution.',
    sentiment: 'positive',
    created_at: '2026-03-14T10:45:00Z',
    acknowledged: true
  },
  {
    id: 29,
    from_user_id: 15,
    from_user_name: 'Sarah Lewis',
    to_user_id: 12,
    feedback_type: 'praise',
    category: 'collaboration',
    content: 'Thanks for adding those new analytics endpoints so quickly! Your responsiveness helps me iterate fast on product features. Really appreciate the partnership.',
    sentiment: 'positive',
    created_at: '2026-03-16T14:00:00Z',
    acknowledged: true
  },

  // Feedback to Patricia Thomas (id: 13)
  {
    id: 30,
    from_user_id: 2,
    from_user_name: 'Sarah Johnson',
    to_user_id: 13,
    feedback_type: 'coaching',
    category: 'technical',
    content: 'Good progress on the search feature! For the next phase, spend time on performance optimization - how will this scale to millions of records? Think about indexing strategies and caching.',
    sentiment: 'positive',
    created_at: '2026-03-18T09:15:00Z',
    acknowledged: true
  },
  {
    id: 31,
    from_user_id: 12,
    from_user_name: 'William Taylor',
    to_user_id: 13,
    feedback_type: 'praise',
    category: 'growth',
    content: 'I see you taking on more complex features. Your question during code review about SQL query optimization showed good systems thinking. Keep developing that skill!',
    sentiment: 'positive',
    created_at: '2026-03-20T13:30:00Z',
    acknowledged: true
  },

  // Feedback to Jason Rodriguez (id: 14) - Product
  {
    id: 32,
    from_user_id: 2,
    from_user_name: 'Sarah Johnson',
    to_user_id: 14,
    feedback_type: 'praise',
    category: 'product',
    content: 'The mobile app roadmap is well thought out. You balanced user requests with technical constraints perfectly. Engineering team is excited to build this vision.',
    sentiment: 'positive',
    created_at: '2026-03-22T10:00:00Z',
    acknowledged: true
  },
  {
    id: 33,
    from_user_id: 18,
    from_user_name: 'Amanda Allen',
    to_user_id: 14,
    feedback_type: 'praise',
    category: 'collaboration',
    content: 'Thank you for including design early in the mobile app planning! Having a seat at the table for strategy discussions helps us create better user experiences. Great collaboration.',
    sentiment: 'positive',
    created_at: '2026-03-24T11:30:00Z',
    acknowledged: true
  },
  {
    id: 34,
    from_user_id: 4,
    from_user_name: 'Emily Chen',
    to_user_id: 14,
    feedback_type: 'constructive',
    category: 'process',
    content: 'For future projects, it would help to have more detailed acceptance criteria upfront. We had to clarify requirements mid-sprint a few times. Maybe we can define a template together?',
    sentiment: 'neutral',
    created_at: '2026-03-26T14:45:00Z',
    acknowledged: false
  },

  // Feedback to Sarah Lewis (id: 15)
  {
    id: 35,
    from_user_id: 2,
    from_user_name: 'Sarah Johnson',
    to_user_id: 15,
    feedback_type: 'praise',
    category: 'product',
    content: 'The analytics dashboard adoption campaign is working! The 120% increase in usage shows you understand our users. The onboarding emails were particularly effective.',
    sentiment: 'positive',
    created_at: '2026-03-28T09:00:00Z',
    acknowledged: true
  },
  {
    id: 36,
    from_user_id: 12,
    from_user_name: 'William Taylor',
    to_user_id: 15,
    feedback_type: 'praise',
    category: 'collaboration',
    content: 'Your SQL skills are really impressive for a PM! Being able to write your own queries for analysis makes our collaboration so much more efficient. Great technical depth.',
    sentiment: 'positive',
    created_at: '2026-03-30T10:30:00Z',
    acknowledged: true
  },

  // Feedback to Brian Lee (id: 16) - Designer
  {
    id: 37,
    from_user_id: 2,
    from_user_name: 'Sarah Johnson',
    to_user_id: 16,
    feedback_type: 'praise',
    category: 'design',
    content: 'The design system is transforming how we build product! The consistency improvements are visible and engineering loves having clear components to work with. Outstanding contribution.',
    sentiment: 'positive',
    created_at: '2026-04-01T11:00:00Z',
    acknowledged: true
  },
  {
    id: 38,
    from_user_id: 11,
    from_user_name: 'Maria Rodriguez',
    to_user_id: 16,
    feedback_type: 'praise',
    category: 'collaboration',
    content: 'The design system documentation is fantastic! As an engineer, I can implement designs confidently knowing exactly what components to use. Thank you for thinking about the developer experience.',
    sentiment: 'positive',
    created_at: '2026-04-03T13:15:00Z',
    acknowledged: true
  },

  // Feedback to Michelle Walker (id: 17)
  {
    id: 39,
    from_user_id: 14,
    from_user_name: 'Jason Rodriguez',
    to_user_id: 17,
    feedback_type: 'praise',
    category: 'research',
    content: 'The user research on mobile navigation was eye-opening! Several assumptions we had were completely wrong. Your insights directly shaped the new IA. Invaluable work.',
    sentiment: 'positive',
    created_at: '2026-04-05T09:30:00Z',
    acknowledged: true
  },
  {
    id: 40,
    from_user_id: 18,
    from_user_name: 'Amanda Allen',
    to_user_id: 17,
    feedback_type: 'praise',
    category: 'collaboration',
    content: 'Love having user research integrated into the design process! The usability testing feedback helped me iterate on the onboarding flow and make it much better. Great partnership!',
    sentiment: 'positive',
    created_at: '2026-04-07T11:00:00Z',
    acknowledged: true
  },

  // Feedback to Amanda Allen (id: 18)
  {
    id: 41,
    from_user_id: 2,
    from_user_name: 'Sarah Johnson',
    to_user_id: 18,
    feedback_type: 'praise',
    category: 'design',
    content: 'The onboarding redesign is phenomenal! Going from 45% to 85% completion rate is huge for the business. Beautiful design that\'s also highly functional. Award-worthy work!',
    sentiment: 'positive',
    created_at: '2026-04-09T10:15:00Z',
    acknowledged: true
  },
  {
    id: 42,
    from_user_id: 4,
    from_user_name: 'Emily Chen',
    to_user_id: 18,
    feedback_type: 'praise',
    category: 'collaboration',
    content: 'Thank you for the design mentorship! Your feedback on my dashboard mockups helped me think more deeply about user needs vs. just making things look pretty. I learned so much.',
    sentiment: 'positive',
    created_at: '2026-04-11T14:30:00Z',
    acknowledged: true
  },

  // Feedback to Rebecca Scott (id: 19) - Sales
  {
    id: 43,
    from_user_id: 2,
    from_user_name: 'Sarah Johnson',
    to_user_id: 19,
    feedback_type: 'praise',
    category: 'sales',
    content: 'Exceeding quota by 150% quarter after quarter is remarkable! Your enterprise sales expertise is a huge asset to the company. The $5M quarter was outstanding.',
    sentiment: 'positive',
    created_at: '2026-04-13T09:00:00Z',
    acknowledged: true
  },
  {
    id: 44,
    from_user_id: 20,
    from_user_name: 'Gregory Green',
    to_user_id: 19,
    feedback_type: 'praise',
    category: 'leadership',
    content: 'Thanks for mentoring me on enterprise deal strategy. Your advice on multi-threading and executive engagement was spot-on. I closed my biggest deal using your playbook!',
    sentiment: 'positive',
    created_at: '2026-04-15T11:45:00Z',
    acknowledged: true
  },
  {
    id: 45,
    from_user_id: 14,
    from_user_name: 'Jason Rodriguez',
    to_user_id: 19,
    feedback_type: 'praise',
    category: 'collaboration',
    content: 'Your customer feedback is gold for product development! The feature requests and pain points you share directly influence our roadmap. Keep the insights coming!',
    sentiment: 'positive',
    created_at: '2026-04-17T10:30:00Z',
    acknowledged: true
  },

  // Feedback to Gregory Green (id: 20)
  {
    id: 46,
    from_user_id: 2,
    from_user_name: 'Sarah Johnson',
    to_user_id: 20,
    feedback_type: 'praise',
    category: 'sales',
    content: 'Achieving 130% of quota and expanding 15 accounts shows great account management skills! Your focus on customer success is driving sustainable growth. Excellent work.',
    sentiment: 'positive',
    created_at: '2026-04-19T09:15:00Z',
    acknowledged: true
  },
  {
    id: 47,
    from_user_id: 19,
    from_user_name: 'Rebecca Scott',
    to_user_id: 20,
    feedback_type: 'coaching',
    category: 'sales',
    content: 'You\'re doing great with mid-market accounts! To get to the next level, start building relationships with larger enterprises. Happy to introduce you to some of my accounts to shadow.',
    sentiment: 'positive',
    created_at: '2026-04-21T13:00:00Z',
    acknowledged: true
  },

  // Feedback to Mark Carter (id: 21)
  {
    id: 48,
    from_user_id: 2,
    from_user_name: 'Sarah Johnson',
    to_user_id: 21,
    feedback_type: 'praise',
    category: 'sales',
    content: 'The $10M deal is the largest in company history - incredible achievement! Your ability to navigate complex enterprise sales cycles and build executive relationships is world-class.',
    sentiment: 'positive',
    created_at: '2026-04-23T10:00:00Z',
    acknowledged: true
  },
  {
    id: 49,
    from_user_id: 3,
    from_user_name: 'HR Admin',
    to_user_id: 21,
    feedback_type: 'praise',
    category: 'leadership',
    content: 'Thank you for interviewing senior sales candidates and sharing your expertise during the hiring process. Your insights help us find the right talent. Appreciate your contribution!',
    sentiment: 'positive',
    created_at: '2026-04-25T11:30:00Z',
    acknowledged: true
  },

  // Feedback to Kenneth Turner (id: 22) - Marketing
  {
    id: 50,
    from_user_id: 2,
    from_user_name: 'Sarah Johnson',
    to_user_id: 22,
    feedback_type: 'praise',
    category: 'marketing',
    content: 'Reducing CAC by 40% while improving lead quality is outstanding marketing execution! The SEO and content strategy is clearly working. Great data-driven approach.',
    sentiment: 'positive',
    created_at: '2026-04-27T09:45:00Z',
    acknowledged: true
  },
  {
    id: 51,
    from_user_id: 19,
    from_user_name: 'Rebecca Scott',
    to_user_id: 22,
    feedback_type: 'praise',
    category: 'collaboration',
    content: 'The marketing qualified leads you\'re generating are much higher quality than before! The alignment between marketing and sales on ICP is really paying off. Keep it up!',
    sentiment: 'positive',
    created_at: '2026-04-29T14:15:00Z',
    acknowledged: true
  },

  // Feedback to Margaret Parker (id: 23)
  {
    id: 52,
    from_user_id: 2,
    from_user_name: 'Sarah Johnson',
    to_user_id: 23,
    feedback_type: 'praise',
    category: 'marketing',
    content: 'The brand refresh is stunning! Increasing brand awareness by 200% is a massive achievement. The new visual identity is modern and the messaging resonates. Brilliant work!',
    sentiment: 'positive',
    created_at: '2026-05-01T10:00:00Z',
    acknowledged: true
  },
  {
    id: 53,
    from_user_id: 22,
    from_user_name: 'Kenneth Turner',
    to_user_id: 23,
    feedback_type: 'praise',
    category: 'collaboration',
    content: 'The brand guidelines you created make my job so much easier! Having clear voice, tone, and visual standards helps ensure consistency across all our campaigns. Thank you!',
    sentiment: 'positive',
    created_at: '2026-05-03T11:30:00Z',
    acknowledged: true
  },

  // Additional cross-team feedback
  {
    id: 54,
    from_user_id: 10,
    from_user_name: 'James Wilson',
    to_user_id: 1,
    feedback_type: 'praise',
    category: 'collaboration',
    content: 'Thanks for helping debug that production issue at 2am! Your knowledge of the microservices architecture was crucial in identifying the root cause quickly. True team player.',
    sentiment: 'positive',
    created_at: '2026-05-05T09:00:00Z',
    acknowledged: true
  },
  {
    id: 55,
    from_user_id: 7,
    from_user_name: 'Jennifer Lee',
    to_user_id: 10,
    feedback_type: 'praise',
    category: 'technical',
    content: 'Your infrastructure-as-code approach is exactly what we need for scaling. The Terraform modules you created are well-documented and reusable. Great engineering practice.',
    sentiment: 'positive',
    created_at: '2026-05-07T10:30:00Z',
    acknowledged: true
  },
  {
    id: 56,
    from_user_id: 14,
    from_user_name: 'Jason Rodriguez',
    to_user_id: 4,
    feedback_type: 'praise',
    category: 'collaboration',
    content: 'The rapid prototyping you did for the mobile app helped us validate assumptions quickly with users. Being able to iterate fast on UI is a superpower. Thanks for the great work!',
    sentiment: 'positive',
    created_at: '2026-05-09T13:00:00Z',
    acknowledged: true
  },
  {
    id: 57,
    from_user_id: 21,
    from_user_name: 'Mark Carter',
    to_user_id: 14,
    feedback_type: 'constructive',
    category: 'product',
    content: 'For the enterprise tier features, we need stronger security and compliance capabilities. Several deals are stalling because we don\'t have SOC 2 workflows. Can we prioritize this?',
    sentiment: 'neutral',
    created_at: '2026-05-11T11:15:00Z',
    acknowledged: true
  },
  {
    id: 58,
    from_user_id: 3,
    from_user_name: 'HR Admin',
    to_user_id: 2,
    feedback_type: 'praise',
    category: 'leadership',
    content: 'Your engineering team has the highest engagement scores in the company! The culture you\'ve built around learning, collaboration, and psychological safety is exemplary. Thank you for being a leadership role model.',
    sentiment: 'positive',
    created_at: '2026-05-13T09:30:00Z',
    acknowledged: true
  }
];

// Demo reviews - 23 comprehensive performance reviews
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
    strengths: 'Strong technical skills and problem-solving ability. Delivered API optimization reducing response time by 40%. Consistently produces high-quality code with excellent test coverage. Takes ownership of complex technical challenges and drives them to completion.',
    areas_for_improvement: 'Documentation could be more comprehensive - adding architectural decision records would help the team. Consider providing more proactive updates to stakeholders on project status. Opportunity to step up in architecture discussions and mentor junior developers more actively.',
    completed_at: '2025-12-15T00:00:00Z'
  },
  {
    id: 2,
    employee_id: 2,
    reviewer_id: 3,
    manager_name: 'HR Admin',
    cycle_name: 'Annual 2025',
    review_type: 'annual',
    overall_rating: 4.5,
    status: 'completed',
    strengths: 'Outstanding leadership building high-performing engineering culture. Excellent at balancing technical depth with people management. Successfully grew team while maintaining quality bar. Strong crisis management and stakeholder communication. Team engagement scores highest in company.',
    areas_for_improvement: 'Continue developing strategic planning skills for long-term architecture vision. Could delegate more to senior engineers to create leadership opportunities. Focus on building succession plan for team leads.',
    completed_at: '2025-12-20T00:00:00Z'
  },
  {
    id: 3,
    employee_id: 4,
    reviewer_id: 2,
    manager_name: 'Sarah Johnson',
    cycle_name: 'Q4 2025',
    review_type: 'quarterly',
    overall_rating: 4.5,
    status: 'completed',
    strengths: 'Exceptional frontend development skills with strong focus on performance and user experience. Dashboard redesign achieved 60% load time improvement and received excellent user feedback. Quick learner who masters new technologies rapidly. Great collaborator who actively helps other engineers.',
    areas_for_improvement: 'Sometimes makes implementation assumptions without checking with design first, leading to rework. Would benefit from more proactive communication when blockers arise. Opportunity to contribute more in technical planning discussions.',
    completed_at: '2025-12-18T00:00:00Z'
  },
  {
    id: 4,
    employee_id: 5,
    reviewer_id: 2,
    manager_name: 'Sarah Johnson',
    cycle_name: 'Q4 2025',
    review_type: 'quarterly',
    overall_rating: 3.8,
    status: 'completed',
    strengths: 'Strong learning mindset and eagerness to improve. Takes on increasingly challenging tasks each sprint. Asks thoughtful questions and seeks feedback proactively. Code quality has improved significantly over the quarter. Good collaboration with team members.',
    areas_for_improvement: 'Need to focus more on edge cases and error handling in code. Testing practices should be strengthened - aim for 70% coverage. Spend more time understanding system architecture and how services interact. Continue building backend expertise through courses and practice.',
    completed_at: '2025-12-16T00:00:00Z'
  },
  {
    id: 5,
    employee_id: 6,
    reviewer_id: 2,
    manager_name: 'Sarah Johnson',
    cycle_name: 'Q4 2025',
    review_type: 'quarterly',
    overall_rating: 4.3,
    status: 'completed',
    strengths: 'Expert in distributed systems and backend architecture. Payment system refactoring is well-designed and executed with careful risk management. Strong technical design skills evident in documentation and implementation. Good partnership with DevOps on infrastructure. Reliable and delivers consistently.',
    areas_for_improvement: 'Could share knowledge more broadly through tech talks and documentation. Opportunity to mentor mid-level engineers on system design. Consider taking on more cross-team architectural initiatives.',
    completed_at: '2025-12-17T00:00:00Z'
  },
  {
    id: 6,
    employee_id: 7,
    reviewer_id: 2,
    manager_name: 'Sarah Johnson',
    cycle_name: 'Annual 2025',
    review_type: 'annual',
    overall_rating: 4.7,
    status: 'completed',
    strengths: 'World-class technical leadership. Technical strategy presentation demonstrated exceptional ability to balance technical depth with business value. Excellent mentor to senior engineers with clear path to promoting them to staff level. Deep expertise in distributed systems and scalability. Strong influencer across engineering organization.',
    areas_for_improvement: 'Already operating at very high level. Focus on building even stronger relationships with product and business leaders to drive strategic technical investments. Consider publishing more externally to raise company technical profile.',
    completed_at: '2025-12-21T00:00:00Z'
  },
  {
    id: 7,
    employee_id: 8,
    reviewer_id: 2,
    manager_name: 'Sarah Johnson',
    cycle_name: 'Q4 2025',
    review_type: 'quarterly',
    overall_rating: 4.0,
    status: 'completed',
    strengths: 'Solid technical execution on real-time collaboration features. WebSocket implementation is clean and the conflict resolution is clever. Good TypeScript skills and understanding of full-stack development. Responds well to feedback and iterates quickly.',
    areas_for_improvement: 'Communication with product on timeline expectations needs improvement - provide earlier heads-up when delays happen. Could be more proactive in updating project status. Continue deepening understanding of distributed systems patterns.',
    completed_at: '2025-12-19T00:00:00Z'
  },
  {
    id: 8,
    employee_id: 9,
    reviewer_id: 2,
    manager_name: 'Sarah Johnson',
    cycle_name: 'Q4 2025',
    review_type: 'quarterly',
    overall_rating: 4.2,
    status: 'completed',
    strengths: 'Outstanding contribution building test automation framework. Increasing coverage from 40% to 85% is exceptional and makes entire team more productive. Visual regression testing implementation was proactive and already caught production bugs. Excellent attention to quality and detail. Great bug reports that are actionable.',
    areas_for_improvement: 'Could expand expertise into performance testing and security testing. Opportunity to work more closely with product on test planning earlier in the cycle. Consider presenting best practices at company engineering meetings.',
    completed_at: '2025-12-17T00:00:00Z'
  },
  {
    id: 9,
    employee_id: 10,
    reviewer_id: 2,
    manager_name: 'Sarah Johnson',
    cycle_name: 'Q4 2025',
    review_type: 'quarterly',
    overall_rating: 4.4,
    status: 'completed',
    strengths: 'Exceptional DevOps engineering. Achieved 99.99% uptime while reducing deployment time by 75% - this is world-class reliability. Infrastructure-as-code approach with Terraform is excellent engineering practice. Great partner to engineering teams on Kubernetes migration. Strong problem-solving during incidents.',
    areas_for_improvement: 'Could create more documentation and runbooks for on-call engineers. Opportunity to mentor other engineers on infrastructure and reliability practices. Consider presenting on DevOps best practices at industry conferences.',
    completed_at: '2025-12-20T00:00:00Z'
  },
  {
    id: 10,
    employee_id: 11,
    reviewer_id: 2,
    manager_name: 'Sarah Johnson',
    cycle_name: 'Q4 2025',
    review_type: 'quarterly',
    overall_rating: 4.1,
    status: 'completed',
    strengths: 'Strong commitment to accessibility and inclusive design. WCAG compliance work is important and often overlooked - thank you for championing this. Design system component work is high quality and well-documented. Good collaboration with designers. Pixel-perfect implementation skills.',
    areas_for_improvement: 'Continue building JavaScript fundamentals and understanding of complex state management. Could be more proactive in suggesting UX improvements based on accessibility findings. Opportunity to contribute more to technical discussions.',
    completed_at: '2025-12-18T00:00:00Z'
  },
  {
    id: 11,
    employee_id: 12,
    reviewer_id: 2,
    manager_name: 'Sarah Johnson',
    cycle_name: 'Q4 2025',
    review_type: 'quarterly',
    overall_rating: 4.3,
    status: 'completed',
    strengths: 'Excellent API development and performance optimization skills. GraphQL improvements achieving lower latency at higher scale show strong technical execution. Good database optimization work with thoughtful indexing strategy. Responsive to product needs for new endpoints. Clean, maintainable code.',
    areas_for_improvement: 'Could be more proactive in identifying performance bottlenecks before they become issues. Consider sharing GraphQL best practices more broadly with team. Opportunity to take on more architectural design work.',
    completed_at: '2025-12-19T00:00:00Z'
  },
  {
    id: 12,
    employee_id: 13,
    reviewer_id: 2,
    manager_name: 'Sarah Johnson',
    cycle_name: 'Q4 2025',
    review_type: 'quarterly',
    overall_rating: 3.9,
    status: 'completed',
    strengths: 'Good progress on search functionality implementation. Shows growing systems thinking with questions about scalability and performance. Eager to learn and takes feedback well. Collaboration with team is positive. Steadily taking on more complex work.',
    areas_for_improvement: 'Need to spend more time on performance optimization and understanding how features scale. Continue learning about system architecture through reading and courses. Work on breaking down large features into smaller deliverable milestones.',
    completed_at: '2025-12-16T00:00:00Z'
  },
  {
    id: 13,
    employee_id: 14,
    reviewer_id: 2,
    manager_name: 'Sarah Johnson',
    cycle_name: 'Q4 2025',
    review_type: 'quarterly',
    overall_rating: 4.4,
    status: 'completed',
    strengths: 'Strong product leadership on mobile app launch. Roadmap balances user needs with technical constraints effectively. Great at incorporating research insights into product decisions. Good stakeholder management and communication. Data-driven approach to measuring success.',
    areas_for_improvement: 'Acceptance criteria could be more detailed upfront to reduce mid-sprint clarifications. Consider doing more low-fidelity prototyping before committing to full designs. Continue building technical depth to inform better product tradeoff decisions.',
    completed_at: '2025-12-20T00:00:00Z'
  },
  {
    id: 14,
    employee_id: 15,
    reviewer_id: 2,
    manager_name: 'Sarah Johnson',
    cycle_name: 'Q4 2025',
    review_type: 'quarterly',
    overall_rating: 4.2,
    status: 'completed',
    strengths: 'Excellent work driving analytics dashboard adoption - 120% usage increase shows strong execution. SQL skills are impressive and enable self-service analysis. User-centric design approach backed by data. Great collaboration with engineering. NPS improvements demonstrate focus on user value.',
    areas_for_improvement: 'Could be more proactive in gathering qualitative feedback to complement quantitative data. Consider running more A/B tests to validate assumptions. Opportunity to mentor other PMs on analytics best practices.',
    completed_at: '2025-12-18T00:00:00Z'
  },
  {
    id: 15,
    employee_id: 16,
    reviewer_id: 2,
    manager_name: 'Sarah Johnson',
    cycle_name: 'Q4 2025',
    review_type: 'quarterly',
    overall_rating: 4.5,
    status: 'completed',
    strengths: 'Outstanding design system work transforming product consistency. Documentation quality is exceptional and developer experience is well-considered. Accessibility leadership is making real impact across organization. Strong collaboration between design and engineering. Great mentor to other designers.',
    areas_for_improvement: 'Already performing at high level. Continue expanding design system to cover more complex interaction patterns. Could present more at design conferences to raise company profile.',
    completed_at: '2025-12-19T00:00:00Z'
  },
  {
    id: 16,
    employee_id: 17,
    reviewer_id: 2,
    manager_name: 'Sarah Johnson',
    cycle_name: 'Q4 2025',
    review_type: 'quarterly',
    overall_rating: 4.0,
    status: 'completed',
    strengths: 'Building systematic user research practice effectively. 200+ user interviews and usability tests providing valuable insights for product decisions. Good at translating research findings into actionable recommendations. Strong presentation skills with leadership. Collaborative approach with product and design.',
    areas_for_improvement: 'Could involve engineering earlier in research planning for technical feasibility input. Consider building stronger quantitative analysis skills to complement qualitative research. Opportunity to create research templates and frameworks for team to reuse.',
    completed_at: '2025-12-17T00:00:00Z'
  },
  {
    id: 17,
    employee_id: 18,
    reviewer_id: 2,
    manager_name: 'Sarah Johnson',
    cycle_name: 'Q4 2025',
    review_type: 'quarterly',
    overall_rating: 4.6,
    status: 'completed',
    strengths: 'Award-worthy onboarding redesign with 85% completion rate (up from 45%) - exceptional business impact. Beautiful, functional design that balances aesthetics with usability. Excellent mentor to junior designers with thoughtful feedback. Strong design craft and attention to detail. Great cross-functional collaboration.',
    areas_for_improvement: 'Already operating at very high level. Focus on scaling impact through building frameworks and templates others can use. Consider taking on more strategic product design initiatives.',
    completed_at: '2025-12-21T00:00:00Z'
  },
  {
    id: 18,
    employee_id: 19,
    reviewer_id: 2,
    manager_name: 'Sarah Johnson',
    cycle_name: 'Q4 2025',
    review_type: 'quarterly',
    overall_rating: 4.7,
    status: 'completed',
    strengths: 'Outstanding sales performance exceeding quota by 150%+ consistently. $5M quarter is exceptional achievement. World-class enterprise sales skills with strong executive relationship building. Great mentor to other sales reps, sharing expertise generously. Excellent customer feedback loop with product team.',
    areas_for_improvement: 'Already top performer. Continue sharing best practices through sales playbook development. Consider presenting at sales conferences to raise company profile. Focus on strategic partner development for even bigger deals.',
    completed_at: '2025-12-22T00:00:00Z'
  },
  {
    id: 19,
    employee_id: 20,
    reviewer_id: 2,
    manager_name: 'Sarah Johnson',
    cycle_name: 'Q4 2025',
    review_type: 'quarterly',
    overall_rating: 4.3,
    status: 'completed',
    strengths: 'Strong sales execution achieving 130% of quota. Excellent account management with 15 successful expansions showing customer success focus. Good balance between new business and expansion. Solid pipeline management and forecasting accuracy. Positive customer relationships.',
    areas_for_improvement: 'Ready to move upmarket to larger enterprise accounts - work with Rebecca on shadowing her deals. Could improve discovery process to identify expansion opportunities earlier. Consider becoming more involved in sales enablement and training.',
    completed_at: '2025-12-19T00:00:00Z'
  },
  {
    id: 20,
    employee_id: 21,
    reviewer_id: 2,
    manager_name: 'Sarah Johnson',
    cycle_name: 'Annual 2025',
    review_type: 'annual',
    overall_rating: 4.8,
    status: 'completed',
    strengths: 'Exceptional enterprise sales execution. $10M deal is largest in company history - demonstrates world-class ability to navigate complex sales cycles. Strong executive relationships and strategic partnership development. Excellent contributor to hiring process, helping build sales team. Industry leader in enterprise SaaS sales.',
    areas_for_improvement: 'Operating at elite level. Focus on documenting enterprise playbook to help others replicate success. Continue building strategic partnerships to create new growth channels. Consider advisory role for overall sales strategy.',
    completed_at: '2025-12-23T00:00:00Z'
  },
  {
    id: 21,
    employee_id: 22,
    reviewer_id: 2,
    manager_name: 'Sarah Johnson',
    cycle_name: 'Q4 2025',
    review_type: 'quarterly',
    overall_rating: 4.3,
    status: 'completed',
    strengths: 'Outstanding marketing execution reducing CAC by 40% while improving lead quality. SEO and content strategy showing excellent results. Data-driven approach to optimization and decision-making. Strong alignment with sales on ICP and lead qualification. Good cross-functional collaboration.',
    areas_for_improvement: 'Could expand into more experimental growth channels beyond organic. Consider building stronger product marketing capabilities. Opportunity to mentor junior marketers on performance marketing best practices.',
    completed_at: '2025-12-20T00:00:00Z'
  },
  {
    id: 22,
    employee_id: 23,
    reviewer_id: 2,
    manager_name: 'Sarah Johnson',
    cycle_name: 'Q4 2025',
    review_type: 'quarterly',
    overall_rating: 4.5,
    status: 'completed',
    strengths: 'Brilliant brand refresh execution with 200% increase in brand awareness. Modern visual identity and messaging that resonates with target audience. Excellent influencer partnership program development. Strong creative direction and campaign management. Great brand guidelines documentation.',
    areas_for_improvement: 'Continue measuring brand impact on pipeline and revenue. Could build stronger connection between brand campaigns and performance marketing. Opportunity to expand international brand presence.',
    completed_at: '2025-12-21T00:00:00Z'
  },
  {
    id: 23,
    employee_id: 3,
    reviewer_id: 2,
    manager_name: 'Sarah Johnson',
    cycle_name: 'Annual 2025',
    review_type: 'annual',
    overall_rating: 4.8,
    status: 'completed',
    strengths: 'Exceptional HR leadership driving employee engagement and culture. Strategic implementation of performance management system has transformed how company develops talent. Excellent DEI initiatives creating more inclusive workplace. Strong business partnership with leadership team. Highest employee engagement scores in company history.',
    areas_for_improvement: 'Already operating at exceptional level. Focus on scaling HR practices for planned company growth. Continue developing succession planning for critical roles. Consider speaking at HR conferences to share best practices.',
    completed_at: '2025-12-24T00:00:00Z'
  }
];

// Demo insights - Rich AI insights for different employee personas
export const demoInsights = [
  // High Performer - Engineering (John Smith)
  {
    type: 'strength',
    title: 'Technical Excellence',
    description: 'Your technical contributions have been exceptional this quarter. You delivered 3 major features ahead of schedule with 40% performance improvements and maintained 85% test coverage - well above team average.',
    impact: 'high',
    recommendations: [
      'Consider taking on tech lead role for next major project to develop leadership skills',
      'Document best practices from your API optimization work for team knowledge sharing',
      'Present your microservices architecture learnings at the next engineering all-hands',
      'Mentor 1-2 junior engineers to scale your impact and build coaching skills'
    ]
  },
  {
    type: 'opportunity',
    title: 'Leadership Potential',
    description: 'You demonstrate strong leadership qualities in team discussions, code reviews, and technical decision-making. Team members actively seek your input on architecture questions.',
    impact: 'medium',
    recommendations: [
      'Take on a tech lead role for the next project to formalize your leadership',
      'Present at team knowledge sharing sessions on microservices best practices',
      'Consider the staff engineer track - discuss with your manager in next 1-on-1',
      'Lead a working group on improving code quality standards across the team'
    ]
  },
  {
    type: 'trend',
    title: 'Growing Cross-Team Impact',
    description: 'Your influence is expanding beyond your immediate team. DevOps, Product, and QA teams all mentioned positive collaborations with you in recent feedback.',
    impact: 'high',
    recommendations: [
      'Continue building these cross-functional relationships',
      'Consider joining architecture review board to expand influence',
      'Share your collaboration approach with other senior engineers'
    ]
  },

  // Manager Persona (Sarah Johnson)
  {
    type: 'strength',
    title: 'Team Culture & Engagement',
    description: 'Your team has the highest engagement scores in the company at 85%, well above the company average of 78%. Team members consistently praise your support, clear communication, and investment in their growth.',
    impact: 'high',
    recommendations: [
      'Document your team culture practices to share with other managers',
      'Present your approach to 1-on-1s and career development at leadership meeting',
      'Consider mentoring a new manager to scale your leadership impact',
      'Write a playbook on building high-performing engineering teams'
    ]
  },
  {
    type: 'opportunity',
    title: 'Strategic Technical Planning',
    description: 'As the team scales from 20 to 30 engineers, there\'s an opportunity to develop longer-term technical strategy and architecture vision to guide the growing organization.',
    impact: 'high',
    recommendations: [
      'Partner with Principal Engineer on 3-year technical roadmap',
      'Establish architecture review process for team consistency',
      'Build stronger relationships with product leadership on strategic planning',
      'Create succession plan for tech lead roles to enable team growth'
    ]
  },

  // High Performer - Frontend (Emily Chen)
  {
    type: 'strength',
    title: 'Performance Optimization Expert',
    description: 'Your dashboard redesign achieved 60% load time improvement and 97 Lighthouse score - exceptional technical execution. You\'ve become the go-to expert on React performance optimization.',
    impact: 'high',
    recommendations: [
      'Lead a workshop on React performance best practices for the team',
      'Create reusable performance patterns library others can leverage',
      'Write blog post on your optimization approach to raise your profile',
      'Consider speaking at a local React meetup about your work'
    ]
  },
  {
    type: 'area_for_improvement',
    title: 'Design Collaboration',
    description: 'A few instances of implementation assumptions without design check-in led to rework. Strengthening this collaboration will increase efficiency.',
    impact: 'medium',
    recommendations: [
      'Set up brief design sync before starting implementation on new features',
      'Create shared Figma commenting workflow with designers for questions',
      'Do quick Slack check-in when making design decisions during development',
      'Pair with designer on next major feature to build stronger working relationship'
    ]
  },

  // Junior Developer (Michael Brown)
  {
    type: 'strength',
    title: 'Rapid Learning & Growth',
    description: 'Your progress in just 4 months has been impressive. Code quality up 45%, taking on increasingly complex tasks, and asking thoughtful questions show strong learning mindset.',
    impact: 'medium',
    recommendations: [
      'Continue current learning trajectory with Django and backend fundamentals',
      'Ask senior engineers to review your code with focus on architecture patterns',
      'Pair program with David or Jennifer on distributed systems concepts',
      'Read "Designing Data-Intensive Applications" to accelerate systems knowledge'
    ]
  },
  {
    type: 'area_for_improvement',
    title: 'Testing & Edge Cases',
    description: 'Code reviews show opportunities to strengthen testing practices and think through edge cases more thoroughly. Current test coverage at 45% vs team target of 70%.',
    impact: 'medium',
    recommendations: [
      'Aim for 70% test coverage on all new code you write',
      'Before submitting PR, manually test error scenarios and edge cases',
      'Pair with Lisa (QA) to learn her testing mindset and approach',
      'Review existing high-quality test files to learn good testing patterns'
    ]
  },

  // Senior Backend Engineer (David Martinez)
  {
    type: 'strength',
    title: 'Distributed Systems Expertise',
    description: 'Payment system handling 10M+ transactions monthly with 99.99% uptime demonstrates world-class distributed systems skills. Your architecture is exemplary.',
    impact: 'high',
    recommendations: [
      'Lead architecture review board to guide technical decisions company-wide',
      'Mentor mid-level engineers on system design through pairing and reviews',
      'Write technical blog posts on payment system architecture and lessons learned',
      'Consider staff engineer track - you have the technical depth needed'
    ]
  },
  {
    type: 'opportunity',
    title: 'Knowledge Sharing',
    description: 'Your expertise in distributed systems and Kubernetes is valuable but could be shared more broadly. Team would benefit from more documentation and talks from you.',
    impact: 'medium',
    recommendations: [
      'Give tech talk on payment system architecture and key design decisions',
      'Document distributed systems patterns and anti-patterns for team',
      'Offer office hours for engineers working on scalability challenges',
      'Create architecture decision records (ADRs) for major systems you build'
    ]
  },

  // Principal Engineer (Jennifer Lee)
  {
    type: 'strength',
    title: 'Strategic Technical Leadership',
    description: 'Your 3-year technical strategy presentation was exceptional - balancing technical depth, business value, and clear vision. You\'re operating at the highest level of technical leadership.',
    impact: 'high',
    recommendations: [
      'Continue driving architecture decisions and technical strategy',
      'Publish externally (blog, conference talks) to raise company technical brand',
      'Build even deeper relationships with product/business for strategic alignment',
      'Develop the next generation of principal engineers through mentorship'
    ]
  },
  {
    type: 'trend',
    title: 'Industry Thought Leadership',
    description: 'Your expertise in distributed systems positions you as potential industry thought leader. External visibility would benefit both you and the company.',
    impact: 'high',
    recommendations: [
      'Submit talks to QCon, Strange Loop, or other architecture conferences',
      'Start technical blog series on distributed systems patterns',
      'Contribute to open source projects related to your expertise areas',
      'Consider writing a book or creating video course on system design'
    ]
  },

  // Product Manager (Jason Rodriguez)
  {
    type: 'strength',
    title: 'Strategic Product Vision',
    description: 'Mobile app V2 roadmap excellently balances user needs with technical constraints. Your track record of successful launches (1M+ app downloads) demonstrates strong product sense.',
    impact: 'high',
    recommendations: [
      'Share your product planning process with other PMs as best practice',
      'Consider presenting product strategy at company all-hands',
      'Mentor junior PMs on balancing stakeholder needs and prioritization',
      'Write about your approach to product discovery and validation'
    ]
  },
  {
    type: 'area_for_improvement',
    title: 'Requirements Documentation',
    description: 'Engineering team noted acceptance criteria could be more detailed upfront to reduce mid-sprint clarifications. This would improve team velocity.',
    impact: 'medium',
    recommendations: [
      'Create acceptance criteria template with engineering for consistency',
      'Include more edge cases and error scenarios in initial requirements',
      'Do quick review with tech lead before sprint planning to validate completeness',
      'Consider using behavior-driven development (BDD) format for clarity'
    ]
  },

  // Designer (Brian Lee)
  {
    type: 'strength',
    title: 'Design Systems Leadership',
    description: 'Your design system has transformed product consistency and engineering productivity. 90% adoption rate and reduction in design inconsistencies is exceptional achievement.',
    impact: 'high',
    recommendations: [
      'Present design system case study at design conference or meetup',
      'Create training program for new designers and engineers joining company',
      'Publish design system documentation as open source to build industry reputation',
      'Expand system to cover more complex interaction patterns and animations'
    ]
  },

  // UX Researcher (Michelle Walker)
  {
    type: 'strength',
    title: 'Systematic Research Practice',
    description: 'You\'ve established user research as core part of product development with 200+ interviews and tests. Your insights directly influenced mobile navigation and multiple product decisions.',
    impact: 'high',
    recommendations: [
      'Create research templates and frameworks for others to leverage',
      'Build research repository for insights discoverability across company',
      'Train PMs and designers on basic user research techniques',
      'Present research findings more broadly to increase organizational impact'
    ]
  },
  {
    type: 'opportunity',
    title: 'Quantitative Skills Development',
    description: 'Your qualitative research is strong. Adding quantitative analysis skills would create powerful combination for validating findings at scale.',
    impact: 'medium',
    recommendations: [
      'Partner with data team to learn SQL and analytics tools',
      'Take course on statistics and quantitative research methods',
      'Combine qual insights with quant data in future research projects',
      'Learn A/B testing methodology to complement usability testing'
    ]
  },

  // Senior Designer (Amanda Allen)
  {
    type: 'strength',
    title: 'Exceptional Design Impact',
    description: 'Onboarding redesign going from 45% to 85% completion rate is exceptional business impact. Beautiful design that balances aesthetics with conversion optimization.',
    impact: 'high',
    recommendations: [
      'Lead design thinking workshops to scale your design process',
      'Create onboarding design playbook others can learn from',
      'Take on more strategic product initiatives beyond feature design',
      'Submit work to design awards (Webby, Awwwards) to gain recognition'
    ]
  },
  {
    type: 'trend',
    title: 'Strong Mentorship Impact',
    description: 'Junior designers praise your mentorship and design critiques. Your feedback is helping them grow significantly and you\'re building the next generation of design talent.',
    impact: 'high',
    recommendations: [
      'Continue weekly design critiques - they\'re highly valued',
      'Consider formalizing design mentorship program',
      'Create design critique framework others can use',
      'Present on effective design mentorship at design leadership meeting'
    ]
  },

  // Top Sales Performer (Rebecca Scott)
  {
    type: 'strength',
    title: 'Elite Sales Performance',
    description: 'Consistently exceeding quota by 150%+ and closing $5M quarterly makes you top 1% sales performer. Your enterprise sales expertise is world-class.',
    impact: 'high',
    recommendations: [
      'Continue documenting enterprise sales playbook for team leverage',
      'Present at sales kick-off on enterprise deal strategies',
      'Mentor senior sales reps on moving upmarket to enterprise',
      'Consider strategic advisor role on sales strategy and partner development'
    ]
  },

  // Account Executive (Gregory Green)
  {
    type: 'strength',
    title: 'Strong Account Management',
    description: 'Achieving 130% quota with 15 successful account expansions shows excellent customer success focus and account management skills.',
    impact: 'high',
    recommendations: [
      'Document your expansion playbook for other AEs to learn from',
      'Continue focus on customer success driving sustainable growth',
      'Share your discovery process that identifies expansion opportunities',
      'Help train new account executives on your approach'
    ]
  },
  {
    type: 'opportunity',
    title: 'Move Upmarket',
    description: 'You\'re ready for larger enterprise accounts. Moving upmarket will accelerate career growth and increase deal sizes significantly.',
    impact: 'high',
    recommendations: [
      'Shadow Rebecca on 2-3 enterprise deals to learn approach',
      'Take on one strategic enterprise prospect as pilot',
      'Study enterprise sales methodology (MEDDPICC, Command of Message)',
      'Build executive presence and relationship skills for C-level selling'
    ]
  },

  // Marketing Manager (Kenneth Turner)
  {
    type: 'strength',
    title: 'Growth Marketing Excellence',
    description: 'Reducing CAC by 40% while improving lead quality is exceptional marketing execution. SEO and content strategy showing 100% organic traffic growth.',
    impact: 'high',
    recommendations: [
      'Share growth marketing playbook with marketing team',
      'Experiment with new acquisition channels beyond organic',
      'Build product marketing capabilities to expand skill set',
      'Consider speaking at growth marketing conferences'
    ]
  },

  // Brand Manager (Margaret Parker)
  {
    type: 'strength',
    title: 'Transformative Brand Leadership',
    description: 'Brand refresh achieving 200% increase in brand awareness with modern identity and messaging that resonates. Influencer program generating 5M impressions.',
    impact: 'high',
    recommendations: [
      'Measure brand impact on pipeline and revenue for business case',
      'Expand influencer program internationally for global reach',
      'Partner with sales on brand\'s impact on deal velocity',
      'Present brand strategy at marketing leadership conference'
    ]
  },

  // HR Director (HR Admin)
  {
    type: 'strength',
    title: 'Exceptional HR Leadership',
    description: 'Employee engagement at 90% (highest in company history) and successful performance management system implementation demonstrate strategic HR excellence.',
    impact: 'high',
    recommendations: [
      'Scale HR practices for planned company growth to 100+ employees',
      'Expand succession planning for all critical leadership roles',
      'Share HR best practices at SHRM or other HR conferences',
      'Consider advisory role for other startups on people strategy'
    ]
  },

  // DevOps Engineer (James Wilson)
  {
    type: 'strength',
    title: 'Infrastructure Excellence',
    description: 'Achieving 99.99% uptime while reducing deployment time 75% is world-class DevOps engineering. Your infrastructure-as-code approach is exemplary.',
    impact: 'high',
    recommendations: [
      'Create infrastructure documentation and runbooks for on-call rotation',
      'Mentor engineers on DevOps and reliability best practices',
      'Present at DevOps conferences on achieving four nines reliability',
      'Consider SRE (Site Reliability Engineering) career track'
    ]
  },

  // QA Engineer (Lisa Anderson)
  {
    type: 'strength',
    title: 'Quality Engineering Leadership',
    description: 'Test automation framework increasing coverage from 40% to 85% is exceptional contribution making entire team more productive and confident.',
    impact: 'high',
    recommendations: [
      'Expand into performance and security testing to broaden impact',
      'Lead quality engineering guild to spread testing best practices',
      'Create testing training program for all engineers',
      'Present at testing conferences on automation framework approach'
    ]
  }
];

// Manager-specific demo data
// Team data with enriched employee information
export const demoTeamData = {
  teamHealth: {
    overallScore: 82,
    engagement: 85,
    performance: 88,
    satisfaction: 79
  },
  // All team members except the manager (id: 2) and HR admin (id: 3)
  get teamMembers() {
    // Return all employees (IDs 1, 4-23) with enriched data
    const teamEmployeeIds = [1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    return teamEmployeeIds.map(id => {
      const employee = demoUsers.find(u => u.id === id);
      if (!employee) return null;
      
      // Get latest review for this employee
      const latestReview = demoReviews.find(r => r.employee_id === id);
      
      // Get goals count
      const employeeGoals = demoGoals.filter(g => g.owner_id === id);
      
      // Get feedback count
      const feedbackReceived = demoFeedback.filter(f => f.to_user_id === id);
      
      return {
        ...employee,
        job_title: employee.title,
        latestReview,
        goalsCount: employeeGoals.length,
        feedbackCount: feedbackReceived.length,
        recentApplications: 0,
        flightRisk: {
          riskLevel: employee.performance_rating < 4.0 ? 'medium' : 'low',
          score: employee.performance_rating < 4.0 ? 65 : 25,
          factors: employee.performance_rating < 4.0 ? ['Performance needs improvement'] : [],
          recommendations: employee.performance_rating < 4.0 ? ['Schedule 1-on-1 to discuss development plan'] : []
        }
      };
    }).filter(Boolean);
  },
  talentInsights: {
    highPerformersHighPotential: 15,
    atRisk: 0,
    needsDevelopment: 5
  }
};

// HR-specific demo data
export const demoHRData = {
  companyMetrics: {
    totalEmployees: 23,
    averageRating: 4.3,
    completedReviews: 23,
    pendingReviews: 0
  },
  talentInsights: {
    highPerformersHighPotential: 15,
    atRisk: 0,
    needsDevelopment: 5
  },
  departmentBreakdown: [
    { department: 'Engineering', count: 10, avgRating: 4.2 },
    { department: 'Product', count: 5, avgRating: 4.3 },
    { department: 'Sales', count: 3, avgRating: 4.6 },
    { department: 'Marketing', count: 2, avgRating: 4.4 },
    { department: 'Human Resources', count: 1, avgRating: 4.8 },
    { department: 'Management', count: 2, avgRating: 4.6 }
  ]
};

// Helper functions
export function getDemoUserByEmail(email: string) {
  return demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function getDemoGoalsByUserId(userId: number, userRole?: string) {
  const user = demoUsers.find(u => u.id === userId);
  if (!user) return [];
  
  // HR can see all goals
  if (userRole === 'hr' || user.role === 'hr') {
    return demoGoals;
  }
  
  // Managers can see their own + team goals + public goals
  if (userRole === 'manager' || user.role === 'manager') {
    return demoGoals.filter(g => 
      g.owner_id === userId || 
      g.owner_id === user.manager_id ||
      demoUsers.find(u => u.id === g.owner_id)?.manager_id === userId ||
      ['team', 'department', 'company'].includes(g.visibility)
    );
  }
  
  // Employees can see their own goals + public goals
  return demoGoals.filter(g => 
    g.owner_id === userId || 
    ['team', 'department', 'company'].includes(g.visibility)
  );
}

export function getDemoFeedbackByUserId(userId: number, userRole?: string) {
  const user = demoUsers.find(u => u.id === userId);
  if (!user) return [];
  
  // HR can see all feedback
  if (userRole === 'hr' || user.role === 'hr') {
    return demoFeedback;
  }
  
  // Managers can see their own + team feedback
  if (userRole === 'manager' || user.role === 'manager') {
    return demoFeedback.filter(f =>
      f.from_user_id === userId ||
      f.to_user_id === userId ||
      demoUsers.find(u => u.id === f.to_user_id)?.manager_id === userId
    );
  }
  
  // Employees can see feedback they sent or received
  return demoFeedback.filter(f => 
    f.from_user_id === userId || f.to_user_id === userId
  );
}

export function getDemoReviewsByUserId(userId: number, userRole?: string) {
  const user = demoUsers.find(u => u.id === userId);
  if (!user) return [];
  
  // HR can see all reviews
  if (userRole === 'hr' || user.role === 'hr') {
    return demoReviews;
  }
  
  // Managers can see their own reviews + team reviews
  if (userRole === 'manager' || user.role === 'manager') {
    return demoReviews.filter(r =>
      r.employee_id === userId ||
      r.reviewer_id === userId ||
      demoUsers.find(u => u.id === r.employee_id)?.manager_id === userId
    );
  }
  
  // Employees can see only their own reviews
  return demoReviews.filter(r => r.employee_id === userId);
}

export function getDemoInsightsByUserId(userId: number) {
  // Get insights for a specific employee - filter by employee ID from insight context
  return demoInsights.filter(insight => {
    // Try to match insight to user based on title/description keywords
    const user = demoUsers.find(u => u.id === userId);
    if (!user) return false;
    
    // Return all insights for now - ideally we'd match by user name or ID in the insight
    // This would require adding an employeeId field to each insight
    return true;
  });
}

export function isDemoMode() {
  // Demo mode when no database is configured
  const isDemo = !process.env.POSTGRES_URL && !process.env.DATABASE_PATH;
  if (typeof window === 'undefined') {
    console.log('isDemoMode check - POSTGRES_URL:', !!process.env.POSTGRES_URL, 'DATABASE_PATH:', !!process.env.DATABASE_PATH, 'Result:', isDemo);
  }
  return isDemo;
}
