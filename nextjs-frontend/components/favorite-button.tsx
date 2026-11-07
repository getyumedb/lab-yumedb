"use client"

import { useState } from "react"
import { Heart } from "lucide-react"

interface FavoriteButtonProps {
  /** Visual size variant */
  variant?: "default" | "compact" | "icon"
  /** Optional label text shown next to the icon */
  label?: string
  className?: string
}

export function FavoriteButton({
  variant = "default",
  label = "Favorito",
  className = "",
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsFavorite(!isFavorite)
        }}
        className={`p-1.5 backdrop-blur-sm rounded-lg transition-colors ${
          isFavorite
            ? "bg-primary/20 text-primary"
            : "bg-secondary/90 text-secondary-foreground hover:bg-secondary"
        } ${className}`}
        title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        <Heart className={`h-3.5 w-3.5 ${isFavorite ? "fill-primary" : ""}`} />
      </button>
    )
  }

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={() => setIsFavorite(!isFavorite)}
        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
          isFavorite
            ? "bg-primary/20 text-primary border border-primary/30"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50"
        } ${className}`}
        aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        <Heart className={`h-3.5 w-3.5 ${isFavorite ? "fill-primary" : ""}`} />
        {label}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setIsFavorite(!isFavorite)}
      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        isFavorite
          ? "bg-primary/20 text-primary border border-primary/30"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50"
      } ${className}`}
      aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <Heart className={`h-4 w-4 ${isFavorite ? "fill-primary" : ""}`} />
      {label}
    </button>
  )
}
