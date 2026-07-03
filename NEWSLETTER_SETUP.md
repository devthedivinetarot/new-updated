# Newsletter Pipeline — Setup Guide

The signup form in the site footer now posts to **`/api/subscribe`**, which:

1. **Stores** each email in **Supabase** (`newsletter_subscribers`, deduped)
2. **Records** each email in your **Google Sheet** (via an Apps Script webhook)
3. **Sends** a branded **welcome email** via **Resend** (new subscribers only)

Every step is independent — a signup succeeds if the email is saved to *at least one* place, and a failed welcome email never blocks a signup.

---

## 1. Supabase table

Run the newly-added block at the bottom of `src/lib/supabase/schema.sql` in your
**Supabase → SQL Editor** (it creates `public.newsletter_subscribers` with a
unique email index and RLS enabled). Confirm these env vars are set in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...      # server-only, never exposed to the client
```

## 2. Google Sheet (records every entered email)

1. Create a new Google Sheet (e.g. "Divine Tarot — Subscribers").
2. **Extensions → Apps Script**, delete the sample code, and paste the contents
   of **`docs/newsletter/google-apps-script.gs`**.
3. In that script set `SHARED_TOKEN` to a long random string.
4. **Deploy → New deployment → Web app**:
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**
   - Click **Deploy**, authorize, and **copy the Web app URL**.
5. Add to your app env (Vercel):

```
GOOGLE_SHEET_WEBHOOK_URL=<the Web app URL you copied>
GOOGLE_SHEET_WEBHOOK_TOKEN=<the same SHARED_TOKEN value>
```

The sheet auto-creates a header row: **Email | Source | Locale | Timestamp (UTC)**,
and de-duplicates by email.

> Re-deploy the Apps Script (Deploy → Manage deployments → edit → Deploy) any
> time you change it, or the URL keeps serving the old version.

## 3. Welcome email (Resend)

Set in Vercel:

```
RESEND_API_KEY=...
RESEND_FROM_EMAIL=The Divine Tarot <hello@thedivinetarotonline.com>
```

The `from` domain must be **verified in Resend** (Domains → Add domain → add the
DNS records). Until it is verified, Resend only delivers to your own address.
The welcome template lives in `src/lib/newsletter/welcomeEmail.ts`.

---

## 4. Test it

After deploying with the env vars set:

- Visit the site, enter an email in the footer, click **Subscribe**.
- **Sheet:** a new row appears.
- **Supabase:** a new row in `newsletter_subscribers`.
- **Inbox:** the welcome email arrives.

Quick API check:

```bash
curl -X POST https://thedivinetarotonline.com/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com"}'
# -> {"success":true,"alreadySubscribed":false,"message":"Subscribed! Check your inbox ✨"}
```

Re-submitting the same email returns `alreadySubscribed: true` and does **not**
resend the welcome email.

---

## Files added

| File | Purpose |
|------|---------|
| `app/api/subscribe/route.ts` | The pipeline endpoint |
| `src/lib/newsletter/welcomeEmail.ts` | Resend welcome email + HTML template |
| `src/lib/newsletter/googleSheet.ts` | Google Sheet webhook client |
| `docs/newsletter/google-apps-script.gs` | Script to paste into your Sheet |
| `src/lib/supabase/schema.sql` | `newsletter_subscribers` table (appended) |
| `.env.example` | New `GOOGLE_SHEET_WEBHOOK_*` keys |

## Not built (say the word and I'll add it)

- **Broadcast sender** — a protected `/api/newsletter/send` endpoint to email
  *all* subscribers at once (campaigns), with batching + unsubscribe links.
- **Double opt-in** — a confirmation-click step before adding to the list.
