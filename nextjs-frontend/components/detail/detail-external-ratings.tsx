import { Globe, Star } from "lucide-react"
import type { AnimeDetail } from "@/types"

interface ExternalRating {
  platform: string
  score: string
  maxScore: string
  color: string
}

function generateExternalRatings(baseRating: number): ExternalRating[] {
  // Generate varied but realistic ratings derived from the base
  const vary = (base: number, range: number) => {
    const seed = Math.round(base * 100)
    const offset = ((seed % 7) - 3) * (range / 3)
    return Math.min(10, Math.max(1, base + offset))
  }

  return [
    {
      platform: "MyAnimeList",
      score: vary(baseRating, 0.4).toFixed(2),
      maxScore: "10",
      color: "text-chart-1",
    },
    {
      platform: "AniList",
      score: Math.round(vary(baseRating, 0.3) * 10).toString(),
      maxScore: "100",
      color: "text-chart-2",
    },
    {
      platform: "Kitsu",
      score: (vary(baseRating, 0.3) * 10).toFixed(1),
      maxScore: "100",
      color: "text-chart-3",
    },
    {
      platform: "IMDB",
      score: vary(baseRating, 0.5).toFixed(1),
      maxScore: "10",
      color: "text-yellow-500",
    },
    {
      platform: "AniDB",
      score: vary(baseRating, 0.6).toFixed(2),
      maxScore: "10",
      color: "text-primary",
    },
  ]
}

export function DetailExternalRatings({ anime }: { anime: AnimeDetail }) {
  const ratings = generateExternalRatings(anime.rating)

  return (
    <section className="bg-card rounded-xl border border-border/50 p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold font-display text-foreground mb-4">
        <Globe className="h-5 w-5 text-primary" />
        Valoraciones externas
      </h2>

      <div className="flex flex-col gap-2.5">
        {ratings.map((rating) => (
          <div
            key={rating.platform}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30"
          >
            <div className="flex items-center gap-2.5">
              <div className={`flex items-center justify-center h-8 w-8 rounded-lg bg-secondary ${rating.color}`}>
                <Star className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-foreground">
                {rating.platform}
              </span>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className={`text-lg font-bold tabular-nums ${rating.color}`}>
                {rating.score}
              </span>
              <span className="text-xs text-muted-foreground">
                /{rating.maxScore}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
