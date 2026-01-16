'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Target,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  BookOpen,
  Users,
  BarChart3,
  Map,
  ChevronRight,
  Star,
  Zap
} from 'lucide-react';
import Footer from '@/components/Footer';

interface UserSkill {
  skillName: string;
  category: string;
  currentLevel: number;
  yearsExperience: number;
  endorsedCount: number;
}

interface SkillGap {
  skillName: string;
  category: string;
  requiredLevel: number;
  currentLevel: number;
  gap: number;
  priority: 'critical' | 'important' | 'nice-to-have';
  status: 'proficient' | 'developing' | 'needs-development' | 'missing';
}

interface CareerPathData {
  currentRole: string;
  targetRole: string;
  timeframe: string;
  overallReadiness: number;
  currentSkills: UserSkill[];
  requiredSkills: any[];
  skillGaps: SkillGap[];
  strengths: string[];
  developmentAreas: string[];
  nextSteps: string[];
}

export default function CareerPathPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [careerPath, setCareerPath] = useState<CareerPathData | null>(null);
  const [noGoal, setNoGoal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchCareerPath();
  }, []);

  const fetchCareerPath = async () => {
    try {
      const res = await fetch('/api/performance/career-path');
      if (res.ok) {
        const data = await res.json();
        if (data.careerPath) {
          setCareerPath(data.careerPath);
        } else {
          setNoGoal(true);
        }
      }
    } catch (error) {
      console.error('Error fetching career path:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      proficient: 'bg-green-100 text-green-800 border-green-200',
      developing: 'bg-blue-100 text-blue-800 border-blue-200',
      'needs-development': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      missing: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    const icons: any = {
      proficient: <CheckCircle2 className="w-4 h-4" />,
      developing: <Clock className="w-4 h-4" />,
      'needs-development': <AlertCircle className="w-4 h-4" />,
      missing: <Target className="w-4 h-4" />,
    };
    return icons[status] || <Target className="w-4 h-4" />;
  };

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      critical: 'text-red-600',
      important: 'text-orange-600',
      'nice-to-have': 'text-gray-600',
    };
    return colors[priority] || 'text-gray-600';
  };

  const getReadinessColor = (readiness: number) => {
    if (readiness >= 80) return 'text-green-600';
    if (readiness >= 60) return 'text-blue-600';
    if (readiness >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReadinessMessage = (readiness: number) => {
    if (readiness >= 80) return 'You\'re almost ready for this role!';
    if (readiness >= 60) return 'You\'re making good progress toward this goal';
    if (readiness >= 40) return 'You have foundational skills, focus on key gaps';
    return 'Significant development needed, but achievable with focus';
  };

  const getLevelLabel = (level: number) => {
    const labels = ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
    return labels[level] || 'Unknown';
  };

  const getCategories = () => {
    if (!careerPath) return [];
    const categories = new Set(careerPath.skillGaps.map(gap => gap.category));
    return Array.from(categories).sort();
  };

  const filteredGaps = careerPath?.skillGaps.filter(gap => 
    selectedCategory === 'all' || gap.category === selectedCategory
  ) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (noGoal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-indigo-100 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/employee')}
                className="p-2 hover:bg-indigo-50 rounded-lg transition"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Career Path Visualization</h1>
                <p className="text-sm text-gray-600">Map your journey to your dream role</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Map className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Set Your Career Goals</h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              To visualize your career path, you need to define your career aspirations. 
              Work with your manager to set a target role and timeframe.
            </p>
            <button
              onClick={() => router.push('/employee/development')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium inline-flex items-center gap-2"
            >
              <Target className="w-5 h-5" />
              View Development Plan
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-indigo-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/employee')}
              className="p-2 hover:bg-indigo-50 rounded-lg transition"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Career Path Visualization</h1>
              <p className="text-sm text-gray-600">Track your progress toward {careerPath?.targetRole}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Career Journey Overview */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center md:text-left">
              <p className="text-indigo-100 text-sm mb-2">Current Position</p>
              <h3 className="text-2xl font-bold">{careerPath?.currentRole}</h3>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <div className="w-16 h-1 bg-white/40"></div>
                <ChevronRight className="w-6 h-6" />
                <div className="w-16 h-1 bg-white/40"></div>
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-indigo-100 text-sm mb-2">Target Role</p>
              <h3 className="text-2xl font-bold">{careerPath?.targetRole}</h3>
              <p className="text-indigo-100 text-sm mt-1">{careerPath?.timeframe}</p>
            </div>
          </div>

          {/* Readiness Score */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6" />
                <h4 className="text-lg font-semibold">Overall Readiness</h4>
              </div>
              <span className="text-3xl font-bold">{careerPath?.overallReadiness}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 mb-2">
              <div
                className="bg-white h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${careerPath?.overallReadiness}%` }}
              ></div>
            </div>
            <p className="text-sm text-indigo-100">{getReadinessMessage(careerPath?.overallReadiness || 0)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Strengths */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Strengths</h3>
                <p className="text-xs text-gray-600">{careerPath?.strengths.length} proficient skills</p>
              </div>
            </div>
            <div className="space-y-2">
              {careerPath?.strengths.slice(0, 5).map((skill, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{skill}</span>
                </div>
              ))}
              {(careerPath?.strengths.length || 0) > 5 && (
                <p className="text-xs text-gray-500 mt-2">
                  +{(careerPath?.strengths.length || 0) - 5} more
                </p>
              )}
            </div>
          </div>

          {/* Development Areas */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-yellow-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Development Areas</h3>
                <p className="text-xs text-gray-600">{careerPath?.developmentAreas.length} skills to improve</p>
              </div>
            </div>
            <div className="space-y-2">
              {careerPath?.developmentAreas.slice(0, 5).map((skill, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                  <span className="text-gray-700">{skill}</span>
                </div>
              ))}
              {(careerPath?.developmentAreas.length || 0) > 5 && (
                <p className="text-xs text-gray-500 mt-2">
                  +{(careerPath?.developmentAreas.length || 0) - 5} more
                </p>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-indigo-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Recommended Actions</h3>
                <p className="text-xs text-gray-600">Priority next steps</p>
              </div>
            </div>
            <div className="space-y-2">
              {careerPath?.nextSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <Zap className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skill Gap Analysis */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
                Skill Gap Analysis
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Compare your current skills with requirements for {careerPath?.targetRole}
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Skills ({careerPath?.skillGaps.length})
            </button>
            {getCategories().map((category) => {
              const count = careerPath?.skillGaps.filter(g => g.category === category).length || 0;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedCategory === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category} ({count})
                </button>
              );
            })}
          </div>

          {/* Skill Gap Cards */}
          <div className="space-y-4">
            {filteredGaps.map((gap, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900 text-lg">{gap.skillName}</h4>
                      <span className={`text-xs font-medium px-2 py-1 rounded border ${getStatusColor(gap.status)}`}>
                        {getStatusIcon(gap.status)}
                        <span className="ml-1">{gap.status.replace('-', ' ')}</span>
                      </span>
                      <span className={`text-xs font-medium ${getPriorityColor(gap.priority)}`}>
                        {gap.priority === 'critical' && <Star className="w-3 h-3 inline mr-1" />}
                        {gap.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{gap.category}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>Current: {getLevelLabel(gap.currentLevel)} (Level {gap.currentLevel})</span>
                    <span>Required: {getLevelLabel(gap.requiredLevel)} (Level {gap.requiredLevel})</span>
                  </div>
                  <div className="relative w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="absolute top-0 left-0 bg-indigo-600 h-3 rounded-full transition-all"
                      style={{ width: `${(gap.currentLevel / 5) * 100}%` }}
                    ></div>
                    <div
                      className="absolute top-0 left-0 border-2 border-indigo-300 bg-transparent h-3 rounded-full"
                      style={{ width: `${(gap.requiredLevel / 5) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Level 1</span>
                    <span>Level 2</span>
                    <span>Level 3</span>
                    <span>Level 4</span>
                    <span>Level 5</span>
                  </div>
                </div>

                {/* Action Items */}
                {gap.gap > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Recommended Action:</p>
                    <p className="text-sm text-gray-600">
                      {gap.status === 'missing' && `Begin learning ${gap.skillName} fundamentals through courses or workshops`}
                      {gap.status === 'needs-development' && `Focus on improving ${gap.skillName} through hands-on projects`}
                      {gap.status === 'developing' && `Practice ${gap.skillName} to reach expert level proficiency`}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 text-center">
          <BookOpen className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Start Your Journey?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Visit your development plan to find recommended courses, mentorship opportunities, 
            and projects aligned with your career goals.
          </p>
          <button
            onClick={() => router.push('/employee/development')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium inline-flex items-center gap-2"
          >
            <Target className="w-5 h-5" />
            View Development Plan
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
