import { checkDailyLimit, checkPremiumStatus } from '@/lib/subscription/checkAccess';

describe('checkAccess', () => {
  describe('checkPremiumStatus', () => {
    it('should return free status for null userId', async () => {
      const result = await checkPremiumStatus('');
      expect(result.isPremium).toBe(false);
      expect(result.plan).toBe('free');
    });

    it('should return free status for missing user', async () => {
      const result = await checkPremiumStatus('nonexistent-user');
      expect(result.isPremium).toBe(false);
      expect(result.plan).toBe('free');
    });
  });

  describe('checkDailyLimit', () => {
    it('should allow null userId', async () => {
      const result = await checkDailyLimit('');
      expect(result.allowed).toBe(true);
      expect(result.count).toBe(0);
    });
  });
});