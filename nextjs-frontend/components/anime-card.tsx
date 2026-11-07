"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  Star,
  Play,
  Bookmark,
  Eye,
  CheckCircle2,
  PauseCircle,
  XCircle,
  Clock,
  Settings2,
  Tv,
  Film,
  X,
  Info,
  ChevronDown,
} from "lucide-react"
import type { AnimeListItem } from "@/types"
import { NoImagePlaceholder } from "@/components/no-image-placeholder"
import { FavoriteButton } from "@/components/favorite-button"
import { useAnimeStatus, WATCH_STATUS_OPTIONS, type AnimeWatchStatus } from "@/hooks/use-anime-status"
import { useTitleLanguage } from "@/lib/title-language"
import { AnimeEditModal } from "@/components/anime-edit-modal"

const statusIcons: Record<Exclude<AnimeWatchStatus, null>, typeof Clock> = {
  watching: Eye,
  completed: CheckCircle2,
  on_hold: PauseCircle,
  dropped: XCircle,
  plan_to_watch: Clock,
}

const statusColors: Record<Exclude<AnimeWatchStatus, null>, string> = {
  watching: "text-chart-2",
  completed: "text-chart-5",
  on_hold: "text-chart-3",
  dropped: "text-destructive",
  plan_to_watch: "text-muted-foreground",
}

/* -- AddToListDropdown: inline dropdown with smart positioning -- */

