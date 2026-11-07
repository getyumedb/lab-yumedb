import type { Image } from "./media"

export interface CharacterNickname {
  id: string
  characterId: string
  nickname: string
}

export interface Character {
  id: string
  name: string
  nicknames: CharacterNickname[]
  about?: string
  images: Image[]
}
