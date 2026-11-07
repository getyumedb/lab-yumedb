"use client"

import { useEffect, useState, useCallback } from "react"
import { createPortal } from "react-dom"
import type { AnimeListItem } from "@/types"
import { NoImagePlaceholder } from "@/components/no-image-placeholder"
import {
  Star,
  X,
  Eye,
  CheckCircle2,
  PauseCircle,
  XCircle,
  Clock,
  RotateCcw,
  Calendar,
  MessageSquare,
  StickyNote,
  Tv,
  Check,
  Save,
} from "lucide-react"
import { useAnimeStatus, WATCH_STATUS_OPTIONS, type AnimeWatchStatus } from "@/hooks/use-anime-status"
import { useAnimeUserData } from "@/hooks/use-anime-user-data"
import { useAuth } from "@/lib/auth-context"
import { ListIcon } from "@/lib/list-icons"
import { toast } from "sonner"

const statusIcons: Record<Exclude<AnimeWatchStatus, null>, typeof Clock> = {
  watching: Eye,
  completed: CheckCircle2,
  on_hold: PauseCircle,
  dropped: XCircle,
  plan_to_watch: Clock,
}

const statusColors: Record<Exclude<AnimeWatchStatus, null>, string> = {
  watching: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  completed: "bg-chart-5/15 text-chart-5 border-chart-5/30",
  on_hold: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  dropped: "bg-destructive/15 text-destructive border-destructive/30",
  plan_to_watch: "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30",
}

