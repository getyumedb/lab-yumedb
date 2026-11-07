"use client"

import { useEffect, useRef } from "react"
import { X, Calendar, Clock, ExternalLink, MonitorPlay } from "lucide-react"
import type { EpisodeDetail } from "@/types"
import type { StreamingPlatform } from "@/lib/streaming-data"
import { NoImagePlaceholder } from "@/components/no-image-placeholder"

interface EpisodeDetailDialogProps {
  episode: EpisodeDetail | null
  open: boolean
  onClose: () => void
  platforms: StreamingPlatform[]
}

export function EpisodeDetailDialog({
  episode,
  open,
  onClose,
  platforms,
}: EpisodeDetailDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (open) window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open, onClose])

  if (!open || !episode) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Episodio ${episode.number}: ${episode.title}`}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card rounded-2xl border border-border/50 shadow-2xl">
        {/* Episode thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl">
          {episode.thumbnail ? (
            <img
              src={episode.thumbnail}
              alt={`Ep. ${episode.number}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <NoImagePlaceholder variant="landscape" className="h-full w-full" label="" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-lg bg-background/60 backdrop-blur-sm text-foreground hover:bg-background/80 transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-5">
            <span className="px-2.5 py-1 text-xs font-bold bg-primary text-primary-foreground rounded-md">
              EP {episode.number}
            </span>
          </div>
        </div>

        {/* Episode info */}
        <div className="p-6">
          <h2 className="text-xl font-bold font-display text-foreground text-balance">
            {episode.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{episode.titleJp}</p>

          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {episode.airDate}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {episode.duration}
            </span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mt-4">
            {episode.synopsis}
          </p>

          {/* Streaming section */}
          {platforms.length > 0 && (
            <div className="mt-6 pt-5 border-t border-border/50">
              <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
                <MonitorPlay className="h-4 w-4 text-primary" />
                Ver este episodio
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {platforms.map((platform) => (
                  <a
                    key={platform.id}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-secondary/30 hover:border-primary/30 hover:bg-secondary/50 transition-all"
                  >
                    <div
                      className="h-9 w-9 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{ backgroundColor: platform.color, color: platform.textColor }}
                    >
                      {platform.icon}
                    </div>
                    <span className="flex-1 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {platform.name}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
