// src/lib/subscription/subscriptionState.ts
// NOTE: This module is currently unused — subscription state is managed by hooks/useSubscription.ts.
// Kept for backwards compatibility. Uses plain JS (no Svelte dependency).

export interface SubscriptionState {
  plan: 'free' | 'premium';
  isActive: boolean;
  messagesUsedToday: number;
  lastMessageAt: string | null;
  subscriptionId: string | null;
  subscriptionExpiry: string | null;
  paymentProvider: 'razorpay' | null;
}

type Listener = (state: SubscriptionState) => void;

let _listeners: Listener[] = [];

let _state: SubscriptionState = {
  plan: 'free',
  isActive: false,
  messagesUsedToday: 0,
  lastMessageAt: null,
  subscriptionId: null,
  subscriptionExpiry: null,
  paymentProvider: null,
};

export function createSubscriptionStore() {
  const setPlan = (plan: 'free' | 'premium') => {
    _state = { ..._state, plan };
    _listeners.forEach(fn => fn(_state));
  };

  const setActive = (isActive: boolean) => {
    _state = { ..._state, isActive };
    _listeners.forEach(fn => fn(_state));
  };

  const incrementMessagesUsed = () => {
    _state = { ..._state, messagesUsedToday: _state.messagesUsedToday + 1 };
    _listeners.forEach(fn => fn(_state));
  };

  const setLastMessageAt = (timestamp: string) => {
    _state = { ..._state, lastMessageAt: timestamp };
    _listeners.forEach(fn => fn(_state));
  };

  const setSubscriptionId = (id: string) => {
    _state = { ..._state, subscriptionId: id };
    _listeners.forEach(fn => fn(_state));
  };

  const setSubscriptionExpiry = (expiry: string) => {
    _state = { ..._state, subscriptionExpiry: expiry };
    _listeners.forEach(fn => fn(_state));
  };

  const setPaymentProvider = (provider: 'razorpay' | null) => {
    _state = { ..._state, paymentProvider: provider };
    _listeners.forEach(fn => fn(_state));
  };

  const reset = () => {
    _state = {
      plan: 'free',
      isActive: false,
      messagesUsedToday: 0,
      lastMessageAt: null,
      subscriptionId: null,
      subscriptionExpiry: null,
      paymentProvider: null,
    };
    _listeners.forEach(fn => fn(_state));
  };

  const subscribe = (listener: Listener) => {
    _listeners.push(listener);
    listener(_state);
    return () => {
      _listeners = _listeners.filter(l => l !== listener);
    };
  };

  return {
    subscribe,
    setPlan,
    setActive,
    incrementMessagesUsed,
    setLastMessageAt,
    setSubscriptionId,
    setSubscriptionExpiry,
    setPaymentProvider,
    reset,
    getState: () => _state,
  };
}

export const subscriptionStore = createSubscriptionStore();
