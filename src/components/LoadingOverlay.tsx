import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Target, ChevronRight } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible }) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const steps = [
    { icon: Brain, text: "Analyzing your career profile..." },
    { icon: Target, text: "Identifying growth opportunities..." },
    { icon: Sparkles, text: "Generating personalized recommendations..." }
  ];

  React.useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setCurrentStep(prev => (prev + 1) % steps.length);
      }, 2500);
      return () => clearInterval(interval);
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
                {steps.map((step, index) => (
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
                    <span className={`text-lg ${
                      currentStep === index ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-12 h-1 bg-gray-100 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="h-full bg-indigo-600"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 7.5,
                    ease: "linear"
                  }}
                />
              </motion.div>

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