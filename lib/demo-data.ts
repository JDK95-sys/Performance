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

// Generate comprehensive goals data
export const demoGoals: any[] = [];

// Goal templates for realistic variety
const goalTemplates = {
  Engineering: [
    { title: 'Improve code quality and reduce bugs', category: 'technical', type: 'performance' },
    { title: 'Implement microservices architecture', category: 'technical', type: 'project' },
    { title: 'Reduce deployment time by 50%', category: 'technical', type: 'performance' },
    { title: 'Complete AWS certification', category: 'professional', type: 'development' },
    { title: 'Mentor 2 junior engineers', category: 'leadership', type: 'development' },
    { title: 'Increase test coverage to 80%', category: 'technical', type: 'performance' }
  ],
  Product: [
    { title: 'Launch new product feature', category: 'delivery', type: 'project' },
    { title: 'Improve user engagement by 25%', category: 'metrics', type: 'performance' },
    { title: 'Complete product management certification', category: 'professional', type: 'development' },
    { title: 'Conduct 20 customer interviews', category: 'research', type: 'performance' }
  ],
  Sales: [
    { title: 'Achieve 120% of quota', category: 'revenue', type: 'performance' },
    { title: 'Close 5 enterprise deals', category: 'revenue', type: 'performance' },
    { title: 'Expand into 3 new territories', category: 'growth', type: 'project' },
    { title: 'Complete sales leadership training', category: 'professional', type: 'development' }
  ],
  Marketing: [
    { title: 'Increase lead generation by 40%', category: 'metrics', type: 'performance' },
    { title: 'Launch rebrand campaign', category: 'project', type: 'project' },
    { title: 'Improve conversion rate to 15%', category: 'metrics', type: 'performance' },
    { title: 'Complete digital marketing certification', category: 'professional', type: 'development' }
  ],
  Default: [
    { title: 'Deliver Q1 objectives on time', category: 'performance', type: 'performance' },
    { title: 'Improve efficiency by 20%', category: 'performance', type: 'performance' },
    { title: 'Complete professional development course', category: 'professional', type: 'development' },
    { title: 'Lead cross-functional initiative', category: 'leadership', type: 'project' }
  ]
};

const statuses = ['not_started', 'on_track', 'at_risk', 'completed', 'in_progress'];
const priorities = ['low', 'medium', 'high', 'critical'];
const visibilities = ['private', 'team', 'department', 'company'];
const quarters = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'];

// Seed goals - Add specific goals for key demo accounts
demoGoals.push({
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
});

demoGoals.push({
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
});

// Generate goals for ~800 employees (15% of workforce has active goals)
let goalId = 3;
const employeesWithGoals = demoUsers.filter(u => u.role === 'employee').slice(0, 800);

employeesWithGoals.forEach((employee, idx) => {
  const dept = employee.department;
  const templates = goalTemplates[dept as keyof typeof goalTemplates] || goalTemplates.Default;
  const numGoals = Math.random() > 0.7 ? 2 : 1; // 30% have 2 goals, 70% have 1

  for (let g = 0; g < numGoals; g++) {
    const template = templates[Math.floor(Math.random() * templates.length)];
    const quarter = quarters[Math.floor(Math.random() * quarters.length)];
    const statusRand = Math.random();
    let status: string;
    if (statusRand < 0.05) status = 'not_started';
    else if (statusRand < 0.15) status = 'at_risk';
    else if (statusRand < 0.30) status = 'completed';
    else if (statusRand < 0.50) status = 'in_progress';
    else status = 'on_track';

    const progress = status === 'completed' ? 100 :
                    status === 'not_started' ? 0 :
                    status === 'at_risk' ? 30 + Math.floor(Math.random() * 30) :
                    status === 'in_progress' ? 20 + Math.floor(Math.random() * 50) :
                    50 + Math.floor(Math.random() * 40); // on_track

    demoGoals.push({
      id: goalId++,
      owner_id: employee.id,
      owner_type: 'individual',
      title: template.title,
      description: `${template.title} for ${quarter}`,
      goal_type: template.type,
      category: template.category,
      start_date: '2026-01-01',
      due_date: quarter.includes('Q1') ? '2026-03-31' : quarter.includes('Q2') ? '2026-06-30' : quarter.includes('Q3') ? '2026-09-30' : '2026-12-31',
      quarter: quarter,
      status: status,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      visibility: visibilities[Math.floor(Math.random() * visibilities.length)],
      progress_percentage: progress,
      weight: 1.0,
      created_by: employee.id,
      keyResults: []
    });
  }
});

