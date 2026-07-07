-- Daily teaser broadcast (email + WhatsApp) — schema
-- Run this once in the Supabase SQL editor.

-- 1) Singleton state row: remembers the last day we broadcast, so a retried
--    or duplicate cron run never double-sends the same day.
create table if not exists daily_newsletter_state (
  id                 integer primary key default 1,
  last_sent_date     text,          -- YYYY-MM-DD in IST
  last_message_id    text,          -- id from src/lib/newsletter/dailyMessages.ts
  last_email_sent    integer,
  last_whatsapp_sent integer,
  updated_at         timestamptz not null default now(),
  constraint daily_newsletter_state_singleton check (id = 1)
);

insert into daily_newsletter_state (id)
values (1)
on conflict (id) do nothing;

-- 2) WhatsApp opt-in list. Numbers must be E.164 digits (e.g. 919876543210).
--    IMPORTANT: only add numbers that have explicitly opted in to WhatsApp
--    marketing messages — Meta enforces opt-in and quality ratings.
create table if not exists whatsapp_subscribers (
  id         uuid primary key default gen_random_uuid(),
  phone      text not null unique,
  name       text,
  status     text not null default 'subscribed',  -- subscribed | unsubscribed
  source     text default 'website',
  locale     text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_whatsapp_subscribers_status
  on whatsapp_subscribers(status);

-- Row Level Security: only the service role (server) may read/write.
alter table daily_newsletter_state enable row level security;
alter table whatsapp_subscribers enable row level security;
