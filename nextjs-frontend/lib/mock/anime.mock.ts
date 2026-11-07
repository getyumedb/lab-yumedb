import type { AnimeListItem, AnimeDetail, AnimeStatus } from "@/types"

// ─── Status mapping helper ───────────────────────────────────────
const statusMap: Record<string, AnimeStatus> = {
  "En emision": 3,   // Airing
  "Finalizado": 4,   // Finished
  "Proximamente": 2, // Upcoming
}

// ─── Anime list mock data ────────────────────────────────────────
const animeList: AnimeListItem[] = [
  { id: "1", title: "Espada Celestial", titleJp: "Tenken no Kiseki", titleEn: "Celestial Sword", image: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/113415-jQBSkxWAAk83.jpg", rating: 9.2, episodes: 24, status: 3, year: 2026, season: 1, genres: ["Accion", "Fantasia", "Aventura"], synopsis: "Un joven samurai descubre una espada ancestral que le otorga poderes mas alla de la comprension humana.", studio: "MAPPA", type: "TV" },
  { id: "2", title: "Sakura Dreams", titleJp: "Sakura no Yume", titleEn: "Sakura Dreams", image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-LHBAeoZDIsnF.jpg", rating: 8.8, episodes: 12, status: 4, year: 2025, season: 2, genres: ["Magia", "Romance", "Fantasia"], synopsis: "Una chica magica lucha por proteger su mundo mientras descubre los secretos de su linaje.", studio: "Kyoto Animation", type: "TV" },
  { id: "3", title: "Neo Genesis Titan", titleJp: "Shin Seiki Taitan", titleEn: "Neo Genesis Titan", image: "/images/anime-3.jpg", rating: 9.0, episodes: 26, status: 3, year: 2026, season: 1, genres: ["Mecha", "Sci-Fi", "Drama"], synopsis: "En un futuro distopico, pilotos de mechas gigantes son la ultima linea de defensa contra invasores alienigenas.", studio: "Sunrise", type: "TV" },
  { id: "4", title: "Sombras de Tokyo", titleJp: "Tokyo no Kage", titleEn: "Shadows of Tokyo", image: "/images/anime-4.jpg", rating: 8.6, episodes: 13, status: 4, year: 2025, season: 4, genres: ["Misterio", "Thriller", "Seinen"], synopsis: "Un detective privado investiga una serie de crimenes sobrenaturales en el bajo mundo de Tokyo.", studio: "Madhouse", type: "TV" },
  { id: "5", title: "Furia del Dragon", titleJp: "Ryuu no Ikari", titleEn: "Dragon's Fury", image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-LHBAeoZDIsnF.jpg", rating: 8.9, episodes: 50, status: 3, year: 2026, season: 1, genres: ["Accion", "Fantasia", "Shounen"], synopsis: "Un guerrero destinado a derrotar dragones se embarca en una epica aventura a traves de reinos olvidados.", studio: "ufotable", type: "TV" },
  { id: "6", title: "Dias de Academia", titleJp: "Gakuen no Hibi", titleEn: "Academy Days", image: "/images/anime-6.jpg", rating: 8.3, episodes: 12, status: 4, year: 2025, season: 3, genres: ["Slice of Life", "Comedia", "Escolar"], synopsis: "La vida cotidiana de un grupo de amigos en una academia japonesa llena de momentos divertidos y emotivos.", studio: "A-1 Pictures", type: "TV" },
  { id: "7", title: "Sombra Nocturna", titleJp: "Yoru no Kage", titleEn: "Night Shadow", image: "/images/anime-7.jpg", rating: 9.1, episodes: 24, status: 3, year: 2026, season: 1, genres: ["Accion", "Historico", "Seinen"], synopsis: "Un asesino ninja en el Japon feudal lucha entre la lealtad a su clan y sus propios ideales de justicia.", studio: "Wit Studio", type: "TV" },
  { id: "8", title: "Slam Revolution", titleJp: "Suramu Reboryuushon", titleEn: "Slam Revolution", image: "/images/anime-8.jpg", rating: 8.7, episodes: 25, status: 4, year: 2025, season: 4, genres: ["Deportes", "Drama", "Shounen"], synopsis: "Un prodigio del basketball busca llevar a su equipo a la cima del campeonato nacional.", studio: "Production I.G", type: "TV" },
  { id: "9", title: "Bosque Encantado", titleJp: "Majo no Mori", titleEn: "Enchanted Forest", image: "/images/anime-9.jpg", rating: 8.5, episodes: 13, status: 4, year: 2025, season: 2, genres: ["Fantasia", "Aventura", "Magia"], synopsis: "Una joven bruja explora un bosque magico lleno de criaturas misticas y secretos ancestrales.", studio: "Trigger", type: "TV" },
  { id: "10", title: "Odisea Cosmica", titleJp: "Uchuu no Tabibito", titleEn: "Cosmic Odyssey", image: "/images/anime-10.jpg", rating: 9.3, episodes: 1, status: 4, year: 2026, season: 1, genres: ["Sci-Fi", "Aventura", "Drama"], synopsis: "Un explorador espacial se aventura mas alla de los confines conocidos del universo.", studio: "CoMix Wave Films", type: "Pelicula" },
  { id: "11", title: "Mar de Leyendas", titleJp: "Densetsu no Umi", titleEn: "Sea of Legends", image: "/images/anime-11.jpg", rating: 8.8, episodes: 100, status: 3, year: 2024, season: 2, genres: ["Aventura", "Accion", "Comedia"], synopsis: "Un capitan pirata y su tripulacion buscan el legendario tesoro perdido en mares desconocidos.", studio: "Toei Animation", type: "TV" },
  { id: "12", title: "Noches de Verano", titleJp: "Natsu no Yoru", titleEn: "Summer Nights", image: "/images/anime-12.jpg", rating: 8.4, episodes: 1, status: 4, year: 2025, season: 3, genres: ["Romance", "Drama", "Slice of Life"], synopsis: "Dos almas solitarias se encuentran durante un festival de verano y descubren que sus destinos estan entrelazados.", studio: "CoMix Wave Films", type: "Pelicula" },
  { id: "13", title: "Codigo Espectro", titleJp: "Supekutoru Koudo", titleEn: "Spectre Code", image: "/images/anime-1.jpg", rating: 8.1, episodes: 13, status: 4, year: 2025, season: 2, genres: ["Sci-Fi", "Thriller", "Misterio"], synopsis: "Un programador descubre un codigo oculto en la red que predice eventos futuros, desatando una carrera contra el tiempo.", studio: "Madhouse", type: "TV" },
  { id: "14", title: "Rosas de Acero", titleJp: "Hagane no Bara", titleEn: "Steel Roses", image: "/images/anime-2.jpg", rating: 8.6, episodes: 24, status: 3, year: 2026, season: 1, genres: ["Accion", "Drama", "Historico"], synopsis: "En la Europa medieval, una caballero femenina lucha por su lugar en un mundo dominado por la guerra y el honor.", studio: "Wit Studio", type: "TV" },
  { id: "15", title: "Melodia Eterna", titleJp: "Eien no Melody", titleEn: "Eternal Melody", image: "/images/anime-3.jpg", rating: 9.1, episodes: 12, status: 4, year: 2025, season: 4, genres: ["Magia", "Drama", "Romance"], synopsis: "Una violinista prodigio descubre que su musica puede abrir portales a dimensiones donde las emociones toman forma.", studio: "Kyoto Animation", type: "TV" },
  { id: "16", title: "Cazadores del Alba", titleJp: "Akatsuki no Karyuudo", titleEn: "Dawn Hunters", image: "/images/anime-4.jpg", rating: 8.3, episodes: 26, status: 2, year: 2026, season: 2, genres: ["Accion", "Aventura", "Fantasia"], synopsis: "Un gremio de cazadores se enfrenta a criaturas de la oscuridad que amenazan con destruir el equilibrio del mundo.", studio: "ufotable", type: "TV" },
  { id: "17", title: "Corazon de Cristal", titleJp: "Kurisutaru no Kokoro", titleEn: "Crystal Heart", image: "/images/anime-5.jpg", rating: 8.7, episodes: 1, status: 4, year: 2025, season: 1, genres: ["Romance", "Fantasia", "Drama"], synopsis: "Una princesa de un reino de cristal debe elegir entre su deber real y el amor de un humano comun.", studio: "CoMix Wave Films", type: "Pelicula" },
  { id: "18", title: "Punos de Trueno", titleJp: "Kaminari no Kobushi", titleEn: "Thunder Fists", image: "/images/anime-6.jpg", rating: 8.0, episodes: 25, status: 3, year: 2026, season: 1, genres: ["Deportes", "Accion", "Shounen"], synopsis: "Un boxeador callejero busca redimirse a traves del deporte profesional mientras enfrenta su turbulento pasado.", studio: "MAPPA", type: "TV" },
  { id: "19", title: "Laberinto Digital", titleJp: "Dejitaru Meikyuu", titleEn: "Digital Labyrinth", image: "/images/anime-7.jpg", rating: 7.9, episodes: 13, status: 4, year: 2024, season: 3, genres: ["Sci-Fi", "Misterio", "Seinen"], synopsis: "Jugadores quedan atrapados en un juego de realidad virtual donde la unica forma de escapar es resolver un laberinto imposible.", studio: "A-1 Pictures", type: "TV" },
  { id: "20", title: "Sakura: Segunda Temporada", titleJp: "Sakura: Dai Ni Ki", titleEn: "Sakura: Season Two", image: "/images/anime-8.jpg", rating: 8.9, episodes: 13, status: 2, year: 2026, season: 2, genres: ["Magia", "Romance", "Fantasia"], synopsis: "Sakura enfrenta nuevos enemigos mas poderosos mientras descubre verdades impactantes sobre su madre y el origen de su poder.", studio: "Kyoto Animation", type: "TV" },
  { id: "21", title: "Susurros del Viento", titleJp: "Kaze no Sasayaki", titleEn: "Wind Whispers", image: "/images/anime-9.jpg", rating: 8.2, episodes: 12, status: 4, year: 2024, season: 4, genres: ["Slice of Life", "Drama", "Romance"], synopsis: "En un pueblo rural japones, una joven escritora redescubre la inspiracion y el amor mientras sana heridas del pasado.", studio: "Kyoto Animation", type: "TV" },
  { id: "22", title: "Titan Zero", titleJp: "Taitan Zero", titleEn: "Titan Zero", image: "/images/anime-10.jpg", rating: 8.8, episodes: 3, status: 4, year: 2025, season: 3, genres: ["Mecha", "Sci-Fi", "Accion"], synopsis: "Precuela de Neo Genesis Titan que revela los origenes de los primeros mechas y la primera invasion alienigena.", studio: "Sunrise", type: "OVA" },
  { id: "23", title: "Ley de la Calle", titleJp: "Machi no Okite", titleEn: "Law of the Street", image: "/images/anime-11.jpg", rating: 7.8, episodes: 6, status: 4, year: 2024, season: 2, genres: ["Accion", "Seinen", "Drama"], synopsis: "Bandas rivales luchan por el control de los barrios bajos de Osaka en esta cruda historia de supervivencia y hermandad.", studio: "Madhouse", type: "ONA" },
  { id: "24", title: "Estrellas Gemelas", titleJp: "Futago no Hoshi", titleEn: "Twin Stars", image: "/images/anime-12.jpg", rating: 8.5, episodes: 24, status: 3, year: 2026, season: 1, genres: ["Comedia", "Fantasia", "Aventura"], synopsis: "Dos hermanas gemelas con poderes opuestos deben aprender a trabajar juntas para salvar su dimension de la destruccion.", studio: "Trigger", type: "TV" },
  { id: "25", title: "El Ultimo Samurai", titleJp: "Saigo no Samurai", titleEn: "The Last Samurai", image: "/images/anime-1.jpg", rating: 9.0, episodes: 1, status: 4, year: 2025, season: 4, genres: ["Historico", "Accion", "Drama"], synopsis: "La historia del ultimo samurai que lucha por preservar sus tradiciones en un Japon que abraza la modernizacion.", studio: "Production I.G", type: "Pelicula" },
  { id: "26", title: "Cocina de Batalla", titleJp: "Batoru Kitchin", titleEn: "Battle Kitchen", image: "/images/anime-2.jpg", rating: 8.1, episodes: 24, status: 3, year: 2026, season: 1, genres: ["Comedia", "Shounen", "Slice of Life"], synopsis: "Un joven chef compite en torneos culinarios extremos donde la comida tiene el poder de transformar a quienes la prueban.", studio: "A-1 Pictures", type: "TV" },
  { id: "27", title: "Almas Errantes", titleJp: "Samayou Tamashii", titleEn: "Wandering Souls", image: "/images/anime-3.jpg", rating: 8.4, episodes: 13, status: 4, year: 2024, season: 1, genres: ["Misterio", "Fantasia", "Seinen"], synopsis: "Un exorcista moderno investiga fenomenos paranormales en Tokyo mientras lidia con su propia maldicion ancestral.", studio: "MAPPA", type: "TV" },
  { id: "28", title: "Velocidad Maxima", titleJp: "Saidai Sokudo", titleEn: "Maximum Speed", image: "/images/anime-4.jpg", rating: 7.7, episodes: 12, status: 4, year: 2024, season: 3, genres: ["Deportes", "Accion", "Drama"], synopsis: "Pilotos de carreras de alta velocidad compiten en circuitos futuristas donde la tecnologia y el talento lo son todo.", studio: "Production I.G", type: "TV" },
  { id: "29", title: "Jardin de los Suenos", titleJp: "Yume no Niwa", titleEn: "Garden of Dreams", image: "/images/anime-5.jpg", rating: 8.8, episodes: 1, status: 2, year: 2026, season: 3, genres: ["Fantasia", "Aventura", "Magia"], synopsis: "Una nina entra en un misterioso jardin donde las flores son portales a mundos nacidos de los suenos de las personas.", studio: "Trigger", type: "Pelicula" },
  { id: "30", title: "Mar de Leyendas: Arco de Fuego", titleJp: "Densetsu no Umi: Hi no Hen", titleEn: "Sea of Legends: Fire Arc", image: "/images/anime-6.jpg", rating: 9.2, episodes: 26, status: 3, year: 2026, season: 1, genres: ["Aventura", "Accion", "Comedia"], synopsis: "La tripulacion de Marco llega al archipielago de fuego donde se enfrentara al enemigo mas peligroso de todos.", studio: "Toei Animation", type: "TV" },
]

export const genres = [
  "Accion", "Aventura", "Comedia", "Drama", "Fantasia", "Historico", "Magia",
  "Mecha", "Misterio", "Romance", "Sci-Fi", "Seinen", "Shounen",
  "Slice of Life", "Deportes", "Thriller", "Escolar",
]

export const seasons = ["Invierno", "Primavera", "Verano", "Otono"]
export const years = [2026, 2025, 2024]
export const formats = ["TV", "Pelicula", "OVA", "ONA"]
export const statuses = ["En emision", "Finalizado", "Proximamente"]
export const studios = [
  "MAPPA", "Kyoto Animation", "Sunrise", "Madhouse", "ufotable",
  "A-1 Pictures", "Wit Studio", "Production I.G", "Trigger",
  "CoMix Wave Films", "Toei Animation",
]

// ─── Service functions ───────────────────────────────────────────
export function getMockAnimes(): AnimeListItem[] {
  return animeList
}

export function getMockAnimeDetail(id: string): AnimeDetail | null {
  // Lazy-import the detail data to keep this module light
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { animeDetailsMap } = require("./anime-detail.mock")
  return animeDetailsMap[id] ?? null
}

export function searchMockAnimes(query: string): AnimeListItem[] {
  const q = query.toLowerCase()
  return animeList.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      (a.titleJp?.toLowerCase().includes(q) ?? false) ||
      (a.titleEn?.toLowerCase().includes(q) ?? false),
  )
}
