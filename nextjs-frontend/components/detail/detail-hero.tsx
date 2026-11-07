"use client"

import { useState } from "react"
import {
  Star,
  Clock,
  Calendar,
  Tv,
  Award,
  Users,
  TrendingUp,
  Play,
  CalendarCheck2,
  Building,
  Snowflake,
  Heart,
} from "lucide-react"
import type { AnimeDetail } from "@/types"
import { NoImagePlaceholder } from "@/components/no-image-placeholder"
import { DetailWatchStatus } from "@/components/detail/detail-watch-status"
import { DetailUserPanel } from "@/components/detail/detail-user-panel"
import { StreamingPlatformsDialog } from "@/components/detail/streaming-platforms-dialog"
import { FavoriteButton } from "@/components/favorite-button"
import { ShareButton } from "@/components/share-button"
import { getStreamingForAnime } from "@/lib/streaming-data"

interface DetailHeroProps {
  anime: AnimeDetail
}

export function DetailHero({ anime }: DetailHeroProps) {
  const [posterError, setPosterError] = useState(false)
  const [bannerError, setBannerError] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [streamingOpen, setStreamingOpen] = useState(false)

  const canWatch =
    anime.status === "En emision" ||
    anime.status === "Finalizado" ||
    anime.episodesAired > 0
  const platforms = getStreamingForAnime(anime.licensors)

  return (
    <section className="relative">
      {/* Banner background */}
      <div className="absolute inset-0 h-[500px] md:h-[550px]">
        {anime.bannerImage && !bannerError ? (
          <img
            src={anime.bannerImage}
            alt=""
            className="w-full h-full object-cover"
            onError={() => setBannerError(true)}
          />
        ) : (
          <div className="w-full h-full bg-secondary/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-8 pb-8 md:pt-16">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Poster */}
          <div className="shrink-0 mx-auto md:mx-0">
            <div className="relative w-52 md:w-64 aspect-[3/4] rounded-xl overflow-hidden border-2 border-border/50 shadow-2xl shadow-background/80">
              {anime.image && !posterError ? (
                <img
                  src={anime.image}
                  alt={anime.title}
                  className="w-full h-full object-cover"
                  onError={() => setPosterError(true)}
                />
              ) : (
                <NoImagePlaceholder variant="portrait" className="h-full w-full" />
              )}
              {anime.status === "En emision" && (
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-primary-foreground rounded-md text-xs font-bold uppercase tracking-wider">
                  En emision
                </div>
              )}
            </div>

            {/* Watch status + edit details button */}
            <div className="mt-3 w-52 md:w-64">
              <DetailWatchStatus
                animeId={anime.id}
                totalEpisodes={anime.episodes}
                onTogglePanel={() => setPanelOpen(!panelOpen)}
                panelOpen={panelOpen}
              />
            </div>

            {/* Quick actions below poster */}
            <div className="flex items-center gap-2 mt-2 w-52 md:w-64">
              <FavoriteButton className="flex-1" />
              <ShareButton title={anime.title} path={`/anime/${anime.id}`} />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 md:pt-6">
            {/* Type badge + Watch Now */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="px-2.5 py-1 text-xs font-bold bg-primary/20 text-primary rounded-md uppercase tracking-wide">
                {anime.type}
              </span>
              <span className="px-2.5 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-md">
                {anime.ageRating}
              </span>
              <span className="px-2.5 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-md">
                {anime.source}
              </span>
              {canWatch && (
                <button
                  type="button"
                  onClick={() => setStreamingOpen(true)}
                  className="sm:ml-auto flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors w-full sm:w-auto"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Ver ahora
                </button>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-display text-foreground text-balance leading-tight">
              {anime.title}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mt-1 font-display">
              {anime.titleJp}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground/70 mt-0.5">
              {anime.titleEn} ({anime.titleRomaji})
            </p>

            {/* Score section */}
            <div className="flex flex-wrap items-center gap-4 mt-5 py-5 border-y border-border/50">
              {/* Main score */}
              <div className="flex items-center gap-3 px-4 py-2.5 bg-card rounded-xl border border-border/50">
                <div className="flex items-center gap-1.5">
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  <span className="text-2xl font-bold text-foreground font-display">
                    {anime.rating}
                  </span>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">
                    {anime.ratingCount.toLocaleString()}
                  </p>
                  <p>valoraciones</p>
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 px-2.5 py-1 sm:px-0 sm:py-0 bg-secondary/50 sm:bg-transparent rounded-md">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span>
                    #{anime.ranked}{" "}
                    <span className="text-muted-foreground/60">ranking</span>
                  </span>
                </span>
                <span className="hidden sm:block h-1 w-1 bg-muted-foreground/40 rounded-full" />
                <span className="flex items-center gap-1.5 px-2.5 py-1 sm:px-0 sm:py-0 bg-secondary/50 sm:bg-transparent rounded-md">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>
                    #{anime.popularity}{" "}
                    <span className="text-muted-foreground/60">
                      popularidad
                    </span>
                  </span>
                </span>
                <span className="hidden sm:block h-1 w-1 bg-muted-foreground/40 rounded-full" />
                <span className="flex items-center gap-1.5 px-2.5 py-1 sm:px-0 sm:py-0 bg-secondary/50 sm:bg-transparent rounded-md">
                  <Heart className="h-4 w-4" />
                  <span>{anime.favorites.toLocaleString()} favoritos</span>
                </span>
              </div>
            </div>

            {/* Metadata grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <Tv className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-muted-foreground">Episodios: </span>
                  <span className="text-foreground font-medium">
                    {anime.episodesAired}/{anime.episodes}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-muted-foreground">Duracion: </span>
                  <span className="text-foreground font-medium">
                    {anime.duration}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-muted-foreground">Emision: </span>
                  <span className="text-foreground font-medium">
                    {anime.broadcast}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CalendarCheck2 className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-muted-foreground">Estreno: </span>
                  <span className="text-foreground font-medium">
                    {anime.aired.from}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-muted-foreground">Studio: </span>
                  <span className="text-primary font-medium">{anime.studio}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Snowflake className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-muted-foreground">Temporada: </span>
                  <span className="text-foreground font-medium">
                    {anime.premiered}
                  </span>
                </div>
              </div>
            </div>

            {/* Genres + Watch Now button */}
            <div className="flex flex-wrap items-center gap-2 mt-5">
              {anime.genres.map((genre) => (
                <a
                  key={genre}
                  href="#"
                  className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  {genre}
                </a>
              ))}
              {anime.themes.map((theme) => (
                <span
                  key={theme}
                  className="px-3 py-1.5 text-xs bg-secondary text-secondary-foreground rounded-full border border-border/50"
                >
                  {theme}
                </span>
              ))}
              {anime.demographics.map((demo) => (
                <span
                  key={demo}
                  className="px-3 py-1.5 text-xs bg-secondary text-secondary-foreground rounded-full border border-border/50"
                >
                  {demo}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* User management panel - appears below hero, above content */}
        {panelOpen && (
          <div className="mt-6">
            <DetailUserPanel animeId={anime.id} totalEpisodes={anime.episodes} />
          </div>
        )}
      </div>

      {/* Streaming platforms dialog */}
      <StreamingPlatformsDialog
        open={streamingOpen}
        onClose={() => setStreamingOpen(false)}
        animeTitle={anime.title}
        platforms={platforms}
      />
    </section>
  )
}
