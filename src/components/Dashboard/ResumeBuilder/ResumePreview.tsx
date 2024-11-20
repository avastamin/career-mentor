import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Calendar, Link } from 'lucide-react';
import type { ResumeData } from '../../../lib/ai/resume';

interface ResumePreviewProps {
  resumeData: ResumeData;
  template: string;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resumeData,
  template
}) => {
  const getTemplateStyles = () => {
    switch (template) {
      case 'modern':
        return {
          container: 'max-w-4xl mx-auto p-8 bg-white shadow-lg',
          header: 'border-b-2 border-indigo-600 pb-6 mb-6',
          name: 'text-4xl font-bold text-gray-900 mb-2',
          title: 'text-xl text-indigo-600 mb-4',
          section: 'mb-8',
          sectionTitle: 'text-lg font-semibold text-gray-900 mb-4',
          skillBadge: 'px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm',
          link: 'text-indigo-600 hover:text-indigo-700'
        };
      case 'classic':
        return {
          container: 'max-w-4xl mx-auto p-8 bg-white',
          header: 'text-center border-b border-gray-300 pb-6 mb-6',
          name: 'text-4xl font-serif text-gray-900 mb-2',
          title: 'text-xl text-gray-600 mb-4',
          section: 'mb-6',
          sectionTitle: 'text-xl font-serif text-gray-800 mb-4 border-b border-gray-200 pb-2',
          skillBadge: 'px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm',
          link: 'text-gray-600 hover:text-gray-800'
        };
      case 'creative':
        return {
          container: 'max-w-4xl mx-auto p-8 bg-gradient-to-br from-purple-50 to-white',
          header: 'pb-6 mb-6',
          name: 'text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-2',
          title: 'text-2xl text-gray-700 mb-4',
          section: 'mb-10',
          sectionTitle: 'text-2xl font-bold text-purple-600 mb-4',
          skillBadge: 'px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm',
          link: 'text-purple-600 hover:text-purple-700'
        };
      default:
        return {
          container: 'max-w-4xl mx-auto p-8 bg-white shadow-lg',
          header: 'border-b-2 border-gray-200 pb-6 mb-6',
          name: 'text-4xl font-bold text-gray-900 mb-2',
          title: 'text-xl text-gray-600 mb-4',
          section: 'mb-8',
          sectionTitle: 'text-lg font-semibold text-gray-900 mb-4',
          skillBadge: 'px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm',
          link: 'text-gray-600 hover:text-gray-700'
        };
    }
  };

  const styles = getTemplateStyles();

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.name}>{resumeData.personalInfo.name}</h1>
        <h2 className={styles.title}>{resumeData.personalInfo.title}</h2>
        <div className="flex items-center justify-center gap-6 text-gray-600">
          {resumeData.personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{resumeData.personalInfo.email}</span>
            </div>
          )}
          {resumeData.personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{resumeData.personalInfo.phone}</span>
            </div>
          )}
          {resumeData.personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{resumeData.personalInfo.location}</span>
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {resumeData.personalInfo.summary && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Professional Summary</h3>
          <p className="text-gray-600 leading-relaxed">
            {resumeData.personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Experience</h3>
          <div className="space-y-6">
            {resumeData.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{exp.title}</h4>
                    <p className={template === 'modern' ? 'text-indigo-600' : 'text-gray-600'}>
                      {exp.company}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{exp.duration}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-2">{exp.description}</p>
                {exp.achievements?.length > 0 && (
                  <ul className="list-disc list-inside space-y-1">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="text-gray-600 text-sm">
                        {achievement}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Skills</h3>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <span key={index} className={styles.skillBadge}>
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Education</h3>
          <div className="space-y-4">
            {resumeData.education.map((edu, index) => (
              <div key={index}>
                <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                <p className="text-gray-600">{edu.institution}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  {edu.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{edu.location}</span>
                    </div>
                  )}
                  {edu.duration && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{edu.duration}</span>
                    </div>
                  )}
                </div>
                {edu.description && (
                  <p className="text-gray-600 mt-2">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Links */}
      {resumeData.links?.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Professional Links</h3>
          <div className="flex flex-wrap gap-4">
            {resumeData.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 ${styles.link}`}
              >
                <Link className="w-4 h-4" />
                <span>{link.title}</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};