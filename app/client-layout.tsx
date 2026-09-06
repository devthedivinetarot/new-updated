'use client';

import "./globals.css";
import { usePathname } from "next/navigation";
import ClientProviders from "@/components/ClientProviders";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import UniversalProtectionOverlay from "@/components/security/UniversalProtectionOverlay";
import ContentGuard from "@/components/ContentGuard";

// Routes rendered as a full-screen immersive experience. The footer is removed
// and the page is locked to exactly the viewport height so an embedded
// cross-origin iframe cannot scroll the parent page when its inputs receive
// focus (this was causing the auto-scroll/jump on the reading page).
const IMMERSIVE_ROUTES = ["/reading"];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isImmersive = IMMERSIVE_ROUTES.includes(pathname);

  return (
    <div className="antialiased bg-[rgb(var(--background))] text-[rgb(var(--foreground))] min-h-screen" suppressHydrationWarning>
      <UniversalProtectionOverlay />

      <ContentGuard>
        <ClientProviders>
          <AnalyticsProvider />
          {isImmersive ? (
            <div className="flex h-screen flex-col overflow-hidden">
              <Header />
              <main className="flex-1 relative min-h-0 overflow-hidden">
                {children}
              </main>
            </div>
          ) : (
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1 relative min-h-0">
                {children}
              </main>
              <Footer />
            </div>
          )}
        </ClientProviders>
      </ContentGuard>
    </div>
  );
}
