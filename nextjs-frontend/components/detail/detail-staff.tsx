"use client"

import { useState } from "react"
import Link from "next/link"
import { Clapperboard, ChevronRight } from "lucide-react"
import type { AnimeDetail } from "@/types"
import { NoImagePlaceholder } from "@/components/no-image-placeholder"

const INITIAL_COUNT = 4

export function DetailStaff({ anime }: { anime: AnimeDetail }) {
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? anime.staff : anime.staff.slice(0, INITIAL_COUNT)

  return (
    <section className="bg-card rounded-xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="flex items-center gap-2 text-lg font-bold font-display text-foreground">
          <Clapperboard className="h-5 w-5 text-primary" />
          Staff
        </h2>
        {anime.staff.length > INITIAL_COUNT && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            {showAll ? "Mostrar menos" : `Ver todos (${anime.staff.length})`}
            <ChevronRight className={`h-4 w-4 transition-transform ${showAll ? "rotate-90" : ""}`} />
          </button>
        )}
      </div>

      <div className="grid gap-3">
        {displayed.map((member) => (
          <Link
            key={`${member.name}-${member.role}`}
            href={`/people/${encodeURIComponent(member.name.toLowerCase().replace(/\s+/g, "-"))}`}
            className="group flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/30 hover:border-primary/20 hover:bg-secondary/50 transition-all"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative h-14 w-14 rounded-lg overflow-hidden shrink-0 border border-border/50 bg-secondary">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden") }}
                  />
                ) : null}
                <NoImagePlaceholder
                  variant="square"
                  className={`h-full w-full border-0 absolute inset-0 ${member.image ? "hidden" : ""}`}
                  label=""
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {member.name}
                </p>
                {member.nameJp && (
                  <p className="text-xs text-muted-foreground truncate">{member.nameJp}</p>
                )}
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-primary/15 text-primary">
                  {member.role}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
