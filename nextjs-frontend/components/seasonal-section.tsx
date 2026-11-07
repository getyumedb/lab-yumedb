"use client"

import React from "react"

import { useState } from "react"
import { Calendar, Snowflake, Sun, Leaf, Flower } from "lucide-react"
import { getMockAnimes, seasons } from "@/lib/mock/anime.mock"
import { AnimeCard } from "./anime-card"

const seasonIcons: Record<string, React.ReactNode> = {
  "Invierno 2026": <Snowflake className="h-4 w-4" />,
  "Otono 2025": <Leaf className="h-4 w-4" />,
  "Verano 2025": <Sun className="h-4 w-4" />,
  "Primavera 2025": <Flower className="h-4 w-4" />,
}

function getSeasonAnime(season: string) {
  const [seasonName, yearStr] = season.split(" ");
  const parsedYear = parseInt(yearStr, 10);
  const year = isNaN(parsedYear) ? 2026 : parsedYear;

  return getMockAnimes().filter(
    (a) => a.season === seasonName && a.year === year
  );
}

export function SeasonalSection() {
  const [activeSeason, setActiveSeason] = useState(seasons[0])
  const filtered = getSeasonAnime(activeSeason)

  return (
    <section id="temporada" className="py-12 bg-card/50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold font-display text-foreground">
              Anime por temporada
            </h2>
            <p className="text-sm text-muted-foreground">
              Explora los estrenos de cada temporada
            </p>
          </div>
        </div>

        {/* Season tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
          {seasons.map((season) => (
            <button
              type="button"
              key={season}
              onClick={() => setActiveSeason(season)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeSeason === season
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50"
                }`}
            >
              {seasonIcons[season]}
              {season}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-secondary/30 rounded-xl border border-border/50">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">
              No hay animes registrados para esta temporada aun.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
