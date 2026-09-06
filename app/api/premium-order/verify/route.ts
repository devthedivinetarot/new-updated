import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { verifyPaymentSignature } from '@/lib/razorpay/server';

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
    const { orderId, paymentId, signature } = await request.json();

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, paymentId, signature' },
        { status: 400 }
      );
    }

    const authenticatedUserId = await getAuthenticatedUserId(request);

    if (!authenticatedUserId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const isValid = verifyPaymentSignature(orderId, paymentId, signature);

    if (!isValid) {
      console.error('[Verify] Invalid signature - possible fraud attempt');
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    const endDate = new Date();
    endDate.setUTCMonth(endDate.getUTCMonth() + 1);
    const startDate = new Date();

    const supabase = await createServerClient();
    const { error } = await supabase
      .from('users')
      .update({
        plan: 'premium',
        subscription_status: 'active',
        subscription_started_at: startDate.toISOString(),
        subscription_end_date: endDate.toISOString(),
        razorpay_payment_id: paymentId,
        auto_renew: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', authenticatedUserId);

    if (error) {
      console.error('[Verify Payment] Update error:', error);
      return NextResponse.json(
        { error: 'Failed to activate subscription' },
        { status: 500 }
      );
    }

    await supabase.from('payments').insert({
      user_id: authenticatedUserId,
      amount: 19900,
      currency: 'INR',
      status: 'completed',
      razorpay_payment_id: paymentId,
      razorpay_order_id: orderId,
      plan_type: 'premium',
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error: unknown) {
    console.error('[Verify Premium Order] Error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}