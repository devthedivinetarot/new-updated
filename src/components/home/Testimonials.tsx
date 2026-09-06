'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import PremiumCarousel from '@/components/ui/PremiumCarousel';
import { useLanguage } from '@/hooks/useLanguage';

const testimonials = [
  {
    name: 'Sarah M.',
    text: "The reading was eerily accurate. It helped me see my situation clearly and make peace with what I couldn't change.",
    role: 'Verified Reader',
    rating: 5,
  },
  {
    name: 'James L.',
    text: "I was skeptical at first, but the insights were profound. This isn't just random cards - there's real depth here.",
    role: 'Verified Reader',
    rating: 5,
  },
  {
    name: 'Emily R.',
    text: "Beautiful experience. The cards revealed what I needed to hear, not what I wanted to hear. That's the real gift.",
    role: 'Verified Reader',
    rating: 5,
  },
  {
    name: 'Michael K.',
    text: "Got clarity on a career decision that had me stuck for months. The guidance was specific and actionable.",
    role: 'Verified Reader',
    rating: 5,
  },
  {
    name: 'Priya S.',
    text: "This felt too accurate... I didn't expect this level of insight from an online reading. Still gives me chills thinking about it.",
    role: 'Verified Reader',
    rating: 5,
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Testimonials() {
  const { t, isHydrated } = useLanguage();
  return (
    <section className="py-16 md:py-20 bg-background overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-foreground">
            {isHydrated ? t('testimonials.title') : 'Voices of the Illuminated'}
          </h2>
          <p className="mt-4 text-foreground-muted">
            {isHydrated ? t('testimonials.subtitle') : 'What seekers are saying about their journey'}
          </p>
        </motion.div>

        <PremiumCarousel itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }} autoScroll={true} autoScrollInterval={25000}>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              className="flex flex-col p-6 rounded-2xl bg-surface-60 border border-gold-10 hover:border-gold-30 hover:shadow-gold transition-all duration-300 h-full"
            >
              <div className="mb-4 flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-gold fill-gold" />
                ))}
              </div>
              <p className="text-foreground-secondary italic mb-6 leading-relaxed text-sm flex-grow">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gold-10 to-secondary-10 flex items-center justify-center border border-gold-20">
                  <span className="text-foreground font-medium">{testimonial.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-foreground-muted">{isHydrated ? t('testimonials.role') : testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </PremiumCarousel>
      </div>
    </section>
  );
}