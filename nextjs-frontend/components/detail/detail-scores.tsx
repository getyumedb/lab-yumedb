import { BarChart3, Eye, CheckCircle2, PauseCircle, XCircle, Clock } from "lucide-react"
import type { AnimeDetail } from "@/types"

const scoreLabels: Record<string, string> = {
  story: "Historia",
  animation: "Animacion",
  sound: "Sonido",
  character: "Personajes",
  enjoyment: "Disfrute",
  overall: "General",
}

function getScoreColor(score: number): string {
  if (score >= 9) return "bg-primary"
  if (score >= 8) return "bg-chart-2"
  if (score >= 7) return "bg-chart-3"
  return "bg-muted-foreground"
}

export function DetailScores({ anime }: { anime: AnimeDetail }) {
  const totalStats =
    anime.stats.watching +
    anime.stats.completed +
    anime.stats.onHold +
    anime.stats.dropped +
    anime.stats.planToWatch

  const statItems = [
    {
      label: "Viendo",
      value: anime.stats.watching,
      icon: Eye,
      color: "text-chart-2",
      bgColor: "bg-chart-2",
    },
    {
      label: "Completado",
      value: anime.stats.completed,
      icon: CheckCircle2,
      color: "text-chart-5",
      bgColor: "bg-chart-5",
    },
    {
      label: "En pausa",
      value: anime.stats.onHold,
      icon: PauseCircle,
      color: "text-chart-3",
      bgColor: "bg-chart-3",
    },
    {
      label: "Abandonado",
      value: anime.stats.dropped,
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive",
    },
    {
      label: "Pendiente",
      value: anime.stats.planToWatch,
      icon: Clock,
      color: "text-muted-foreground",
      bgColor: "bg-muted-foreground",
    },
  ]

  return (
    <section className="bg-card rounded-xl border border-border/50 p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold font-display text-foreground mb-5">
        <BarChart3 className="h-5 w-5 text-primary" />
        Puntuaciones
      </h2>

      {/* Score bars */}
      <div className="flex flex-col gap-3">
        {Object.entries(anime.scores).map(([key, value]) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-24 shrink-0">
              {scoreLabels[key]}
            </span>
            <div className="flex-1 h-2.5 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${getScoreColor(value)}`}
                style={{ width: `${(value / 10) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-foreground w-8 text-right tabular-nums">
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* User stats */}
      <div className="mt-6 pt-6 border-t border-border/50">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Estadisticas de usuarios ({totalStats.toLocaleString()} total)
        </h3>
        <div className="flex flex-col gap-2.5">
          {statItems.map((stat) => {
            const percentage = totalStats > 0 ? (stat.value / totalStats) * 100 : 0
            return (
              <div key={stat.label} className="flex items-center gap-3">
                <stat.icon className={`h-4 w-4 ${stat.color} shrink-0`} />
                <span className="text-sm text-muted-foreground w-24 shrink-0">
                  {stat.label}
                </span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stat.bgColor}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-16 text-right tabular-nums">
                  {stat.value.toLocaleString()}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
