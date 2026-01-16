'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Target,
  BookOpen,
  Users,
  Briefcase,
  TrendingUp,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Award,
  GraduationCap,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Footer from '@/components/Footer';
import { 
  getCoursesByFocusArea, 
  getCoursesByActionType,
  getCoursesByTargetRole,
  getAllFocusAreas,
  type LinkedInCourse,
  type FocusArea
} from '@/lib/linkedin-learning-library';

interface DevelopmentAction {
  id: number;
  action_type: string;
  title: string;
  description: string;
  target_date: string;
  status: string;
  progress_notes?: string;
  recommended_courses?: string[];
}

interface DevelopmentPlan {
  id: number;
  plan_name: string;
  target_role: string;
  target_date: string;
  status: string;
  overview: string;
  manager_name: string;
  actions: DevelopmentAction[];
  focus_areas?: string[];
}

export default function DevelopmentPlanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<DevelopmentPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<DevelopmentPlan | null>(null);
  const [expandedActions, setExpandedActions] = useState<{ [key: number]: boolean }>({});
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [selectedFocusArea, setSelectedFocusArea] = useState<string | null>(null);

  useEffect(() => {
    fetchDevelopmentPlans();
  }, []);

  const fetchDevelopmentPlans = async () => {
    try {
      const res = await fetch('/api/performance/development-plans');
      if (res.ok) {
        const data = await res.json();
        setPlans(data.plans || []);
        if (data.plans && data.plans.length > 0) {
          setSelectedPlan(data.plans[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching development plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (actionType: string) => {
    const icons: any = {
      training: <BookOpen className="w-5 h-5" />,
      mentoring: <Users className="w-5 h-5" />,
      project: <Briefcase className="w-5 h-5" />,
      stretch_assignment: <TrendingUp className="w-5 h-5" />,
      shadowing: <Users className="w-5 h-5" />,
      reading: <BookOpen className="w-5 h-5" />
    };
    return icons[actionType] || <Target className="w-5 h-5" />;
  };

  const getStatusIcon = (status: string) => {
    const icons: any = {
      completed: <CheckCircle2 className="w-5 h-5 text-green-600" />,
      in_progress: <Clock className="w-5 h-5 text-blue-600" />,
      not_started: <AlertCircle className="w-5 h-5 text-gray-400" />,
      cancelled: <AlertCircle className="w-5 h-5 text-red-600" />
    };
    return icons[status] || <Clock className="w-5 h-5" />;
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      not_started: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatActionType = (type: string) => {
    return type.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const calculateProgress = (actions: DevelopmentAction[]) => {
    if (!actions || actions.length === 0) return 0;
    const completed = actions.filter(a => a.status === 'completed').length;
    return Math.round((completed / actions.length) * 100);
  };

  const toggleActionCourses = (actionId: number) => {
    setExpandedActions(prev => ({
      ...prev,
      [actionId]: !prev[actionId]
    }));
  };

  const getCoursesForAction = (action: DevelopmentAction): LinkedInCourse[] => {
    const allCourses = getCoursesByActionType(action.action_type);
    
    // If we have specific recommended courses, filter to those
    if (action.recommended_courses && action.recommended_courses.length > 0) {
      return allCourses.filter(course => 
        action.recommended_courses!.includes(course.id)
      );
    }
    
    // Otherwise return top 4 courses for this action type
    return allCourses.slice(0, 4);
  };

  const getRecommendedFocusAreas = (): FocusArea[] => {
    if (!selectedPlan?.target_role) return [];
    return getCoursesByTargetRole(selectedPlan.target_role);
  };

  const getLevelBadgeColor = (level: string): string => {
    const colors: Record<string, string> = {
      'Beginner': 'bg-green-100 text-green-700',
      'Intermediate': 'bg-blue-100 text-blue-700',
      'Advanced': 'bg-purple-100 text-purple-700'
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-indigo-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/employee')}
                className="p-2 hover:bg-indigo-50 rounded-lg transition"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Development Plan</h1>
                <p className="text-sm text-gray-600">Track your career growth and learning goals</p>
              </div>
            </div>
            <button
              onClick={() => alert('Create new plan feature coming soon!')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Plan
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {plans.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Development Plan Yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Work with your manager to create a personalized development plan that aligns with your career goals.
            </p>
            <button
              onClick={() => alert('Request development plan feature coming soon! This will notify your manager.')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Request Development Plan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Plan Overview Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(selectedPlan?.status || '')}`}>
                      {selectedPlan?.status?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {selectedPlan?.plan_name}
                </h2>

                {selectedPlan?.target_role && (
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Award className="w-4 h-4" />
                    <span className="text-sm">Target Role: <strong>{selectedPlan.target_role}</strong></span>
                  </div>
                )}

                {selectedPlan?.target_date && (
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Target Date: {new Date(selectedPlan.target_date).toLocaleDateString()}</span>
                  </div>
                )}

                <p className="text-sm text-gray-600 mb-6">
                  {selectedPlan?.overview}
                </p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                    <span className="text-sm font-bold text-indigo-600">
                      {calculateProgress(selectedPlan?.actions || [])}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all"
                      style={{ width: `${calculateProgress(selectedPlan?.actions || [])}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {selectedPlan?.actions?.length || 0}
                    </div>
                    <div className="text-xs text-gray-600">Total Actions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedPlan?.actions?.filter(a => a.status === 'in_progress').length || 0}
                    </div>
                    <div className="text-xs text-gray-600">In Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedPlan?.actions?.filter(a => a.status === 'completed').length || 0}
                    </div>
                    <div className="text-xs text-gray-600">Completed</div>
                  </div>
                </div>

                {selectedPlan?.manager_name && (
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-xs text-gray-500">Managed by</p>
                    <p className="text-sm font-medium text-gray-900">{selectedPlan.manager_name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Development Actions */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">Development Actions</h3>
                <p className="text-sm text-gray-600">Track your progress on each development activity</p>
              </div>

              <div className="space-y-4">
                {selectedPlan?.actions?.map((action) => (
                  <div
                    key={action.id}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          {getActionIcon(action.action_type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-indigo-600 px-2 py-1 bg-indigo-50 rounded">
                              {formatActionType(action.action_type)}
                            </span>
                            {action.target_date && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(action.target_date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(action.status)}
                        <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(action.status)}`}>
                          {action.status?.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {action.progress_notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs font-medium text-gray-700 mb-1">Progress Notes</p>
                        <p className="text-sm text-gray-600">{action.progress_notes}</p>
                      </div>
                    )}

                    {/* LinkedIn Learning Courses */}
                    {(() => {
                      const courses = getCoursesForAction(action);
                      if (courses.length === 0) return null;
                      
                      const isExpanded = expandedActions[action.id];
                      const displayCourses = isExpanded ? courses : courses.slice(0, 2);
                      
                      return (
                        <div className="mt-4 border-t pt-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-5 h-5 text-indigo-600" />
                              <h5 className="font-semibold text-gray-900">LinkedIn Learning Courses</h5>
                              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                                {courses.length} recommended
                              </span>
                            </div>
                            {courses.length > 2 && (
                              <button
                                onClick={() => toggleActionCourses(action.id)}
                                className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="w-3 h-3" />
                                    Show less
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-3 h-3" />
                                    Show all {courses.length}
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            {displayCourses.map((course) => (
                              <div
                                key={course.id}
                                className="p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg hover:shadow-md transition border border-indigo-100"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h6 className="font-medium text-gray-900 text-sm">{course.title}</h6>
                                      <span className={`text-xs px-2 py-0.5 rounded ${getLevelBadgeColor(course.level)}`}>
                                        {course.level}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-600 mb-2">{course.description}</p>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                      <span className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        {course.instructor}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {course.duration}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {course.skills.slice(0, 3).map((skill, idx) => (
                                        <span
                                          key={idx}
                                          className="text-xs bg-white text-indigo-600 px-2 py-0.5 rounded border border-indigo-200"
                                        >
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => window.open(`https://www.linkedin.com/learning/search?keywords=${encodeURIComponent(course.title)}`, '_blank')}
                                    className="flex-shrink-0 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                    title="View on LinkedIn Learning"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => alert('Update progress feature coming soon!')}
                        className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition font-medium"
                      >
                        Update Progress
                      </button>
                      {action.status !== 'completed' && (
                        <button
                          onClick={() => alert('Mark as complete feature coming soon!')}
                          className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition font-medium"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LinkedIn Learning Library - Full Catalog */}
            {selectedPlan && (
              <div className="lg:col-span-3 mt-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <GraduationCap className="w-6 h-6 text-indigo-600" />
                        LinkedIn Learning Library
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Comprehensive course catalog tailored for your {selectedPlan.target_role || 'career'} development
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAllCourses(!showAllCourses)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
                    >
                      {showAllCourses ? 'Show Recommended' : 'Show All Focus Areas'}
                    </button>
                  </div>

                  {/* Focus Area Filters */}
                  {showAllCourses && (
                    <div className="mb-6 flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedFocusArea(null)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition ${
                          selectedFocusArea === null
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        All Areas
                      </button>
                      {getAllFocusAreas().map((area) => (
                        <button
                          key={area.id}
                          onClick={() => setSelectedFocusArea(area.id)}
                          className={`px-3 py-1.5 text-sm rounded-lg transition ${
                            selectedFocusArea === area.id
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {area.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Display Focus Areas */}
                  <div className="space-y-6">
                    {(() => {
                      const focusAreas = showAllCourses
                        ? (selectedFocusArea 
                            ? getAllFocusAreas().filter(fa => fa.id === selectedFocusArea)
                            : getAllFocusAreas())
                        : getRecommendedFocusAreas();

                      return focusAreas.map((focusArea) => (
                        <div key={focusArea.id} className="border-b pb-6 last:border-0">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">{focusArea.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{focusArea.description}</p>
                            </div>
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
                              {focusArea.courses.length} courses
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {focusArea.courses.map((course) => (
                              <div
                                key={course.id}
                                className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition"
                              >
                                <div className="flex items-start justify-between gap-3 mb-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <BookOpen className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                                      <h5 className="font-semibold text-gray-900 text-sm">{course.title}</h5>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded ${getLevelBadgeColor(course.level)}`}>
                                      {course.level}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => window.open(`https://www.linkedin.com/learning/search?keywords=${encodeURIComponent(course.title)}`, '_blank')}
                                    className="flex-shrink-0 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                    title="View on LinkedIn Learning"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </button>
                                </div>
                                
                                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                                
                                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {course.instructor}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {course.duration}
                                  </span>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                  {course.skills.map((skill, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-200"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
