import { supabase } from '@/lib/supabase/client';

export type IntentType = 'love' | 'career' | 'confusion' | 'general';
export type EngagementLevel = 'low' | 'medium' | 'high';
export type ConversionStage = 'new' | 'exploring' | 'high_intent' | 'paid';

export interface UserProfile {
  userId: string;
  readingsCount: number;
  lastActiveAt: Date | null;
  dominantIntent: IntentType;
  engagementLevel: EngagementLevel;
  conversionStage: ConversionStage;
  totalSpent: number;
  sessionsCount: number;
  avgSessionDuration: number;
  lastQuestion: string | null;
  memoryContext: string | null;
  isHighIntent: boolean;
  daysSinceLastActive: number;
  readingHistory: Array<{
    type: string;
    topic: string;
    timestamp: Date;
  }>;
}

export interface ProfileCache {
  profile: UserProfile | null;
  timestamp: number;
  expiresAt: number;
}

const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map<string, ProfileCache>();

function getCacheKey(userId: string): string {
  return `profile:${userId}`;
}

function isCacheValid(cacheEntry: ProfileCache | undefined): boolean {
  if (!cacheEntry) return false;
  return Date.now() < cacheEntry.expiresAt;
}

function invalidateCache(userId: string): void {
  cache.delete(getCacheKey(userId));
}

