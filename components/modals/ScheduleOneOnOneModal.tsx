/**
 * Schedule One-on-One Modal Component
 * Allows managers to schedule 1:1 meetings with team members
 */

'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Clock } from 'lucide-react';

interface ScheduleOneOnOneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  teamMember?: {
    id: number;
    name: string;
    title: string;
  };
}

export default function ScheduleOneOnOneModal({ isOpen, onClose, onSuccess, teamMember }: ScheduleOneOnOneModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    employee_id: teamMember?.id || '',
    scheduled_date: '',
    scheduled_time: '',
    duration_minutes: 30,
    agenda: '',
    topics_discussed: '',
    employee_notes: ''
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
      // Prevent body scroll when modal is open
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
      // Combine date and time
      const scheduledDateTime = `${formData.scheduled_date}T${formData.scheduled_time}:00`;

      const response = await fetch('/api/performance/one-on-ones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: formData.employee_id,
          scheduled_date: scheduledDateTime,
          duration_minutes: formData.duration_minutes,
          agenda: formData.agenda,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to schedule 1:1 meeting');
      }

      // Success
      onSuccess?.();
      onClose();
      setFormData({
        employee_id: teamMember?.id || '',
        scheduled_date: '',
        scheduled_time: '',
        duration_minutes: 30,
        agenda: '',
        topics_discussed: '',
        employee_notes: ''
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

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

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
                <Calendar className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Schedule 1:1 Meeting</h2>
                {teamMember && (
                  <p className="text-sm text-gray-600">With: {teamMember.name} ({teamMember.title})</p>
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
              💡 Regular 1:1s are essential for building trust, providing feedback, and supporting your team member&apos;s growth.
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
            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="scheduled_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="scheduled_date"
                  name="scheduled_date"
                  value={formData.scheduled_date}
                  onChange={handleChange}
                  min={today}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>
              <div>
                <label htmlFor="scheduled_time" className="block text-sm font-medium text-gray-700 mb-2">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="scheduled_time"
                  name="scheduled_time"
                  value={formData.scheduled_time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-700 mb-2">
                Duration <span className="text-red-500">*</span>
              </label>
              <select
                id="duration_minutes"
                name="duration_minutes"
                value={formData.duration_minutes}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                required
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>

            {/* Agenda */}
            <div>
              <label htmlFor="agenda" className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Agenda
              </label>
              <textarea
                id="agenda"
                name="agenda"
                value={formData.agenda}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="What would you like to discuss? e.g.:
• Check-in on current projects
• Career development goals
• Any blockers or concerns
• Feedback and recognition"
              />
              <p className="mt-2 text-xs text-gray-500">
                This will be shared with your team member in advance
              </p>
            </div>

            {/* Meeting Tips */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Effective 1:1 Meeting Tips:
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>✓ Block dedicated time - avoid rescheduling when possible</li>
                <li>✓ Let your team member drive the conversation</li>
                <li>✓ Focus on coaching, not status updates</li>
                <li>✓ Take notes and follow up on action items</li>
                <li>✓ Create a safe space for honest feedback</li>
                <li>✓ End with clear next steps</li>
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
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                {loading ? 'Scheduling...' : 'Schedule Meeting'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
