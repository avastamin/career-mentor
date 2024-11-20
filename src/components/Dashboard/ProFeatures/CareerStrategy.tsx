import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Users, 
  Megaphone, 
  ArrowUpRight, 
  Crown,
  Brain,
  ChevronRight,
  Lock,
  Sparkles,
  Gem
} from 'lucide-react';
import { AnimatedCard } from '../../AnimatedCard';
import { useAnimations } from '../../../hooks/useAnimations';
import { useAuth } from '../../../contexts/AuthContext';
import { AnimatedButton } from '../../AnimatedButton';
import { PricingPlansModal } from '../PricingPlansModal';

interface CareerStrategyProps {
  strategy: {
    networking: string[];
    upskilling: string[];
    visibility: string[];
    positioning: string[];
  };
}

export const CareerStrategy = ({ strategy }: CareerStrategyProps) => {
  const { cardVariants } = useAnimations();
  const { userProfile } = useAuth();
  const [showPricingModal, setShowPricingModal] = useState(false);

  if (!strategy) return null;

  const isPremiumUser = userProfile?.role === 'premium';

  const strategies = [
    { 
      title: 'Networking Strategy',
      icon: Users,
      items: strategy.networking || [],
      color: 'indigo',
      description: 'Build and leverage professional relationships',
      locked: false
    },
    { 
      title: 'Skill Development',
      icon: Brain,
      items: strategy.upskilling || [],
      color: 'blue',
      description: 'Enhance your technical and soft skills',
      locked: false
    },
    { 
      title: 'Professional Visibility',
      icon: Megaphone,
      items: strategy.visibility || [],
      color: 'purple',
      description: 'Increase your industry presence',
      locked: !isPremiumUser
    },
    { 
      title: 'Market Positioning',
      icon: Target,
      items: strategy.positioning || [],
      color: 'green',
      description: 'Differentiate yourself in the market',
      locked: !isPremiumUser
    }
  ];

  const getBackgroundStyle = (color: string) => ({
    background: `linear-gradient(135deg, var(--${color}-50) 0%, transparent 100%)`,
    willChange: 'transform',
    transform: 'translateZ(0)'
  });

  const getIconContainerStyle = (color: string) => ({
    backgroundColor: `var(--${color}-100)`,
    color: `var(--${color}-600)`
  });

  return (
    <>
      <AnimatedCard>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Crown className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Strategic Career Development</h2>
              <p className="text-gray-600">Comprehensive approach to accelerate your career growth</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {strategies.map((section, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="p-6 rounded-xl border border-gray-100 relative overflow-hidden"
                style={getBackgroundStyle(section.color)}
                layoutId={`strategy-${index}`}
              >
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={getIconContainerStyle(section.color)}
                    >
                      <section.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{section.title}</h3>
                      <p className="text-sm text-gray-600">{section.description}</p>
                    </div>
                  </div>

                  {section.locked ? (
                    <div className="mt-4">
                      <motion.div
                        className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-lg border border-yellow-200"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-yellow-700">
                            <Lock className="w-4 h-4" />
                            <span className="text-sm font-medium">Premium Feature</span>
                          </div>
                          <AnimatedButton
                            variant="secondary"
                            onClick={() => setShowPricingModal(true)}
                            className="text-xs py-1 px-3 flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 border-0"
                          >
                            <Gem className="w-3 h-3" />
                            Upgrade to Premium
                          </AnimatedButton>
                        </div>
                        <p className="text-sm text-yellow-600 mt-2">
                          Unlock advanced insights and strategies with our Premium plan
                        </p>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <motion.div
                          key={itemIndex}
                          className="p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-100 group"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            delay: itemIndex * 0.05,
                            duration: 0.2
                          }}
                          style={{ willChange: 'transform' }}
                          whileHover={{ 
                            x: 4,
                            transition: { duration: 0.2 }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ChevronRight 
                                className={`w-4 h-4 text-${section.color}-500`}
                                style={{ color: `var(--${section.color}-500)` }}
                              />
                              <span className="text-gray-700">{item}</span>
                            </div>
                            <ArrowUpRight 
                              className={`w-4 h-4 text-${section.color}-500 transform transition-transform duration-200 group-hover:rotate-45`}
                              style={{ color: `var(--${section.color}-500)` }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedCard>

      <PricingPlansModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />
    </>
  );
};