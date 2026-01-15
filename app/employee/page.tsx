'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Target, MessageSquare, Award, Calendar, BarChart3, Sparkles, AlertCircle } from 'lucide-react';

interface Goal {
  id: number;
  title: string;
  progress_percentage: number;
  status: string;
  due_date: string;
  priority: string;
  keyResults?: any[];
}

interface Feedback {
  id: number;
  feedback_type: string;
  category: string;
  content: string;
  from_user_name: string;
  created_at: string;
  acknowledged: boolean;
}

interface PerformanceReview {
  id: number;
  cycle_name: string;
  overall_rating: number;
  status: string;
  manager_name: string;
}

interface Insight {
  type: 'strength' | 'risk' | 'opportunity' | 'trend';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  recommendations?: string[];
}

export default function EmployeeDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchUserData();
    fetchGoals();
    fetchFeedback();
    fetchReviews();
    fetchInsights();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);

        // Allow employees and candidates to access this dashboard
        // Redirect other roles to their respective dashboards
        if (data.user.role !== 'employee' && data.user.role !== 'candidate') {
          if (data.user.role === 'manager') {
            router.push('/manager');
          } else if (data.user.role === 'hr' || data.user.role === 'recruiter') {
            router.push('/recruiter');
          }
        }
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchGoals = async () => {
    try {
      const res = await fetch('/api/performance/goals');
      if (res.ok) {
        const data = await res.json();
        setGoals(data.goals || []);
      } else {
        setError('Failed to load goals. Please try refreshing the page.');
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      setError('Failed to load goals. Please check your connection.');
    }
  };

  const fetchFeedback = async () => {
    try {
      const res = await fetch('/api/performance/feedback');
      if (res.ok) {
        const data = await res.json();
        setFeedback(data.feedback || []);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/performance/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchInsights = async () => {
    try {
      const res = await fetch('/api/performance/insights?type=employee');
      if (res.ok) {
        const data = await res.json();
        setInsights(data.insights || []);
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      on_track: 'bg-green-100 text-green-800',
      at_risk: 'bg-yellow-100 text-yellow-800',
      off_track: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      not_started: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getInsightIcon = (type: string) => {
    const icons: any = {
      strength: <Award className="w-5 h-5 text-green-600" />,
      risk: <AlertCircle className="w-5 h-5 text-red-600" />,
      opportunity: <Sparkles className="w-5 h-5 text-blue-600" />,
      trend: <TrendingUp className="w-5 h-5 text-purple-600" />,
    };
    return icons[type] || <Sparkles className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const myGoals = goals.filter(g => g.status !== 'completed');
  const completedGoals = goals.filter(g => g.status === 'completed');
  const recentFeedback = feedback.slice(0, 5);
  const latestReview = reviews[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                PerformPro
              </h1>
              <span className="ml-4 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                Employee
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'goals', label: 'Goals & OKRs', icon: Target },
              { id: 'feedback', label: 'Feedback', icon: MessageSquare },
              { id: 'development', label: 'Development', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm transition ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900">Error</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-400 hover:text-red-600 transition"
              aria-label="Dismiss error"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* AI Insights Banner */}
        {insights.length > 0 && (
          <div className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-start gap-4">
              <Sparkles className="w-8 h-8 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">AI-Powered Insights</h3>
                <div className="space-y-3">
                  {insights.slice(0, 2).map((insight, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-white/20 rounded-lg p-2">
                          {getInsightIcon(insight.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{insight.title}</h4>
                          <p className="text-sm text-white/90">{insight.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Goals</p>
                    <p className="text-3xl font-bold text-gray-900">{myGoals.length}</p>
                  </div>
                  <Target className="w-10 h-10 text-indigo-600 opacity-20" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
                    </p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-green-600 opacity-20" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Recent Feedback</p>
                    <p className="text-3xl font-bold text-gray-900">{feedback.length}</p>
                  </div>
                  <MessageSquare className="w-10 h-10 text-blue-600 opacity-20" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Performance Rating</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {latestReview?.overall_rating ? latestReview.overall_rating.toFixed(1) : 'N/A'}
                    </p>
                  </div>
                  <Award className="w-10 h-10 text-purple-600 opacity-20" />
                </div>
              </div>
            </div>

            {/* Goals Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                Current Goals
              </h2>
              <div className="space-y-4">
                {myGoals.slice(0, 3).map((goal) => (
                  <div key={goal.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                        <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                          {goal.status.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-indigo-600">{goal.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${goal.progress_percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
                {myGoals.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No active goals. Create your first goal to get started!</p>
                )}
              </div>
            </div>

            {/* Recent Feedback */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Recent Feedback
              </h2>
              <div className="space-y-3">
                {recentFeedback.map((fb) => (
                  <div key={fb.id} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="font-semibold text-gray-900">{fb.from_user_name}</span>
                        <span className="text-gray-500 text-sm ml-2">{new Date(fb.created_at).toLocaleDateString()}</span>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {fb.feedback_type}
                      </span>
                    </div>
                    <p className="text-gray-700">{fb.content}</p>
                  </div>
                ))}
                {recentFeedback.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No feedback yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Goals & OKRs</h2>
              <button
                onClick={() => alert('Create Goal feature coming soon! This will open a modal to create new goals and OKRs.')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                + Create Goal
              </button>
            </div>

            <div className="grid gap-6">
              {goals.map((goal) => (
                <div key={goal.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{goal.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                          {goal.status.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-gray-500">Due: {new Date(goal.due_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-indigo-600">{goal.progress_percentage}%</div>
                      <div className="text-sm text-gray-500">Complete</div>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all"
                      style={{ width: `${goal.progress_percentage}%` }}
                    />
                  </div>

                  {goal.keyResults && goal.keyResults.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="font-semibold text-gray-700 text-sm">Key Results:</h4>
                      {goal.keyResults.map((kr: any) => (
                        <div key={kr.id} className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg">
                          <span className="text-gray-700">{kr.title}</span>
                          <span className="font-semibold text-indigo-600">
                            {kr.current_value} / {kr.target_value} {kr.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Feedback</h2>
              <button
                onClick={() => alert('Request Feedback feature coming soon! This will allow you to request feedback from colleagues and managers.')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Request Feedback
              </button>
            </div>

            <div className="space-y-4">
              {feedback.map((fb) => (
                <div key={fb.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{fb.from_user_name}</h3>
                      <p className="text-sm text-gray-500">{new Date(fb.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {fb.feedback_type}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{fb.content}</p>
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    {fb.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'development' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Development & Growth</h2>

            {latestReview && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Latest Performance Review</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Overall Rating</p>
                    <p className="text-2xl font-bold text-indigo-600">{latestReview.overall_rating}/5.0</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Review Cycle</p>
                    <p className="text-lg font-semibold text-gray-900">{latestReview.cycle_name}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 text-center">
              <TrendingUp className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Continue Growing</h3>
              <p className="text-gray-600 mb-4">
                Explore learning opportunities, set development goals, and track your career progression
              </p>
              <button
                onClick={() => alert('Development Plan feature coming soon! This will show your personalized career development roadmap and learning paths.')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                View Development Plan
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
