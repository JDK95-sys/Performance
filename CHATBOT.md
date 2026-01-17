# AI Chatbot Assistant

## Overview

PerformPro includes a built-in AI-powered chatbot assistant that helps users navigate the platform, understand features, and find the information they need. The chatbot is available to all users across all dashboards.

## Features

### 🤖 Intelligent Assistance
- **Context-aware responses** based on user role (Employee, Manager, HR)
- **Natural language understanding** for common queries
- **Step-by-step guidance** for platform features
- **Quick action suggestions** for related topics

### 💬 Coverage Areas
The chatbot can help with:
- **Goals & OKRs**: Creating, tracking, and managing goals
- **Feedback**: Giving and requesting feedback
- **Performance Reviews**: Understanding review processes and status
- **AI Insights**: Explaining flight risk, team health, and analytics
- **Navigation**: Finding specific pages and features
- **Career Development**: Development plans and learning paths

### 🎨 User Experience
- **Floating button** in bottom-right corner with AI badge
- **Clean, modern interface** matching PerformPro design system
- **Suggested questions** for quick access to common topics
- **Follow-up suggestions** to guide users through related content
- **Fully responsive** and accessible

## How to Use

### Opening the Chat
1. Look for the floating purple chat button in the bottom-right corner of any dashboard
2. Click the button to open the chat window
3. The chatbot will greet you with a welcome message and suggested questions

### Asking Questions
You can either:
- **Type your question** in the text box at the bottom of the chat window
- **Click on suggested questions** to quickly get answers to common topics
- **Click on follow-up suggestions** after receiving a response

### Example Questions
- "How do I create a new goal?"
- "Where can I give feedback?"
- "Explain my AI insights"
- "Show me my performance reviews"
- "How do I track goal progress?"
- "What are OKRs?"
- "How is team health calculated?"
- "What is the 9-box matrix?"

### Closing the Chat
- Click the **X button** in the top-right corner of the chat window
- The chat button will reappear in the bottom-right corner

## Technical Details

### Implementation
- **Frontend Component**: `components/ChatBot.tsx`
  - React component with TypeScript
  - Responsive design using TailwindCSS
  - Accessible with ARIA labels
  
- **Backend API**: `app/api/chatbot/route.ts`
  - Next.js API route
  - Rule-based NLP pattern matching
  - Role-based response customization
  - Comprehensive knowledge base

### Knowledge Base
The chatbot maintains a structured knowledge base covering:
- **Features**: Goals, Feedback, Reviews, Insights, Development
- **Navigation**: Role-specific page locations
- **Common Questions**: Pre-defined Q&A pairs
- **Contextual Responses**: Dynamic responses based on user role and page

### No External Dependencies
- **Self-contained**: No external LLM APIs required
- **Fast responses**: Instant pattern matching
- **Reliable**: Works offline (no API rate limits or failures)
- **Secure**: All processing happens within the application

## For Developers

### Adding New Responses

To add new chatbot responses, edit `app/api/chatbot/route.ts`:

1. **Add to Knowledge Base**: Update the `SYSTEM_KNOWLEDGE` object
   ```typescript
   commonQuestions: {
     'your topic': {
       answer: 'Your detailed answer here',
       suggestions: ['Follow-up 1', 'Follow-up 2'],
     },
   }
   ```

2. **Add Pattern Matching**: Update the `findBestMatch()` function
   ```typescript
   if (lowercaseQuery.includes('your keyword')) {
     return 'your topic';
   }
   ```

### Customizing UI

The chatbot UI can be customized in `components/ChatBot.tsx`:
- **Colors**: Modify gradient and color classes
- **Size**: Adjust width/height in the component
- **Position**: Change fixed position classes
- **Animation**: Update transition and animation classes

### Integration

The chatbot is integrated into:
- `/app/employee/page.tsx` - Employee Dashboard
- `/app/manager/page.tsx` - Manager Dashboard
- `/app/recruiter/page.tsx` - HR/Recruiter Dashboard

To add to other pages:
```tsx
import ChatBot from '@/components/ChatBot';

// In your component:
<ChatBot userRole={user?.role || 'employee'} currentPage="/your-page" />
```

## Roadmap

Future enhancements planned:
- [ ] Integration with actual LLM (Ollama, LLaMA, etc.) for advanced queries
- [ ] Chat history persistence across sessions
- [ ] Multi-language support
- [ ] Voice input/output capabilities
- [ ] Analytics on common questions
- [ ] Admin dashboard for monitoring chatbot usage

## Support

If you encounter issues with the chatbot:
1. Check the browser console for errors
2. Verify the API endpoint is accessible
3. Report issues via GitHub Issues

## License

Same as PerformPro - MIT License
