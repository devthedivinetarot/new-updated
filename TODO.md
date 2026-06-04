# TODO - Critical Bugs Fix

## Phase 1: Subscription security & correctness
- [ ] Update app/api/subscription/verify/route.ts
  - [ ] Fail fast if RAZORPAY_KEY_SECRET (and key id) missing
  - [ ] Fetch Razorpay payment details / status / amount via server SDK or REST
  - [ ] Only mark premium active after verification (and amount matches expected)
- [ ] Update app/actions/subscription.ts
  - [ ] Remove/ignore client-provided `plan === 'premium'` bypass
  - [ ] Enforce auth (ignore arbitrary userId for both access checks and recordMessage)

## Phase 4: Daily limit source consistency
- [ ] Update src/lib/subscription/checkAccess.ts to align with app/actions/subscription.ts usage counters (users.readings_today / last_reading_date)

## Phase 5: Paywall & iframe messaging hardening
- [ ] Update app/reading/page.tsx
  - [ ] Remove “Continue with free experience” bypass that clears iframeBlocked
  - [ ] Add event.origin checks and replace postMessage target '*' with fixed origin(s)

## Phase 6: CSP nonce plumbing + remove unsafe-inline in production
- [ ] Fix CSP nonce plumbing between middleware.ts and app/layout.tsx
  - [ ] Align on cookie-based nonce
  - [ ] Remove 'unsafe-inline' from production script policy

## Phase 7: Rate limiting behavior when Upstash missing
- [ ] Adjust middleware.ts so rate limiting doesn’t silently disable

## Phase 2/3/8/9/10
- [ ] Remaining items (hard-coded subscription id lifecycle, broken routes, Jest/ts-node, tests expectations, Hindi replacement chars, Sentry, audit)

