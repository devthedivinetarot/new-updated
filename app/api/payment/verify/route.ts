import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';

interface RazorpayPayment {
  id: string;
  amount: string | number | undefined;
  subscription_id: string | null;
  status: string;
}

interface RazorpaySubscription {
  id: string;
  plan_id: string;
}

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

const REQUIRED_ENV_VARS = {
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
} as const;

const PREMIUM_PLAN_ID = process.env.RAZORPAY_PREMIUM_PLAN_ID || 'premium_monthly';

/**
 * Get authenticated user from Supabase session
 * This ensures the user can only activate subscription for themselves
 */
async function getAuthenticatedUserId(request: NextRequest): Promise<string | null> {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    return user.id;
  } catch (e) {
    console.error('[Verify Subscription] Auth error:', e);
    return null;
  }
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate phone number format (Indian numbers primarily)
 */
function isValidPhone(phone: string): boolean {
  return /^\+?[1-9]\d{9,14}$/.test(phone);
}

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    } = await request.json();

    if (!userId || !razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    // SECURITY FIX: Verify authenticated user matches the request userId
    const authenticatedUserId = await getAuthenticatedUserId(request);
    
    if (!authenticatedUserId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (authenticatedUserId !== userId) {
      console.error('[Verify Subscription] User ID mismatch - possible spoofing attempt');
      return NextResponse.json(
        { error: 'Unauthorized user' },
        { status: 403 }
      );
    }

    if (!REQUIRED_ENV_VARS.RAZORPAY_KEY_SECRET) {
      console.error('[Verify Subscription] Payment verification failed - missing secret key');
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    // IDEMPOTENCY CHECK: Prevent duplicate payment processing
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('razorpay_payment_id', razorpay_payment_id)
      .single();

    if (existingPayment) {
      console.log('[Verify Subscription] Payment already processed:', razorpay_payment_id);
      return NextResponse.json({
        success: true,
        message: 'Payment already processed',
        plan: 'premium',
      });
    }

    const expectedSignature = crypto
      .createHmac('sha256', REQUIRED_ENV_VARS.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('[Verify Subscription] Invalid signature - possible fraud attempt');
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    let subscriptionValid = true;
    let actualAmount: number | null = null;

    if (razorpay) {
      try {
        const payment = await razorpay.payments.fetch(
          razorpay_payment_id
        ) as RazorpayPayment;

        if (!payment.id) {
          throw new Error('Invalid payment response from Razorpay');
        }

        if (payment.subscription_id !== razorpay_subscription_id) {
          subscriptionValid = false;
        }

        if (typeof payment.status !== 'string' || payment.status !== 'captured') {
          subscriptionValid = false;
        }

        const normalizedAmount =
          typeof payment.amount === 'string'
            ? Number(payment.amount)
            : payment.amount;

        if (
          typeof normalizedAmount !== 'number' ||
          Number.isNaN(normalizedAmount) ||
          normalizedAmount <= 0
        ) {
          throw new Error(
            'Invalid payment amount received from Razorpay'
          );
        }

        actualAmount = normalizedAmount;

        if (payment.subscription_id) {
          const subscription =
            (await razorpay.subscriptions.fetch(
              razorpay_subscription_id
            )) as RazorpaySubscription;
          if (subscription.plan_id !== PREMIUM_PLAN_ID) {
            subscriptionValid = false;
          }
        }
      } catch (err) {
        console.error(
          '[Verify Subscription] Could not verify payment status:',
          err
        );
        subscriptionValid = false;
      }
    }

    if (!subscriptionValid) {
      return NextResponse.json(
        { error: 'Invalid subscription' },
        { status: 400 }
      );
    }

    if (actualAmount === null) {
      return NextResponse.json(
        { error: 'Could not verify payment amount' },
        { status: 500 }
      );
    }

    // Use UTC ISO strings for all dates
    const endDate = new Date();
    endDate.setUTCMonth(endDate.getUTCMonth() + 1);
    const startDate = new Date();

    const { error } = await supabase
      .from('users')
      .update({
        plan: 'premium',
        subscription_status: 'active',
        subscription_started_at: startDate.toISOString(),
        subscription_end_date: endDate.toISOString(),
        razorpay_payment_id: razorpay_payment_id,
        razorpay_subscription_id: razorpay_subscription_id,
        auto_renew: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('[Verify Subscription] Update error:', error);
      return NextResponse.json(
        { error: 'Failed to activate subscription' },
        { status: 500 }
      );
    }

    // Use actual amount from Razorpay (already validated as number above)
    const paymentAmount = actualAmount;

    await supabase.from('payments').insert({
      user_id: userId,
      amount: paymentAmount,
      currency: 'INR',
      status: 'completed',
      razorpay_payment_id,
      razorpay_subscription_id,
      plan_type: 'premium',
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription activated successfully',
      plan: 'premium',
      expiresAt: endDate.toISOString(),
    });
  } catch (error: unknown) {
    console.error('[Verify Subscription] Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Verification failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}