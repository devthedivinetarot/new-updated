'use client';

import { useSubscription } from '@/hooks/useSubscription';
import SubscriptionButton from '@/components/subscription/SubscriptionButton';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SubscriptionPage() {
  const { isPremium: isSubscribed } = useSubscription();

  if (isSubscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center py-20"
        >
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
            Premium Active ✨
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Your subscription is active. Enjoy unlimited tarot readings and Ginni conversations.
          </p>
          <Link
            href="/reading"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFC400] text-black font-bold hover:shadow-lg transition-all"
          >
            Go to Reading
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center"
      >
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
          Premium Membership
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Registration-based subscriptions are managed from your client area.
          Go Premium to unlock unlimited readings and guidance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/premium">
            <SubscriptionButton />
          </Link>
          <Link
            href="/reading"
            className="px-8 py-3.5 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all"
          >
            Try Free Reading
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
