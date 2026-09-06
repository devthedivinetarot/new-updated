import { Variants } from 'framer-motion';

// Fade in from bottom
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
};

// Scale in with fade
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
};

// Stagger children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Individual stagger item
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
};

// Float animation for elements
export const float: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: { 
      duration: 3, 
      repeat: Infinity, 
      ease: 'easeInOut' 
    },
  },
};

// Pulse glow animation
export const pulseGlow: Variants = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(244,197,66,0.3)',
      '0 0 40px rgba(244,197,66,0.5)',
      '0 0 20px rgba(244,197,66,0.3)',
    ],
    transition: { 
      duration: 3, 
      repeat: Infinity, 
      ease: 'easeInOut' 
    },
  },
};

// Hover lift with glow
export const hoverLift: Variants = {
  rest: { y: 0, scale: 1 },
  hover: { 
    y: -5, 
    scale: 1.02,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
};

// Card hover effect
export const cardHover: Variants = {
  rest: { 
    y: 0, 
    scale: 1,
    boxShadow: '0 0 30px rgba(0,0,0,0.4)',
  },
  hover: { 
    y: -5, 
    scale: 1.02,
    boxShadow: '0 0 50px rgba(244,197,66,0.15)',
    transition: { duration: 0.3, ease: 'easeOut' }
  },
};

// Button tap effect
export const buttonTap = {
  whileTap: { scale: 0.97 },
};

// Page transitions
export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.4 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  },
};

// Loading shimmer
export const shimmer: Variants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: { 
      duration: 2, 
      repeat: Infinity, 
      ease: 'linear' 
    },
  },
};

// Orb floating for chat
export const orbFloat: Variants = {
  animate: {
    y: [0, -5, 0, 5, 0],
    scale: [1, 1.02, 1, 0.98, 1],
    transition: { 
      duration: 4, 
      repeat: Infinity, 
      ease: 'easeInOut' 
    },
  },
};

// Utility: ease out cubic
export const easeOutCubic = {
  transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }
};

// Utility: smooth spring
export const smoothSpring = {
  transition: { type: 'spring', stiffness: 300, damping: 30 }
};