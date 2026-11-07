import type { ImageSize } from "./enums"

export interface Image {
  id: string
  format: string
  size: ImageSize
  url: string
}

export interface Trailer {
  id: string
  title?: string
  url?: string
  embedUrl?: string
  images: Image[]
}
