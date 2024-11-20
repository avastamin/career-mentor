import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Moon, Sun, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';

export const AppearanceSettings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <Helmet>
        <title>Appearance Settings - CareerMentor</title>
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
              {theme === 'dark' ? (
                <Moon className="w-8 h-8 text-indigo-600" />
              ) : (
                <Sun className="w-8 h-8 text-indigo-600" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Appearance</h1>
              <p className="text-gray-600">Customize your visual experience</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Theme
              </label>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'light'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center mb-3">
                    <Sun className={`w-6 h-6 ${
                      theme === 'light' ? 'text-indigo-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <p className={`text-sm font-medium ${
                    theme === 'light' ? 'text-indigo-600' : 'text-gray-600'
                  }`}>
                    Light Mode
                  </p>
                </motion.button>

                <motion.button
                  onClick={() => theme === 'light' && toggleTheme()}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center mb-3">
                    <Moon className={`w-6 h-6 ${
                      theme === 'dark' ? 'text-indigo-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <p className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-indigo-600' : 'text-gray-600'
                  }`}>
                    Dark Mode
                  </p>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};