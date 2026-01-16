/**
 * Demo Data Store - Enterprise Scale (5000+ Employees)
 * In-memory data storage for demo/presentation mode
 * No database required!
 */

// Expanded departments for enterprise scale
const departments = [
  'Engineering',
  'Product',
  'Sales',
  'Marketing',
  'HR',
  'Finance',
  'Operations',
  'Customer Success',
  'Data & Analytics',
  'Design',
  'Legal',
  'Security',
  'IT',
  'Research & Development',
  'Business Development',
  'Quality Assurance'
];

const locations = [
  'San Francisco, CA',
  'New York, NY',
  'Austin, TX',
  'Seattle, WA',
  'Boston, MA',
  'Chicago, IL',
  'London, UK',
  'Berlin, Germany',
  'Singapore',
  'Toronto, Canada',
  'Sydney, Australia',
  'Tokyo, Japan',
  'Remote - US',
  'Remote - Europe',
  'Remote - Asia'
];

const titles = {
  Engineering: [
    'Junior Software Engineer',
    'Software Engineer',
    'Software Engineer II',
    'Senior Software Engineer',
    'Staff Engineer',
    'Principal Engineer',
    'Distinguished Engineer',
    'Engineering Manager',
    'Senior Engineering Manager',
    'Director of Engineering',
    'Senior Director of Engineering',
    'VP of Engineering',
    'SVP of Engineering',
    'CTO'
  ],
  Product: [
    'Associate Product Manager',
    'Product Manager',
    'Senior Product Manager',
    'Principal Product Manager',
    'Group Product Manager',
    'Director of Product',
    'Senior Director of Product',
    'VP of Product',
    'Chief Product Officer'
  ],
  Sales: [
    'Sales Development Rep',
    'Account Executive',
    'Senior Account Executive',
    'Enterprise Account Executive',
    'Sales Manager',
    'Regional Sales Manager',
    'Director of Sales',
    'VP of Sales',
    'SVP of Sales',
    'Chief Revenue Officer'
  ],
  Marketing: [
    'Marketing Coordinator',
    'Marketing Manager',
    'Senior Marketing Manager',
    'Content Marketing Manager',
    'Product Marketing Manager',
    'Director of Marketing',
    'VP of Marketing',
    'CMO'
  ],
  HR: [
    'HR Coordinator',
    'HR Generalist',
    'HR Business Partner',
    'Senior HR Business Partner',
    'HR Manager',
    'Senior HR Manager',
    'HR Director',
    'VP of People',
    'CHRO'
  ],
  Finance: [
    'Financial Analyst',
    'Senior Financial Analyst',
    'Finance Manager',
    'Senior Finance Manager',
    'Controller',
    'Director of Finance',
    'VP of Finance',
    'CFO'
  ],
  Operations: [
    'Operations Coordinator',
    'Operations Analyst',
    'Operations Manager',
    'Senior Operations Manager',
    'Director of Operations',
    'VP of Operations',
    'COO'
  ],
  'Customer Success': [
    'Customer Success Associate',
    'Customer Success Manager',
    'Senior Customer Success Manager',
    'Enterprise CSM',
    'Director of Customer Success',
    'VP of Customer Success'
  ],
  'Data & Analytics': [
    'Data Analyst',
    'Senior Data Analyst',
    'Data Scientist',
    'Senior Data Scientist',
    'ML Engineer',
    'Data Engineering Manager',
    'Director of Analytics',
    'VP of Data'
  ],
  Design: [
    'Product Designer',
    'Senior Product Designer',
    'UX Researcher',
    'Design Manager',
    'Director of Design',
    'VP of Design'
  ],
  Legal: [
    'Legal Counsel',
    'Senior Legal Counsel',
    'Associate General Counsel',
    'General Counsel'
  ],
  Security: [
    'Security Analyst',
    'Security Engineer',
    'Senior Security Engineer',
    'Security Manager',
    'Director of Security',
    'CISO'
  ],
  IT: [
    'IT Support Specialist',
    'IT Administrator',
    'Senior IT Administrator',
    'IT Manager',
    'Director of IT'
  ],
  'Research & Development': [
    'Research Scientist',
    'Senior Research Scientist',
    'Principal Scientist',
    'Director of Research',
    'VP of R&D'
  ],
  'Business Development': [
    'Business Development Rep',
    'Business Development Manager',
    'Senior BD Manager',
    'Director of Business Development',
    'VP of Business Development'
  ],
  'Quality Assurance': [
    'QA Engineer',
    'Senior QA Engineer',
    'QA Manager',
    'Director of QA'
  ]
};

// Massive name pools for realistic diversity
const firstNames = [
  'John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'James', 'Jennifer', 'Robert', 'Lisa',
  'William', 'Michelle', 'Richard', 'Ashley', 'Thomas', 'Amanda', 'Charles', 'Melissa', 'Daniel', 'Laura',
  'Matthew', 'Stephanie', 'Anthony', 'Rebecca', 'Mark', 'Rachel', 'Donald', 'Nicole', 'Steven', 'Elizabeth',
  'Paul', 'Karen', 'Andrew', 'Nancy', 'Joshua', 'Betty', 'Kenneth', 'Helen', 'Kevin', 'Sandra',
  'Brian', 'Donna', 'George', 'Carol', 'Timothy', 'Ruth', 'Ronald', 'Sharon', 'Edward', 'Michelle',
  'Jason', 'Maria', 'Jeffrey', 'Patricia', 'Ryan', 'Linda', 'Jacob', 'Barbara', 'Gary', 'Dorothy',
  'Nicholas', 'Susan', 'Eric', 'Jessica', 'Jonathan', 'Margaret', 'Stephen', 'Sarah', 'Larry', 'Kimberly',
  'Justin', 'Deborah', 'Scott', 'Melissa', 'Brandon', 'Stephanie', 'Benjamin', 'Rebecca', 'Samuel', 'Laura',
  'Raymond', 'Sharon', 'Gregory', 'Cynthia', 'Alexander', 'Kathleen', 'Patrick', 'Amy', 'Frank', 'Angela',
  'Dennis', 'Shirley', 'Jerry', 'Anna', 'Tyler', 'Brenda', 'Aaron', 'Pamela', 'Jose', 'Emma',
  'Adam', 'Nicole', 'Nathan', 'Helen', 'Douglas', 'Samantha', 'Zachary', 'Katherine', 'Peter', 'Christine',
  'Kyle', 'Debra', 'Walter', 'Rachel', 'Ethan', 'Carolyn', 'Jeremy', 'Janet', 'Harold', 'Catherine',
  'Keith', 'Maria', 'Christian', 'Heather', 'Roger', 'Diane', 'Noah', 'Ruth', 'Gerald', 'Julie',
  'Carl', 'Olivia', 'Terry', 'Joyce', 'Sean', 'Virginia', 'Austin', 'Victoria', 'Arthur', 'Kelly'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Thompson', 'White', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Hall', 'Allen',
  'Young', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams',
  'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips',
  'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris',
  'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey',
  'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks',
  'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes', 'Price', 'Alvarez',
  'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez', 'Powell', 'Jenkins',
  'Perry', 'Russell', 'Sullivan', 'Bell', 'Coleman', 'Butler', 'Henderson', 'Barnes', 'Gonzales', 'Fisher',
  'Vasquez', 'Simmons', 'Romero', 'Jordan', 'Patterson', 'Alexander', 'Hamilton', 'Graham', 'Reynolds', 'Griffin',
  'Wallace', 'Moreno', 'West', 'Cole', 'Hayes', 'Bryant', 'Herrera', 'Gibson', 'Ellis', 'Tran'
];

