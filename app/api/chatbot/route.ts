import { NextRequest, NextResponse } from 'next/server';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  userRole: string;
  currentPage: string;
  conversationHistory: ConversationMessage[];
}

// In-memory conversation storage for knowledge enhancement (temporary)
// In production, this should be stored in a database
interface ConversationEntry {
  timestamp: number;
  userRole: string;
  conversation: ConversationMessage[];
}

const conversationStorage: ConversationEntry[] = [];

// Helper function to anonymize employee names in responses
function anonymizeNames(text: string): string {
  // List of common name patterns to replace
  // This is a simple implementation - in production, you'd want to check against actual employee database
  const namePatterns = [
    /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, // First Last name pattern
  ];
  
  // Terms that should never be anonymized (system terms, HR roles)
  const preservedTerms = ['HR Business', 'Talent Development', 'AI Insights', 'Team Health', 
                          'Key Results', 'New York', 'Data Science', 'San Francisco'];
  
  let anonymized = text;
  namePatterns.forEach(pattern => {
    anonymized = anonymized.replace(pattern, (match) => {
      // Check if this match is part of a preserved term
      for (const term of preservedTerms) {
        if (term.includes(match)) {
          return match;
        }
      }
      // Also check if the match IS a preserved term or starts one
      if (preservedTerms.some(term => term.startsWith(match))) {
        return match;
      }
      return '[Employee]';
    });
  });
  
  return anonymized;
}

// Helper function to store conversation for knowledge enhancement
function storeConversation(userRole: string, message: string, response: string) {
  const timestamp = Date.now();
  
  const entry: ConversationEntry = {
    timestamp,
    userRole,
    conversation: [
      { role: 'user', content: message },
      { role: 'assistant', content: response }
    ]
  };
  
  conversationStorage.push(entry);
  
  // Keep only last 100 conversations to prevent memory overflow
  // Remove oldest entries based on timestamp
  if (conversationStorage.length > 100) {
    conversationStorage.sort((a, b) => a.timestamp - b.timestamp);
    conversationStorage.shift(); // Remove oldest
  }
}