function AddToListDropdown({ animeId }: { animeId: number }) {
  const { status, toggleStatus } = useAnimeStatus(animeId)
  const [open, setOpen] = useState(false)
  const [openUpward, setOpenUpward] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleKey)
    }
  }, [open])

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      // Open upward if there's enough space above, otherwise downward
      setOpenUpward(rect.top > 220)
    }
    setOpen((v) => !v)
  }, [open])

  const ActiveIcon = status ? statusIcons[status] : Bookmark
  const statusLabel = status ? WATCH_STATUS_OPTIONS.find((o) => o.value === status)?.label : "Anadir a lista"

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={statusLabel}
        className={`p-1.5 backdrop-blur-sm rounded-md transition-colors ${status
          ? `bg-background/90 ${statusColors[status]}`
          : "bg-secondary/90 text-secondary-foreground hover:bg-secondary"
          }`}
      >
        <ActiveIcon className={`h-3.5 w-3.5 ${status ? "fill-current" : ""}`} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Estado de seguimiento"
          className={`absolute right-0 z-50 w-40 bg-card border border-border rounded-lg shadow-xl shadow-background/80 py-1 animate-in fade-in-0 zoom-in-95 duration-150 ${openUpward ? "bottom-full mb-1" : "top-full mt-1"
            }`}
        >
          {WATCH_STATUS_OPTIONS.map(({ value, label }) => {
            const Icon = statusIcons[value]
            const isActive = status === value
            return (
              <button
                key={value}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleStatus(value)
                  setOpen(false)
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors ${isActive
                  ? `${statusColors[value]} bg-primary/5 font-medium`
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
              >
                <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? "fill-current" : ""}`} />
                {label}
                {isActive && <CheckCircle2 className="h-3 w-3 ml-auto shrink-0" />}
              </button>
            )
          })}
          {status && (
            <>
              <div className="border-t border-border/50 my-1" />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleStatus(status)
                  setOpen(false)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left text-destructive hover:bg-destructive/5 transition-colors"
              >
                <XCircle className="h-3.5 w-3.5 shrink-0" />
                Quitar de lista
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

/* -- StatusBadge -- */

const statusBgColors: Record<Exclude<AnimeWatchStatus, null>, string> = {
  watching: "bg-chart-2/15 border-chart-2/30",
  completed: "bg-chart-5/15 border-chart-5/30",
  on_hold: "bg-chart-3/15 border-chart-3/30",
  dropped: "bg-destructive/15 border-destructive/30",
  plan_to_watch: "bg-muted-foreground/15 border-muted-foreground/30",
}

function StatusBadge({ animeId, size = "sm" }: { animeId: number; size?: "sm" | "xs" }) {
  const { status } = useAnimeStatus(animeId)
  if (!status) return null
  const Icon = statusIcons[status]
  const label = WATCH_STATUS_OPTIONS.find((o) => o.value === status)?.label
  if (size === "xs") {
    return (
      <span className={`inline-flex items-center gap-1 ${statusColors[status]}`} title={label}>
        <Icon className="h-3 w-3 fill-current" />
      </span>
    )
  }
  return (
    <div
      className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm border ${statusBgColors[status]} ${statusColors[status]}`}
    >
      <Icon className="h-3 w-3 fill-current" />
      <span className="hidden sm:inline">{label}</span>
    </div>
  )
}

/* -- HoverCardBody -- */

function HoverCardBody({
  anime,
  onOpenModal,
}: {
  anime: AnimeListItem
  onOpenModal: () => void
}) {
  const { getTitle } = useTitleLanguage()
  const { primary, secondary } = getTitle(anime)
  const TypeIcon = anime.type === "Pelicula" ? Film : Tv

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h4 className="text-sm font-bold text-foreground line-clamp-2 text-balance">{primary}</h4>
        {secondary && <p className="text-[11px] text-muted-foreground mt-0.5">{secondary}</p>}
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{anime.synopsis}</p>
      <div className="flex flex-wrap gap-1">
        {anime.genres.slice(0, 4).map((g) => (
          <span key={g} className="px-1.5 py-0.5 text-[10px] font-medium bg-secondary text-secondary-foreground rounded">
            {g}
          </span>
        ))}
        {anime.genres.length > 4 && (
          <span className="px-1.5 py-0.5 text-[10px] text-muted-foreground">+{anime.genres.length - 4}</span>
        )}
      </div>
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1"><TypeIcon className="h-3 w-3" />{anime.type}</span>
        <span>{anime.episodes} ep.</span>
        <span>{anime.year}</span>
        <span className="flex items-center gap-1 text-yellow-500 font-semibold ml-auto">
          <Star className="h-3 w-3 fill-yellow-500" />{anime.rating}
        </span>
      </div>
      <div className="border-t border-border/50 pt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onOpenModal()
          }}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg transition-colors"
        >
          <Settings2 className="h-3 w-3" />
          Editar
        </button>
        <Link
          href={`/anime/${anime.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Play className="h-3 w-3 fill-primary-foreground" />
          Ver detalle
        </Link>
      </div>
    </div>
  )
}

/* -- MobileInfoSheet -- */

function MobileInfoSheet({
  anime,
  open,
  onClose,
  onOpenModal,
}: {
  anime: AnimeListItem
  open: boolean
  onClose: () => void
  onOpenModal: () => void
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9998]" onClick={onClose}>
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      <div
        className="absolute bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-2xl max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-muted-foreground/20 rounded-full" />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="p-4 pt-2">
          <HoverCardBody anime={anime} onOpenModal={() => { onClose(); onOpenModal() }} />
        </div>
      </div>
    </div>
  )
}

/* -- DesktopHoverCard: lazy-mounted only on non-touch devices -- */

function DesktopHoverCard({
  anime,
  cardContent,
  onOpenModal,
}: {
  anime: AnimeListItem
  cardContent: React.ReactNode
  onOpenModal: () => void
}) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [position, setPosition] = useState<{ side: "left" | "right"; verticalOffset: number }>({ side: "right", verticalOffset: 0 })
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const TOOLTIP_WIDTH = 288 // w-72
  const TOOLTIP_HEIGHT_ESTIMATE = 320
  const GAP = 8

  const computePosition = useCallback(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight

    // Decide side: prefer right, fallback to left
    const spaceRight = vw - rect.right - GAP
    const spaceLeft = rect.left - GAP
    const side: "left" | "right" = spaceRight >= TOOLTIP_WIDTH ? "right" : spaceLeft >= TOOLTIP_WIDTH ? "left" : "right"

    // Vertical: clamp so it doesn't overflow top/bottom
    let verticalOffset = 0
    const tooltipBottom = rect.top + TOOLTIP_HEIGHT_ESTIMATE
    if (tooltipBottom > vh - 16) {
      verticalOffset = vh - 16 - tooltipBottom
    }
    if (rect.top + verticalOffset < 16) {
      verticalOffset = 16 - rect.top
    }

    setPosition({ side, verticalOffset })
  }, [])

  const openCard = useCallback(() => {
    if (closeTimeout.current) { clearTimeout(closeTimeout.current); closeTimeout.current = null }
    hoverTimeout.current = setTimeout(() => {
      computePosition()
      setShowTooltip(true)
    }, 350)
  }, [computePosition])

  const closeCard = useCallback(() => {
    if (hoverTimeout.current) { clearTimeout(hoverTimeout.current); hoverTimeout.current = null }
    closeTimeout.current = setTimeout(() => setShowTooltip(false), 150)
  }, [])

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
      if (closeTimeout.current) clearTimeout(closeTimeout.current)
    }
  }, [])

  const tooltipStyle: React.CSSProperties = {
    top: position.verticalOffset,
    ...(position.side === "right"
      ? { left: "100%", marginLeft: GAP }
      : { right: "100%", marginRight: GAP }),
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openCard}
      onMouseLeave={closeCard}
    >
      <Link href={`/anime/${anime.id}`} className="group relative flex flex-col text-left">
        {cardContent}
      </Link>

      {showTooltip && (
        <div
          style={tooltipStyle}
          className="absolute z-50 w-72 p-4 rounded-md border border-border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 duration-150"
          onMouseEnter={() => { if (closeTimeout.current) { clearTimeout(closeTimeout.current); closeTimeout.current = null } }}
          onMouseLeave={closeCard}
        >
          <HoverCardBody anime={anime} onOpenModal={onOpenModal} />
        </div>
      )}
    </div>
  )
}

/* -- AnimeCard -- */

interface AnimeCardProps {
  anime: AnimeListItem
  rank?: number
  variant?: "default" | "compact" | "wide"
  onWatch?: (id: number) => void
}

export function AnimeCard({ anime, rank, variant = "default", onWatch }: AnimeCardProps) {
  const [imgError, setImgError] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const { getTitle } = useTitleLanguage()
  const showImage = anime.image && !imgError
  const { primary, secondary } = getTitle(anime)

  const handleOpenModal = useCallback(() => setEditModalOpen(true), [])

  // Detect desktop only after mount to avoid SSR mismatch and the infinite loop
  useEffect(() => {
    setIsMounted(true)
    const mql = window.matchMedia("(min-width: 768px)")
    setIsDesktop(mql.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])

  if (variant === "compact") {
    return (
      <Link
        href={`/anime/${anime.id}`}
        className="group flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors w-full text-left"
      >
        {rank != null && (
          <span className="text-2xl font-bold font-display text-muted-foreground/30 w-8 text-center shrink-0">
            {rank}
          </span>
        )}
        <div className="relative h-16 w-12 rounded-md overflow-hidden shrink-0 bg-secondary">
          {showImage ? (
            <img src={anime.image} alt={primary} className="h-full w-full object-cover" onError={() => setImgError(true)} />
          ) : (
            <NoImagePlaceholder variant="portrait" className="h-full w-full text-[8px]" label="" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{primary}</p>
            <StatusBadge animeId={anime.id} size="xs" />
          </div>
          {secondary && <p className="text-xs text-muted-foreground truncate">{secondary}</p>}
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-1 text-xs text-yellow-500"><Star className="h-3 w-3 fill-yellow-500" />{anime.rating}</span>
            <span className="text-xs text-muted-foreground">{anime.episodes} ep.</span>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === "wide") {
    return (
      <Link
        href={`/anime/${anime.id}`}
        className="group relative flex gap-4 p-3 bg-card rounded-xl border border-border/50 hover:border-primary/30 transition-all w-full text-left"
      >
        <div className="relative h-28 w-20 rounded-lg overflow-hidden shrink-0 bg-secondary">
          {showImage ? (
            <img src={anime.image} alt={primary} className="h-full w-full object-cover" onError={() => setImgError(true)} />
          ) : (
            <NoImagePlaceholder variant="portrait" className="h-full w-full" label="" />
          )}
          <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Play className="h-6 w-6 text-foreground fill-foreground" />
          </div>
        </div>
        <div className="flex-1 min-w-0 py-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{primary}</p>
              {secondary && <p className="text-xs text-muted-foreground mt-0.5">{secondary}</p>}
            </div>
            <span className="flex items-center gap-1 text-sm text-yellow-500 font-semibold shrink-0">
              <Star className="h-3.5 w-3.5 fill-yellow-500" />{anime.rating}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{anime.synopsis}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded">{anime.type}</span>
            <StatusBadge animeId={anime.id} size="xs" />
            <span className="text-xs text-muted-foreground">{anime.episodes} ep.</span>
            <span className="text-xs text-muted-foreground">{anime.studio}</span>
          </div>
        </div>
      </Link>
    )
  }

  /* Default variant card content */
  const cardContent = (
    <>
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-secondary">
        {showImage ? (
          <img
            src={anime.image}
            alt={primary}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <NoImagePlaceholder variant="portrait" className="h-full w-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Desktop hover overlay */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 max-md:hidden">
          <span className="flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded-md text-[11px] font-medium">
            <Play className="h-3 w-3 fill-primary-foreground" />Ver
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditModalOpen(true) }}
              className="p-1.5 backdrop-blur-sm rounded-md bg-secondary/90 text-secondary-foreground hover:bg-secondary transition-colors"
              title="Editar progreso"
            >
              <Settings2 className="h-3 w-3" />
            </button>
            <FavoriteButton variant="icon" />
            <AddToListDropdown animeId={anime.id} />
          </div>
        </div>

        {/* Mobile info button */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMobileSheetOpen(true) }}
          className="absolute bottom-2 right-2 p-1.5 backdrop-blur-sm rounded-lg bg-background/80 text-foreground md:hidden"
          aria-label="Ver informacion"
        >
          <Info className="h-3.5 w-3.5" />
        </button>

        {/* Airing badge */}
        {anime.status === "En emision" && (
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground rounded-md text-[10px] font-bold uppercase tracking-wider">
            En emision
          </div>
        )}
        {anime.status !== "En emision" && <StatusBadge animeId={anime.id} />}

        {/* Rating */}
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-background/80 backdrop-blur-sm rounded-md text-xs font-semibold text-yellow-500">
          <Star className="h-3 w-3 fill-yellow-500" />{anime.rating}
        </div>

        {rank != null && (
          <div className="absolute bottom-2 left-2 text-4xl font-black font-display text-foreground/20 leading-none opacity-100 group-hover:opacity-0 transition-opacity max-md:hidden">
            #{rank}
          </div>
        )}
      </div>
      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{primary}</h3>
      {secondary && <p className="text-xs text-muted-foreground mt-0.5">{secondary}</p>}
      <div className="flex items-center gap-2 mt-1.5">
        <span className="text-xs text-muted-foreground">{anime.type}</span>
        <span className="h-0.5 w-0.5 bg-muted-foreground rounded-full" />
        <span className="text-xs text-muted-foreground">{anime.episodes} ep.</span>
        <span className="h-0.5 w-0.5 bg-muted-foreground rounded-full" />
        <span className="text-xs text-muted-foreground">{anime.year}</span>
      </div>
    </>
  )

  // Before client mount, render a plain link (SSR-safe, no HoverCard)
  if (!isMounted) {
    return (
      <Link href={`/anime/${anime.id}`} className="group relative flex flex-col text-left">
        {cardContent}
      </Link>
    )
  }

  return (
    <>
      {isDesktop ? (
        <DesktopHoverCard anime={anime} cardContent={cardContent} onOpenModal={handleOpenModal} />
      ) : (
        <Link href={`/anime/${anime.id}`} className="group relative flex flex-col text-left">
          {cardContent}
        </Link>
      )}

      {/* Modals - always outside the hover card tree */}
      {mobileSheetOpen && (
        <MobileInfoSheet
          anime={anime}
          open={mobileSheetOpen}
          onClose={() => setMobileSheetOpen(false)}
          onOpenModal={handleOpenModal}
        />
      )}
      {editModalOpen && (
        <AnimeEditModal anime={anime} open={editModalOpen} onOpenChange={setEditModalOpen} />
      )}
    </>
  )
}