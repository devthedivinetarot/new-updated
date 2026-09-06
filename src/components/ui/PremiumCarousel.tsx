'use client';

import { useRef, useEffect, useState, TouchEvent } from 'react';
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

export default function PremiumCarousel({
  children,
  itemsPerView = { mobile: 1, tablet: 2, desktop: 3 },
  autoScroll = true,
  autoScrollInterval = 30000,
}: PremiumCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const totalItems = children.length;

  const duplicatedChildren = [...children, ...children, ...children];

  const nextSlide = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  useEffect(() => {
    if (!autoScroll || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, autoScrollInterval);

    return () => clearInterval(timer);
  }, [autoScroll, isPaused, autoScrollInterval]);

  useEffect(() => {
    if (currentIndex >= totalItems) {
      setTimeout(() => setCurrentIndex(0), 500);
    } else if (currentIndex < 0) {
      setTimeout(() => setCurrentIndex(totalItems - 1), 500);
    }
  }, [currentIndex, totalItems]);

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextSlide();
    }
    if (touchStart - touchEnd < -50) {
      prevSlide();
    }
  };

  const getItemWidth = () => {
    if (typeof window === 'undefined') return 320;
    const width = window.innerWidth;
    if (width < 640) return width / (itemsPerView.mobile || 1);
    if (width < 1024) return width / (itemsPerView.tablet || 2);
    return width / (itemsPerView.desktop || 3);
  };

  const itemWidth = getItemWidth();
  const translateX = -(currentIndex * itemWidth);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="overflow-hidden w-full" ref={containerRef}>
        <motion.div
          className="flex"
          animate={{ x: translateX }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ width: `${duplicatedChildren.length * itemWidth}px` }}
        >
          {duplicatedChildren.map((child, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-3"
              style={{ width: `${itemWidth}px` }}
            >
              {child}
            </div>
          ))}
        </motion.div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-[15px] h-[15px] rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 backdrop-blur-md shadow-[0_0_10px_rgba(255,215,0,0.3)] hover:scale-110 hover:shadow-[0_0_15px_rgba(255,215,0,0.5)] transition-all duration-300 flex items-center justify-center z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-2.5 h-2.5 text-black" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-[15px] h-[15px] rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 backdrop-blur-md shadow-[0_0_10px_rgba(255,215,0,0.3)] hover:scale-110 hover:shadow-[0_0_15px_rgba(255,215,0,0.5)] transition-all duration-300 flex items-center justify-center z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-2.5 h-2.5 text-black" />
      </button>
    </div>
  );
}