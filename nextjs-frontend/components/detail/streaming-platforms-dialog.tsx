"use client"

import { useEffect, useRef } from "react"
import { X, ExternalLink, Play } from "lucide-react"
import { streamingPlatforms, type StreamingPlatform } from "@/lib/streaming-data"

interface StreamingPlatformsDialogProps {
  open: boolean
  onClose: () => void
  animeTitle: string
  platforms?: StreamingPlatform[]
}

export function StreamingPlatformsDialog({
  open,
  onClose,
  animeTitle,
  platforms,
}: StreamingPlatformsDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const displayPlatforms = platforms ?? streamingPlatforms

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

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Plataformas de streaming para ${animeTitle}`}
    >
      <div className="w-full max-w-lg bg-card rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Play className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground font-display">
                Ver ahora
              </h2>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {animeTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Platforms grid */}
        <div className="p-5">
          <p className="text-sm text-muted-foreground mb-4">
            Disponible en las siguientes plataformas:
          </p>
          <div className="flex flex-col gap-3">
            {displayPlatforms.map((platform) => (
              <a
                key={platform.id}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-secondary/30 hover:border-primary/30 hover:bg-secondary/50 transition-all"
              >
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ backgroundColor: platform.color, color: platform.textColor }}
                >
                  {platform.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {platform.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Streaming disponible
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
