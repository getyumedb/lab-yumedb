"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Play, Star, Clock, Info, ChevronLeft, ChevronRight, X } from "lucide-react"
import { getMockAnimes } from "@/lib/mock/anime.mock"
import { animeDetailsMap } from "@/lib/mock/anime-detail.mock"

const allAnime = getMockAnimes()
const featured = [allAnime[0], allAnime[4], allAnime[6], allAnime[9]]

export function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [bgError, setBgError] = useState(false)
  const [trailerOpen, setTrailerOpen] = useState(false)
  const anime = featured[current]

  // Get trailer URL from anime detail data if it exists
  const detail = animeDetailsMap[anime.id]
  const trailerUrl = detail?.trailerUrl

  useEffect(() => {
    setBgError(false)
  }, [current])

  useEffect(() => {
    if (trailerOpen) return // pause auto-advance when trailer open
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featured.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [trailerOpen])

  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        {anime.image && !bgError ? (
          <img
            src={anime.image}
            alt=""
            className="w-full h-full object-cover transition-all duration-700"
            onError={() => setBgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-secondary/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24 lg:py-32">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/20 border border-primary/30 rounded-full text-xs text-primary font-medium mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Destacado de la temporada
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-foreground leading-tight text-balance mb-2">
            {anime.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-4">{anime.titleJp}</p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="flex items-center gap-1.5 text-yellow-500 font-semibold">
              <Star className="h-4 w-4 fill-yellow-500" />
              {anime.rating}
            </span>
            <span className="h-1 w-1 bg-muted-foreground rounded-full" />
            <span className="text-sm text-muted-foreground">{anime.type}</span>
            <span className="h-1 w-1 bg-muted-foreground rounded-full" />
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {anime.episodes} ep.
            </span>
            <span className="h-1 w-1 bg-muted-foreground rounded-full" />
            <span className="text-sm text-muted-foreground">{anime.studio}</span>
            <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-md">
              {anime.status}
            </span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-6">
            {anime.genres.map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-full border border-border/50"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-8 max-w-lg text-pretty">
            {anime.synopsis}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {trailerUrl && (
              <button
                type="button"
                onClick={() => setTrailerOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                <Play className="h-4 w-4 fill-primary-foreground" />
                Ver trailer
              </button>
            )}
            <Link
              href={`/anime/${anime.id}`}
              className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium text-sm hover:bg-secondary/80 transition-colors border border-border/50"
            >
              <Info className="h-4 w-4" />
              Mas info
            </Link>
          </div>
        </div>

        {/* Slide controls */}
        <div className="absolute bottom-6 right-4 md:bottom-8 md:right-8 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrent((prev) => (prev - 1 + featured.length) % featured.length)}
            className="p-2 bg-secondary/80 backdrop-blur-sm text-secondary-foreground rounded-full hover:bg-secondary transition-colors border border-border/50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            {featured.map((_, i) => (
              <button
                type="button"
                key={featured[i].id}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? "w-8 bg-primary" : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/60"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setCurrent((prev) => (prev + 1) % featured.length)}
            className="p-2 bg-secondary/80 backdrop-blur-sm text-secondary-foreground rounded-full hover:bg-secondary transition-colors border border-border/50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Trailer modal */}
      {trailerOpen && trailerUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-border/50">
            <iframe
              src={`${trailerUrl}?autoplay=1`}
              title={`${anime.title} - Trailer`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full"
            />
            <button
              type="button"
              onClick={() => setTrailerOpen(false)}
              className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm text-foreground rounded-full hover:bg-background transition-colors border border-border/50"
              aria-label="Cerrar trailer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
