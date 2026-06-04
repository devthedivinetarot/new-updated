import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

async function getAuthenticatedUserId(request: NextRequest): Promise<string | null> {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    return user.id;
  } catch (e) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const authenticatedUserId = await getAuthenticatedUserId(request);

    if (!authenticatedUserId) {
      // Unauthenticated users are treated as free.
      // Returning 401 here can break Server Components renders during hydration.
      return NextResponse.json({
        plan: 'free',
        subscription_status: null,
        subscription_end_date: null,
      });
    }


    const supabase = await createServerClient();
    const { data: user, error } = await supabase
      .from('users')
      .select('plan, subscription_status, subscription_end_date')
      .eq('id', authenticatedUserId)
      .single();

    if (error || !user) {
      return NextResponse.json({
        plan: 'free',
        subscription_status: null,
        subscription_end_date: null,
      });
    }

    return NextResponse.json({
      plan: user.plan || 'free',
      subscription_status: user.subscription_status,
      subscription_end_date: user.subscription_end_date,
    });
  } catch (error: unknown) {
    console.error('[Subscription Status] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription status' },
      { status: 500 }
    );
  }
}