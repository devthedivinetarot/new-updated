# Daily Teaser Broadcast (Email + WhatsApp)

Sends a rotating Hinglish teaser message every morning — Zomato/astro-app style —
to pull subscribers back to the site to pick their 3 cards.

Reuses the existing Supabase + Resend pipeline; adds WhatsApp via the Meta
WhatsApp Cloud API.

## How it works

1. A **Vercel Cron** hits `/api/newsletter/daily` once a day
   (`0 3 * * *` UTC = **8:30 AM IST**, see `vercel.json`).
2. The route picks the **message of the day** from the bank in
   `src/lib/newsletter/dailyMessages.ts` (deterministic rotation through all
   messages, day boundary = midnight IST).
3. It emails everyone in `newsletter_subscribers` with `status = 'subscribed'`
   via Resend (batch, 100 per request).
4. If WhatsApp is configured, it sends the approved template to everyone in
   `whatsapp_subscribers` with `status = 'subscribed'`.
5. It records the date in `daily_newsletter_state` — a retried or duplicate
   cron run **never double-sends the same day**.

Every email CTA links to `/reading` with UTM tags
(`utm_campaign=daily&utm_content=<message-id>`) so you can see in analytics
which messages drive the most visits.

## One-time setup

### 1. Database

Run `src/lib/db/daily-newsletter-schema.sql` in the Supabase SQL editor.
Creates `daily_newsletter_state` (dedupe singleton) and `whatsapp_subscribers`
(opt-in phone list).

### 2. Email (already mostly done)

Confirm these env vars exist in Vercel:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `CRON_SECRET` (any long random string; Vercel Cron sends it automatically)
- Supabase keys (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)

### 3. WhatsApp (Meta Cloud API)

Any of these paths works — they all end at the same Meta API:

- **Direct (cheapest):** Meta Business Manager → WhatsApp → Cloud API.
  Free tier covers 1,000 business-initiated conversations/month; marketing
  conversations in India are ~₹0.78 each beyond that.
- **Via a BSP** (AiSensy, Interakt, Wati, Gupshup): easier dashboard, adds a
  platform fee. You can still use their underlying token/phone-number-id here,
  or use their own broadcast UI and skip this integration.

Steps for the direct route:

1. Create a Meta Business account, add WhatsApp, register a phone number.
2. Create a **System User** and generate a **permanent access token** with
   `whatsapp_business_messaging` permission.
3. Create a message template:
   - Name: `daily_tarot_message`
   - Category: **Marketing**
   - Language: English (`en`)
   - Body: `{{1}}`  — the day's teaser text goes in this variable.
     If Meta rejects a bare `{{1}}` body, use:
     `🔮 The Divine Tarot: {{1}}`
   - Button: **Visit website** → `https://thedivinetarotonline.com/reading`
4. Wait for template approval (usually minutes to hours).
5. Set env vars in Vercel:
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_PHONE_NUMBER_ID` (the phone-number **ID**, not the number)
   - `WHATSAPP_TEMPLATE_NAME` (optional, default `daily_tarot_message`)
   - `WHATSAPP_TEMPLATE_LANG` (optional, default `en`)

If WhatsApp env vars are absent, the cron still sends email and simply skips
WhatsApp — safe to launch email-first.

### 4. Deploy

Vercel registers the cron from `vercel.json` automatically.

> **Vercel plan note:** the Hobby plan allows only one cron invocation per day
> per job — the daily schedule here is fine on Hobby. (The 15-minute YouTube
> cron is the one that needs Pro.)

## Testing

```bash
# Preview: which message goes out today + recipient counts (sends nothing)
curl -H "Authorization: Bearer $CRON_SECRET" \
  "https://thedivinetarotonline.com/api/newsletter/daily?dryRun=1"

# Real send (respects the once-per-day guard)
curl -H "Authorization: Bearer $CRON_SECRET" \
  "https://thedivinetarotonline.com/api/newsletter/daily"

# Force a resend today (testing only)
curl -H "Authorization: Bearer $CRON_SECRET" \
  "https://thedivinetarotonline.com/api/newsletter/daily?force=1"
```

Tip: to test email on yourself first, temporarily set everyone else's
`status` to something other than `subscribed`, or test in a staging Supabase.

## Compliance notes (important for deliverability)

- **WhatsApp:** only add numbers to `whatsapp_subscribers` that explicitly
  opted in. Meta tracks block/report rates; a low quality rating throttles or
  bans the sender number.
- **Email:** the footer includes an unsubscribe path (reply / mailto). When a
  user asks to unsubscribe, set their row's `status = 'unsubscribed'` in
  `newsletter_subscribers` — the daily send only targets `subscribed`.

## Editing the messages

All copy lives in `src/lib/newsletter/dailyMessages.ts` — 30 messages, plain
objects, safe for a non-developer to edit with guidance. Add or remove freely;
rotation adapts automatically. Keep the `whatsapp` field single-line.

## Files

- `src/lib/newsletter/dailyMessages.ts` — message bank + daily rotation logic
- `src/lib/newsletter/dailyEmail.ts` — email HTML + Resend batch sender
- `src/lib/newsletter/whatsapp.ts` — Meta Cloud API template sender
- `app/api/newsletter/daily/route.ts` — cron handler
- `src/lib/db/daily-newsletter-schema.sql` — state + WhatsApp opt-in tables
- `vercel.json` — cron schedule + function timeout
