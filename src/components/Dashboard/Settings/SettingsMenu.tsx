import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  LogOut, 
  Moon,
  HelpCircle,
  X,
  Trash2,
  Loader
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AnimatedButton } from '../../AnimatedButton';
import { DeleteAccountModal } from './DeleteAccountModal';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signOut } = useAuth();

  const menuItems = [
    { icon: User, label: 'Profile Settings', action: () => navigate('/dashboard/profile') },
    { icon: Bell, label: 'Notifications', action: () => navigate('/dashboard/notifications') },
    { icon: Shield, label: 'Privacy & Security', action: () => navigate('/dashboard/privacy') },
    { icon: Moon, label: 'Appearance', action: () => navigate('/dashboard/appearance') },
    { icon: HelpCircle, label: 'Help & Support', action: () => window.open('/support', '_blank') },
  ];

  const handleSignOut = async () => {
    if (isSigningOut) return;

    try {
      setIsSigningOut(true);
      setError(null);

      // Close menu first
      onClose();

      // Wait for menu animation
      await new Promise(resolve => setTimeout(resolve, 100));

      // Perform sign out
      const { error: signOutError } = await signOut();
      if (signOutError) {
        setError(signOutError);
        setIsSigningOut(false);
      }
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out. Please try again.');
      setIsSigningOut(false);
    }
  };

  const menuVariants = {
    hidden: { 
      opacity: 0,
      x: -20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    visible: { 
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.div
              className="fixed bottom-20 left-4 lg:left-24 bg-white rounded-xl shadow-xl p-4 w-72 z-50"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-900">
                  <Settings className="w-5 h-5" />
                  <h3 className="font-semibold">Settings</h3>
                </div>
                <motion.button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={index}
                    className="w-full flex items-center gap-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => {
                      item.action();
                      onClose();
                    }}
                    variants={itemVariants}
                    whileHover={{ x: 4 }}
                    disabled={isSigningOut}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </motion.button>
                ))}

                <div className="my-3 border-t border-gray-100" />

                <motion.button
                  className="w-full flex items-center gap-3 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                  onClick={handleSignOut}
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  disabled={isSigningOut}
                >
                  {isSigningOut ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span className="font-medium">Signing Out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Sign Out</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  className="w-full flex items-center gap-3 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                  onClick={() => setShowDeleteModal(true)}
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  disabled={isSigningOut}
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="font-medium">Delete Account</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <DeleteAccountModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
      />
    </>
  );
};