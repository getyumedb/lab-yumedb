"use client"

import Link from "next/link"
import { Heart, Film } from "lucide-react"
import { ImageWithFallback } from "@/components/image-with-fallback"

interface PersonCardProps {
  id: string
  name: string
  nameJp: string
  image: string | null
  type: string
  rolesCount: number
  favorites: number
  variant?: "list" | "grid" | "large"
}

export function PersonCard({
  id,
  name,
  nameJp,
  image,
  type,
  rolesCount,
  favorites,
  variant = "grid",
}: PersonCardProps) {
  if (variant === "list") {
    return (
      <Link
        href={`/people/${id}`}
        className="group flex items-center gap-4 p-3 bg-card rounded-xl border border-border/50 hover:border-primary/30 transition-all"
      >
        <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-border/50 group-hover:border-primary/50 transition-colors shrink-0">
          <ImageWithFallback
            src={image}
            alt={name}
            className="h-full w-full object-cover"
            placeholderVariant="circle"
            placeholderClassName="h-full w-full border-0"
            placeholderLabel=""
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {name}
          </h3>
          <p className="text-xs text-muted-foreground truncate">{nameJp}</p>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded shrink-0">
          {type}
        </span>
        <div className="flex items-center gap-3 shrink-0">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Film className="h-3 w-3" /> {rolesCount}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Heart className="h-3 w-3" /> {(favorites / 1000).toFixed(1)}k
          </span>
        </div>
      </Link>
    )
  }

  const isLarge = variant === "large"

  return (
    <Link
      href={`/people/${id}`}
      className="group flex flex-col items-center text-center"
    >
      <div
        className={`relative rounded-full overflow-hidden border-2 border-border/50 group-hover:border-primary/50 transition-colors mb-3 ${
          isLarge ? "h-36 w-36" : "h-28 w-28"
        }`}
      >
        <ImageWithFallback
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          placeholderVariant="circle"
          placeholderClassName="h-full w-full border-0"
          placeholderLabel=""
        />
      </div>
      <h3
        className={`font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 ${
          isLarge ? "text-base" : "text-sm"
        }`}
      >
        {name}
      </h3>
      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{nameJp}</p>
      <span className="px-2 py-0.5 mt-1.5 text-[10px] font-medium bg-primary/10 text-primary rounded">
        {type}
      </span>
      <div className="flex items-center gap-3 mt-1.5">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Film className="h-3 w-3" /> {rolesCount}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Heart className="h-3 w-3" /> {(favorites / 1000).toFixed(1)}k
        </span>
      </div>
    </Link>
  )
}
