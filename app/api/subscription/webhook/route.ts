import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import crypto from 'crypto';
import * as Sentry from '@sentry/nextjs';

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return new NextResponse(null, { status: 200 });
    }

    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';

    const expectedSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (expectedSig !== signature) {
      console.error('[Webhook] Invalid signature - possible webhook tampering');
      return new NextResponse(null, { status: 200 });
    }

    const payload = JSON.parse(body);
    const event = payload.event;
    const supabase = await createServerClient();

    switch (event) {
      case 'subscription.activated': {
        const subscription = payload.payload.subscription.entity;
        const userId = subscription.notes?.userId || subscription.customer_id;

        if (userId) {
          const endDate = new Date();
          endDate.setUTCMonth(endDate.getUTCMonth() + 1);
          const startDate = new Date();

          await supabase
            .from('users')
            .update({
              plan: 'premium',
              subscription_status: 'active',
              subscription_started_at: startDate.toISOString(),
              subscription_end_date: endDate.toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);
        }
        break;
      }

      case 'subscription.charged': {
        const subscription = payload.payload.subscription.entity;
        const userId = subscription.notes?.userId || subscription.customer_id;

        if (userId) {
          const endDate = new Date();
          endDate.setUTCMonth(endDate.getUTCMonth() + 1);

          await supabase
            .from('users')
            .update({
              subscription_status: 'active',
              subscription_end_date: endDate.toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);
        }
        break;
      }

      case 'subscription.cancelled': {
        const subscription = payload.payload.subscription.entity;
        const userId = subscription.notes?.userId || subscription.customer_id;

        if (userId) {
          await supabase
            .from('users')
            .update({
              subscription_status: 'cancelled',
              auto_renew: false,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);
        }
        break;
      }

      case 'payment.failed': {
        const payment = payload.payload.payment.entity;
        const userId = payment.notes?.userId || payment.customer_id;

        if (userId) {
          await supabase
            .from('users')
            .update({
              subscription_status: 'past_due',
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);
        }
        break;
      }

      default:
        break;
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('[Subscription Webhook] Error:', error);
    return new NextResponse(null, { status: 200 });
  }
}