// Generate comprehensive feedback data
export const demoFeedback: any[] = [];

// Feedback templates
const feedbackTemplates = {
  positive: {
    technical: [
      'Excellent work on the {project}. Your attention to detail and systematic approach has significantly improved our system.',
      'Outstanding technical contribution on {project}. Your code quality and architecture design are exemplary.',
      'Your debugging skills on {project} were crucial to resolving the critical issue quickly.',
      'Impressive implementation of {project}. The solution is elegant and maintainable.'
    ],
    collaboration: [
      'Great team player! Your willingness to help others and share knowledge is appreciated.',
      'Excellent collaboration during the {project}. Your communication kept everyone aligned.',
      'Thank you for your support during the sprint. Your positive attitude makes a difference.',
      'Your mentorship of junior team members has been invaluable.'
    ],
    leadership: [
      'Excellent leadership during the {project}. You kept the team motivated and focused.',
      'Your decision-making during critical moments was spot-on. Great leadership!',
      'Thanks for stepping up to lead the initiative. Your guidance was essential.',
      'Your ability to inspire the team and drive results is exceptional.'
    ],
    communication: [
      'Your presentation to stakeholders was clear and compelling. Great job!',
      'Excellent documentation on {project}. It will help the team significantly.',
      'Your status updates are always clear and actionable. Much appreciated!',
      'Thank you for keeping everyone informed during the rollout.'
    ]
  },
  constructive: {
    technical: [
      'Consider adding more test coverage for edge cases in future implementations.',
      'Would appreciate more detailed technical documentation for the {project}.',
      'The implementation works but could benefit from performance optimization.',
      'Let\'s discuss the architecture approach before the next major refactor.'
    ],
    collaboration: [
      'Would love to see more active participation in team discussions.',
      'Consider reaching out earlier when you need help to avoid last-minute rushes.',
      'More frequent check-ins would help keep the team aligned on progress.',
      'Let\'s work on improving response time to team messages and requests.'
    ],
    communication: [
      'Would appreciate more frequent status updates on project progress.',
      'Consider providing more context in commit messages for easier code review.',
      'Let\'s improve documentation to help team members understand the system better.',
      'More detailed meeting notes would help those who couldn\'t attend.'
    ],
    leadership: [
      'Consider delegating more tasks to develop team members\' skills.',
      'Would benefit from involving the team more in decision-making processes.',
      'Let\'s work on providing more coaching feedback to team members.',
      'Consider being more decisive during critical project phases.'
    ]
  },
  recognition: [
    'Went above and beyond to deliver {project} on time. Outstanding effort!',
    'Thank you for your exceptional contribution to {project}!',
    '🎉 Congratulations on the successful launch of {project}!',
    'Your hard work and dedication on {project} did not go unnoticed. Thank you!'
  ],
  coaching: [
    'Let\'s focus on improving your {skill} skills. I\'m here to support your growth.',
    'I see potential in your {skill} abilities. Let\'s work on developing them further.',
    'Consider these areas for development: {skill}. Happy to discuss how I can help.',
    'Great progress on {skill}! Let\'s continue building on this momentum.'
  ]
};

const categories = ['technical', 'collaboration', 'leadership', 'communication', 'other'];
const projects = ['the recent sprint', 'last week\'s release', 'the feature launch', 'the bug fix', 'code review', 'the presentation'];
const skills = ['technical leadership', 'communication', 'time management', 'strategic thinking', 'problem-solving'];

// Add seed feedback for key accounts
demoFeedback.push({
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
});

demoFeedback.push({
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
});

// Generate feedback for ~1000 interactions
let feedbackId = 3;
const activeEmployees = demoUsers.filter(u => u.role === 'employee' || u.role === 'manager').slice(0, 600);

