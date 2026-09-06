import { renderHook } from '@testing-library/react';
import { useDailyLimit } from '@/hooks/useDailyLimit';

const mockFetch = jest.fn();
Object.defineProperty(global, 'fetch', { value: mockFetch });

jest.mock('@/hooks/useSubscription', () => ({
  useSubscription: () => ({
    isPremium: false,
    plan: 'free',
    refetch: jest.fn(),
  }),
}));

jest.mock('@/lib/auth/useUser', () => ({
  useUser: () => ({
    user: { id: 'test-user-id' },
    isLoading: false,
  }),
}));

describe('useDailyLimit', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should return initial values for free user', () => {
    const { result } = renderHook(() => useDailyLimit());
    expect(result.current.isUnlimited).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });
});