import { Anime, Character, JikanResponse, Person, Studio, Manga, News, Review } from '../types';

const BASE_URL = 'https://api.jikan.moe/v4';

// Queue to handle rate limiting
let requestQueue: (() => void)[] = [];
let isProcessingQueue = false;
const MIN_DELAY = 1000; // Jikan has a 1-3 second delay per IP sometimes

const processQueue = async () => {
  if (isProcessingQueue) return;
  isProcessingQueue = true;
  while (requestQueue.length > 0) {
    const nextRequest = requestQueue.shift();
    if (nextRequest) {
      nextRequest();
      await new Promise(resolve => setTimeout(resolve, MIN_DELAY));
    }
  }
  isProcessingQueue = false;
};

const fetchJikan = async <T>(endpoint: string, retries = 3): Promise<T> => {
  return new Promise((resolve, reject) => {
    const executeRequest = async () => {
      try {
        const res = await fetch(`${BASE_URL}${endpoint}`);
        
        if (res.status === 429) {
          if (retries > 0) {
            console.warn(`Rate limited for ${endpoint}. Retrying in 2s...`);
            await new Promise(r => setTimeout(r, 2000));
            resolve(fetchJikan(endpoint, retries - 1));
          } else {
            reject(new Error('Jikan API Error: Too Many Requests (Max Retries)'));
          }
          return;
        }

        if (!res.ok) {
          throw new Error(`Jikan API Error: ${res.statusText} (${res.status}) at ${endpoint}`);
        }

        const data = await res.json();
        resolve(data);
      } catch (error) {
        if (retries > 0) {
          await new Promise(r => setTimeout(r, 1000));
          resolve(fetchJikan(endpoint, retries - 1));
        } else {
          reject(error);
        }
      }
    };

    requestQueue.push(executeRequest);
    processQueue();
  });
};

