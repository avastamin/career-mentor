import React from 'react';
import { motion } from 'framer-motion';
import { useAnimations } from '../hooks/useAnimations';

interface IconContainerProps {
  children: React.ReactNode;
  className?: string;
  floating?: boolean;
}

export const IconContainer = ({ children, className = "", floating = false }: IconContainerProps) => {
  const { iconContainerVariants, floatingIconVariants } = useAnimations();

  return (
    <motion.div
      className={`icon-container ${className}`}
      variants={floating ? floatingIconVariants : iconContainerVariants}
      whileHover="hover"
      whileTap="tap"
      style={{ willChange: 'transform' }}
    >
      {children}
    </motion.div>
  );
};