for (let i = 0; i < 1000; i++) {
  const fromUser = activeEmployees[Math.floor(Math.random() * activeEmployees.length)];
  let toUser = activeEmployees[Math.floor(Math.random() * activeEmployees.length)];
  
  // Avoid self-feedback
  while (toUser.id === fromUser.id) {
    toUser = activeEmployees[Math.floor(Math.random() * activeEmployees.length)];
  }
  
  // Determine feedback type based on distribution
  const typeRand = Math.random();
  let feedbackType: string;
  if (typeRand < 0.45) feedbackType = 'positive'; // 45%
  else if (typeRand < 0.70) feedbackType = 'constructive'; // 25%
  else if (typeRand < 0.85) feedbackType = 'recognition'; // 15%
  else feedbackType = 'coaching'; // 15%
  
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  // Generate content based on type
  let content: string;
  if (feedbackType === 'positive' || feedbackType === 'constructive') {
    const templates = feedbackTemplates[feedbackType as 'positive' | 'constructive'];
    const categoryTemplates = templates[category as keyof typeof templates] || templates.technical;
    content = categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
  } else if (feedbackType === 'recognition') {
    content = feedbackTemplates.recognition[Math.floor(Math.random() * feedbackTemplates.recognition.length)];
  } else {
    content = feedbackTemplates.coaching[Math.floor(Math.random() * feedbackTemplates.coaching.length)];
  }
  
  // Replace placeholders
  content = content
    .replace('{project}', projects[Math.floor(Math.random() * projects.length)])
    .replace('{skill}', skills[Math.floor(Math.random() * skills.length)]);
  
  // Generate date within last 90 days
  const daysAgo = Math.floor(Math.random() * 90);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  
  demoFeedback.push({
    id: feedbackId++,
    from_user_id: fromUser.id,
    to_user_id: toUser.id,
    feedback_type: feedbackType,
    category: category,
    content: content,
    is_anonymous: Math.random() < 0.1, // 10% anonymous
    acknowledged: Math.random() < 0.7, // 70% acknowledged
    created_at: date.toISOString(),
    from_user_name: fromUser.name,
    from_user_title: fromUser.title,
    to_user_name: toUser.name,
    to_user_title: toUser.title
  });
}

// Generate comprehensive performance reviews
export const demoReviews: any[] = [];

// Review templates
const strengthsTemplates = [
  'Strong technical skills and excellent problem-solving ability',
  'Exceptional collaboration and team player attitude',
  'Consistently delivers high-quality work on time',
  'Proactive in identifying and resolving issues',
  'Excellent communication skills and stakeholder management',
  'Strong leadership and mentorship capabilities',
  'Innovative thinking and creative problem solving',
  'High attention to detail and quality standards',
  'Effective time management and prioritization',
  'Positive attitude and cultural fit'
];

const improvementTemplates = [
  'Could improve documentation practices and knowledge sharing',
  'Would benefit from more proactive communication on blockers',
  'Could strengthen technical depth in certain areas',
  'Would benefit from improved time estimation skills',
  'Could improve delegation and team empowerment',
  'Would benefit from more strategic thinking',
  'Could strengthen presentation and public speaking skills',
  'Would benefit from more attention to code review feedback',
  'Could improve cross-functional collaboration',
  'Would benefit from better work-life balance'
];

const achievementsTemplates = [
  'Successfully delivered {count} major projects ahead of schedule',
  'Achieved {count}% improvement in key performance metrics',
  'Led {count} cross-functional initiatives successfully',
  'Mentored {count} team members resulting in their promotion',
  'Reduced technical debt by {count}%',
  'Improved team efficiency by {count}%'
];

// Add seed review for john.smith
demoReviews.push({
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
});

// Generate reviews for ~700 employees (manager-employee pairs)
let reviewId = 2;
const employeesForReview = demoUsers.filter(u => u.role === 'employee' && u.manager_id).slice(0, 700);

