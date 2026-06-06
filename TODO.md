# TODO - /reading page refactor

- [ ] Confirm current `/reading/page.tsx` implementation details
- [ ] Implement explicit layout constraints:
  - [ ] No footer on this route (avoid `ClientLayout` footer)
  - [ ] Page container max height exactly `h-[90vh]` and centered
- [ ] Implement premium styling:
  - [ ] Deep minimalist background `bg-[#0a0a0a]`
  - [ ] Back to Home button styling per spec (border/text yellow, gold glow, rounded-full)
- [ ] Implement iframe constraints:
  - [ ] Wrap iframe in `w-[90%] h-[90%]` relative to parent section
  - [ ] Add rounded-2xl, overflow-hidden, gold/yellow shadow aura
- [ ] Verify Tailwind classes compile
- [ ] (Optional) Run lint/tests/build if available

