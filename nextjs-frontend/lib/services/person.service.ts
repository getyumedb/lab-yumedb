import type { PersonDetail } from "@/types"
import apiClient from "@/lib/api/client"
import endpoints from "@/lib/api/endpoints"

function isMock(): boolean {
  return process.env.NEXT_PUBLIC_DATA_SOURCE !== "api"
}

export async function getPeople(): Promise<PersonDetail[]> {
  if (isMock()) {
    const { getMockPeople } = await import("@/lib/mock/person.mock")
    return getMockPeople()
  }
  const { data } = await apiClient.get<PersonDetail[]>(endpoints.people)
  return data
}

export async function getPersonById(id: string): Promise<PersonDetail | null> {
  if (isMock()) {
    const { getMockPerson } = await import("@/lib/mock/person.mock")
    return getMockPerson(id)
  }
  const { data } = await apiClient.get<PersonDetail>(endpoints.personById(id))
  return data
}
