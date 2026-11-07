import type { Image } from "./media"

export interface PersonAlternativeName {
  id: string
  personId: string
  name: string
}

export interface Person {
  id: string
  name?: string
  firstName?: string
  lastName?: string
  alternativeNames: PersonAlternativeName[]
  birthDate?: string
  about?: string
  websiteUrl?: string
  images: Image[]
}

export interface VoiceActor {
  id: string
  animeCharacterId: string
  personId: string
  person: Person
  language: string
}

export interface AnimeStaffPosition {
  id: string
  staffId: string
  position: string
}

export interface AnimeStaff {
  id: string
  animeId: string
  personId: string
  person: Person
  positions: AnimeStaffPosition[]
}