employeesForReview.forEach((employee) => {
  const manager = demoUsers.find(u => u.id === employee.manager_id);
  if (!manager) return;
  
  const rating = employee.performance_rating || 3.5;
  
  // 70% completed, 20% in_progress, 10% not_started
  const statusRand = Math.random();
  let status: string;
  if (statusRand < 0.70) status = 'completed';
  else if (statusRand < 0.90) status = 'in_progress';
  else status = 'not_started';
  
  // Select random strengths and improvements
  const numStrengths = Math.floor(Math.random() * 2) + 2; // 2-3 strengths
  const selectedStrengths = [];
  for (let i = 0; i < numStrengths; i++) {
    const strength = strengthsTemplates[Math.floor(Math.random() * strengthsTemplates.length)];
    if (!selectedStrengths.includes(strength)) {
      selectedStrengths.push(strength);
    }
  }
  
  const numImprovements = Math.floor(Math.random() * 2) + 1; // 1-2 improvements
  const selectedImprovements = [];
  for (let i = 0; i < numImprovements; i++) {
    const improvement = improvementTemplates[Math.floor(Math.random() * improvementTemplates.length)];
    if (!selectedImprovements.includes(improvement)) {
      selectedImprovements.push(improvement);
    }
  }
  
  const achievement = achievementsTemplates[Math.floor(Math.random() * achievementsTemplates.length)]
    .replace('{count}', String(Math.floor(Math.random() * 5) + 1));
  
  // Generate completion date based on status
  let completedAt = null;
  let createdAt = '2025-11-01T09:00:00Z';
  if (status === 'completed') {
    const daysAgo = Math.floor(Math.random() * 30) + 15; // 15-45 days ago
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    completedAt = date.toISOString();
  }
  
  demoReviews.push({
    id: reviewId++,
    employee_id: employee.id,
    reviewer_id: manager.id,
    cycle_name: '2025 Annual Review',
    review_type: 'annual',
    period_start: '2025-01-01',
    period_end: '2025-12-31',
    overall_rating: rating,
    status: status,
    strengths: selectedStrengths.join(', '),
    areas_for_improvement: selectedImprovements.join(', '),
    goals_achieved: achievement,
    development_plan: rating >= 4.0 ? 'Continue high performance and take on leadership opportunities' :
                      rating >= 3.5 ? 'Focus on consistent performance and skill development' :
                      'Work with manager on performance improvement plan',
    manager_comments: rating >= 4.5 ? 'Exceptional performer with promotion potential' :
                       rating >= 4.0 ? 'Strong performer, keep up the excellent work' :
                       rating >= 3.5 ? 'Solid contributor, meeting expectations' :
                       rating >= 3.0 ? 'Developing well, some areas need attention' :
                       'Performance needs improvement, let\'s work together on a plan',
    employee_comments: status === 'completed' ? 'Thank you for the feedback, looking forward to continued growth' : null,
    completed_at: completedAt,
    created_at: createdAt,
    manager_name: manager.name,
    employee_name: employee.name
  });
});

// Generate development plans for high-potential employees
export const demoDevelopmentPlans: any[] = [];

const targetRoles = [
  'Senior Software Engineer',
  'Staff Engineer',
  'Engineering Manager',
  'Senior Product Manager',
  'Director of Engineering',
  'Principal Engineer',
  'Tech Lead',
  'Senior Manager',
  'Director'
];

const actionTemplates = {
  training: [
    'Complete leadership development program',
    'Enroll in technical certification course',
    'Attend industry conference',
    'Complete online specialization course',
    'Participate in executive coaching program'
  ],
  project: [
    'Lead cross-functional initiative',
    'Drive architecture redesign project',
    'Manage critical product launch',
    'Own major technical migration',
    'Lead team process improvement initiative'
  ],
  mentoring: [
    'Mentor 2 junior team members',
    'Shadow senior leadership for 3 months',
    'Participate in reverse mentoring program',
    'Lead knowledge sharing sessions',
    'Coach peer on specific skill area'
  ],
  stretch_assignment: [
    'Take on interim leadership role',
    'Represent team in executive meetings',
    'Lead customer escalation resolution',
    'Drive strategic planning initiative',
    'Manage vendor relationship'
  ]
};

