'use client';

import { motion } from 'framer-motion';
import { Moon, Heart, Compass } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const problemsData = [
  { key: 'stuck', icon: Moon },
  { key: 'love', icon: Heart },
  { key: 'direction', icon: Compass },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProblemStrip() {
  const { t, isHydrated } = useLanguage();

  return (
    <section className="py-section bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
<motion.div
           variants={containerVariants}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: '-100px' }}
           className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:gap-block sm:overflow-visible sm:pb-0"
         >
          {problemsData.map((problem) => {
            const ProblemIcon = problem.icon;
            return (
              <motion.div
                key={problem.key}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group cursor-pointer flex-none w-64 sm:w-auto rounded-2xl bg-surface-60 p-8 backdrop-blur-sm border border-gold-10 hover:border-gold-30 hover-glow-gold transition-all duration-300"
              >
                <motion.div
                  className="mx-auto mb-element flex h-14 w-14 items-center justify-center rounded-full relative gradient-gold-red"
                  whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                >
                  <ProblemIcon className="h-7 w-7 text-gold" />
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                      boxShadow: [
                        '0 0 10px rgba(var(--gold),0.2)',
                        '0 0 20px rgba(var(--gold),0.4)',
                        '0 0 10px rgba(var(--gold),0.2)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </motion.div>
                <h3 className="font-heading text-heading text-foreground mb-element text-center">
                  {isHydrated ? t(`landing.problems.${problem.key}.title`) : 
                    problem.key === 'stuck' ? 'Feeling stuck in your life?' :
                    problem.key === 'love' ? 'Confused in love or relationships?' : 'Unsure about your next move?'}
                </h3>
                <p className="text-body-sm text-foreground-muted text-center leading-relaxed">
                  {isHydrated ? t(`landing.problems.${problem.key}.description`) : 
                    problem.key === 'stuck' ? 'When everything feels motionless' :
                    problem.key === 'love' ? 'Your heart deserves honest answers' : 'The universe has guidance for you'}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}