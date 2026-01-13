'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate, getStatusColor, getMatchScoreColor } from '@/lib/utils';

export default function CandidateDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'matches' | 'browse' | 'applications'>('matches');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userRes, jobsRes, appsRes, matchesRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/jobs?status=open'),
        fetch('/api/applications'),
        fetch('/api/candidate/matches'),
      ]);

      if (!userRes.ok) {
        router.push('/');
        return;
      }

      const userData = await userRes.json();
      if (userData.user.role !== 'candidate') {
        router.push(`/${userData.user.role}`);
        return;
      }

      setUser(userData.user);
      setJobs((await jobsRes.json()).jobs || []);
      setApplications((await appsRes.json()).applications || []);
      setMatches((await matchesRes.json()).matches || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const handleApply = async (jobId: number, job: any) => {
    if (confirm(`Apply for ${job.title}?`)) {
      try {
        const response = await fetch(`/api/jobs/${jobId}/apply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cover_letter: '' }),
        });

        if (response.ok) {
          alert('Application submitted successfully!');
          loadData();
        } else {
          const data = await response.json();
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        alert('Failed to submit application');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-xl font-medium text-gray-700">Loading your opportunities...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
                <p className="text-sm text-gray-600">{user?.job_title} • {user?.department}</p>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white/80 text-sm font-medium mb-1">AI-Matched Jobs</div>
                <div className="text-4xl font-bold">{matches.length}</div>
                <div className="text-white/70 text-xs mt-2">🎯 Personalized for you</div>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white/80 text-sm font-medium mb-1">Active Applications</div>
                <div className="text-4xl font-bold">
                  {applications.filter(a => !['approved', 'rejected', 'withdrawn'].includes(a.status)).length}
                </div>
                <div className="text-white/70 text-xs mt-2">📊 In progress</div>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white/80 text-sm font-medium mb-1">Open Positions</div>
                <div className="text-4xl font-bold">{jobs.length}</div>
                <div className="text-white/70 text-xs mt-2">🚀 Explore opportunities</div>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 mb-6 overflow-hidden">
          <div className="border-b border-gray-200/50">
            <nav className="flex -mb-px">
              {[
                { key: 'matches', label: '✨ AI Matches', count: matches.length },
                { key: 'browse', label: '🔍 Browse Jobs', count: jobs.length },
                { key: 'applications', label: '📋 My Applications', count: applications.length },
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
                  {tab.label} <span className="ml-1 text-xs opacity-75">({tab.count})</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* AI Matches Tab */}
            {activeTab === 'matches' && (
              <div className="space-y-4">
                {matches.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No AI matches yet</h3>
                    <p className="text-gray-600">Check back soon as we analyze new opportunities for you</p>
                  </div>
                ) : (
                  matches.map(({ job, matchScore }) => (
                    <div key={job.id} className="group bg-gradient-to-br from-white to-indigo-50/30 border-2 border-gray-200 hover:border-indigo-300 rounded-2xl p-6 transition-all hover:shadow-xl">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{job.title}</h4>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              {job.department}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {job.location}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-3xl font-black bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent`}>
                            {Math.round(matchScore.overallScore)}%
                          </div>
                          <div className="text-xs text-gray-500 font-medium">Match Score</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-3 mb-4">
                        {[
                          { label: 'Skills', value: matchScore.skillsScore, icon: '💡' },
                          { label: 'Experience', value: matchScore.experienceScore, icon: '🎓' },
                          { label: 'Department', value: matchScore.departmentScore, icon: '🏢' },
                          { label: 'Potential', value: matchScore.potentialScore, icon: '🚀' },
                        ].map((metric) => (
                          <div key={metric.label} className="bg-white/60 rounded-xl p-3 text-center">
                            <div className="text-sm text-gray-500 mb-1">{metric.icon} {metric.label}</div>
                            <div className="text-lg font-bold text-gray-900">{Math.round(metric.value)}%</div>
                          </div>
                        ))}
                      </div>

                      {matchScore.recommendations && matchScore.recommendations.length > 0 && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border border-blue-200">
                          <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <div className="text-xs font-semibold text-blue-900 mb-1">💡 AI Insights:</div>
                              <ul className="text-sm text-blue-800 space-y-1">
                                {matchScore.recommendations.slice(0, 2).map((rec: string, idx: number) => (
                                  <li key={idx}>• {rec}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => handleApply(job.id, job)}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] font-semibold shadow-lg flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Apply Now
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Browse Jobs Tab - Similar styling */}
            {activeTab === 'browse' && (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white border border-gray-200 hover:border-indigo-300 rounded-xl p-5 transition-all hover:shadow-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{job.title}</h4>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <span>{job.department}</span> • <span>{job.location}</span>
                        </p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">{job.description}</p>
                    <button
                      onClick={() => handleApply(job.id, job)}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium"
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div className="space-y-4">
                {applications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-600">Explore AI-matched jobs to get started!</p>
                    <button
                      onClick={() => setActiveTab('matches')}
                      className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
                    >
                      View AI Matches
                    </button>
                  </div>
                ) : (
                  applications.map((app) => (
                    <div key={app.id} className="bg-white border border-gray-200 rounded-xl p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{app.job_title}</h4>
                          <p className="text-sm text-gray-600">{app.department} • {app.location}</p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(app.status)}`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        Applied: {formatDate(app.created_at)}
                      </div>
                      {app.match_score && (
                        <div className="text-sm mt-2 flex items-center gap-2">
                          <span className="text-gray-600">Match Score:</span>
                          <span className={`font-bold text-lg ${getMatchScoreColor(app.match_score)}`}>
                            {Math.round(app.match_score)}%
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
