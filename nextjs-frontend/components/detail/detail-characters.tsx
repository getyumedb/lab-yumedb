"use client"

import { useState } from "react"
import Link from "next/link"
import { Users, ChevronRight, Mic2 } from "lucide-react"
import type { AnimeDetail } from "@/types"
import { NoImagePlaceholder } from "@/components/no-image-placeholder"

export function DetailCharacters({ anime }: { anime: AnimeDetail }) {
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? anime.characters : anime.characters.slice(0, 4)

  return (
    <section className="bg-card rounded-xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="flex items-center gap-2 text-lg font-bold font-display text-foreground">
          <Users className="h-5 w-5 text-primary" />
          Personajes y Voces
        </h2>
        {anime.characters.length > 4 && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            {showAll ? "Mostrar menos" : `Ver todos (${anime.characters.length})`}
            <ChevronRight className={`h-4 w-4 transition-transform ${showAll ? "rotate-90" : ""}`} />
          </button>
        )}
      </div>

      <div className="grid gap-3">
        {displayed.map((char) => (
          <div
            key={char.id}
            className="group flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/30 hover:border-primary/20 hover:bg-secondary/50 transition-all"
          >
            {/* Character - clickable */}
            <Link
              href={`/characters/${char.id}`}
              className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
            >
              <div className="relative h-14 w-14 rounded-lg overflow-hidden shrink-0 border border-border/50 bg-secondary">
                {char.image ? (
                  <img
                    src={char.image}
                    alt={char.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden") }}
                  />
                ) : null}
                <NoImagePlaceholder
                  variant="square"
                  className={`h-full w-full border-0 absolute inset-0 ${char.image ? "hidden" : ""}`}
                  label=""
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {char.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">{char.nameJp}</p>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${
                    char.role === "Principal"
                      ? "bg-primary/15 text-primary"
                      : char.role === "Secundario"
                        ? "bg-chart-2/15 text-chart-2"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {char.role}
                </span>
              </div>
            </Link>

            {/* Voice Actor - clickable */}
            <Link
              href={`/people/${encodeURIComponent(char.voiceActor.name.toLowerCase().replace(/\s+/g, "-"))}`}
              className="flex items-center gap-3 text-right hover:opacity-80 transition-opacity"
            >
              <div className="min-w-0 hidden sm:block">
                <p className="text-sm font-medium text-foreground truncate">{char.voiceActor.name}</p>
                <p className="text-xs text-muted-foreground truncate">{char.voiceActor.nameJp}</p>
                <span className="flex items-center justify-end gap-1 mt-0.5 text-[10px] text-muted-foreground">
                  <Mic2 className="h-2.5 w-2.5" />
                  {char.voiceActor.language}
                </span>
              </div>
              <div className="relative h-14 w-14 rounded-lg overflow-hidden shrink-0 border border-border/50 bg-secondary">
                {char.voiceActor.image ? (
                  <img
                    src={char.voiceActor.image}
                    alt={char.voiceActor.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden") }}
                  />
                ) : null}
                <NoImagePlaceholder
                  variant="square"
                  className={`h-full w-full border-0 absolute inset-0 ${char.voiceActor.image ? "hidden" : ""}`}
                  label=""
                />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
