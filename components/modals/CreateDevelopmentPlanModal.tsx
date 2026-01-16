/**
 * Create Development Plan Modal Component
 * Allows managers to create career development plans for team members
 */

'use client';

import { useState, useEffect } from 'react';
import { X, BookOpen, Plus, Trash2 } from 'lucide-react';

interface CreateDevelopmentPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  teamMember?: {
    id: number;
    name: string;
    title: string;
  };
}

interface DevelopmentAction {
  action_type: string;
  title: string;
  description: string;
  target_date: string;
}

export default function CreateDevelopmentPlanModal({ isOpen, onClose, onSuccess, teamMember }: CreateDevelopmentPlanModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    employee_id: teamMember?.id || '',
    plan_name: '',
    target_role: '',
    target_date: '',
    overview: ''
  });
  const [actions, setActions] = useState<DevelopmentAction[]>([]);

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

  // Update employee_id when teamMember changes
  useEffect(() => {
    if (teamMember?.id) {
      setFormData(prev => ({
        ...prev,
        employee_id: teamMember.id
      }));
    }
  }, [teamMember]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/performance/development-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          actions: actions.filter(a => a.title.trim() !== '')
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create development plan');
      }

      // Success
      onSuccess?.();
      onClose();
      // Reset form
      setFormData({
        employee_id: teamMember?.id || '',
        plan_name: '',
        target_role: '',
        target_date: '',
        overview: ''
      });
      setActions([]);
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

  const addAction = () => {
    setActions([
      ...actions,
      {
        action_type: 'training',
        title: '',
        description: '',
        target_date: ''
      }
    ]);
  };

  const removeAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const updateAction = (index: number, field: keyof DevelopmentAction, value: string) => {
    const newActions = [...actions];
    newActions[index] = {
      ...newActions[index],
      [field]: value
    };
    setActions(newActions);
  };

  // Get date one year from now as default
  const getDefaultTargetDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
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
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Create Development Plan</h2>
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
          <div className="mb-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="text-sm text-indigo-800">
              📚 Development plans help employees grow their careers through targeted learning, mentoring, and project experiences. Create a structured plan to support their professional development.
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
            {/* Plan Name */}
            <div>
              <label htmlFor="plan_name" className="block text-sm font-medium text-gray-700 mb-2">
                Plan Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="plan_name"
                name="plan_name"
                value={formData.plan_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="e.g., 2026 Career Development Plan"
                required
              />
            </div>

            {/* Target Role & Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="target_role" className="block text-sm font-medium text-gray-700 mb-2">
                  Target Role
                </label>
                <input
                  type="text"
                  id="target_role"
                  name="target_role"
                  value={formData.target_role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div>
                <label htmlFor="target_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Target Date
                </label>
                <input
                  type="date"
                  id="target_date"
                  name="target_date"
                  value={formData.target_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder={getDefaultTargetDate()}
                />
              </div>
            </div>

            {/* Overview */}
            <div>
              <label htmlFor="overview" className="block text-sm font-medium text-gray-700 mb-2">
                Overview
              </label>
              <textarea
                id="overview"
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Describe the overall development focus, key competencies to build, and expected outcomes..."
              />
            </div>

            {/* Development Actions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Development Actions
                </label>
                <button
                  type="button"
                  onClick={addAction}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Action
                </button>
              </div>

              {actions.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-6 text-center border-2 border-dashed border-gray-300">
                  <p className="text-sm text-gray-600 mb-2">No development actions yet</p>
                  <button
                    type="button"
                    onClick={addAction}
                    className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                  >
                    Add your first action
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {actions.map((action, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Action {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeAction(index)}
                          className="text-red-500 hover:text-red-700 transition"
                          aria-label="Remove action"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {/* Action Type */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Type
                          </label>
                          <select
                            value={action.action_type}
                            onChange={(e) => updateAction(index, 'action_type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white text-sm"
                          >
                            <option value="training">Training/Course</option>
                            <option value="mentoring">Mentoring</option>
                            <option value="project">Project/Assignment</option>
                            <option value="shadowing">Job Shadowing</option>
                            <option value="certification">Certification</option>
                            <option value="reading">Reading/Self-Study</option>
                          </select>
                        </div>

                        {/* Title */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={action.title}
                            onChange={(e) => updateAction(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white text-sm"
                            placeholder="e.g., Complete Leadership Fundamentals Course"
                            required
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Description
                          </label>
                          <textarea
                            value={action.description}
                            onChange={(e) => updateAction(index, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white text-sm"
                            placeholder="Details about this development activity..."
                          />
                        </div>

                        {/* Target Date */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Target Date
                          </label>
                          <input
                            type="date"
                            value={action.target_date}
                            onChange={(e) => updateAction(index, 'target_date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Best Practices */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Effective Development Plan Guidelines:
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>✓ Align development goals with career aspirations</li>
                <li>✓ Include a mix of learning methods (training, mentoring, projects)</li>
                <li>✓ Set realistic timelines and milestones</li>
                <li>✓ Focus on both technical and soft skills</li>
                <li>✓ Schedule regular check-ins to track progress</li>
                <li>✓ Make actions specific and measurable</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white">
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
                <BookOpen className="w-4 h-4" />
                {loading ? 'Creating...' : 'Create Development Plan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
