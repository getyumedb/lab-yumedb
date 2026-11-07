import { Film, Users, Star, Tv } from "lucide-react"

const stats = [
  { label: "Animes", value: "12,847", icon: Film, description: "Titulos registrados" },
  { label: "Usuarios", value: "2.1M", icon: Users, description: "Comunidad activa" },
  { label: "Reviews", value: "890K", icon: Star, description: "Valoraciones" },
  { label: "Studios", value: "342", icon: Tv, description: "Studios de animacion" },
]

export function StatsSection() {
  return (
    <section className="py-10 border-y border-border/50 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
