"use client"

import {
  Star,
  RotateCcw,
  Calendar,
  MessageSquare,
  StickyNote,
  Tv,
  Settings2,
} from "lucide-react"
import { useAnimeUserData } from "@/hooks/use-anime-user-data"

interface DetailUserPanelProps {
  animeId: number
  totalEpisodes?: number
}

export function DetailUserPanel({ animeId, totalEpisodes }: DetailUserPanelProps) {
  const { data, updateData } = useAnimeUserData(animeId)

  return (
    <section className="bg-card rounded-xl border border-border/50 p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold font-display text-foreground mb-5">
        <Settings2 className="h-5 w-5 text-primary" />
        Mis detalles
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Score */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Star className="h-3.5 w-3.5" />
            Valoracion
          </label>
          <select
            value={data.score ?? ""}
            onChange={(e) => updateData({ score: e.target.value ? Number(e.target.value) : null })}
            className="w-full px-3 py-2 text-sm bg-secondary border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50"
          >
            <option value="">Sin valorar</option>
            {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} - {
                  n === 10 ? "Obra maestra" :
                  n === 9 ? "Excelente" :
                  n === 8 ? "Muy bueno" :
                  n === 7 ? "Bueno" :
                  n === 6 ? "Aceptable" :
                  n === 5 ? "Regular" :
                  n === 4 ? "Malo" :
                  n === 3 ? "Muy malo" :
                  n === 2 ? "Horrible" :
                  "Abominable"
                }
              </option>
            ))}
          </select>
        </div>

        {/* Episodes watched */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Tv className="h-3.5 w-3.5" />
            Episodios vistos
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={totalEpisodes || 9999}
              value={data.episodesWatched ?? ""}
              onChange={(e) => updateData({ episodesWatched: e.target.value ? Number(e.target.value) : null })}
              placeholder="0"
              className="flex-1 px-3 py-2 text-sm bg-secondary border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
            />
            {totalEpisodes && (
              <span className="text-xs text-muted-foreground shrink-0">/ {totalEpisodes}</span>
            )}
          </div>
        </div>

        {/* Rewatch count */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <RotateCcw className="h-3.5 w-3.5" />
            Rewatch Count
          </label>
          <input
            type="number"
            min={0}
            value={data.rewatchCount ?? ""}
            onChange={(e) => updateData({ rewatchCount: e.target.value ? Number(e.target.value) : null })}
            placeholder="0"
            className="w-full px-3 py-2 text-sm bg-secondary border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Inicio
            </label>
            <input
              type="date"
              value={data.startDate ?? ""}
              onChange={(e) => updateData({ startDate: e.target.value || null })}
              className="w-full px-3 py-2 text-sm bg-secondary border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Fin
            </label>
            <input
              type="date"
              value={data.endDate ?? ""}
              onChange={(e) => updateData({ endDate: e.target.value || null })}
              className="w-full px-3 py-2 text-sm bg-secondary border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
        </div>

        {/* Comments */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MessageSquare className="h-3.5 w-3.5" />
            Comentarios
          </label>
          <textarea
            value={data.comments ?? ""}
            onChange={(e) => updateData({ comments: e.target.value || null })}
            placeholder="Tus comentarios..."
            rows={2}
            className="w-full px-3 py-2 text-sm bg-secondary border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 resize-none"
          />
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <StickyNote className="h-3.5 w-3.5" />
            Notas
          </label>
          <textarea
            value={data.notes ?? ""}
            onChange={(e) => updateData({ notes: e.target.value || null })}
            placeholder="Notas personales..."
            rows={2}
            className="w-full px-3 py-2 text-sm bg-secondary border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 resize-none"
          />
        </div>
      </div>
    </section>
  )
}
