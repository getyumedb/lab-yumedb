// ─── Anime Enums ─────────────────────────────────────────────────
export enum AnimeStatus {
  Unknown = 0,
  Planned = 1,
  Upcoming = 2,
  Airing = 3,
  Finished = 4,
  Cancelled = 5,
  OnHold = 6,
}

export enum AnimeRating {
  Unknown = 0,
  AllAges = 1,
  Children = 2,
  Plus13 = 3,
  Plus17 = 4,
  Plus18 = 5,
}

export enum AnimeSeason {
  Winter = 1,
  Spring = 2,
  Summer = 3,
  Fall = 4,
}

export enum AnimeThemeType {
  Opening = 0,
  Ending = 1,
}

// ─── Shared Enums ────────────────────────────────────────────────
export enum TitleType {
  Default = 0,
  English = 1,
  Japanese = 2,
  Synonym = 3,
}

export enum MediaType {
  Anime = 0,
  Manga = 1,
}

// ─── Genre Enums ─────────────────────────────────────────────────
export enum GenreType {
  Genres = 0,
  ExplicitGenres = 1,
  Themes = 2,
  Demographics = 3,
}

// ─── External Enums ──────────────────────────────────────────────
export enum ExternalProviderType {
  Unknown = 0,
  MyAnimeList = 1,
  IMDB = 2,
  AniList = 3,
  Kitsu = 4,
  AniDB = 5,
}

// ─── Image Enums ─────────────────────────────────────────────────
export enum ImageSize {
  Default = 0,
  Small = 1,
  Medium = 2,
  Large = 3,
  Maximum = 4,
}

export enum ImageFormat {
  Jpg = 0,
  Webp = 1,
  Png = 2,
}

// ─── Work Relation Enums ─────────────────────────────────────────
export enum WorkRelationType {
  Sequel = 0,
  Prequel = 1,
  AlternativeSetting = 2,
  AlternativeVersion = 3,
  SideStory = 4,
  ParentStory = 5,
  Summary = 6,
  FullStory = 7,
  SpinOff = 8,
  Adaptation = 9,
  Character = 10,
  Other = 11,
}
