"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react"
import type { AnimeDetail } from "@/types"

export function DetailSynopsis({ anime }: { anime: AnimeDetail }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="bg-card rounded-xl border border-border/50 p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold font-display text-foreground mb-4">
        <BookOpen className="h-5 w-5 text-primary" />
        Sinopsis
      </h2>

      <div className="relative">
        <div
          className={`text-sm text-muted-foreground leading-relaxed whitespace-pre-line ${!expanded ? "line-clamp-4" : ""
            }`}
        >
          {anime.synopsis}
        </div>
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card to-transparent" />
        )}
      </div>

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 mt-3 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
      >
        {expanded ? (
          <>
            Leer menos <ChevronUp className="h-4 w-4" />
          </>
        ) : (
          <>
            Leer mas <ChevronDown className="h-4 w-4" />
          </>
        )}
      </button>

      {/* Background info */}
      {anime.background && (
        <div className="mt-6 pt-6 border-t border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            Informacion adicional
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {anime.background}
          </p>
        </div>
      )}


    </section>
  )
}
