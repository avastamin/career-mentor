import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, MapPin, Calendar, Link } from 'lucide-react';
import { AnimatedCard } from '../../AnimatedCard';
import { AnimatedButton } from '../../AnimatedButton';
import { AddSkillModal } from './AddSkillModal';
import { SkillSuggestions } from './SkillSuggestions';
import { AchievementGenerator } from './AchievementGenerator';

interface ResumeEditorProps {
  resumeData: any;
  onUpdateResume: (data: any) => void;
  careerAnalysis: any;
  template: string;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({
  resumeData,
  onUpdateResume,
  careerAnalysis,
  template
}) => {
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);

  const handleInputChange = (section: string, field: string, value: string) => {
    onUpdateResume({
      ...resumeData,
      [section]: {
        ...resumeData[section],
        [field]: value
      }
    });
  };

  const handleArrayItemAdd = (section: string, item: any) => {
    onUpdateResume({
      ...resumeData,
      [section]: [...(resumeData[section] || []), item]
    });
  };

  const handleArrayItemRemove = (section: string, index: number) => {
    onUpdateResume({
      ...resumeData,
      [section]: resumeData[section].filter((_: any, i: number) => i !== index)
    });
  };

  const handleAddSkill = (skill: string) => {
    if (!resumeData.skills.includes(skill)) {
      handleArrayItemAdd('skills', skill);
    }
  };

  // Get template-specific configuration
  const getTemplateConfig = () => {
    switch (template) {
      case 'modern':
        return {
          spacing: 'space-y-8',
          sectionClass: 'bg-white rounded-lg shadow-sm p-6',
          inputClass: 'border-gray-300 focus:border-indigo-500',
          headingClass: 'text-lg font-semibold text-gray-900',
        };
      case 'classic':
        return {
          spacing: 'space-y-6',
          sectionClass: 'border-b border-gray-200 pb-6',
          inputClass: 'border-gray-200 focus:border-gray-400',
          headingClass: 'text-xl font-serif text-gray-800',
        };
      case 'creative':
        return {
          spacing: 'space-y-10',
          sectionClass: 'bg-gradient-to-br from-purple-50 to-white p-8 rounded-xl',
          inputClass: 'border-purple-200 focus:border-purple-500',
          headingClass: 'text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600',
        };
      default:
        return {
          spacing: 'space-y-8',
          sectionClass: 'bg-white rounded-lg shadow-sm p-6',
          inputClass: 'border-gray-300 focus:border-indigo-500',
          headingClass: 'text-lg font-semibold text-gray-900',
        };
    }
  };

  const config = getTemplateConfig();

