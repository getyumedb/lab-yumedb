"use client"

import { useState } from "react"
import { Link2 } from "lucide-react"
import type { AnimeDetail } from "@/types"
import { ImageWithFallback } from "@/components/image-with-fallback"

export function DetailRelations({ anime }: { anime: AnimeDetail }) {
  if (!anime.relations.length) return null

  return (
    <section className="bg-card rounded-xl border border-border/50 p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold font-display text-foreground mb-5">
        <Link2 className="h-5 w-5 text-primary" />
        Relaciones
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {anime.relations.map((rel) => (
          <div
            key={rel.id}
            className="group flex gap-3 p-3 rounded-xl bg-secondary/30 border border-border/30 hover:border-primary/20 hover:bg-secondary/50 transition-all cursor-pointer"
          >
            <div className="h-20 w-14 rounded-lg overflow-hidden shrink-0 border border-border/50 bg-secondary">
              <ImageWithFallback
                src={rel.image}
                alt={rel.title}
                className="w-full h-full object-cover"
                placeholderVariant="portrait"
                placeholderClassName="h-full w-full border-0"
                placeholderLabel=""
              />
            </div>
            <div className="min-w-0 flex-1">
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 rounded mb-1.5">
                {rel.relation}
              </span>
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {rel.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {rel.type}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
