'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ManagerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'reviews' | 'insights'>('overview');
  const [team, setTeam] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);

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

      // Check if user is manager
      if (userData.user.role !== 'manager' && userData.user.role !== 'hr') {
        if (userData.user.role === 'employee' || userData.user.role === 'candidate') {
          router.push('/employee');
        } else if (userData.user.role === 'recruiter') {
          router.push('/recruiter');
        }
        return;
      }

      // Fetch manager data
      const [teamRes, reviewsRes, goalsRes, feedbackRes, insightsRes] = await Promise.all([
        fetch('/api/manager/team'),
        fetch('/api/performance/reviews'),
        fetch('/api/performance/goals'),
        fetch('/api/performance/feedback'),
        fetch('/api/performance/insights?type=manager'),
      ]);

      if (teamRes.ok) setTeam((await teamRes.json()).team || []);
      if (reviewsRes.ok) setReviews((await reviewsRes.json()).reviews || []);
      if (goalsRes.ok) setGoals((await goalsRes.json()).goals || []);
      if (feedbackRes.ok) setFeedback((await feedbackRes.json()).feedback || []);
      if (insightsRes.ok) setInsights(await insightsRes.json());

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-xl font-medium text-gray-700">Loading your team dashboard...</div>
        </div>
      </div>
    );
  }

  const pendingReviews = reviews.filter(r => r.status === 'in_progress' || r.status === 'not_started').length;
  const teamAtRisk = team.filter((m: any) => m.flightRisk?.riskLevel === 'high').length;
  const avgTeamRating = team.length > 0
    ? (team.reduce((sum: number, m: any) => sum + (m.latestReview?.rating || 0), 0) / team.length).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Manager Dashboard</h1>
                <p className="text-sm text-gray-600">Leading {team.length} team member{team.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Insights Banner */}
        {insights && insights.insights && insights.insights.length > 0 && (
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl shadow-xl p-6 mb-8 text-white">
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">✨ AI Team Insights</h3>
                <div className="space-y-1">
                  {insights.insights.slice(0, 3).map((insight: any, idx: number) => (
                    <div key={idx} className="text-white/90 text-sm">• {insight.message}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-sm font-medium mb-1">Team Size</div>
                <div className="text-3xl font-bold text-indigo-600">{team.length}</div>
              </div>
              <div className="bg-indigo-100 p-3 rounded-xl">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-sm font-medium mb-1">Avg Rating</div>
                <div className="text-3xl font-bold text-green-600">{avgTeamRating}</div>
                <div className="text-xs text-gray-500">out of 5.0</div>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-sm font-medium mb-1">Pending Reviews</div>
                <div className="text-3xl font-bold text-amber-600">{pendingReviews}</div>
                <div className="text-xs text-gray-500">need attention</div>
              </div>
              <div className="bg-amber-100 p-3 rounded-xl">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-sm font-medium mb-1">Flight Risk</div>
                <div className="text-3xl font-bold text-red-600">{teamAtRisk}</div>
                <div className="text-xs text-gray-500">high risk</div>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 mb-6 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { key: 'overview', label: '📊 Overview' },
                { key: 'team', label: '👥 Team', count: team.length },
                { key: 'reviews', label: '📝 Reviews', count: reviews.length },
                { key: 'insights', label: '✨ AI Insights' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-all ${
                    activeTab === tab.key
                      ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
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
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Team Health */}
                    {insights?.teamHealth && (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <span className="text-xl">💪</span> Team Health Score
                        </h4>
                        <div className="text-4xl font-bold text-indigo-600 mb-2">
                          {Math.round(insights.teamHealth.overallScore)}<span className="text-2xl text-gray-500">/100</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                          <div>
                            <div className="text-gray-600">Engagement</div>
                            <div className="font-semibold text-gray-900">{Math.round(insights.teamHealth.engagement)}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Performance</div>
                            <div className="font-semibold text-gray-900">{Math.round(insights.teamHealth.performance)}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Talent Distribution */}
                    {insights?.talentInsights && (
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <span className="text-xl">⭐</span> Talent Distribution
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">High Performers</span>
                            <span className="font-bold text-green-600">{insights.talentInsights.highPerformers}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">High Potential</span>
                            <span className="font-bold text-blue-600">{insights.talentInsights.highPotential}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Flight Risk</span>
                            <span className="font-bold text-red-600">{insights.talentInsights.flightRisk}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Team Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Team Activity</h3>
                  <div className="space-y-3">
                    {feedback.slice(0, 5).map((item: any) => (
                      <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-200">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            item.feedback_type === 'positive' ? 'bg-green-100' :
                            item.feedback_type === 'constructive' ? 'bg-blue-100' :
                            'bg-purple-100'
                          }`}>
                            {item.feedback_type === 'positive' ? '👍' :
                             item.feedback_type === 'constructive' ? '💡' : '🎉'}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {item.from_user_name} → {item.to_user_name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{item.category} • {new Date(item.created_at).toLocaleDateString()}</div>
                            <div className="text-sm text-gray-700 mt-2">{item.content}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Team</h3>
                {team.map((member: any) => (
                  <div key={member.id} className="bg-white rounded-xl p-5 border border-gray-200 hover:border-indigo-300 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.job_title} • {member.department}</p>
                      </div>
                      {member.latestReview && (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-indigo-600">{member.latestReview.rating}</div>
                          <div className="text-xs text-gray-500">Performance</div>
                        </div>
                      )}
                    </div>

                    {member.flightRisk && member.flightRisk.riskLevel !== 'low' && (
                      <div className={`rounded-lg p-3 mb-3 ${
                        member.flightRisk.riskLevel === 'high' ? 'bg-red-50 border border-red-200' :
                        'bg-amber-50 border border-amber-200'
                      }`}>
                        <div className="text-sm font-semibold mb-1 ${member.flightRisk.riskLevel === 'high' ? 'text-red-900' : 'text-amber-900'}">
                          ⚠️ {member.flightRisk.riskLevel.toUpperCase()} Flight Risk
                        </div>
                        {member.flightRisk.recommendations && (
                          <div className="text-xs text-gray-700">
                            {member.flightRisk.recommendations[0]}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <div className="text-gray-600">Goals Active</div>
                        <div className="font-semibold text-gray-900">{goals.filter(g => g.owner_id === member.id && g.status !== 'completed').length}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Feedback Given</div>
                        <div className="font-semibold text-gray-900">{feedback.filter(f => f.from_user_id === member.id).length}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Experience</div>
                        <div className="font-semibold text-gray-900">{member.years_experience || 0} years</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Performance Reviews</h3>
                {reviews.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-6xl mb-4">📝</div>
                    <p>No reviews to display</p>
                  </div>
                ) : (
                  reviews.map((review: any) => (
                    <div key={review.id} className="bg-white rounded-xl p-5 border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.employee_name || 'Employee'}</h4>
                          <p className="text-sm text-gray-600">{review.review_type} review</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          review.status === 'completed' ? 'bg-green-100 text-green-700' :
                          review.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {review.status.replace('_', ' ')}
                        </span>
                      </div>
                      {review.overall_rating && (
                        <div className="text-sm text-gray-700">
                          Rating: <span className="font-semibold">{review.overall_rating}/5</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Insights Tab */}
            {activeTab === 'insights' && insights && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Manager Insights</h3>
                  {insights.insights && insights.insights.length > 0 && (
                    <div className="space-y-3">
                      {insights.insights.map((insight: any, idx: number) => (
                        <div key={idx} className={`rounded-xl p-4 border ${
                          insight.priority === 'high' ? 'bg-red-50 border-red-200' :
                          insight.priority === 'medium' ? 'bg-amber-50 border-amber-200' :
                          'bg-blue-50 border-blue-200'
                        }`}>
                          <div className="flex items-start gap-3">
                            <div className="text-2xl flex-shrink-0">
                              {insight.priority === 'high' ? '🔴' :
                               insight.priority === 'medium' ? '🟡' : '🔵'}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 mb-1">{insight.category}</div>
                              <div className="text-sm text-gray-700">{insight.message}</div>
                              {insight.actionable && (
                                <div className="mt-2 text-xs text-gray-600 bg-white/50 rounded px-2 py-1">
                                  💡 {insight.actionable}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
