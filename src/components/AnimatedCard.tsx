import React from 'react';
import { motion } from 'framer-motion';
import { useAnimations } from '../hooks/useAnimations';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'pricing' | 'testimonial';
}

export const AnimatedCard = ({ 
  children, 
  className = '', 
  variant = 'default' 
}: AnimatedCardProps) => {
  const { cardVariants, pricingCardVariants, testimonialVariants } = useAnimations();

  const variants = {
    default: cardVariants,
    pricing: pricingCardVariants,
    testimonial: testimonialVariants
  };

  return (
    <motion.div
      className={`feature-card ${className}`}
      variants={variants[variant]}
      whileHover="hover"
      style={{ willChange: 'transform' }}
    >
      {children}
    </motion.div>
  );
};