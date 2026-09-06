// ====== RETENTION LOOP SYSTEM ======
// Daily return triggers + premium habit formation

export interface RetentionContext {
  userId?: string;
  plan: 'free' | 'premium';
  lastReadingDate?: Date;
  streak: number;
  totalReadings: number;
  timeOfDay: number; // 0-23
  daysSinceLastVisit: number;
}

/**
 * Free user daily reset message
 * Encourages return within 24h cycle
 */
export const getFreeUserResetMessage = (
  hoursUntilReset: number,
  userName?: string
): string => {
  const name = userName || 'Seeker';
  
  if (hoursUntilReset < 1) {
    return `${name}, your next free reading unlocks shortly! ⏳`;
  }
  
  if (hoursUntilReset < 4) {
    return `${name}, clarity awaits — ${hoursUntilReset} hours until your next reading.`;
  }

  if (hoursUntilReset < 12) {
    return `Your free reading resets in ${hoursUntilReset} hours. The cards are waiting...`;
  }

  return `Return in ${hoursUntilReset} hours for your next free insight.`;
};

/**
 * Premium habit encouragement
 * Multiple sessions per day increase perceived value
 */
export const getPremiumHabitMessage = (
  sessionCount: number,
  timeOfDay: number,
  userName?: string
): string => {
  const name = userName || '';
  const prefix = name ? `${name}, ` : '';

  if (sessionCount === 0) {
    const times = ['morning', 'afternoon', 'evening', 'night'];
    const timeIndex = Math.floor(timeOfDay / 6);
    return `${prefix}Good ${times[timeIndex]}. What would you like to explore today?`;
  }

  if (sessionCount === 1) {
    return `${prefix}One insight today. What else would you like to discover?`;
  }

  if (sessionCount === 2) {
    return `${prefix}Two readings already. A third could reveal the pattern...`;
  }

  if (sessionCount >= 3) {
    return `${prefix}Deep diving today! The more you seek, the more you find.»`;
  }

  return `${prefix}Ready for another reading?»`;
};

/**
 * Daily return reminder (push notification style copy)
 */
export const getDailyReturnReminder = (
  streak: number,
  daysUntilMilestone: number,
  userName?: string
): string => {
  const name = userName || '';

  if (streak >= 7) {
    return `${name}🌟 ${streak}-day streak! Your insights are getting clearer.»`;
  }

  if (daysUntilMilestone === 1) {
    return `${name}Tomorrow you reach a new milestone. Don't break the chain.»`;
  }

  if (daysUntilMilestone <= 3) {
    return `${name}${daysUntilMilestone} days until ${streak + daysUntilMilestone}-day streak!»`;
  }

  return `${name}Your ${streak}-day streak continues. Return today!»`;
};

/**
 * Re-engagement for lapsed users
 */
export const getReengagementMessage = (
  daysSinceLastVisit: number,
  previousReadings: number,
  userName?: string
): string => {
  const name = userName || 'Seeker';

  if (daysSinceLastVisit === 1) {
    return `${name}, yesterday's insight still resonates. Continue the journey?»`;
  }

  if (daysSinceLastVisit <= 3) {
    return `${name}, the cards have been waiting ${daysSinceLastVisit} days for you.»`;
  }

  if (daysSinceLastVisit <= 7) {
    return `${name}, it's been a week. New insights await your return.»`;
  }

  if (previousReadings >= 5) {
    return `${name}, the pattern was building... Your journey isn't finished.»`;
  }

  return `${name}, clarity is closer than you think. Return today.»`;
};

/**
 * Milestone celebrations (conversions work here)
 */
export const getMilestoneMessage = (
  milestone: number,
  userName?: string
): string => {
  const name = userName || '';

  const milestones: Record<number, string> = {
    1: `${name} First reading. The journey begins...»`,
    3: `${name} Third insight. Patterns are emerging...»`,
    5: `${name} Five readings deep. What's the common thread?»`,
    7: `${name} Seven — a mystical number. What does it mean for you?»`,
    10: `${name} Ten readings! Time to unlock unlimited and see it all?»`,
    15: `${name} Fifteen insights. You're committed to clarity.»`,
    20: `${name} Twenty readings! The full picture awaits with Premium.»`,
    30: `${name} Thirty! It's time to go unlimited. Your journey deserves it.»`
  };

  return milestones[milestone] || `${name} Milestone reached! Continue your journey...»`;
};

/**
 * Calculate hours until next free reading reset
 */
export const getHoursUntilReset = (lastReadingDate?: Date): number => {
  if (!lastReadingDate) return 0;
  
  const now = new Date();
  const lastDate = new Date(lastReadingDate);
  const tomorrow = new Date(lastDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const diffMs = tomorrow.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60));
};

/**
 * Build complete retention message based on context
 */
export const buildRetentionMessage = (ctx: RetentionContext): string => {
  const hoursUntilReset = getHoursUntilReset(ctx.lastReadingDate);
  
  if (ctx.plan === 'free') {
    if (ctx.daysSinceLastVisit > 0) {
      return getReengagementMessage(ctx.daysSinceLastVisit, ctx.totalReadings);
    }
    
    if (ctx.totalReadings >= 10) {
      return getMilestoneMessage(10);
    }
    
    return getFreeUserResetMessage(hoursUntilReset);
  }

  // Premium users
  if (ctx.daysSinceLastVisit > 0) {
    const msg = getReengagementMessage(ctx.daysSinceLastVisit, ctx.totalReadings);
    return `Welcome back! ${msg}`;
  }

  return getPremiumHabitMessage(0, new Date().getHours());
};
