import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { createOrder } from '@/lib/razorpay/server';

const PREMIUM_AMOUNT = 19900; // 199.00 INR in paise

async function getAuthenticatedUserId(request: NextRequest): Promise<string | null> {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    return user.id;
  } catch (e) {
    console.error('[Premium Order] Auth error:', e);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const authenticatedUserId = await getAuthenticatedUserId(request);

    if (!authenticatedUserId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    if (!keyId) {
      console.warn('[Premium Order] Razorpay key not configured, using mock mode');
      return NextResponse.json({
        success: true,
        orderId: `mock_order_${Date.now()}`,
        amount: PREMIUM_AMOUNT,
        currency: 'INR',
        keyId: 'rzp_test_mock',
      });
    }

    const timestamp = Date.now();
    const receiptId = `tdt_${authenticatedUserId}_${timestamp}`;

    const order = await createOrder(PREMIUM_AMOUNT, 'INR', receiptId);

    const supabase = await createServerClient();
    await supabase.from('orders').insert({
      user_id: authenticatedUserId,
      razorpay_order_id: order.id,
      amount: order.amount,
      currency: 'INR',
      status: 'created',
      plan_type: 'premium',
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: Number(order.amount),
      currency: 'INR',
      keyId,
    });
  } catch (error: unknown) {
    console.error('[Premium Order] Error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}