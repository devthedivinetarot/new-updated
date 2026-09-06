'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface FloatingInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel';
  error?: string;
  icon?: React.ReactNode;
  autoFocus?: boolean;
  onEnter?: () => void;
  helperText?: string;
  required?: boolean;
}

export default function FloatingInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  icon,
  autoFocus,
  onEnter,
  helperText,
  required = false,
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isActive = focused || value.length > 0;

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onEnter) {
      onEnter();
    }
  };

  return (
    <div className="relative w-full mt-6">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none z-10">
            {icon}
          </div>
        )}
        
          <input
           ref={inputRef}
           type={type}
           value={value}
           onChange={(e) => onChange(e.target.value)}
           onFocus={() => setFocused(true)}
           onBlur={() => setFocused(false)}
           onKeyDown={handleKeyDown}
           required={required}
           placeholder={isActive ? placeholder : ''}
           className={cn(
             'w-full bg-[#0B0F1A] border rounded-xl font-sans text-base py-3 px-4 transition-all duration-300',
             'text-white placeholder:text-gray-400',
             'focus:outline-none',
             'border-[#2A2F3A]',
             'focus:border-[#D4AF37] focus:shadow-[0_0_10px_rgba(212,175,55,0.3)]',
             icon && 'pl-10'
           )}
         />
        
        {/* Floating Label */}
        <motion.label
          initial={false}
          animate={{
            top: isActive ? -10 : 6,
            fontSize: isActive ? '0.75rem' : '1rem',
            color: error
              ? '#ef4444'
              : isActive
                ? 'rgb(var(--gold))'
                : 'rgb(var(--foreground-muted))',
          }}
          transition={{ duration: 0.2 }}
          className={cn(
            'absolute left-4 font-medium pointer-events-none bg-background px-1',
            icon && 'left-10'
          )}
        >
          {label}
        </motion.label>
        
        {/* Focus indicator line (optional) */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 rounded-full bg-gradient-to-r from-[rgb(var(--accent-start))] via-[rgb(var(--gold))] to-[rgb(var(--gold-light))]"
          initial={{ width: '0%' }}
          animate={{ width: focused || value ? '100%' : '0%' }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Helper text / error */}
      <div className="mt-1">
        {error ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-red-400"
          >
            {error}
          </motion.p>
        ) : helperText ? (
          <p className="text-xs text-foreground-muted italic">{helperText}</p>
        ) : null}
      </div>
    </div>
  );
}


export interface FloatingTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
  rows?: number;
  maxLength?: number;
  showCount?: boolean;
  autoFocus?: boolean;
  required?: boolean;
}

export function FloatingTextarea({
  label,
  value,
  onChange,
  placeholder,
  error,
  icon,
  helperText,
  rows = 4,
  maxLength,
  showCount,
  autoFocus,
  required = false,
}: FloatingTextareaProps) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;
  const isOverLimit = maxLength ? value.length > maxLength : false;

  return (
    <div className="relative w-full mt-6">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3 text-foreground-muted pointer-events-none z-10">
            {icon}
          </div>
        )}
         <textarea
           value={value}
           onChange={(e) => onChange(e.target.value)}
           onFocus={() => setFocused(true)}
           onBlur={() => setFocused(false)}
           rows={rows}
           maxLength={maxLength}
           autoFocus={autoFocus}
           required={required}
           placeholder={isActive ? placeholder : ''}
           className={cn(
             'w-full bg-[#0B0F1A] border rounded-xl font-sans text-base py-3 px-4 transition-all duration-300',
             'text-white placeholder:text-gray-400',
             'focus:outline-none resize-none',
             'border-[#2A2F3A]',
             'focus:border-[#D4AF37] focus:shadow-[0_0_10px_rgba(212,175,55,0.3)]',
             icon ? 'pl-10 pr-4' : 'px-4'
           )}
         />
        
        {/* Floating Label */}
        <motion.label
          initial={false}
          animate={{
            top: isActive ? -10 : 6,
            fontSize: isActive ? '0.75rem' : '1rem',
            color: error
              ? '#ef4444'
              : isActive
                ? 'rgb(var(--gold))'
                : 'rgb(var(--foreground-muted))',
          }}
          transition={{ duration: 0.2 }}
          className={cn(
            'absolute left-4 font-medium pointer-events-none bg-background px-1',
            icon && 'left-10'
          )}
        >
          {label}
        </motion.label>
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 rounded-full bg-gradient-to-r from-[rgb(var(--accent-start))] via-[rgb(var(--gold))] to-[rgb(var(--gold-light))]"
          initial={{ width: '0%' }}
          animate={{ width: focused || value ? '100%' : '0%' }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Helper text / char count */}
      <div className="mt-1 flex items-center justify-between">
        {error ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-red-400"
          >
            {error}
          </motion.p>
        ) : helperText ? (
          <p className="text-xs text-foreground-muted italic">{helperText}</p>
        ) : <span className="flex-1" />}
        {showCount && maxLength && (
          <span className={`text-xs ${isOverLimit ? 'text-red-400' : 'text-foreground-muted'}`}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}


export interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export function FormProgress({
  currentStep,
  totalSteps,
  labels = ['Step 1', 'Step 2'],
}: FormProgressProps) {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-xs text-foreground-muted">
        <span>{labels[currentStep - 1] || `Step ${currentStep}`}</span>
        <span>{currentStep}/{totalSteps}</span>
      </div>
      <div className="h-1 bg-surface rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-gold/50 to-gold"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      {currentStep < totalSteps && (
        <p className="text-xs text-foreground-muted">Bas ek aur step...</p>
      )}
    </div>
  );
}
