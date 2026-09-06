import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { checkPremiumStatus, checkDailyLimit } from '@/lib/subscription/checkAccess';
import * as Sentry from '@sentry/nextjs';

async function getAuthenticatedUserId(request: NextRequest): Promise<string | null> {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    return user.id;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const authenticatedUserId = await getAuthenticatedUserId(request);

    if (!authenticatedUserId) {
      return NextResponse.json({
        messagesUsedToday: 0,
        limitReached: false,
        canSendMessage: true,
        remaining: -1,
      });
    }

    const { isPremium } = await checkPremiumStatus(authenticatedUserId);

    if (isPremium) {
      return NextResponse.json({
        messagesUsedToday: 0,
        limitReached: false,
        canSendMessage: true,
        remaining: -1,
      });
    }

    const { allowed, count } = await checkDailyLimit(authenticatedUserId);

    return NextResponse.json({
      messagesUsedToday: count,
      limitReached: !allowed,
      canSendMessage: allowed,
      remaining: Math.max(0, 1 - count),
    });
  } catch (error) {
    console.error('[Daily Limit] Error:', error);
    Sentry.captureException(error);
    return NextResponse.json(
      { error: 'Failed to fetch limit status' },
      { status: 500 }
    );
  }
}