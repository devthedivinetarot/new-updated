# Site Audit — thedivinetarotonline.com (2026-07-07)

> **FIX STATUS (same day):** items 1, 2, 3, 4, 7, 9, 10, 11 fixed in this repo
> (see git diff). Items 5, 6 and the "TestUser" greeting live in the separate
> chat app (chat.thedivinetarotonline.com) embedded via iframe on /reading —
> fix them there. Item 8 (SSR "Loading..." shell) is an architecture change,
> not fixed. Item 12 was likely caused by item 3's stuck animation.
> Bonus root-cause fixed: `src/lib/i18n/translations.ts` was a stub that never
> wired in the full `src/i18n/{en,hi,hinglish}.ts` files — this made many keys
> across the site render as humanized key names ("Rating", "Under60seconds").
> Run `npm run typecheck` + `npm run build` locally before deploying.

Tested live on desktop Chrome (1568px) + code cross-check against this repo.
No JavaScript console errors were thrown on any page tested; all bugs below
are content/asset/UX-level.

## 🔴 High — broken user experience

### 1. 15 of 78 tarot card images are broken (19% of the deck)
`src/data/tarot-data.json` references images that don't exist in
`public/card_img/`:

- All 14 **Pentacles** cards: data says `.../Ace of Pentacles.png` (plural),
  files on disk are `Ace of Pentacle.png` (singular).
- **The Hierophant**: `The Hierophant.png` doesn't exist at all.

Any reading that draws one of these 15 cards shows a broken/blank card image.
**Fix:** rename the 14 files to plural (or edit the JSON), and add the missing
Hierophant image. One-line check after fixing:
`python3 -c "..."` (script available on request) or re-run this audit.

### 2. Contact page shows raw placeholder labels
Live page renders: **"Heading"**, **"Subtitle"**, **"NameHelper"**,
**"EmailHelper"**, **"MessageHelper"** instead of real copy.
Cause: `app/contact/page.tsx` calls `t('contact.heading')` etc., but no
`contact.*` keys exist in any translation source, so `useTranslation`'s
fallback "humanizes" the key name. Looks obviously broken to visitors on a
page meant to build trust.
**Fix:** add the `contact.*` strings (en/hi/hinglish) to the translations
store, or hardcode the copy.

### 3. About page can freeze the browser tab
During testing, the /about page became unresponsive (renderer frozen, twice)
after scrolling. Content also renders at very low opacity — a scroll-triggered
(framer-motion `whileInView`?) animation appears stuck and may be looping.
**Fix:** audit the About page animations; check `viewport={{ once: true }}`
on motion components and remove any animation tied to scroll position that
can re-trigger indefinitely.

## 🟡 Medium — trust/conversion issues

### 4. Free-tier limit is inconsistent across pages
- Reading page: "**3 free readings** remaining today"
- Premium page (`src/lib/payments/plans.ts`): "**1 message per day** to Ginni"
Pick one number; the mismatch undermines the paywall pitch.

### 5. Reading text has concatenation/typo bugs
Example from a live reading:
"Universe kehna **chata** hai **kiThakaan** hai par end paas hai.**Himmat mat
haaro.yeh** bus last push hai." — missing spaces after "ki" and after
periods; "chata" → "chahta"; "Ten of Wands**;**" uses a semicolon instead of
a colon. These strings come from the reading template content — needs a
proofread pass and a space after every sentence join.

### 6. Card-picker copy: "Choose 1 card that call to you"
Grammar — "that **calls** to you". Also, homepage promises "Select three
cards" but this flow asks for 1 card — align the copy or the flow.

### 7. Homepage typos (Why-us section)
- "Why The **Devine** Tarot?" → **Divine**
- "we **understands** context" → "we understand"
- Stats row renders "Rating" with no value and "Under60seconds" without
  spacing — check the stats component.

### 8. Slow first paint / SSR shell is just "Loading..."
All pages server-render only a "Loading..." shell; real content appears after
several seconds of client hydration (visible logo-only splash, then content
pops in). Hurts SEO (crawlers that don't execute JS see "Loading...") and
bounce rate. Longer-term: move hero/static sections to server components.

## 🟢 Low / cosmetic

### 9. Footer logo is a blank box
Next to "The Divine Tarot" in the footer, the logo image doesn't render
(empty rounded square).

### 10. Footer YouTube icons are generic placeholders
The two YouTube links render as identical blank rectangles (missing icons)
while Instagram/Facebook show proper icons.

### 11. Testimonials look templated
Five testimonials repeat 3x in the carousel, all "Verified Reader"; one says
"I didn't expect this level of insight **from an AI**" — inconsistent with
the site's "Bharti Singh, India's No.1 Psychic Tarot Reader" positioning.
Worth a content review.

### 12. Homepage keyboard scrolling unreliable
`End` key / mouse-wheel over parts of the hero didn't scroll the page in
testing (programmatic scroll-to worked). Possibly an overflow/scroll-lock on
a full-height section. Verify with plain keyboard/mouse on desktop.

## Not tested (needs your go-ahead or manual test)

- Newsletter subscribe form submission (didn't want to pollute the live list)
- Premium checkout / Razorpay order creation (didn't want to create live orders)
- /api/newsletter/daily (deploy from this repo first, then hit `?dryRun=1`)

## Verified OK

- robots.txt, sitemap.xml, canonical + OG/Twitter meta on all pages
- No console errors on home, reading, premium, contact
- Reading flow works end-to-end (question → card pick → reading → limit
  decrements correctly)
- Free-reading counter enforcement present
