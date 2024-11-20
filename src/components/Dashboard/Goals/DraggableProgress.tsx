import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface DraggableProgressProps {
  progress: number;
  onChange: (newProgress: number) => void;
  color?: string;
}

export const DraggableProgress: React.FC<DraggableProgressProps> = ({
  progress,
  onChange,
  color = 'bg-indigo-600'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [width, setWidth] = useState(0);

  // Motion values setup
  const x = useMotionValue(0);
  const springConfig = { 
    damping: 40,
    stiffness: 400,
    mass: 0.2,
    restDelta: 0.01
  };
  
  const springX = useSpring(x, springConfig);
  const progressPercent = useTransform(springX, [0, width], [0, 100], { clamp: true });
  const fillWidth = useTransform(springX, (latest) => `${Math.min(100, Math.max(0, (latest / width) * 100))}%`);

  // Update width and position on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.getBoundingClientRect().width;
        setWidth(newWidth);
        // Set initial position based on progress
        const initialX = (progress / 100) * newWidth;
        x.set(initialX);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [progress, x]);

  // Handle drag with improved precision
  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent) => {
    if (!containerRef.current || !isDragging) return;

    const bounds = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const relativeX = clientX - bounds.left;
    const boundedX = Math.min(bounds.width, Math.max(0, relativeX));
    
    x.set(boundedX);
    const newProgress = Math.round((boundedX / bounds.width) * 100);
    onChange(Math.min(100, Math.max(0, newProgress)));
  };

  // Handle click with bounds checking
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isDragging) return;
    
    const bounds = containerRef.current.getBoundingClientRect();
    const relativeX = event.clientX - bounds.left;
    const boundedX = Math.min(bounds.width, Math.max(0, relativeX));
    
    x.set(boundedX);
    const newProgress = Math.round((boundedX / bounds.width) * 100);
    onChange(Math.min(100, Math.max(0, newProgress)));
  };

  // Setup event listeners for drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleDrag(e);
    const handleTouchMove = (e: TouchEvent) => handleDrag(e);
    const handleEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  return (
    <div className="relative h-2 w-full">
      {/* Track */}
      <div
        ref={containerRef}
        className="absolute inset-0 bg-gray-200 rounded-full cursor-pointer"
        onClick={handleClick}
      >
        {/* Progress fill */}
        <motion.div
          className={`absolute left-0 top-0 h-full ${color} rounded-full`}
          style={{ width: fillWidth }}
        />
      </div>

      {/* Draggable handle */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2"
        style={{ x: springX }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className={`w-4 h-4 -ml-2 ${color} rounded-full shadow-lg cursor-grab active:cursor-grabbing`}>
          {/* Inner circle */}
          <div className="absolute inset-0.5 bg-white rounded-full" />
          
          {/* Tooltip */}
          {(isDragging || showTooltip) && (
            <motion.div
              className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded shadow-lg whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              {Math.round(progressPercent.get())}%
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};