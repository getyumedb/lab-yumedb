"use client"

import { useState } from "react"
import { PlayCircle, ChevronRight, Clock, Calendar, Sparkles } from "lucide-react"
import type { AnimeDetail, EpisodeDetail } from "@/types"
import { NoImagePlaceholder } from "@/components/no-image-placeholder"
import { EpisodeDetailDialog } from "@/components/detail/episode-detail-dialog"
import { getStreamingForAnime } from "@/lib/streaming-data"

export function DetailEpisodes({ anime }: { anime: AnimeDetail }) {
  const [showAll, setShowAll] = useState(false)
  const [selectedEpisode, setSelectedEpisode] = useState<EpisodeDetail | null>(null)
  const episodes = anime.episodesList || []
  const platforms = getStreamingForAnime(anime.licensors)

  if (episodes.length === 0) return null

  const displayed = showAll ? episodes : episodes.slice(0, 6)
  const latestEpNumber = Math.max(...episodes.map((e) => e.number))

  return (
    <section className="bg-card rounded-xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="flex items-center gap-2 text-lg font-bold font-display text-foreground">
          <PlayCircle className="h-5 w-5 text-primary" />
          Episodios
          <span className="text-sm font-normal text-muted-foreground">
            ({anime.episodesAired}/{anime.episodes})
          </span>
        </h2>
        {episodes.length > 6 && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            {showAll ? "Mostrar menos" : `Ver todos (${episodes.length})`}
            <ChevronRight
              className={`h-4 w-4 transition-transform ${showAll ? "rotate-90" : ""}`}
            />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {displayed.map((ep) => (
          <div
            key={ep.number}
            className="group flex gap-4 p-3 rounded-xl bg-secondary/30 border border-border/30 hover:border-primary/20 hover:bg-secondary/50 transition-all cursor-pointer"
            onClick={() => setSelectedEpisode(ep)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelectedEpisode(ep) }}
          >
            {/* Thumbnail */}
            <div className="relative w-36 sm:w-44 aspect-video rounded-lg overflow-hidden shrink-0 border border-border/50">
              {ep.thumbnail ? (
                <img
                  src={ep.thumbnail}
                  alt={`Ep. ${ep.number}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <NoImagePlaceholder variant="landscape" className="h-full w-full" label="" />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-background/0 group-hover:bg-background/40 transition-colors">
                <PlayCircle className="h-8 w-8 text-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {ep.number === latestEpNumber && (
                <div className="absolute top-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 bg-primary text-primary-foreground rounded text-[10px] font-bold">
                  <Sparkles className="h-2.5 w-2.5" />
                  Nuevo
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 py-0.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-primary">
                  EP {ep.number}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {ep.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {ep.titleJp}
              </p>
              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed hidden sm:block">
                {ep.synopsis}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {ep.airDate}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {ep.duration}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {episodes.length > 6 && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="w-full mt-4 py-2.5 text-sm text-primary font-medium bg-primary/5 hover:bg-primary/10 rounded-lg border border-primary/20 transition-colors"
        >
          Ver todos los episodios ({episodes.length})
        </button>
      )}

      <EpisodeDetailDialog
        episode={selectedEpisode}
        open={selectedEpisode !== null}
        onClose={() => setSelectedEpisode(null)}
        platforms={platforms}
      />
    </section>
  )
}
