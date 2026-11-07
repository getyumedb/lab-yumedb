"use client"

import { useState } from "react"
import { Play, X, Film } from "lucide-react"
import type { AnimeDetail } from "@/types"

export function DetailTrailers({ anime }: { anime: AnimeDetail }) {
  const [activeTrailer, setActiveTrailer] = useState<string | null>(null)
  const trailers = anime.trailers || []

  if (trailers.length === 0) return null

  return (
    <section className="bg-card rounded-xl border border-border/50 p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold font-display text-foreground mb-5">
        <Film className="h-5 w-5 text-primary" />
        Trailers y PVs
        <span className="text-sm font-normal text-muted-foreground">
          ({trailers.length})
        </span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {trailers.map((trailer) => (
          <button
            key={trailer.id}
            type="button"
            onClick={() => setActiveTrailer(trailer.url)}
            className="group relative rounded-xl overflow-hidden border border-border/30 hover:border-primary/30 transition-all text-left"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video">
              <img
                src={trailer.thumbnail}
                alt={trailer.title}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-background/20 group-hover:bg-background/40 transition-colors flex items-center justify-center">
                <div className="flex items-center justify-center h-12 w-12 bg-primary/90 group-hover:bg-primary rounded-full transition-colors">
                  <Play className="h-5 w-5 text-primary-foreground fill-primary-foreground ml-0.5" />
                </div>
              </div>
              {/* Type badge */}
              <div className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-background/80 backdrop-blur-sm text-foreground rounded-md">
                {trailer.type}
              </div>
            </div>

            {/* Title */}
            <div className="p-3 bg-secondary/30">
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {trailer.title}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Trailer modal */}
      {activeTrailer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-sm">
          <div className="w-full max-w-4xl mx-4">
            <div className="flex justify-end mb-3">
              <button
                type="button"
                onClick={() => setActiveTrailer(null)}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <X className="h-4 w-4" />
                Cerrar
              </button>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-card">
              <iframe
                src={activeTrailer}
                title="Trailer"
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
