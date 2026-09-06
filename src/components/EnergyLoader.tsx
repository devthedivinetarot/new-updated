'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface EnergyLoaderProps {
  message?: string;
}

const loaderPhrases = [
  "Aligning with your energy...",
  "Tuning into your situation...",
  "Reading the patterns around you...",
  "Connecting to the universe...",
  "Translating the message...",
];

export default function EnergyLoader({ message }: EnergyLoaderProps) {
  const [phrase, setPhrase] = useState(loaderPhrases[0]);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const randomPhrase = loaderPhrases[Math.floor(Math.random() * loaderPhrases.length)];
    setPhrase(randomPhrase);
    
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!message) return;
    
    const randomPhrase = loaderPhrases[Math.floor(Math.random() * loaderPhrases.length)];
    setPhrase(randomPhrase);
  }, [message]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <motion.div
        className="relative"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ 
            background: 'conic-gradient(from 0deg, transparent, rgba(124,58,237,0.4), transparent)' 
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Main orb container */}
        <motion.div
          className="relative w-32 h-32"
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {/* Inner glow */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-900/50 to-indigo-900/50 blur-xl" />
          
          {/* Core orb */}
          <motion.div
            className="absolute inset-6 rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-500"
            animate={{ 
              boxShadow: [
                '0 0 30px rgba(124,58,237,0.5)',
                '0 0 60px rgba(124,58,237,0.7)',
                '0 0 30px rgba(124,58,237,0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Inner light */}
          <motion.div
            className="absolute inset-10 rounded-full bg-gradient-to-br from-purple-300 to-indigo-300"
            animate={{ 
              opacity: [0.6, 0.9, 0.6],
              scale: [0.95, 1, 0.95]
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </motion.div>
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-purple-400/60"
            style={{
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: [
                Math.cos(i * Math.PI / 3) * 50,
                Math.cos(i * Math.PI / 3) * 70,
                Math.cos(i * Math.PI / 3) * 50
              ],
              y: [
                Math.sin(i * Math.PI / 3) * 50,
                Math.sin(i * Math.PI / 3) * 70,
                Math.sin(i * Math.PI / 3) * 50
              ],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 2 + i * 0.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3
            }}
          />
        ))}
      </motion.div>

      <motion.p
        className="mt-10 font-heading text-lg text-purple-300/70"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: isInitializing ? 0.5 : 0.2 }}
      >
        {phrase}
      </motion.p>

      {/* Progress bar */}
      <motion.div
        className="mt-4 h-0.5 w-24 rounded-full bg-purple-800/50 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </motion.div>
    </div>
  );
}