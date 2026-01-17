/**
 * Skills Card Component
 * Displays user skills with endorsement functionality
 */

'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, Award } from 'lucide-react';

interface Skill {
  id: number;
  user_id: number;
  skill_id: number;
  skill_name: string;
  skill_category: string;
  proficiency_level: number;
  years_experience: number;
  endorsed_count: number;
}

interface SkillsCardProps {
  userId: number;
  isOwnProfile?: boolean;
  onEndorse?: () => void;
}

export default function SkillsCard({ userId, isOwnProfile = false, onEndorse }: SkillsCardProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [endorsingSkillId, setEndorsingSkillId] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchSkills = async () => {
    try {
      const res = await fetch(`/api/performance/skills?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setSkills(data.skills || []);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndorse = async (skillId: number) => {
    if (isOwnProfile) {
      setError('You cannot endorse your own skills');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setEndorsingSkillId(skillId);
    setError('');

    try {
      const res = await fetch('/api/performance/skills/endorse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, skillId }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update the endorsed count locally
        setSkills(prevSkills =>
          prevSkills.map(skill =>
            skill.skill_id === skillId
              ? { ...skill, endorsed_count: data.endorsedCount }
              : skill
          )
        );
        onEndorse?.();
      } else {
        setError(data.error || 'Failed to endorse skill');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('Error endorsing skill:', error);
      setError('Failed to endorse skill');
      setTimeout(() => setError(''), 3000);
    } finally {
      setEndorsingSkillId(null);
    }
  };

  const getProficiencyLabel = (level: number) => {
    const labels = ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
    return labels[level] || 'Unknown';
  };

  const getProficiencyColor = (level: number) => {
    const colors = ['', 'bg-gray-100 text-gray-700', 'bg-blue-100 text-blue-700', 'bg-indigo-100 text-indigo-700', 'bg-purple-100 text-purple-700', 'bg-amber-100 text-amber-700'];
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold">Skills</h3>
        </div>
        <div className="text-gray-500 text-sm">Loading skills...</div>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold">Skills</h3>
        </div>
        <div className="text-gray-500 text-sm">No skills added yet</div>
      </div>
    );
  }

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.skill_category]) {
      acc[skill.skill_category] = [];
    }
    acc[skill.skill_category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold">Skills & Endorsements</h3>
        </div>
        <div className="text-sm text-gray-500">
          {skills.length} skill{skills.length !== 1 ? 's' : ''}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
          <div key={category}>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">{category}</h4>
            <div className="space-y-2">
              {categorySkills.map(skill => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{skill.skill_name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getProficiencyColor(skill.proficiency_level)}`}>
                        {getProficiencyLabel(skill.proficiency_level)}
                      </span>
                    </div>
                    {skill.years_experience > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {skill.years_experience} {skill.years_experience === 1 ? 'year' : 'years'} experience
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="font-medium">{skill.endorsed_count}</span>
                    </div>
                    {!isOwnProfile && (
                      <button
                        onClick={() => handleEndorse(skill.skill_id)}
                        disabled={endorsingSkillId === skill.skill_id}
                        className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {endorsingSkillId === skill.skill_id ? (
                          <span className="flex items-center gap-1">
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </span>
                        ) : (
                          'Endorse'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Top endorsed skills */}
      {skills.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Most Endorsed</h4>
          <div className="flex flex-wrap gap-2">
            {skills
              .sort((a, b) => b.endorsed_count - a.endorsed_count)
              .slice(0, 5)
              .map(skill => (
                <div
                  key={skill.id}
                  className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-sm"
                >
                  <span className="font-medium text-indigo-900">{skill.skill_name}</span>
                  <span className="ml-1.5 text-indigo-600">•</span>
                  <span className="ml-1.5 text-indigo-700">{skill.endorsed_count}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
