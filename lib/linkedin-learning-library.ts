/**
 * LinkedIn Learning Course Library
 * Comprehensive catalog of professional development courses organized by skills and focus areas
 */

export interface LinkedInCourse {
  id: string;
  title: string;
  instructor: string;
  duration: string; // e.g., "2h 30m"
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  skills: string[];
  url?: string;
  releaseDate?: string;
}

export interface FocusArea {
  id: string;
  name: string;
  description: string;
  courses: LinkedInCourse[];
}

// LinkedIn Learning Course Library organized by focus areas
export const linkedInLearningLibrary: FocusArea[] = [
  {
    id: 'technical-leadership',
    name: 'Technical Leadership',
    description: 'Develop skills to lead technical teams and drive engineering excellence',
    courses: [
      {
        id: 'tl-001',
        title: 'Tech Leadership: Practical Skills',
        instructor: 'Kristy-Anne Glubish',
        duration: '1h 15m',
        level: 'Intermediate',
        description: 'Learn practical leadership skills for tech leads including decision-making, delegation, and team motivation.',
        skills: ['Leadership', 'Team Management', 'Decision Making']
      },
      {
        id: 'tl-002',
        title: 'Leading Without Formal Authority',
        instructor: 'Drew Boyd',
        duration: '1h 8m',
        level: 'Intermediate',
        description: 'Influence and lead effectively even without a management title through building trust and credibility.',
        skills: ['Influence', 'Leadership', 'Communication']
      },
      {
        id: 'tl-003',
        title: 'Engineering Management Foundations',
        instructor: 'Ari Bendersky',
        duration: '1h 30m',
        level: 'Intermediate',
        description: 'Transition from individual contributor to engineering manager with foundational management skills.',
        skills: ['Engineering Management', 'Team Building', 'Performance Management']
      },
      {
        id: 'tl-004',
        title: 'Technical Recruiting',
        instructor: 'Robyn Melby',
        duration: '1h 12m',
        level: 'Intermediate',
        description: 'Learn to identify, attract, and hire top technical talent for your team.',
        skills: ['Recruiting', 'Interviewing', 'Talent Acquisition']
      },
      {
        id: 'tl-005',
        title: 'Building High-Performance Teams',
        instructor: 'Mike Figliuolo',
        duration: '1h 45m',
        level: 'Advanced',
        description: 'Create and sustain high-performing teams through effective leadership practices.',
        skills: ['Team Building', 'Performance Management', 'Leadership']
      }
    ]
  },
  {
    id: 'system-design',
    name: 'System Design & Architecture',
    description: 'Master distributed systems, scalability, and software architecture patterns',
    courses: [
      {
        id: 'sd-001',
        title: 'Software Architecture: From Developer to Architect',
        instructor: 'Allen Holub',
        duration: '2h 15m',
        level: 'Advanced',
        description: 'Transition from developer to architect by understanding architectural patterns and design principles.',
        skills: ['Software Architecture', 'Design Patterns', 'System Design']
      },
      {
        id: 'sd-002',
        title: 'Microservices Foundations',
        instructor: 'Frank P Moley III',
        duration: '1h 45m',
        level: 'Intermediate',
        description: 'Learn microservices architecture principles, patterns, and best practices.',
        skills: ['Microservices', 'Distributed Systems', 'API Design']
      },
      {
        id: 'sd-003',
        title: 'Kubernetes: Native Tools',
        instructor: 'Kim Schlesinger',
        duration: '2h 5m',
        level: 'Intermediate',
        description: 'Master Kubernetes deployment, scaling, and orchestration for cloud-native applications.',
        skills: ['Kubernetes', 'DevOps', 'Container Orchestration']
      },
      {
        id: 'sd-004',
        title: 'Database Clinic: PostgreSQL',
        instructor: 'Adam Wilbert',
        duration: '1h 30m',
        level: 'Advanced',
        description: 'Advanced PostgreSQL techniques for performance optimization and scalability.',
        skills: ['PostgreSQL', 'Database Design', 'Performance Optimization']
      },
      {
        id: 'sd-005',
        title: 'Event-Driven Architecture Foundations',
        instructor: 'Kasun Indrasiri',
        duration: '1h 20m',
        level: 'Intermediate',
        description: 'Design scalable systems using event-driven architecture patterns.',
        skills: ['Event-Driven Architecture', 'Messaging', 'System Design']
      },
      {
        id: 'sd-006',
        title: 'API Design Patterns',
        instructor: 'Keith Casey',
        duration: '1h 35m',
        level: 'Intermediate',
        description: 'Learn REST API design patterns, GraphQL, and best practices for API development.',
        skills: ['API Design', 'REST', 'GraphQL']
      },
      {
        id: 'sd-007',
        title: 'Cloud Architecture: Design, Build, and Manage',
        instructor: 'David Linthicum',
        duration: '2h 10m',
        level: 'Advanced',
        description: 'Design and implement cloud-native architectures on AWS, Azure, and GCP.',
        skills: ['Cloud Architecture', 'AWS', 'Azure', 'System Design']
      }
    ]
  },
  {
    id: 'software-engineering',
    name: 'Software Engineering Excellence',
    description: 'Advanced programming techniques, testing, and software craftsmanship',
    courses: [
      {
        id: 'se-001',
        title: 'Programming Foundations: Design Patterns',
        instructor: 'Elisabeth Robson and Eric Freeman',
        duration: '2h 40m',
        level: 'Intermediate',
        description: 'Master classic design patterns and learn when and how to apply them.',
        skills: ['Design Patterns', 'Object-Oriented Programming', 'Software Design']
      },
      {
        id: 'se-002',
        title: 'Code Clinic: JavaScript',
        instructor: 'Ray Villalobos',
        duration: '2h 15m',
        level: 'Advanced',
        description: 'Solve real-world problems with modern JavaScript and TypeScript.',
        skills: ['JavaScript', 'TypeScript', 'Problem Solving']
      },
      {
        id: 'se-003',
        title: 'Test Driven Development',
        instructor: 'Miki Braslavsky',
        duration: '1h 25m',
        level: 'Intermediate',
        description: 'Learn TDD methodology to write better, more maintainable code.',
        skills: ['Testing', 'TDD', 'Code Quality']
      },
      {
        id: 'se-004',
        title: 'Refactoring: Improving Existing Code',
        instructor: 'Neelam Dwivedi',
        duration: '1h 50m',
        level: 'Intermediate',
        description: 'Techniques for refactoring legacy code and improving code quality.',
        skills: ['Refactoring', 'Code Quality', 'Software Maintenance']
      },
      {
        id: 'se-005',
        title: 'Advanced Python',
        instructor: 'Joe Marini',
        duration: '3h 15m',
        level: 'Advanced',
        description: 'Master advanced Python features including decorators, generators, and metaclasses.',
        skills: ['Python', 'Advanced Programming', 'Software Development']
      },
      {
        id: 'se-006',
        title: 'Debugging in JavaScript',
        instructor: 'David Gassner',
        duration: '1h 45m',
        level: 'Intermediate',
        description: 'Master debugging techniques and tools for JavaScript applications.',
        skills: ['Debugging', 'JavaScript', 'Problem Solving']
      }
    ]
  },
  {
    id: 'communication',
    name: 'Communication & Collaboration',
    description: 'Enhance interpersonal skills, presentation abilities, and teamwork',
    courses: [
      {
        id: 'comm-001',
        title: 'Communicating with Confidence',
        instructor: 'Jeff Ansell',
        duration: '1h 5m',
        level: 'Beginner',
        description: 'Build confidence in professional communication through proven techniques.',
        skills: ['Communication', 'Public Speaking', 'Confidence']
      },
      {
        id: 'comm-002',
        title: 'Writing in Plain English',
        instructor: 'Leslie O\'Flahavan',
        duration: '1h 15m',
        level: 'Beginner',
        description: 'Write clear, concise technical documentation and business communications.',
        skills: ['Technical Writing', 'Documentation', 'Communication']
      },
      {
        id: 'comm-003',
        title: 'Giving and Receiving Feedback',
        instructor: 'Gemma Roberts',
        duration: '1h 20m',
        level: 'Intermediate',
        description: 'Master the art of constructive feedback to improve team performance.',
        skills: ['Feedback', 'Communication', 'Team Management']
      },
      {
        id: 'comm-004',
        title: 'Presentation Skills for Technical Professionals',
        instructor: 'Garr Reynolds',
        duration: '1h 35m',
        level: 'Intermediate',
        description: 'Create and deliver compelling technical presentations to diverse audiences.',
        skills: ['Presentations', 'Public Speaking', 'Communication']
      },
      {
        id: 'comm-005',
        title: 'Collaborative Leadership',
        instructor: 'Josh Bersin',
        duration: '1h 10m',
        level: 'Intermediate',
        description: 'Lead cross-functional teams through collaboration and influence.',
        skills: ['Collaboration', 'Leadership', 'Team Management']
      },
      {
        id: 'comm-006',
        title: 'Conflict Resolution Foundations',
        instructor: 'Lisa Gates',
        duration: '1h 25m',
        level: 'Beginner',
        description: 'Navigate and resolve workplace conflicts professionally and effectively.',
        skills: ['Conflict Resolution', 'Communication', 'Problem Solving']
      }
    ]
  },
  {
    id: 'data-science',
    name: 'Data Science & Analytics',
    description: 'Master data analysis, machine learning, and statistical methods',
    courses: [
      {
        id: 'ds-001',
        title: 'Machine Learning Foundations',
        instructor: 'Frederick Nwanganga',
        duration: '2h 30m',
        level: 'Intermediate',
        description: 'Introduction to machine learning algorithms and practical applications.',
        skills: ['Machine Learning', 'Data Science', 'Python']
      },
      {
        id: 'ds-002',
        title: 'Python for Data Science Essential Training',
        instructor: 'Lillian Pierson',
        duration: '3h 45m',
        level: 'Intermediate',
        description: 'Use Python, pandas, and scikit-learn for data analysis and machine learning.',
        skills: ['Python', 'Data Analysis', 'Pandas']
      },
      {
        id: 'ds-003',
        title: 'Deep Learning: Getting Started',
        instructor: 'Jonathan Fernandes',
        duration: '2h 10m',
        level: 'Advanced',
        description: 'Build neural networks using TensorFlow and PyTorch.',
        skills: ['Deep Learning', 'Neural Networks', 'TensorFlow']
      },
      {
        id: 'ds-004',
        title: 'Statistics Foundations',
        instructor: 'Eddie Davila',
        duration: '2h 15m',
        level: 'Beginner',
        description: 'Master statistical concepts essential for data science.',
        skills: ['Statistics', 'Data Analysis', 'Mathematics']
      },
      {
        id: 'ds-005',
        title: 'SQL for Data Analysis',
        instructor: 'Emma Saunders',
        duration: '2h 5m',
        level: 'Intermediate',
        description: 'Write complex SQL queries for data analysis and reporting.',
        skills: ['SQL', 'Data Analysis', 'Database']
      },
      {
        id: 'ds-006',
        title: 'Data Visualization: Best Practices',
        instructor: 'Bill Shander',
        duration: '1h 40m',
        level: 'Intermediate',
        description: 'Create compelling data visualizations that tell stories with data.',
        skills: ['Data Visualization', 'Communication', 'Analytics']
      }
    ]
  },
  {
    id: 'product-management',
    name: 'Product Management',
    description: 'Product strategy, user research, and product development lifecycle',
    courses: [
      {
        id: 'pm-001',
        title: 'Product Management Foundations',
        instructor: 'Cole Mercer and Evan Kimbrell',
        duration: '2h 20m',
        level: 'Beginner',
        description: 'Learn the fundamentals of product management from ideation to launch.',
        skills: ['Product Management', 'Strategy', 'Product Development']
      },
      {
        id: 'pm-002',
        title: 'Agile Product Owner Role',
        instructor: 'Kelley O\'Connell',
        duration: '1h 30m',
        level: 'Intermediate',
        description: 'Excel as a product owner in agile environments.',
        skills: ['Agile', 'Product Management', 'Scrum']
      },
      {
        id: 'pm-003',
        title: 'User Experience Insights',
        instructor: 'Chris Nodder',
        duration: '1h 45m',
        level: 'Intermediate',
        description: 'Conduct user research and apply insights to product decisions.',
        skills: ['UX Research', 'Product Strategy', 'User-Centered Design']
      },
      {
        id: 'pm-004',
        title: 'Data-Driven Product Management',
        instructor: 'Noah Gift',
        duration: '1h 55m',
        level: 'Advanced',
        description: 'Use data analytics to drive product decisions and measure success.',
        skills: ['Product Analytics', 'Data Analysis', 'Product Strategy']
      },
      {
        id: 'pm-005',
        title: 'Product Roadmapping',
        instructor: 'Cole Mercer',
        duration: '1h 15m',
        level: 'Intermediate',
        description: 'Create effective product roadmaps that align teams and stakeholders.',
        skills: ['Product Roadmap', 'Strategy', 'Stakeholder Management']
      }
    ]
  },
  {
    id: 'devops',
    name: 'DevOps & Site Reliability',
    description: 'CI/CD, infrastructure as code, monitoring, and reliability engineering',
    courses: [
      {
        id: 'do-001',
        title: 'DevOps Foundations',
        instructor: 'Ernest Mueller and James Wickett',
        duration: '2h 15m',
        level: 'Beginner',
        description: 'Learn DevOps culture, practices, and tools for modern software delivery.',
        skills: ['DevOps', 'CI/CD', 'Automation']
      },
      {
        id: 'do-002',
        title: 'Docker Essential Training',
        instructor: 'Carlos Nunez',
        duration: '3h 10m',
        level: 'Intermediate',
        description: 'Master Docker containerization for application development and deployment.',
        skills: ['Docker', 'Containers', 'DevOps']
      },
      {
        id: 'do-003',
        title: 'Terraform Essential Training',
        instructor: 'Josh Samuelson',
        duration: '2h 25m',
        level: 'Intermediate',
        description: 'Implement infrastructure as code with Terraform.',
        skills: ['Terraform', 'Infrastructure as Code', 'Cloud']
      },
      {
        id: 'do-004',
        title: 'Site Reliability Engineering Foundations',
        instructor: 'Liz Fong-Jones',
        duration: '1h 50m',
        level: 'Advanced',
        description: 'Learn SRE principles for building reliable, scalable systems.',
        skills: ['SRE', 'Reliability', 'Operations']
      },
      {
        id: 'do-005',
        title: 'Monitoring and Observability',
        instructor: 'Kelsey Hightower',
        duration: '2h 5m',
        level: 'Intermediate',
        description: 'Implement monitoring, logging, and observability for distributed systems.',
        skills: ['Monitoring', 'Observability', 'Operations']
      },
      {
        id: 'do-006',
        title: 'CI/CD with Jenkins',
        instructor: 'Michael Jenkins',
        duration: '2h 30m',
        level: 'Intermediate',
        description: 'Build automated CI/CD pipelines with Jenkins.',
        skills: ['Jenkins', 'CI/CD', 'Automation']
      }
    ]
  },
  {
    id: 'security',
    name: 'Security & Compliance',
    description: 'Application security, secure coding, and security best practices',
    courses: [
      {
        id: 'sec-001',
        title: 'Cybersecurity Foundations',
        instructor: 'Malcolm Shore',
        duration: '1h 35m',
        level: 'Beginner',
        description: 'Understand fundamental cybersecurity concepts and threats.',
        skills: ['Security', 'Cybersecurity', 'Risk Management']
      },
      {
        id: 'sec-002',
        title: 'Secure Coding in Node.js',
        instructor: 'Emmanuel Henri',
        duration: '1h 45m',
        level: 'Intermediate',
        description: 'Write secure Node.js applications and prevent common vulnerabilities.',
        skills: ['Secure Coding', 'Node.js', 'Security']
      },
      {
        id: 'sec-003',
        title: 'OWASP Top 10',
        instructor: 'Jerod Brennen',
        duration: '2h 10m',
        level: 'Intermediate',
        description: 'Understand and mitigate the OWASP Top 10 security vulnerabilities.',
        skills: ['OWASP', 'Web Security', 'Vulnerability Assessment']
      },
      {
        id: 'sec-004',
        title: 'Cloud Security Fundamentals',
        instructor: 'Carlos Nunez',
        duration: '1h 55m',
        level: 'Intermediate',
        description: 'Secure cloud applications and infrastructure on AWS, Azure, and GCP.',
        skills: ['Cloud Security', 'AWS', 'Security']
      },
      {
        id: 'sec-005',
        title: 'Ethical Hacking: Introduction',
        instructor: 'Lisa Bock',
        duration: '2h 20m',
        level: 'Intermediate',
        description: 'Learn ethical hacking techniques to identify and fix security vulnerabilities.',
        skills: ['Ethical Hacking', 'Penetration Testing', 'Security']
      }
    ]
  },
  {
    id: 'agile-methodologies',
    name: 'Agile & Scrum',
    description: 'Agile practices, scrum framework, and iterative development',
    courses: [
      {
        id: 'ag-001',
        title: 'Agile Foundations',
        instructor: 'Doug Rose',
        duration: '1h 20m',
        level: 'Beginner',
        description: 'Learn agile principles and practices for software development.',
        skills: ['Agile', 'Scrum', 'Software Development']
      },
      {
        id: 'ag-002',
        title: 'Scrum Master Fundamentals',
        instructor: 'Kelley O\'Connell',
        duration: '1h 40m',
        level: 'Intermediate',
        description: 'Become an effective scrum master and facilitate agile teams.',
        skills: ['Scrum', 'Agile', 'Team Facilitation']
      },
      {
        id: 'ag-003',
        title: 'Kanban Essentials',
        instructor: 'Neelam Dwivedi',
        duration: '1h 10m',
        level: 'Beginner',
        description: 'Implement Kanban for continuous delivery and workflow optimization.',
        skills: ['Kanban', 'Agile', 'Process Improvement']
      },
      {
        id: 'ag-004',
        title: 'SAFe Foundations',
        instructor: 'Doug Rose',
        duration: '1h 35m',
        level: 'Advanced',
        description: 'Scale agile practices across large enterprises with SAFe framework.',
        skills: ['SAFe', 'Agile at Scale', 'Enterprise Agility']
      },
      {
        id: 'ag-005',
        title: 'User Stories for Agile Teams',
        instructor: 'Kelley O\'Connell',
        duration: '1h 15m',
        level: 'Intermediate',
        description: 'Write effective user stories and acceptance criteria.',
        skills: ['User Stories', 'Agile', 'Requirements']
      }
    ]
  },
  {
    id: 'business-strategy',
    name: 'Business Strategy & Innovation',
    description: 'Strategic thinking, business analysis, and innovation frameworks',
    courses: [
      {
        id: 'bs-001',
        title: 'Strategic Thinking',
        instructor: 'Dorie Clark',
        duration: '1h 25m',
        level: 'Intermediate',
        description: 'Develop strategic thinking skills for business decision-making.',
        skills: ['Strategic Thinking', 'Business Strategy', 'Decision Making']
      },
      {
        id: 'bs-002',
        title: 'Business Analysis Foundations',
        instructor: 'Haydn Thomas',
        duration: '2h 5m',
        level: 'Beginner',
        description: 'Learn business analysis techniques to drive better outcomes.',
        skills: ['Business Analysis', 'Requirements', 'Process Improvement']
      },
      {
        id: 'bs-003',
        title: 'Innovation Foundations',
        instructor: 'Dave Birss',
        duration: '1h 30m',
        level: 'Intermediate',
        description: 'Foster innovation and creative thinking in your organization.',
        skills: ['Innovation', 'Creativity', 'Problem Solving']
      },
      {
        id: 'bs-004',
        title: 'Design Thinking: Customer Experience',
        instructor: 'Chris Nodder',
        duration: '1h 45m',
        level: 'Intermediate',
        description: 'Apply design thinking to improve customer experience.',
        skills: ['Design Thinking', 'Customer Experience', 'Innovation']
      },
      {
        id: 'bs-005',
        title: 'Digital Transformation',
        instructor: 'Tim Clark',
        duration: '1h 55m',
        level: 'Advanced',
        description: 'Lead digital transformation initiatives in your organization.',
        skills: ['Digital Transformation', 'Change Management', 'Strategy']
      }
    ]
  },
  {
    id: 'mentoring-coaching',
    name: 'Mentoring & Coaching',
    description: 'Develop skills to mentor, coach, and develop team members',
    courses: [
      {
        id: 'mc-001',
        title: 'Mentoring Others',
        instructor: 'Lisa Earle McLeod',
        duration: '1h 10m',
        level: 'Beginner',
        description: 'Learn effective mentoring techniques to develop others.',
        skills: ['Mentoring', 'Coaching', 'Leadership']
      },
      {
        id: 'mc-002',
        title: 'Coaching Skills for Leaders',
        instructor: 'Sara Canaday',
        duration: '1h 30m',
        level: 'Intermediate',
        description: 'Use coaching techniques to unlock team potential.',
        skills: ['Coaching', 'Leadership', 'Employee Development']
      },
      {
        id: 'mc-003',
        title: 'Developing Employees',
        instructor: 'Mike Figliuolo',
        duration: '1h 20m',
        level: 'Intermediate',
        description: 'Create development plans and grow your team members.',
        skills: ['Employee Development', 'Career Development', 'Leadership']
      },
      {
        id: 'mc-004',
        title: 'One-on-One Meetings',
        instructor: 'Sara Canaday',
        duration: '55m',
        level: 'Beginner',
        description: 'Conduct effective one-on-one meetings with direct reports.',
        skills: ['1-on-1 Meetings', 'Management', 'Communication']
      },
      {
        id: 'mc-005',
        title: 'Performance Management',
        instructor: 'Catherine Mattice Zundel',
        duration: '1h 35m',
        level: 'Intermediate',
        description: 'Manage performance, set expectations, and provide accountability.',
        skills: ['Performance Management', 'Goal Setting', 'Feedback']
      }
    ]
  }
];

