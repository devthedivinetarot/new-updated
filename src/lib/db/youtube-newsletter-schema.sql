-- YouTube -> Newsletter automation state
-- Singleton row that remembers the most recent video we've already emailed about,
-- so the cron never sends the same upload twice.
--
-- Run this once in the Supabase SQL editor.

create table if not exists youtube_newsletter_state (
  id             integer primary key default 1,
  last_video_id  text,
  last_video_title text,
  last_sent_at   timestamptz,
  updated_at     timestamptz not null default now(),
  constraint youtube_newsletter_state_singleton check (id = 1)
);

-- Ensure the singleton row exists.
insert into youtube_newsletter_state (id)
values (1)
on conflict (id) do nothing;