// Core leadership accounts (C-Suite and key managers)
export const demoUsers: any[] = [
  // Employee test account
  {
    id: 1,
    email: 'john.smith@company.com',
    name: 'John Smith',
    role: 'employee',
    department: 'Engineering',
    title: 'Senior Software Engineer',
    manager_id: 50,
    experience_years: 5,
    location: 'San Francisco, CA',
    bio: 'Experienced full-stack developer passionate about building scalable systems.',
    performance_rating: 4.2,
    potential: 'high'
  },
  // Manager test account - Will have 50+ direct reports
  {
    id: 2,
    email: 'manager@company.com',
    name: 'Sarah Johnson',
    role: 'manager',
    department: 'Engineering',
    title: 'Engineering Manager',
    manager_id: 50,
    experience_years: 8,
    location: 'San Francisco, CA',
    bio: 'Leading high-performance engineering teams to deliver exceptional results.',
    performance_rating: 4.5,
    potential: 'high'
  },
  // HR Admin - sees everything
  {
    id: 3,
    email: 'admin@company.com',
    name: 'Alex Chen',
    role: 'hr',
    department: 'Human Resources',
    title: 'CHRO',
    manager_id: 10,
    experience_years: 15,
    location: 'New York, NY',
    bio: 'Strategic HR leadership focused on employee development and organizational culture.',
    performance_rating: 4.7,
    potential: 'high'
  },
  // Recruiter account
  {
    id: 4,
    email: 'recruiter@company.com',
    name: 'Jane Recruiter',
    role: 'recruiter',
    department: 'Human Resources',
    title: 'Senior Recruiter',
    manager_id: 3,
    experience_years: 6,
    location: 'Austin, TX',
    bio: 'Talent acquisition specialist focused on building diverse high-performing teams.',
    performance_rating: 4.0,
    potential: 'medium'
  },
  // Candidate account
  {
    id: 5,
    email: 'candidate@company.com',
    name: 'Chris Candidate',
    role: 'candidate',
    department: 'Engineering',
    title: 'Software Engineer',
    manager_id: 2,
    experience_years: 3,
    location: 'Remote - US',
    bio: 'Looking for internal growth opportunities and career advancement.',
    performance_rating: 3.8,
    potential: 'high'
  },
  // C-Suite (IDs 10-19)
  {
    id: 10,
    email: 'ceo@company.com',
    name: 'Robert Williams',
    role: 'manager',
    department: 'Executive',
    title: 'CEO',
    manager_id: null,
    experience_years: 20,
    location: 'San Francisco, CA',
    bio: 'Visionary leader driving company growth and innovation.',
    performance_rating: 4.8,
    potential: 'high'
  },
  {
    id: 11,
    email: 'cto@company.com',
    name: 'Maria Garcia',
    role: 'manager',
    department: 'Engineering',
    title: 'CTO',
    manager_id: 10,
    experience_years: 18,
    location: 'San Francisco, CA',
    bio: 'Technology visionary leading engineering excellence.',
    performance_rating: 4.7,
    potential: 'high'
  },
  {
    id: 12,
    email: 'cfo@company.com',
    name: 'Thomas Anderson',
    role: 'manager',
    department: 'Finance',
    title: 'CFO',
    manager_id: 10,
    experience_years: 17,
    location: 'New York, NY',
    bio: 'Financial strategy expert ensuring sustainable growth.',
    performance_rating: 4.6,
    potential: 'high'
  },
  {
    id: 13,
    email: 'cpo@company.com',
    name: 'Jennifer Martinez',
    role: 'manager',
    department: 'Product',
    title: 'Chief Product Officer',
    manager_id: 10,
    experience_years: 16,
    location: 'San Francisco, CA',
    bio: 'Product strategy leader defining the future of our platform.',
    performance_rating: 4.7,
    potential: 'high'
  },
  {
    id: 14,
    email: 'cro@company.com',
    name: 'David Lee',
    role: 'manager',
    department: 'Sales',
    title: 'Chief Revenue Officer',
    manager_id: 10,
    experience_years: 19,
    location: 'New York, NY',
    bio: 'Revenue growth strategist with proven track record.',
    performance_rating: 4.8,
    potential: 'high'
  },
  {
    id: 15,
    email: 'cmo@company.com',
    name: 'Ashley Thompson',
    role: 'manager',
    department: 'Marketing',
    title: 'CMO',
    manager_id: 10,
    experience_years: 15,
    location: 'New York, NY',
    bio: 'Brand and growth marketing expert.',
    performance_rating: 4.5,
    potential: 'high'
  },
  {
    id: 16,
    email: 'coo@company.com',
    name: 'Michael Wilson',
    role: 'manager',
    department: 'Operations',
    title: 'COO',
    manager_id: 10,
    experience_years: 18,
    location: 'Chicago, IL',
    bio: 'Operational excellence leader scaling the organization.',
    performance_rating: 4.6,
    potential: 'high'
  }
];