let planId = 1;
const highPotentialEmployees = demoUsers.filter(u => 
  u.role === 'employee' && 
  u.potential === 'high' && 
  u.performance_rating >= 3.8
).slice(0, 250);

highPotentialEmployees.forEach((employee) => {
  const manager = demoUsers.find(u => u.id === employee.manager_id);
  if (!manager) return;
  
  const targetRole = targetRoles[Math.floor(Math.random() * targetRoles.length)];
  const statusRand = Math.random();
  const status = statusRand < 0.60 ? 'active' : statusRand < 0.80 ? 'draft' : 'on_hold';
  
  // Generate 2-4 development actions
  const numActions = Math.floor(Math.random() * 3) + 2;
  const actions = [];
  const actionTypes = Object.keys(actionTemplates);
  
  for (let i = 0; i < numActions; i++) {
    const actionType = actionTypes[Math.floor(Math.random() * actionTypes.length)] as keyof typeof actionTemplates;
    const templates = actionTemplates[actionType];
    const actionTitle = templates[Math.floor(Math.random() * templates.length)];
    
    const actionStatusRand = Math.random();
    const actionStatus = actionStatusRand < 0.30 ? 'completed' : 
                        actionStatusRand < 0.60 ? 'in_progress' : 
                        'not_started';
    
    const daysUntilTarget = Math.floor(Math.random() * 180) + 30; // 30-210 days
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysUntilTarget);
    
    actions.push({
      id: planId * 10 + i,
      plan_id: planId,
      action_type: actionType,
      title: actionTitle,
      description: `${actionTitle} to develop skills for ${targetRole} role`,
      target_date: targetDate.toISOString().split('T')[0],
      status: actionStatus,
      progress_notes: actionStatus === 'completed' ? 'Successfully completed' :
                     actionStatus === 'in_progress' ? 'Making good progress' : null,
      completed_at: actionStatus === 'completed' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null,
      created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
    });
  }
  
  const planDate = new Date(Date.now() - Math.random() * 120 * 24 * 60 * 60 * 1000);
  
  demoDevelopmentPlans.push({
    id: planId++,
    employee_id: employee.id,
    manager_id: manager.id,
    plan_name: `${employee.name} - Career Development Plan 2026`,
    target_role: targetRole,
    target_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
    status: status,
    overview: `Development plan to prepare ${employee.name} for ${targetRole} role through targeted skill building and experience.`,
    created_at: planDate.toISOString(),
    updated_at: new Date().toISOString(),
    manager_name: manager.name,
    employee_name: employee.name,
    actions: actions
  });
});

// Helper function to get development plans
export function getDemoDevelopmentPlansByUserId(userId: number) {
  const plans = demoDevelopmentPlans.filter(p => p.employee_id === userId || p.manager_id === userId);
  console.log('Demo mode: Found', plans.length, 'development plans for user', userId);
  return plans;
}

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
  
  return {
    teamSize: teamMembers.length,
    averageRating: Math.round(avgRating * 10) / 10,
    highPerformers: teamMembers.filter(u => u.performance_rating >= 4.0).length,
    atRisk: teamMembers.filter(u => u.performance_rating < 3.0).length,
    engagementScore: Math.round(avgRating * 20), // Convert to 0-100 scale
    turnoverRisk: teamMembers.filter(u => u.performance_rating < 3.5).length
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

console.log('📊 Demo Data Summary:');
console.log('  - Total Employees:', demoUsers.length);
console.log('  - Departments:', departments.length);
console.log('  - Locations:', locations.length);
console.log('  - Managers:', allManagers.length);
console.log('  - Goals:', demoGoals.length);
console.log('  - Feedback Items:', demoFeedback.length);
console.log('  - Performance Reviews:', demoReviews.length);
console.log('  - Development Plans:', demoDevelopmentPlans.length);
console.log('  - Test Manager Direct Reports:', demoUsers.filter(u => u.manager_id === 2).length);
console.log('  - High Performers:', demoUsers.filter(u => u.performance_rating >= 4.5).length);
console.log('  - At Risk:', demoUsers.filter(u => u.performance_rating < 3.0).length);
