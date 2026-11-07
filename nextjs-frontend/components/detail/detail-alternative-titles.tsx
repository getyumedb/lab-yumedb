import { Languages } from "lucide-react"
import type { AnimeDetail } from "@/types"

export function DetailAlternativeTitles({ anime }: { anime: AnimeDetail }) {
  const titles = [
    { label: "JP", value: anime.titleJp },
    { label: "EN", value: anime.titleEn },
    { label: "RO", value: anime.titleRomaji },
  ].filter((t) => t.value)

  const hasSynonyms = anime.alternativeTitles && anime.alternativeTitles.length > 0

  if (titles.length === 0 && !hasSynonyms) return null

  return (
    <section className="bg-card rounded-xl border border-border/50 p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold font-display text-foreground mb-4">
        <Languages className="h-5 w-5 text-primary" />
        Titulos alternativos
      </h2>

      <div className="flex flex-col gap-2">
        {titles.map((t) => (
          <div key={t.label} className="flex items-start gap-2">
            <span className="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold tracking-wider bg-primary/10 text-primary rounded">
              {t.label}
            </span>
            <span className="text-sm text-foreground leading-relaxed">{t.value}</span>
          </div>
        ))}

        {hasSynonyms && (
          <>
            <div className="border-t border-border/30 my-1" />
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Sinonimos
              </span>
              <div className="flex flex-col gap-1">
                {anime.alternativeTitles.map((title) => (
                  <span key={title} className="text-sm text-muted-foreground leading-relaxed">
                    {title}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
