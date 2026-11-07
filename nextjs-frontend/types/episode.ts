import type { Image } from "./media"

export interface Episode {
  id: string
  animeId: string
  number: number
  title?: string
  duration?: number
  airedAt?: string
  isFiller?: boolean
  isRecap?: boolean
  synopsis?: string
  images: Image[]
}