/**
 * Get courses by focus area
 */
export function getCoursesByFocusArea(focusAreaId: string): LinkedInCourse[] {
  const focusArea = linkedInLearningLibrary.find(fa => fa.id === focusAreaId);
  return focusArea?.courses || [];
}

/**
 * Get courses by skill
 */
export function getCoursesBySkill(skill: string): LinkedInCourse[] {
  const allCourses: LinkedInCourse[] = [];
  linkedInLearningLibrary.forEach(focusArea => {
    const matchingCourses = focusArea.courses.filter(course =>
      course.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    );
    allCourses.push(...matchingCourses);
  });
  return allCourses;
}

/**
 * Get courses by development action type
 */
export function getCoursesByActionType(actionType: string): LinkedInCourse[] {
  const actionTypeMapping: { [key: string]: string[] } = {
    'training': ['technical-leadership', 'software-engineering', 'system-design', 'data-science', 'product-management'],
    'mentoring': ['mentoring-coaching', 'communication', 'technical-leadership'],
    'project': ['agile-methodologies', 'product-management', 'business-strategy'],
    'stretch_assignment': ['technical-leadership', 'communication', 'business-strategy'],
    'shadowing': ['technical-leadership', 'mentoring-coaching', 'product-management'],
    'reading': ['software-engineering', 'system-design', 'business-strategy']
  };

  const focusAreas = actionTypeMapping[actionType] || [];
  const allCourses: LinkedInCourse[] = [];
  
  focusAreas.forEach(areaId => {
    const courses = getCoursesByFocusArea(areaId);
    allCourses.push(...courses);
  });

  return allCourses;
}

