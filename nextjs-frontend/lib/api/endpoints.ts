const endpoints = {
  // Anime
  animes: "/animes",
  animeById: (id: string) => `/animes/${id}`,
  animeCharacters: (id: string) => `/animes/${id}/characters`,
  animeStaff: (id: string) => `/animes/${id}/staff`,
  animeEpisodes: (id: string) => `/animes/${id}/episodes`,

  // Characters
  characters: "/characters",
  characterById: (id: string) => `/characters/${id}`,

  // People
  people: "/people",
  personById: (id: string) => `/people/${id}`,

  // Companies / Producers
  companies: "/producers",
  companyById: (id: string) => `/producers/${id}`,

  // Genres
  genres: "/genres",

  // Streaming
  streaming: "/streaming",
} as const

export default endpoints
