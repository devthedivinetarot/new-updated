'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, Crown } from 'lucide-react';
import Link from 'next/link';
import SubscriptionButton from '@/components/subscription/SubscriptionButton';
import { SUBSCRIPTION_PLANS } from '@/lib/payments/plans';

export default function PremiumPage() {
  const plans = SUBSCRIPTION_PLANS;

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FFD700]/20 to-[#FF4D4D]/10 border border-[#FFD700]/30 mb-6">
            <Crown className="w-4 h-4 text-[#FFD700]" />
            <span className="text-sm font-medium text-[#FFD700]">Premium Membership</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Unlock Your Complete Tarot Journey
          </h1>
          <p className="text-lg text-[#A1A1AA] max-w-2xl mx-auto">
            Continue your spiritual journey without limits. Your answers are waiting beyond the veil.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {Object.values(plans).map((plan, index) => {
            const isPremium = plan.id === 'premium';
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl p-6 md:p-8 border ${
                  isPremium
                    ? 'bg-gradient-to-br from-[#FFD700]/10 to-[#FF4D4D]/5 border-[#FFD700]/30 shadow-2xl shadow-[#FFD700]/10'
                    : 'bg-white/5 border-[#3C281A]/50'
                }`}
              >
                {isPremium && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF4D4D] text-black text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      MOST POPULAR
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isPremium 
                      ? 'bg-gradient-to-br from-[#FFD700] to-[#FF4D4D]' 
                      : 'bg-white/10'
                  }`}>
                    {isPremium ? (
                      <Crown className="w-6 h-6 text-black" />
                    ) : (
                      <span className="text-xl">✨</span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-[#EAEAF0]">
                    {plan.name}
                  </h3>
                </div>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#EAEAF0]">
                    {plan.price === 0 ? 'Free' : '₹' + plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-[#A1A1AA]">/month</span>
                  )}
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-[#A1A1AA]">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isPremium ? 'bg-[#FFD700]/20' : 'bg-white/10'
                      }`}>
                        <Check className={`w-3 h-3 ${isPremium ? 'text-[#FFD700]' : 'text-white/60'}`} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {/* Premium plan specific content */}
                {isPremium && (
                  <>
                    <div className="mb-4">
                      <SubscriptionButton />
                    </div>
                  </>
                )}
                
                {(!isPremium) && (
                  <Link href="/reading" passHref>
                    <button
                      className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                        'bg-white/10 text-[#EAEAF0] hover:bg-white/20'
                      }`}>
                      Current Plan
                    </button>
                  </Link>
                )}
              </motion.div>
              );
          })}
        </div>

        {/* Why Premium Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 md:mt-20 max-w-3xl mx-auto text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Why Choose Premium?
          </h2>
          <p className="text-[#A1A1AA] mb-8">
            Your spiritual journey deserves uninterrupted guidance. Premium gives you the freedom to seek clarity whenever your heart calls for it.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-3xl mb-3">✨</div>
              <h3 className="font-semibold text-white mb-2">Unlimited Access</h3>
              <p className="text-sm text-[#A1A1AA]">
                No limits on readings. Ask as often as you need.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-3xl mb-3">🔮</div>
              <h3 className="font-semibold text-white mb-2">Deep Insights</h3>
              <p className="text-sm text-[#A1A1AA]">
                Experience the full depth of spiritual guidance.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-white mb-2">Priority Support</h3>
              <p className="text-sm text-[#A1A1AA]">
                Get responses faster when you need them most.
              </p>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 md:mt-20 max-w-3xl mx-auto"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            <details className="group">
              <summary className="cursor-pointer p-4 rounded-lg bg-white/5 border border-white/10 text-white font-medium">
                Can I cancel anytime?
              </summary>
              <p className="mt-2 px-4 text-[#A1A1AA]">
               Yes, you can cancel your subscription at any time. You&apos;ll continue to have access until the end of your billing period.
              </p>
            </details>
            
            <details className="group">
              <summary className="cursor-pointer p-4 rounded-lg bg-white/5 border border-white/10 text-white font-medium">
                How does the daily message limit work?
              </summary>
              <p className="mt-2 px-4 text-[#A1A1AA]">
                On the Free plan, you get 1 message per 24 hours. This resets at midnight. Premium users have unlimited messages.
              </p>
            </details>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 md:mt-20 text-center"
        >
          <div className="space-y-4">
            <SubscriptionButton className="w-full md:w-auto" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}