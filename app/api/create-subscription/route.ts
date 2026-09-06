import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import Razorpay from 'razorpay';

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

const PREMIUM_PLAN_ID = process.env.RAZORPAY_PREMIUM_PLAN_ID || 'premium_monthly';

/**
 * Get authenticated user from Supabase session
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
    console.error('[Create Subscription] Auth error:', e);
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
 * Validate phone number format
 */
function isValidPhone(phone: string): boolean {
  return /^\+?[1-9]\d{9,14}$/.test(phone);
}

export async function POST(request: NextRequest) {
  try {
    const { userId, email, name, contact } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
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
      console.error('[Create Subscription] User ID mismatch - possible spoofing attempt');
      return NextResponse.json(
        { error: 'Unauthorized user' },
        { status: 403 }
      );
    }

    if (!razorpay) {
      console.warn('[Create Subscription] Razorpay not configured, using mock mode');
      return NextResponse.json({
        success: true,
        subscriptionId: `mock_sub_${Date.now()}`,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock',
      });
    }

    let customerData: { name?: string; email?: string; contact?: string } = {};
    
    if (email || name || contact) {
      customerData = {
        name: name || 'User',
        email: email && isValidEmail(email) ? email : '',
        contact: contact && isValidPhone(contact) ? contact : '',
      };
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: PREMIUM_PLAN_ID,
      customer_notify: 1,
      notes: {
        userId,
      },
      total_count: 12,
      expire_by: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
      ...customerData,
    });

    await supabase.from('users').update({
      razorpay_subscription_id: subscription.id,
      updated_at: new Date().toISOString(),
    }).eq('id', userId);

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('[Create Subscription] Error:', error);
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}