export function clearProfileCache(): void {
  cache.clear();
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!userId) return null;

  const cached = cache.get(getCacheKey(userId));
  if (isCacheValid(cached)) {
    return cached!.profile;
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  // Avoid `never` inference from Supabase types in this repo.
  const typedUserData = userData as any;

  if (userError || !userData) {
    const cacheEntry: ProfileCache = {
      profile: null,
      timestamp: Date.now(),
      expiresAt: Date.now() + CACHE_TTL,
    };
    cache.set(getCacheKey(userId), cacheEntry);
    return null;
  }

  const [readingsData, eventsData, paymentsData] = await Promise.all([
    supabase
      .from('readings')
      .select('type, topic, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('events')
      .select('event_type, properties, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50),
    supabase
      .from('payments')
      .select('amount, created_at')
      .eq('user_id', userId)
      .eq('status', 'completed'),
  ]);

  const readings = readingsData.data || [];
  const events = eventsData.data || [];
  const payments = paymentsData.data || [];

  const readingsCount = readings.length;
  // Supabase client typing can degrade to `never[]` in this repo; normalize to runtime shape.
  const typedEvents = events as Array<{ event_type?: string }>;
  const sessionsCount = typedEvents.filter(e => e.event_type === 'session_start').length;
  const typedPayments = payments as Array<{ amount?: number }>;
  const totalSpent = typedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);



  const lastActiveAt = typedUserData.last_active_at 
    ? new Date(typedUserData.last_active_at) 
    : typedUserData.created_at 
      ? new Date(typedUserData.created_at) 
      : null;

  const daysSinceLastActive = lastActiveAt 
    ? Math.floor((Date.now() - lastActiveAt.getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  const lastEvent = events[0];
  const lastQuestion = lastEvent?.properties?.question || null;
  const memoryEvents = events.filter(e => e.event_type === 'memory_update');
  const lastMemory = memoryEvents[0]?.properties?.context || null;

  const dominantIntent = calculateDominantIntent(readings, lastQuestion);
  const engagementLevel = calculateEngagementLevel(readingsCount, daysSinceLastActive, sessionsCount);
  const conversionStage = calculateConversionStage(readingsCount, sessionsCount, totalSpent, daysSinceLastActive);
  const isHighIntent = detectHighIntent(events, readings, daysSinceLastActive);

  const readingHistory = readings.map(r => ({
    type: r.type,
    topic: r.topic,
    timestamp: new Date(r.created_at),
  }));

  const profile: UserProfile = {
    userId,
    readingsCount,
    lastActiveAt,
    dominantIntent,
    engagementLevel,
    conversionStage,
    totalSpent,
    sessionsCount,
    avgSessionDuration: 0,
    lastQuestion,
    memoryContext: lastMemory,
    isHighIntent,
    daysSinceLastActive,
    readingHistory,
  };

  const cacheEntry: ProfileCache = {
    profile,
    timestamp: Date.now(),
    expiresAt: Date.now() + CACHE_TTL,
  };
  cache.set(getCacheKey(userId), cacheEntry);

  return profile;
}

function calculateDominantIntent(
  readings: Array<{ topic?: string }>,
  lastQuestion: string | null
): IntentType {
  const topicCounts: Record<string, number> = {};
  
  readings.forEach(r => {
    if (r.topic) {
      const topic = r.topic.toLowerCase();
      if (topic.includes('love') || topic.includes('relationship')) {
        topicCounts['love'] = (topicCounts['love'] || 0) + 1;
      } else if (topic.includes('career') || topic.includes('work') || topic.includes('job')) {
        topicCounts['career'] = (topicCounts['career'] || 0) + 1;
      } else if (topic.includes('confused') || topic.includes('lost') || topic.includes('uncertain')) {
        topicCounts['confusion'] = (topicCounts['confusion'] || 0) + 1;
      }
    }
  });

  if (lastQuestion) {
    const q = lastQuestion.toLowerCase();
    if (q.includes('love') || q.includes('relationship') || q.includes('partner')) {
      return 'love';
    }
    if (q.includes('career') || q.includes('work') || q.includes('job') || q.includes('business')) {
      return 'career';
    }
    if (q.includes('confused') || q.includes('what should') || q.includes('don\'t know')) {
      return 'confusion';
    }
  }

  const topTopic = Object.entries(topicCounts).sort((a, b) => b[1] - a[1])[0];
  if (topTopic && topTopic[1] >= 2) {
    return topTopic[0] as IntentType;
  }

  return 'general';
}

function calculateEngagementLevel(
  readingsCount: number,
  daysSinceLastActive: number,
  sessionsCount: number
): EngagementLevel {
  const engagementScore = 
    readingsCount * 2 +
    sessionsCount * 1.5 -
    daysSinceLastActive * 0.3;

  if (engagementScore >= 15) return 'high';
  if (engagementScore >= 5) return 'medium';
  return 'low';
}

function calculateConversionStage(
  readingsCount: number,
  sessionsCount: number,
  totalSpent: number,
  daysSinceLastActive: number
): ConversionStage {
  if (totalSpent > 0) return 'paid';
  if (sessionsCount >= 3 || readingsCount >= 5) return 'high_intent';
  if (sessionsCount >= 1 || readingsCount >= 1) return 'exploring';
  return 'new';
}

function detectHighIntent(
  events: Array<{ event_type: string; properties?: Record<string, unknown> }>,
  readings: Array<{ topic?: string }>,
  daysSinceLastActive: number
): boolean {
  const bookingEvents = events.filter(e => 
    e.event_type === 'booking_intent' || 
    e.event_type === 'checkout_start'
  );
  
  if (bookingEvents.length > 0) return true;

  const premiumTopics = readings.filter(r => 
    r.topic?.toLowerCase().includes('deep') ||
    r.topic?.toLowerCase().includes('future')
  );
  
  if (premiumTopics.length >= 2) return true;

  if (daysSinceLastActive < 3 && readings.length >= 3) return true;

  return false;
}

export async function getUserProfileCached(userId: string): Promise<UserProfile | null> {
  const cached = cache.get(getCacheKey(userId));
  
  if (cached?.profile) {
    return cached.profile;
  }

  return getUserProfile(userId);
}

export function getProfileSync(userId: string): UserProfile | null {
  const cached = cache.get(getCacheKey(userId));
  return cached?.profile || null;
}

export async function updateUserActivity(userId: string): Promise<void> {
  await supabase
    .from('users')
    .update({ last_active_at: new Date().toISOString() })
    .eq('id', userId);

  invalidateCache(userId);
}