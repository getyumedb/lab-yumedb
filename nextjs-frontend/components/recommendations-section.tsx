"use client"

import { Sparkles } from "lucide-react"
import { getMockAnimes } from "@/lib/mock/anime.mock"
import { AnimeCard } from "./anime-card"

const allAnime = getMockAnimes()
const recommendations = [allAnime[9], allAnime[11], allAnime[1], allAnime[8]]

export function RecommendationsSection() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold font-display text-foreground">
              Recomendados para ti
            </h2>
            <p className="text-sm text-muted-foreground">
              Basado en tus gustos y preferencias
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} variant="wide" />
          ))}
        </div>
      </div>
    </section>
  )
}
