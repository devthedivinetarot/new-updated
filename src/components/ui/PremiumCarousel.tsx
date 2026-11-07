'use client';

import { useRef, useEffect, useState, useCallback, TouchEvent } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PremiumCarouselProps {
  children: React.ReactNode[];
  itemsPerView?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  autoScroll?: boolean;
  autoScrollInterval?: number;
}

/**
 * Slides are sized from the carousel's *own* measured width (ResizeObserver),
 * not window.innerWidth. Using the window width made every slide wider than
 * the padded section it sits in, so on phones the card spilled off the right
 * edge. The track holds the slides twice, so wrapping from the last slide to
 * the first is a silent jump instead of a long rewind animation.
 */
export default function PremiumCarousel({
  children,
  itemsPerView = { mobile: 1, tablet: 2, desktop: 3 },
  autoScroll = true,
  autoScrollInterval = 30000,
}: PremiumCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [perView, setPerView] = useState(itemsPerView.mobile || 1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);
  const totalItems = children.length;

  // Measure the visible area and pick how many slides fit.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => {
      setViewportWidth(el.clientWidth);
      const w = window.innerWidth;
      setPerView(
        w < 640 ? itemsPerView.mobile || 1 : w < 1024 ? itemsPerView.tablet || 2 : itemsPerView.desktop || 3
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [itemsPerView.mobile, itemsPerView.tablet, itemsPerView.desktop]);

  const nextSlide = useCallback(() => {
    setAnimate(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const indexRef = useRef(0);
  useEffect(() => {
    indexRef.current = currentIndex;
  }, [currentIndex]);

  const prevSlide = useCallback(() => {
    if (indexRef.current > 0) {
      setAnimate(true);
      setCurrentIndex((prev) => prev - 1);
      return;
    }
    // At the first slide: jump silently to its duplicate, then step back.
    setAnimate(false);
    setCurrentIndex(totalItems);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setAnimate(true);
        setCurrentIndex(totalItems - 1);
      })
    );
  }, [totalItems]);

  // After sliding onto the duplicate of slide 0, snap back to the real one.
  useEffect(() => {
    if (currentIndex < totalItems) return;
    const t = setTimeout(() => {
      setAnimate(false);
      setCurrentIndex(currentIndex - totalItems);
    }, 450);
    return () => clearTimeout(t);
  }, [currentIndex, totalItems]);

  useEffect(() => {
    if (!autoScroll || isPaused || totalItems <= perView) return;
    const timer = setInterval(nextSlide, autoScrollInterval);
    return () => clearInterval(timer);
  }, [autoScroll, isPaused, autoScrollInterval, nextSlide, totalItems, perView]);

  const handleTouchStart = (e: TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientX;
    touchEnd.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e: TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    const delta = touchStart.current - touchEnd.current;
    if (delta > 50) nextSlide();
    if (delta < -50) prevSlide();
  };

  const slides = [...children, ...children];
  const slidePercent = 100 / perView;
  const itemWidth = viewportWidth ? viewportWidth / perView : 0;
  const translateX = -(currentIndex * itemWidth);

  return (
    <div
      className="relative w-full px-8 sm:px-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="overflow-hidden w-full" ref={viewportRef}>
        <motion.div
          className="flex"
          animate={{ x: translateX }}
          transition={animate ? { type: 'spring', stiffness: 300, damping: 30 } : { duration: 0 }}
        >
          {slides.map((child, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-2 sm:px-3 min-w-0"
              style={{ width: itemWidth ? `${itemWidth}px` : `${slidePercent}%` }}
              aria-hidden={index >= totalItems || undefined}
            >
              {child}
            </div>
          ))}
        </motion.div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-[0_0_10px_rgba(255,215,0,0.3)] hover:scale-110 transition-transform duration-300 flex items-center justify-center z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 text-black" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-[0_0_10px_rgba(255,215,0,0.3)] hover:scale-110 transition-transform duration-300 flex items-center justify-center z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 text-black" />
      </button>
    </div>
  );
}
