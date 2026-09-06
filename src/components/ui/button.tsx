import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

/**
 * === DESIGN SYSTEM BUTTON ===
 * Single source of truth for all buttons
 * Uses design tokens from globals.css
 */

export const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--gold))/45] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // PRIMARY: Red to Gold gradient - Main CTA
        primary: `
          bg-gradient-to-r from-[rgb(var(--accent-start))] via-[rgb(var(--gold))] to-[rgb(var(--gold-light))]
          text-black
          shadow-lg shadow-[rgba(244,197,66,0.22)]
          hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[rgba(244,197,66,0.34)]
          active:scale-95
        `,
        // SECONDARY: Outline / subtle
        secondary: `
          border-2 border-[rgb(var(--gold))/45]
          text-[rgb(var(--gold))]
          bg-[rgb(var(--surface))/35]
          hover:border-[rgb(var(--gold))/70] hover:bg-[rgb(var(--gold))/10] hover:text-[rgb(var(--gold-light))] hover:shadow-lg hover:shadow-[rgba(244,197,66,0.15)]
          active:scale-95
        `,
        // GHOST: Minimal, transparent
        ghost: `
          text-[rgb(var(--foreground))]
          hover:bg-white/5
          active:bg-white/10
        `,
        // GHOST GOLD: Gold text, transparent bg
        ghostGold: `
          text-[rgb(var(--gold))]
          hover:bg-[rgb(var(--gold))/10]
          active:bg-[rgb(var(--gold))/20]
        `,
        // DESTRUCTIVE: Red warning
        destructive: `
          bg-[rgb(var(--secondary))]
          text-white
          hover:bg-[rgb(var(--secondary))/90]
          shadow-md shadow-[rgba(193,18,31,0.28)]
        `,
      },
      size: {
        sm: "px-4 py-2 text-sm rounded-full",
        md: "px-6 py-3 text-base rounded-full",
        lg: "px-8 py-4 text-lg rounded-full",
        xl: "px-10 py-5 text-xl rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

/**
 * DESIGN SYSTEM BUTTON
 * Use this component for ALL buttons throughout the app
 *
 * Usage:
 * - Primary: Main CTA (get started, submit, etc.)
 * - Secondary: Alternative actions (back, cancel)
 * - Ghost: Subtle actions (skip, maybe later)
 * - GhostGold: Premium/special actions
 * - Destructive: Warning actions (delete, remove)
 */
export default function Button({
  children,
  onClick,
  className,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 translate-x-[-130%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-[130%]"
        />
      )}
      {children}
    </motion.button>
  )
}
