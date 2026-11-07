"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Mic, Search, ChevronRight } from "lucide-react"
import type { CharacterDetail } from "@/types"
import { ViewModeToggle, useViewMode } from "@/components/view-mode-toggle"
import { ImageWithFallback } from "@/components/image-with-fallback"

const INITIAL_COUNT = 6

export function CharacterVoiceActors({ voiceActors }: { voiceActors: CharacterDetail["voiceActors"] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterLanguage, setFilterLanguage] = useState("Todos")
  const [showAll, setShowAll] = useState(false)
  const [viewMode] = useViewMode("char-va-view", "list")

  const languages = useMemo(() => {
    const langs = Array.from(new Set(voiceActors.map((va) => va.language)))
    return ["Todos", ...langs.sort()]
  }, [voiceActors])

  const filtered = useMemo(() => {
    return voiceActors.filter((va) => {
      const matchesSearch = searchQuery === "" || va.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLang = filterLanguage === "Todos" || va.language === filterLanguage
      return matchesSearch && matchesLang
    })
  }, [voiceActors, searchQuery, filterLanguage])

  const displayed = showAll ? filtered : filtered.slice(0, INITIAL_COUNT)

  if (voiceActors.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold font-display text-foreground flex items-center gap-2">
          <Mic className="h-5 w-5 text-primary" />
          Actores de voz ({filtered.length})
        </h2>
        <div className="flex items-center gap-2">
          <ViewModeToggle storageKey="char-va-view" defaultMode="list" />
          {filtered.length > INITIAL_COUNT && (
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
            >
              {showAll ? "Mostrar menos" : `Ver todos (${filtered.length})`}
              <ChevronRight className={`h-4 w-4 transition-transform ${showAll ? "rotate-90" : ""}`} />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {voiceActors.length > 3 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar actor de voz..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowAll(true) }}
              className="w-full pl-9 pr-3 py-2 text-sm bg-secondary/50 border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
          {languages.length > 2 && (
            <select
              value={filterLanguage}
              onChange={(e) => { setFilterLanguage(e.target.value); setShowAll(true) }}
              className="px-3 py-2 text-sm bg-secondary/50 border border-border/50 rounded-lg text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/30 transition-all"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang === "Todos" ? "Todos los idiomas" : lang}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No se encontraron actores de voz con esos filtros.
        </div>
      ) : viewMode === "list" ? (
        <div className="flex flex-col gap-3">
          {displayed.map((va) => (
            <Link
              key={`${va.personId}-${va.language}`}
              href={`/people/${va.personId}`}
              className="group flex items-center gap-4 p-3 bg-card rounded-xl border border-border/50 hover:border-primary/30 transition-all"
            >
              <div className="h-14 w-14 rounded-full overflow-hidden shrink-0 border border-border/50">
                <ImageWithFallback src={va.image} alt={va.name} className="h-full w-full object-cover" placeholderVariant="circle" placeholderClassName="h-full w-full" placeholderLabel="" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                  {va.name}
                </p>
                <span className="px-2 py-0.5 mt-1 inline-block text-[10px] font-medium bg-primary/10 text-primary rounded">
                  {va.language}
                </span>
              </div>
              <Mic className="h-4 w-4 text-muted-foreground shrink-0" />
            </Link>
          ))}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {displayed.map((va) => (
            <Link key={`${va.personId}-${va.language}`} href={`/people/${va.personId}`} className="group flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full overflow-hidden border border-border/50 group-hover:border-primary/30 transition-all">
                <ImageWithFallback src={va.image} alt={va.name} className="h-full w-full object-cover" placeholderVariant="circle" placeholderClassName="h-full w-full" placeholderLabel="" />
              </div>
              <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors mt-2 line-clamp-2">{va.name}</p>
              <span className="text-[10px] text-muted-foreground mt-0.5">{va.language}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {displayed.map((va) => (
            <Link key={`${va.personId}-${va.language}`} href={`/people/${va.personId}`} className="group flex items-center gap-4 p-3 bg-card rounded-xl border border-border/50 hover:border-primary/30 transition-all">
              <div className="h-16 w-16 rounded-full overflow-hidden shrink-0 border border-border/50">
                <ImageWithFallback src={va.image} alt={va.name} className="h-full w-full object-cover" placeholderVariant="circle" placeholderClassName="h-full w-full" placeholderLabel="" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{va.name}</p>
                <span className="px-2 py-0.5 mt-1 inline-block text-[10px] font-medium bg-primary/10 text-primary rounded">{va.language}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
