import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Brain, Loader } from 'lucide-react';
import type { CareerProfile } from '../../lib/types';
import { CareerProfileSchema } from '../../lib/types';

interface CareerFormProps {
  onSubmit: (data: CareerProfile) => Promise<void>;
  loading: boolean;
}

export const CareerForm: React.FC<CareerFormProps> = ({ onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CareerProfile>({
    resolver: zodResolver(CareerProfileSchema)
  });

  const handleFormSubmit = async (data: any) => {
    // Convert comma-separated strings to arrays
    const transformedData: CareerProfile = {
      ...data,
      skills: typeof data.skills === 'string' ? 
        data.skills.split(',').map((s: string) => s.trim()).filter(Boolean) :
        data.skills,
      interests: typeof data.interests === 'string' ? 
        data.interests.split(',').map((s: string) => s.trim()).filter(Boolean) :
        data.interests
    };

    await onSubmit(transformedData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="feature-card"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="icon-container">
          <Brain className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold">Career Analysis</h2>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Role
          </label>
          <input
            {...register('currentRole')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., Software Developer"
          />
          {errors.currentRole && (
            <p className="text-red-500 text-sm mt-1">{errors.currentRole.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Years of Experience
          </label>
          <input
            type="number"
            {...register('yearsExperience', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., 5"
          />
          {errors.yearsExperience && (
            <p className="text-red-500 text-sm mt-1">{errors.yearsExperience.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skills (comma-separated)
          </label>
          <input
            {...register('skills')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., JavaScript, React, Node.js"
          />
          {errors.skills && (
            <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Interests (comma-separated)
          </label>
          <input
            {...register('interests')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., AI, Cloud Computing, Mobile Development"
          />
          {errors.interests && (
            <p className="text-red-500 text-sm mt-1">{errors.interests.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Desired Role
          </label>
          <input
            {...register('desiredRole')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., Senior Software Engineer"
          />
          {errors.desiredRole && (
            <p className="text-red-500 text-sm mt-1">{errors.desiredRole.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Education
          </label>
          <input
            {...register('education')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., BS in Computer Science"
          />
          {errors.education && (
            <p className="text-red-500 text-sm mt-1">{errors.education.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Industry Preference
          </label>
          <input
            {...register('industryPreference')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., Technology, Healthcare"
          />
          {errors.industryPreference && (
            <p className="text-red-500 text-sm mt-1">{errors.industryPreference.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze My Career'
          )}
        </button>
      </form>
    </motion.div>
  );
};