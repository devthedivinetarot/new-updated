'use client';

import { cn } from '@/lib/utils';

type TypographyVariant = 'hero' | 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'body-sm' | 'caption' | 'label';
type TypographyColor = 'primary' | 'secondary' | 'muted' | 'gold';

interface TypographyProps {
  variant?: TypographyVariant;
  color?: TypographyColor;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<TypographyVariant, string> = {
  hero: 'font-serif text-hero text-foreground tracking-wide',
  h1: 'font-serif text-h1 text-foreground',
  h2: 'font-serif text-h2 text-foreground',
  h3: 'font-serif text-h3 text-foreground',
  h4: 'font-serif text-h4 text-foreground',
  body: 'font-sans text-body text-foreground-secondary leading-relaxed',
  'body-sm': 'font-sans text-small text-foreground-secondary',
  caption: 'font-sans text-xs text-foreground-muted',
  label: 'font-sans text-sm font-medium tracking-wide uppercase text-foreground-secondary',
};

const colorStyles: Record<TypographyColor, string> = {
  primary: 'text-foreground',
  secondary: 'text-foreground-secondary',
  muted: 'text-foreground-muted',
  gold: 'text-gold',
};

export default function Typography({
  variant = 'body',
  color = 'primary',
  className,
  children,
}: TypographyProps) {
  const Tag: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'span' = variant.startsWith('h') || variant === 'hero' 
    ? (variant === 'hero' ? 'h1' : variant === 'h1' ? 'h1' : variant === 'h2' ? 'h2' : variant === 'h3' ? 'h3' : variant === 'h4' ? 'h4' : 'p') 
    : 'p';
  
  const variantClass = variantStyles[variant];
  const colorClass = colorStyles[color];
  
  const classNames = cn(variantClass, colorClass, className);
  
  if (Tag === 'p') {
    return <p className={classNames}>{children}</p>;
  }
  if (Tag === 'h1') {
    return <h1 className={classNames}>{children}</h1>;
  }
  if (Tag === 'h2') {
    return <h2 className={classNames}>{children}</h2>;
  }
  if (Tag === 'h3') {
    return <h3 className={classNames}>{children}</h3>;
  }
  if (Tag === 'h4') {
    return <h4 className={classNames}>{children}</h4>;
  }
  return <p className={classNames}>{children}</p>;
}

// Convenience components for common use cases
export function Hero({ className, children }: { className?: string; children: React.ReactNode }) {
  return <Typography variant="hero" className={className}>{children}</Typography>;
}

export function H1({ className, children }: { className?: string; children: React.ReactNode }) {
  return <Typography variant="h1" className={className}>{children}</Typography>;
}

export function H2({ className, children }: { className?: string; children: React.ReactNode }) {
  return <Typography variant="h2" className={className}>{children}</Typography>;
}

export function H3({ className, children }: { className?: string; children: React.ReactNode }) {
  return <Typography variant="h3" className={className}>{children}</Typography>;
}

export function H4({ className, children }: { className?: string; children: React.ReactNode }) {
  return <Typography variant="h4" className={className}>{children}</Typography>;
}

export function Body({ className, children }: { className?: string; children: React.ReactNode }) {
  return <Typography variant="body" className={className}>{children}</Typography>;
}

export function BodySmall({ className, children }: { className?: string; children: React.ReactNode }) {
  return <Typography variant="body-sm" className={className}>{children}</Typography>;
}

export function Caption({ className, children }: { className?: string; children: React.ReactNode }) {
  return <Typography variant="caption" color="muted" className={className}>{children}</Typography>;
}

export function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <Typography variant="label" className={className}>{children}</Typography>;
}

export function Gold({ className, children }: { className?: string; children: React.ReactNode }) {
  return <Typography variant="body" color="gold" className={className}>{children}</Typography>;
}