// Generate organizational hierarchy
let currentId = 20;

// Track managers for team assignments
const managersByDepartment: { [key: string]: number[] } = {};
const allManagers: number[] = [2, 10, 11, 12, 13, 14, 15, 16]; // Include test manager and C-suite

// Generate VPs (IDs 20-49) - 2 VPs per major department
departments.forEach((dept, deptIdx) => {
  managersByDepartment[dept] = [];

  const numVPs = dept === 'Engineering' ? 3 : (dept === 'Sales' || dept === 'Product' ? 2 : 1);

  for (let v = 0; v < numVPs; v++) {
    const firstName = firstNames[currentId % firstNames.length];
    const lastName = lastNames[currentId % lastNames.length];
    const csuiteManager = dept === 'Engineering' ? 11 :
                          dept === 'Product' ? 13 :
                          dept === 'Sales' ? 14 :
                          dept === 'Marketing' ? 15 :
                          dept === 'Finance' ? 12 :
                          dept === 'Operations' ? 16 :
                          dept === 'HR' ? 3 : 10;

    demoUsers.push({
      id: currentId,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.vp${v}@company.com`,
      name: `${firstName} ${lastName}`,
      role: 'manager',
      department: dept,
      title: `VP of ${dept}`,
      manager_id: csuiteManager,
      experience_years: 12 + Math.floor(Math.random() * 5),
      location: locations[currentId % locations.length],
      bio: `Senior leader in ${dept} with extensive experience.`,
      performance_rating: 4.3 + Math.random() * 0.4,
      potential: Math.random() > 0.3 ? 'high' : 'medium'
    });

    managersByDepartment[dept].push(currentId);
    allManagers.push(currentId);
    currentId++;
  }
});

// Generate Directors (IDs 50-199) - 5-10 directors per VP
const vpIds = allManagers.filter(id => {
  const user = demoUsers.find(u => u.id === id);
  return user && user.title?.includes('VP');
});

vpIds.forEach(vpId => {
  const vp = demoUsers.find(u => u.id === vpId);
  const numDirectors = 5 + Math.floor(Math.random() * 5);

  for (let d = 0; d < numDirectors; d++) {
    const firstName = firstNames[currentId % firstNames.length];
    const lastName = lastNames[currentId % lastNames.length];

    demoUsers.push({
      id: currentId,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.dir@company.com`,
      name: `${firstName} ${lastName}`,
      role: 'manager',
      department: vp.department,
      title: `Director of ${vp.department}`,
      manager_id: vpId,
      experience_years: 8 + Math.floor(Math.random() * 6),
      location: locations[currentId % locations.length],
      bio: `Experienced director leading ${vp.department} initiatives.`,
      performance_rating: 3.8 + Math.random() * 0.8,
      potential: Math.random() > 0.4 ? 'high' : 'medium'
    });

    managersByDepartment[vp.department].push(currentId);
    allManagers.push(currentId);
    currentId++;
  }
});

// Generate Managers (IDs 200-799) - Each director has 3-8 managers
const directorIds = allManagers.filter(id => {
  const user = demoUsers.find(u => u.id === id);
  return user && user.title?.includes('Director');
});