// Expanded knowledge base about the PerformPro system
const SYSTEM_KNOWLEDGE = {
  features: {
    goals: {
      description: 'Create, track, and manage your professional goals and OKRs',
      actions: ['Create a new goal', 'View goal progress', 'Update key results', 'Set goal priorities'],
      location: '/employee (for employees), /manager (for managers)',
    },
    feedback: {
      description: 'Give and receive continuous feedback from peers and managers',
      actions: ['Request feedback', 'Give feedback', 'Acknowledge feedback', 'View feedback history'],
      location: 'Employee dashboard or feedback section',
    },
    reviews: {
      description: 'Performance reviews including self-assessments and manager evaluations',
      actions: ['Complete self-review', 'View review status', 'See historical reviews', 'Check competency ratings'],
      location: 'Performance reviews section',
    },
    insights: {
      description: 'AI-powered analytics including flight risk predictions and team health scores',
      actions: ['View AI insights', 'Check flight risk status', 'See talent analytics', 'Review 9-box matrix'],
      location: 'AI Insights tab on dashboard',
    },
    development: {
      description: 'Career development plans and learning opportunities',
      actions: ['Create development plan', 'Track learning progress', 'View career path'],
      location: '/employee/development',
    },
  },
  
  navigation: {
    employee: [
      { page: 'Dashboard', path: '/employee', description: 'View your performance overview, goals, and feedback' },
      { page: 'Development', path: '/employee/development', description: 'Access career development plans' },
    ],
    manager: [
      { page: 'Dashboard', path: '/manager', description: 'View team analytics and health scores' },
      { page: 'Team View', path: '/manager/team', description: 'See individual team member performance' },
    ],
    hr: [
      { page: 'Analytics', path: '/recruiter', description: 'Organization-wide talent analytics' },
      { page: '9-Box Matrix', path: '/recruiter', description: 'Visual talent segmentation' },
    ],
  },

  commonQuestions: {
    'create goal': {
      answer: 'To create a new goal:\n1. Go to your Employee Dashboard\n2. Click the "Create Goal" button\n3. Fill in the goal title, description, and due date\n4. Set the priority (High/Medium/Low)\n5. Add key results to track progress\n6. Click "Save Goal"',
      suggestions: ['Show me my current goals', 'How do I track goal progress?', 'What are OKRs?'],
    },
    'give feedback': {
      answer: 'To give feedback:\n1. Navigate to the Feedback section\n2. Click "Give Feedback"\n3. Select the recipient\n4. Choose feedback type (Positive, Constructive, Development)\n5. Select a category (Teamwork, Communication, Technical, etc.)\n6. Write your feedback\n7. Submit',
      suggestions: ['Request feedback from others', 'View my feedback history', 'What is the SBI model?'],
    },
    'performance review': {
      answer: 'Performance reviews are evaluations of your work:\n- Self-reviews: You assess your own performance\n- Manager reviews: Your manager evaluates you\n- 360 reviews: Feedback from peers, reports, and manager\n\nYou can view your reviews in the Performance Reviews section of your dashboard.',
      suggestions: ['When is my next review?', 'How are reviews scored?', 'View my review history'],
    },
    'ai insights': {
      answer: 'AI Insights provide data-driven analysis:\n- Flight Risk: Predicts likelihood of employee turnover\n- Team Health: Scores team performance and engagement\n- Talent Analytics: Identifies high performers and development needs\n- 9-Box Matrix: Maps performance vs. potential\n\nFind these on your dashboard under the AI Insights tab.',
      suggestions: ['What is flight risk?', 'How is team health calculated?', 'Explain the 9-box matrix'],
    },
    'navigation help': {
      answer: 'Here are the main sections:\n- Dashboard: Your performance overview\n- Goals: Create and track objectives\n- Feedback: Give and receive feedback\n- Reviews: Performance evaluations\n- Development: Career planning\n- Analytics: Data and insights',
      suggestions: ['Take me to my goals', 'Show me feedback section', 'How do I access analytics?'],
    },
    'okr': {
      answer: 'OKRs (Objectives and Key Results) are a goal-setting framework:\n\n**Objective**: A qualitative, aspirational goal\n**Key Results**: 3-5 quantitative metrics to track progress\n\n**Example:**\nObjective: "Improve customer satisfaction"\nKey Results:\n- Increase NPS score from 45 to 60\n- Reduce support ticket response time to under 2 hours\n- Achieve 90% customer retention rate\n\nOKRs help align individual work with company objectives and provide clear, measurable outcomes.',
      suggestions: ['How do I create an OKR?', 'Where is OKR training?', 'Track my goal progress'],
    },
    'okr training': {
      answer: 'OKR training resources are available in several places:\n\n1. **Development Section**: Access the Learning Hub from your Employee Dashboard\n2. **Help Center**: Click the help icon for OKR guides and videos\n3. **Onboarding Materials**: New employee training includes OKR fundamentals\n4. **Manager Support**: Your manager can provide guidance on writing effective OKRs\n\nTraining covers: OKR basics, writing SMART objectives, defining measurable key results, and quarterly planning.',
      suggestions: ['What are OKRs?', 'Create a new goal', 'How do I track goal progress?'],
    },
    'track goal': {
      answer: 'To track your goal progress:\n\n1. **Dashboard View**: Your goals widget shows overall progress\n2. **Goals Page**: Click on any goal to see detailed progress\n3. **Update Key Results**: Click "Update Progress" to enter new values\n4. **Progress Indicators**: Visual bars show completion percentage\n5. **Check-ins**: Schedule regular check-ins to review and update\n6. **Notifications**: Receive alerts for upcoming milestones and due dates\n\nBest practice: Update your goals weekly to maintain momentum and visibility.',
      suggestions: ['Create a new goal', 'What are OKRs?', 'View my current goals'],
    },
    'sbi model': {
      answer: 'The SBI Model is a framework for giving effective feedback:\n\n**S - Situation**: Describe when/where the behavior occurred\n"In yesterday\'s client meeting..."\n\n**B - Behavior**: Explain the specific observable action\n"...you interrupted the client twice while they were speaking..."\n\n**I - Impact**: Share the effect of that behavior\n"...which made them seem frustrated and we lost the opportunity to understand their needs."\n\n**Benefits:**\n- Keeps feedback objective and specific\n- Reduces defensiveness\n- Focuses on changeable behaviors\n- Creates actionable insights\n\nUse SBI for both positive and constructive feedback.',
      suggestions: ['Give feedback', 'Request feedback', 'View feedback history'],
    },
    'flight risk': {
      answer: 'Flight Risk Prediction uses AI to assess employee turnover likelihood:\n\n**How it works:**\nThe system analyzes multiple factors:\n- Engagement scores and feedback sentiment\n- Goal completion rates and performance trends\n- Tenure and promotion history\n- Feedback frequency and quality\n- Participation in development activities\n- Comparison with historical turnover patterns\n\n**Risk Levels:**\n- 🟢 Low (0-30%): Engaged and stable\n- 🟡 Medium (31-60%): Monitor and engage\n- 🔴 High (61-100%): Immediate attention needed\n\n**For Managers:** Use this insight to proactively engage with at-risk team members, address concerns, and improve retention.',
      suggestions: ['What is team health?', 'Explain the 9-box matrix', 'View AI insights'],
    },
    'team health': {
      answer: 'Team Health Score measures overall team performance and wellbeing:\n\n**Calculation factors:**\n1. **Goal Achievement** (30%): Team goal completion rates\n2. **Engagement** (25%): Feedback activity and sentiment\n3. **Collaboration** (20%): Peer feedback and cross-functional work\n4. **Development** (15%): Learning participation and skill growth\n5. **Retention** (10%): Turnover rate and flight risk levels\n\n**Score ranges:**\n- 80-100: Excellent - High performing, engaged team\n- 60-79: Good - Healthy with room for improvement\n- 40-59: Fair - Needs attention and support\n- 0-39: Critical - Immediate intervention required\n\nManagers can drill down into each component to identify specific improvement areas.',
      suggestions: ['What is flight risk?', 'View my team analytics', 'Explain the 9-box matrix'],
    },
    '9-box matrix': {
      answer: 'The 9-Box Matrix is a talent assessment tool mapping Performance vs. Potential:\n\n**Grid Layout:**\n```\nHigh Potential    | Inconsistent | Rising Star  | Top Talent\nMedium Potential  | Average      | Core Player  | High Performer  \nLow Potential     | Low          | Solid Player | Trusted Pro\n                   Low Perf.     Medium Perf.   High Perf.\n```\n\n**Categories:**\n- **Top Talent**: High performance + high potential → Succession candidates\n- **Rising Star**: Medium performance + high potential → Invest in development\n- **High Performer**: High performance + medium potential → Reward and retain\n- **Core Player**: Solid contributors → Development opportunities\n- **Trusted Pro**: High performance + low potential → Leverage expertise\n\n**Uses:** Succession planning, development prioritization, and talent strategy.',
      suggestions: ['What is flight risk?', 'What is team health?', 'View AI insights'],
    },
    'hr contact': {
      answer: 'To contact HR:\n\n**General Inquiries:**\n- Email: hr@company.com\n- Phone: Available through company directory\n- Support Portal: Access through Help menu\n\n**Common HR Services:**\n- Benefits and compensation questions\n- Performance management support\n- Policy clarification\n- Career development guidance\n- Employee relations concerns\n\n**For Platform Issues:**\n- Use the Help button in the navigation bar\n- Submit a support ticket through the platform\n- Check the FAQ section for common questions\n\nYour HR Business Partner information is available in your employee profile.',
      suggestions: ['How do I access my profile?', 'Where is the help section?', 'Contact support'],
    },
    'skills': {
      answer: 'The Skills System helps track and develop your competencies:\n\n**Features:**\n- **Skill Profile**: Your current skills and proficiency levels\n- **Skill Gaps**: Identified areas for development\n- **Endorsements**: Peers and managers can endorse your skills\n- **Skill Trends**: Track how your skills evolve over time\n- **Recommendations**: Suggested skills based on your role\n\n**How to use:**\n1. View your skills in your Employee Profile\n2. Add new skills you\'ve acquired\n3. Request endorsements from colleagues\n4. Link skills to your development plan\n5. Find training to develop specific skills\n\nSkills are used for career pathing, project assignments, and identifying development opportunities.',
      suggestions: ['How do I create a development plan?', 'Where is training?', 'Request skill endorsements'],
    },
    'training': {
      answer: 'Training resources are available in multiple locations:\n\n**1. Learning Hub** (Development section)\n- Online courses and certifications\n- Internal training programs\n- External learning platforms\n- Skill-specific resources\n\n**2. Resource Types:**\n- Video tutorials and webinars\n- Interactive courses\n- Documentation and guides\n- Mentorship programs\n- Workshops and seminars\n\n**3. Finding Relevant Training:**\n- Browse by skill or competency\n- View recommendations based on your role\n- Search by topic or certification\n- Filter by duration and format\n\n**4. Tracking Progress:**\n- Completed courses appear in your profile\n- Link training to development plan goals\n- Earn badges and certifications\n\nAccess training from your Employee Dashboard > Development > Learning Hub.',
      suggestions: ['Create a development plan', 'View my skills', 'What are OKRs?'],
    },
    'development plan': {
      answer: 'To create a Development Plan:\n\n**Steps:**\n1. Go to Employee Dashboard > Development\n2. Click "Create Development Plan"\n3. Define your career goals (6-12 month horizon)\n4. Identify skills to develop\n5. Select learning activities and resources\n6. Set milestones and target dates\n7. Share with your manager for feedback\n8. Track progress regularly\n\n**Components:**\n- **Career Goals**: Where you want to grow\n- **Skill Development**: Specific competencies to build\n- **Learning Activities**: Courses, projects, mentoring\n- **Timeline**: Milestones and deadlines\n- **Success Metrics**: How you\'ll measure progress\n\n**Best Practices:**\n- Align with your performance goals\n- Include both technical and soft skills\n- Review quarterly with your manager\n- Update as you complete activities\n\nYour development plan integrates with the skills system and training resources.',
      suggestions: ['Where is training?', 'View my skills', 'What are OKRs?'],
    },
  },
};

