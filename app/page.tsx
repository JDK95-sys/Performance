'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

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
      if (role === 'employee') {
        router.push('/employee');
      } else if (role === 'manager') {
        router.push('/manager');
      } else if (role === 'hr' || role === 'recruiter') {
        router.push('/recruiter'); // HR dashboard
      } else {
        setError('Unknown role: ' + role);
        return;
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/30 to-transparent rounded-full blur-3xl float"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-400/30 to-transparent rounded-full blur-3xl float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-transparent rounded-full blur-3xl float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="max-w-md w-full relative z-10 animate-fade-in-up">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white/10 backdrop-blur-lg rounded-2xl mb-4 transition-all duration-300 hover:scale-110 hover:bg-white/20 animate-scale-in">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight animate-fade-in">PerformPro</h1>
          <p className="text-white/90 text-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>AI-Powered Performance Management</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 animate-scale-in hover:shadow-glow-lg transition-all duration-300">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600">Sign in to access your performance dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Work Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white hover:border-indigo-300 focus:scale-[1.02]"
                placeholder="your.email@company.com"
                required
                autoComplete="email"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2 animate-fade-in-up">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] font-medium shadow-lg hover:shadow-glow shimmer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign in with SSO'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Quick Demo Access:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setEmail('john.smith@company.com')}
                className="px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md"
              >
                👨‍💼 Employee
              </button>
              <button
                onClick={() => setEmail('manager@company.com')}
                className="px-3 py-2 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md"
              >
                👔 Manager
              </button>
              <button
                onClick={() => setEmail('admin@company.com')}
                className="px-3 py-2 text-xs font-medium text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md"
              >
                💼 HR Admin
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Integrates with SAP, Workday, BambooHR, Deel & more
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="text-white/90 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-2xl font-bold transition-all duration-300 hover:scale-110">50+</div>
            <div className="text-sm text-white/70">Skills Tracked</div>
          </div>
          <div className="text-white/90 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-2xl font-bold transition-all duration-300 hover:scale-110">AI</div>
            <div className="text-sm text-white/70">Powered Matching</div>
          </div>
          <div className="text-white/90 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-2xl font-bold transition-all duration-300 hover:scale-110">100%</div>
            <div className="text-sm text-white/70">Internal Mobility</div>
          </div>
        </div>

        {/* Creator Credit */}
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p className="text-sm text-white/80">
            Created by <span className="font-semibold">Jonathan De Kryger</span>
          </p>
          <p className="text-xs text-white/60 mt-1">© {new Date().getFullYear()} PerformPro</p>
        </div>
      </div>
    </div>
  );
}
