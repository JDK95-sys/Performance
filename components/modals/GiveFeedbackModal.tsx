/**
 * Give Feedback Modal Component
 * Allows managers to give feedback to team members
 */

'use client';

import { useState, useEffect } from 'react';
import { X, MessageSquare } from 'lucide-react';

interface GiveFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  teamMember?: {
    id: number;
    name: string;
    title: string;
  };
}

export default function GiveFeedbackModal({ isOpen, onClose, onSuccess, teamMember }: GiveFeedbackModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    to_user_id: teamMember?.id || '',
    feedback_type: 'positive',
    category: 'general',
    content: '',
    visibility: 'private',
    is_anonymous: false
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
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, loading]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/performance/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit feedback');
      }

      // Success
      onSuccess?.();
      onClose();
      setFormData({
        to_user_id: teamMember?.id || '',
        feedback_type: 'positive',
        category: 'general',
        content: '',
        visibility: 'private',
        is_anonymous: false
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
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
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Give Feedback</h2>
                {teamMember && (
                  <p className="text-sm text-gray-600">To: {teamMember.name} ({teamMember.title})</p>
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
            <p className="text-sm text-blue-800">
              💡 Provide specific, actionable feedback to help your team member grow. Focus on behaviors and outcomes, not personality.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Feedback Type */}
            <div>
              <label htmlFor="feedback_type" className="block text-sm font-medium text-gray-700 mb-2">
                Feedback Type <span className="text-red-500">*</span>
              </label>
              <select
                id="feedback_type"
                name="feedback_type"
                value={formData.feedback_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                required
              >
                <option value="positive">Positive / Recognition</option>
                <option value="constructive">Constructive</option>
                <option value="coaching">Coaching</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Choose the type that best matches your feedback
              </p>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                required
              >
                <option value="general">General Performance</option>
                <option value="technical">Technical Skills</option>
                <option value="communication">Communication</option>
                <option value="collaboration">Teamwork & Collaboration</option>
                <option value="leadership">Leadership</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Feedback <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Be specific about what you observed and the impact it had..."
                required
              />
              <p className="mt-2 text-xs text-gray-500">
                Use the SBI framework: Situation - Behavior - Impact
              </p>
            </div>

            {/* Visibility */}
            <div>
              <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-2">
                Visibility
              </label>
              <select
                id="visibility"
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="private">Private (only visible to recipient)</option>
                <option value="manager">Manager visible</option>
                <option value="public">Public (visible to team)</option>
              </select>
            </div>

            {/* Guidelines */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Effective Feedback Guidelines:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>✓ Be specific and provide examples</li>
                <li>✓ Focus on observable behaviors</li>
                <li>✓ Explain the impact of the behavior</li>
                <li>✓ Suggest actionable improvements (for constructive feedback)</li>
                <li>✓ Balance positive with constructive feedback</li>
              </ul>
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
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
