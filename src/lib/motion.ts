'use client';

import { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    }
  }
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};

export const cardHover: Variants = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.03, 
    y: -4,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

export const buttonTap: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.96 }
};

export const cardFlip: Variants = {
  hidden: { rotateY: -90, opacity: 0 },
  visible: { 
    rotateY: 0, 
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export const slideInRight: Variants = {
  hidden: { x: 100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  },
  exit: { 
    x: 100, 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

export const slideInUp: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};

export const pulseGlow: Variants = {
  rest: { 
    boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)' 
  },
  animate: { 
    boxShadow: [
      '0 0 20px rgba(124, 58, 237, 0.3)',
      '0 0 40px rgba(124, 58, 237, 0.6)',
      '0 0 20px rgba(124, 58, 237, 0.3)',
    ],
    transition: { 
      duration: 2, 
      repeat: Infinity,
      ease: 'easeInOut' 
    }
  }
};

export const float: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: { 
      duration: 4, 
      repeat: Infinity,
      ease: 'easeInOut' 
    }
  }
};

export const shimmer: Variants = {
  animate: {
    x: ['-100%', '100%'],
    transition: { 
      duration: 1.5, 
      repeat: Infinity,
      ease: 'easeInOut',
      repeatDelay: 2
    }
  }
};

export const orbPulse: Variants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.4, 0.7, 0.4],
    transition: { 
      duration: 4, 
      repeat: Infinity,
      ease: 'easeInOut' 
    }
  }
};

export const typingCursor: Variants = {
  animate: {
    opacity: [1, 0, 1],
    transition: { 
      duration: 0.8, 
      repeat: Infinity 
    }
  }
};
