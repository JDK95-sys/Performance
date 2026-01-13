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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Candidate Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">AI-Matched Jobs</div>
            <div className="text-3xl font-bold text-primary-600 mt-2">{matches.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Active Applications</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">
              {applications.filter(a => !['approved', 'rejected', 'withdrawn'].includes(a.status)).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Open Positions</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{jobs.length}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { key: 'matches', label: 'AI Matches', count: matches.length },
                { key: 'browse', label: 'Browse Jobs', count: jobs.length },
                { key: 'applications', label: 'My Applications', count: applications.length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 ${
                    activeTab === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* AI Matches Tab */}
            {activeTab === 'matches' && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Top AI-Matched Opportunities</h3>
                  <p className="text-sm text-gray-600">Based on your skills, experience, and career goals</p>
                </div>
                {matches.map(({ job, matchScore }) => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.department} • {job.location}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getMatchScoreColor(matchScore.overallScore)}`}>
                          {Math.round(matchScore.overallScore)}%
                        </div>
                        <div className="text-xs text-gray-500">Match Score</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 my-3 text-sm">
                      <div>
                        <span className="text-gray-600">Skills:</span>{' '}
                        <span className="font-medium">{Math.round(matchScore.skillsScore)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Experience:</span>{' '}
                        <span className="font-medium">{Math.round(matchScore.experienceScore)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Potential:</span>{' '}
                        <span className="font-medium">{Math.round(matchScore.potentialScore)}%</span>
                      </div>
                    </div>

                    {matchScore.recommendations && matchScore.recommendations.length > 0 && (
                      <div className="bg-blue-50 rounded p-3 mb-3">
                        <div className="text-xs font-semibold text-blue-900 mb-1">AI Recommendations:</div>
                        <ul className="text-xs text-blue-800 space-y-1">
                          {matchScore.recommendations.slice(0, 2).map((rec: string, idx: number) => (
                            <li key={idx}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button
                      onClick={() => handleApply(job.id, job)}
                      className="w-full mt-3 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Browse Jobs Tab */}
            {activeTab === 'browse' && (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                    <h4 className="text-lg font-semibold text-gray-900">{job.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{job.department} • {job.location}</p>
                    <p className="text-sm text-gray-700 mb-3">{job.description?.substring(0, 200)}...</p>
                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                        {job.employment_type || 'Full-time'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleApply(job.id, job)}
                      className="w-full mt-3 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
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
                  <div className="text-center py-8 text-gray-500">
                    No applications yet. Explore AI-matched jobs to get started!
                  </div>
                ) : (
                  applications.map((app) => (
                    <div key={app.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{app.job_title}</h4>
                          <p className="text-sm text-gray-600">{app.department} • {app.location}</p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(app.status)}`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        Applied: {formatDate(app.created_at)}
                      </div>
                      {app.match_score && (
                        <div className="text-sm mt-2">
                          Match Score:{' '}
                          <span className={`font-semibold ${getMatchScoreColor(app.match_score)}`}>
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
