import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen,  
  Target,
  Settings,
  Menu,
  X,
  Brain,
  Shield,
  Crown,
  Lock,
  MessageSquare,
  Zap,
  Star,
  Gem,
  NotebookPen,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';
import { SettingsMenu } from './Settings/SettingsMenu';
import { AnimatedButton } from '../AnimatedButton';
import { useTheme } from '../../contexts/ThemeContext';
import { PricingPlansModal } from './PricingPlansModal';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showPricingPlans, setShowPricingPlans] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { isAdmin } = useAdmin();
  const { theme } = useTheme();

  const isProMember = userProfile?.role === 'pro';
  const isPremiumMember = userProfile?.role === 'premium';
  const userPlan = isAdmin
    ? 'admin'
    : isPremiumMember
    ? 'premium'
    : isProMember
    ? 'pro'
    : 'free';
  const PlanIcon =
    userPlan === 'premium' ? Gem : userPlan === 'pro' ? Crown : userPlan === 'admin' ? Shield : Star;

  const planFeatures = {
    free: {
      icon: Star,
      name: 'Free Plan',
      color: 'bg-gray-100 text-gray-600',
      features: ['Basic Analysis', 'Limited Features'],
    },
    pro: {
      icon: Crown,
      name: 'Pro Plan',
      color: 'bg-indigo-100 text-indigo-600',
      features: ['Full Analysis', 'All Features', 'Personal AI (GPT-3.5)', 'Priority Support'],
    },
    premium: {
      icon: Gem,
      name: 'Premium',
      color: 'bg-yellow-100 text-yellow-600',
      features: ['Full Analysis', 'All Features', 'GPT-4 Personal AI', 'Priority Support'],
    },
    admin: {
      icon: Shield,
      name: 'Admin',
      color: 'bg-purple-100 text-purple-600',
      features: ['Full Access', 'User Management', 'System Settings'],
    },
  };

  const navigation = React.useMemo(() => {
    if (isAdmin) {
      return [
        {
          name: 'Admin Dashboard',
          href: '/dashboard/admin',
          icon: Shield,
          highlight: true,
        },
      ];
    }

    return [
      {
        name: 'Overview',
        href: '/dashboard/overview',
        icon: LayoutDashboard,
        requiresPro: false,
      },
      {
        name: 'Career Analysis',
        href: '/dashboard/career-analysis',
        icon: Brain,
        highlight: true,
        requiresPro: false,
        isPremiumFeature: true,
      },
      {
        name: 'Personal AI',
        href: '/dashboard/ai-chat',
        icon: MessageSquare,
        requiresPro: true,
        highlight: true,
        isNew: true,
        isPremiumFeature: true,
        badge: {
          text: isPremiumMember ? 'GPT-4' : 'GPT-3.5',
          icon: isPremiumMember ? Sparkles : Zap,
          color: isPremiumMember ? 'bg-yellow-100 text-yellow-800' : 'bg-indigo-100 text-indigo-800',
        },
      },
      {
        name: 'Learning Paths',
        href: '/dashboard/learning',
        icon: BookOpen,
        requiresPro: true,
      },
      {
        name: 'Resume Builder',
        href: '/dashboard/resume-builder',
        icon: NotebookPen,
        requiresPro: true,
      },
      {
        name: 'Goals',
        href: '/dashboard/goals',
        icon: Target,
        requiresPro: true,
      },
    ];
  }, [isAdmin, isPremiumMember]);

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string, requiresPro: boolean = false) => {
    if (!user) {
      navigate('/signin');
    } else if (requiresPro && !isProMember && !isPremiumMember) {
      setShowPricingPlans(true);
    } else {
      navigate(path);
    }
    setIsSidebarOpen(false);
  };

  const getTabStyles = (
    isActive: boolean,
    isHighlight: boolean,
    isLocked: boolean,
    isPremiumFeature: boolean = false
  ) => {
    if (isLocked) {
      return theme === 'dark'
        ? 'text-gray-500 hover:bg-gray-800/50'
        : 'text-gray-400 hover:bg-gray-50';
    }

    if (isActive) {
      if (isHighlight && isPremiumFeature && isPremiumMember) {
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg';
      }
      if (isHighlight) {
        return 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg';
      }
      return theme === 'dark' ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-50 text-indigo-600';
    }

    if (isHighlight && isPremiumFeature && isPremiumMember) {
      return theme === 'dark'
        ? 'bg-yellow-900/50 text-yellow-400 hover:bg-yellow-900/70'
        : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100';
    }

    if (isHighlight) {
      return theme === 'dark'
        ? 'bg-indigo-900/50 text-indigo-400 hover:bg-indigo-900/70'
        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100';
    }

    return theme === 'dark'
      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';
  };

  return (
    <div className="min-h-screen dashboard-layout">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg shadow-md text-gray-600 hover:text-indigo-600"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform lg:translate-x-0 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col bg-white dark:bg-gray-800 shadow-lg">
          {/* Logo */}
          <div className="p-6">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">CareerMentor</span>
            </Link>
          </div>

          {/* Plan Status */}
          {user && (
            <div className="px-4 mb-4">
              <motion.div 
                className={`p-4 rounded-lg ${planFeatures[userPlan].color} relative overflow-hidden`}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  animate={{
                    opacity: [0.1, 0.2, 0.1],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <div className="flex items-center gap-3 mb-2">
                  <PlanIcon className="w-5 h-5" />
                  <span className="font-medium">{planFeatures[userPlan].name}</span>
                </div>
                <div className="text-sm space-y-1">
                  {planFeatures[userPlan].features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-current" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                {(userPlan === 'free' || userPlan === 'pro') && (
                  <AnimatedButton
                    onClick={() => setShowPricingPlans(true)}
                    variant="secondary"
                    className={`w-full mt-3 py-1.5 text-sm font-medium ${
                      userPlan === 'pro' 
                        ? 'border-yellow-400 text-yellow-600 hover:bg-yellow-50'
                        : 'bg-white/90 hover:bg-white text-indigo-600'
                    }`}
                  >
                    {userPlan === 'pro' ? 'Upgrade to Premium' : 'Upgrade Plan'}
                  </AnimatedButton>
                )}
              </motion.div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => {
              const isActive = isCurrentPath(item.href);
              const isLocked = item.requiresPro && !isProMember && !isPremiumMember;
              const isPersonalAI = item.name === 'Personal AI';

              return (
                <div key={item.name} className="relative mb-2">
                  <motion.button
                    onClick={() => handleNavigation(item.href, item.requiresPro)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors relative group ${
                      item.highlight ? 'mt-2' : ''
                    } ${getTabStyles(isActive, !!item.highlight, isLocked, item.isPremiumFeature)}`}
                    whileHover={
                      isPersonalAI && isLocked
                        ? {
                            scale: 1.02,
                            transition: { duration: 0.2 },
                          }
                        : undefined
                    }
                  >
                    {item.highlight && !isActive && !isLocked && (
                      <motion.div
                        className={`absolute inset-0 rounded-lg ${
                          item.isPremiumFeature && isPremiumMember
                            ? 'bg-gradient-to-r from-yellow-600/10 to-yellow-700/10'
                            : 'bg-gradient-to-r from-indigo-600/10 to-indigo-700/10'
                        }`}
                        animate={{
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    )}
                    {isPersonalAI && isLocked && (
                      <>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 via-purple-400/20 to-indigo-400/20 rounded-lg"
                          animate={{
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                          }}
                          transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                          style={{
                            backgroundSize: '200% 100%',
                          }}
                        />
                        <motion.div
                          className="absolute -right-1 -top-1"
                          animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        >
                          <span className="bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                            NEW
                          </span>
                        </motion.div>
                      </>
                    )}
                    <item.icon
                      className={`w-5 h-5 mr-3 ${item.highlight && isActive ? 'text-white' : ''}`}
                    />
                    <span className="flex-1 text-left whitespace-nowrap">{item.name}</span>
                    {item.badge && (isProMember || isPremiumMember) && (
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 text-[10px] leading-none rounded font-medium ml-1.5 ${item.badge.color}`}
                      >
                        <item.badge.icon className="w-2.5 h-2.5 mr-0.5" />
                        {item.badge.text}
                      </span>
                    )}
                    {isLocked && isPersonalAI ? (
                      <motion.div
                        className="flex items-center gap-1"
                        animate={{ x: [0, 3, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        <Lock className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs text-indigo-400 font-medium">Unlock</span>
                      </motion.div>
                    ) : isLocked ? (
                      <Lock className="w-4 h-4 opacity-50" />
                    ) : null}
                  </motion.button>
                </div>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                    {user.email?.[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.email}
                  </p>
                </div>
                <motion.button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Settings className="w-5 h-5" />
                </motion.button>
              </div>
            ) : (
              <AnimatedButton variant="primary" onClick={() => navigate('/signin')} className="w-full">
                Sign In to Access
              </AnimatedButton>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Settings Menu */}
      {user && <SettingsMenu isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />}

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="py-8 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Pricing Plans Modal */}
      <PricingPlansModal isOpen={showPricingPlans} onClose={() => setShowPricingPlans(false)} />
    </div>
  );
};