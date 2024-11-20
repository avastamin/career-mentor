import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AnimatedButton } from '../../AnimatedButton';
import { supabase } from '../../../lib/supabase';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!user || loading) return;
    if (confirmation !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Delete user data using RPC function
      const { error: deleteError } = await supabase.rpc('delete_user_with_data');
      if (deleteError) throw deleteError;

      // Force sign out and clear all session data
      const { error: signOutError } = await supabase.auth.signOut({
        scope: 'global' // Sign out from all tabs/windows
      });
      if (signOutError) throw signOutError;

      // Clear any cached auth state
      await supabase.auth.refreshSession();

      // Close modal first
      onClose();

      // Navigate to home page and replace history
      navigate('/', {
        replace: true,
        state: { message: 'Your account has been successfully deleted.' }
      });

    } catch (err) {
      console.error('Error deleting account:', err);
      setError('Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !loading && onClose()}
          />

          <motion.div
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 relative z-50"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Delete Account</h3>
            </div>

            <p className="text-gray-600 mb-6">
              This action cannot be undone. All your data, including career analyses,
              settings, and preferences will be permanently deleted.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type DELETE to confirm
              </label>
              <input
                type="text"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                placeholder="DELETE"
                disabled={loading}
              />
            </div>

            <div className="flex gap-3">
              <AnimatedButton
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </AnimatedButton>

              <AnimatedButton
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400"
                disabled={loading || confirmation !== 'DELETE'}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </div>
                ) : (
                  'Delete Account'
                )}
              </AnimatedButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};