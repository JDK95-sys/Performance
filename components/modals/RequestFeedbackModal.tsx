/**
 * Request Feedback Modal Component
 * Allows users to request feedback from colleagues
 */

'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface RequestFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RequestFeedbackModal({ isOpen, onClose, onSuccess }: RequestFeedbackModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [colleagues, setColleagues] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    from_user_id: '',
    feedback_type: 'request',
    category: 'general',
    message: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchColleagues();
    }
  }, [isOpen]);

  const fetchColleagues = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setColleagues(data.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch colleagues:', err);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/performance/feedback/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to request feedback');
      }

      // Success
      onSuccess?.();
      onClose();
      setFormData({
        from_user_id: '',
        feedback_type: 'request',
        category: 'general',
        message: '',
      });
    } catch (err: any) {
      setError(err.message);
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
            <h2 className="text-2xl font-bold text-gray-900">Request Feedback</h2>
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
              💡 Request constructive feedback from colleagues to improve your performance and grow professionally.
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
            {/* Select Colleague */}
            <div>
              <label htmlFor="from_user_id" className="block text-sm font-medium text-gray-700 mb-2">
                Request From <span className="text-red-500">*</span>
              </label>
              <select
                id="from_user_id"
                name="from_user_id"
                value={formData.from_user_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                required
              >
                <option value="">Select a colleague...</option>
                {colleagues.map((colleague) => (
                  <option key={colleague.id} value={colleague.id}>
                    {colleague.name} - {colleague.title} ({colleague.department})
                  </option>
                ))}
              </select>
            </div>

            {/* Feedback Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Feedback Category <span className="text-red-500">*</span>
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
                <option value="teamwork">Teamwork & Collaboration</option>
                <option value="leadership">Leadership</option>
                <option value="problem-solving">Problem Solving</option>
                <option value="project">Project Work</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Add a note about what you'd like feedback on (e.g., 'I'd appreciate feedback on my presentation skills during the last team meeting')"
              />
              <p className="mt-2 text-xs text-gray-500">
                This message will be included in the feedback request notification.
              </p>
            </div>

            {/* Helpful Tips */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Tips for effective feedback:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Be specific about what you want feedback on</li>
                <li>• Request feedback from people who worked closely with you</li>
                <li>• Choose different categories to get well-rounded insights</li>
                <li>• Be open to constructive criticism</li>
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
                {loading ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
