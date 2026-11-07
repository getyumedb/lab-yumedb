"use client"

import { useState, useEffect, useCallback } from "react"

export interface ActivityPost {
  id: string
  type: "auto" | "manual"
  autoType?: "completed" | "watching" | "score" | "added"
  anime?: string
  animeImage?: string
  episode?: number | null
  score?: number | null
  text?: string
  date: string
  pinned: boolean
}

const STORAGE_KEY = "yumedb-activity-posts"

const DEFAULT_POSTS: ActivityPost[] = [
  { id: "a1", type: "auto", autoType: "completed", anime: "Espada Celestial", animeImage: "/images/anime-1.jpg", episode: null, score: 9, text: null, date: "2026-02-22T10:00:00Z", pinned: false },
  { id: "a2", type: "auto", autoType: "watching", anime: "Sakura Dreams", animeImage: "/images/anime-2.jpg", episode: 8, score: null, text: null, date: "2026-02-22T07:00:00Z", pinned: false },
  { id: "a3", type: "auto", autoType: "score", anime: "Mecha Genesis", animeImage: "/images/anime-3.jpg", episode: null, score: 8.5, text: null, date: "2026-02-21T12:00:00Z", pinned: false },
  { id: "a4", type: "auto", autoType: "watching", anime: "Cronicas del Abismo", animeImage: "/images/anime-4.jpg", episode: 3, score: null, text: null, date: "2026-02-21T08:00:00Z", pinned: false },
  { id: "a5", type: "auto", autoType: "added", anime: "Destino Lunar", animeImage: "/images/anime-5.jpg", episode: null, score: null, text: null, date: "2026-02-20T15:00:00Z", pinned: false },
  { id: "a6", type: "auto", autoType: "completed", anime: "Campus Panic!", animeImage: "/images/anime-6.jpg", episode: null, score: 7, text: null, date: "2026-02-19T20:00:00Z", pinned: false },
  { id: "m1", type: "manual", anime: undefined, animeImage: undefined, episode: null, score: null, text: "Acabo de terminar una maraton de la temporada de invierno 2026. Mis favoritos hasta ahora: Espada Celestial y Sakura Dreams. Ambos me sorprendieron mucho.", date: "2026-02-21T18:00:00Z", pinned: true },
  { id: "a7", type: "auto", autoType: "watching", anime: "Neon Requiem", animeImage: "/images/anime-7.jpg", episode: 12, score: null, text: null, date: "2026-02-18T10:00:00Z", pinned: false },
  { id: "a8", type: "auto", autoType: "completed", anime: "Kokoro Connect", animeImage: "/images/anime-8.jpg", episode: null, score: 8, text: null, date: "2026-02-17T14:00:00Z", pinned: false },
  { id: "m2", type: "manual", anime: undefined, animeImage: undefined, episode: null, score: null, text: "Buscando recomendaciones de anime de fantasia oscura. Si alguien conoce algo parecido a Berserk o Claymore, me avisan.", date: "2026-02-16T09:00:00Z", pinned: false },
  { id: "a9", type: "auto", autoType: "score", anime: "Stellar Odyssey", animeImage: "/images/anime-9.jpg", episode: null, score: 7.5, text: null, date: "2026-02-15T16:00:00Z", pinned: false },
  { id: "a10", type: "auto", autoType: "added", anime: "Dragon Pulse", animeImage: "/images/anime-10.jpg", episode: null, score: null, text: null, date: "2026-02-14T11:00:00Z", pinned: false },
]

function getStoredPosts(): ActivityPost[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
    // Seed with defaults on first load
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_POSTS))
    return DEFAULT_POSTS
  } catch {
    return DEFAULT_POSTS
  }
}

function setStoredPosts(posts: ActivityPost[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  } catch {
    // Silently fail
  }
}

export type ActivityFilter = "all" | "completed" | "watching" | "score" | "added" | "manual"

export function useActivityPosts() {
  const [posts, setPosts] = useState<ActivityPost[]>([])

  useEffect(() => {
    setPosts(getStoredPosts())
  }, [])

  const save = useCallback((updated: ActivityPost[]) => {
    setPosts(updated)
    setStoredPosts(updated)
  }, [])

  const addPost = useCallback((post: Omit<ActivityPost, "id" | "date" | "pinned">) => {
    const newPost: ActivityPost = {
      ...post,
      id: `post-${Date.now()}`,
      date: new Date().toISOString(),
      pinned: false,
    }
    save([newPost, ...getStoredPosts()])
  }, [save])

  const togglePin = useCallback((postId: string) => {
    const current = getStoredPosts()
    // Only allow one pinned post at a time
    const updated = current.map((p) => ({
      ...p,
      pinned: p.id === postId ? !p.pinned : false,
    }))
    save(updated)
  }, [save])

  const removePost = useCallback((postId: string) => {
    save(getStoredPosts().filter((p) => p.id !== postId))
  }, [save])

  const getFilteredPosts = useCallback((filter: ActivityFilter) => {
    const all = posts
    let filtered: ActivityPost[]
    if (filter === "all") {
      filtered = all
    } else if (filter === "manual") {
      filtered = all.filter((p) => p.type === "manual")
    } else {
      filtered = all.filter((p) => p.type === "auto" && p.autoType === filter)
    }
    // Sort: pinned first, then by date descending
    return filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }, [posts])

  return { posts, addPost, togglePin, removePost, getFilteredPosts }
}
