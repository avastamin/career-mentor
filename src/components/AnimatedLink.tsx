import React from 'react';
import { motion } from 'framer-motion';
import { Link, LinkProps } from 'react-router-dom';
import { useAnimations } from '../hooks/useAnimations';

interface AnimatedLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedLink = ({ 
  children, 
  className = '',
  ...props 
}: AnimatedLinkProps) => {
  const { navLinkVariants } = useAnimations();

  return (
    <motion.div
      variants={navLinkVariants}
      whileHover="hover"
      style={{ willChange: 'transform', display: 'inline-block' }}
    >
      <Link className={className} {...props}>
        {children}
      </Link>
    </motion.div>
  );
};