import type { TitleType } from "./enums"
import type { Image } from "./media"

export interface ProducerTitle {
  id: string
  producerId: string
  title: string
  titleType: TitleType
}

export interface ProducerExternalLink {
  id: string
  producerId: string
  url: string
  name: string
}

export interface Producer {
  id: string
  titles: ProducerTitle[]
  established?: string
  about?: string
  images: Image[]
  externalLinks: ProducerExternalLink[]
}
