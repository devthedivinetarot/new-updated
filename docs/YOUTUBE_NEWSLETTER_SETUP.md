# YouTube → Newsletter Automation

Automatically emails every subscriber when a new video is uploaded to the channel.
Reuses the existing Supabase (subscribers) + Resend (delivery) pipeline — no extra services.

## How it works

1. A **Vercel Cron** hits `/api/youtube/cron` every 15 minutes.
2. The route reads the channel's public RSS feed
   (`https://www.youtube.com/feeds/videos.xml?channel_id=UC93V0T62ER8cvjio8rAIqCQ`).
3. It compares the newest video to the last one it emailed (stored in Supabase).
4. If there's a new upload, it emails all `status = 'subscribed'` members via Resend, then
   records the video ID so it never double-sends.

The **first run** just records the current latest video — it does **not** email the back
catalogue. Only videos uploaded after activation go out.

## One-time setup

1. **Create the state table** — run `src/lib/db/youtube-newsletter-schema.sql` in the
   Supabase SQL editor.

2. **Set environment variables** (Vercel → Project → Settings → Environment Variables):
   - `YOUTUBE_CHANNEL_ID` = `UC93V0T62ER8cvjio8rAIqCQ` (already the default)
   - `CRON_SECRET` = any long random string (e.g. `openssl rand -hex 32`)
   - Confirm existing `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and the Supabase keys are set.

3. **Deploy.** Vercel registers the cron from `vercel.json` automatically.

## Important: Vercel plan note

The schedule in `vercel.json` is `*/15 * * * *` (every 15 min), which needs the **Pro** plan.
On the **Hobby** plan, cron jobs run **at most once per day** — change the schedule to a daily
one such as `0 4 * * *` (04:00 UTC) or upgrade to Pro for near-instant sends.

## Test it manually

```bash
curl -H "Authorization: Bearer <YOUR_CRON_SECRET>" \
  https://thedivinetarotonline.com/api/youtube/cron
```

- First call → `{ "initialized": true, ... }` (seeds state, no email).
- Upload a new video, call again → emails go out, response shows `sent`/`recipients`.
- Call again with no new upload → `{ "message": "No new video." }`.

## Files

- `app/api/youtube/cron/route.ts` — cron handler (fetch feed, diff, send, record).
- `src/lib/newsletter/videoEmail.ts` — email template + Resend batch sender.
- `src/lib/db/youtube-newsletter-schema.sql` — Supabase state table.
- `vercel.json` — cron schedule + function timeout.
