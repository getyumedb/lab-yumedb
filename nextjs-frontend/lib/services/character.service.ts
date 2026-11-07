import type { CharacterDetail } from "@/types"
import apiClient from "@/lib/api/client"
import endpoints from "@/lib/api/endpoints"

function isMock(): boolean {
  return process.env.NEXT_PUBLIC_DATA_SOURCE !== "api"
}

export async function getCharacters(): Promise<CharacterDetail[]> {
  if (isMock()) {
    const { getMockCharacters } = await import("@/lib/mock/character.mock")
    return getMockCharacters()
  }
  const { data } = await apiClient.get<CharacterDetail[]>(endpoints.characters)
  return data
}

export async function getCharacterById(id: string): Promise<CharacterDetail | null> {
  if (isMock()) {
    const { getMockCharacter } = await import("@/lib/mock/character.mock")
    return getMockCharacter(id)
  }
  const { data } = await apiClient.get<CharacterDetail>(endpoints.characterById(id))
  return data
}
