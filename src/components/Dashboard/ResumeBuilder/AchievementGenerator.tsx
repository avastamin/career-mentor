import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader, Plus } from 'lucide-react';
import { generateAchievements } from '../../../lib/ai/resume';
import { AnimatedButton } from '../../AnimatedButton';

interface AchievementGeneratorProps {
  role: string;
  description: string;
  onAddAchievement: (achievement: string) => void;
}

export const AchievementGenerator: React.FC<AchievementGeneratorProps> = ({
  role,
  description,
  onAddAchievement
}) => {
  const [achievements, setAchievements] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description.trim() || loading) return;

    try {
      setLoading(true);
      setError(null);

      const generatedAchievements = await generateAchievements(
        role,
        description
      );

      setAchievements(generatedAchievements);
    } catch (err) {
      console.error('Error generating achievements:', err);
      setError('Failed to generate achievements');
    } finally {
      setLoading(false);
    }
  };

  if (!description.trim()) {
    return null;
  }

  return (
    <div className="mt-4">
      <AnimatedButton
        variant="secondary"
        onClick={handleGenerate}
        className="text-sm flex items-center gap-2"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Generate Achievements</span>
          </>
        )}
      </AnimatedButton>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 mt-2"
        >
          {error}
        </motion.p>
      )}

      {achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 space-y-2"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2"
            >
              <AnimatedButton
                variant="secondary"
                onClick={() => onAddAchievement(achievement)}
                className="text-sm py-1 px-3 flex items-center gap-1 w-full justify-between group"
              >
                <span className="text-left">{achievement}</span>
                <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </AnimatedButton>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};