import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Compass, LayoutDashboard, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { AnimatedButton } from './AnimatedButton';
import { useTheme } from '../contexts/ThemeContext';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const isDashboard = location.pathname.startsWith('/dashboard');

  // Only hide header on dashboard
  if (isDashboard) {
    return null;
  }

  const handleNavigation = (item: string) => {
    if (item === 'Features') {
      // Scroll to pricing section which contains features
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (item === 'Contact') {
      navigate('/contact');
    } else if (item === 'Resources') {
      if (!user) {
        navigate('/signin');
      } else {
        navigate('/dashboard/learning');
      }
    }
    setIsMenuOpen(false);
  };

  const menuItems = ['Features', 'Contact', 'Resources'];

  const handleDashboardClick = () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    // Navigate to admin dashboard if user is admin, otherwise regular dashboard
    if (isAdmin) {
      navigate('/dashboard/admin');
    } else {
      navigate('/dashboard/career-analysis');
    }
  };

  return (
    <motion.header 
      className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <nav className="h-16 flex items-center justify-between">
        <div className="w-64 pl-6">
          <Link to="/" className="flex items-center gap-3">
            <motion.div 
              className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.7 }}
            >
              <Compass className="w-4 h-4 text-indigo-500" />
            </motion.div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-500">
              CareerMentorAI
            </span>
          </Link>
        </div>
        
        <div className="flex-1 flex justify-end pr-6">
          <div className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              <motion.button
                key={item}
                onClick={() => handleNavigation(item)}
                className="text-gray-600 hover:text-indigo-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </motion.button>
            ))}
            <div className="flex items-center gap-3">
              <AnimatedButton
                variant="secondary"
                onClick={handleDashboardClick}
                className="flex items-center gap-2"
              >
                {isAdmin ? (
                  <>
                    <Shield className="w-4 h-4" />
                    Admin Dashboard
                  </>
                ) : (
                  <>
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </>
                )}
              </AnimatedButton>
              {!user && (
                <AnimatedButton
                  onClick={() => navigate('/signin')}
                  variant="primary"
                >
                  Sign In
                </AnimatedButton>
              )}
            </div>
          </div>

          <motion.button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden absolute left-0 right-0 top-16 bg-white border-b border-gray-100 shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="p-4 flex flex-col space-y-4">
            {menuItems.map((item) => (
              <motion.button
                key={item}
                onClick={() => handleNavigation(item)}
                className="text-gray-600 hover:text-indigo-600 transition-colors text-left"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {item}
              </motion.button>
            ))}
            <AnimatedButton
              variant="secondary"
              onClick={handleDashboardClick}
              className="w-full flex items-center justify-center gap-2"
            >
              {isAdmin ? (
                <>
                  <Shield className="w-4 h-4" />
                  Admin Dashboard
                </>
              ) : (
                <>
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </>
              )}
            </AnimatedButton>
            {!user && (
              <AnimatedButton
                onClick={() => {
                  navigate('/signin');
                  setIsMenuOpen(false);
                }}
                variant="primary"
                className="w-full"
              >
                Sign In
              </AnimatedButton>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};