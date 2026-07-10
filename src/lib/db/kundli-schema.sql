-- Kundli Milan paid report — order + delivery ledger.
-- Run once in the Supabase SQL editor. Enables the webhook safety net so a
-- paid customer always receives the report, exactly once (idempotent).

create table if not exists kundli_orders (
  id           uuid primary key default gen_random_uuid(),
  order_id     text unique not null,        -- Razorpay order id
  email        text not null,
  person1      jsonb not null,              -- { name, rashi, nakshatra }
  person2      jsonb not null,
  amount       integer not null default 9900,  -- paise (₹99)
  status       text not null default 'created', -- created | paid
  payment_id   text,                        -- Razorpay payment id (once paid)
  delivered    boolean not null default false,
  delivered_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_kundli_orders_delivered on kundli_orders(delivered);

-- Only the service role (server, via SUPABASE_SERVICE_ROLE_KEY) may read/write.
alter table kundli_orders enable row level security;
