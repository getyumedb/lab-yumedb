/**
 * Shared style constants for consistent design across the application.
 * Use these classes to maintain visual consistency.
 */

// Card styles
export const cardStyles = {
  base: "bg-card rounded-xl border border-border/50",
  hover: "bg-card rounded-xl border border-border/50 hover:border-primary/30 transition-all",
  interactive: "bg-card rounded-xl border border-border/50 hover:border-primary/30 hover:bg-secondary/20 transition-all",
} as const

// Section styles
export const sectionStyles = {
  base: "bg-card rounded-xl border border-border/50 p-6",
  compact: "bg-card rounded-xl border border-border/50 p-4",
} as const

// Input styles
export const inputStyles = {
  base: "w-full px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all",
  search: "w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all",
  select: "px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all",
} as const

// Button styles
export const buttonStyles = {
  primary: "px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors",
  secondary: "px-4 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors border border-border/50",
  ghost: "px-4 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors",
  icon: "p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors border border-border/50",
  iconActive: "p-2.5 rounded-lg bg-primary/10 text-primary border border-primary/30 transition-colors",
} as const

// Badge styles
export const badgeStyles = {
  primary: "px-2.5 py-1 text-xs font-bold bg-primary/20 text-primary rounded-md uppercase tracking-wide",
  secondary: "px-2 py-0.5 text-xs font-medium bg-secondary text-muted-foreground rounded",
  outline: "px-2 py-0.5 text-xs font-medium border border-border/50 text-muted-foreground rounded",
  status: {
    watching: "bg-chart-2/15 border-chart-2/30 text-chart-2",
    completed: "bg-chart-1/15 border-chart-1/30 text-chart-1",
    onHold: "bg-chart-4/15 border-chart-4/30 text-chart-4",
    dropped: "bg-destructive/15 border-destructive/30 text-destructive",
    planToWatch: "bg-chart-5/15 border-chart-5/30 text-chart-5",
  },
} as const

// Text styles
export const textStyles = {
  heading: "font-bold font-display text-foreground",
  subheading: "text-lg text-muted-foreground",
  body: "text-sm text-muted-foreground leading-relaxed",
  label: "text-xs text-muted-foreground",
  link: "text-primary hover:underline transition-colors",
} as const

// Image container styles
export const imageStyles = {
  portrait: "aspect-[3/4] rounded-xl overflow-hidden",
  square: "aspect-square rounded-lg overflow-hidden",
  circle: "rounded-full overflow-hidden",
  banner: "w-full h-[300px] overflow-hidden",
  thumbnail: "h-16 w-12 rounded-lg overflow-hidden shrink-0",
  avatar: "h-12 w-12 rounded-full overflow-hidden shrink-0",
} as const

// Layout styles
export const layoutStyles = {
  container: "mx-auto max-w-7xl px-4",
  grid: {
    cols2: "grid grid-cols-1 sm:grid-cols-2 gap-4",
    cols3: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
    cols4: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4",
    cols5: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4",
    cols6: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4",
  },
  flexBetween: "flex items-center justify-between",
  flexCenter: "flex items-center justify-center",
  flexStart: "flex items-center gap-2",
} as const

// Animation/transition styles
export const transitionStyles = {
  base: "transition-all duration-200",
  fast: "transition-all duration-150",
  slow: "transition-all duration-300",
  colors: "transition-colors duration-200",
  transform: "transition-transform duration-200",
  opacity: "transition-opacity duration-200",
} as const

// Helper to combine classes
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ")
}
