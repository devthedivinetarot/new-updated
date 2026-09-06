# The Divine Tarot — SEO & GEO Launch Checklist

**Canonical domain:** `https://thedivinetarotonline.com` (apex)
**Scope:** Technical + on-page SEO and GEO (Generative Engine / AI-answer-engine optimization).

> **Honest expectation:** No one can *guarantee* a #1 ranking on every search engine — rankings depend on competition, domain authority, backlinks, content depth, and time. What this work does is make the site technically flawless and maximally eligible to rank and to be cited by AI engines. The off-page section below is what actually moves you up the results over the following weeks.

---

## 1. What was implemented in the codebase (done)

**Core metadata (`app/layout.tsx`)**
- `metadataBase` set to the canonical domain so every relative URL resolves correctly.
- Title template (`%s | The Divine Tarot`) + keyword-rich default title/description.
- Canonical URL on every page (`alternates.canonical`).
- Open Graph (type, site name, locale `en_US` + alternates `hi_IN`/`en_IN`, 1200×630 image).
- Twitter `summary_large_image` card.
- `robots` directives with Googlebot `max-image-preview:large`, full snippet length.
- Author/publisher/creator/category, keywords array, theme color, format detection.

**Per-page metadata** — unique title, description, canonical and OG for:
- `/` (home), `/reading`, `/premium`, `/about`, `/contact`.
- `/admin` set to **noindex, nofollow** so tooling never leaks into search.

**Crawl & indexing**
- `app/sitemap.ts` → auto-generates `/sitemap.xml` (all public routes, priorities, change frequency).
- `app/robots.ts` → `/robots.txt` allowing search engines, **explicitly welcoming AI crawlers** (GPTBot, OAI-SearchBot, PerplexityBot, Google-Extended, ClaudeBot, Bingbot, CCBot, Amazonbot, etc.), disallowing `/admin` and `/api/`, and referencing the sitemap.
- `app/manifest.ts` → PWA web manifest (installable, theme color, icons).

**Structured data (`src/components/layout/FooterJsonLd.tsx`)** — connected `@graph`:
- `Organization` + `ProfessionalService` (name, logo, email, founder, languages, area served India + Worldwide, social `sameAs`).
- `Person` (founder Bharti Singh) linked to the org.
- `WebSite` and `Service` (Online Tarot Reading) entities.
- `FAQPage` structured data **plus a matching visible FAQ section** on `/about` (eligible for FAQ rich results and heavily favored by AI answer engines).

**GEO assets**
- `public/llms.txt` — a machine-readable brand/site summary for AI assistants (emerging GEO standard).
- `public/og-image.png` — branded 1200×630 social share image.

---

## 2. Configure before / right after launch (you do this)

- [ ] **Set `NEXT_PUBLIC_APP_URL=https://thedivinetarotonline.com`** in Vercel env (production). Everything reads from this.
- [ ] **Force one domain:** redirect `www.thedivinetarotonline.com` → apex (or vice-versa) and `http`→`https` at the host/DNS level. Pick ONE and stick to it (canonicals point to the apex).
- [ ] Replace the placeholder OG image with a professionally designed one if desired (keep 1200×630, filename `og-image.png`).
- [ ] Add proper PWA icons `192×192` and `512×512` (maskable) to `/public` and reference them in `app/manifest.ts`.
- [ ] Confirm a real favicon set (`favicon.ico` exists; add `apple-touch-icon.png` 180×180 for iOS).

## 3. Search engine registration (the real ranking work)

- [ ] **Google Search Console** — verify the domain, submit `https://thedivinetarotonline.com/sitemap.xml`, request indexing for each key page.
- [ ] **Bing Webmaster Tools** — verify + submit sitemap (this also feeds DuckDuckGo, Yahoo, and Bing Copilot / ChatGPT search).
- [ ] **Google Business Profile** — create one (even as a service-area business for India) → unlocks Google Maps + local pack visibility.
- [ ] **Yandex Webmaster** if targeting any CIS audience.
- [ ] Validate structured data: [Rich Results Test](https://search.google.com/test/rich-results) and [Schema Markup Validator](https://validator.schema.org/).

## 4. GEO — getting cited by AI answer engines

- [ ] Keep the **FAQ and About content factual and entity-clear** (who, what, where, languages) — AI engines extract these.
- [ ] Build presence on sources AI engines cite heavily: **YouTube** (you have 2 channels — link them from the site and vice-versa), **Reddit**, **Quora**, **Medium**, and any tarot directories.
- [ ] Get listed in **structured directories** (consistent Name/Email/URL everywhere = "NAP consistency").
- [ ] Publish a few **long-form, question-shaped articles** ("How does an online tarot reading work?", "Hindi tarot vs English tarot") — these are what get quoted in AI Overviews and Perplexity.

## 5. Content & authority (ongoing — this is what ranks you)

- [ ] Add a **blog** targeting real search queries (love tarot, career tarot, daily tarot, zodiac readings, Hindi keywords). Aim for depth + originality.
- [ ] Earn **backlinks**: guest posts, collaborations, press, influencer mentions, social profiles linking back.
- [ ] Collect **reviews/testimonials** with `Review`/`AggregateRating` schema once you have genuine ratings (don't fabricate — Google penalizes fake review markup).
- [ ] Internal linking between home → reading → premium → about.

## 6. Performance & Core Web Vitals (ranking factor)

- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev/) on each page; target green LCP/CLS/INP.
- [ ] Compress the large images in `/public` (several are 0.6–2 MB — convert to WebP/AVIF and resize). This is currently the biggest likely Core Web Vitals risk.
- [ ] Ensure all `<img>`/`next/image` have descriptive `alt` text (accessibility + image SEO).

---

### Quick validation after deploy
```
https://thedivinetarotonline.com/robots.txt
https://thedivinetarotonline.com/sitemap.xml
https://thedivinetarotonline.com/manifest.webmanifest
https://thedivinetarotonline.com/llms.txt
https://thedivinetarotonline.com/og-image.png
```
Then paste the homepage URL into the Rich Results Test to confirm Organization, WebSite, Service and FAQ schema are detected.