directorIds.forEach(dirId => {
  const director = demoUsers.find(u => u.id === dirId);
  const numManagers = 3 + Math.floor(Math.random() * 6);

  for (let m = 0; m < numManagers; m++) {
    const firstName = firstNames[currentId % firstNames.length];
    const lastName = lastNames[currentId % lastNames.length];
    const titleList = titles[director.department as keyof typeof titles] || ['Manager'];
    const managerTitle = titleList.find(t => t.includes('Manager') && !t.includes('Director') && !t.includes('VP')) || `${director.department} Manager`;

    demoUsers.push({
      id: currentId,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.mgr@company.com`,
      name: `${firstName} ${lastName}`,
      role: 'manager',
      department: director.department,
      title: managerTitle,
      manager_id: dirId,
      experience_years: 5 + Math.floor(Math.random() * 8),
      location: locations[currentId % locations.length],
      bio: `${director.department} manager building high-performing teams.`,
      performance_rating: 3.5 + Math.random() * 1.0,
      potential: Math.random() > 0.5 ? 'high' : 'medium'
    });

    managersByDepartment[director.department].push(currentId);
    allManagers.push(currentId);
    currentId++;
  }
});

// Make sure manager@company.com (id: 2) has 50+ reports
// Generate 55 direct reports for the test manager account
const testManagerId = 2;
for (let i = 0; i < 55; i++) {
  const firstName = firstNames[(currentId + i) % firstNames.length];
  const lastName = lastNames[(currentId + i * 7) % lastNames.length];
  const titleList = titles['Engineering'];
  const title = titleList[Math.floor(Math.random() * (titleList.length - 4))]; // Avoid manager titles

  const rand = Math.random();
  let rating;
  if (rand < 0.10) rating = 2.5 + Math.random() * 0.5;
  else if (rand < 0.30) rating = 3.0 + Math.random() * 0.5;
  else if (rand < 0.70) rating = 3.5 + Math.random() * 0.5;
  else if (rand < 0.90) rating = 4.0 + Math.random() * 0.5;
  else rating = 4.5 + Math.random() * 0.5;

  demoUsers.push({
    id: currentId,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${currentId}@company.com`,
    name: `${firstName} ${lastName}`,
    role: 'employee',
    department: 'Engineering',
    title: title,
    manager_id: testManagerId,
    experience_years: 1 + Math.floor(Math.random() * 12),
    location: locations[currentId % locations.length],
    bio: `${title} working on innovative engineering solutions.`,
    performance_rating: Math.round(rating * 10) / 10,
    potential: rating > 4.0 ? 'high' : rating > 3.5 ? 'medium' : 'low',
    job_title: title,
    years_experience: 1 + Math.floor(Math.random() * 12)
  });

  currentId++;
}

// Generate Individual Contributors (ICs) - Fill to 5000+ total
// Each manager gets 8-15 direct reports (except test manager who already has 55)
const icManagerIds = allManagers.filter(id => id !== testManagerId);

while (currentId < 5200) {
  const managerId = icManagerIds[currentId % icManagerIds.length];
  const manager = demoUsers.find(u => u.id === managerId);

  if (!manager) {
    currentId++;
    continue;
  }

  const firstName = firstNames[currentId % firstNames.length];
  const lastName = lastNames[(currentId * 13) % lastNames.length];
  const titleList = titles[manager.department as keyof typeof titles] || ['Employee'];
  // Get IC titles (non-manager)
  const icTitles = titleList.filter(t =>
    !t.includes('Manager') &&
    !t.includes('Director') &&
    !t.includes('VP') &&
    !t.includes('Chief') &&
    !t.includes('CTO') &&
    !t.includes('CFO') &&
    !t.includes('COO') &&
    !t.includes('CMO')
  );
  const title = icTitles[Math.floor(Math.random() * icTitles.length)] || titleList[0];

  // Performance distribution (bell curve)
  const rand = Math.random();
  let rating;
  if (rand < 0.05) rating = 2.0 + Math.random() * 0.5; // 5% very low
  else if (rand < 0.15) rating = 2.5 + Math.random() * 0.5; // 10% low
  else if (rand < 0.35) rating = 3.0 + Math.random() * 0.5; // 20% below avg
  else if (rand < 0.70) rating = 3.5 + Math.random() * 0.5; // 35% average
  else if (rand < 0.90) rating = 4.0 + Math.random() * 0.5; // 20% above avg
  else rating = 4.5 + Math.random() * 0.5; // 10% high performers

  demoUsers.push({
    id: currentId,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${currentId}@company.com`,
    name: `${firstName} ${lastName}`,
    role: 'employee',
    department: manager.department,
    title: title,
    manager_id: managerId,
    experience_years: Math.floor(Math.random() * 15) + 1,
    location: locations[currentId % locations.length],
    bio: `${title} contributing to ${manager.department} success.`,
    performance_rating: Math.round(rating * 10) / 10,
    potential: rating > 4.2 ? 'high' : rating > 3.5 ? 'medium' : 'low',
    job_title: title,
    years_experience: Math.floor(Math.random() * 15) + 1
  });

  currentId++;
}

console.log(`✅ Generated ${demoUsers.length} employees across ${departments.length} departments and ${locations.length} locations`);

// Generate goals (subset for performance - top 1000 employees only)
export const demoGoals = [
  {
    id: 1,
    owner_id: 1,
    owner_type: 'individual',
    title: 'Increase API performance by 40%',
    description: 'Optimize critical API endpoints to reduce latency and improve user experience',
    goal_type: 'performance',
    category: 'technical',
    start_date: '2026-01-01',
    due_date: '2026-06-30',
    quarter: 'Q2 2026',
    status: 'on_track',
    priority: 'high',
    visibility: 'team',
    progress_percentage: 65,
    weight: 1.0,
    created_by: 1,
    keyResults: [
      { id: 1, goal_id: 1, title: 'Reduce p95 latency to under 200ms', metric_type: 'number', start_value: 450, target_value: 200, current_value: 280, unit: 'ms', status: 'on_track' },
      { id: 2, goal_id: 1, title: 'Implement caching layer', metric_type: 'boolean', start_value: 0, target_value: 1, current_value: 0.8, status: 'on_track' },
      { id: 3, goal_id: 1, title: 'Database query optimization', metric_type: 'percentage', start_value: 0, target_value: 100, current_value: 70, unit: '%', status: 'on_track' }
    ]
  },
  {
    id: 2,
    owner_id: 1,
    owner_type: 'individual',
    title: 'Complete Advanced System Design Course',
    description: 'Expand technical expertise in distributed systems architecture',
    goal_type: 'development',
    category: 'professional',
    start_date: '2026-01-15',
    due_date: '2026-04-15',
    quarter: 'Q1 2026',
    status: 'in_progress',
    priority: 'medium',
    visibility: 'private',
    progress_percentage: 40,
    weight: 0.5,
    created_by: 1,
    keyResults: [
      { id: 4, goal_id: 2, title: 'Complete 80% of course modules', metric_type: 'percentage', start_value: 0, target_value: 80, current_value: 40, unit: '%', status: 'in_progress' }
    ]
  },
  {
    id: 3,
    owner_id: 1,
    owner_type: 'individual',
    title: 'Code Review Excellence',
    description: 'Provide thorough and constructive code reviews for all team PRs',
    goal_type: 'collaboration',
    category: 'teamwork',
    start_date: '2025-10-01',
    due_date: '2025-12-31',
    quarter: 'Q4 2025',
    status: 'completed',
    priority: 'high',
    visibility: 'team',
    progress_percentage: 100,
    weight: 1.0,
    created_by: 1,
    keyResults: [
      { id: 5, goal_id: 3, title: 'Review 50+ PRs', metric_type: 'number', start_value: 0, target_value: 50, current_value: 62, unit: 'PRs', status: 'completed' }
    ]
  },
  {
    id: 4,
    owner_id: 1,
    owner_type: 'individual',
    title: 'Security Training Certification',
    description: 'Complete OWASP security certification',
    goal_type: 'development',
    category: 'professional',
    start_date: '2025-09-01',
    due_date: '2025-11-30',
    quarter: 'Q4 2025',
    status: 'completed',
    priority: 'medium',
    visibility: 'private',
    progress_percentage: 100,
    weight: 0.5,
    created_by: 1,
    keyResults: [
      { id: 6, goal_id: 4, title: 'Pass certification exam', metric_type: 'boolean', start_value: 0, target_value: 1, current_value: 1, status: 'completed' }
    ]
  }
];

// Add goals for manager's direct reports (sample)
for (let i = 0; i < 20; i++) {
  const ownerId = 800 + i; // Sample of manager's team
  demoGoals.push({
    id: 100 + i,
    owner_id: ownerId,
    owner_type: 'individual',
    title: `Q1 2026 Performance Goal ${i + 1}`,
    description: 'Deliver high-quality work and meet team objectives',
    goal_type: 'performance',
    category: 'performance',
    start_date: '2026-01-01',
    due_date: '2026-03-31',
    quarter: 'Q1 2026',
    status: ['on_track', 'at_risk', 'completed'][i % 3],
    priority: ['high', 'medium', 'low'][i % 3],
    visibility: 'team',
    progress_percentage: Math.floor(Math.random() * 100),
    weight: 1.0,
    created_by: ownerId,
    keyResults: []
  });
}

// Generate feedback (sample for performance)
export const demoFeedback = [
  {
    id: 1,
    from_user_id: 2,
    to_user_id: 1,
    feedback_type: 'positive',
    category: 'technical',
    content: 'Excellent work on the API optimization project. Your attention to performance metrics and systematic approach to debugging complex issues has significantly improved our system reliability.',
    is_anonymous: false,
    acknowledged: true,
    created_at: '2026-01-10T10:00:00Z',
    from_user_name: 'Sarah Johnson',
    from_user_title: 'Engineering Manager',
    to_user_name: 'John Smith',
    to_user_title: 'Senior Software Engineer'
  },
  {
    id: 2,
    from_user_id: 5,
    to_user_id: 1,
    feedback_type: 'constructive',
    category: 'communication',
    content: 'Would appreciate more detailed documentation on the new caching implementation. This would help the team understand the technical decisions better.',
    is_anonymous: false,
    acknowledged: false,
    created_at: '2026-01-12T14:30:00Z',
    from_user_name: 'Chris Candidate',
    from_user_title: 'Software Engineer',
    to_user_name: 'John Smith',
    to_user_title: 'Senior Software Engineer'
  },
  {
    id: 3,
    from_user_id: 1,
    to_user_id: 2,
    feedback_type: 'positive',
    category: 'leadership',
    content: 'Your leadership during the incident response was outstanding. Clear communication and calm decision-making helped the team resolve the issue quickly.',
    is_anonymous: false,
    acknowledged: true,
    created_at: '2026-01-08T16:00:00Z',
    from_user_name: 'John Smith',
    from_user_title: 'Senior Software Engineer',
    to_user_name: 'Sarah Johnson',
    to_user_title: 'Engineering Manager'
  },
  {
    id: 4,
    from_user_id: 50,
    to_user_id: 2,
    feedback_type: 'positive',
    category: 'mentorship',
    content: 'Thank you for taking the time to mentor me on the new framework. Your guidance has been invaluable in building my confidence.',
    is_anonymous: false,
    acknowledged: true,
    created_at: '2026-01-09T11:30:00Z',
    from_user_name: 'Team Member 48',
    from_user_title: 'Software Engineer',
    to_user_name: 'Sarah Johnson',
    to_user_title: 'Engineering Manager'
  },
  {
    id: 5,
    from_user_id: 2,
    to_user_id: 51,
    feedback_type: 'constructive',
    category: 'collaboration',
    content: 'I\'ve noticed you sometimes work in isolation on features. Consider involving the team earlier in the design process to get diverse perspectives.',
    is_anonymous: false,
    acknowledged: false,
    created_at: '2026-01-11T13:00:00Z',
    from_user_name: 'Sarah Johnson',
    from_user_title: 'Engineering Manager',
    to_user_name: 'Team Member 49',
    to_user_title: 'Software Engineer II'
  },
  {
    id: 6,
    from_user_id: 3,
    to_user_id: 2,
    feedback_type: 'positive',
    category: 'strategic_thinking',
    content: 'Your proposal for restructuring the team\'s sprint planning was well thought out and has already improved our velocity. Great strategic thinking!',
    is_anonymous: false,
    acknowledged: true,
    created_at: '2026-01-07T10:00:00Z',
    from_user_name: 'HR Admin',
    from_user_title: 'VP of HR',
    to_user_name: 'Sarah Johnson',
    to_user_title: 'Engineering Manager'
  }
];

// Generate performance reviews (sample)
export const demoReviews = [
  {
    id: 1,
    employee_id: 1,
    reviewer_id: 2,
    cycle_name: '2025 Annual Review',
    review_type: 'annual',
    period_start: '2025-01-01',
    period_end: '2025-12-31',
    overall_rating: 4.2,
    status: 'completed',
    strengths: 'Strong technical skills, excellent problem-solving ability, proactive in identifying improvements',
    areas_for_improvement: 'Could improve documentation practices and knowledge sharing with junior team members',
    goals_achieved: 'Successfully delivered 3 major projects ahead of schedule',
    development_plan: 'Focus on technical leadership and mentoring in 2026',
    manager_comments: 'High performer with strong potential for senior technical leadership role',
    employee_comments: 'Excited to take on more mentorship responsibilities',
    completed_at: '2025-12-15T10:00:00Z',
    created_at: '2025-12-01T09:00:00Z',
    manager_name: 'Sarah Johnson',
    employee_name: 'John Smith'
  },
  {
    id: 2,
    employee_id: 50,
    reviewer_id: 2,
    cycle_name: '2026 Q1 Review',
    review_type: 'quarterly',
    period_start: '2026-01-01',
    period_end: '2026-03-31',
    overall_rating: 0,
    status: 'in_progress',
    strengths: '',
    areas_for_improvement: '',
    goals_achieved: '',
    development_plan: '',
    manager_comments: '',
    employee_comments: '',
    completed_at: null,
    created_at: '2026-01-10T09:00:00Z',
    manager_name: 'Sarah Johnson',
    employee_name: 'Team Member 48'
  },
  {
    id: 3,
    employee_id: 51,
    reviewer_id: 2,
    cycle_name: '2026 Q1 Review',
    review_type: 'quarterly',
    period_start: '2026-01-01',
    period_end: '2026-03-31',
    overall_rating: 0,
    status: 'not_started',
    strengths: '',
    areas_for_improvement: '',
    goals_achieved: '',
    development_plan: '',
    manager_comments: '',
    employee_comments: '',
    completed_at: null,
    created_at: '2026-01-10T09:00:00Z',
    manager_name: 'Sarah Johnson',
    employee_name: 'Team Member 49'
  },
  {
    id: 4,
    employee_id: 3,
    reviewer_id: 50,
    cycle_name: '2025 Annual Review',
    review_type: 'annual',
    period_start: '2025-01-01',
    period_end: '2025-12-31',
    overall_rating: 4.7,
    status: 'completed',
    strengths: 'Outstanding strategic thinking, excellent people management, drives team results',
    areas_for_improvement: 'Work-life balance, delegation of routine tasks',
    goals_achieved: 'Team achieved 95% of annual objectives, reduced turnover by 30%',
    development_plan: 'Focus on executive leadership skills, expand cross-functional collaboration',
    manager_comments: 'Exceptional leader with strong potential for director role',
    employee_comments: 'Looking forward to taking on broader organizational responsibilities',
    completed_at: '2025-12-20T14:00:00Z',
    created_at: '2025-12-05T09:00:00Z',
    manager_name: 'Michael Chen',
    employee_name: 'HR Admin'
  },
  {
    id: 5,
    employee_id: 52,
    reviewer_id: 2,
    cycle_name: '2026 Q1 Review',
    review_type: 'quarterly',
    period_start: '2026-01-01',
    period_end: '2026-03-31',
    overall_rating: 0,
    status: 'in_progress',
    strengths: '',
    areas_for_improvement: '',
    goals_achieved: '',
    development_plan: '',
    manager_comments: '',
    employee_comments: '',
    completed_at: null,
    created_at: '2026-01-11T09:00:00Z',
    manager_name: 'Sarah Johnson',
    employee_name: 'Team Member 50'
  }
];

// Additional helper functions for API compatibility
export function getDemoUserById(userId: number) {
  const user = demoUsers.find(u => u.id === userId);
  console.log('Demo mode: Looking up user by ID:', userId, 'Found:', !!user);
  return user;
}

export function getDemoTeamMembersByManagerId(managerId: number) {
  const teamMembers = demoUsers.filter(u => u.manager_id === managerId);
  console.log('Demo mode: Found', teamMembers.length, 'team members for manager', managerId);
  return teamMembers.map(member => ({
    ...member,
    latestReview: {
      rating: member.performance_rating,
      potential_score: member.potential === 'high' ? 4 : member.potential === 'medium' ? 3 : 2,
      flight_risk_level: member.performance_rating >= 4.0 ? 'low' : member.performance_rating >= 3.5 ? 'medium' : 'high'
    },
    flightRisk: {
      riskLevel: member.performance_rating >= 4.0 ? 'low' : member.performance_rating >= 3.5 ? 'medium' : 'high',
      score: Math.round((5 - member.performance_rating) * 20),
      factors: member.performance_rating < 3.5 ? ['Performance concerns', 'Low engagement'] : ['Stable'],
      recommendations: member.performance_rating < 3.5 ? ['Schedule 1-on-1', 'Review development plan'] : ['Continue current support']
    }
  }));
}

export function getDemoTeamHealthByManagerId(managerId: number) {
  const teamMembers = demoUsers.filter(u => u.manager_id === managerId);
  const avgRating = teamMembers.length > 0
    ? teamMembers.reduce((sum, u) => sum + u.performance_rating, 0) / teamMembers.length
    : 3.5;
  
  const engagementScore = Math.round(avgRating * 20); // Convert to 0-100 scale
  
  return {
    teamSize: teamMembers.length,
    averageRating: Math.round(avgRating * 10) / 10,
    highPerformers: teamMembers.filter(u => u.performance_rating >= 4.0).length,
    atRisk: teamMembers.filter(u => u.performance_rating < 3.0).length,
    engagementScore: engagementScore,
    turnoverRisk: teamMembers.filter(u => u.performance_rating < 3.5).length,
    // Add structured health data for insights
    overallScore: engagementScore,
    engagement: engagementScore,
    performance: Math.round(avgRating * 20)
  };
}

// Demo insights for personalized AI recommendations
export const demoInsights = [
  {
    id: 1,
    userId: 1, // john.smith@company.com
    type: 'strength',
    category: 'Technical Excellence',
    priority: 'high',
    title: 'Exceptional Code Quality',
    description: 'Your code reviews consistently demonstrate best practices and architectural excellence.',
    recommendations: [
      'Consider mentoring junior developers',
      'Lead technical design reviews',
      'Document architectural patterns for team'
    ],
    createdAt: new Date('2024-01-10').toISOString()
  },
  {
    id: 2,
    userId: 1,
    type: 'opportunity',
    category: 'Leadership',
    priority: 'medium',
    title: 'Leadership Potential',
    description: 'Team members frequently seek your technical guidance. Consider developing formal leadership skills.',
    recommendations: [
      'Enroll in leadership development program',
      'Shadow current tech leads',
      'Lead next sprint planning session'
    ],
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 3,
    userId: 2, // manager@company.com
    type: 'strength',
    category: 'Team Performance',
    priority: 'high',
    title: 'Strong Team Results',
    description: 'Your team consistently exceeds sprint goals and maintains high code quality.',
    recommendations: [
      'Share best practices with other managers',
      'Document team processes',
      'Consider expanding team scope'
    ],
    createdAt: new Date('2024-01-12').toISOString()
  }
];

// Helper functions
export function isDemoMode() {
  const isDemo = !process.env.POSTGRES_URL && !process.env.DATABASE_PATH;
  console.log('Checking demo mode:', isDemo, 'POSTGRES_URL:', !!process.env.POSTGRES_URL, 'DATABASE_PATH:', !!process.env.DATABASE_PATH);
  return isDemo;
}

export function getDemoUserByEmail(email: string) {
  const user = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  console.log('Demo mode: Looking up user:', email, 'Found:', !!user);
  return user;
}

export function getDemoGoalsByUserId(userId: number) {
  const goals = demoGoals.filter(g => g.owner_id === userId);
  console.log('Demo mode: Found', goals.length, 'goals for user', userId);
  return goals;
}

export function getDemoFeedbackByUserId(userId: number) {
  const feedback = demoFeedback.filter(f => f.to_user_id === userId || f.from_user_id === userId);
  console.log('Demo mode: Found', feedback.length, 'feedback items for user', userId);
  return feedback;
}

export function getDemoReviewsByUserId(userId: number) {
  const reviews = demoReviews.filter(r => r.employee_id === userId || r.reviewer_id === userId);
  console.log('Demo mode: Found', reviews.length, 'reviews for user', userId);
  return reviews;
}

// HR Data - Enterprise scale analytics
export const demoHRData = {
  companyMetrics: {
    totalEmployees: demoUsers.length,
    averageRating: 3.7,
    completedReviews: Math.floor(demoUsers.length * 0.92),
    pendingReviews: Math.floor(demoUsers.length * 0.08),
    activeGoals: demoGoals.length,
    averageTenure: 4.2,
    headcountGrowth: '+18% YoY'
  },
  talentInsights: {
    highPerformersHighPotential: demoUsers.filter(u => u.performance_rating >= 4.0 && u.potential === 'high').length,
    highPerformers: demoUsers.filter(u => u.performance_rating >= 4.0).length,
    highPotential: demoUsers.filter(u => u.potential === 'high').length,
    atRisk: demoUsers.filter(u => u.performance_rating < 3.0).length,
    needsDevelopment: demoUsers.filter(u => u.performance_rating >= 3.0 && u.performance_rating < 3.5).length,
    promotionReady: demoUsers.filter(u => u.performance_rating >= 4.3 && u.potential === 'high').length,
    flightRisk: Math.floor(demoUsers.length * 0.08)
  },
  nineBoxMatrix: {
    'high-high': demoUsers.filter(u => u.performance_rating >= 4.0 && u.potential === 'high').length,
    'high-medium': demoUsers.filter(u => u.performance_rating >= 4.0 && u.potential === 'medium').length,
    'high-low': demoUsers.filter(u => u.performance_rating >= 4.0 && u.potential === 'low').length,
    'medium-high': demoUsers.filter(u => u.performance_rating >= 3.5 && u.performance_rating < 4.0 && u.potential === 'high').length,
    'medium-medium': demoUsers.filter(u => u.performance_rating >= 3.5 && u.performance_rating < 4.0 && u.potential === 'medium').length,
    'medium-low': demoUsers.filter(u => u.performance_rating >= 3.5 && u.performance_rating < 4.0 && u.potential === 'low').length,
    'low-high': demoUsers.filter(u => u.performance_rating < 3.5 && u.potential === 'high').length,
    'low-medium': demoUsers.filter(u => u.performance_rating < 3.5 && u.potential === 'medium').length,
    'low-low': demoUsers.filter(u => u.performance_rating < 3.5 && u.potential === 'low').length
  },
  departmentBreakdown: departments.map(dept => {
    const deptUsers = demoUsers.filter(u => u.department === dept);
    const avgRating = deptUsers.length > 0
      ? deptUsers.reduce((sum, u) => sum + (u.performance_rating || 3.5), 0) / deptUsers.length
      : 3.5;
    return {
      department: dept,
      count: deptUsers.length,
      avgRating: Math.round(avgRating * 10) / 10,
      managersCount: deptUsers.filter(u => u.role === 'manager').length,
      headcountGrowth: Math.floor(Math.random() * 30) - 5 // -5% to +25%
    };
  }),
  locationBreakdown: locations.map(loc => {
    const locUsers = demoUsers.filter(u => u.location === loc);
    return {
      location: loc,
      count: locUsers.length,
      avgRating: locUsers.length > 0
        ? Math.round((locUsers.reduce((sum, u) => sum + (u.performance_rating || 3.5), 0) / locUsers.length) * 10) / 10
        : 3.5
    };
  }),
  performanceDistribution: {
    exceptional: demoUsers.filter(u => u.performance_rating >= 4.5).length,
    exceeds: demoUsers.filter(u => u.performance_rating >= 4.0 && u.performance_rating < 4.5).length,
    meets: demoUsers.filter(u => u.performance_rating >= 3.5 && u.performance_rating < 4.0).length,
    developing: demoUsers.filter(u => u.performance_rating >= 3.0 && u.performance_rating < 3.5).length,
    improvement: demoUsers.filter(u => u.performance_rating < 3.0).length
  }
};

// Skills data for endorsements
export const demoSkills = [
  // Programming Languages
  { id: 1, name: 'JavaScript', category: 'Programming' },
  { id: 2, name: 'TypeScript', category: 'Programming' },
  { id: 3, name: 'Python', category: 'Programming' },
  { id: 4, name: 'Java', category: 'Programming' },
  { id: 5, name: 'Go', category: 'Programming' },
  { id: 6, name: 'C#', category: 'Programming' },
  { id: 7, name: 'Ruby', category: 'Programming' },
  { id: 8, name: 'PHP', category: 'Programming' },
  
  // Frontend
  { id: 9, name: 'React', category: 'Frontend' },
  { id: 10, name: 'Vue.js', category: 'Frontend' },
  { id: 11, name: 'Angular', category: 'Frontend' },
  { id: 12, name: 'Next.js', category: 'Frontend' },
  { id: 13, name: 'Tailwind CSS', category: 'Frontend' },
  { id: 14, name: 'HTML/CSS', category: 'Frontend' },
  
  // Backend
  { id: 15, name: 'Node.js', category: 'Backend' },
  { id: 16, name: 'Express.js', category: 'Backend' },
  { id: 17, name: 'Django', category: 'Backend' },
  { id: 18, name: 'Spring Boot', category: 'Backend' },
  { id: 19, name: 'FastAPI', category: 'Backend' },
  
  // Database
  { id: 20, name: 'SQL', category: 'Database' },
  { id: 21, name: 'PostgreSQL', category: 'Database' },
  { id: 22, name: 'MongoDB', category: 'Database' },
  { id: 23, name: 'Redis', category: 'Database' },
  
  // DevOps & Cloud
  { id: 24, name: 'AWS', category: 'Cloud' },
  { id: 25, name: 'Azure', category: 'Cloud' },
  { id: 26, name: 'Docker', category: 'DevOps' },
  { id: 27, name: 'Kubernetes', category: 'DevOps' },
  { id: 28, name: 'CI/CD', category: 'DevOps' },
  
  // Data & Analytics
  { id: 29, name: 'Data Analysis', category: 'Analytics' },
  { id: 30, name: 'Machine Learning', category: 'Analytics' },
  { id: 31, name: 'TensorFlow', category: 'Analytics' },
  { id: 32, name: 'Power BI', category: 'Analytics' },
  
  // Management & Leadership
  { id: 33, name: 'Team Leadership', category: 'Leadership' },
  { id: 34, name: 'Project Management', category: 'Management' },
  { id: 35, name: 'Agile/Scrum', category: 'Management' },
  { id: 36, name: 'Strategic Planning', category: 'Leadership' },
  
  // Soft Skills
  { id: 37, name: 'Communication', category: 'Soft Skills' },
  { id: 38, name: 'Problem Solving', category: 'Soft Skills' },
  { id: 39, name: 'Collaboration', category: 'Soft Skills' },
  { id: 40, name: 'Mentoring', category: 'Soft Skills' }
];

// User skills with proficiency and endorsements
export const demoUserSkills = [
  // John Smith (id: 1) - Senior Software Engineer
  { id: 1, user_id: 1, skill_id: 1, skill_name: 'JavaScript', skill_category: 'Programming', proficiency_level: 5, years_experience: 8, endorsed_count: 12 },
  { id: 2, user_id: 1, skill_id: 2, skill_name: 'TypeScript', skill_category: 'Programming', proficiency_level: 5, years_experience: 6, endorsed_count: 10 },
  { id: 3, user_id: 1, skill_id: 9, skill_name: 'React', skill_category: 'Frontend', proficiency_level: 5, years_experience: 7, endorsed_count: 15 },
  { id: 4, user_id: 1, skill_id: 12, skill_name: 'Next.js', skill_category: 'Frontend', proficiency_level: 4, years_experience: 3, endorsed_count: 8 },
  { id: 5, user_id: 1, skill_id: 15, skill_name: 'Node.js', skill_category: 'Backend', proficiency_level: 5, years_experience: 8, endorsed_count: 11 },
  { id: 6, user_id: 1, skill_id: 40, skill_name: 'Mentoring', skill_category: 'Soft Skills', proficiency_level: 4, years_experience: 5, endorsed_count: 7 },

  // Manager (id: 2) - Sarah Johnson
  { id: 7, user_id: 2, skill_id: 33, skill_name: 'Team Leadership', skill_category: 'Leadership', proficiency_level: 5, years_experience: 10, endorsed_count: 20 },
  { id: 8, user_id: 2, skill_id: 34, skill_name: 'Project Management', skill_category: 'Management', proficiency_level: 5, years_experience: 12, endorsed_count: 18 },
  { id: 9, user_id: 2, skill_id: 35, skill_name: 'Agile/Scrum', skill_category: 'Management', proficiency_level: 5, years_experience: 10, endorsed_count: 16 },
  { id: 10, user_id: 2, skill_id: 37, skill_name: 'Communication', skill_category: 'Soft Skills', proficiency_level: 5, years_experience: 12, endorsed_count: 22 },
  { id: 11, user_id: 2, skill_id: 2, skill_name: 'TypeScript', skill_category: 'Programming', proficiency_level: 4, years_experience: 8, endorsed_count: 9 },

  // HR Admin (id: 3)
  { id: 12, user_id: 3, skill_id: 33, skill_name: 'Team Leadership', skill_category: 'Leadership', proficiency_level: 5, years_experience: 15, endorsed_count: 25 },
  { id: 13, user_id: 3, skill_id: 36, skill_name: 'Strategic Planning', skill_category: 'Leadership', proficiency_level: 5, years_experience: 12, endorsed_count: 19 },
  { id: 14, user_id: 3, skill_id: 37, skill_name: 'Communication', skill_category: 'Soft Skills', proficiency_level: 5, years_experience: 15, endorsed_count: 23 },

  // Additional engineers with varied skills
  { id: 15, user_id: 50, skill_id: 3, skill_name: 'Python', skill_category: 'Programming', proficiency_level: 5, years_experience: 7, endorsed_count: 14 },
  { id: 16, user_id: 50, skill_id: 30, skill_name: 'Machine Learning', skill_category: 'Analytics', proficiency_level: 4, years_experience: 5, endorsed_count: 11 },
  { id: 17, user_id: 50, skill_id: 31, skill_name: 'TensorFlow', skill_category: 'Analytics', proficiency_level: 4, years_experience: 4, endorsed_count: 9 },
  
  { id: 18, user_id: 51, skill_id: 4, skill_name: 'Java', skill_category: 'Programming', proficiency_level: 5, years_experience: 10, endorsed_count: 13 },
  { id: 19, user_id: 51, skill_id: 18, skill_name: 'Spring Boot', skill_category: 'Backend', proficiency_level: 5, years_experience: 8, endorsed_count: 12 },
  { id: 20, user_id: 51, skill_id: 27, skill_name: 'Kubernetes', skill_category: 'DevOps', proficiency_level: 4, years_experience: 5, endorsed_count: 10 },
  
  { id: 21, user_id: 52, skill_id: 24, skill_name: 'AWS', skill_category: 'Cloud', proficiency_level: 5, years_experience: 6, endorsed_count: 15 },
  { id: 22, user_id: 52, skill_id: 26, skill_name: 'Docker', skill_category: 'DevOps', proficiency_level: 5, years_experience: 7, endorsed_count: 14 },
  { id: 23, user_id: 52, skill_id: 28, skill_name: 'CI/CD', skill_category: 'DevOps', proficiency_level: 4, years_experience: 5, endorsed_count: 11 },
];

// Track endorsements in demo mode (in-memory)
const demoEndorsements = new Map<string, boolean>();

export function getDemoSkills() {
  return demoSkills;
}

export function getDemoUserSkills(userId: number) {
  return demoUserSkills.filter(us => us.user_id === userId);
}

export function endorseDemoSkill(endorserId: number, userId: number, skillId: number) {
  const key = `${endorserId}-${userId}-${skillId}`;
  
  if (demoEndorsements.has(key)) {
    return { error: 'You have already endorsed this skill' };
  }
  
  const userSkill = demoUserSkills.find(us => us.user_id === userId && us.skill_id === skillId);
  if (!userSkill) {
    return { error: 'User does not have this skill' };
  }
  
  demoEndorsements.set(key, true);
  userSkill.endorsed_count += 1;
  
  return { success: true, endorsedCount: userSkill.endorsed_count };
}

console.log('📊 Demo Data Summary:');
console.log('  - Total Employees:', demoUsers.length);
console.log('  - Departments:', departments.length);
console.log('  - Locations:', locations.length);
console.log('  - Managers:', allManagers.length);
console.log('  - Test Manager Direct Reports:', demoUsers.filter(u => u.manager_id === 2).length);
console.log('  - High Performers:', demoUsers.filter(u => u.performance_rating >= 4.5).length);
console.log('  - At Risk:', demoUsers.filter(u => u.performance_rating < 3.0).length);
