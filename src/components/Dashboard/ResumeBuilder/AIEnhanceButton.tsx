import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader } from 'lucide-react';
import { AnimatedButton } from '../../AnimatedButton';
import { enhanceResumeSection } from '../../../lib/ai/resume';

interface AIEnhanceButtonProps {
  section: string;
  content: string;
  role: string;
  template: string;
  onEnhance: (enhancedContent: string) => void;
}

export const AIEnhanceButton: React.FC<AIEnhanceButtonProps> = ({
  section,
  content,
  role,
  template,
  onEnhance
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnhance = async () => {
    if (!content.trim() || loading) return;

    try {
      setLoading(true);
      setError(null);

      const enhancedContent = await enhanceResumeSection(
        section,
        content,
        role,
        template
      );

      onEnhance(enhancedContent);
    } catch (err) {
      console.error('Error enhancing content:', err);
      setError('Failed to enhance content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AnimatedButton
        variant="secondary"
        onClick={handleEnhance}
        className="text-sm flex items-center gap-2"
        disabled={loading || !content.trim()}
      >
        {loading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            <span>Enhancing...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Enhance with AI</span>
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
    </div>
  );
};