'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Target,
  MessageSquare,
  TrendingUp,
  Calendar,
  Award,
  AlertCircle,
  Clock,
  CheckCircle2,
  Plus,
  Send,
  Star,
  BookOpen
} from 'lucide-react';
import Footer from '@/components/Footer';
import GiveFeedbackModal from '@/components/modals/GiveFeedbackModal';
import ScheduleOneOnOneModal from '@/components/modals/ScheduleOneOnOneModal';

export default function TeamMemberDetailPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params.id;

  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [developmentPlan, setDevelopmentPlan] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showGiveFeedbackModal, setShowGiveFeedbackModal] = useState(false);
  const [showScheduleOneOnOneModal, setShowScheduleOneOnOneModal] = useState(false);

  useEffect(() => {
    if (memberId) {
      fetchTeamMemberData();
    }
  }, [memberId]);

  const fetchTeamMemberData = async () => {
    try {
      // Fetch team member details
      const teamRes = await fetch('/api/manager/team');
      if (teamRes.ok) {
        const teamData = await teamRes.json();
        const foundMember = teamData.team?.find((m: any) => m.id === parseInt(memberId as string));
        if (foundMember) {
          setMember(foundMember);
        }
      }

      // Fetch goals for this team member
      const goalsRes = await fetch('/api/performance/goals');
      if (goalsRes.ok) {
        const goalsData = await goalsRes.json();
        const memberGoals = goalsData.goals?.filter((g: any) => g.owner_id === parseInt(memberId as string)) || [];
        setGoals(memberGoals);
      }

      // Fetch feedback for this team member
      const feedbackRes = await fetch(`/api/performance/feedback?toUserId=${memberId}`);
      if (feedbackRes.ok) {
        const feedbackData = await feedbackRes.json();
        setFeedback(feedbackData.feedback || []);
      }

      // Fetch reviews for this team member
      const reviewsRes = await fetch('/api/performance/reviews');
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        const memberReviews = reviewsData.reviews?.filter((r: any) => r.employee_id === parseInt(memberId as string)) || [];
        setReviews(memberReviews);
      }

      // Fetch development plan
      const devPlanRes = await fetch(`/api/performance/development-plans?employeeId=${memberId}`);
      if (devPlanRes.ok) {
        const devPlanData = await devPlanRes.json();
        if (devPlanData.plans && devPlanData.plans.length > 0) {
          setDevelopmentPlan(devPlanData.plans[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching team member data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      on_track: 'bg-green-100 text-green-800',
      at_risk: 'bg-yellow-100 text-yellow-800',
      off_track: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      not_started: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: any = {
      on_track: <TrendingUp className="w-4 h-4" />,
      completed: <CheckCircle2 className="w-4 h-4" />,
      at_risk: <AlertCircle className="w-4 h-4" />,
      off_track: <AlertCircle className="w-4 h-4" />,
      not_started: <Clock className="w-4 h-4" />,
      in_progress: <Clock className="w-4 h-4" />
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Team Member Not Found</h2>
          <button
            onClick={() => router.push('/manager')}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Return to Manager Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-indigo-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/manager')}
                className="p-2 hover:bg-indigo-50 rounded-lg transition"
                aria-label="Back to manager dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{member.name}</h1>
                <p className="text-sm text-gray-600">{member.job_title} • {member.department}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowScheduleOneOnOneModal(true)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Schedule 1:1
              </button>
              <button
                onClick={() => setShowGiveFeedbackModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Give Feedback
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Quick Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h2>
                <p className="text-sm text-gray-600">{member.job_title}</p>
                <p className="text-sm text-gray-500">{member.department}</p>
              </div>

              {member.bio && (
                <div className="mb-6 pb-6 border-b">
                  <p className="text-sm text-gray-600">{member.bio}</p>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Experience</span>
                  <span className="text-sm font-semibold text-gray-900">{member.years_experience || 0} years</span>
                </div>
                {member.latestReview && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Performance Rating</span>
                    <span className="text-lg font-bold text-indigo-600">{member.latestReview.rating}/5.0</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Goals</span>
                  <span className="text-sm font-semibold text-gray-900">{goals.filter(g => g.status !== 'completed').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Feedback Received</span>
                  <span className="text-sm font-semibold text-gray-900">{feedback.length}</span>
                </div>
              </div>
            </div>

            {/* Flight Risk Card */}
            {member.flightRisk && member.flightRisk.riskLevel !== 'low' && (
              <div className={`rounded-2xl shadow-lg p-6 ${
                member.flightRisk.riskLevel === 'high'
                  ? 'bg-red-50 border-2 border-red-200'
                  : 'bg-yellow-50 border-2 border-yellow-200'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className={`w-5 h-5 ${
                    member.flightRisk.riskLevel === 'high' ? 'text-red-600' : 'text-yellow-600'
                  }`} />
                  <h3 className={`font-bold ${
                    member.flightRisk.riskLevel === 'high' ? 'text-red-900' : 'text-yellow-900'
                  }`}>
                    {member.flightRisk.riskLevel.toUpperCase()} Flight Risk
                  </h3>
                </div>
                {member.flightRisk.recommendations && (
                  <ul className="space-y-2">
                    {member.flightRisk.recommendations.slice(0, 3).map((rec: string, idx: number) => (
                      <li key={idx} className="text-sm text-gray-700">• {rec}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => alert('Give Recognition feature coming soon!')}
                  className="w-full px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition font-medium text-sm flex items-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  Give Recognition
                </button>
                <button
                  onClick={() => alert('Create Review feature coming soon!')}
                  className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-medium text-sm flex items-center gap-2"
                >
                  <Star className="w-4 h-4" />
                  Create Review
                </button>
                <button
                  onClick={() => alert('Assign Goal feature coming soon!')}
                  className="w-full px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition font-medium text-sm flex items-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  Assign Goal
                </button>
                <button
                  onClick={() => alert('Create Development Plan feature coming soon!')}
                  className="w-full px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition font-medium text-sm flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Development Plan
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Tabbed Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-t-2xl shadow-lg border-b border-gray-200">
              <nav className="flex">
                {[
                  { key: 'overview', label: 'Overview' },
                  { key: 'goals', label: 'Goals', count: goals.length },
                  { key: 'feedback', label: 'Feedback', count: feedback.length },
                  { key: 'reviews', label: 'Reviews', count: reviews.length },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
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

            {/* Tab Content */}
            <div className="bg-white rounded-b-2xl shadow-lg p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Summary</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                        <div className="text-sm text-gray-600 mb-1">Goals Completed</div>
                        <div className="text-3xl font-bold text-green-600">
                          {goals.filter(g => g.status === 'completed').length}
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <div className="text-sm text-gray-600 mb-1">In Progress</div>
                        <div className="text-3xl font-bold text-blue-600">
                          {goals.filter(g => g.status === 'in_progress' || g.status === 'on_track').length}
                        </div>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                        <div className="text-sm text-gray-600 mb-1">Positive Feedback</div>
                        <div className="text-3xl font-bold text-purple-600">
                          {feedback.filter(f => f.feedback_type === 'positive' || f.feedback_type === 'recognition').length}
                        </div>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                        <div className="text-sm text-gray-600 mb-1">Total Reviews</div>
                        <div className="text-3xl font-bold text-amber-600">
                          {reviews.length}
                        </div>
                      </div>
                    </div>
                  </div>

                  {developmentPlan && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Development Plan</h3>
                      <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{developmentPlan.plan_name}</h4>
                          <span className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-700 rounded">
                            {developmentPlan.status}
                          </span>
                        </div>
                        {developmentPlan.target_role && (
                          <p className="text-sm text-gray-600 mb-2">Target Role: {developmentPlan.target_role}</p>
                        )}
                        <p className="text-sm text-gray-700">{developmentPlan.overview}</p>
                      </div>
                    </div>
                  )}

                  {member.careerGoal && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Career Aspirations</h3>
                      <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                        <p className="text-sm text-gray-700">{member.careerGoal.desiredRole}</p>
                        <p className="text-xs text-gray-500 mt-2">Timeframe: {member.careerGoal.timeframe}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Goals Tab */}
              {activeTab === 'goals' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Goals & Objectives</h3>
                    <button
                      onClick={() => alert('Assign Goal feature coming soon!')}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Assign Goal
                    </button>
                  </div>
                  {goals.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>No goals yet</p>
                    </div>
                  ) : (
                    goals.map((goal) => (
                      <div key={goal.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">{goal.title}</h4>
                            {goal.description && (
                              <p className="text-sm text-gray-600">{goal.description}</p>
                            )}
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded flex items-center gap-1 ${getStatusColor(goal.status)}`}>
                            {getStatusIcon(goal.status)}
                            {goal.status?.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {goal.due_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(goal.due_date).toLocaleDateString()}
                            </span>
                          )}
                          <span>Progress: {goal.progress_percentage || 0}%</span>
                        </div>
                        {goal.progress_percentage !== undefined && (
                          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full transition-all"
                              style={{ width: `${goal.progress_percentage}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Feedback Tab */}
              {activeTab === 'feedback' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Feedback History</h3>
                    <button
                      onClick={() => setShowGiveFeedbackModal(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Give Feedback
                    </button>
                  </div>
                  {feedback.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>No feedback yet</p>
                    </div>
                  ) : (
                    feedback.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-xs font-medium text-gray-500">
                              From: {item.from_user_name}
                            </span>
                            <span className="text-xs text-gray-400 ml-2">
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded ${
                            item.feedback_type === 'positive' || item.feedback_type === 'recognition'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {item.feedback_type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{item.content}</p>
                        {item.category && (
                          <span className="inline-block mt-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {item.category}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Performance Reviews</h3>
                    <button
                      onClick={() => alert('Create Review feature coming soon!')}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create Review
                    </button>
                  </div>
                  {reviews.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Star className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>No reviews yet</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{review.cycle_name}</h4>
                            <span className="text-xs text-gray-500">{review.review_type} review</span>
                          </div>
                          <div className="text-right">
                            {review.overall_rating && (
                              <div className="text-2xl font-bold text-indigo-600">{review.overall_rating}/5</div>
                            )}
                            <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(review.status)}`}>
                              {review.status?.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        {review.strengths && (
                          <div className="text-sm text-gray-700 mb-2">
                            <span className="font-medium">Strengths:</span> {review.strengths}
                          </div>
                        )}
                        {review.areas_for_improvement && (
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">Areas for Improvement:</span> {review.areas_for_improvement}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Give Feedback Modal */}
      <GiveFeedbackModal
        isOpen={showGiveFeedbackModal}
        onClose={() => setShowGiveFeedbackModal(false)}
        onSuccess={() => {
          fetchTeamMemberData(); // Refresh feedback data
        }}
        teamMember={member ? {
          id: member.id,
          name: member.name,
          title: member.job_title
        } : undefined}
      />

      {/* Schedule 1:1 Modal */}
      <ScheduleOneOnOneModal
        isOpen={showScheduleOneOnOneModal}
        onClose={() => setShowScheduleOneOnOneModal(false)}
        onSuccess={() => {
          alert('1:1 meeting scheduled successfully!');
        }}
        teamMember={member ? {
          id: member.id,
          name: member.name,
          title: member.job_title
        } : undefined}
      />

      <Footer />
    </div>
  );
}
