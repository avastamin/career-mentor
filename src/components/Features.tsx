import React from 'react';
import { Brain, Target, Briefcase, LineChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { IconContainer } from './IconContainer';
import { AnimatedCard } from './AnimatedCard';
import { AnimatedSection } from './AnimatedSection';
import { useAnimations } from '../hooks/useAnimations';

export const Features = () => {
  const { fadeInVariants } = useAnimations();
  
  const features = [
    {
      icon: <Brain />,
      title: "AI Career Analysis",
      description: "Get detailed insights about your career path based on your skills and interests",
      items: ["Market dynamics", "Skill gap analysis", "Career trajectory prediction"]
    },
    {
      icon: <Target />,
      title: "AI engineered for results",
      description: "Purpose-built AI models trained on extensive career data",
      items: ["95% accuracy in skill gap analysis", "Real-time market adaptation", "Personalized success metrics"]
    },
    {
      icon: <Briefcase />,
      title: "Job Search Assistant",
      description: "Smart tools to help you find and land your dream job",
      items: ["AI resume builder", "Interview preparation", "Job matching algorithm"]
    },
    {
      icon: <LineChart />,
      title: "Progress Tracking",
      description: "Monitor your career development with detailed analytics and insights",
      items: ["Skill development metrics", "Goal achievement tracking", "AI goal insights"]
    }
  ];

  return (
    <AnimatedSection id="features" className="py-24 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-20"
          variants={fadeInVariants}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Supercharge Your{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-500">
              Career Growth
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Our AI-powered platform provides everything you need to accelerate your career development
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <AnimatedCard
              key={index}
              className="flex gap-6"
            >
              <IconContainer floating>
                {feature.icon}
              </IconContainer>
              <div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.items.map((item, itemIndex) => (
                    <motion.li 
                      key={itemIndex} 
                      className="flex items-center text-gray-600"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full mr-3"></div>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};