// Client-side Sentry initialization has moved to `instrumentation-client.ts`,
// which is the canonical location for the Next.js Sentry SDK.
//
// Calling `Sentry.init()` here as well caused the
// "You are calling Sentry.init() more than once on the client" warning,
// so this file intentionally no longer initializes Sentry.
//
// See: https://docs.sentry.io/platforms/javascript/guides/nextjs/
export {};
