"use client"

import { useState, useEffect, useCallback } from "react"
import { ImageIcon, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import type { AnimeDetail } from "@/types"
import { ImageWithFallback } from "@/components/image-with-fallback"

const INITIAL_VISIBLE = 8

export function DetailGallery({ anime }: { anime: AnimeDetail }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)

  const totalScreenshots = anime.screenshots.length
  const visibleScreenshots = showAll
    ? anime.screenshots
    : anime.screenshots.slice(0, INITIAL_VISIBLE)
  const hiddenCount = totalScreenshots - INITIAL_VISIBLE

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev - 1 + totalScreenshots) % totalScreenshots : null
    )
  }, [totalScreenshots])

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % totalScreenshots : null
    )
  }, [totalScreenshots])

  const handleClose = useCallback(() => setSelectedIndex(null), [])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (selectedIndex === null) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose()
      if (e.key === "ArrowLeft") handlePrev()
      if (e.key === "ArrowRight") handleNext()
    }
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", handleKey)
    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", handleKey)
    }
  }, [selectedIndex, handleClose, handlePrev, handleNext])

  return (
    <section className="bg-card rounded-xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="flex items-center gap-2 text-lg font-bold font-display text-foreground">
          <ImageIcon className="h-5 w-5 text-primary" />
          Galeria y Screenshots
        </h2>
        <span className="text-xs text-muted-foreground">
          {totalScreenshots} {totalScreenshots === 1 ? "imagen" : "imagenes"}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {visibleScreenshots.map((src, i) => (
          <button
            type="button"
            key={`${src}-${i}`}
            onClick={() => setSelectedIndex(i)}
            className="group relative aspect-video rounded-lg overflow-hidden border border-border/30 hover:border-primary/30 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <ImageWithFallback
              src={src}
              alt={`Screenshot ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              placeholderVariant="landscape"
              placeholderClassName="h-full w-full"
              placeholderLabel=""
            />
            <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors flex items-center justify-center">
              <Maximize2 className="h-5 w-5 text-foreground opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
            </div>
          </button>
        ))}

        {/* "Show more" tile */}
        {!showAll && hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="aspect-video rounded-lg border border-border/30 hover:border-primary/30 bg-secondary/30 flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <span className="text-lg font-bold text-foreground">+{hiddenCount}</span>
            <span className="text-xs text-muted-foreground">Ver todas</span>
          </button>
        )}
      </div>

      {showAll && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(false)}
          className="mt-3 w-full py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-secondary/30 hover:bg-secondary/50 rounded-lg border border-border/50 transition-colors"
        >
          Mostrar menos
        </button>
      )}

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm"
          onClick={handleClose}
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors z-10"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>

          {totalScreenshots > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handlePrev() }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-secondary/80 text-secondary-foreground rounded-full hover:bg-secondary transition-colors z-10"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          <div
            className="max-w-5xl w-full mx-4 sm:mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <ImageWithFallback
              src={anime.screenshots[selectedIndex]}
              alt={`Screenshot ${selectedIndex + 1}`}
              className="w-full max-h-[80vh] object-contain rounded-xl border border-border"
              placeholderVariant="landscape"
              placeholderClassName="w-full"
              placeholderLabel=""
            />
            <div className="flex items-center justify-center gap-3 mt-3">
              <p className="text-sm text-muted-foreground">
                {selectedIndex + 1} / {totalScreenshots}
              </p>
            </div>

            {/* Thumbnail strip */}
            {totalScreenshots > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-3 overflow-x-auto py-1 max-w-full">
                {anime.screenshots.map((thumb, i) => (
                  <button
                    key={`thumb-${i}`}
                    type="button"
                    onClick={() => setSelectedIndex(i)}
                    className={`shrink-0 h-12 w-20 rounded-md overflow-hidden border-2 transition-all ${
                      i === selectedIndex
                        ? "border-primary opacity-100 scale-105"
                        : "border-transparent opacity-50 hover:opacity-80"
                    }`}
                  >
                    <ImageWithFallback
                      src={thumb}
                      alt=""
                      className="w-full h-full object-cover"
                      placeholderVariant="landscape"
                      placeholderClassName="w-full h-full"
                      placeholderLabel=""
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {totalScreenshots > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleNext() }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-secondary/80 text-secondary-foreground rounded-full hover:bg-secondary transition-colors z-10"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      )}
    </section>
  )
}
