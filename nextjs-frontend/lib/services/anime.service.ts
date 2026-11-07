import type { AnimeListItem, AnimeDetail } from "@/types"
import apiClient from "@/lib/api/client"
import endpoints from "@/lib/api/endpoints"

function isMock(): boolean {
  return process.env.NEXT_PUBLIC_DATA_SOURCE !== "api"
}

export async function getAnimes(): Promise<AnimeListItem[]> {
  if (isMock()) {
    const { getMockAnimes } = await import("@/lib/mock/anime.mock")
    return getMockAnimes()
  }
  const { data } = await apiClient.get<AnimeListItem[]>(endpoints.animes)
  return data
}

export async function getAnimeById(id: string): Promise<AnimeDetail | null> {
  if (isMock()) {
    const { getMockAnimeDetail } = await import("@/lib/mock/anime.mock")
    return getMockAnimeDetail(id)
  }
  const { data } = await apiClient.get<AnimeDetail>(endpoints.animeById(id))
  return data
}

export async function searchAnimes(query: string): Promise<AnimeListItem[]> {
  if (isMock()) {
    const { searchMockAnimes } = await import("@/lib/mock/anime.mock")
    return searchMockAnimes(query)
  }
  const { data } = await apiClient.get<AnimeListItem[]>(endpoints.animes, {
    params: { q: query },
  })
  return data
}
