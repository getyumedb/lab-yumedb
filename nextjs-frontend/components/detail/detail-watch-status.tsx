"use client"

import { useState, useRef, useEffect } from "react"
import {
  Clock,
  CheckCircle2,
  Eye,
  PauseCircle,
  XCircle,
  ChevronDown,
  Settings2,
  Check,
} from "lucide-react"
import { useAnimeStatus, WATCH_STATUS_OPTIONS, type AnimeWatchStatus } from "@/hooks/use-anime-status"
import { useAuth } from "@/lib/auth-context"
import { ListIcon } from "@/lib/list-icons"

const statusIcons: Record<Exclude<AnimeWatchStatus, null>, typeof Clock> = {
  watching: Eye,
  completed: CheckCircle2,
  on_hold: PauseCircle,
  dropped: XCircle,
  plan_to_watch: Clock,
}

const statusButtonColors: Record<Exclude<AnimeWatchStatus, null>, string> = {
  watching: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  completed: "bg-chart-5/20 text-chart-5 border-chart-5/30",
  on_hold: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  dropped: "bg-destructive/20 text-destructive border-destructive/30",
  plan_to_watch: "bg-muted-foreground/20 text-muted-foreground border-muted-foreground/30",
}

const statusDropdownColors: Record<Exclude<AnimeWatchStatus, null>, string> = {
  watching: "text-chart-2",
  completed: "text-chart-5",
  on_hold: "text-chart-3",
  dropped: "text-destructive",
  plan_to_watch: "text-muted-foreground",
}

interface DetailWatchStatusProps {
  animeId: number
  totalEpisodes?: number
  onTogglePanel?: () => void
  panelOpen?: boolean
}

export function DetailWatchStatus({ animeId, onTogglePanel, panelOpen }: DetailWatchStatusProps) {
  const { status, updateStatus, toggleCustomList, isInCustomList } = useAnimeStatus(animeId)
  const { user, isAuthenticated } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const customLists = (isAuthenticated && user?.customLists) || []

  useEffect(() => {
    if (!dropdownOpen) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setDropdownOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [dropdownOpen])

  const currentOption = status
    ? WATCH_STATUS_OPTIONS.find((o) => o.value === status)
    : null
  const CurrentIcon = status ? statusIcons[status] : Clock
  const currentLabel = currentOption?.label || "Plan to Watch"
  const currentColors = status
    ? statusButtonColors[status]
    : "bg-secondary text-secondary-foreground border-border/50"

  const handleMainClick = () => {
    if (!status) {
      updateStatus("plan_to_watch")
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Split button group */}
      <div className="relative flex-1 min-w-0" ref={containerRef}>
        <div className="flex items-stretch">
          {/* Main status button */}
          <button
            type="button"
            onClick={handleMainClick}
            className={`flex-1 min-w-0 flex items-center justify-center gap-2 px-3 py-2.5 rounded-l-lg text-sm font-medium transition-colors border ${currentColors} ${status ? "cursor-default" : "hover:bg-secondary/80"}`}
          >
            <CurrentIcon className={`h-4 w-4 shrink-0 ${status ? "fill-current" : ""}`} />
            <span className="truncate">{currentLabel}</span>
          </button>

          {/* Dropdown chevron */}
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center justify-center px-2.5 py-2.5 rounded-r-lg text-sm font-medium transition-colors border border-l-0 ${currentColors} hover:opacity-80`}
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Dropdown menu */}
        {dropdownOpen && (
          <div className="absolute left-0 top-full mt-1 z-50 w-48 bg-card border border-border rounded-lg shadow-xl shadow-background/80 py-1">
            {WATCH_STATUS_OPTIONS.map(({ value, label }) => {
              const Icon = statusIcons[value]
              const isActive = status === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    updateStatus(value)
                    setDropdownOpen(false)
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                    isActive
                      ? `${statusDropdownColors[value]} bg-primary/5 font-medium`
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "fill-current" : ""}`} />
                  {label}
                </button>
              )
            })}
            {status && (
              <>
                <div className="border-t border-border/50 my-1" />
                <button
                  type="button"
                  onClick={() => {
                    updateStatus(null)
                    setDropdownOpen(false)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-destructive hover:bg-destructive/5 transition-colors"
                >
                  <XCircle className="h-4 w-4 shrink-0" />
                  Quitar de lista
                </button>
              </>
            )}
            {customLists.length > 0 && (
              <>
                <div className="border-t border-border/50 my-1" />
                <div className="px-3 py-1.5">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Listas personalizadas</p>
                </div>
                {customLists.map((cl) => {
                  const active = isInCustomList(cl.id)
                  return (
                    <button
                      key={cl.id}
                      type="button"
                      onClick={() => toggleCustomList(cl.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors hover:bg-secondary/50"
                    >
                      <div className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        active ? "border-primary bg-primary" : "border-border bg-secondary/50"
                      }`}>
                        {active && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      <ListIcon iconName={cl.icon} color={cl.color} className="h-3.5 w-3.5 shrink-0" />
                      <span className={active ? "text-foreground font-medium" : "text-muted-foreground"}>{cl.name}</span>
                    </button>
                  )
                })}
              </>
            )}
          </div>
        )}
      </div>

      {/* Edit details button */}
      {status && (
        <button
          type="button"
          onClick={onTogglePanel}
          className={`shrink-0 flex items-center justify-center px-2.5 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
            panelOpen
              ? "bg-primary/20 text-primary border-primary/30"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-border/50"
          }`}
          title={panelOpen ? "Ocultar detalles" : "Editar detalles"}
        >
          <Settings2 className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
