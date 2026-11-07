"use client"

import { useState } from "react"
import Link from "next/link"
import { Clock } from "lucide-react"
import { useRecentlyVisited } from "@/hooks/use-recently-visited"
import { NoImagePlaceholder } from "@/components/no-image-placeholder"

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return "hace un momento"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `hace ${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours}h`
  const days = Math.floor(hours / 24)
  return `hace ${days}d`
}

export function RecentlyVisitedFooter() {
  const { recentlyVisited } = useRecentlyVisited()

  if (recentlyVisited.length === 0) return null

  return (
    <section className="border-b border-border/50 pb-8 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">
          Recien visitado
        </h3>
        <span className="text-xs text-muted-foreground">({recentlyVisited.length})</span>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
        {recentlyVisited.map((anime) => (
          <Link
            key={anime.id}
            href={`/anime/${anime.id}`}
            className="group flex flex-col shrink-0 w-24"
          >
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2 border border-border/50 group-hover:border-primary/30 transition-colors">
              <VisitedImage image={anime.image} title={anime.title} />
            </div>
            <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
              {anime.title}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {timeAgo(anime.visitedAt)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

function VisitedImage({ image, title }: { image?: string; title: string }) {
  const [error, setError] = useState(false)
  if (image && !error) {
    return (
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        onError={() => setError(true)}
      />
    )
  }
  return <NoImagePlaceholder variant="portrait" className="h-full w-full rounded-none" label="" />
}