function findBestMatch(query: string): string | null {
  const lowercaseQuery = query.toLowerCase();
  
  // Check for specific topic matches first (more specific queries)
  if (lowercaseQuery.includes('sbi') || (lowercaseQuery.includes('feedback') && (lowercaseQuery.includes('model') || lowercaseQuery.includes('framework')))) {
    return 'sbi model';
  }
  if (lowercaseQuery.includes('flight risk') || lowercaseQuery.includes('turnover') || lowercaseQuery.includes('retention prediction')) {
    return 'flight risk';
  }
  if (lowercaseQuery.includes('team health') || (lowercaseQuery.includes('team') && lowercaseQuery.includes('score'))) {
    return 'team health';
  }
  if (lowercaseQuery.includes('9-box') || lowercaseQuery.includes('nine box') || lowercaseQuery.includes('9 box') || lowercaseQuery.includes('talent matrix')) {
    return '9-box matrix';
  }
  if (lowercaseQuery.includes('okr training') || (lowercaseQuery.includes('okr') && lowercaseQuery.includes('training'))) {
    return 'okr training';
  }
  if (lowercaseQuery.includes('track') && lowercaseQuery.includes('goal')) {
    return 'track goal';
  }
  if (lowercaseQuery.includes('track') && lowercaseQuery.includes('progress')) {
    return 'track goal';
  }
  if ((lowercaseQuery.includes('hr') && lowercaseQuery.includes('contact')) || lowercaseQuery.includes('contact hr') || lowercaseQuery.includes('reach hr')) {
    return 'hr contact';
  }
  if (lowercaseQuery.includes('development plan') || lowercaseQuery.includes('dev plan') || lowercaseQuery.includes('career plan')) {
    return 'development plan';
  }
  
  // Check for exact keyword matches
  const keywords = Object.keys(SYSTEM_KNOWLEDGE.commonQuestions);
  for (const keyword of keywords) {
    if (lowercaseQuery.includes(keyword.toLowerCase())) {
      return keyword;
    }
  }
  
  // Check for feature-related queries (more general)
  if (lowercaseQuery.includes('goal') || lowercaseQuery.includes('objective')) {
    return 'create goal';
  }
  if (lowercaseQuery.includes('okr')) {
    return 'okr';
  }
  if (lowercaseQuery.includes('feedback') || lowercaseQuery.includes('comment')) {
    return 'give feedback';
  }
  if (lowercaseQuery.includes('review') || lowercaseQuery.includes('evaluation') || lowercaseQuery.includes('assessment')) {
    return 'performance review';
  }
  if (lowercaseQuery.includes('skill') || lowercaseQuery.includes('competency') || lowercaseQuery.includes('competence') || lowercaseQuery.includes('competencies')) {
    return 'skills';
  }
  if (lowercaseQuery.includes('training') || lowercaseQuery.includes('learning') || lowercaseQuery.includes('course')) {
    return 'training';
  }
  if (lowercaseQuery.includes('ai') || lowercaseQuery.includes('insight') || lowercaseQuery.includes('analytics')) {
    return 'ai insights';
  }
  if (lowercaseQuery.includes('navigate') || lowercaseQuery.includes('where') || lowercaseQuery.includes('find') || lowercaseQuery.includes('how to get')) {
    return 'navigation help';
  }
  
  return null;
}

