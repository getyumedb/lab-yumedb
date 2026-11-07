"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Film, Search, X, SlidersHorizontal, ChevronRight } from "lucide-react"
import type { CompanyDetail } from "@/types"
import { getMockAnimes } from "@/lib/mock/anime.mock"
import { ViewModeToggle, useViewMode } from "@/components/view-mode-toggle"
import { ImageWithFallback } from "@/components/image-with-fallback"

const INITIAL_COUNT = 6

interface CompanyProductionsProps {
  productions: Company["animeProductions"]
}

export function CompanyProductions({ productions }: CompanyProductionsProps) {
  const [showAll, setShowAll] = useState(false)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [yearFilter, setYearFilter] = useState("")
  const [genreFilter, setGenreFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [viewMode] = useViewMode("company-productions-view", "list")

  // Enrich productions with anime data
  const enriched = useMemo(() => {
    return productions.map((prod) => {
      const anime = getMockAnimes().find((a) => a.id === prod.animeId)
      return {
        ...prod,
        genres: anime?.genres ?? [],
        type: anime?.type,
      }
    })
  }, [productions])

  // Extract unique filter values
  const uniqueRoles = useMemo(
    () => [...new Set(productions.map((p) => p.role))].sort(),
    [productions],
  )
  const uniqueYears = useMemo(
    () => [...new Set(productions.map((p) => p.year))].sort((a, b) => b - a),
    [productions],
  )
  const uniqueGenres = useMemo(
    () => [...new Set(enriched.flatMap((p) => p.genres))].sort(),
    [enriched],
  )
  const uniqueTypes = useMemo(
    () => [...new Set(enriched.map((p) => p.type).filter(Boolean))].sort(),
    [enriched],
  )

  // Filter
  const filtered = useMemo(() => {
    return enriched.filter((prod) => {
      if (search && !prod.animeName.toLowerCase().includes(search.toLowerCase())) return false
      if (roleFilter && prod.role !== roleFilter) return false
      if (yearFilter && String(prod.year) !== yearFilter) return false
      if (genreFilter && !prod.genres.includes(genreFilter)) return false
      if (typeFilter && prod.type !== typeFilter) return false
      return true
    })
  }, [enriched, search, roleFilter, yearFilter, genreFilter, typeFilter])

  const displayed = showAll ? filtered : filtered.slice(0, INITIAL_COUNT)
  const hasActiveFilters = search || roleFilter || yearFilter || genreFilter || typeFilter

  function clearFilters() {
    setSearch("")
    setRoleFilter("")
    setYearFilter("")
    setGenreFilter("")
    setTypeFilter("")
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold font-display text-foreground flex items-center gap-2">
          <Film className="h-5 w-5 text-primary" />
          Producciones ({filtered.length})
        </h2>
        <div className="flex items-center gap-2">
          <ViewModeToggle storageKey="company-productions-view" defaultMode="list" />
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

      {/* Filter bar */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre de anime..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-secondary/50 border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-colors ${
              filtersOpen || hasActiveFilters
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-secondary/50 text-muted-foreground border-border/50 hover:text-foreground"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filtros</span>
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground bg-secondary/50 border border-border/50 rounded-lg transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Limpiar</span>
            </button>
          )}
        </div>

        {filtersOpen && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-card rounded-xl border border-border/50">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-secondary/50 border border-border/50 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Todos los roles</option>
              {uniqueRoles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-secondary/50 border border-border/50 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Todos los anos</option>
              {uniqueYears.map((y) => (
                <option key={y} value={String(y)}>{y}</option>
              ))}
            </select>
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-secondary/50 border border-border/50 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Todos los generos</option>
              {uniqueGenres.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-secondary/50 border border-border/50 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Todos los tipos</option>
              {uniqueTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No se encontraron producciones con los filtros seleccionados.
        </div>
      ) : viewMode === "list" ? (
        <div className="flex flex-col gap-3">
          {displayed.map((prod) => (
            <Link
              key={prod.animeId}
              href={`/anime/${prod.animeId}`}
              className="group flex items-center gap-4 p-3 bg-card rounded-xl border border-border/50 hover:border-primary/30 transition-all"
            >
              <div className="h-16 w-12 rounded-lg overflow-hidden shrink-0">
                <ImageWithFallback src={prod.animeImage} alt={prod.animeName} className="h-full w-full object-cover" placeholderVariant="portrait" placeholderClassName="h-full w-full" placeholderLabel="" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                  {prod.animeName}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded">{prod.role}</span>
                  <span className="text-xs text-muted-foreground">{prod.year}</span>
                  {prod.type && (
                    <span className="text-xs text-muted-foreground">{prod.type}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {displayed.map((prod) => (
            <Link
              key={prod.animeId}
              href={`/anime/${prod.animeId}`}
              className="group flex flex-col"
            >
              <div className="aspect-[3/4] rounded-lg overflow-hidden border border-border/50 group-hover:border-primary/30 transition-all">
                <ImageWithFallback src={prod.animeImage} alt={prod.animeName} className="h-full w-full object-cover" placeholderVariant="portrait" placeholderClassName="h-full w-full" placeholderLabel="" />
              </div>
              <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors mt-1.5 line-clamp-2">
                {prod.animeName}
              </p>
              <span className="text-[10px] text-muted-foreground mt-0.5">{prod.role} - {prod.year}</span>
            </Link>
          ))}
        </div>
      ) : (
        /* large view */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {displayed.map((prod) => (
            <Link
              key={prod.animeId}
              href={`/anime/${prod.animeId}`}
              className="group flex gap-4 p-3 bg-card rounded-xl border border-border/50 hover:border-primary/30 transition-all"
            >
              <div className="w-20 aspect-[3/4] rounded-lg overflow-hidden shrink-0">
                <ImageWithFallback src={prod.animeImage} alt={prod.animeName} className="h-full w-full object-cover" placeholderVariant="portrait" placeholderClassName="h-full w-full" placeholderLabel="" />
              </div>
              <div className="flex-1 min-w-0 py-1">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {prod.animeName}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded">{prod.role}</span>
                  <span className="text-xs text-muted-foreground">{prod.year}</span>
                  {prod.type && (
                    <span className="px-2 py-0.5 text-[10px] bg-secondary text-secondary-foreground rounded">{prod.type}</span>
                  )}
                </div>
                {prod.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {prod.genres.slice(0, 3).map((g) => (
                      <span key={g} className="text-[10px] text-muted-foreground">{g}</span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
