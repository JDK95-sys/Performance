'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      // Redirect based on role
      const role = data.user.role;
      if (role === 'candidate') {
        router.push('/candidate');
      } else if (role === 'manager') {
        router.push('/manager');
      } else if (role === 'recruiter') {
        router.push('/recruiter');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Internal Job Marketplace</h1>
          <p className="text-gray-600">AI-Powered Talent Mobility Platform</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="your.email@company.com"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign in with SSO'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">Demo accounts:</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Candidate:</span>
              <button
                onClick={() => setEmail('candidate@company.com')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                candidate@company.com
              </button>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Manager:</span>
              <button
                onClick={() => setEmail('manager@company.com')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                manager@company.com
              </button>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Recruiter:</span>
              <button
                onClick={() => setEmail('recruiter@company.com')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                recruiter@company.com
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Integrated with SAP SuccessFactors</p>
          <p className="mt-1">Secure SSO Authentication</p>
        </div>
      </div>
    </div>
  );
}
