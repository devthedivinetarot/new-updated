import { NextRequest, NextResponse } from 'next/server';
import { sendVideoEmailBatch, type VideoInfo } from '@/lib/newsletter/videoEmail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * YouTube -> Newsletter cron.
 *
 * Runs on a schedule (see vercel.json). On each run it:
 *   1) Fetches the channel's public RSS feed
 *   2) Compares the newest video against the last one we emailed (Supabase singleton)
 *   3) If it's new, emails every subscribed member via Resend, then records the video id
 *
 * First ever run just records the current latest video WITHOUT emailing, so existing
 * back-catalog videos don't blast the whole list — only genuinely new uploads go out.
 *
 * Protected by CRON_SECRET: Vercel Cron automatically sends
 *   Authorization: Bearer <CRON_SECRET>
 * when the env var is set. Manual calls must send the same header.
 */

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UC93V0T62ER8cvjio8rAIqCQ';

export async function GET(req: NextRequest) {
  // --- Auth ---
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
  }

  // --- Fetch + parse the RSS feed ---
  let latest: VideoInfo | null = null;
  try {
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
    const res = await fetch(feedUrl, {
      headers: { 'User-Agent': 'TheDivineTarot-Newsletter/1.0' },
      cache: 'no-store',
    });
    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: `Feed fetch failed: ${res.status}` },
        { status: 502 }
      );
    }
    const xml = await res.text();
    latest = parseLatestVideo(xml);
  } catch (err) {
    console.error('[youtube-newsletter] feed error', err);
    return NextResponse.json({ success: false, message: 'Feed error' }, { status: 502 });
  }

  if (!latest) {
    return NextResponse.json({ success: true, message: 'No videos found in feed.' });
  }

  // --- Load Supabase ---
  const { createServerClient, isSupabaseConfigured } = await import('@/lib/supabase/server');
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { success: false, message: 'Supabase not configured.' },
      { status: 500 }
    );
  }
  const supabase = await createServerClient();

  // --- Read stored state ---
  const { data: state } = await supabase
    .from('youtube_newsletter_state')
    .select('last_video_id')
    .eq('id', 1)
    .maybeSingle();

  const lastVideoId = state?.last_video_id ?? null;

  // First run: seed state, don't email the back catalogue.
  if (!lastVideoId) {
    await supabase
      .from('youtube_newsletter_state')
      .upsert({
        id: 1,
        last_video_id: latest.videoId,
        last_video_title: latest.title,
        last_sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    return NextResponse.json({
      success: true,
      initialized: true,
      message: 'Initialized with latest video; future uploads will be emailed.',
      videoId: latest.videoId,
    });
  }

  // Nothing new.
  if (lastVideoId === latest.videoId) {
    return NextResponse.json({ success: true, message: 'No new video.', videoId: latest.videoId });
  }

  // --- New video: gather subscribers ---
  const { data: subs, error: subErr } = await supabase
    .from('newsletter_subscribers')
    .select('email')
    .eq('status', 'subscribed');

  if (subErr) {
    console.error('[youtube-newsletter] subscriber query failed', subErr);
    return NextResponse.json({ success: false, message: 'Subscriber query failed.' }, { status: 500 });
  }

  const recipients = Array.from(
    new Set((subs ?? []).map((s: { email: string }) => s.email).filter(Boolean))
  );

  const { sent, failed } = await sendVideoEmailBatch(recipients, latest);

  // --- Record the video so we never send it again ---
  await supabase
    .from('youtube_newsletter_state')
    .upsert({
      id: 1,
      last_video_id: latest.videoId,
      last_video_title: latest.title,
      last_sent_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

  return NextResponse.json({
    success: true,
    message: 'New video emailed to subscribers.',
    video: { id: latest.videoId, title: latest.title, url: latest.url },
    recipients: recipients.length,
    sent,
    failed,
  });
}

/**
 * Parse the newest <entry> out of a YouTube channel Atom feed.
 * The feed lists entries newest-first. We read the top-level fields
 * (yt:videoId, title, link, published) and derive the thumbnail from the id.
 */
function parseLatestVideo(xml: string): VideoInfo | null {
  const entryStart = xml.indexOf('<entry>');
  if (entryStart === -1) return null;
  const entryEnd = xml.indexOf('</entry>', entryStart);
  const entry = entryEnd === -1 ? xml.slice(entryStart) : xml.slice(entryStart, entryEnd);

  const videoId = matchOne(entry, /<yt:videoId>([^<]+)<\/yt:videoId>/);
  if (!videoId) return null;

  const rawTitle = matchOne(entry, /<title>([\s\S]*?)<\/title>/) ?? 'New video';
  const linkHref = matchOne(entry, /<link[^>]*rel="alternate"[^>]*href="([^"]+)"/);

  return {
    videoId,
    title: decodeEntities(rawTitle).trim(),
    url: linkHref || `https://www.youtube.com/watch?v=${videoId}`,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  };
}

function matchOne(s: string, re: RegExp): string | null {
  const m = s.match(re);
  return m ? m[1] : null;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}
