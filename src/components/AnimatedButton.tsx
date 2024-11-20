import React from 'react';
import { motion } from 'framer-motion';
import { useAnimations } from '../hooks/useAnimations';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const AnimatedButton = ({ 
  children, 
  variant = 'primary', 
  className = '',
  ...props 
}: AnimatedButtonProps) => {
  const { buttonVariants } = useAnimations();

  const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';

  return (
    <motion.button
      className={`${baseClass} ${className}`}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      style={{ willChange: 'transform' }}
      {...props}
    >
      {children}
    </motion.button>
  );
};