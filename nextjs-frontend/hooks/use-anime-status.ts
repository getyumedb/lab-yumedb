"use client"

import { useState, useEffect, useCallback } from "react"

export type AnimeWatchStatus = "watching" | "completed" | "on_hold" | "dropped" | "plan_to_watch" | null

export const WATCH_STATUS_OPTIONS: {
  value: Exclude<AnimeWatchStatus, null>
  label: string
}[] = [
    { value: "watching", label: "Watching" },
    { value: "completed", label: "Completed" },
    { value: "on_hold", label: "On Hold" },
    { value: "dropped", label: "Dropped" },
    { value: "plan_to_watch", label: "Plan to Watch" },
  ]

const STORAGE_KEY = "yumedb-anime-status"
const CUSTOM_LIST_STORAGE_KEY = "yumedb-anime-custom-lists"

function getStoredStatuses(): Record<string, AnimeWatchStatus> {
  if (typeof window === "undefined") return {}
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function setStoredStatuses(statuses: Record<string, AnimeWatchStatus>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses))
  } catch {
    // Silently fail
  }
}

function getStoredCustomLists(): Record<string, string[]> {
  if (typeof window === "undefined") return {}
  try {
    const stored = localStorage.getItem(CUSTOM_LIST_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function setStoredCustomLists(lists: Record<string, string[]>) {
  try {
    localStorage.setItem(CUSTOM_LIST_STORAGE_KEY, JSON.stringify(lists))
  } catch {
    // Silently fail
  }
}

export function useAnimeStatus(animeId: number) {
  const [status, setStatus] = useState<AnimeWatchStatus>(null)
  const [customListIds, setCustomListIds] = useState<string[]>([])

  useEffect(() => {
    const statuses = getStoredStatuses()
    setStatus(statuses[String(animeId)] || null)
    const lists = getStoredCustomLists()
    setCustomListIds(lists[String(animeId)] || [])
  }, [animeId])

  const updateStatus = useCallback(
    (newStatus: AnimeWatchStatus) => {
      const statuses = getStoredStatuses()
      if (newStatus === null) {
        delete statuses[String(animeId)]
      } else {
        statuses[String(animeId)] = newStatus
      }
      setStoredStatuses(statuses)
      setStatus(newStatus)
    },
    [animeId]
  )

  const toggleStatus = useCallback(
    (targetStatus: AnimeWatchStatus) => {
      if (status === targetStatus) {
        updateStatus(null)
      } else {
        updateStatus(targetStatus)
      }
    },
    [status, updateStatus]
  )

  const toggleCustomList = useCallback(
    (listId: string) => {
      const all = getStoredCustomLists()
      const current = all[String(animeId)] || []
      const updated = current.includes(listId)
        ? current.filter((id) => id !== listId)
        : [...current, listId]
      if (updated.length === 0) {
        delete all[String(animeId)]
      } else {
        all[String(animeId)] = updated
      }
      setStoredCustomLists(all)
      setCustomListIds(updated)
    },
    [animeId]
  )

  const isInCustomList = useCallback(
    (listId: string) => customListIds.includes(listId),
    [customListIds]
  )

  return { status, updateStatus, toggleStatus, customListIds, toggleCustomList, isInCustomList }
}
