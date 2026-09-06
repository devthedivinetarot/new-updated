'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Home, AlertCircle } from 'lucide-react';
import Button from './ui/button';

interface ErrorFallbackProps {
  error: string;
  onRetry: () => void;
  onStartOver: () => void;
}

export default function ErrorFallback({ error, onRetry, onStartOver }: ErrorFallbackProps) {
  return (
    <div className="text-center py-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="inline-flex rounded-full p-6 bg-red-500/10 mb-6 border-2 border-red-500/30"
      >
        <AlertCircle className="h-12 w-12 text-red-400" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-heading text-2xl md:text-3xl text-foreground mb-4"
      >
        The cards are a little unclear right now
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-foreground-secondary mb-8 max-w-md mx-auto"
      >
        {error || 'Something went wrong while reading your cards. Please try again.'}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button variant="secondary" size="md" onClick={onRetry} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
        <Button variant="primary" size="md" onClick={onStartOver} className="gap-2">
          <Home className="h-4 w-4" />
          Start Fresh
        </Button>
      </motion.div>
    </div>
  );
}
