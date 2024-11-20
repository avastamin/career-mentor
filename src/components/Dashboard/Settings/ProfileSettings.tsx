import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { AnimatedButton } from '../../AnimatedButton';

export const ProfileSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showEmail, setShowEmail] = useState(false);

  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@');
    const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 1);
    return `${maskedUsername}@${domain}`;
  };

  return (
    <>
      <Helmet>
        <title>Profile Settings - CareerMentor</title>
      </Helmet>

      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <User className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600">Manage your account information</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                  {showEmail ? user?.email : maskEmail(user?.email || '')}
                </div>
                <button
                  onClick={() => setShowEmail(!showEmail)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  {showEmail ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Created
              </label>
              <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                {new Date(user?.created_at || '').toLocaleDateString()}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <AnimatedButton
                variant="secondary"
                onClick={() => navigate('/dashboard/privacy')}
                className="text-sm"
              >
                Change Password
              </AnimatedButton>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};