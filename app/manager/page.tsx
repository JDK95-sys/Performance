'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate, getStatusColor, getFlightRiskColor } from '@/lib/utils';

export default function ManagerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [team, setTeam] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'team' | 'applications'>('team');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userRes, teamRes, appsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/manager/team'),
        fetch('/api/applications'),
      ]);

      if (!userRes.ok) {
        router.push('/');
        return;
      }

      const userData = await userRes.json();
      if (userData.user.role !== 'manager') {
        router.push(`/${userData.user.role}`);
        return;
      }

      setUser(userData.user);
      setTeam((await teamRes.json()).team || []);
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

  const handleApproveApplication = async (appId: number, approved: boolean) => {
    try {
      const response = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: approved ? 'approved' : 'rejected',
          notes: approved ? 'Approved by manager' : 'Not approved at this time',
        }),
      });

      if (response.ok) {
        alert(`Application ${approved ? 'approved' : 'rejected'} successfully`);
        loadData();
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Failed to update application');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const pendingApprovals = applications.filter(a =>
    ['submitted', 'under_review', 'interviewing'].includes(a.status)
  ).length;

  const highRiskTeam = team.filter(m => m.flightRisk?.riskLevel === 'high').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
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
            <div className="text-sm font-medium text-gray-600">Team Members</div>
            <div className="text-3xl font-bold text-primary-600 mt-2">{team.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Pending Approvals</div>
            <div className="text-3xl font-bold text-yellow-600 mt-2">{pendingApprovals}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Flight Risk (High)</div>
            <div className="text-3xl font-bold text-red-600 mt-2">{highRiskTeam}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { key: 'team', label: 'Team Overview', count: team.length },
                { key: 'applications', label: 'Transfer Requests', count: applications.length },
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
            {/* Team Overview Tab */}
            {activeTab === 'team' && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Your Team</h3>
                  <p className="text-sm text-gray-600">Career development and retention insights</p>
                </div>
                {team.map((member) => (
                  <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.job_title} • {member.department}</p>
                      </div>
                      {member.flightRisk && (
                        <div className="text-right">
                          <div className={`text-sm font-semibold ${getFlightRiskColor(member.flightRisk.riskLevel)}`}>
                            {member.flightRisk.riskLevel.toUpperCase()} RISK
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Career Goals */}
                    {member.careerGoals && (
                      <div className="bg-blue-50 rounded p-3 mb-3">
                        <div className="text-xs font-semibold text-blue-900 mb-1">Career Aspirations:</div>
                        <div className="text-sm text-blue-800">
                          {member.careerGoals.desired_role && (
                            <div>Target Role: {member.careerGoals.desired_role}</div>
                          )}
                          {member.careerGoals.target_timeframe && (
                            <div>Timeframe: {member.careerGoals.target_timeframe}</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Recent Activity */}
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Recent Applications:</span>{' '}
                        <span className="font-medium">{member.recentApplications || 0}</span>
                      </div>
                      {member.latestReview && (
                        <div>
                          <span className="text-gray-600">Performance Rating:</span>{' '}
                          <span className="font-medium">{member.latestReview.rating}/5</span>
                        </div>
                      )}
                    </div>

                    {/* AI Recommendations */}
                    {member.flightRisk && member.flightRisk.recommendations.length > 0 && (
                      <div className="bg-yellow-50 rounded p-3">
                        <div className="text-xs font-semibold text-yellow-900 mb-1">
                          Retention Recommendations:
                        </div>
                        <ul className="text-xs text-yellow-800 space-y-1">
                          {member.flightRisk.recommendations.map((rec: string, idx: number) => (
                            <li key={idx}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Transfer Requests</h3>
                  <p className="text-sm text-gray-600">Review and approve internal mobility requests</p>
                </div>
                {applications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No transfer requests at this time
                  </div>
                ) : (
                  applications.map((app) => (
                    <div key={app.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{app.candidate_name}</h4>
                          <p className="text-sm text-gray-600">Applied for: {app.job_title}</p>
                          <p className="text-sm text-gray-600">{app.department}</p>
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
                            <span className="font-semibold text-primary-600">
                              {Math.round(app.match_score)}%
                            </span>
                          </div>
                        </div>
                      )}

                      {!['approved', 'rejected', 'withdrawn'].includes(app.status) && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveApplication(app.id, true)}
                            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Approve Transfer
                          </button>
                          <button
                            onClick={() => handleApproveApplication(app.id, false)}
                            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      {app.manager_approved && (
                        <div className="mt-2 text-sm text-green-600">
                          ✓ Approved on {formatDate(app.manager_approved_at)}
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
