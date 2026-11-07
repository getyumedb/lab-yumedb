"use client"

import { useState, useEffect, useCallback } from "react"

export interface RecentlyVisitedAnime {
  id: number
  title: string
  image: string
  visitedAt: number
}

const STORAGE_KEY = "yumedb-recently-visited"
const MAX_ITEMS = 20

function getStoredVisits(): RecentlyVisitedAnime[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useRecentlyVisited() {
  const [recentlyVisited, setRecentlyVisited] = useState<RecentlyVisitedAnime[]>([])

  useEffect(() => {
    setRecentlyVisited(getStoredVisits())
  }, [])

  const addVisit = useCallback((anime: { id: number; title: string; image: string }) => {
    const visits = getStoredVisits()
    const filtered = visits.filter((v) => v.id !== anime.id)
    const updated: RecentlyVisitedAnime[] = [
      { id: anime.id, title: anime.title, image: anime.image, visitedAt: Date.now() },
      ...filtered,
    ].slice(0, MAX_ITEMS)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setRecentlyVisited(updated)
  }, [])

  return { recentlyVisited, addVisit }
}
