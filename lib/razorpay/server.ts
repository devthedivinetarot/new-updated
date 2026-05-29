import crypto from 'crypto';
import Razorpay from 'razorpay';

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

let razorpay: Razorpay | null = null;

function getRazorpayInstance(): Razorpay | null {
  if (razorpay) return razorpay;
  
  if (!razorpayKeyId || !razorpayKeySecret) {
    return null;
  }
  
  try {
    razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });
    return razorpay;
  } catch {
    return null;
  }
}

export interface Order {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  created_at: number;
}

export function createOrder(
  amount: number,
  currency: string = 'INR',
  receiptId: string
): Promise<Order> {
  const instance = getRazorpayInstance();
  if (!instance) {
    throw new Error('Razorpay not configured');
  }
  return instance.orders.create({
    amount,
    currency,
    receipt: receiptId,
  }) as Promise<Order>;
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!razorpayKeySecret) {
    return false;
  }
  
  const expectedSignature = crypto
    .createHmac('sha256', razorpayKeySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return expectedSignature === signature;
}

export function verifySubscriptionSignature(
  paymentId: string,
  subscriptionId: string,
  signature: string
): boolean {
  if (!razorpayKeySecret) {
    return false;
  }
  
  const expectedSignature = crypto
    .createHmac('sha256', razorpayKeySecret)
    .update(`${paymentId}|${subscriptionId}`)
    .digest('hex');

  return expectedSignature === signature;
}

export { razorpayKeyId };