import { NextResponse } from 'next/server';

/**
 * "Download for Android" — sends the visitor straight to the latest Android app file (APK).
 * The file itself is kept as a GitHub release asset (too big for the website); to publish a new version,
 * replace the asset in the `android-app` release, or point ANDROID_APK_URL at another file.
 */
const APK_URL =
  process.env.ANDROID_APK_URL ||
  'https://github.com/devthedivinetarot/new-updated/releases/download/android-app/The-Divine-Tarot.apk';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.redirect(APK_URL, {
    status: 302,
    headers: { 'Cache-Control': 'no-store' },
  });
}