export const jikanService = {
  getTopAnime: () => fetchJikan<JikanResponse<Anime[]>>('/top/anime'),
  getSeasonNow: () => fetchJikan<JikanResponse<Anime[]>>('/seasons/now'),
  getSeasonUpcoming: () => fetchJikan<JikanResponse<Anime[]>>('/seasons/upcoming'),
  getSchedules: (day: string) => fetchJikan<JikanResponse<Anime[]>>(`/schedules?filter=${day}`),
  
  getAnimeFullById: (id: number) => fetchJikan<JikanResponse<Anime>>(`/anime/${id}/full`),
  getAnimeCharacters: (id: number) => fetchJikan<{ data: { character: Character; role: string; voice_actors: any[] }[] }>(`/anime/${id}/characters`),
  getAnimeStaff: (id: number) => fetchJikan<{ data: { person: Person; positions: string[] }[] }>(`/anime/${id}/staff`),
  
  getCharacterById: (id: number) => fetchJikan<JikanResponse<Character>>(`/characters/${id}/full`),
  getCharacterAnime: (id: number) => fetchJikan<{ data: { role: string; anime: Anime }[] }>(`/characters/${id}/anime`),
  getCharacterVoices: (id: number) => fetchJikan<{ data: { language: string; person: Person }[] }>(`/characters/${id}/voices`),
  
  getPersonById: (id: number) => fetchJikan<JikanResponse<Person>>(`/people/${id}/full`),
  getPersonVoices: (id: number) => fetchJikan<{ data: { character: Character; anime: Anime; role: string }[] }>(`/people/${id}/voices`),
  getPersonAnime: (id: number) => fetchJikan<{ data: { position: string; anime: Anime }[] }>(`/people/${id}/anime`),
  
  getStudioById: (id: number) => fetchJikan<JikanResponse<Studio>>(`/producers/${id}/full`),
  getStudioAnime: (id: number) => fetchJikan<JikanResponse<Anime[]>>(`/anime?producers=${id}`),
  
  getTopCharacters: (page = 1) => fetchJikan<JikanResponse<Character[]>>(`/top/characters?page=${page}`),
  getTopPeople: (page = 1) => fetchJikan<JikanResponse<Person[]>>(`/top/people?page=${page}`),
  getTopStudios: (page = 1) => fetchJikan<JikanResponse<Studio[]>>(`/producers?page=${page}`),
  
  // Manga
  getTopManga: (page = 1) => fetchJikan<JikanResponse<Manga[]>>(`/top/manga?page=${page}`),
  getMangaById: (id: number) => fetchJikan<JikanResponse<Manga>>(`/manga/${id}`),
  getMangaFull: (id: number) => fetchJikan<JikanResponse<Manga>>(`/manga/${id}/full`),
  getMangaCharacters: (id: number) => fetchJikan<JikanResponse<any[]>>(`/manga/${id}/characters`),
  getMangaNews: (id: number) => fetchJikan<JikanResponse<News[]>>(`/manga/${id}/news`),
  getMangaRelations: (id: number) => fetchJikan<JikanResponse<any[]>>(`/manga/${id}/relations`),
  getMangaRecommendations: (id: number) => fetchJikan<JikanResponse<any[]>>(`/manga/${id}/recommendations`),
  getMangaExternalLinks: (id: number) => fetchJikan<JikanResponse<any[]>>(`/manga/${id}/external`),
  getMangaStatistics: (id: number) => fetchJikan<JikanResponse<any>>(`/manga/${id}/statistics`),
  searchManga: (query: string, page = 1) => fetchJikan<JikanResponse<Manga[]>>(`/manga?q=${query}&page=${page}&limit=20`),

  // Episodes & More
  getAnimeEpisodes: (id: number, page = 1) => fetchJikan<JikanResponse<any[]>>(`/anime/${id}/episodes?page=${page}`),
  getAnimeRelations: (id: number) => fetchJikan<JikanResponse<any[]>>(`/anime/${id}/relations`),
  getAnimeRecommendations: (id: number) => fetchJikan<JikanResponse<any[]>>(`/anime/${id}/recommendations`),
  getAnimeVideos: (id: number) => fetchJikan<JikanResponse<any>>(`/anime/${id}/videos`),
  getAnimeExternalLinks: (id: number) => fetchJikan<JikanResponse<any[]>>(`/anime/${id}/external`),
  getAnimeStatistics: (id: number) => fetchJikan<JikanResponse<any>>(`/anime/${id}/statistics`),
  getAnimeStreaming: (id: number) => fetchJikan<JikanResponse<any[]>>(`/anime/${id}/streaming`),

  // News and Reviews
  getAnimeNews: (id: number) => fetchJikan<JikanResponse<News[]>>(`/anime/${id}/news`),
  getRecentNews: async () => {
    // Global news doesn't exist in Jikan v4, so we fallback to news of a top airing anime
    try {
      const topAnime = await jikanService.getSeasonNow();
      if (topAnime.data.length > 0) {
        return jikanService.getAnimeNews(topAnime.data[0].mal_id);
      }
      return { data: [] };
    } catch {
      return { data: [] };
    }
  },
  getAnimeReviews: (id: number) => fetchJikan<JikanResponse<Review[]>>(`/anime/${id}/reviews`),
  getRecentReviews: () => fetchJikan<JikanResponse<Review[]>>('/reviews/anime'),
  
  searchAnime: (query: string, params = '') => fetchJikan<JikanResponse<Anime[]>>(`/anime?q=${query}&limit=20${params}`),
  searchCharacters: (query: string, page = 1) => fetchJikan<JikanResponse<Character[]>>(`/characters?q=${query}&page=${page}&limit=20`),
  searchPeople: (query: string, page = 1) => fetchJikan<JikanResponse<Person[]>>(`/people?q=${query}&page=${page}&limit=20`),
  searchStudios: (query: string, page = 1) => fetchJikan<JikanResponse<Studio[]>>(`/producers?q=${query}&page=${page}&limit=20`),
};

