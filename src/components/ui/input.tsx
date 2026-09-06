'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: 'underline' | 'filled' | 'minimal' | 'premium';
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, helperText, className, variant = 'premium', ...props }, ref) => {
  
  const baseStyles = cn(
    'w-full font-sans text-base tracking-wide',
    'transition-all duration-300',
    'focus:outline-none',
    
     variant === 'underline' && [
      'w-full px-5 py-4 rounded-2xl bg-[#0B0F1A] border border-[#2A2F3A] text-white placeholder:text-gray-400',
      'focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 outline-none transition-all duration-200',
    ],
    
     variant === 'filled' && [
      'w-full px-5 py-4 rounded-2xl bg-[#0B0F1A] border border-[#2A2F3A] text-white placeholder:text-gray-400',
      'hover:border-[#2A2F3A]/80',
      'focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 outline-none transition-all duration-200',
    ],
    
    variant === 'minimal' && [
      'bg-transparent border border-transparent',
      'py-2 px-3 rounded-lg',
      'text-foreground placeholder:text-foreground-muted',
      'hover:bg-surface/30',
      'focus:bg-surface/50 focus:border-gold/30',
    ],

     variant === 'premium' && [
      'w-full px-5 py-4 rounded-2xl bg-[#0B0F1A] border border-[#2A2F3A] text-white placeholder:text-gray-400',
      'focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 outline-none transition-all duration-200',
    ],
    
    error && [
      'border-red-400/50 text-red-400',
      'focus:border-red-400 focus:ring-red-400/20',
    ],
    
    icon && 'pl-10',
    className
  );
  
  return (
    <div className="relative w-full">
      {label && (
        <label className="block mb-2 font-medium text-sm text-foreground-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none z-10">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={baseStyles}
          {...props}
        />
        {variant === 'underline' && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-gold/50 to-gold"
            initial={{ width: 0 }}
            whileFocus={{ width: '100%' }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-xs text-foreground-muted italic">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';


export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: 'underline' | 'filled' | 'minimal' | 'premium';
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, icon, helperText, className, variant = 'premium', ...props }, ref) => {
   
  const baseStyles = cn(
    'w-full font-sans text-base tracking-wide',
    'transition-all duration-300',
    'focus:outline-none',
    'resize-none',
    
    variant === 'underline' && [
      'bg-transparent border-b border-gold/20 py-3 px-0',
      'text-foreground placeholder:text-foreground-muted',
      'hover:border-gold/40',
      'focus:border-gold focus:shadow-[0_0_10px_rgba(244,197,66,0.3)]',
    ],
    
    variant === 'filled' && [
      'bg-surface/50 border border-gold/20 rounded-xl py-3 px-4',
      'text-foreground placeholder:text-foreground-muted',
      'hover:bg-surface/70 hover:border-gold/30',
      'focus:border-gold/50 focus:ring-1 focus:ring-gold/20',
    ],

    variant === 'minimal' && [
      'bg-transparent border border-transparent py-2 px-3 rounded-lg',
      'text-foreground placeholder:text-foreground-muted',
      'hover:bg-surface/30',
      'focus:bg-surface/50 focus:border-gold/30',
    ],

    variant === 'premium' && [
      'bg-transparent border border-white/20 rounded-xl py-3 px-4',
      'text-foreground placeholder:text-foreground-muted',
      'hover:border-white/40',
      'focus:border-[#FFD700] focus:shadow-[0_0_10px_rgba(255,215,0,0.3)]',
    ],
    
    error && [
      'border-red-400/50 text-red-400',
      'focus:border-red-400 focus:ring-red-400/20',
    ],
    
    icon && 'pl-10',
    className
  );
   
  return (
    <div className="relative w-full">
      {label && (
        <label className="block mb-2 font-medium text-sm text-foreground-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3 text-foreground-muted">
            {icon}
          </div>
        )}
        <textarea
          ref={ref}
          className={baseStyles}
          {...props}
        />
        {variant === 'underline' && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-gold/50 to-gold"
            initial={{ width: 0 }}
            whileFocus={{ width: '100%' }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-xs text-foreground-muted italic">{helperText}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Input;