import type {
  AnimeRating,
  AnimeSeason,
  AnimeStatus,
  AnimeThemeType,
  TitleType,
} from "./enums"
import type { Image, Trailer } from "./media"
import type { Genre } from "./genre"
import type { Producer } from "./company"
import type { Character } from "./character"
import type { Person, VoiceActor, AnimeStaff, AnimeStaffPosition } from "./person"

// ─── Anime lookup tables ─────────────────────────────────────────
export interface AnimeType {
  id: string
  name: string
}

export interface Source {
  id: string
  name: string
}

// ─── Anime sub-entities ──────────────────────────────────────────
export interface Broadcast {
  id: string
  animeId: string
  day: number
  time: string
  timezone?: string
  string?: string
}

export interface AnimeTitle {
  id: string
  animeId: string
  title: string
  language?: string
  titleType: TitleType
  isDefault: boolean
  isOfficial: boolean
}

export interface AnimeTheme {
  id: string
  animeId: string
  type: AnimeThemeType
  name: string
}

export interface AnimeRankingData {
  id: string
  animeId: string
  providerId?: string
  score?: number
  scoredBy?: number
  rank?: number
  popularity?: number
  members?: number
  favorites?: number
}

export interface AnimeExternalLink {
  id: string
  animeId: string
  url: string
  name: string
}

export interface AnimeStreaming {
  id: string
  animeId: string
  url: string
  name: string
}

export interface AnimeGenre {
  id: string
  animeId: string
  genreId: string
  genre: Genre
}

export interface AnimeProducer {
  id: string
  animeId: string
  producerId: string
  producer: Producer
}

export interface AnimeLicensor {
  id: string
  animeId: string
  producerId: string
  producer: Producer
}

export interface AnimeStudio {
  id: string
  animeId: string
  producerId: string
  producer: Producer
}

export interface AnimeCharacter {
  id: string
  animeId: string
  characterId: string
  character: Character
  role: string
  voiceActors: VoiceActor[]
}

// ─── Main Anime entity ──────────────────────────────────────────
export interface Anime {
  id: string
  approved: boolean
  animeType: AnimeType
  source: Source
  episodes?: number
  status: AnimeStatus
  airing: boolean
  airedFrom?: string
  airedTo?: string
  duration?: number
  rating: AnimeRating
  synopsis?: string
  background?: string
  season?: AnimeSeason
  year?: number
  broadcast?: Broadcast
  titles: AnimeTitle[]
  images: Image[]
  pictures: Image[]
  trailers: Trailer[]
  producers: AnimeProducer[]
  licensors: AnimeLicensor[]
  studios: AnimeStudio[]
  genres: AnimeGenre[]
  themes: AnimeTheme[]
  externalLinks: AnimeExternalLink[]
  streamingLinks: AnimeStreaming[]
  rankings: AnimeRankingData[]
  characters: AnimeCharacter[]
  staff: AnimeStaff[]
}

// ─── UI convenience types (not backend entities) ─────────────────
// These are frontend-only shapes used by list pages and cards where
// the full Anime entity would be overkill. Components that only need
// card-level data can use AnimeListItem instead of Anime.

export interface AnimeListItem {
  id: string
  title: string
  titleJp?: string
  titleEn?: string
  image: string
  rating?: number
  episodes?: number
  status: AnimeStatus
  year?: number
  season?: AnimeSeason
  genres: string[]
  synopsis?: string
  studio?: string
  type: string
}

export interface Review {
  id: string
  user: string
  avatar: string
  rating: number
  date: string
  content: string
  helpful: number
}

export interface AnimeRelation {
  id: string
  title: string
  type: string
  image: string
  relation: string
}

export interface AnimeScores {
  story: number
  animation: number
  sound: number
  character: number
  enjoyment: number
  overall: number
}

export interface AnimeStats {
  watching: number
  completed: number
  onHold: number
  dropped: number
  planToWatch: number
}

// Denormalized anime detail used by detail pages - combines the
// core Anime entity with precomputed convenience fields so the UI
// components don't have to resolve titles/images/etc. themselves.
export interface AnimeDetail {
  id: string
  title: string
  titleJp: string
  titleEn: string
  titleRomaji: string
  alternativeTitles: string[]
  image: string
  bannerImage: string
  rating: number
  ratingCount: number
  popularity: number
  ranked: number
  favorites: number
  episodes: number
  episodesAired: number
  duration: string
  status: AnimeStatus
  aired: { from: string; to: string | null }
  premiered: string
  broadcast: string
  source: string
  year: number
  season: AnimeSeason | string
  genres: string[]
  themes: string[]
  demographics: string[]
  synopsis: string
  background: string
  studio: string
  producers: string[]
  licensors: string[]
  type: string
  ageRating: string
  characters: AnimeCharacterDetail[]
  staff: StaffMemberDetail[]
  reviews: Review[]
  relations: AnimeRelation[]
  openingThemes: string[]
  endingThemes: string[]
  screenshots: string[]
  trailerUrl: string
  trailers: TrailerDetail[]
  episodesList: EpisodeDetail[]
  scores: AnimeScores
  stats: AnimeStats
}

// Convenience sub-types used in AnimeDetail
export interface AnimeCharacterDetail {
  id: string
  name: string
  nameJp: string
  role: string
  image: string
  voiceActor: {
    name: string
    nameJp: string
    image: string
    language: string
  }
}

export interface StaffMemberDetail {
  name: string
  nameJp?: string
  role: string
  image?: string
}

export interface TrailerDetail {
  id: string
  title: string
  url: string
  thumbnail: string
  type: string
}

export interface EpisodeDetail {
  number: number
  title: string
  titleJp: string
  thumbnail: string
  synopsis: string
  airDate: string
  duration: string
}

// ─── Character full detail (character pages) ─────────────────────
export interface CharacterDetail {
  id: string
  name: string
  nameJp: string
  image: string
  description: string
  age: string
  gender: string
  birthDate: string
  favorites: number
  animeAppearances: {
    animeId: string
    animeName: string
    animeImage: string
    role: string
  }[]
  voiceActors: {
    personId: string
    name: string
    image: string
    language: string
  }[]
}

// ─── Company detail (company/studio pages) ───────────────────────
export interface CompanyDetail {
  id: string
  name: string
  nameJp: string
  image: string
  description: string
  type: string
  founded: number
  headquarters: string
  website: string
  favorites: number
  memberCount: number
  animeProductions: {
    animeId: string
    animeName: string
    animeImage: string
    year: number
    role: string
  }[]
}

// ─── Person detail (person pages) ────────────────────────────────
export interface PersonDetail {
  id: string
  name: string
  nameJp: string
  alternativeNames?: string[]
  image: string
  bio: string
  birthDate: string
  birthPlace: string
  gender: string
  type: string
  favorites: number
  websiteUrl?: string
  roles: {
    animeId: string
    animeName: string
    animeImage: string
    role: string
  }[]
  staffRoles?: {
    animeId: string
    animeName: string
    animeImage: string
    position: string
  }[]
  characters?: {
    characterId: string
    characterName: string
    characterImage: string
    animeName: string
  }[]
}

// ─── Streaming (UI only, not a backend entity) ───────────────────
export interface StreamingPlatform {
  id: string
  name: string
  url: string
  icon: string
  color: string
}
