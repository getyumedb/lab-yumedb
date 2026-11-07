"use client"

import Link from "next/link"
import { Calendar, Film, Heart } from "lucide-react"
import { ImageWithFallback } from "@/components/image-with-fallback"

interface CompanyCardProps {
  id: string
  name: string
  nameJp: string
  image: string | null
  type: string
  founded: number
  productionsCount: number
  favorites: number
}

export function CompanyCard({
  id,
  name,
  nameJp,
  image,
  type,
  founded,
  productionsCount,
  favorites,
}: CompanyCardProps) {
  return (
    <Link
      href={`/companies/${id}`}
      className="group flex gap-4 p-4 bg-card rounded-xl border border-border/50 hover:border-primary/30 transition-all"
    >
      <div className="relative h-20 w-20 rounded-lg overflow-hidden shrink-0 bg-secondary">
        <ImageWithFallback
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          placeholderVariant="square"
          placeholderClassName="h-full w-full"
          placeholderLabel=""
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
          {name}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">{nameJp}</p>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded">
            {type}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {founded}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Film className="h-3 w-3" />
            {productionsCount} producciones
          </span>
        </div>
        <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
          <Heart className="h-3 w-3" />
          {favorites.toLocaleString()} favoritos
        </div>
      </div>
    </Link>
  )
}
