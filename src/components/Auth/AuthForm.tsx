import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Chrome, Mail, Lock, User, ArrowRight, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AnimatedButton } from '../AnimatedButton';

const authSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type AuthFormData = z.infer<typeof authSchema>;

interface AuthFormProps {
  defaultIsLogin?: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({ defaultIsLogin = true }) => {
  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, signInWithGoogle, error: contextError } = useAuth();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema)
  });

  const onSubmit = async (data: AuthFormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setAuthError(null);

    try {
      if (isLogin) {
        const { error } = await signIn(data.email, data.password);
        if (error) {
          setAuthError(error.message);
          setIsSubmitting(false);
          return;
        }
      } else {
        const { error } = await signUp(data.email, data.password, {
          full_name: data.name
        });
        if (error) {
          setAuthError(error.message);
          setIsSubmitting(false);
          return;
        }
      }

      // Clear form
      reset();
    } catch (error) {
      setAuthError('An unexpected error occurred');
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (error) {
      setAuthError('Failed to sign in with Google');
      setIsSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    setAuthError(null);
    const newPath = isLogin ? '/signup' : '/signin';
    navigate(newPath);
    setIsLogin(!isLogin);
  };

  // Update isLogin state when location changes
  React.useEffect(() => {
    setIsLogin(location.pathname === '/signin');
  }, [location]);

  // Show context error if present
  React.useEffect(() => {
    if (contextError) {
      setAuthError(contextError);
    }
  }, [contextError]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-xl p-8"
    >
      <h1 className="text-2xl font-bold mb-6">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h1>

      {authError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('name')}
                type="text"
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Your full name"
                disabled={isSubmitting}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('email')}
              type="email"
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
              disabled={isSubmitting}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('password')}
              type="password"
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              disabled={isSubmitting}
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <AnimatedButton
          type="submit"
          variant="primary"
          className="w-full flex items-center justify-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
            </>
          ) : (
            <>
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </AnimatedButton>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6">
          <AnimatedButton
            variant="secondary"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
          >
            <Chrome className="w-5 h-5" />
            <span>Google</span>
          </AnimatedButton>
        </div>
      </div>

      <div className="mt-6 text-center text-sm">
        <button
          type="button"
          onClick={toggleAuthMode}
          className="text-indigo-600 hover:text-indigo-500 transition-colors"
          disabled={isSubmitting}
        >
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </motion.div>
  );
};