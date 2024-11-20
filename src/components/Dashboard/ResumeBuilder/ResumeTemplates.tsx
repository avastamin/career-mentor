import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { AnimatedCard } from '../../AnimatedCard';

interface ResumeTemplatesProps {
  activeTemplate: string;
  onSelectTemplate: (template: string) => void;
}

export const ResumeTemplates: React.FC<ResumeTemplatesProps> = ({
  activeTemplate,
  onSelectTemplate
}) => {
  const templates = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and professional design with a modern touch',
      thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80',
      styles: {
        fontFamily: 'Inter, sans-serif',
        spacing: 'relaxed',
        colors: {
          primary: 'indigo',
          secondary: 'gray'
        }
      }
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional resume layout that never goes out of style',
      thumbnail: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=400&q=80',
      styles: {
        fontFamily: 'Georgia, serif',
        spacing: 'normal',
        colors: {
          primary: 'gray',
          secondary: 'blue'
        }
      }
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Stand out with a unique and creative design',
      thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80',
      styles: {
        fontFamily: 'Poppins, sans-serif',
        spacing: 'wide',
        colors: {
          primary: 'purple',
          secondary: 'pink'
        }
      }
    }
  ];

  return (
    <AnimatedCard>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Templates</h3>
        <div className="space-y-4">
          {templates.map((template) => (
            <motion.button
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                activeTemplate === template.id
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative mb-3">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                {activeTemplate === template.id && (
                  <div className="absolute inset-0 bg-indigo-600/10 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
              <h4 className="font-medium text-gray-900">{template.name}</h4>
              <p className="text-sm text-gray-600">{template.description}</p>
              
              {/* Template Preview Features */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Font: {template.styles.fontFamily}</div>
                  <div>Spacing: {template.styles.spacing}</div>
                  <div className="flex items-center gap-2">
                    <span>Colors:</span>
                    <span className={`inline-block w-3 h-3 rounded-full bg-${template.styles.colors.primary}-500`} />
                    <span className={`inline-block w-3 h-3 rounded-full bg-${template.styles.colors.secondary}-500`} />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </AnimatedCard>
  );
};