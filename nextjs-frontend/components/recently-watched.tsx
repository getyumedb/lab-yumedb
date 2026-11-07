"use client"

import { useState, useEffect, useCallback } from "react"
import { Clock, X, Play, RotateCcw } from "lucide-react"
import { getMockAnimes } from "@/lib/mock/anime.mock"
import type { AnimeListItem } from "@/types"
import { NoImagePlaceholder } from "@/components/no-image-placeholder"

interface WatchedItem {
  anime: AnimeListItem
  progress: number
  lastWatched: string
}

function getTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `hace ${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours}h`
  const days = Math.floor(hours / 24)
  return `hace ${days}d`
}

// Simulated recently watched data
const allAnime = getMockAnimes()
const initialWatched: WatchedItem[] = [
  {
    anime: allAnime[0],
    progress: 65,
    lastWatched: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    anime: allAnime[2],
    progress: 42,
    lastWatched: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    anime: allAnime[6],
    progress: 88,
    lastWatched: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    anime: allAnime[4],
    progress: 15,
    lastWatched: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    anime: allAnime[10],
    progress: 52,
    lastWatched: new Date(Date.now() - 172800000).toISOString(),
  },
]

export function RecentlyWatched() {
  const [watched, setWatched] = useState<WatchedItem[]>(initialWatched)
  const [, setTick] = useState(0)

  // Force re-render to update time ago
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000)
    return () => clearInterval(interval)
  }, [])

  const removeItem = useCallback((id: number) => {
    setWatched((prev) => prev.filter((w) => w.anime.id !== id))
  }, [])

  if (watched.length === 0) return null

  return (
    <section id="recien-visto" className="py-12 bg-card/50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-display text-foreground">
                Recien visto
              </h2>
              <p className="text-sm text-muted-foreground">Continua donde lo dejaste</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setWatched(initialWatched)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Restaurar</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {watched.map((item) => (
            <div
              key={item.anime.id}
              className="group relative bg-card rounded-xl border border-border/50 overflow-hidden hover:border-primary/30 transition-all"
            >
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeItem(item.anime.id)}
                className="absolute top-2 right-2 z-10 p-1 bg-background/80 backdrop-blur-sm rounded-full text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {/* Image */}
              <WatchedCardImage anime={item.anime} />

              {/* Info */}
              <div className="p-3">
                <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {item.anime.title}
                </h3>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-muted-foreground">
                    Ep. {Math.ceil((item.progress / 100) * item.anime.episodes)} de{" "}
                    {item.anime.episodes}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {getTimeAgo(item.lastWatched)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-primary font-medium">
                    {item.progress}% completado
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WatchedCardImage({ anime }: { anime: AnimeListItem }) {
  const [imgError, setImgError] = useState(false)
  return (
    <div className="relative aspect-video overflow-hidden">
      {anime.image && !imgError ? (
        <img
          src={anime.image}
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
      ) : (
        <NoImagePlaceholder variant="landscape" className="h-full w-full aspect-auto rounded-none" label="" />
      )}
      <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors flex items-center justify-center">
        <div className="p-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all">
          <Play className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
        </div>
      </div>
    </div>
  )
}