/**
 * Get recommended courses for a target role
 */
export function getCoursesByTargetRole(targetRole: string): FocusArea[] {
  const roleMapping: { [key: string]: string[] } = {
    'tech lead': ['technical-leadership', 'system-design', 'communication', 'mentoring-coaching'],
    'engineering manager': ['technical-leadership', 'mentoring-coaching', 'communication', 'agile-methodologies'],
    'senior engineer': ['system-design', 'software-engineering', 'devops', 'security'],
    'staff engineer': ['system-design', 'software-engineering', 'technical-leadership', 'communication'],
    'principal engineer': ['system-design', 'technical-leadership', 'business-strategy', 'communication'],
    'product manager': ['product-management', 'business-strategy', 'communication', 'data-science'],
    'senior product manager': ['product-management', 'business-strategy', 'technical-leadership', 'data-science'],
    'data scientist': ['data-science', 'software-engineering', 'communication', 'business-strategy'],
    'devops engineer': ['devops', 'security', 'system-design', 'software-engineering'],
    'security engineer': ['security', 'devops', 'software-engineering', 'system-design']
  };

  const normalizedRole = targetRole.toLowerCase();
  const focusAreaIds = roleMapping[normalizedRole] || ['software-engineering', 'communication'];
  
  return linkedInLearningLibrary.filter(fa => focusAreaIds.includes(fa.id));
}

/**
 * Search courses by keyword
 */
export function searchCourses(keyword: string): LinkedInCourse[] {
  const normalizedKeyword = keyword.toLowerCase();
  const allCourses: LinkedInCourse[] = [];
  
  linkedInLearningLibrary.forEach(focusArea => {
    const matchingCourses = focusArea.courses.filter(course =>
      course.title.toLowerCase().includes(normalizedKeyword) ||
      course.description.toLowerCase().includes(normalizedKeyword) ||
      course.skills.some(s => s.toLowerCase().includes(normalizedKeyword))
    );
    allCourses.push(...matchingCourses);
  });

  return allCourses;
}

/**
 * Get all focus areas
 */
export function getAllFocusAreas(): FocusArea[] {
  return linkedInLearningLibrary;
}

/**
 * Get focus area by ID
 */
export function getFocusAreaById(id: string): FocusArea | undefined {
  return linkedInLearningLibrary.find(fa => fa.id === id);
}
