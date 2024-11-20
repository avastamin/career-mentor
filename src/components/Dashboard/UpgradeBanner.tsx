import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Crown, Sparkles, Star, ArrowRight, Zap } from 'lucide-react';
import { AnimatedButton } from '../AnimatedButton';
import { useAuth } from '../../contexts/AuthContext';

export const UpgradeBanner = () => {
  const navigate = useNavigate();
  const { user, isProMember } = useAuth();

  // Show banner only if user is logged in and not a pro member
  if (!user || isProMember) return null;

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-800 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_var(--tw-gradient-stops))] from-white/10 to-transparent"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-200 font-medium text-sm">Upgrade to Pro</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Unlock Your Full Career Potential
            </h3>
            <p className="text-indigo-100 mb-4 sm:mb-0">
              Get unlimited AI analysis, personalized mentorship, and advanced career insights
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 text-indigo-100 mb-1">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Advanced AI Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-100 mb-1">
                <Star className="w-4 h-4" />
                <span className="text-sm">Expert Mentorship</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-100">
                <Zap className="w-4 h-4" />
                <span className="text-sm">Priority Support</span>
              </div>
            </div>

            <AnimatedButton
              onClick={() => navigate('/pricing')}
              className="bg-white text-indigo-600 hover:bg-indigo-50 group whitespace-nowrap px-6"
            >
              Upgrade Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </AnimatedButton>
          </div>
        </div>

        <motion.div
          className="absolute top-4 right-4"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="w-8 h-8 text-indigo-300" />
        </motion.div>
      </div>
    </motion.div>
  );
};