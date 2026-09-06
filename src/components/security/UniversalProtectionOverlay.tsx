'use client';

import { useState, useEffect, useMemo, memo } from 'react';
import { prefersReducedMotion } from '@/lib/security/watermark';

interface WatermarkCellProps {
  text: string;
  fontSize: number;
  opacity: number;
  reducedMotion: boolean;
  style?: React.CSSProperties;
}

const WatermarkCell = memo(function WatermarkCell({ text, fontSize, opacity, reducedMotion, style: customStyle }: WatermarkCellProps) {
  const computedStyle = useMemo(() => ({
    fontSize: `${fontSize}px`,
    color: `rgba(255, 215, 0, ${opacity})`,
    fontFamily: 'Cinzel, Georgia, serif',
    letterSpacing: '0.25em',
    textTransform: 'uppercase' as const,
    whiteSpace: 'nowrap' as const,
    userSelect: 'none' as const,
    transform: 'rotate(-25deg)',
    willChange: reducedMotion ? 'auto' : 'transform',
    ...customStyle,
  }), [fontSize, opacity, reducedMotion, customStyle]);

  return (
    <div
      className="absolute select-none pointer-events-none"
      style={computedStyle}
      aria-hidden="true"
    >
      {text}
    </div>
  );
});

export default function UniversalProtectionOverlay() {
  const [mounted, setMounted] = useState(false);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const watermarkText = 'The Divine Tarot';

  const cells = useMemo(() => {
    if (!mounted) return [];

    const positions: Array<{ id: string; x: number; y: number }> = [];
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
    
    const cols = Math.max(2, Math.floor(screenWidth / 400));
    const rows = Math.max(2, Math.floor(screenHeight / 400));
    const spacingX = screenWidth / (cols + 1);
    const spacingY = screenHeight / (rows + 1);
    
    let id = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        positions.push({
          id: `wm-${id++}`,
          x: Math.round((col + 1) * spacingX),
          y: Math.round((row + 1) * spacingY),
        });
      }
    }
    
    return positions;
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-[9999]"
      aria-hidden="true"
    >
      {cells.map((cell) => (
        <WatermarkCell
          key={cell.id}
          text={watermarkText}
          fontSize={14}
          opacity={0.035}
          reducedMotion={reduced}
          style={{
            left: `${cell.x}px`,
            top: `${cell.y}px`,
          }}
        />
      ))}
    </div>
  );
}