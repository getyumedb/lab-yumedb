"use client"

import { useState } from "react"
import { MessageSquare, Star, ThumbsUp, ChevronDown } from "lucide-react"
import type { AnimeDetail } from "@/types"

export function DetailReviews({ anime }: { anime: AnimeDetail }) {
  const [expandedReview, setExpandedReview] = useState<number | null>(null)

  return (
    <section className="bg-card rounded-xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="flex items-center gap-2 text-lg font-bold font-display text-foreground">
          <MessageSquare className="h-5 w-5 text-primary" />
          Reviews ({anime.reviews.length})
        </h2>
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Escribir review
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {anime.reviews.map((review) => {
          const isExpanded = expandedReview === review.id
          return (
            <div
              key={review.id}
              className="p-4 rounded-xl bg-secondary/30 border border-border/30"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {review.user}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {review.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 bg-card rounded-lg border border-border/50 shrink-0">
                  <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold text-foreground">
                    {review.rating}
                  </span>
                </div>
              </div>

              <div className="relative">
                <p
                  className={`text-sm text-muted-foreground leading-relaxed ${
                    !isExpanded ? "line-clamp-3" : ""
                  }`}
                >
                  {review.content}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/20">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedReview(isExpanded ? null : review.id)
                  }
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  {isExpanded ? "Menos" : "Leer mas"}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  {review.helpful} util
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
