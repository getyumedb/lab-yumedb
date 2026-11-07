"use client"

import { useState, useEffect, useCallback } from "react"

export interface AnimeUserData {
  score: number | null
  episodesWatched: number | null
  rewatchCount: number | null
  startDate: string | null
  endDate: string | null
  comments: string | null
  notes: string | null
}

const DEFAULT_DATA: AnimeUserData = {
  score: null,
  episodesWatched: null,
  rewatchCount: null,
  startDate: null,
  endDate: null,
  comments: null,
  notes: null,
}

const STORAGE_KEY = "yumedb-anime-user-data"

function getStoredData(): Record<string, AnimeUserData> {
  if (typeof window === "undefined") return {}
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function setStoredData(data: Record<string, AnimeUserData>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Silently fail
  }
}

export function useAnimeUserData(animeId: number) {
  const [data, setData] = useState<AnimeUserData>(DEFAULT_DATA)

  useEffect(() => {
    const allData = getStoredData()
    const stored = allData[String(animeId)]
    setData(stored || DEFAULT_DATA)
  }, [animeId])

  const updateData = useCallback(
    (partial: Partial<AnimeUserData>) => {
      setData((prev) => {
        const next = { ...prev, ...partial }
        const allData = getStoredData()
        allData[String(animeId)] = next
        setStoredData(allData)
        return next
      })
    },
    [animeId]
  )

  const clearData = useCallback(() => {
    const allData = getStoredData()
    delete allData[String(animeId)]
    setStoredData(allData)
    setData(DEFAULT_DATA)
  }, [animeId])

  return { data, updateData, clearData }
}
