import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

export interface CreateOrderParams {
  amount: number;
  currency?: string;
  receipt: string;
  userId: string;
  planType: 'premium' | 'pro';
}

export interface OrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface PaymentVerificationParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function createOrder(params: CreateOrderParams): Promise<OrderResponse | null> {
  if (!razorpay) {
    console.log('[Razorpay] Mock order created:', params);
    return {
      id: `mock_order_${Date.now()}`,
      amount: params.amount * 100,
      currency: params.currency || 'INR',
      receipt: params.receipt,
      status: 'created',
    };
  }

  try {
    const order = await razorpay.orders.create({
      amount: params.amount * 100,
      currency: params.currency || 'INR',
      receipt: params.receipt,
      notes: {
        userId: params.userId,
        planType: params.planType,
      },
    });

    console.log('[Razorpay] Order created:', order.id);

    return {
      id: order.id as string,
      amount: Number(order.amount) / 100,
      currency: order.currency as string,
      receipt: order.receipt as string,
      status: order.status as string,
    };
  } catch (error) {
    console.error('[Razorpay] Order creation error:', error);
    return null;
  }
}

export function verifyPaymentSignature(params: PaymentVerificationParams): boolean {
  if (!razorpay) {
    console.log('[Razorpay] Mock signature verification');
    return true;
  }

  try {
    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${params.razorpay_order_id}|${params.razorpay_payment_id}`)
      .digest('hex');

    return generatedSignature === params.razorpay_signature;
  } catch (error) {
    console.error('[Razorpay] Signature verification error:', error);
    return false;
  }
}

export async function createSubscription(
  userId: string,
  planType: 'premium' | 'pro',
  email: string,
  contact: string
): Promise<string | null> {
  if (!razorpay) {
    console.log('[Razorpay] Mock subscription created:', { userId, planType });
    return `mock_sub_${Date.now()}`;
  }

  const plan = planType === 'premium' ? 'premium_monthly' : 'pro_monthly';

  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: plan,
      customer_notify: 1,
      notes: {
        userId,
      },
      total_count: 12,
      expire_by: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
    });

    console.log('[Razorpay] Subscription created:', subscription.id);
    return subscription.id as string;
  } catch (error) {
    console.error('[Razorpay] Subscription creation error:', error);
    return null;
  }
}

export async function getSubscription(subscriptionId: string) {
  if (!razorpay) {
    return { status: 'active', mock: true };
  }

  try {
    return await razorpay.subscriptions.fetch(subscriptionId);
  } catch (error) {
    console.error('[Razorpay] Fetch subscription error:', error);
    return null;
  }
}

export async function cancelSubscription(subscriptionId: string) {
  if (!razorpay) {
    console.log('[Razorpay] Mock subscription cancelled:', subscriptionId);
    return true;
  }

  try {
    await razorpay.subscriptions.cancel(subscriptionId);
    return true;
  } catch (error) {
    console.error('[Razorpay] Cancel subscription error:', error);
    return false;
  }
}

export function isRazorpayConfigured(): boolean {
  return !!razorpay;
}

export function generateReceiptId(userId: string, planType: string): string {
  return `receipt_${userId}_${planType}_${Date.now()}`;
}