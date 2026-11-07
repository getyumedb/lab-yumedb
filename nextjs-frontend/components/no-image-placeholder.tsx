import { ImageOff } from "lucide-react"

interface NoImagePlaceholderProps {
  className?: string
  variant?: "square" | "portrait" | "landscape" | "circle" | "banner"
  label?: string
}

export function NoImagePlaceholder({
  className = "",
  variant = "portrait",
  label = "Sin imagen",
}: NoImagePlaceholderProps) {
  const baseClasses =
    "flex flex-col items-center justify-center bg-secondary/50 border border-border/30"

  const variantClasses = {
    square: "aspect-square rounded-lg",
    portrait: "aspect-[3/4] rounded-xl",
    landscape: "aspect-video rounded-lg",
    circle: "aspect-square rounded-full",
    banner: "w-full h-full rounded-none",
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      role="img"
      aria-label={label}
    >
      <ImageOff className="h-6 w-6 text-muted-foreground/40 mb-1.5" />
      <span className="text-[10px] text-muted-foreground/50 font-medium">
        {label}
      </span>
    </div>
  )
}
