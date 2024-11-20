import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MoreVertical, 
  Trash2, 
  Settings, 
  Shield, 
  Mail, 
  Crown, 
  Zap,
  Star,
  Brain
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { AnimatedCard } from '../../AnimatedCard';
import { ConfirmationModal } from './ConfirmationModal';
import { Menu } from '@headlessui/react';
import { updateAnalysisCredits } from '../../../lib/admin';

interface User {
  id: string;
  email: string;
  role: string;
  subscription_status: string | null;
  analysis_credits?: number | null;
  created_at: string;
}

interface SetCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (credits: number) => Promise<void>;
  currentCredits?: number | null;
  userEmail?: string;
}

const SetCreditsModal: React.FC<SetCreditsModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentCredits,
  userEmail
}) => {
  const [credits, setCredits] = useState(currentCredits?.toString() || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCredits(currentCredits?.toString() || '');
  }, [currentCredits]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const creditsNum = parseInt(credits);
    if (isNaN(creditsNum) || creditsNum < 0) {
      setError('Please enter a valid number of credits');
      return;
    }

    setLoading(true);
    try {
      await onConfirm(creditsNum);
      onClose();
    } catch (err) {
      setError('Failed to update credits');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={`fixed inset-0 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Brain className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Set Analysis Credits</h2>
            {userEmail && (
              <p className="text-sm text-gray-600">for {userEmail}</p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Credits
            </label>
            <input
              type="number"
              min="0"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter number of credits"
            />
            <p className="mt-2 text-sm text-gray-500">
              This will override the user's role-based analysis limits.
              Set to 0 to remove custom credits.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Credits'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    type: 'delete' | 'role' | null;
    userId: string | null;
    newRole?: string;
  }>({
    isOpen: false,
    type: null,
    userId: null
  });

  const [creditsModal, setCreditsModal] = useState<{
    isOpen: boolean;
    userId: string | null;
    currentCredits?: number | null;
    userEmail?: string;
  }>({
    isOpen: false,
    userId: null,
    currentCredits: null,
    userEmail: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase.rpc('admin_get_users');
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setConfirmation({
      isOpen: true,
      type: 'delete',
      userId
    });
  };

  const handleChangeRole = (userId: string, newRole: string) => {
    setConfirmation({
      isOpen: true,
      type: 'role',
      userId,
      newRole
    });
  };

  const handleSetCredits = (userId: string, currentCredits?: number | null, userEmail?: string) => {
    setCreditsModal({
      isOpen: true,
      userId,
      currentCredits,
      userEmail
    });
  };

  const handleUpdateCredits = async (credits: number) => {
    if (!creditsModal.userId) return;

    try {
      await updateAnalysisCredits(creditsModal.userId, credits);
      setUsers(users.map(user => 
        user.id === creditsModal.userId 
          ? { ...user, analysis_credits: credits }
          : user
      ));
    } catch (error) {
      console.error('Error updating credits:', error);
      throw error;
    }
  };

  const handleConfirmedAction = async () => {
    if (!confirmation.userId || !confirmation.type) return;

    setActionLoading(true);
    try {
      if (confirmation.type === 'delete') {
        const { error } = await supabase.rpc('admin_delete_user', {
          target_user_id: confirmation.userId
        });
        if (error) throw error;
        setUsers(users.filter(user => user.id !== confirmation.userId));
      } else if (confirmation.type === 'role' && confirmation.newRole) {
        const { error } = await supabase.rpc('admin_update_user_role', {
          target_user_id: confirmation.userId,
          new_role: confirmation.newRole
        });
        if (error) throw error;
        setUsers(users.map(user => 
          user.id === confirmation.userId 
            ? { ...user, role: confirmation.newRole! }
            : user
        ));
      }
    } catch (error) {
      console.error('Error performing action:', error);
      setError(`Failed to ${confirmation.type} user`);
    } finally {
      setActionLoading(false);
      setConfirmation({ isOpen: false, type: null, userId: null });
    }
  };

  const getConfirmationProps = () => {
    const user = users.find(u => u.id === confirmation.userId);
    
    if (!user) return {};

    switch (confirmation.type) {
      case 'delete':
        return {
          title: 'Delete User',
          message: `Are you sure you want to delete ${user.email}? This action cannot be undone.`,
          confirmText: 'Delete User',
          type: 'danger'
        };
      case 'role':
        return {
          title: 'Change User Role',
          message: `Are you sure you want to change ${user.email}'s role to ${confirmation.newRole}?`,
          confirmText: 'Change Role',
          type: 'warning'
        };
      default:
        return {};
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return Shield;
      case 'pro':
        return Crown;
      case 'premium':
        return Zap;
      default:
        return Star;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <AnimatedCard>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">User Management</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {users.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700'
                            : user.role === 'pro'
                            ? 'bg-green-100 text-green-700'
                            : user.role === 'premium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role.toUpperCase()}
                        </span>
                        {user.subscription_status && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.subscription_status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {user.subscription_status}
                          </span>
                        )}
                        {user.analysis_credits !== null && user.analysis_credits !== undefined && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                            <Brain className="w-3 h-3" />
                            {user.analysis_credits} credits
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Menu as="div" className="relative">
                  <Menu.Button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                    {['free', 'pro', 'premium', 'admin'].map((role) => {
                      if (role === user.role) return null;
                      const RoleIcon = getRoleIcon(role);
                      return (
                        <Menu.Item key={role}>
                          {({ active }) => (
                            <button
                              className={`${
                                active ? 'bg-gray-50' : ''
                              } flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700`}
                              onClick={() => handleChangeRole(user.id, role)}
                            >
                              <RoleIcon className="w-4 h-4" />
                              Change to {role.charAt(0).toUpperCase() + role.slice(1)}
                            </button>
                          )}
                        </Menu.Item>
                      );
                    })}
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-gray-50' : ''
                          } flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700`}
                          onClick={() => handleSetCredits(user.id, user.analysis_credits, user.email)}
                        >
                          <Brain className="w-4 h-4" />
                          Set Analysis Credits
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-gray-50' : ''
                          } flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600`}
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete User
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedCard>

      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={() => setConfirmation({ isOpen: false, type: null, userId: null })}
        onConfirm={handleConfirmedAction}
        isLoading={actionLoading}
        {...getConfirmationProps()}
      />

      <SetCreditsModal
        isOpen={creditsModal.isOpen}
        onClose={() => setCreditsModal({ isOpen: false, userId: null })}
        onConfirm={handleUpdateCredits}
        currentCredits={creditsModal.currentCredits}
        userEmail={creditsModal.userEmail}
      />
    </>
  );
};