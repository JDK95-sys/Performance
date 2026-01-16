/**
 * Assign Goal Modal Component
 * Allows managers to assign goals to team members
 */

'use client';

import { useState, useEffect } from 'react';
import { X, Target } from 'lucide-react';

interface AssignGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  teamMember?: {
    id: number;
    name: string;
    title: string;
  };
}

export default function AssignGoalModal({ isOpen, onClose, onSuccess, teamMember }: AssignGoalModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    owner_id: teamMember?.id || '',
    title: '',
    description: '',
    goal_type: 'performance',
    category: 'professional',
    start_date: '',
    due_date: '',
    quarter: '',
    priority: 'medium',
    visibility: 'team',
    weight: 1.0
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

  // Update owner_id when teamMember changes
  useEffect(() => {
    if (teamMember?.id) {
      setFormData(prev => ({
        ...prev,
        owner_id: teamMember.id
      }));
    }
  }, [teamMember]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/performance/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to assign goal');
      }

      // Success
      onSuccess?.();
      onClose();
      // Reset form
      setFormData({
        owner_id: teamMember?.id || '',
        title: '',
        description: '',
        goal_type: 'performance',
        category: 'professional',
        start_date: '',
        due_date: '',
        quarter: '',
        priority: 'medium',
        visibility: 'team',
        weight: 1.0
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'weight' ? parseFloat(value) || 1.0 : value
    });
  };

  // Get current quarter
  const getCurrentQuarter = () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const quarter = Math.ceil(month / 3);
    return `Q${quarter} ${year}`;
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
                <Target className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Assign Goal</h2>
                {teamMember && (
                  <p className="text-sm text-gray-600">Assigning to: {teamMember.name} ({teamMember.title})</p>
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
          <div className="mb-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="text-sm text-indigo-800">
              🎯 Set clear, measurable goals aligned with team objectives. Well-defined goals drive performance and career growth.
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
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Goal Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="e.g., Improve customer satisfaction score"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Describe the goal, expected outcomes, and success criteria..."
              />
            </div>

            {/* Goal Type & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="goal_type" className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="goal_type"
                  name="goal_type"
                  value={formData.goal_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                  required
                >
                  <option value="performance">Performance</option>
                  <option value="development">Development</option>
                  <option value="strategic">Strategic</option>
                  <option value="operational">Operational</option>
                </select>
              </div>

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
                  <option value="professional">Professional</option>
                  <option value="technical">Technical</option>
                  <option value="leadership">Leadership</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
            </div>

            {/* Start Date & Due Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                />
              </div>

              <div>
                <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  id="due_date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                />
              </div>
            </div>

            {/* Quarter, Priority, and Weight */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="quarter" className="block text-sm font-medium text-gray-700 mb-2">
                  Quarter
                </label>
                <input
                  type="text"
                  id="quarter"
                  name="quarter"
                  value={formData.quarter}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder={getCurrentQuarter()}
                />
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                  Weight
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                />
              </div>
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
                <option value="private">Private (only employee)</option>
                <option value="team">Team (visible to team)</option>
                <option value="department">Department (entire department)</option>
                <option value="company">Company (everyone)</option>
              </select>
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
                <Target className="w-4 h-4" />
                {loading ? 'Assigning...' : 'Assign Goal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
