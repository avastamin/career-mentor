import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Brain, Loader } from 'lucide-react';
import { CareerProfileSchema, type CareerProfile, type CareerAnalysis } from '../lib/types';
import { analyzeCareer } from '../lib/ai';

export const CareerAnalysisForm = () => {
  const [analysis, setAnalysis] = React.useState<CareerAnalysis | null>(null);
  const [loading, setLoading] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CareerProfile>({
    resolver: zodResolver(CareerProfileSchema)
  });

  const onSubmit = async (data: CareerProfile) => {
    setLoading(true);
    try {
      const result = await analyzeCareer(data);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {!analysis ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="feature-card"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="icon-container">
              <Brain className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Career Analysis</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
      ) : (
        <AnalysisResults analysis={analysis} onReset={() => setAnalysis(null)} />
      )}
    </div>
  );
};

const AnalysisResults = ({ 
  analysis, 
  onReset 
}: { 
  analysis: CareerAnalysis; 
  onReset: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="feature-card">
        <h3 className="text-2xl font-bold mb-4">Career Path Analysis</h3>
        <p className="text-gray-600 mb-6">{analysis.careerPath}</p>
        
        <h4 className="font-semibold mb-2">Skill Gaps to Address:</h4>
        <ul className="list-disc list-inside mb-6 space-y-2">
          {analysis.skillGaps.map((skill, index) => (
            <li key={index} className="text-gray-600">{skill}</li>
          ))}
        </ul>

        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(analysis.recommendations).map(([period, items]) => (
            <div key={period} className="feature-card">
              <h4 className="font-semibold mb-3 capitalize">{period} Actions</h4>
              <ul className="space-y-2">
                {items.map((item, index) => (
                  <li key={index} className="text-gray-600 text-sm">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="feature-card">
        <h3 className="text-2xl font-bold mb-4">Potential Roles</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {analysis.potentialRoles.map((role, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">{role}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="feature-card">
        <h3 className="text-2xl font-bold mb-4">Learning Resources</h3>
        <div className="grid gap-4">
          {analysis.learningResources.map((resource, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">{resource.title}</h4>
                <p className="text-sm text-gray-600 capitalize">{resource.type}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`
                  px-2 py-1 rounded text-xs font-medium
                  ${resource.priority === 'high' ? 'bg-red-100 text-red-700' : 
                    resource.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-green-100 text-green-700'}
                `}>
                  {resource.priority} priority
                </span>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm py-1"
                >
                  Access
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onReset}
        className="btn-secondary w-full"
      >
        Start New Analysis
      </button>
    </motion.div>
  );
};