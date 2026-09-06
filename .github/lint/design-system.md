# Design System Linting Rules

This document defines the design system linting rules to maintain UI consistency.

## ✗ Forbidden Patterns

### Raw Colors
Always use design tokens defined in `globals.css`. Never use raw hex values.

```tsx
// WRONG
<div className="text-[#F4C542]" />
<div className="bg-[#0e0e0e]" />

// CORRECT
<div className="text-gold" />
<div className="bg-background" />
```

### Hardcoded Colors in Style Props
```tsx
// WRONG
<div style={{ color: '#F4C542' }} />

// CORRECT  
<div style={{ color: 'rgb(var(--gold))' }} />
```

## ✅ Required Patterns

### Buttons
Use the button classes from design system:

```tsx
<button className="btn-primary">Action</button>
<button className="btn-secondary">Cancel</button>
```

### Cards
```tsx
<div className="card-mystical">Content</div>
```

### Inputs
```tsx
<input className="input-mystical" />
```

### Typography
Use token-based classes:
```tsx
<h1 className="text-h1">Heading</h1>
<h2 className="text-h2">Heading</h2>
<p className="text-body">Content</p>
```

## Design Token Reference

### Colors
| Token | Usage |
|-------|-------|
| `bg-background` | Page backgrounds |
| `bg-surface` | Card/modal backgrounds |
| `text-foreground` | Primary text |
| `text-foreground-secondary` | Secondary text |
| `text-foreground-muted` | Disabled/hints |
| `text-gold` | Gold accent text |
| `bg-gold-gradient` | Primary buttons |
| `border-glow-gold` | Card borders |

### Spacing
| Token | Value |
|-------|-------|
| `py-12` | Section padding (mobile) |
| `py-20` | Section padding (desktop) |
| `gap-6` | Component gap |
| `p-8` | Card padding |

## Enforcement

### Pre-commit Hook
Run `npm run lint` before committing to catch violations.

### Build Check
CI will fail if design token violations are detected.

### Manual Audit
Run `npm run design-audit` for a detailed report.

## Adding New Design Tokens

To add new tokens:
1. Add to `src/app/globals.css` in `:root`
2. Add to `tailwind.config.ts` in `theme.extend.colors`
3. Verify `npm run build` passes

## Quick Fix

```bash
# Auto-fix some issues
npm run lint -- --fix
```