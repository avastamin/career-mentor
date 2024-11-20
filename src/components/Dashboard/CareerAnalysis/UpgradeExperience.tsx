import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, 
  Sparkles, 
  Star, 
  ArrowRight, 
  Brain, 
  Target, 
  Users, 
  BookOpen,
  Zap,
  CheckCircle,
  Lock
} from 'lucide-react';
import { AnimatedButton } from '../../AnimatedButton';

export const UpgradeExperience = () => {
  const navigate = useNavigate();

  const plans = {
    pro: {
      name: "Pro",
      price: "25",
      icon: Crown,
      color: "indigo",
      features: [
        "Unlimited AI Career Analysis",
        "Advanced Skill Gap Analysis",
        "Custom Learning Paths",
        "Resume Builder & Analyzer",
        "Interview Preparation Toolkit",
        "1-on-1 AI Mentoring Sessions",
        "Progress Tracking Dashboard",
        "Priority Support Response",
        "AI-powered Mock Interviews"
      ]
    },
    premium: {
      name: "Premium",
      price: "99",
      icon: Sparkles,
      color: "purple",
      features: [
        "Everything in Pro, plus:",
        "Advanced AI Career Coaching",
        "Personalized Mentorship Matching",
        "Priority Access to New Features",
        "Weekly Progress Reviews",
        "Custom Skill Assessments",
        "Career Transition Planning",
        "Executive Resume Review",
        "Mock Interview Sessions"
      ]
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  const bestChoiceVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const glowVariants = {
    initial: { opacity: 0.5, scale: 0.8 },
    animate: {
      opacity: [0.5, 1, 0.5],
      scale: [0.8, 1.2, 0.8],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 bg-gradient-to-br from-indigo-600 to-indigo-800 px-4 py-12 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <motion.div
            className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.7 }}
          >
            <Brain className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Unlock Advanced Career Analysis
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Take your career to the next level with our premium features and AI-powered insights
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {Object.entries(plans).map(([key, plan]) => (
            <motion.div
              key={key}
              variants={itemVariants}
              className={`relative overflow-hidden rounded-2xl bg-white shadow-xl ${
                key === 'pro' ? 'ring-4 ring-yellow-400' : ''
              }`}
              whileHover={{ y: -8 }}
            >
              {key === 'pro' && (
                <>
                  <motion.div
                    className="absolute -top-12 -right-12 w-24 h-24"
                    variants={glowVariants}
                    initial="initial"
                    animate="animate"
                  >
                    <div className="w-full h-full bg-yellow-400/20 rounded-full blur-xl" />
                  </motion.div>
                  <motion.div
                    className="absolute top-0 right-0 -mt-2 -mr-2 z-10"
                    variants={bestChoiceVariants}
                    initial="initial"
                    animate="animate"
                  >
                    <div className="relative">
                      <span className="block bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                        MOST POPULAR
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-yellow-400/50 to-yellow-500/50 rounded-full blur"
                        animate={{
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                  </motion.div>
                </>
              )}

              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    className={`w-12 h-12 rounded-xl bg-${plan.color}-100 flex items-center justify-center`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.7 }}
                  >
                    <plan.icon className={`w-6 h-6 text-${plan.color}-600`} />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3"
                      variants={itemVariants}
                    >
                      <CheckCircle className={`w-5 h-5 mt-0.5 text-${plan.color}-500`} />
                      <span className="text-gray-600">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <AnimatedButton
                  variant={key === 'pro' ? 'primary' : 'secondary'}
                  onClick={() => navigate('/pricing')}
                  className="w-full flex items-center justify-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </AnimatedButton>
              </div>

              {key === 'pro' && (
                <motion.div
                  className="absolute inset-0 border-2 border-yellow-400 rounded-2xl pointer-events-none"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={itemVariants}
          className="mt-12 text-center"
        >
          <div className="grid grid-cols-4 gap-8 max-w-4xl mx-auto mb-8">
            {[
              { icon: Brain, label: "AI Analysis" },
              { icon: Target, label: "Career Paths" },
              { icon: Users, label: "Mentorship" },
              { icon: BookOpen, label: "Learning" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                whileHover={{ y: -4 }}
              >
                <motion.div
                  className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.7 }}
                >
                  <item.icon className="w-8 h-8 text-white" />
                </motion.div>
                <span className="text-indigo-100">{item.label}</span>
              </motion.div>
            ))}
          </div>

          <p className="text-indigo-100 mb-8">
            Join thousands of professionals who have transformed their careers with CareerMentor Pro
          </p>

          <div className="flex justify-center gap-4">
            <AnimatedButton
              variant="secondary"
              onClick={() => navigate('/pricing')}
              className="bg-white text-indigo-600 hover:bg-indigo-50"
            >
              View All Plans
            </AnimatedButton>
            <AnimatedButton
              variant="secondary"
              onClick={() => navigate('/dashboard/overview')}
              className="bg-indigo-700 text-white hover:bg-indigo-800 border-indigo-500"
            >
              Back to Dashboard
            </AnimatedButton>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};