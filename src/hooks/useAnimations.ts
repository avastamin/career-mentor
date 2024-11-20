import { Variants } from 'framer-motion';

export const useAnimations = () => {
  const iconContainerVariants: Variants = {
    hover: {
      scale: 1.1,
      rotate: 12,
      backgroundColor: "rgba(79, 70, 229, 0.2)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { 
      scale: 0.95,
      rotate: -12
    }
  };

  const cardVariants: Variants = {
    initial: { 
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" 
    },
    hover: {
      y: -5,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  const skillBadgeVariants: Variants = {
    hover: {
      scale: 1.05,
      backgroundColor: "#F9FAFB",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15
      }
    }
  };

  const progressBarVariants: Variants = {
    initial: { width: "0%" },
    animate: {
      width: "85%",
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  const sectionVariants: Variants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const floatingIconVariants: Variants = {
    hover: {
      y: -3,
      rotate: [0, -10, 10, -10, 0],
      transition: {
        y: {
          type: "spring",
          stiffness: 300,
          damping: 15
        },
        rotate: {
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse"
        }
      }
    }
  };

  const buttonVariants: Variants = {
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.98
    }
  };

  const testimonialVariants: Variants = {
    hover: {
      y: -8,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  const pricingCardVariants: Variants = {
    hover: {
      y: -10,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  const navLinkVariants: Variants = {
    hover: {
      scale: 1.05,
      color: "#4F46E5",
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15
      }
    }
  };

  const fadeInVariants: Variants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const staggerContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return {
    iconContainerVariants,
    cardVariants,
    skillBadgeVariants,
    progressBarVariants,
    sectionVariants,
    floatingIconVariants,
    buttonVariants,
    testimonialVariants,
    pricingCardVariants,
    navLinkVariants,
    fadeInVariants,
    staggerContainerVariants
  };
};