"use client"

import { useEffect } from "react"
import { useRecentlyVisited } from "@/hooks/use-recently-visited"

interface TrackAnimeVisitProps {
  id: number
  title: string
  image: string
}

export function TrackAnimeVisit({ id, title, image }: TrackAnimeVisitProps) {
  const { addVisit } = useRecentlyVisited()

  useEffect(() => {
    addVisit({ id, title, image })
  }, [id, title, image, addVisit])

  return null
}