interface AnimeEditModalProps {
  anime: AnimeListItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AnimeEditModal({ anime, open, onOpenChange }: AnimeEditModalProps) {
  const [imgError, setImgError] = useState(false)
  const showImage = anime.image && !imgError
  const { status, updateStatus, toggleCustomList, isInCustomList } = useAnimeStatus(anime.id)
  const { data, updateData } = useAnimeUserData(anime.id)
  const { user, isAuthenticated } = useAuth()
  const customLists = (isAuthenticated && user?.customLists) || []

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  const handleSave = useCallback(() => {
    onOpenChange(false)
    toast.success("Cambios guardados", {
      description: `Progreso de ${anime.title} actualizado`,
    })
  }, [onOpenChange, anime.title])

  if (!open || typeof document === "undefined") return null

  const modalBody = (
    <>
      {/* Header with anime info */}
      <div className="flex gap-3 sm:gap-4 p-4 sm:p-6 pb-3 sm:pb-4 border-b border-border/50">
        <div className="relative h-24 w-16 sm:h-28 sm:w-20 rounded-lg overflow-hidden shrink-0 bg-secondary">
          {showImage ? (
            <img src={anime.image} alt={anime.title} className="h-full w-full object-cover" onError={() => setImgError(true)} />
          ) : (
            <NoImagePlaceholder variant="portrait" className="h-full w-full" label="" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-foreground text-left line-clamp-2">{anime.title}</h2>
          <p className="text-xs text-muted-foreground text-left mt-0.5">{anime.titleJp}</p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="flex items-center gap-1 text-sm text-yellow-500 font-semibold">
              <Star className="h-3.5 w-3.5 fill-yellow-500" />{anime.rating}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded">{anime.type}</span>
            <span className="text-xs text-muted-foreground">{anime.episodes} episodios</span>
          </div>
        </div>
      </div>

      {/* Watch status selector */}
      <div className="px-4 sm:px-6 pt-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Estado</p>
        <div className="flex flex-wrap gap-1.5">
          {WATCH_STATUS_OPTIONS.map(({ value, label }) => {
            const Icon = statusIcons[value]
            const isActive = status === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => updateStatus(isActive ? null : value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  isActive
                    ? statusColors[value]
                    : "bg-secondary/50 text-muted-foreground border-border/50 hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "fill-current" : ""}`} />
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* User data fields */}
      <div className="px-4 sm:px-6 pt-4 pb-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Star className="h-3.5 w-3.5" />Valoracion
            </label>
            <select
              value={data.score ?? ""}
              onChange={(e) => updateData({ score: e.target.value ? Number(e.target.value) : null })}
              className="w-full px-3 py-2 text-sm bg-secondary border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50"
            >
              <option value="">Sin valorar</option>
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} - {n === 10 ? "Obra maestra" : n === 9 ? "Excelente" : n === 8 ? "Muy bueno" : n === 7 ? "Bueno" : n === 6 ? "Aceptable" : n === 5 ? "Regular" : n === 4 ? "Malo" : n === 3 ? "Muy malo" : n === 2 ? "Horrible" : "Abominable"}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Tv className="h-3.5 w-3.5" />Episodios vistos
            </label>
            <div className="flex items-center gap-2">
              <input type="number" min={0} max={anime.episodes || 9999} value={data.episodesWatched ?? ""} onChange={(e) => updateData({ episodesWatched: e.target.value ? Number(e.target.value) : null })} placeholder="0" className="flex-1 px-3 py-2 text-sm bg-secondary border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50" />
              {anime.episodes > 0 && <span className="text-xs text-muted-foreground shrink-0">/ {anime.episodes}</span>}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <RotateCcw className="h-3.5 w-3.5" />Rewatches
            </label>
            <input type="number" min={0} value={data.rewatchCount ?? ""} onChange={(e) => updateData({ rewatchCount: e.target.value ? Number(e.target.value) : null })} placeholder="0" className="w-full px-3 py-2 text-sm bg-secondary border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />Inicio
              </label>
              <input type="date" value={data.startDate ?? ""} onChange={(e) => updateData({ startDate: e.target.value || null })} className="w-full px-2 py-2 text-sm bg-secondary border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />Fin
              </label>
              <input type="date" value={data.endDate ?? ""} onChange={(e) => updateData({ endDate: e.target.value || null })} className="w-full px-2 py-2 text-sm bg-secondary border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <MessageSquare className="h-3.5 w-3.5" />Comentarios
            </label>
            <textarea value={data.comments ?? ""} onChange={(e) => updateData({ comments: e.target.value || null })} placeholder="Tus comentarios..." rows={2} className="w-full px-3 py-2 text-sm bg-secondary border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 resize-none" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <StickyNote className="h-3.5 w-3.5" />Notas
            </label>
            <textarea value={data.notes ?? ""} onChange={(e) => updateData({ notes: e.target.value || null })} placeholder="Notas personales..." rows={2} className="w-full px-3 py-2 text-sm bg-secondary border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 resize-none" />
          </div>
        </div>
      </div>

      {/* Custom lists */}
      {customLists.length > 0 && (
        <div className="px-4 sm:px-6 pt-3 pb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Listas personalizadas</p>
          <div className="flex flex-col gap-1">
            {customLists.map((cl) => {
              const active = isInCustomList(cl.id)
              return (
                <button
                  key={cl.id}
                  type="button"
                  onClick={() => toggleCustomList(cl.id)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors hover:bg-secondary/50 text-left"
                >
                  <div className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors ${active ? "border-primary bg-primary" : "border-border bg-secondary/50"}`}>
                    {active && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  <ListIcon iconName={cl.icon} color={cl.color} className="h-4 w-4 shrink-0" />
                  <span className={`truncate ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}>{cl.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Save button */}
      <div className="sticky bottom-0 px-4 sm:px-6 py-4 border-t border-border/50 bg-card">
        <button
          type="button"
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Save className="h-4 w-4" />
          Guardar cambios
        </button>
      </div>
    </>
  )

  return createPortal(
    <div className="fixed inset-0 z-[9999]" onClick={() => onOpenChange(false)}>
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />

      {/* Mobile: bottom sheet */}
      <div
        className="sm:hidden absolute bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-muted-foreground/20 rounded-full" />
        </div>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground z-10"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex-1 overflow-y-auto min-h-0">{modalBody}</div>
      </div>

      {/* Desktop: centered dialog */}
      <div
        className="hidden sm:flex absolute inset-0 items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative bg-card border border-border rounded-xl shadow-2xl shadow-background/80 w-full max-w-2xl max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground z-10"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex-1 overflow-y-auto min-h-0 rounded-xl">{modalBody}</div>
        </div>
      </div>
    </div>,
    document.body
  )
}
