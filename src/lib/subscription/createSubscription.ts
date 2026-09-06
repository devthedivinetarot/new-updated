import { supabase } from '@/lib/supabase/client';

interface RazorpaySubscriptionOptions {
  key: string;
  subscription_id: string;
  name: string;
  description: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_subscription_id: string;
    razorpay_signature: string;
  }) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal?: {
    ondismiss: () => void;
  };
}

export async function createRazorpaySubscription(
  userId: string
): Promise<{ subscriptionId: string; key: string }> {
  try {
    const response = await fetch('/api/create-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create subscription');
    }

    const data = await response.json();
    return {
      subscriptionId: data.subscriptionId,
      key: data.key,
    };
  } catch (error) {
    console.error('[createRazorpaySubscription] Error:', error);
    throw error;
  }
}

export async function verifySubscriptionPayment(
  userId: string,
  paymentData: {
    razorpay_payment_id: string;
    razorpay_subscription_id: string;
    razorpay_signature: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        ...paymentData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error || 'Payment verification failed' };
    }

    const data = await response.json();
    return { success: true, ...data };
  } catch (error: any) {
    console.error('[verifySubscriptionPayment] Error:', error);
    return { success: false, error: error.message || 'Verification failed' };
  }
}

export async function createRazorpaySubscriptionOptions(userId: string): Promise<RazorpaySubscriptionOptions> {
  try {
    const subscription = await createRazorpaySubscription(userId);

    // Avoid Supabase typing degrading to `never` in this repo.
    const client: any = supabase;

    const { data: user, error } = await client
      .from('users')
      .select('name, email, phone')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[createRazorpaySubscriptionOptions] User fetch error:', error);
    }

    const typedUser = user as any;

    return {
      key: subscription.key,
      subscription_id: subscription.subscriptionId,
      name: 'The Divine Tarot',
      description: 'Premium Monthly Subscription - Unlimited access to spiritual guidance',
      handler: (response: any) => {
        console.log('[createRazorpaySubscriptionOptions] Payment response:', response);
      },
      prefill: {
        name: typedUser?.name || 'User',
        email: typedUser?.email || '',
        contact: typedUser?.phone || '',
      },
      theme: {
        color: '#FFD700',
      },
      modal: {
        ondismiss: () => {
          console.log('[createRazorpaySubscriptionOptions] Modal dismissed');
        },
      },
    };

  } catch (error) {
    console.error('[createRazorpaySubscriptionOptions] Error:', error);
    throw error;
  }
}