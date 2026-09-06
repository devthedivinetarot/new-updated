import { verifyPaymentSignature } from '@/lib/razorpay/server';
import crypto from 'crypto';

const TEST_SECRET = 'test_secret_key_123';
const TEST_ORDER_ID = 'order_test123';
const TEST_PAYMENT_ID = 'payment_test123';

function generateValidSignature(orderId: string, paymentId: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
}

describe('paymentSignature', () => {
  beforeAll(() => {
    process.env.RAZORPAY_KEY_SECRET = TEST_SECRET;
  });

  it('should verify valid signature', () => {
    const validSignature = generateValidSignature(TEST_ORDER_ID, TEST_PAYMENT_ID, TEST_SECRET);
    const result = verifyPaymentSignature(TEST_ORDER_ID, TEST_PAYMENT_ID, validSignature);
    expect(result).toBe(true);
  });

  it('should reject tampered signature', () => {
    const validSignature = generateValidSignature(TEST_ORDER_ID, TEST_PAYMENT_ID, TEST_SECRET);
    const tamperedSignature = validSignature.slice(0, -1) + 'x';
    const result = verifyPaymentSignature(TEST_ORDER_ID, TEST_PAYMENT_ID, tamperedSignature);
    expect(result).toBe(false);
  });

  it('should reject signature with wrong orderId', () => {
    const validSignature = generateValidSignature(TEST_ORDER_ID, TEST_PAYMENT_ID, TEST_SECRET);
    const result = verifyPaymentSignature('wrong_order', TEST_PAYMENT_ID, validSignature);
    expect(result).toBe(false);
  });
});