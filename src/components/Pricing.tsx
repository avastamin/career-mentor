import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Star, 
  AlertCircle, 
  Sparkles, 
  Crown, 
  Gem, 
  Brain, 
  Target, 
  Users, 
  BookOpen, 
  CheckCircle, 
  Loader, 
  Zap,
  X 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createCheckoutSession } from '../lib/stripe';
import { AnimatedButton } from './AnimatedButton';
import { useAnimations } from '../hooks/useAnimations';

export const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { buttonVariants, cardVariants } = useAnimations();

  const plans = [
    {
      name: "Free",
      price: "0",
      description: "Basic career analysis preview",
      icon: Star,
      color: "gray",
      features: [
        "Single basic analysis",
        "Basic skill gap identification",
        "Limited learning resources",
        "Basic career recommendations"
      ]
    },
    {
      name: "Pro",
      price: "19",
      icon: Crown,
      color: "indigo",
      priceId: "price_1QMzcALbngEU6IxBCH6dSTSk",
      description: "Enhanced career guidance",
      features: [
        "10 analyses per month",
        "Advanced market dynamics",
        "AI Resume builder",
        "Email support",
        "Basic progress tracking",
        "Advanced Network Strategies",
        {
          text: "Personal AI",
          badge: {
            icon: Zap,
            text: "GPT-3.5"
          }
        }
      ]
    },
    {
      name: "Premium",
      price: "49",
      popular: true,
      description: "Complete career development",
      icon: Gem,
      color: "yellow",
      priceId: "price_1QMzXsLbngEU6IxBPIeuYKYP",
      features: [
        "Everything in Pro",
        "Unlimited analyses",
        "Professional visibility",
        "Interview preparation",
        "Priority support",
        "Advanced market positioning",
        "Strategic career development",
        "Career transition planning",
        {
          text: "Personal AI",
          badge: {
            icon: Zap,
            text: "GPT-4"
          }
        }
      ]
    }
  ];

  const handleSubscription = async (plan: typeof plans[0]) => {
    if (!user) {
      navigate('/signin');
      return;
    }

    if (plan.name === 'Free') {
      navigate('/dashboard');
      return;
    }

    if (processingPlanId || !plan.priceId) return;

    try {
      setProcessingPlanId(plan.priceId);
      setError(null);

      const { error: checkoutError } = await createCheckoutSession(plan.priceId);
      
      if (checkoutError) {
        console.error('Checkout error:', checkoutError);
        setError(checkoutError.message || 'Failed to start checkout process');
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setError('An unexpected error occurred');
    } finally {
      setProcessingPlanId(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
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
    <section id="pricing" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-50 to-white pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent" />
      
      <div className="container relative mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ rotate: -5, scale: 0.9 }}
            animate={{ rotate: 5, scale: 1.1 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 2
            }}
          >
            <Star className="w-12 h-12 text-yellow-400 fill-yellow-400" />
          </motion.div>
          <h2 className="text-4xl font-bold mb-6">
            Investment in Your{' '}
            <span className="relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-500">
                Future
              </span>
              <motion.span
                className="absolute inset-0 bg-indigo-400/20 blur-xl rounded-full"
                variants={glowVariants}
                initial="initial"
                animate="animate"
              />
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that best fits your career goals and start your journey towards success
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto"
            >
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="ml-auto hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              className="relative"
              variants={cardVariants}
              style={{ willChange: 'transform' }}
            >
              <motion.div 
                className={`h-full feature-card flex flex-col backdrop-blur-sm bg-white/90 border-2 ${
                  plan.popular 
                    ? 'border-yellow-400 shadow-lg shadow-yellow-100' 
                    : plan.name === 'Pro'
                    ? 'border-indigo-500'
                    : 'border-gray-200'
                }`}
                whileHover={{ 
                  y: -8,
                  boxShadow: plan.popular 
                    ? '0 20px 25px -5px rgba(234, 179, 8, 0.3)' 
                    : plan.name === 'Pro'
                    ? '0 20px 25px -5px rgba(99, 102, 241, 0.3)'
                    : '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                {plan.popular && (
                  <motion.div 
                    className="absolute -top-4 left-0 right-0 z-10"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1 justify-center w-max mx-auto shadow-lg">
                      <Sparkles className="w-4 h-4" />
                      Most Popular
                    </span>
                  </motion.div>
                )}

                <div className="p-8 flex flex-col h-full">
                  <motion.div 
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 mx-auto ${
                      plan.name === 'Premium' 
                        ? 'bg-yellow-100' 
                        : plan.name === 'Pro'
                        ? 'bg-indigo-100'
                        : 'bg-gray-100'
                    }`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.7 }}
                  >
                    <plan.icon className={`w-6 h-6 ${
                      plan.name === 'Premium'
                        ? 'text-yellow-600'
                        : plan.name === 'Pro'
                        ? 'text-indigo-600'
                        : 'text-gray-600'
                    }`} />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <motion.ul 
                    className="space-y-4 mb-8 flex-grow"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li 
                        key={featureIndex} 
                        className="flex items-start gap-2"
                        variants={cardVariants}
                      >
                        <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          plan.name === 'Premium'
                            ? 'text-yellow-500'
                            : plan.name === 'Pro'
                            ? 'text-indigo-500'
                            : 'text-green-500'
                        }`} />
                        <span className="text-gray-600">
                          {typeof feature === 'string' ? feature : (
                            <span className="flex items-center gap-2">
                              {feature.text}
                              {feature.badge && (
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  feature.badge.text === 'GPT-4'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-indigo-100 text-indigo-800'
                                }`}>
                                  <feature.badge.icon className="w-3 h-3 mr-1" />
                                  {feature.badge.text}
                                </span>
                              )}
                            </span>
                          )}
                        </span>
                      </motion.li>
                    ))}
                  </motion.ul>
                  <AnimatedButton
                    onClick={() => handleSubscription(plan)}
                    className={`w-full ${
                      plan.name === 'Premium'
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white border-0'
                        : plan.name === 'Free'
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
                        : ''
                    }`}
                    disabled={!!processingPlanId}
                  >
                    {processingPlanId === plan.priceId ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      'Get Started'
                    )}
                  </AnimatedButton>
                </div>

                {/* Glow effect on hover */}
                <motion.div
                  className={`absolute inset-0 opacity-0 transition-opacity rounded-xl ${
                    plan.name === 'Premium'
                      ? 'bg-yellow-400'
                      : plan.name === 'Pro'
                      ? 'bg-indigo-400'
                      : 'bg-gray-400'
                  }`}
                  initial={false}
                  whileHover={{ opacity: 0.1 }}
                  style={{ willChange: 'opacity' }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-4 gap-8 max-w-2xl mx-auto mb-8">
            {[
              { icon: Brain, label: "AI Analysis" },
              { icon: Target, label: "Career Paths" },
              { icon: BookOpen, label: "Learning" },
              { icon: Users, label: "Mentorship" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center"
                whileHover={{ y: -4 }}
              >
                <motion.div
                  className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.7 }}
                >
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </motion.div>
                <span className="text-sm text-gray-600">{feature.label}</span>
              </motion.div>
            ))}
          </div>

          <p className="text-gray-600">
            All plans include: SSL security, 99.9% uptime guarantee, and basic email support
          </p>
        </motion.div>
      </div>
    </section>
  );
};