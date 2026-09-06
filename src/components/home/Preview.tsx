'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';
import { usePersonalizationContext } from '@/components/personalization/PersonalizationProvider';

export default function Preview() {
  const { t, isHydrated } = useLanguage();
  const { profile } = usePersonalizationContext();

  const getUserName = () => {
    if (!profile) return '';
    const metadata = profile as any;
    const name = metadata?.metadata?.name || metadata?.name;
    return name ? name.split(' ')[0] : '';
  };

  const userName = getUserName();

  const previewReading = {
    personalOpening: isHydrated
      ? t('landing.preview.personalOpening', { name: userName })
      : userName
        ? `Arey yaar ${userName}… cards feel kar rahe hain tumhari energy 💖`
        : 'Arey yaar… cards feel kar rahe hain tumhari energy 💖',

    cards: [
      {
        name: isHydrated ? t('landing.preview.card1.name') : 'The Fool',
        image: '/card_img/The Fool.png',
        emoji: '🌟',
        interpretation: isHydrated
          ? t('landing.preview.card1.interpretation')
          : 'Umeed aur healing ka card hai. Universe clarity la raha hai ✨',
      },
      {
        name: isHydrated ? t('landing.preview.card2.name') : 'The Lovers',
        image: '/card_img/The Lovers.png',
        emoji: '💰',
        interpretation: isHydrated
          ? t('landing.preview.card2.interpretation')
          : 'Stability aur emotional security dikhata hai 💖',
      },
      {
        name: isHydrated ? t('landing.preview.card3.name') : 'The Star',
        image: '/card_img/The Star.png',
        emoji: '🎉',
        interpretation: isHydrated
          ? t('landing.preview.card3.interpretation')
          : 'Celebration ka sign hai! Kuch exciting hone wala hai 🪄',
      },
    ],

    guidance: userName
      ? `${userName}, universe ek hi cheez keh raha hai — trust the process. 💫`
      : isHydrated
        ? t('landing.preview.guidanceBlock.text')
        : 'Universe tumhe trust the process keh raha hai. 💫',

    cliffhanger: isHydrated
      ? t('landing.preview.previewLock')
      : 'Aur bohot kuch reveal ho raha hai... 🌙',

    ctaButton: isHydrated
      ? t('landing.preview.ctaButton')
      : 'Full Reading Dekho ✨',

    ctaSubtext: isHydrated ? t('landing.preview.ctaSubtext') : '⏳ 60 seconds mein complete reading ✨',
  };

  return (
    <section className="relative bg-background py-6 md:py-10 lg:py-12 overflow-hidden">
      <div className="w-full mx-auto px-4 md:px-8 lg:max-w-[1600px] lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-[#140A24] to-[#0B0B0F] shadow-[0_0_40px_rgba(255,215,0,0.06)] min-h-[80vh] flex flex-col justify-between"
        >
          <div className="px-5 md:px-8 lg:px-12 py-6 flex flex-col gap-5">
            {/* SECTION 1: COMPACT EMOTIONAL OPENING */}
            <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <p className="text-gray-200 text-[15px] md:text-base lg:text-lg leading-7 font-serif italic px-5 py-4 rounded-2xl bg-gradient-to-br from-[#1A0B2E] to-[#0B0B0F] border border-yellow-500/20 w-full text-center mx-auto max-w-3xl">
                {previewReading.personalOpening}
              </p>
            </motion.div>

            {/* SECTION 2: COMPACT DIVIDER */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-center gap-3 my-2"
            >
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-yellow-400/40 max-w-12" />
              <h2 className="font-heading text-yellow-300 text-lg md:text-xl lg:text-2xl tracking-wide font-semibold whitespace-nowrap">
                ✨ CARDS KA MESSAGE
              </h2>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-yellow-400/40 max-w-12" />
            </motion.div>

            {/* SECTION 3: TAROT CARDS */}
            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {previewReading.cards.map((card, index) => (
                <motion.div
                  key={card.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="flex flex-col items-center text-center rounded-2xl p-4 bg-gradient-to-br from-[#1A0B2E] to-[#0B0B0F] border border-yellow-500/10 h-full"
                >
                  <div className="relative aspect-[3/4] w-[150px] md:w-[180px] lg:w-[220px] rounded-xl overflow-hidden shadow-lg mb-4 mx-auto">
                    <Image src={card.image} alt={card.name} fill className="object-cover" sizes="(max-width: 768px) 150px, (max-width: 1024px) 180px, 220px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2">
                      <span className="text-lg lg:text-xl">{card.emoji}</span>
                    </div>
                  </div>
                  <h3 className="text-yellow-300 text-xl lg:text-2xl font-heading font-semibold mb-2 tracking-wide">{card.name}</h3>
                  <p className="text-gray-200 text-[14px] md:text-base lg:text-base leading-6 font-serif italic flex-grow">
                    {card.interpretation}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* SECTION 4: GUIDANCE & MOTIVATION */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <h3 className="text-yellow-300 text-lg lg:text-xl font-heading font-semibold">✨ Guidance &amp; Motivation</h3>
              <div className="rounded-2xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 px-5 py-4 lg:px-8 lg:py-6">
                <p className="text-yellow-100/90 text-[14px] md:text-base lg:text-base leading-6 font-serif italic">
                  {previewReading.guidance}
                </p>
              </div>
            </motion.div>

            {/* SECTION 5: CLIFFHANGER */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <p className="text-gray-300 text-sm md:text-base opacity-80 leading-relaxed max-w-2xl mx-auto">
                {previewReading.cliffhanger}
              </p>
            </motion.div>
          </div>

          {/* SECTION 6: CTA & TRUST SUBTEXT */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="px-5 md:px-8 lg:px-12 pt-2 pb-8"
          >
            <Link
              href="/reading"
              className="flex items-center justify-center h-14 rounded-full bg-gradient-to-r from-[#FF5F6D] to-[#FFC371] text-black font-semibold text-base md:text-lg w-full max-w-[700px] mx-auto shadow-[0_0_40px_rgba(255,200,0,0.35)] hover:scale-[1.02] transition-all duration-300"
            >
              {previewReading.ctaButton}
            </Link>
            <p className="mt-3 text-[11px] md:text-xs text-gray-400 font-normal text-center">{previewReading.ctaSubtext}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}