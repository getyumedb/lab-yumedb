import { MonitorPlay, ExternalLink } from "lucide-react"
import type { AnimeDetail } from "@/types"
import { getStreamingForAnime } from "@/lib/streaming-data"

export function DetailStreamingPlatforms({ anime }: { anime: AnimeDetail }) {
  const platforms = getStreamingForAnime(anime.licensors)

  if (platforms.length === 0) return null

  return (
    <section className="bg-card rounded-xl border border-border/50 p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold font-display text-foreground mb-4">
        <MonitorPlay className="h-5 w-5 text-primary" />
        Streaming
      </h2>

      <div className="flex flex-col gap-2">
        {platforms.map((platform) => (
          <a
            key={platform.id}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30 hover:border-primary/20 hover:bg-secondary/50 transition-all"
          >
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0"
              style={{ backgroundColor: platform.color, color: platform.textColor }}
            >
              {platform.icon}
            </div>
            <span className="flex-1 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              {platform.name}
            </span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </a>
        ))}
      </div>
    </section>
  )
}
