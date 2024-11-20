import React from 'react';
import { motion } from 'framer-motion';
import { useAnimations } from '../hooks/useAnimations';

interface AnimatedTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'fade' | 'stagger';
}

export const AnimatedText = ({ 
  children, 
  className = '',
  variant = 'fade'
}: AnimatedTextProps) => {
  const { fadeInVariants, staggerContainerVariants } = useAnimations();

  return (
    <motion.div
      className={className}
      variants={variant === 'fade' ? fadeInVariants : staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
};