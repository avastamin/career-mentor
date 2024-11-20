import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DashboardLayout } from '../components/Dashboard/DashboardLayout';
import { AnimatedButton } from '../components/AnimatedButton';
import { Lock } from 'lucide-react';

export const DashboardPage = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect free users to analysis tab by default
  useEffect(() => {
    if (user && userProfile?.role === 'free' && location.pathname === '/dashboard') {
      navigate('/dashboard/career-analysis', { replace: true });
    }
  }, [user, userProfile, location.pathname, navigate]);

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>{user ? 'Dashboard' : 'Dashboard Preview'} - CareerMentorAI</title>
        <meta 
          name="description" 
          content={user 
            ? "View your career progress, skill development, and personalized recommendations." 
            : "Preview the CareerMentor dashboard features and unlock your career potential."
          } 
        />
      </Helmet>

      <DashboardLayout>
        <AnimatePresence mode="wait">
          <motion.div
            key={user ? 'authenticated' : 'unauthenticated'}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full relative"
          >
            {user ? (
              <motion.div
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="h-full min-h-screen"
              >
                <Outlet />
              </motion.div>
            ) : (
              <motion.div
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="h-full min-h-screen flex items-center justify-center"
              >
                <div className="w-full max-w-md mx-auto px-4">
                  <div className="text-center">
                    <motion.div
                      className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Lock className="w-10 h-10 text-indigo-600" />
                    </motion.div>
                    <h2 className="text-3xl font-bold mb-4">Sign In to Access Dashboard</h2>
                    <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                      Create an account or sign in to unlock all features and start your personalized career journey.
                    </p>
                    <AnimatedButton
                      variant="primary"
                      onClick={() => navigate('/signin')}
                      className="inline-flex items-center gap-2 text-lg px-8 py-4"
                    >
                      Sign In to Continue
                    </AnimatedButton>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </DashboardLayout>
    </>
  );
};