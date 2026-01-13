'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate, getStatusColor, getMatchScoreColor } from '@/lib/utils';

export default function RecruiterDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications' | 'create'>('jobs');
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    location: 'Remote',
    description: '',
    requirements: '',
    responsibilities: '',
    employment_type: 'full-time',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userRes, jobsRes, appsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/jobs'),
        fetch('/api/applications'),
      ]);

      if (!userRes.ok) {
        router.push('/');
        return;
      }

      const userData = await userRes.json();
      if (userData.user.role !== 'recruiter') {
        router.push(`/${userData.user.role}`);
        return;
      }

      setUser(userData.user);
      setJobs((await jobsRes.json()).jobs || []);
      setApplications((await appsRes.json()).applications || []);
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

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob),
      });

      if (response.ok) {
        alert('Job created successfully!');
        setShowCreateForm(false);
        setNewJob({
          title: '',
          department: '',
          location: 'Remote',
          description: '',
          requirements: '',
          responsibilities: '',
          employment_type: 'full-time',
        });
        loadData();
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Failed to create job');
    }
  };

  const handleUpdateApplicationStatus = async (appId: number, status: string) => {
    try {
      const response = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        alert('Application updated successfully');
        loadData();
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Failed to update application');
    }
  };

  const loadJobMatches = async (jobId: number) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/matches`);
      const data = await response.json();
      setMatches(data.matches || []);
      setSelectedJob(jobId);
    } catch (error) {
      console.error('Error loading matches:', error);
    }
  };

  const syncSuccessFactors = async () => {
    if (!confirm('Sync employee data from SAP SuccessFactors? This may take a few minutes.')) {
      return;
    }

    try {
      const response = await fetch('/api/sync/successfactors', { method: 'POST' });
      const data = await response.json();

      if (response.ok) {
        alert(`Sync completed! ${data.synced} employees synced, ${data.errors} errors`);
        loadData();
      } else {
        alert(`Sync failed: ${data.error}`);
      }
    } catch (error) {
      alert('Failed to sync with SuccessFactors');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const openJobs = jobs.filter(j => j.status === 'open').length;
  const pendingApplications = applications.filter(a => a.status === 'submitted').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={syncSuccessFactors}
                className="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100"
              >
                Sync SuccessFactors
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Total Jobs</div>
            <div className="text-3xl font-bold text-primary-600 mt-2">{jobs.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Open Positions</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{openJobs}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Total Applications</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">{applications.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Pending Review</div>
            <div className="text-3xl font-bold text-yellow-600 mt-2">{pendingApplications}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { key: 'jobs', label: 'Job Postings', count: jobs.length },
                { key: 'applications', label: 'Applications', count: applications.length },
                { key: 'create', label: 'Create Job', count: null },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key as any);
                    if (tab.key === 'create') setShowCreateForm(true);
                  }}
                  className={`px-6 py-4 text-sm font-medium border-b-2 ${
                    activeTab === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} {tab.count !== null && `(${tab.count})`}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Job Postings</h3>
                  <p className="text-sm text-gray-600">Manage internal job opportunities</p>
                </div>
                {jobs.map((job) => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.department} • {job.location}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-3">
                      Posted: {formatDate(job.created_at)} by {job.posted_by_name}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Applications:</span>{' '}
                        <span className="font-medium">
                          {applications.filter(a => a.job_id === job.id).length}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Positions:</span>{' '}
                        <span className="font-medium">{job.positions_available || 1}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => loadJobMatches(job.id)}
                      className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      View AI-Matched Candidates
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
                  <p className="text-sm text-gray-600">Review and manage candidate applications</p>
                </div>
                {applications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No applications yet
                  </div>
                ) : (
                  applications.map((app) => (
                    <div key={app.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{app.candidate_name}</h4>
                          <p className="text-sm text-gray-600">{app.candidate_email}</p>
                          <p className="text-sm text-gray-600 mt-1">Applied for: {app.job_title}</p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(app.status)}`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        Applied: {formatDate(app.created_at)}
                      </div>

                      {app.match_score && (
                        <div className="bg-gray-50 rounded p-3 mb-3">
                          <div className="text-sm">
                            AI Match Score:{' '}
                            <span className={`text-lg font-bold ${getMatchScoreColor(app.match_score)}`}>
                              {Math.round(app.match_score)}%
                            </span>
                          </div>
                        </div>
                      )}

                      {app.status === 'submitted' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateApplicationStatus(app.id, 'under_review')}
                            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm"
                          >
                            Review
                          </button>
                          <button
                            onClick={() => handleUpdateApplicationStatus(app.id, 'interviewing')}
                            className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-sm"
                          >
                            Interview
                          </button>
                          <button
                            onClick={() => handleUpdateApplicationStatus(app.id, 'rejected')}
                            className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {app.status === 'under_review' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateApplicationStatus(app.id, 'interviewing')}
                            className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-sm"
                          >
                            Move to Interview
                          </button>
                          <button
                            onClick={() => handleUpdateApplicationStatus(app.id, 'rejected')}
                            className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {app.status === 'interviewing' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateApplicationStatus(app.id, 'approved')}
                            className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateApplicationStatus(app.id, 'rejected')}
                            className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Create Job Tab */}
            {activeTab === 'create' && showCreateForm && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Job Posting</h3>
                <form onSubmit={handleCreateJob} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                      <input
                        type="text"
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <input
                        type="text"
                        value={newJob.department}
                        onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={newJob.location}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                      <select
                        value={newJob.employment_type}
                        onChange={(e) => setNewJob({ ...newJob, employment_type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newJob.description}
                      onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                    <textarea
                      value={newJob.requirements}
                      onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
                    <textarea
                      value={newJob.responsibilities}
                      onChange={(e) => setNewJob({ ...newJob, responsibilities: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                    >
                      Create Job Posting
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* AI Matches Modal */}
        {selectedJob && matches.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">AI-Matched Candidates</h3>
                <button
                  onClick={() => {
                    setSelectedJob(null);
                    setMatches([]);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {matches.map(({ candidate, matchScore }) => (
                  <div key={candidate.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{candidate.name}</h4>
                        <p className="text-sm text-gray-600">{candidate.job_title} • {candidate.department}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getMatchScoreColor(matchScore.overallScore)}`}>
                          {Math.round(matchScore.overallScore)}%
                        </div>
                        <div className="text-xs text-gray-500">Match Score</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm mb-2">
                      <div>
                        <span className="text-gray-600">Skills:</span>{' '}
                        <span className="font-medium">{Math.round(matchScore.skillsScore)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Experience:</span>{' '}
                        <span className="font-medium">{Math.round(matchScore.experienceScore)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Dept Match:</span>{' '}
                        <span className="font-medium">{Math.round(matchScore.departmentScore)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Potential:</span>{' '}
                        <span className="font-medium">{Math.round(matchScore.potentialScore)}%</span>
                      </div>
                    </div>

                    {matchScore.matchingSkills.length > 0 && (
                      <div className="text-sm mb-2">
                        <span className="font-medium text-gray-700">Matching Skills:</span>{' '}
                        {matchScore.matchingSkills.slice(0, 5).map((s: any) => s.name).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
