# The Divine Tarot — App Store Launch Roadmap

**Approach:** Capacitor hybrid (reuse the existing Next.js web app inside a native shell)
**Targets:** Google Play Store + Apple App Store
**Key constraint:** Paid digital features (readings/subscriptions) → must use Apple/Google in-app billing, **not** Razorpay, inside the apps.

---

## 0. The big picture

Your site is a **server-rendered Next.js app** (SSR + API routes for payments, i18n, etc.). It can't be fully static-exported, so the Capacitor app will run as a **native WebView shell that loads your live Vercel URL**, with native plugins added on top for:

- **In-app purchases** (required for your paid readings/subscriptions)
- **Push notifications** (helps justify being a "real app" to Apple reviewers)
- **Native niceties** (splash screen, status bar, offline fallback, deep links)

This means: your web app keeps working exactly as-is; the mobile app is a thin native container around it plus native payment/push. Content updates ship instantly via Vercel (no store review needed); only native-shell changes require a new store submission.

---

## 1. Accounts & prerequisites (do this first — approvals take days)

| Item | Cost | Notes |
|---|---|---|
| **Google Play Console** account | ~$25 one-time | Sign up at play.google.com/console. Identity verification can take 1–3 days. |
| **Apple Developer Program** | ~$99/year | Enroll at developer.apple.com. If enrolling as a business, D-U-N-S number verification can take 1–2 weeks — start early. |
| **A Mac** (or Mac cloud) | — | Required to build/submit iOS. Options: your own Mac, or a service like MacinCloud / codemagic / EAS if you don't own one. |
| **App icons & splash** | — | 1024×1024 master icon; store screenshots per device size. |
| Xcode (Mac) + Android Studio | Free | Local build/test environments. |

*Confirm current pricing when you sign up — these are the long-standing figures but can change.*

---

## 2. Payments — the part that needs the most planning

Apple (Guideline 3.1.1) and Google both require **their** billing for digital goods consumed in-app. Your Razorpay flow is fine on the **website**, but inside the iOS/Android apps you must sell readings/subscriptions through:

- **Apple:** StoreKit / In-App Purchase (15–30% fee)
- **Google:** Play Billing (15–30% fee)

**Recommended tool: [RevenueCat](https://www.revenuecat.com)** — one SDK (`@revenuecat/purchases-capacitor`) that wraps both stores, handles receipts, subscription status, and entitlements. Free up to ~$2.5k/mo revenue.

### What you'll need to build
1. Create the products/subscriptions in **App Store Connect** and **Google Play Console** (same price tiers as your web plans, adjusted for the store cut).
2. Add RevenueCat, map products to "entitlements" (e.g. `premium`).
3. In the app, detect you're running natively (Capacitor) and **swap the Razorpay checkout for the RevenueCat purchase flow**. On the web, keep Razorpay.
4. Have RevenueCat webhooks update your backend subscription state (mirrors what Razorpay verify does today).

> Tip: keep one source of truth for "is this user premium?" in your backend, fed by *both* Razorpay (web) and RevenueCat (apps).

---

## 3. Make the web app app-ready

- [ ] **Add a service worker / PWA layer** (e.g. `next-pwa` or Serwist) — improves offline handling and strengthens the "real app" case. You already have `app/manifest.ts`.
- [ ] **Detect native context** — use Capacitor's `Capacitor.isNativePlatform()` to branch payment UI and hide anything that doesn't belong in an app (e.g. "install our app" banners).
- [ ] **Handle safe areas / notches** (CSS `env(safe-area-inset-*)`).
- [ ] **Remove/adjust external redirects** — links like the Course/Booking buttons that open external sites should open in the system browser (`@capacitor/browser`), not trap users in the WebView.
- [ ] **Deep links** for auth/payment return flows.

---

## 4. Add Capacitor to the project

```bash
npm install @capacitor/core @capacitor/cli
npx cap init "The Divine Tarot" "in.co.thedivinetarotonline.app"
npm install @capacitor/ios @capacitor/android
```

In `capacitor.config.ts`, point the shell at your live site:

```ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'in.co.thedivinetarotonline.app',
  appName: 'The Divine Tarot',
  webDir: 'public', // placeholder; content loads from server.url
  server: {
    url: 'https://thedivinetarotonline.com', // your production URL
    cleartext: false,
  },
};

export default config;
```

Then:

```bash
npx cap add ios
npx cap add android
npx cap sync
```

Plugins to add: `@capacitor/push-notifications`, `@capacitor/browser`, `@capacitor/splash-screen`, `@capacitor/status-bar`, `@revenuecat/purchases-capacitor`.

---

## 5. Native features to satisfy reviewers

Apple rejects "just a website" apps (Guideline 4.2). To pass comfortably, ship at least:

- [ ] **Native push notifications** (daily card, reading ready, offers)
- [ ] **In-app purchases** via RevenueCat (already required)
- [ ] **Splash screen + native app icon**
- [ ] **Graceful offline screen** when there's no connection
- [ ] Optional but strong: a small native feature like "daily card" widget or local notifications.

---

## 6. Store assets & listings

For **both** stores you'll need:
- App name, subtitle, description, keywords
- Privacy policy URL (**required**) and a **data-safety / privacy nutrition label** declaration
- Screenshots (multiple device sizes — iPhone 6.7"/6.5", iPad; Android phone/tablet)
- Feature graphic (Play), promo text (App Store)
- Age rating questionnaire (tarot/spiritual content — answer honestly; usually fine)
- Support email + marketing URL

---

## 7. Build, test, submit

**Android**
1. `npx cap open android` → build a signed **AAB** in Android Studio.
2. Upload to Play Console → Internal testing track first.
3. Complete Data Safety, content rating, target audience.
4. Promote to Production; review usually 1–3 days.

**iOS**
1. `npx cap open ios` → set signing team in Xcode.
2. Archive → upload to **App Store Connect** via Xcode/Transporter.
3. Test via **TestFlight**.
4. Submit for review; Apple review usually 1–3 days (expect at least one round of feedback the first time — often about payments or the 4.2 rule).

---

## 8. Suggested sequence (realistic timeline)

1. **Week 1:** Enroll in both developer programs (start Apple business verification NOW). Set up RevenueCat account.
2. **Week 1–2:** Add Capacitor, get the shell loading your live site on both simulators.
3. **Week 2–3:** Implement RevenueCat IAP + native-context payment branching; wire webhooks to backend.
4. **Week 3:** Add push, splash, offline, safe-area fixes; PWA service worker.
5. **Week 4:** Store listings, screenshots, privacy policy, internal/TestFlight testing.
6. **Week 4–5:** Submit, respond to review feedback, launch.

---

## Open decisions to settle before building

- **Bundle ID / App ID** — suggested `in.co.thedivinetarotonline.app` (must be unique and permanent; choose carefully).
- **Pricing on stores** — stores take 15–30%; decide whether app prices match web or absorb the cut.
- **Do you own a Mac** for iOS builds, or need a cloud Mac service?
- **Business vs individual** Apple account (affects verification time and how your name appears).
