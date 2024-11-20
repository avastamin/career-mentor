import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthForm } from '../components/Auth/AuthForm';

export const AuthPage = () => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const isSignUp = location.pathname === '/signup';

  // If user is already authenticated, redirect to dashboard
  if (user && !loading) {
    return <Navigate to="/dashboard/overview" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{isSignUp ? 'Sign Up' : 'Sign In'} - CareerMentor</title>
        <meta 
          name="description" 
          content={isSignUp 
            ? "Create your CareerMentor account and start your career journey today" 
            : "Sign in to your CareerMentor account"
          } 
        />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center"
      >
        <div className="container mx-auto px-4 max-w-md pt-32 pb-16">
          <AuthForm defaultIsLogin={!isSignUp} />
        </div>
      </motion.div>
    </>
  );
};