  return (
    <div className="relative">
      <AnimatedCard>
        <div className={config.spacing}>
          {/* Personal Information */}
          <section className={config.sectionClass}>
            <h3 className={config.headingClass}>Personal Information</h3>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={resumeData.personalInfo.name}
                  onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg ${config.inputClass}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Professional Title
                </label>
                <input
                  type="text"
                  value={resumeData.personalInfo.title}
                  onChange={(e) => handleInputChange('personalInfo', 'title', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg ${config.inputClass}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={resumeData.personalInfo.email}
                  onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg ${config.inputClass}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={resumeData.personalInfo.phone}
                  onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg ${config.inputClass}`}
                />
              </div>
              {template !== 'classic' && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg ${config.inputClass}`}
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professional Summary
              </label>
              <textarea
                value={resumeData.personalInfo.summary}
                onChange={(e) => handleInputChange('personalInfo', 'summary', e.target.value)}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg ${config.inputClass}`}
              />
            </div>
          </section>

          {/* Experience */}
          <section className={config.sectionClass}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={config.headingClass}>Experience</h3>
              <AnimatedButton
                variant="secondary"
                onClick={() => handleArrayItemAdd('experience', {
                  title: '',
                  company: '',
                  location: '',
                  startDate: '',
                  endDate: '',
                  description: '',
                  achievements: []
                })}
                className="text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Experience
              </AnimatedButton>
            </div>
            <div className="space-y-4">
              {resumeData.experience.map((exp: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 border rounded-lg ${
                    template === 'creative' ? 'border-purple-200' : 'border-gray-200'
                  }`}
                >
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={exp.title}
                      onChange={(e) => {
                        const newExp = [...resumeData.experience];
                        newExp[index].title = e.target.value;
                        onUpdateResume({ ...resumeData, experience: newExp });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg ${config.inputClass}`}
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...resumeData.experience];
                        newExp[index].company = e.target.value;
                        onUpdateResume({ ...resumeData, experience: newExp });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg ${config.inputClass}`}
                    />
                    {template !== 'classic' && (
                      <>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Location"
                            value={exp.location}
                            onChange={(e) => {
                              const newExp = [...resumeData.experience];
                              newExp[index].location = e.target.value;
                              onUpdateResume({ ...resumeData, experience: newExp });
                            }}
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg ${config.inputClass}`}
                          />
                        </div>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Duration (e.g., Jan 2020 - Present)"
                            value={exp.duration}
                            onChange={(e) => {
                              const newExp = [...resumeData.experience];
                              newExp[index].duration = e.target.value;
                              onUpdateResume({ ...resumeData, experience: newExp });
                            }}
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg ${config.inputClass}`}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <textarea
                    placeholder="Description"
                    value={exp.description}
                    onChange={(e) => {
                      const newExp = [...resumeData.experience];
                      newExp[index].description = e.target.value;
                      onUpdateResume({ ...resumeData, experience: newExp });
                    }}
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg ${config.inputClass} mb-4`}
                  />
                  {template === 'modern' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Key Achievements
                      </label>
                      <div className="space-y-2">
                        {exp.achievements?.map((achievement: string, achievementIndex: number) => (
                          <div key={achievementIndex} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={achievement}
                              onChange={(e) => {
                                const newExp = [...resumeData.experience];
                                newExp[index].achievements[achievementIndex] = e.target.value;
                                onUpdateResume({ ...resumeData, experience: newExp });
                              }}
                              className={`w-full px-4 py-2 border rounded-lg ${config.inputClass}`}
                            />
                            <button
                              onClick={() => {
                                const newExp = [...resumeData.experience];
                                newExp[index].achievements = newExp[index].achievements.filter(
                                  (_: any, i: number) => i !== achievementIndex
                                );
                                onUpdateResume({ ...resumeData, experience: newExp });
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newExp = [...resumeData.experience];
                            if (!newExp[index].achievements) {
                              newExp[index].achievements = [];
                            }
                            newExp[index].achievements.push('');
                            onUpdateResume({ ...resumeData, experience: newExp });
                          }}
                          className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Add Achievement
                        </button>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => handleArrayItemRemove('experience', index)}
                    className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section className={config.sectionClass}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={config.headingClass}>Skills</h3>
              <AnimatedButton
                variant="secondary"
                onClick={() => setShowAddSkillModal(true)}
                className="text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Skill
              </AnimatedButton>
            </div>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                    template === 'creative'
                      ? 'bg-purple-50 text-purple-600'
                      : template === 'classic'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-indigo-50 text-indigo-600'
                  }`}
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleArrayItemRemove('skills', index)}
                    className="hover:text-red-600"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </div>

            <SkillSuggestions
              currentRole={resumeData.personalInfo.title}
              desiredRole={careerAnalysis?.desiredRole || ''}
              currentSkills={resumeData.skills}
              onAddSkill={handleAddSkill}
            />
          </section>

          {/* Links (Modern and Creative templates only) */}
          {(template === 'modern' || template === 'creative') && (
            <section className={config.sectionClass}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={config.headingClass}>Professional Links</h3>
                <AnimatedButton
                  variant="secondary"
                  onClick={() => handleArrayItemAdd('links', { title: '', url: '' })}
                  className="text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Link
                </AnimatedButton>
              </div>
              <div className="space-y-3">
                {resumeData.links?.map((link: any, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={link.title}
                        onChange={(e) => {
                          const newLinks = [...(resumeData.links || [])];
                          newLinks[index].title = e.target.value;
                          onUpdateResume({ ...resumeData, links: newLinks });
                        }}
                        placeholder="Title (e.g., Portfolio, LinkedIn)"
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg ${config.inputClass}`}
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...(resumeData.links || [])];
                          newLinks[index].url = e.target.value;
                          onUpdateResume({ ...resumeData, links: newLinks });
                        }}
                        placeholder="URL"
                        className={`w-full px-4 py-2 border rounded-lg ${config.inputClass}`}
                      />
                    </div>
                    <button
                      onClick={() => {
                        const newLinks = [...(resumeData.links || [])];
                        newLinks.splice(index, 1);
                        onUpdateResume({ ...resumeData, links: newLinks });
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </AnimatedCard>

      <AddSkillModal
        isOpen={showAddSkillModal}
        onClose={() => setShowAddSkillModal(false)}
        onAddSkill={handleAddSkill}
      />
    </div>
  );
};