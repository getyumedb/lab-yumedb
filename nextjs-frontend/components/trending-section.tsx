"use client"

import { useRef } from "react"
import { TrendingUp, ChevronLeft, ChevronRight } from "lucide-react"
import { getMockAnimes } from "@/lib/mock/anime.mock"

const trending = getMockAnimes().filter((a) => a.status === "En emision")

export function TrendingSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 300
      scrollRef.current.scrollBy({
        left: dir === "left" ? -amount : amount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section id="explorar" className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-display text-foreground">
                Tendencias
              </h2>
              <p className="text-sm text-muted-foreground">Lo mas popular ahora mismo</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="p-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors border border-border/50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="p-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors border border-border/50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
        >
          {trending.map((anime) => (
            <div key={anime.id} className="shrink-0 w-40 md:w-52">
              <AnimeCard anime={anime} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
