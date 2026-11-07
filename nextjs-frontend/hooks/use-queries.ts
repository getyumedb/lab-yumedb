import { useQuery } from "@tanstack/react-query"
import { getAnimes, getAnimeById, searchAnimes } from "@/lib/services/anime.service"
import { getCharacters, getCharacterById } from "@/lib/services/character.service"
import { getPeople, getPersonById } from "@/lib/services/person.service"
import { getCompanies, getCompanyById } from "@/lib/services/company.service"

// ─── Anime hooks ─────────────────────────────────────────────────
export function useAnimes() {
  return useQuery({
    queryKey: ["animes"],
    queryFn: getAnimes,
  })
}

export function useAnimeDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["anime", id],
    queryFn: () => getAnimeById(id!),
    enabled: !!id,
  })
}

export function useAnimeSearch(query: string) {
  return useQuery({
    queryKey: ["animes", "search", query],
    queryFn: () => searchAnimes(query),
    enabled: query.length > 0,
  })
}

// ─── Character hooks ─────────────────────────────────────────────
export function useCharacters() {
  return useQuery({
    queryKey: ["characters"],
    queryFn: getCharacters,
  })
}

export function useCharacterDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["character", id],
    queryFn: () => getCharacterById(id!),
    enabled: !!id,
  })
}

// ─── Person hooks ────────────────────────────────────────────────
export function usePeople() {
  return useQuery({
    queryKey: ["people"],
    queryFn: getPeople,
  })
}

export function usePersonDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["person", id],
    queryFn: () => getPersonById(id!),
    enabled: !!id,
  })
}

// ─── Company hooks ───────────────────────────────────────────────
export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
  })
}

export function useCompanyDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["company", id],
    queryFn: () => getCompanyById(id!),
    enabled: !!id,
  })
}
