import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import crypto from 'crypto';

async function getAuthenticatedUserId(request: NextRequest): Promise<string | null> {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    return user.id;
  } catch (e) {
    console.error('[Verify] Auth error:', e);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = await request.json();

    if (!razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    const authenticatedUserId = await getAuthenticatedUserId(request);

    if (!authenticatedUserId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (!process.env.RAZORPAY_KEY_SECRET || !process.env.RAZORPAY_KEY_ID) {
      console.error('[Verify] Missing Razorpay server config');
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 },
      );
    }

    if (!razorpay_subscription_id) {
      return NextResponse.json({ error: 'Missing subscription id' }, { status: 400 });
    }

    const body = razorpay_payment_id + '|' + razorpay_subscription_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Verify payment status + amount by fetching from Razorpay
    const Razorpay = (await import('razorpay')).default;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const expectedAmountPaise = 19900; // ₹199.00

    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment?.status !== 'captured') {
      return NextResponse.json({ error: 'Payment not captured' }, { status: 400 });
    }

    const normalizedAmount =
      typeof payment.amount === 'string' ? Number(payment.amount) : payment.amount;

    if (typeof normalizedAmount !== 'number' || Number.isNaN(normalizedAmount)) {
      return NextResponse.json({ error: 'Invalid amount from Razorpay' }, { status: 400 });
    }

    if (normalizedAmount !== expectedAmountPaise) {
      return NextResponse.json(
        { error: 'Payment amount mismatch' },
        { status: 400 },
      );
    }

    // Optional: verify subscription id matches
    if (payment?.subscription_id !== razorpay_subscription_id) {
      return NextResponse.json({ error: 'Subscription mismatch' }, { status: 400 });
    }

    const supabase = await createServerClient();

    const endDate = new Date();
    endDate.setUTCDate(endDate.getUTCDate() + 30);

    const { error: updateError } = await supabase
      .from('users')
      .update({
        plan: 'premium',
        subscription_status: 'active',
        razorpay_payment_id,
        razorpay_subscription_id,
        subscription_end_date: endDate.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', authenticatedUserId);


    if (updateError) {
      console.error('[Verify] Supabase update error:', updateError);
      return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Verify] Error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}