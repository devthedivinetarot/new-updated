'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Sparkles, Eye } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const stepsData = [
  { key: 'ask', icon: MessageCircle, number: '01' },
  { key: 'pick', icon: Sparkles, number: '02' },
  { key: 'reveal', icon: Eye, number: '03' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function HowItWorks() {
  const { t, isHydrated } = useLanguage();

  return (
    <section className="py-section bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-block"
        >
          <h2 className="font-heading text-heading text-foreground">
            {isHydrated ? t('landing.howItWorks.title') : 'How It Works'}
          </h2>
          <p className="mt-element text-foreground-muted">
            {isHydrated ? t('landing.howItWorks.subtitle') : 'Three simple steps to unlock your clarity'}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="flex flex-col gap-8 md:grid md:grid-cols-3 md:gap-block"
        >
          {stepsData.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <motion.div
                key={step.key}
                variants={itemVariants}
                className="relative text-center"
              >
                <div className="mb-element flex justify-center">
                  <motion.div
                    className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-60 shadow-gold-sm border border-gold-10"
                    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                  >
                    <div className="absolute inset-0 rounded-2xl gradient-gold-subtle" />
                    <StepIcon className="h-9 w-9 text-gold relative z-10" />
                    <motion.div
                      className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-accent-start to-accent-end text-sm font-bold text-black shadow-md"
                    >
                      {step.number}
                    </motion.div>
                  </motion.div>
                </div>

                {index < stepsData.length - 1 && (
                  <div className="hidden md:block absolute top-[60%] left-[60%] h-px w-[80%]">
                    <motion.div
                      className="h-full w-full bg-gradient-to-r from-gold-10 via-gold-20 to-gold-10"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                )}

                <h3 className="font-heading text-heading-sm text-foreground mb-element">
                  {isHydrated ? t(`landing.howItWorks.${step.key}.title`) : 
                    step.key === 'ask' ? 'Ask Your Question' :
                    step.key === 'pick' ? 'Pick Your Cards' : 'Reveal Your Answers'}
                </h3>
                <p className="text-body-sm text-foreground-muted leading-relaxed">
                  {isHydrated ? t(`landing.howItWorks.${step.key}.description`) : 
                    step.key === 'ask' ? 'Focus on what truly troubles your heart' :
                    step.key === 'pick' ? 'Select three cards from the mystical deck' : 'Receive personalized insights instantly'}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}