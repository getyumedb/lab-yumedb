import { Music, Building2, Shield } from "lucide-react"
import type { AnimeDetail } from "@/types"

export function DetailStaffThemes({ anime }: { anime: AnimeDetail }) {
  return (
    <div className="flex flex-col gap-6">

      {/* Production info */}
      <section className="bg-card rounded-xl border border-border/50 p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold font-display text-foreground mb-4">
          <Building2 className="h-5 w-5 text-primary" />
          Produccion
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Productores
            </h3>
            <div className="flex flex-wrap gap-2">
              {anime.producers.map((p) => (
                <span
                  key={p}
                  className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-lg border border-border/50"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Licenciatarios
            </h3>
            <div className="flex flex-wrap gap-2">
              {anime.licensors.map((l) => (
                <span
                  key={l}
                  className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-lg border border-border/50"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-border/30">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Clasificacion:{" "}
              <span className="text-foreground font-medium">
                {anime.ageRating}
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Music themes */}
      <section className="bg-card rounded-xl border border-border/50 p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold font-display text-foreground mb-4">
          <Music className="h-5 w-5 text-primary" />
          Temas musicales
        </h2>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Opening
          </h3>
          <div className="flex flex-col gap-2 mb-5">
            {anime.openingThemes.map((theme) => (
              <div
                key={theme}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30"
              >
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Music className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-foreground">{theme}</p>
              </div>
            ))}
          </div>

          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Ending
          </h3>
          <div className="flex flex-col gap-2">
            {anime.endingThemes.map((theme) => (
              <div
                key={theme}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30"
              >
                <div className="h-8 w-8 rounded-lg bg-chart-2/10 flex items-center justify-center shrink-0">
                  <Music className="h-4 w-4 text-chart-2" />
                </div>
                <p className="text-sm text-foreground">{theme}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
