'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CandidateDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Redirect candidates to the employee performance dashboard
    router.push('/employee');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
        <div className="text-xl font-medium text-gray-700">Redirecting to your dashboard...</div>
      </div>
    </div>
  );
}
