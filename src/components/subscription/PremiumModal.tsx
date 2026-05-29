import { useState, useEffect, useCallback } from 'react';
import { loadRazorpayScript } from '@/lib/razorpay/client';
import { useSubscription } from '@/hooks/useSubscription';
import { logEvent } from '@/lib/utils/tracking';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerSource?: string;
  onPaymentSuccess?: () => void;
}

const SUBSCRIPTION_ID = 'sub_Spfpl7cYrf7xr5';

export default function PremiumModal({ isOpen, onClose, triggerSource = 'modal', onPaymentSuccess }: PremiumModalProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { refetch } = useSubscription();

  useEffect(() => {
    if (!isOpen) return;

    loadRazorpayScript().then((loaded) => {
      setIsScriptLoaded(loaded);
      if (!loaded) {
        setError('Failed to load payment gateway. Please try again.');
      }
    });
  }, [isOpen]);

  const handleUpgrade = useCallback(async () => {
    if (!isScriptLoaded) {
      setError('Payment gateway not loaded. Please refresh and try again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      const options = {
        key: keyId,
        subscription_id: SUBSCRIPTION_ID,
        name: 'Divine Tarot',
        description: 'Premium Monthly Subscription',
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_subscription_id?: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyResponse = await fetch('/api/subscription/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            setSuccess(true);
            logEvent('premium_payment_success', {
              triggerSource,
              paymentId: response.razorpay_payment_id,
            });

            localStorage.setItem('premium_override', Date.now().toString());
            await refetch();
            onPaymentSuccess?.();

            setTimeout(() => {
              onClose();
              setSuccess(false);
            }, 3000);
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Payment verification failed';
            setError(errorMessage);
          } finally {
            setIsLoading(false);
          }
        },
        theme: {
          color: '#FFD700',
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  }, [isScriptLoaded, onPaymentSuccess, onClose, refetch, triggerSource]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-md bg-gray-900 rounded-2xl border border-yellow-500/20 max-h-[90vh] overflow-y-auto p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">
            Unlock Premium
          </h2>
          <p className="text-gray-300 mb-6">
            Unlimited tarot readings for just ₹199/month
          </p>

          {success && (
            <div className="mb-4 p-3 bg-green-900/50 border border-green-500/50 rounded-lg text-green-300">
              You're now Premium! ✨
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300">
              {error}
            </div>
          )}

          <div className="space-y-4 text-left mb-6">
            <div className="flex items-center gap-3">
              <span className="text-yellow-400">✓</span>
              <span>Unlimited tarot readings</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-yellow-400">✓</span>
              <span>Unlimited messages with Ginni</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-yellow-400">✓</span>
              <span>Deep spiritual insights</span>
            </div>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={isLoading || !isScriptLoaded}
            className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-300 text-black font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Unlock Premium'}
          </button>
        </div>
      </div>
    </div>
  );
}