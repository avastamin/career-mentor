import React from 'react';
import { Target, BookOpen, Users, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { IconContainer } from './IconContainer';
import { AnimatedButton } from './AnimatedButton';
import { AnimatedCard } from './AnimatedCard';
import { useAnimations } from '../hooks/useAnimations';

export const Hero = () => {
  const { sectionVariants, fadeInVariants } = useAnimations();

  const scrollToAssessment = () => {
    const assessmentSection = document.getElementById('quick-assessment');
    if (assessmentSection) {
      assessmentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.section 
      className="pt-32 pb-16"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={fadeInVariants}
        >
          <motion.h1 
            className="text-6xl md:text-7xl font-bold text-gray-900 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Your Personal{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-500">
              AI Career Guide
            </span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Navigate your career journey with confidence using personalized AI-powered guidance
          </motion.p>

          <AnimatedButton
            onClick={scrollToAssessment}
            className="mb-16 group"
            variant="primary"
          >
            Start Your Career Analysis
            <ArrowDown className="w-5 h-5 ml-2 inline-block group-hover:translate-y-1 transition-transform" />
          </AnimatedButton>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="w-6 h-6" />,
                title: "Personalized Guidance",
                description: "AI-powered career advice tailored to your unique skills and goals"
              },
              {
                icon: <BookOpen className="w-6 h-6" />,
                title: "Skill Development",
                description: "Curated learning paths to build the skills that matter most"
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Network Building",
                description: "Learn how to connect with mentors and peers in your desired industry"
              }
            ].map((feature, index) => (
              <AnimatedCard
                key={index}
                className="text-center"
              >
                <IconContainer floating className="mb-6 mx-auto">
                  {feature.icon}
                </IconContainer>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </AnimatedCard>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};