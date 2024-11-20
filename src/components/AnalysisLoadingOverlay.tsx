import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Target, ChevronRight } from 'lucide-react';

interface AnalysisLoadingOverlayProps {
  isVisible: boolean;
}

export const AnalysisLoadingOverlay: React.FC<AnalysisLoadingOverlayProps> = ({ isVisible }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const loadingSteps = [
    {
      icon: Brain,
      text: "Analyzing your professional background...",
      subtext: "Processing experience and skills"
    },
    {
      icon: Target,
      text: "Identifying career opportunities...",
      subtext: "Matching skills with market demands"
    },
    {
      icon: Sparkles,
      text: "Generating personalized insights...",
      subtext: "Creating tailored recommendations"
    }
  ];

  useEffect(() => {
    if (isVisible) {
      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 0.5;
        });
      }, 50);

      // Step animation
      const stepInterval = setInterval(() => {
        setCurrentStep(prev => (prev + 1) % loadingSteps.length);
      }, 2500);

      return () => {
        clearInterval(progressInterval);
        clearInterval(stepInterval);
      };
    }
    return undefined;
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm"
        >
          <div className="max-w-md w-full px-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-24 h-24 mx-auto mb-8 rounded-full bg-indigo-100 flex items-center justify-center"
              >
                <Brain className="w-12 h-12 text-indigo-600" />
              </motion.div>

              <div className="space-y-6">
                {loadingSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{
                      opacity: currentStep === index ? 1 : 0.3,
                      x: 0,
                      scale: currentStep === index ? 1 : 0.95,
                    }}
                    className="flex items-center gap-4"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg ${
                        currentStep === index
                          ? 'bg-indigo-100'
                          : currentStep > index
                          ? 'bg-green-100'
                          : 'bg-gray-100'
                      } flex items-center justify-center`}
                    >
                      {currentStep > index ? (
                        <ChevronRight className={`w-5 h-5 ${
                          currentStep > index ? 'text-green-600' : 'text-gray-400'
                        }`} />
                      ) : (
                        <step.icon className={`w-5 h-5 ${
                          currentStep === index ? 'text-indigo-600' : 'text-gray-400'
                        }`} />
                      )}
                    </div>
                    <div>
                      <p className={`text-lg ${
                        currentStep === index ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.text}
                      </p>
                      <p className={`text-sm ${
                        currentStep === index ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.subtext}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Analysis Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-indigo-600 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <motion.div
                className="absolute -z-10 inset-0"
                animate={{
                  background: [
                    "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)",
                    "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.2) 0%, transparent 70%)",
                    "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};