/**
 * Give Recognition Modal Component
 * Allows managers to give kudos and recognition to team members
 */

'use client';

import { useState } from 'react';
import { X, Award, Star } from 'lucide-react';

interface GiveRecognitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  teamMember?: {
    id: number;
    name: string;
    title: string;
  };
}

export default function GiveRecognitionModal({ isOpen, onClose, onSuccess, teamMember }: GiveRecognitionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    to_user_id: teamMember?.id || '',
    recognition_type: 'kudos',
    title: '',
    message: '',
    core_value: '',
    visibility: 'team'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/performance/recognition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit recognition');
      }

      // Success
      onSuccess?.();
      onClose();
      setFormData({
        to_user_id: teamMember?.id || '',
        recognition_type: 'kudos',
        title: '',
        message: '',
        core_value: '',
        visibility: 'team'
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Give Recognition</h2>
                {teamMember && (
                  <p className="text-sm text-gray-600">Recognizing: {teamMember.name} ({teamMember.title})</p>
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
          <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-800">
              🌟 Recognize great work publicly! Recognition boosts morale, reinforces positive behaviors, and strengthens team culture.
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
            {/* Recognition Type */}
            <div>
              <label htmlFor="recognition_type" className="block text-sm font-medium text-gray-700 mb-2">
                Recognition Type <span className="text-red-500">*</span>
              </label>
              <select
                id="recognition_type"
                name="recognition_type"
                value={formData.recognition_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                required
              >
                <option value="kudos">Kudos</option>
                <option value="thank_you">Thank You</option>
                <option value="award">Award</option>
                <option value="milestone">Milestone Celebration</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Recognition Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                placeholder="e.g., Exceptional Client Presentation"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Keep it concise and specific
              </p>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Recognition Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Describe what they did and why it matters. Be specific about the impact..."
                required
              />
              <p className="mt-2 text-xs text-gray-500">
                Great recognition is specific, timely, and explains the impact
              </p>
            </div>

            {/* Core Value */}
            <div>
              <label htmlFor="core_value" className="block text-sm font-medium text-gray-700 mb-2">
                Core Value Demonstrated
              </label>
              <select
                id="core_value"
                name="core_value"
                value={formData.core_value}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="">Select a core value...</option>
                <option value="customer_obsession">Customer Obsession</option>
                <option value="ownership">Ownership</option>
                <option value="innovation">Innovation & Creativity</option>
                <option value="teamwork">Teamwork & Collaboration</option>
                <option value="excellence">Excellence & Quality</option>
                <option value="integrity">Integrity & Transparency</option>
                <option value="growth">Continuous Learning & Growth</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Linking to core values reinforces what behaviors matter most
              </p>
            </div>

            {/* Visibility */}
            <div>
              <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-2">
                Visibility <span className="text-red-500">*</span>
              </label>
              <select
                id="visibility"
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                required
              >
                <option value="private">Private (only recipient sees it)</option>
                <option value="team">Team (visible to immediate team)</option>
                <option value="department">Department (visible to entire department)</option>
                <option value="company">Company-Wide (visible to everyone)</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Public recognition has greater impact but ask if the person prefers private recognition
              </p>
            </div>

            {/* Recognition Tips */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-purple-600" />
                Effective Recognition Guidelines:
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>✓ Be specific about what they did</li>
                <li>✓ Explain the impact of their contribution</li>
                <li>✓ Give it soon after the achievement</li>
                <li>✓ Be genuine and heartfelt</li>
                <li>✓ Connect it to team/company goals when relevant</li>
                <li>✓ Make it public when appropriate (most people love public recognition!)</li>
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
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                {loading ? 'Sending...' : 'Give Recognition'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