function generateResponse(query: string, userRole: string): { response: string; suggestions: string[] } {
  const match = findBestMatch(query);
  
  if (match && match in SYSTEM_KNOWLEDGE.commonQuestions) {
    const qa = SYSTEM_KNOWLEDGE.commonQuestions[match as keyof typeof SYSTEM_KNOWLEDGE.commonQuestions];
    return {
      response: qa.answer,
      suggestions: qa.suggestions || [],
    };
  }
  
  // Handle role-specific navigation
  const lowercaseQuery = query.toLowerCase();
  if (lowercaseQuery.includes('dashboard') || lowercaseQuery.includes('home')) {
    const nav = SYSTEM_KNOWLEDGE.navigation[userRole as keyof typeof SYSTEM_KNOWLEDGE.navigation] || SYSTEM_KNOWLEDGE.navigation.employee;
    const dashboardInfo = nav.find(n => n.page === 'Dashboard');
    return {
      response: `Your ${userRole} dashboard is located at ${dashboardInfo?.path}. ${dashboardInfo?.description}`,
      suggestions: ['Show me my goals', 'View my team analytics', 'What can I do here?'],
    };
  }
  
  // Handle general help
  if (lowercaseQuery.includes('help') || lowercaseQuery.includes('what can you do')) {
    return {
      response: `I can help you with:
• Creating and managing goals and OKRs
• Giving and requesting feedback
• Understanding performance reviews
• Navigating to different sections
• Explaining AI insights and analytics
• Career development planning

Just ask me anything about the platform!`,
      suggestions: ['How do I create a goal?', 'Where can I give feedback?', 'Explain AI insights', 'Show me navigation options'],
    };
  }
  
  // Handle development/career queries
  if (lowercaseQuery.includes('development') || lowercaseQuery.includes('career') || lowercaseQuery.includes('learning')) {
    return {
      response: `Career development features include:
• Development Plans: Create personalized growth plans
• Learning Opportunities: Track courses and skills
• Career Paths: Visualize your progression

Access these in the Development section of your dashboard.`,
      suggestions: ['How do I create a development plan?', 'View my career path', 'What learning resources are available?'],
    };
  }
  
  // Handle team/manager queries
  if ((lowercaseQuery.includes('team') || lowercaseQuery.includes('manager')) && userRole === 'manager') {
    return {
      response: `As a manager, you can:
• View team health scores and analytics
• Monitor individual team member performance
• Review and approve goals
• Provide feedback and conduct reviews
• Identify flight risks and development needs

Check your Manager Dashboard for team insights.`,
      suggestions: ['View my team analytics', 'How do I review team performance?', 'What is team health score?'],
    };
  }
  
  // Default response with suggestions
  return {
    response: `I'm here to help you navigate PerformPro! I can assist with:
• Goals and OKRs
• Feedback and reviews
• AI insights and analytics
• Career development
• Navigation and features

What would you like to know more about?`,
    suggestions: ['How do I create a goal?', 'Where can I give feedback?', 'Explain performance reviews', 'Show me AI insights'],
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, userRole } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Generate contextual response
    const result = generateResponse(message, userRole);
    
    // Anonymize employee names in the response
    const anonymizedResponse = anonymizeNames(result.response);
    
    // Store conversation for knowledge enhancement
    storeConversation(userRole, message, anonymizedResponse);

    return NextResponse.json({
      response: anonymizedResponse,
      suggestions: result.suggestions,
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
