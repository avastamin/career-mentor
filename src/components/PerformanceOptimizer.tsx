import React from 'react';
import { useInView } from 'react-intersection-observer';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  threshold?: number;
}

export const PerformanceOptimizer = ({ 
  children, 
  threshold = 0.1 
}: PerformanceOptimizerProps) => {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: true
  });

  return (
    <div ref={ref} style={{ willChange: inView ? 'transform, opacity' : 'auto' }}>
      {children}
    </div>
  );
};