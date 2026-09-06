'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const navLinks: { href: string; labelKey: string; isExternal?: boolean }[] = [
  { href: 'https://thedivinetarotonline.com/', labelKey: 'nav.home' },
  { href: 'https://thedivinetarotonline.com/about', labelKey: 'nav.about' },
  { href: 'https://reading.thedivinetarotonline.com/', labelKey: 'nav.reading' },
  { href: 'https://learn.thedivinetarotonline.com/', labelKey: 'nav.course', isExternal: true },
  { href: 'https://thedivinetarotonline.com/kundli-milan', labelKey: 'nav.kundli' },
  { href: 'https://booking.thedivinetarotonline.com/', labelKey: 'nav.Personal Reading', isExternal: true },
];

const HOME_HREF = 'https://thedivinetarotonline.com/';
const CTA_HREF = 'https://reading.thedivinetarotonline.com/';

export default function Header() {
  const pathname = usePathname();
  const { isHydrated, t } = useLanguage();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsHidden(true);
        } else {
          setIsHidden(false);
        }
        setLastScrollY(currentScrollY);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollY]);

  const getNavLabel = (labelKey: string): string => {
    return t(labelKey);
  };

  const isLinkActive = (href: string): boolean => {
    try {
      const url = new URL(href);
      if (typeof window !== 'undefined' && window.location.hostname !== url.hostname) {
        return false;
      }
      return pathname === url.pathname;
    } catch {
      return pathname === href;
    }
  };

  return (
    <>
      <motion.header
        className={cn(
          'sticky top-0 left-0 right-0 z-50 transition-transform duration-300 backdrop-blur-md bg-black/60 border-b border-white/10',
          isHidden ? 'translate-y-[-100%]' : 'translate-y-0'
        )}
      >
        <div className="mx-auto flex h-14 sm:h-16 lg:h-[68px] w-full max-w-7xl items-center gap-3 px-4 sm:px-6">
          <a href={HOME_HREF} className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0">
              <Image
                src="/logo.png"
                alt="The Divine Tarot Logo"
                width={40}
                height={40}
                className="object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="flex flex-col leading-tight">
              <span className="font-heading text-base sm:text-lg font-semibold text-white whitespace-nowrap">
                The Divine Tarot
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.15em] text-[#FFD700]/80 uppercase whitespace-nowrap">
                Premium Tarot Guidance
              </span>
            </span>
          </a>

          <nav className="hidden xl:flex flex-1 items-center justify-center gap-5 xl:gap-6">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              if (link.isExternal) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-xs sm:text-sm text-white/70 hover:text-white transition-colors duration-200 py-2"
                  >
                    {getNavLabel(link.labelKey)}
                  </a>
                );
              }
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative font-medium text-xs sm:text-sm transition-colors duration-200 hover:text-white py-2',
                    active ? 'text-[#FFD700]' : 'text-white/70'
                  )}
                >
                  {getNavLabel(link.labelKey)}
                  {active && (
                    <motion.div
                      className="absolute -bottom-1 left-0 h-0.5 w-full bg-[#FFD700]"
                      layoutId="navbar-indicator"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
            <LanguageSwitcher className="hidden xl:inline-flex" />

            <a
              href={CTA_HREF}
              className="hidden xl:inline-flex items-center justify-center whitespace-nowrap bg-gradient-to-r from-[#FF4D4D] to-[#FFD700] text-black font-semibold rounded-full px-5 py-2 text-sm hover:scale-105 transition-transform active:scale-95"
            >
              {isHydrated ? t('nav.askQuestion') : 'Ask your question here'}
            </a>

            <button
              className="xl:hidden p-2 text-white min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors active:scale-95"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              className="fixed right-0 top-0 z-50 h-full w-72 max-w-[85vw] bg-[#0a0a0a] shadow-2xl border-l border-white/10"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              role="dialog"
              aria-label="Mobile navigation menu"
            >
              <div className="flex h-16 items-center justify-between px-6">
                <span className="font-heading text-lg font-semibold text-white">Menu</span>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 text-white min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-1 px-6 py-4">
                {navLinks.map((link) => {
                  const active = isLinkActive(link.href);
                  if (link.isExternal) {
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMobileOpen(false)}
                        className="py-3 px-4 text-base text-white/70 hover:text-white hover:bg-white/5 transition-colors rounded-lg min-h-[44px] flex items-center"
                        aria-label={getNavLabel(link.labelKey) + ' (opens in new tab)'}
                      >
                        {getNavLabel(link.labelKey)}
                      </a>
                    );
                  }
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        'py-3 px-4 text-base transition-colors rounded-lg min-h-[44px] flex items-center',
                        active
                          ? 'text-[#FFD700] font-medium bg-gold/10'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      )}
                    >
                      {getNavLabel(link.labelKey)}
                    </a>
                  );
                })}
                <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-3">
                  <div className="flex justify-center pb-1">
                    <LanguageSwitcher />
                  </div>
                  <a
                    href={CTA_HREF}
                    onClick={() => setIsMobileOpen(false)}
                    className="block w-full text-center bg-gradient-to-r from-[#FF4D4D] to-[#FFD700] text-black font-semibold rounded-xl px-5 py-3 min-h-[48px] flex items-center justify-center"
                  >
                    {isHydrated ? t('nav.askQuestion') : 'Ask your question here'}
                  </a>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
