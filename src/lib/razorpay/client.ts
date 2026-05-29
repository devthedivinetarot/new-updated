"use client";

export interface RazorpayOptions {
  key: string;
  amount?: number;
  currency?: string;
  name: string;
  description?: string;
  order_id?: string;
  subscription_id?: string;
  handler?: (response: RazorpayResponse) => void;
  theme?: {
    color?: string;
  };
  modal?: {
    onDismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_subscription_id?: string;
  razorpay_signature: string;
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function openRazorpayCheckout(options: RazorpayOptions): Promise<RazorpayResponse> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.Razorpay) {
      reject(new Error('Razorpay SDK not loaded'));
      return;
    }

    const rzp = new window.Razorpay({
      ...options,
      handler: (response: RazorpayResponse) => {
        resolve(response);
      },
      modal: {
        ...options.modal,
        onDismiss: () => {
          reject(new Error('Payment cancelled by user'));
          options.modal?.onDismiss?.();
        },
      },
    });

    rzp.open();
  });
}