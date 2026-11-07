export interface StreamingPlatform {
  id: string
  name: string
  color: string
  textColor: string
  url: string
  icon: string
}

export const streamingPlatforms: StreamingPlatform[] = [
  {
    id: "crunchyroll",
    name: "Crunchyroll",
    color: "#F47521",
    textColor: "#FFFFFF",
    url: "https://www.crunchyroll.com",
    icon: "CR",
  },
  {
    id: "netflix",
    name: "Netflix",
    color: "#E50914",
    textColor: "#FFFFFF",
    url: "https://www.netflix.com",
    icon: "NF",
  },
  {
    id: "funimation",
    name: "Funimation",
    color: "#5B0BB5",
    textColor: "#FFFFFF",
    url: "https://www.funimation.com",
    icon: "FN",
  },
  {
    id: "disney-plus",
    name: "Disney+",
    color: "#113CCF",
    textColor: "#FFFFFF",
    url: "https://www.disneyplus.com",
    icon: "D+",
  },
  {
    id: "amazon-prime",
    name: "Amazon Prime Video",
    color: "#00A8E1",
    textColor: "#FFFFFF",
    url: "https://www.primevideo.com",
    icon: "AP",
  },
  {
    id: "hidive",
    name: "HIDIVE",
    color: "#00BAED",
    textColor: "#FFFFFF",
    url: "https://www.hidive.com",
    icon: "HI",
  },
]

/** Returns a subset of mock streaming platforms for a given anime based on its licensors. */
export function getStreamingForAnime(licensors: string[]): StreamingPlatform[] {
  const matched: StreamingPlatform[] = []

  for (const licensor of licensors) {
    const lower = licensor.toLowerCase()
    const found = streamingPlatforms.find(
      (p) => lower.includes(p.id) || lower.includes(p.name.toLowerCase()),
    )
    if (found && !matched.some((m) => m.id === found.id)) {
      matched.push(found)
    }
  }

  // Always include at least 2 platforms as mock data
  if (matched.length < 2) {
    for (const p of streamingPlatforms) {
      if (!matched.some((m) => m.id === p.id)) {
        matched.push(p)
      }
      if (matched.length >= 3) break
    }
  }

  return matched
}
