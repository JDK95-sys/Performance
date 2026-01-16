/**
 * Create Review Modal Component
 * Allows managers to initiate performance review process
 * Note: In production, this would integrate with review cycles managed by HR
 */

'use client';

import { useState, useEffect } from 'react';
import { X, Star, AlertCircle } from 'lucide-react';

interface CreateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  teamMember?: {
    id: number;
    name: string;
    title: string;
  };
}

export default function CreateReviewModal({ isOpen, onClose, onSuccess, teamMember }: CreateReviewModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    cycle_id: '',
    employee_id: teamMember?.id || '',
    manager_id: '', // Will be set from current user
    review_type: 'manager'
  });

  // ESC key handler for accessibility
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      fetchCurrentUser();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, loading]);

  // Update employee_id when teamMember changes
  useEffect(() => {
    if (teamMember?.id) {
      setFormData(prev => ({
        ...prev,
        employee_id: teamMember.id
      }));
    }
  }, [teamMember]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          manager_id: data.user.id
        }));
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/performance/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create review');
      }

      // Success
      onSuccess?.();
      onClose();
      // Reset form
      setFormData({
        cycle_id: '',
        employee_id: teamMember?.id || '',
        manager_id: formData.manager_id,
        review_type: 'manager'
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Initiate Performance Review</h2>
                {teamMember && (
                  <p className="text-sm text-gray-600">For: {teamMember.name} ({teamMember.title})</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Info Banner */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Review Creation Workflow</p>
                <p>Performance reviews are typically managed through review cycles set up by HR. This feature allows you to prepare for upcoming reviews or request a review to be created.</p>
                <p className="mt-2">For immediate review needs, please contact your HR team to set up a review cycle.</p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Review Creation Failed</p>
                  <p>{error}</p>
                  {error.includes('Only HR') && (
                    <p className="mt-2">Please contact your HR team to create a review cycle and initiate reviews.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Review Type */}
            <div>
              <label htmlFor="review_type" className="block text-sm font-medium text-gray-700 mb-2">
                Review Type <span className="text-red-500">*</span>
              </label>
              <select
                id="review_type"
                name="review_type"
                value={formData.review_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                required
              >
                <option value="manager">Manager Review</option>
                <option value="self">Self Review</option>
                <option value="peer">Peer Review</option>
                <option value="360">360 Review</option>
                <option value="probation">Probation Review</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Select the type of performance review
              </p>
            </div>

            {/* Review Guidelines */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-blue-600" />
                Effective Performance Reviews:
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>✓ Prepare specific examples of achievements and areas for growth</li>
                <li>✓ Review feedback received throughout the review period</li>
                <li>✓ Consider goal completion rates and overall impact</li>
                <li>✓ Provide actionable development recommendations</li>
                <li>✓ Discuss career aspirations and growth opportunities</li>
                <li>✓ Be honest, fair, and supportive in your assessment</li>
              </ul>
            </div>

            {/* Alternative Action */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Alternative Actions</h4>
              <p className="text-xs text-gray-600 mb-3">
                While waiting for formal review cycles, you can take these actions:
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm text-left"
                  title="Close this modal and use the Give Feedback button"
                >
                  💬 Give Continuous Feedback Instead
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm text-left"
                  title="Close this modal and use the Schedule 1:1 button"
                >
                  📅 Schedule 1:1 Meeting Instead
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full px-4 py-2 bg-indigo-50 border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-100 transition font-medium text-sm text-left"
                  title="Contact HR via your organization's channels"
                >
                  📧 Contact HR About Review Cycles
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Star className="w-4 h-4" />
                {loading ? 'Creating...' : 'Initiate Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
