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

// Knowledge base about the PerformPro system
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
      suggestions: ['Request feedback from others', 'View my feedback history', 'What types of feedback exist?'],
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
  },
};

function findBestMatch(query: string): string | null {
  const lowercaseQuery = query.toLowerCase();
  
  // Check for keyword matches
  const keywords = Object.keys(SYSTEM_KNOWLEDGE.commonQuestions);
  for (const keyword of keywords) {
    if (lowercaseQuery.includes(keyword.toLowerCase())) {
      return keyword;
    }
  }
  
  // Check for feature-related queries
  if (lowercaseQuery.includes('goal') || lowercaseQuery.includes('objective') || lowercaseQuery.includes('okr')) {
    return 'create goal';
  }
  if (lowercaseQuery.includes('feedback') || lowercaseQuery.includes('comment')) {
    return 'give feedback';
  }
  if (lowercaseQuery.includes('review') || lowercaseQuery.includes('evaluation') || lowercaseQuery.includes('assessment')) {
    return 'performance review';
  }
  if (lowercaseQuery.includes('ai') || lowercaseQuery.includes('insight') || lowercaseQuery.includes('analytics') || lowercaseQuery.includes('risk')) {
    return 'ai insights';
  }
  if (lowercaseQuery.includes('navigate') || lowercaseQuery.includes('where') || lowercaseQuery.includes('find') || lowercaseQuery.includes('how to get')) {
    return 'navigation help';
  }
  
  return null;
}

function generateResponse(query: string, userRole: string, currentPage: string): { response: string; suggestions: string[] } {
  const match = findBestMatch(query);
  
  if (match && SYSTEM_KNOWLEDGE.commonQuestions[match]) {
    const qa = SYSTEM_KNOWLEDGE.commonQuestions[match];
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
    const { message, userRole, currentPage } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Generate contextual response
    const result = generateResponse(message, userRole, currentPage);

    return NextResponse.json({
      response: result.response,
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
