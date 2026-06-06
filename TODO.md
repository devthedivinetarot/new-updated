# TODO

## Supabase env + build crash fix
- [x] Update Vercel project Environment Variables:
  - [ ] NEXT_PUBLIC_SUPABASE_URL (set to production Supabase URL)
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY (set to production Supabase anon key)
  - [ ] SUPABASE_SERVICE_ROLE_KEY (required for production server-side)
- [ ] Trigger fresh Vercel production redeploy with cache cleared.


## Reading page layout fix
- [x] Refactor `app/reading/page.tsx` to ensure a single unified return.
- [x] Render “Connection Interrupted” alert inline via `{initError && (...)}`.
- [x] Ensure Lovable iframe container always mounts outside any conditional.
- [ ] Validate build/lint (optional): `npm run build` (may require env vars; local build may fail due to missing env).


 