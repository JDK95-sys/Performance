'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, TrendingUp, AlertTriangle, Award, Target, MessageSquare, 
  BarChart3, Briefcase, ChevronRight, Star, Zap, Activity,
  Building2, UserCheck, CheckCircle2
} from 'lucide-react';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';
import EmployeeListModal from '@/components/modals/EmployeeListModal';

// Percentage of high performers typically ready for promotion
const PROMOTION_READY_PERCENTAGE = 0.15;

export default function HRDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'talent' | 'reviews' | 'analytics'>('overview');
  const [talentInsights, setTalentInsights] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    title: string;
    description?: string;
    employees: any[];
    color?: string;
  }>({
    title: '',
    description: '',
    employees: [],
    color: 'indigo'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await fetch('/api/auth/me');
      if (!userRes.ok) {
        router.push('/');
        return;
      }

      const userData = await userRes.json();
      setUser(userData.user);

      // Check if user is HR or recruiter
      if (userData.user.role !== 'hr' && userData.user.role !== 'recruiter') {
        if (userData.user.role === 'employee' || userData.user.role === 'candidate') {
          router.push('/employee');
        } else if (userData.user.role === 'manager') {
          router.push('/manager');
        }
        return;
      }

      // Fetch HR data
      const [insightsRes, reviewsRes, goalsRes, feedbackRes] = await Promise.all([
        fetch('/api/performance/insights?type=talent'),
        fetch('/api/performance/reviews'),
        fetch('/api/performance/goals'),
        fetch('/api/performance/feedback'),
      ]);

      if (insightsRes.ok) setTalentInsights(await insightsRes.json());
      if (reviewsRes.ok) setReviews((await reviewsRes.json()).reviews || []);
      if (goalsRes.ok) setGoals((await goalsRes.json()).goals || []);
      if (feedbackRes.ok) setFeedback((await feedbackRes.json()).feedback || []);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const openEmployeeModal = async (params: {
    performance?: string;
    potential?: string;
    minRating?: number;
    maxRating?: number;
    title: string;
    description?: string;
    color?: string;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.performance) queryParams.append('performance', params.performance);
      if (params.potential) queryParams.append('potential', params.potential);
      if (params.minRating) queryParams.append('minRating', params.minRating.toString());
      if (params.maxRating) queryParams.append('maxRating', params.maxRating.toString());

      const response = await fetch(`/api/hr/employees?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setModalData({
          title: params.title,
          description: params.description,
          employees: data.employees || [],
          color: params.color || 'indigo'
        });
        setModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleTabKeyDown = (e: React.KeyboardEvent, tabKey: string, tabs: string[]) => {
    const currentIndex = tabs.indexOf(tabKey);
    let newIndex = currentIndex;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      newIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      newIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIndex = tabs.length - 1;
    }

    if (newIndex !== currentIndex) {
      setActiveTab(tabs[newIndex] as any);
      const tabButton = document.querySelector(`[data-tab="${tabs[newIndex]}"]`) as HTMLElement;
      if (tabButton) tabButton.focus();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto absolute inset-0"></div>
          </div>
          <div className="mt-4 text-lg font-medium text-gray-700">Loading HR Analytics...</div>
          <div className="text-sm text-gray-500">Preparing your dashboard</div>
        </div>
      </div>
    );
  }

  const completedReviews = reviews.filter(r => r.status === 'submitted' || r.status === 'acknowledged' || r.status === 'calibrated').length;
  const pendingReviews = reviews.filter(r => r.status === 'in_progress' || r.status === 'not_started').length;
  const totalEmployees = talentInsights?.totalEmployees || 0;

  // Calculate goal stats
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const onTrackGoals = goals.filter(g => g.status === 'on_track').length;
  const atRiskGoals = goals.filter(g => g.status === 'at_risk' || g.status === 'off_track').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-200">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">People Analytics</h1>
                <p className="text-xs text-gray-500">HR Command Center</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-700">Live Data</span>
              </div>
              <span className="text-sm text-gray-600">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Workforce</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalEmployees.toLocaleString()}</p>
                <p className="text-xs text-green-600 font-medium mt-1">+3.2% this quarter</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">High Performers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{talentInsights?.highPerformers?.toLocaleString() || 0}</p>
                <p className="text-xs text-gray-500 mt-1">{totalEmployees > 0 ? Math.round((talentInsights?.highPerformers || 0) / totalEmployees * 100) : 0}% of workforce</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-50">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Flight Risk</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{talentInsights?.flightRisk?.toLocaleString() || 0}</p>
                <p className="text-xs text-amber-600 font-medium mt-1">Requires attention</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Review Cycle</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{reviews.length > 0 ? Math.round(completedReviews / reviews.length * 100) : 0}%</p>
                <p className="text-xs text-gray-500 mt-1">{completedReviews} of {reviews.length} complete</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-50">
                <CheckCircle2 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="border-b border-gray-200 px-2">
            <nav className="flex gap-1" role="tablist" aria-label="Dashboard sections">
              {[
                { key: 'overview', label: 'Overview', icon: Activity },
                { key: 'talent', label: '9-Box Matrix', icon: Users },
                { key: 'reviews', label: 'Reviews', icon: MessageSquare, count: reviews.length },
                { key: 'analytics', label: 'Analytics', icon: BarChart3 },
              ].map((tab) => (
                <button
                  key={tab.key}
                  data-tab={tab.key}
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  aria-controls={`${tab.key}-panel`}
                  tabIndex={activeTab === tab.key ? 0 : -1}
                  onClick={() => setActiveTab(tab.key as any)}
                  onKeyDown={(e) => handleTabKeyDown(e, tab.key, ['overview', 'talent', 'reviews', 'analytics'])}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                    activeTab === tab.key
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.key ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6" role="tabpanel" id="overview-panel">
                {/* Performance Distribution */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900">Performance Distribution</h3>
                    <span className="text-xs text-gray-500">Click to view employees</span>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {[
                      { label: 'Exceptional', rating: '4.5-5.0', count: talentInsights?.performanceDistribution?.exceptional || 0, color: 'emerald', minRating: 4.5, maxRating: 5.1 },
                      { label: 'Exceeds', rating: '4.0-4.5', count: talentInsights?.performanceDistribution?.exceeds || 0, color: 'blue', minRating: 4.0, maxRating: 4.5 },
                      { label: 'Meets', rating: '3.5-4.0', count: talentInsights?.performanceDistribution?.meets || 0, color: 'gray', minRating: 3.5, maxRating: 4.0 },
                      { label: 'Developing', rating: '3.0-3.5', count: talentInsights?.performanceDistribution?.developing || 0, color: 'amber', minRating: 3.0, maxRating: 3.5 },
                      { label: 'Needs Improvement', rating: '<3.0', count: talentInsights?.performanceDistribution?.improvement || 0, color: 'red', minRating: 0, maxRating: 3.0 },
                    ].map((item, idx) => {
                      const percentage = totalEmployees > 0 ? Math.round(item.count / totalEmployees * 100) : 0;
                      const colorClasses: Record<string, { bg: string; bar: string; text: string; border: string }> = {
                        emerald: { bg: 'bg-emerald-50', bar: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-200 hover:border-emerald-400' },
                        blue: { bg: 'bg-blue-50', bar: 'bg-blue-500', text: 'text-blue-700', border: 'border-blue-200 hover:border-blue-400' },
                        gray: { bg: 'bg-gray-50', bar: 'bg-gray-400', text: 'text-gray-700', border: 'border-gray-200 hover:border-gray-400' },
                        amber: { bg: 'bg-amber-50', bar: 'bg-amber-500', text: 'text-amber-700', border: 'border-amber-200 hover:border-amber-400' },
                        red: { bg: 'bg-red-50', bar: 'bg-red-500', text: 'text-red-700', border: 'border-red-200 hover:border-red-400' },
                      };
                      const colors = colorClasses[item.color];
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => item.count > 0 && openEmployeeModal({
                            minRating: item.minRating,
                            maxRating: item.maxRating,
                            title: `${item.label} Performers`,
                            description: `Performance rating: ${item.rating}`,
                            color: item.color
                          })}
                          disabled={item.count === 0}
                          className={`${colors.bg} ${colors.border} border-2 rounded-xl p-4 text-left transition-all hover:shadow-md ${
                            item.count > 0 ? 'cursor-pointer hover:-translate-y-0.5' : 'opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-2xl font-bold ${colors.text}`}>{item.count.toLocaleString()}</span>
                            <span className="text-xs font-medium text-gray-500">{percentage}%</span>
                          </div>
                          <p className="text-sm font-medium text-gray-900">{item.label}</p>
                          <p className="text-xs text-gray-500">{item.rating}</p>
                          <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full ${colors.bar} transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Recent Feedback */}
                  <div className="bg-gray-50 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-indigo-600" />
                        Recent Feedback
                      </h3>
                      <span className="text-xs font-medium text-indigo-600">{feedback.length} total</span>
                    </div>
                    <div className="space-y-3">
                      {feedback.slice(0, 5).map((item: any) => (
                        <div key={item.id} className="bg-white rounded-lg p-3 border border-gray-200 hover:border-indigo-200 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                              item.feedback_type === 'positive' ? 'bg-green-100' :
                              item.feedback_type === 'constructive' ? 'bg-blue-100' :
                              item.feedback_type === 'recognition' ? 'bg-purple-100' :
                              'bg-amber-100'
                            }`}>
                              {item.feedback_type === 'positive' ? '👍' :
                               item.feedback_type === 'constructive' ? '💡' :
                               item.feedback_type === 'recognition' ? '🏆' : '🎯'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {item.from_user_name}
                                </p>
                                <ChevronRight className="w-3 h-3 text-gray-400" />
                                <p className="text-sm text-gray-600 truncate">
                                  {item.to_user_name}
                                </p>
                              </div>
                              <p className="text-xs text-gray-500 line-clamp-2">{item.content}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                                  item.feedback_type === 'positive' ? 'bg-green-100 text-green-700' :
                                  item.feedback_type === 'constructive' ? 'bg-blue-100 text-blue-700' :
                                  item.feedback_type === 'recognition' ? 'bg-purple-100 text-purple-700' :
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                  {item.feedback_type}
                                </span>
                                <span className="text-xs text-gray-400">{item.category}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {feedback.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No feedback yet</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Goals Overview */}
                  <div className="bg-gray-50 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        <Target className="w-4 h-4 text-indigo-600" />
                        Goals Progress
                      </h3>
                      <span className="text-xs font-medium text-indigo-600">{goals.length} active</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-green-600">{completedGoals}</div>
                        <div className="text-xs text-gray-500">Completed</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-blue-600">{onTrackGoals}</div>
                        <div className="text-xs text-gray-500">On Track</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-amber-600">{atRiskGoals}</div>
                        <div className="text-xs text-gray-500">At Risk</div>
                      </div>
                    </div>
                    {/* Goal Completion Rate */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Overall Completion</span>
                        <span className="text-sm font-bold text-indigo-600">
                          {goals.length > 0 ? Math.round(completedGoals / goals.length * 100) : 0}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                          style={{ width: `${goals.length > 0 ? Math.round(completedGoals / goals.length * 100) : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Talent Highlights */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-6 text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Key Talent Highlights</h3>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <button
                      onClick={() => openEmployeeModal({
                        performance: 'high',
                        potential: 'high',
                        title: 'Star Performers',
                        description: 'High Performance + High Potential',
                        color: 'green'
                      })}
                      className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                          <Star className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{talentInsights?.nineBoxMatrix?.['high-high'] || 0}</p>
                          <p className="text-sm text-white/80">Star Performers</p>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => openEmployeeModal({
                        potential: 'high',
                        title: 'High Potential Talent',
                        description: 'Future leaders in your organization',
                        color: 'blue'
                      })}
                      className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{talentInsights?.highPotential || 0}</p>
                          <p className="text-sm text-white/80">High Potential</p>
                        </div>
                      </div>
                    </button>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                          <UserCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{talentInsights?.promotionReady || Math.floor((talentInsights?.highPerformers || 0) * PROMOTION_READY_PERCENTAGE)}</p>
                          <p className="text-sm text-white/80">Promotion Ready</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Talent Matrix Tab */}
            {activeTab === 'talent' && (
              <div className="space-y-6" role="tabpanel" id="talent-panel">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">9-Box Talent Matrix</h3>
                      <p className="text-sm text-gray-500">Click any cell to view employees</p>
                    </div>
                  </div>
                  
                  {/* 9-Box Grid with proper layout */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex">
                      {/* Y-Axis Label */}
                      <div className="flex flex-col justify-center mr-4">
                        <div className="transform -rotate-90 whitespace-nowrap text-xs font-medium text-gray-500 tracking-wider uppercase">
                          Potential →
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        {/* Grid */}
                        <div className="grid grid-cols-3 gap-3">
                          {/* Row 1: High Potential */}
                          {[
                            { box: 7, label: 'Enigma', perf: 'Low', pot: 'High', color: 'purple', count: talentInsights?.nineBoxMatrix?.['low-high'] || 0, performance: 'low', potential: 'high', desc: 'Potential not yet realized' },
                            { box: 8, label: 'Growth Engine', perf: 'Medium', pot: 'High', color: 'blue', count: talentInsights?.nineBoxMatrix?.['medium-high'] || 0, performance: 'medium', potential: 'high', desc: 'Strong growth trajectory' },
                            { box: 9, label: 'Star', perf: 'High', pot: 'High', color: 'emerald', count: talentInsights?.nineBoxMatrix?.['high-high'] || 0, performance: 'high', potential: 'high', desc: 'Top talent - retain & develop' },
                          ].map((box) => (
                            <button
                              key={box.box}
                              onClick={() => box.count > 0 && openEmployeeModal({
                                performance: box.performance,
                                potential: box.potential,
                                title: box.label,
                                description: `${box.perf} Performance / ${box.pot} Potential`,
                                color: box.color
                              })}
                              disabled={box.count === 0}
                              className={`relative rounded-xl p-4 border-2 transition-all ${
                                box.count > 0 ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5' : 'opacity-50 cursor-not-allowed'
                              } ${
                                box.color === 'emerald' ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-400' :
                                box.color === 'blue' ? 'bg-blue-50 border-blue-200 hover:border-blue-400' :
                                'bg-purple-50 border-purple-200 hover:border-purple-400'
                              }`}
                            >
                              <div className="text-center">
                                <p className={`text-3xl font-bold ${
                                  box.color === 'emerald' ? 'text-emerald-600' :
                                  box.color === 'blue' ? 'text-blue-600' :
                                  'text-purple-600'
                                }`}>{box.count}</p>
                                <p className="text-sm font-semibold text-gray-900 mt-1">{box.label}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{box.desc}</p>
                              </div>
                            </button>
                          ))}
                          
                          {/* Row 2: Medium Potential */}
                          {[
                            { box: 4, label: 'Dilemma', perf: 'Low', pot: 'Medium', color: 'amber', count: talentInsights?.nineBoxMatrix?.['low-medium'] || 0, performance: 'low', potential: 'medium', desc: 'Inconsistent results' },
                            { box: 5, label: 'Core Player', perf: 'Medium', pot: 'Medium', color: 'gray', count: talentInsights?.nineBoxMatrix?.['medium-medium'] || 0, performance: 'medium', potential: 'medium', desc: 'Solid contributor' },
                            { box: 6, label: 'High Impact', perf: 'High', pot: 'Medium', color: 'teal', count: talentInsights?.nineBoxMatrix?.['high-medium'] || 0, performance: 'high', potential: 'medium', desc: 'Consistent performer' },
                          ].map((box) => (
                            <button
                              key={box.box}
                              onClick={() => box.count > 0 && openEmployeeModal({
                                performance: box.performance,
                                potential: box.potential,
                                title: box.label,
                                description: `${box.perf} Performance / ${box.pot} Potential`,
                                color: box.color
                              })}
                              disabled={box.count === 0}
                              className={`relative rounded-xl p-4 border-2 transition-all ${
                                box.count > 0 ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5' : 'opacity-50 cursor-not-allowed'
                              } ${
                                box.color === 'teal' ? 'bg-teal-50 border-teal-200 hover:border-teal-400' :
                                box.color === 'gray' ? 'bg-gray-100 border-gray-300 hover:border-gray-400' :
                                'bg-amber-50 border-amber-200 hover:border-amber-400'
                              }`}
                            >
                              <div className="text-center">
                                <p className={`text-3xl font-bold ${
                                  box.color === 'teal' ? 'text-teal-600' :
                                  box.color === 'gray' ? 'text-gray-600' :
                                  'text-amber-600'
                                }`}>{box.count}</p>
                                <p className="text-sm font-semibold text-gray-900 mt-1">{box.label}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{box.desc}</p>
                              </div>
                            </button>
                          ))}
                          
                          {/* Row 3: Low Potential */}
                          {[
                            { box: 1, label: 'Underperformer', perf: 'Low', pot: 'Low', color: 'red', count: talentInsights?.nineBoxMatrix?.['low-low'] || 0, performance: 'low', potential: 'low', desc: 'Action required' },
                            { box: 2, label: 'Effective', perf: 'Medium', pot: 'Low', color: 'slate', count: talentInsights?.nineBoxMatrix?.['medium-low'] || 0, performance: 'medium', potential: 'low', desc: 'Steady contributor' },
                            { box: 3, label: 'Trusted Expert', perf: 'High', pot: 'Low', color: 'cyan', count: talentInsights?.nineBoxMatrix?.['high-low'] || 0, performance: 'high', potential: 'low', desc: 'Domain specialist' },
                          ].map((box) => (
                            <button
                              key={box.box}
                              onClick={() => box.count > 0 && openEmployeeModal({
                                performance: box.performance,
                                potential: box.potential,
                                title: box.label,
                                description: `${box.perf} Performance / ${box.pot} Potential`,
                                color: box.color
                              })}
                              disabled={box.count === 0}
                              className={`relative rounded-xl p-4 border-2 transition-all ${
                                box.count > 0 ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5' : 'opacity-50 cursor-not-allowed'
                              } ${
                                box.color === 'cyan' ? 'bg-cyan-50 border-cyan-200 hover:border-cyan-400' :
                                box.color === 'slate' ? 'bg-slate-50 border-slate-200 hover:border-slate-400' :
                                'bg-red-50 border-red-200 hover:border-red-400'
                              }`}
                            >
                              <div className="text-center">
                                <p className={`text-3xl font-bold ${
                                  box.color === 'cyan' ? 'text-cyan-600' :
                                  box.color === 'slate' ? 'text-slate-600' :
                                  'text-red-600'
                                }`}>{box.count}</p>
                                <p className="text-sm font-semibold text-gray-900 mt-1">{box.label}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{box.desc}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                        
                        {/* X-Axis Label */}
                        <div className="text-center mt-4">
                          <span className="text-xs font-medium text-gray-500 tracking-wider uppercase">Performance →</span>
                        </div>
                        
                        {/* Axis labels */}
                        <div className="flex justify-between mt-2 text-xs text-gray-400">
                          <span>Low</span>
                          <span>Medium</span>
                          <span>High</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Talent Action Items */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <h4 className="font-semibold text-gray-900">Retention Risks</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {talentInsights?.flightRisk || 0} employees identified as flight risks requiring immediate attention.
                    </p>
                    <button className="text-sm font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1">
                      View retention strategies <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="w-5 h-5 text-emerald-600" />
                      <h4 className="font-semibold text-gray-900">Succession Pipeline</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {talentInsights?.promotionReady || Math.floor((talentInsights?.highPerformers || 0) * PROMOTION_READY_PERCENTAGE)} employees ready for promotion consideration.
                    </p>
                    <button className="text-sm font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                      View succession plans <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-4" role="tabpanel" id="reviews-panel">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Performance Reviews</h3>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {completedReviews} Completed
                    </span>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                      {pendingReviews} Pending
                    </span>
                  </div>
                </div>
                
                {reviews.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No reviews to display</p>
                    <p className="text-sm">Reviews will appear here once the cycle begins</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((review: any) => (
                      <div key={review.id} className="bg-white rounded-xl p-4 border border-gray-200 hover:border-indigo-200 hover:shadow-sm transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                              {review.employee_name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2) || 'NA'}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{review.employee_name || 'Employee'}</h4>
                              <p className="text-sm text-gray-500">{review.cycle_name} • {review.review_type}</p>
                              <p className="text-xs text-gray-400 mt-1">Reviewer: {review.manager_name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${
                              review.status === 'submitted' || review.status === 'acknowledged' || review.status === 'calibrated' 
                                ? 'bg-green-100 text-green-700' 
                                : review.status === 'in_progress' 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-gray-100 text-gray-700'
                            }`}>
                              {review.status === 'calibrated' ? 'Calibrated' : 
                               review.status === 'acknowledged' ? 'Acknowledged' :
                               review.status === 'submitted' ? 'Submitted' :
                               review.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                            </span>
                            {review.overall_rating > 0 && (
                              <div className="mt-2">
                                <span className="text-lg font-bold text-indigo-600">{review.overall_rating}</span>
                                <span className="text-sm text-gray-400">/5</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6" role="tabpanel" id="analytics-panel">
                {/* Goal Analytics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Performance</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600">Completed</span>
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-3xl font-bold text-green-600">{completedGoals}</p>
                      <div className="mt-3 h-1.5 bg-green-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500"
                          style={{ width: `${goals.length > 0 ? (completedGoals / goals.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0}% completion rate
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600">On Track</span>
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-3xl font-bold text-blue-600">{onTrackGoals}</p>
                      <div className="mt-3 h-1.5 bg-blue-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500"
                          style={{ width: `${goals.length > 0 ? (onTrackGoals / goals.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Active and progressing</p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600">At Risk</span>
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                      </div>
                      <p className="text-3xl font-bold text-amber-600">{atRiskGoals}</p>
                      <div className="mt-3 h-1.5 bg-amber-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500"
                          style={{ width: `${goals.length > 0 ? (atRiskGoals / goals.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Needs intervention</p>
                    </div>
                  </div>
                </div>

                {/* Feedback Culture */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback Culture</h3>
                  <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <MessageSquare className="w-6 h-6 mx-auto text-indigo-600 mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{feedback.length}</p>
                        <p className="text-xs text-gray-500">Total</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                        <div className="text-xl mb-1">👍</div>
                        <p className="text-2xl font-bold text-green-600">{feedback.filter(f => f.feedback_type === 'positive').length}</p>
                        <p className="text-xs text-gray-500">Positive</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                        <div className="text-xl mb-1">💡</div>
                        <p className="text-2xl font-bold text-blue-600">{feedback.filter(f => f.feedback_type === 'constructive').length}</p>
                        <p className="text-xs text-gray-500">Constructive</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
                        <div className="text-xl mb-1">🏆</div>
                        <p className="text-2xl font-bold text-purple-600">{feedback.filter(f => f.feedback_type === 'recognition').length}</p>
                        <p className="text-xs text-gray-500">Recognition</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Department Insights */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-5 border border-gray-200">
                      <div className="flex items-center gap-2 mb-4">
                        <Building2 className="w-5 h-5 text-indigo-600" />
                        <h4 className="font-semibold text-gray-900">Top Performing Departments</h4>
                      </div>
                      <div className="space-y-3">
                        {(talentInsights?.departmentBreakdown || [
                          { department: 'Engineering', avgRating: 4.2, count: 1850 },
                          { department: 'Product', avgRating: 4.1, count: 420 },
                          { department: 'Sales', avgRating: 4.0, count: 680 },
                        ]).slice(0, 5).sort((a: any, b: any) => b.avgRating - a.avgRating).slice(0, 3).map((dept: any, idx: number) => (
                          <div key={dept.department} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                                idx === 1 ? 'bg-gray-200 text-gray-600' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {idx + 1}
                              </span>
                              <span className="font-medium text-gray-900">{dept.department}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-indigo-600">{dept.avgRating?.toFixed(1) || '4.0'}</span>
                              <span className="text-xs text-gray-400 ml-1">avg</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-gray-200">
                      <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-emerald-600" />
                        <h4 className="font-semibold text-gray-900">Headcount by Department</h4>
                      </div>
                      <div className="space-y-3">
                        {(talentInsights?.departmentBreakdown || [
                          { department: 'Engineering', count: 1850, avgRating: 4.2 },
                          { department: 'Sales', count: 680, avgRating: 4.0 },
                          { department: 'Product', count: 420, avgRating: 4.1 },
                        ]).slice(0, 5).sort((a: any, b: any) => b.count - a.count).slice(0, 3).map((dept: any) => (
                          <div key={dept.department} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-900">{dept.department}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-emerald-500"
                                  style={{ width: `${totalEmployees > 0 ? (dept.count / totalEmployees) * 100 : 0}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-700 w-16 text-right">{dept.count?.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organization Summary */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Organization Summary</h3>
                  </div>
                  <div className="grid sm:grid-cols-4 gap-4">
                    <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
                      <Users className="w-6 h-6 mx-auto mb-2 opacity-80" />
                      <p className="text-2xl font-bold">{totalEmployees.toLocaleString()}</p>
                      <p className="text-xs text-white/70">Total Employees</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
                      <MessageSquare className="w-6 h-6 mx-auto mb-2 opacity-80" />
                      <p className="text-2xl font-bold">{reviews.length}</p>
                      <p className="text-xs text-white/70">Reviews</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
                      <Target className="w-6 h-6 mx-auto mb-2 opacity-80" />
                      <p className="text-2xl font-bold">{goals.length}</p>
                      <p className="text-xs text-white/70">Active Goals</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
                      <Award className="w-6 h-6 mx-auto mb-2 opacity-80" />
                      <p className="text-2xl font-bold">{feedback.length}</p>
                      <p className="text-xs text-white/70">Feedback Given</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Employee List Modal */}
      <EmployeeListModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalData.title}
        description={modalData.description}
        employees={modalData.employees}
        color={modalData.color}
      />

      {/* AI Chatbot Assistant */}
      <ChatBot userRole={user?.role || 'hr'} currentPage="/recruiter" />
    </div>
  );
}
