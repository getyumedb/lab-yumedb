import { ExternalLink, Globe } from "lucide-react"
import type { AnimeDetail } from "@/types"

interface ExternalLinkItem {
  name: string
  url: string
  color: string
  icon: string
}

function getExternalLinks(anime: AnimeDetail): ExternalLinkItem[] {
  const slug = anime.title.toLowerCase().replace(/\s+/g, "-")
  return [
    {
      name: "MyAnimeList",
      url: `https://myanimelist.net/anime/${anime.id}`,
      color: "#2E51A2",
      icon: "MAL",
    },
    {
      name: "AniList",
      url: `https://anilist.co/anime/${anime.id}`,
      color: "#02A9FF",
      icon: "AL",
    },
    {
      name: "AniDB",
      url: `https://anidb.net/anime/${anime.id}`,
      color: "#562155",
      icon: "ADB",
    },
    {
      name: "Kitsu",
      url: `https://kitsu.app/anime/${slug}`,
      color: "#F75239",
      icon: "KT",
    },
    {
      name: "Sitio oficial",
      url: `https://${slug}.example.jp`,
      color: "#666666",
      icon: "WEB",
    },
  ]
}

export function DetailExternalLinks({ anime }: { anime: AnimeDetail }) {
  const links = getExternalLinks(anime)

  return (
    <section className="bg-card rounded-xl border border-border/50 p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold font-display text-foreground mb-4">
        <Globe className="h-5 w-5 text-primary" />
        Enlaces externos
      </h2>

      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30 hover:border-primary/20 hover:bg-secondary/50 transition-all"
          >
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0"
              style={{ backgroundColor: link.color, color: "#FFFFFF" }}
            >
              {link.icon}
            </div>
            <span className="flex-1 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              {link.name}
            </span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </a>
        ))}
      </div>
    </section>
  )
}
