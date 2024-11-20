import React from 'react';
import { motion } from 'framer-motion';
import { useAnimations } from '../hooks/useAnimations';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const AnimatedSection = ({ 
  children, 
  className = '',
  delay = 0 
}: AnimatedSectionProps) => {
  const { sectionVariants } = useAnimations();

  return (
    <motion.section
      className={className}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay }}
    >
      {children}
    </motion.section>
  );
};