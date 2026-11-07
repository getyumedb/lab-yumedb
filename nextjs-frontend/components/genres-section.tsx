"use client"

import React from "react"

import { Layers, Swords, Heart, Rocket, Ghost, Laugh, Medal, Wand2, Compass, Drama } from "lucide-react"
import { genres, getMockAnimes } from "@/lib/mock/anime.mock"

const genreIcons: Record<string, React.ReactNode> = {
  Accion: <Swords className="h-5 w-5" />,
  Aventura: <Compass className="h-5 w-5" />,
  Comedia: <Laugh className="h-5 w-5" />,
  Drama: <Drama className="h-5 w-5" />,
  Fantasia: <Wand2 className="h-5 w-5" />,
  Magia: <Wand2 className="h-5 w-5" />,
  Mecha: <Rocket className="h-5 w-5" />,
  Misterio: <Ghost className="h-5 w-5" />,
  Romance: <Heart className="h-5 w-5" />,
  "Sci-Fi": <Rocket className="h-5 w-5" />,
  Shounen: <Swords className="h-5 w-5" />,
  Seinen: <Ghost className="h-5 w-5" />,
  Deportes: <Medal className="h-5 w-5" />,
  Thriller: <Ghost className="h-5 w-5" />,
  "Slice of Life": <Heart className="h-5 w-5" />,
  Historico: <Compass className="h-5 w-5" />,
  Escolar: <Laugh className="h-5 w-5" />,
}

const genreColors: Record<string, string> = {
  Accion: "from-red-500/20 to-orange-500/10 text-red-400 border-red-500/20",
  Aventura: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/20",
  Comedia: "from-yellow-500/20 to-amber-500/10 text-yellow-400 border-yellow-500/20",
  Drama: "from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/20",
  Fantasia: "from-fuchsia-500/20 to-pink-500/10 text-fuchsia-400 border-fuchsia-500/20",
  Magia: "from-fuchsia-500/20 to-pink-500/10 text-fuchsia-400 border-fuchsia-500/20",
  Mecha: "from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/20",
  Misterio: "from-slate-500/20 to-gray-500/10 text-slate-400 border-slate-500/20",
  Romance: "from-pink-500/20 to-rose-500/10 text-pink-400 border-pink-500/20",
  "Sci-Fi": "from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/20",
  Shounen: "from-orange-500/20 to-red-500/10 text-orange-400 border-orange-500/20",
  Seinen: "from-slate-500/20 to-gray-500/10 text-slate-400 border-slate-500/20",
  Deportes: "from-green-500/20 to-emerald-500/10 text-green-400 border-green-500/20",
  Thriller: "from-red-500/20 to-rose-500/10 text-red-400 border-red-500/20",
  "Slice of Life": "from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/20",
  Historico: "from-amber-700/20 to-yellow-700/10 text-amber-600 border-amber-700/20",
  Escolar: "from-sky-500/20 to-blue-500/10 text-sky-400 border-sky-500/20",
}

export function GenresSection() {
  const topGenres = genres.slice(0, 12)

  return (
    <section id="generos" className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold font-display text-foreground">
              Explorar por genero
            </h2>
            <p className="text-sm text-muted-foreground">
              Encuentra anime segun tus generos favoritos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {topGenres.map((genre) => {
            const count = getMockAnimes().filter((a) => a.genres.includes(genre)).length
            return (
              <button
                type="button"
                key={genre}
                className={`group relative flex flex-col items-center gap-2 p-5 rounded-xl bg-gradient-to-br border transition-all hover:scale-[1.02] hover:shadow-lg ${genreColors[genre] || "from-muted to-muted/50 text-muted-foreground border-border"}`}
              >
                <span className="transition-transform group-hover:scale-110">
                  {genreIcons[genre] || <Layers className="h-5 w-5" />}
                </span>
                <span className="text-sm font-semibold text-foreground">{genre}</span>
                <span className="text-xs opacity-70">{count} anime{count !== 1 ? "s" : ""}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
