import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Brain, ArrowRight, Target, Star, Sparkles, BookOpen, ChevronRight, Lightbulb } from 'lucide-react';
import { CareerProfileSchema, type CareerProfile } from '../../../lib/types';
import { quickAnalyzeCareer } from '../../../lib/ai';
import { AnimatedCard } from '../../AnimatedCard';
import { AnimatedButton } from '../../AnimatedButton';
import { useNavigate } from 'react-router-dom';

export const DemoAnalysis = () => {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<Awaited<ReturnType<typeof quickAnalyzeCareer>> | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CareerProfile>({
    resolver: zodResolver(CareerProfileSchema)
  });

  const onSubmit = async (data: CareerProfile) => {
    setLoading(true);
    try {
      const result = await quickAnalyzeCareer(data);
      setAnalysis(result);
    } catch (error) {
      console.error('Quick analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-600 mb-6">
          <Lightbulb className="w-5 h-5" />
          <span className="text-sm font-medium">Free Plan Demo</span>
        </div>
        <h2 className="text-2xl font-bold mb-4">Try Our Demo Analysis</h2>
        <p className="text-gray-600 mb-4">
          Get a preview of our AI-powered career analysis. Upgrade to Pro for comprehensive insights and personalized guidance.
        </p>
      </div>

      {!analysis ? (
        <AnimatedCard>
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
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
                    Key Skills
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
              </div>

              <input type="hidden" {...register('interests')} value="To be filled" />
              <input type="hidden" {...register('education')} value="To be filled" />
              <input type="hidden" {...register('industryPreference')} value="To be filled" />

              <div className="flex justify-center">
                <AnimatedButton
                  type="submit"
                  variant="primary"
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Brain className="w-5 h-5" />
                      </motion.div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze My Career
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </AnimatedButton>
              </div>
            </form>
          </div>
        </AnimatedCard>
      ) : (
        <div className="space-y-6">
          <AnimatedCard>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4">Career Direction</h3>
              <p className="text-gray-700">{analysis.direction}</p>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3">Key Skills</h4>
                  <ul className="space-y-2">
                    {analysis.skills.map((skill, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3">Growth Score</h4>
                  <div className="relative pt-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                          Potential
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-indigo-600">
                          {analysis.growthScore}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${analysis.growthScore}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>

          <motion.div
            className="p-8 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl text-white text-center relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_var(--tw-gradient-stops))] from-white/10 to-transparent"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.3, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.div
              className="absolute top-4 right-4"
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-8 h-8 text-indigo-300" />
            </motion.div>

            <h4 className="text-2xl font-bold mb-3">Unlock Full Analysis</h4>
            <p className="text-indigo-100 mb-6 max-w-md mx-auto">
              Upgrade to Pro for comprehensive career insights, AI-powered mentorship, and personalized learning paths.
            </p>
            
            <AnimatedButton
              onClick={() => navigate('/pricing')}
              variant="secondary"
              className="bg-white text-indigo-600 hover:bg-indigo-50 group"
            >
              Upgrade to Pro
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </AnimatedButton>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-indigo-200">
              <div className="flex items-center justify-center gap-2">
                <Target className="w-4 h-4" />
                <span>Detailed Skill Analysis</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Personalized Learning Paths</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Brain className="w-4 h-4" />
                <span>AI Career Guidance</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Star className="w-4 h-4" />
                <span>Expert Mentorship</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};