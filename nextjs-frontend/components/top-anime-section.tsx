"use client"

import { Trophy, ArrowRight } from "lucide-react"
import { getMockAnimes } from "@/lib/mock/anime.mock"
import { AnimeCard } from "./anime-card"

const topAnime = [...getMockAnimes()].sort((a, b) => b.rating - a.rating)

export function TopAnimeSection() {
  return (
    <section id="top-anime" className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-display text-foreground">
                Top Anime
              </h2>
              <p className="text-sm text-muted-foreground">Los mejor valorados por la comunidad</p>
            </div>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top 3 cards */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {topAnime.slice(0, 8).map((anime, i) => (
                <AnimeCard key={anime.id} anime={anime} rank={i + 1} />
              ))}
            </div>
          </div>

          {/* Side list */}
          <div className="bg-card rounded-xl border border-border/50 p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
              Ranking completo
            </h3>
            <div className="flex flex-col gap-1">
              {topAnime.slice(0, 10).map((anime, i) => (
                <AnimeCard key={anime.id} anime={anime} rank={i + 1} variant="compact" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
