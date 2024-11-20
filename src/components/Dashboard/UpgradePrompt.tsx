import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Crown, X, Check } from 'lucide-react';
import { AnimatedButton } from '../AnimatedButton';

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const features = [
    'Access to all dashboard features',
    'Unlimited career analyses',
    'Personalized learning paths',
    'AI-powered mentorship',
    'Progress tracking',
    'Priority support'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-xl z-50 p-6"
            initial={{ opacity: 0, scale: 0.95, y: '-45%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, y: '-45%' }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Upgrade to Pro</h2>
              <p className="text-gray-600">
                Unlock all features and take your career to the next level
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-600">{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="space-y-3">
              <AnimatedButton
                variant="primary"
                onClick={() => {
                  navigate('/pricing');
                  onClose();
                }}
                className="w-full"
              >
                Upgrade Now
              </AnimatedButton>
              <button
                onClick={onClose}
                className="w-full text-sm text-gray-500 hover:text-gray-700"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};