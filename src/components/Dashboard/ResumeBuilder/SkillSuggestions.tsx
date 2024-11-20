import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus, Loader } from 'lucide-react';
import { suggestSkills } from '../../../lib/ai/resume';
import { AnimatedButton } from '../../AnimatedButton';

interface SkillSuggestionsProps {
  currentRole: string;
  desiredRole: string;
  currentSkills: string[];
  onAddSkill: (skill: string) => void;
}

export const SkillSuggestions: React.FC<SkillSuggestionsProps> = ({
  currentRole,
  desiredRole,
  currentSkills,
  onAddSkill
}) => {
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSuggestions();
  }, [currentRole, desiredRole, currentSkills]);

  const loadSuggestions = async () => {
    if (!currentRole || !desiredRole || loading) return;

    try {
      setLoading(true);
      setError(null);

      const suggestions = await suggestSkills(
        currentRole,
        desiredRole,
        currentSkills
      );

      // Filter out skills that are already in currentSkills
      const newSuggestions = suggestions.filter(
        skill => !currentSkills.includes(skill)
      );

      setSuggestedSkills(newSuggestions);
    } catch (err) {
      console.error('Error loading skill suggestions:', err);
      setError('Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader className="w-5 h-5 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-red-600 p-4">
        {error}
      </p>
    );
  }

  if (!suggestedSkills.length) {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
        <Sparkles className="w-4 h-4" />
        <span>Suggested skills for your target role:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestedSkills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <AnimatedButton
              variant="secondary"
              onClick={() => onAddSkill(skill)}
              className="text-sm py-1 px-3 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              {skill}
            </AnimatedButton>
          </motion.div>
        ))}
      </div>
    </div>
  );
};