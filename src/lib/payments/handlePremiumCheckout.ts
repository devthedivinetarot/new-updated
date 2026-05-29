import { logEvent } from '@/lib/utils/tracking';
import { loadRazorpayScript } from '@/lib/razorpay/client';
import { supabase } from '@/lib/supabase/client';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentResult {
  success: boolean;
  error?: string;
  paymentId?: string;
  subscriptionId?: string;
}

const SUBSCRIPTION_ID = 'sub_Spfpl7cYrf7xr5';
const SUBSCRIPTION_LINK = 'https://rzp.io/rzp/7DHHKUsD';

async function getAuthenticatedUserId(): Promise<string | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return null;
    }
    return user.id;
  } catch (e) {
    console.error('[handlePremiumCheckout] Auth error:', e);
    return null;
  }
}

export async function handlePremiumCheckout(
  triggerSource: string = 'unknown',
): Promise<PaymentResult> {
  try {
    const userId = await getAuthenticatedUserId();
    
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    logEvent('premium_payment_initiated', { triggerSource, userId });

    const razorpayLoaded = await loadRazorpayScript();
    if (!razorpayLoaded) {
      return { success: false, error: 'Razorpay SDK failed to load' };
    }

    return new Promise((resolve) => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
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

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.success) {
              logEvent('premium_payment_success', {
                userId,
                paymentId: response.razorpay_payment_id,
                subscriptionId: response.razorpay_subscription_id,
                triggerSource,
              });

              logEvent('premium_conversion', {
                userId,
                triggerSource,
                amount: 199,
                currency: 'INR',
              });

              resolve({
                success: true,
                paymentId: response.razorpay_payment_id,
                subscriptionId: response.razorpay_subscription_id,
              });
            } else {
              resolve({ success: false, error: verifyData.error || 'Payment verification failed' });
            }
          } catch (err: any) {
            resolve({ success: false, error: err.message || 'Payment verification failed' });
          }
        },
        prefill: {},
        theme: {
          color: '#FFD700',
        },
        modal: {
          ondismiss: () => {
            resolve({ success: false, error: 'Payment cancelled' });
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', (response: any) => {
        logEvent('premium_payment_failed', {
          userId,
          error: response.error?.reason,
          triggerSource,
        });
        resolve({ success: false, error: response.error?.reason || 'Payment failed' });
      });

      rzp.open();
    });
  } catch (err: any) {
    console.error('[handlePremiumCheckout] Error:', err);
    logEvent('error_occurred', {
      userId: 'unknown',
      error: err.message,
      triggerSource,
    });
    return { success: false, error: err.message || 'Payment initialization failed' };
  }
}