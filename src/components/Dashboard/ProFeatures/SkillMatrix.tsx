import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, Users, BookOpen, ChevronRight, Star } from 'lucide-react';
import { AnimatedCard } from '../../AnimatedCard';

interface SkillMatrixProps {
  skillMatrix: {
    technical: {
      current: string[];
      required: string[];
      gaps: string[];
    };
    soft: {
      current: string[];
      required: string[];
      gaps: string[];
    };
    leadership: {
      current: string[];
      required: string[];
      gaps: string[];
    };
  };
}

export const SkillMatrix = ({ skillMatrix }: SkillMatrixProps) => {
  if (!skillMatrix) return null;

  const categories = [
    { 
      title: 'Technical Skills', 
      icon: Brain,
      color: 'indigo',
      data: skillMatrix.technical || { current: [], required: [], gaps: [] }
    },
    { 
      title: 'Soft Skills', 
      icon: Users,
      color: 'blue',
      data: skillMatrix.soft || { current: [], required: [], gaps: [] }
    },
    { 
      title: 'Leadership', 
      icon: Target,
      color: 'green',
      data: skillMatrix.leadership || { current: [], required: [], gaps: [] }
    }
  ];

  const sections = [
    { title: 'Current Skills', key: 'current', color: 'green' },
    { title: 'Required Skills', key: 'required', color: 'blue' },
    { title: 'Skill Gaps', key: 'gaps', color: 'red' }
  ];

  return (
    <AnimatedCard>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Star className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Skill Matrix Analysis</h2>
            <p className="text-gray-600">Comprehensive breakdown of your skill development needs</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-lg bg-${category.color}-100 flex items-center justify-center`}>
                  <category.icon className={`w-5 h-5 text-${category.color}-600`} />
                </div>
                <h3 className="font-semibold text-gray-900">{category.title}</h3>
              </div>

              <div className="space-y-6">
                {sections.map((section, sectionIndex) => (
                  <div key={sectionIndex}>
                    <div className="flex items-center gap-2 mb-3">
                      <ChevronRight className={`w-4 h-4 text-${section.color}-500`} />
                      <h4 className="font-medium text-gray-700">{section.title}</h4>
                    </div>
                    <div className="space-y-2">
                      {category.data[section.key].map((skill, skillIndex) => (
                        <motion.div
                          key={skillIndex}
                          className={`p-3 bg-${section.color}-50 text-${section.color}-700 rounded-lg text-sm`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: skillIndex * 0.05 }}
                          whileHover={{ 
                            x: 4,
                            transition: { type: "spring", stiffness: 300 }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span>{skill}</span>
                            <div className="flex items-center gap-1">
                              {[...Array(section.key === 'current' ? 3 : section.key === 'required' ? 4 : 2)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-1.5 h-1.5 rounded-full bg-${section.color}-${i < 2 ? '400' : '300'}`}
                                />
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-indigo-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Development Tips</h4>
              <p className="text-sm text-gray-600">
                Focus on bridging skill gaps while maintaining and improving your current strengths. 
                Consider pursuing certifications or training programs for required skills.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};