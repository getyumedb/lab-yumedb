"use client"

import { useCallback, useEffect, useState, useSyncExternalStore } from "react"
import { LayoutGrid, Grid2X2, List } from "lucide-react"

export type ViewMode = "grid" | "large" | "list"

interface ViewModeToggleProps {
  storageKey: string
  defaultMode?: ViewMode
  onChange?: (mode: ViewMode) => void
}

function isViewMode(v: string | null): v is ViewMode {
  return v === "grid" || v === "large" || v === "list"
}

const EVENT_NAME = "yumedb-viewmode-change"

function dispatchViewModeEvent(key: string, mode: ViewMode) {
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { key, mode } }))
}

export function useViewMode(storageKey: string, defaultMode: ViewMode = "grid") {
  const subscribe = useCallback(
    (cb: () => void) => {
      const handler = (e: Event) => {
        const detail = (e as CustomEvent).detail
        if (detail?.key === storageKey) cb()
      }
      window.addEventListener(EVENT_NAME, handler)
      return () => window.removeEventListener(EVENT_NAME, handler)
    },
    [storageKey],
  )

  const getSnapshot = useCallback(() => {
    const saved = localStorage.getItem(storageKey)
    return isViewMode(saved) ? saved : defaultMode
  }, [storageKey, defaultMode])

  const getServerSnapshot = useCallback(() => defaultMode, [defaultMode])

  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setMode = useCallback(
    (newMode: ViewMode) => {
      localStorage.setItem(storageKey, newMode)
      dispatchViewModeEvent(storageKey, newMode)
    },
    [storageKey],
  )

  return [mode, setMode] as const
}

export function ViewModeToggle({ storageKey, defaultMode = "grid", onChange }: ViewModeToggleProps) {
  const [mode, setMode] = useViewMode(storageKey, defaultMode)

  const handleChange = (newMode: ViewMode) => {
    setMode(newMode)
    onChange?.(newMode)
  }

  const modes: { value: ViewMode; icon: typeof LayoutGrid; label: string }[] = [
    { value: "grid", icon: LayoutGrid, label: "Grid" },
    { value: "large", icon: Grid2X2, label: "Grande" },
    { value: "list", icon: List, label: "Lista" },
  ]

  return (
    <div className="flex items-center bg-card rounded-lg border border-border/50 p-0.5">
      {modes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => handleChange(value)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
            mode === value
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title={label}
          aria-label={`Vista ${label}`}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  )
}
