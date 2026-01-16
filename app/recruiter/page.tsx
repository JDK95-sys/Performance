'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

export default function HRDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'talent' | 'reviews' | 'analytics'>('overview');
  const [talentInsights, setTalentInsights] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);

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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4" role="status" aria-label="Loading HR analytics"></div>
          <div className="text-xl font-medium text-gray-700">Loading HR analytics...</div>
        </div>
      </div>
    );
  }

  const completedReviews = reviews.filter(r => r.status === 'submitted' || r.status === 'acknowledged' || r.status === 'calibrated').length;
  const pendingReviews = reviews.filter(r => r.status === 'in_progress' || r.status === 'not_started').length;
  const totalEmployees = talentInsights?.totalEmployees || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-pink-600 to-purple-600 p-2 rounded-xl" aria-hidden="true">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HR Analytics Dashboard</h1>
                <p className="text-sm text-gray-600">Organization-wide performance insights</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Executive Summary Banner */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-6">📊 Performance Management Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <div className="text-white/80 text-sm mb-1">Total Employees</div>
              <div className="text-3xl font-bold">{totalEmployees}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <div className="text-white/80 text-sm mb-1">Completed Reviews</div>
              <div className="text-3xl font-bold">{completedReviews}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <div className="text-white/80 text-sm mb-1">Pending Reviews</div>
              <div className="text-3xl font-bold">{pendingReviews}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <div className="text-white/80 text-sm mb-1">Active Goals</div>
              <div className="text-3xl font-bold">{goals.filter(g => g.status !== 'completed').length}</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-gray-600 text-sm font-medium mb-1">High Performers</div>
                <div className="text-3xl font-bold text-green-600">{talentInsights?.highPerformers || 0}</div>
              </div>
              <div className="bg-green-100 p-3 rounded-xl" aria-hidden="true">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="text-xs text-gray-500">Top 20% performers</div>
          </div>

          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-gray-600 text-sm font-medium mb-1">High Potential</div>
                <div className="text-3xl font-bold text-blue-600">{talentInsights?.highPotential || 0}</div>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl" aria-hidden="true">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <div className="text-xs text-gray-500">Future leaders</div>
          </div>

          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-gray-600 text-sm font-medium mb-1">Flight Risk</div>
                <div className="text-3xl font-bold text-red-600">{talentInsights?.flightRisk || 0}</div>
              </div>
              <div className="bg-red-100 p-3 rounded-xl" aria-hidden="true">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="text-xs text-gray-500">Requires attention</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 mb-6 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px" role="tablist" aria-label="Dashboard sections">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'talent', label: 'Talent Matrix' },
                { key: 'reviews', label: 'Reviews', count: reviews.length },
                { key: 'analytics', label: 'Analytics' },
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
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-all ${
                    activeTab === tab.key
                      ? 'border-pink-500 text-pink-600 bg-pink-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} {tab.count !== undefined && <span className="ml-1 text-xs opacity-75">({tab.count})</span>}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6" role="tabpanel" id="overview-panel" aria-labelledby="overview-tab">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Distribution</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                    {(() => {
                      const colorMap: Record<string, { bg: string; border: string; text: string }> = {
                        green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' },
                        blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
                        gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600' },
                        amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' },
                        red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600' },
                      };

                      return [
                        { rating: '5.0', label: 'Exceptional', count: talentInsights?.performanceDistribution?.exceptional || 0, color: 'green' },
                        { rating: '4.0', label: 'Exceeds', count: talentInsights?.performanceDistribution?.exceeds || 0, color: 'blue' },
                        { rating: '3.0', label: 'Meets', count: talentInsights?.performanceDistribution?.meets || 0, color: 'gray' },
                        { rating: '2.0', label: 'Developing', count: talentInsights?.performanceDistribution?.developing || 0, color: 'amber' },
                        { rating: '1.0', label: 'Improvement', count: talentInsights?.performanceDistribution?.improvement || 0, color: 'red' },
                      ].map((item) => {
                        const colors = colorMap[item.color];
                        return (
                          <div key={item.rating} className={`${colors.bg} border ${colors.border} rounded-xl p-4 text-center`}>
                            <div className={`text-2xl font-bold ${colors.text}`}>{item.count}</div>
                            <div className="text-xs text-gray-600 mt-1">{item.label}</div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Department Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Feedback Activity</h3>
                  <div className="space-y-3">
                    {feedback.slice(0, 8).map((item: any) => (
                      <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-200 hover:border-indigo-300 transition-all">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg flex-shrink-0 ${
                            item.feedback_type === 'positive' ? 'bg-green-100' :
                            item.feedback_type === 'constructive' ? 'bg-blue-100' :
                            item.feedback_type === 'recognition' ? 'bg-purple-100' :
                            'bg-amber-100'
                          }`}>
                            {item.feedback_type === 'positive' ? '👍' :
                             item.feedback_type === 'constructive' ? '💡' :
                             item.feedback_type === 'recognition' ? '🎉' : '🎯'}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <div className="text-sm font-medium text-gray-900">
                                {item.from_user_name} → {item.to_user_name}
                              </div>
                              <div className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</div>
                            </div>
                            <div className="text-xs text-gray-500 mb-2">{item.category}</div>
                            <div className="text-sm text-gray-700">{item.content}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Talent Matrix Tab */}
            {activeTab === 'talent' && (
              <div className="space-y-6" role="tabpanel" id="talent-panel" aria-labelledby="talent-tab">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">9-Box Talent Matrix</h3>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {(() => {
                        const colorMap: Record<string, { border: string; borderHover: string; text: string }> = {
                          green: { border: 'border-green-200', borderHover: 'hover:border-green-400', text: 'text-green-600' },
                          blue: { border: 'border-blue-200', borderHover: 'hover:border-blue-400', text: 'text-blue-600' },
                          purple: { border: 'border-purple-200', borderHover: 'hover:border-purple-400', text: 'text-purple-600' },
                          teal: { border: 'border-teal-200', borderHover: 'hover:border-teal-400', text: 'text-teal-600' },
                          gray: { border: 'border-gray-200', borderHover: 'hover:border-gray-400', text: 'text-gray-600' },
                          amber: { border: 'border-amber-200', borderHover: 'hover:border-amber-400', text: 'text-amber-600' },
                          cyan: { border: 'border-cyan-200', borderHover: 'hover:border-cyan-400', text: 'text-cyan-600' },
                          slate: { border: 'border-slate-200', borderHover: 'hover:border-slate-400', text: 'text-slate-600' },
                          red: { border: 'border-red-200', borderHover: 'hover:border-red-400', text: 'text-red-600' },
                        };

                        return [
                          { box: 9, label: 'Star', perf: 'High', pot: 'High', color: 'green', count: talentInsights?.nineBoxMatrix?.['high-high'] || 0 },
                          { box: 8, label: 'High Potential', perf: 'Medium', pot: 'High', color: 'blue', count: talentInsights?.nineBoxMatrix?.['medium-high'] || 0 },
                          { box: 7, label: 'Rough Diamond', perf: 'Low', pot: 'High', color: 'purple', count: talentInsights?.nineBoxMatrix?.['low-high'] || 0 },
                          { box: 6, label: 'Core Player', perf: 'High', pot: 'Medium', color: 'teal', count: talentInsights?.nineBoxMatrix?.['high-medium'] || 0 },
                          { box: 5, label: 'Solid Performer', perf: 'Medium', pot: 'Medium', color: 'gray', count: talentInsights?.nineBoxMatrix?.['medium-medium'] || 0 },
                          { box: 4, label: 'Inconsistent', perf: 'Low', pot: 'Medium', color: 'amber', count: talentInsights?.nineBoxMatrix?.['low-medium'] || 0 },
                          { box: 3, label: 'Trusted Pro', perf: 'High', pot: 'Low', color: 'cyan', count: talentInsights?.nineBoxMatrix?.['high-low'] || 0 },
                          { box: 2, label: 'Effective', perf: 'Medium', pot: 'Low', color: 'slate', count: talentInsights?.nineBoxMatrix?.['medium-low'] || 0 },
                          { box: 1, label: 'Needs Attention', perf: 'Low', pot: 'Low', color: 'red', count: talentInsights?.nineBoxMatrix?.['low-low'] || 0 },
                        ].reverse().map((box) => {
                          const colors = colorMap[box.color];
                          return (
                            <div key={box.box} className={`bg-white rounded-lg p-4 border-2 ${colors.border} ${colors.borderHover} transition-all cursor-pointer`}>
                              <div className="text-center">
                                <div className={`text-3xl font-bold ${colors.text} mb-1`}>{box.count}</div>
                                <div className="text-xs font-semibold text-gray-900 mb-1">{box.label}</div>
                                <div className="text-xs text-gray-500">{box.perf} / {box.pot}</div>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                    <div className="text-xs text-gray-600 text-center">
                      Y-axis: Potential (Low → High) | X-axis: Performance (Low → High)
                    </div>
                  </div>
                </div>

                {/* Key Talent */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Talent & Succession</h3>
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="text-center text-gray-500 py-8">
                      <div className="text-6xl mb-4">⭐</div>
                      <p>Succession planning data available in full platform</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-4" role="tabpanel" id="reviews-panel" aria-labelledby="reviews-tab">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">All Performance Reviews</h3>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                      {completedReviews} Completed
                    </span>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium">
                      {pendingReviews} Pending
                    </span>
                  </div>
                </div>
                {reviews.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-6xl mb-4">📝</div>
                    <p>No reviews to display</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reviews.map((review: any) => (
                      <div key={review.id} className="bg-white rounded-xl p-5 border border-gray-200 hover:border-indigo-300 transition-all">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{review.employee_name || 'Employee'}</h4>
                            <p className="text-xs text-gray-600">{review.review_type} review</p>
                          </div>
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            review.status === 'submitted' || review.status === 'acknowledged' || review.status === 'calibrated' ? 'bg-green-100 text-green-700' :
                            review.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {review.status.replace('_', ' ')}
                          </span>
                        </div>
                        {review.overall_rating && (
                          <div className="flex items-center gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Rating:</span>
                              <span className="font-bold text-indigo-600 ml-2">{review.overall_rating}/5</span>
                            </div>
                            {review.potential_rating && (
                              <div>
                                <span className="text-gray-600">Potential:</span>
                                <span className="font-bold text-purple-600 ml-2">{review.potential_rating}/5</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6" role="tabpanel" id="analytics-panel" aria-labelledby="analytics-tab">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Completion Analytics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                      <div className="text-sm text-gray-600 mb-2">Completed Goals</div>
                      <div className="text-4xl font-bold text-green-600 mb-1">
                        {goals.filter(g => g.status === 'completed').length}
                      </div>
                      <div className="text-xs text-gray-500">
                        {goals.length > 0 ? Math.round((goals.filter(g => g.status === 'completed').length / goals.length) * 100) : 0}% completion rate
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                      <div className="text-sm text-gray-600 mb-2">On Track</div>
                      <div className="text-4xl font-bold text-blue-600 mb-1">
                        {goals.filter(g => g.status === 'on_track').length}
                      </div>
                      <div className="text-xs text-gray-500">Active and progressing</div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                      <div className="text-sm text-gray-600 mb-2">At Risk</div>
                      <div className="text-4xl font-bold text-amber-600 mb-1">
                        {goals.filter(g => g.status === 'at_risk' || g.status === 'off_track').length}
                      </div>
                      <div className="text-xs text-gray-500">Needs intervention</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback Culture</h3>
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-indigo-600">{feedback.length}</div>
                        <div className="text-xs text-gray-600 mt-1">Total Feedback</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">{feedback.filter(f => f.feedback_type === 'positive').length}</div>
                        <div className="text-xs text-gray-600 mt-1">Positive</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{feedback.filter(f => f.feedback_type === 'constructive').length}</div>
                        <div className="text-xs text-gray-600 mt-1">Constructive</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">{feedback.filter(f => f.feedback_type === 'recognition').length}</div>
                        <div className="text-xs text-gray-600 mt-1">Recognition</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Health</h3>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <div className="text-center">
                      <div className="text-6xl mb-4">💪</div>
                      <div className="text-2xl font-bold text-gray-900 mb-2">Performance Management Platform</div>
                      <p className="text-gray-600 mb-4">Comprehensive talent and performance analytics for 14K+ employees</p>
                      <div className="flex justify-center gap-6 text-sm">
                        <div>
                          <div className="font-bold text-2xl text-indigo-600">{reviews.length}</div>
                          <div className="text-gray-600">Reviews</div>
                        </div>
                        <div>
                          <div className="font-bold text-2xl text-green-600">{goals.length}</div>
                          <div className="text-gray-600">Goals</div>
                        </div>
                        <div>
                          <div className="font-bold text-2xl text-purple-600">{feedback.length}</div>
                          <div className="text-gray-600">Feedback</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
