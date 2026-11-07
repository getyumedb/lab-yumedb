"use client"

import { useMemo, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, SlidersHorizontal, X, ChevronDown, RotateCcw } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnimeCard } from "@/components/anime-card"
import { getMockAnimes, genres, seasons, years, formats, statuses, studios } from "@/lib/mock/anime.mock"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { ViewModeToggle, useViewMode } from "@/components/view-mode-toggle"

function useFilterParams() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const get = (key: string) => searchParams.get(key) || ""
  const getAll = (key: string) => searchParams.get(key)?.split(",").filter(Boolean) || []

  const set = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  const toggle = (key: string, value: string) => {
    const current = getAll(key)
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    set(key, updated.join(","))
  }

  const reset = () => {
    router.replace("/anime", { scroll: false })
  }

  return { get, getAll, set, toggle, reset }
}

function AnimeListPageContent() {
  const filters = useFilterParams()
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [searchInput, setSearchInput] = useState(filters.get("q"))
  const [viewMode] = useViewMode("yumedb-view-mode-anime")

  const nameQuery = filters.get("q")
  const selectedGenres = filters.getAll("genres")
  const selectedYear = filters.get("year")
  const selectedSeason = filters.get("season")
  const selectedFormat = filters.get("format")
  const selectedStatus = filters.get("status")
  const selectedStudio = filters.get("studio")
  const sortBy = filters.get("sort") || "rating"

  const filteredAnime = useMemo(() => {
    let result = [...getMockAnimes()]

    if (nameQuery) {
      const q = nameQuery.toLowerCase()
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.titleJp.toLowerCase().includes(q)
      )
    }
    if (selectedGenres.length > 0) {
      result = result.filter((a) =>
        selectedGenres.some((g) => a.genres.includes(g))
      )
    }
    if (selectedYear) {
      result = result.filter((a) => a.year === Number(selectedYear))
    }
    if (selectedSeason) {
      result = result.filter((a) => a.season === selectedSeason)
    }
    if (selectedFormat) {
      result = result.filter((a) => a.type === selectedFormat)
    }
    if (selectedStatus) {
      result = result.filter((a) => a.status === selectedStatus)
    }
    if (selectedStudio) {
      result = result.filter((a) => a.studio === selectedStudio)
    }

    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "name":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "year":
        result.sort((a, b) => b.year - a.year)
        break
      case "episodes":
        result.sort((a, b) => b.episodes - a.episodes)
        break
    }

    return result
  }, [nameQuery, selectedGenres, selectedYear, selectedSeason, selectedFormat, selectedStatus, selectedStudio, sortBy])

  const { displayedItems, hasMore, sentinelRef, totalCount } = useInfiniteScroll({
    data: filteredAnime,
    pageSize: 12,
  })

  const hasActiveFilters =
    nameQuery || selectedGenres.length > 0 || selectedYear || selectedSeason || selectedFormat || selectedStatus || selectedStudio

  const handleSearch = () => {
    filters.set("q", searchInput)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-foreground text-balance">
            Explorar Anime
          </h1>
          <p className="text-muted-foreground mt-1">
            Descubre entre {getMockAnimes().length} titulos disponibles
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Search + main filters row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search input */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                onBlur={handleSearch}
                className="w-full pl-10 pr-4 py-2.5 bg-card text-sm text-foreground placeholder:text-muted-foreground rounded-lg border border-border/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
              />
            </div>

            {/* Genre multi-select */}
            <FilterDropdown
              label="Generos"
              options={genres}
              selected={selectedGenres}
              onToggle={(v) => filters.toggle("genres", v)}
              multi
            />

            {/* Year */}
            <FilterDropdown
              label="Ano"
              options={years.map(String)}
              selected={selectedYear ? [selectedYear] : []}
              onToggle={(v) => filters.set("year", selectedYear === v ? "" : v)}
            />

            {/* Season */}
            <FilterDropdown
              label="Temporada"
              options={seasons}
              selected={selectedSeason ? [selectedSeason] : []}
              onToggle={(v) => filters.set("season", selectedSeason === v ? "" : v)}
            />

            {/* Format */}
            <FilterDropdown
              label="Formato"
              options={formats}
              selected={selectedFormat ? [selectedFormat] : []}
              onToggle={(v) => filters.set("format", selectedFormat === v ? "" : v)}
            />

            {/* More filters button */}
            <button
              type="button"
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg border transition-colors ${
                showMoreFilters
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "bg-card text-muted-foreground border-border/50 hover:text-foreground hover:border-border"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Mas filtros
            </button>

            {/* Reset */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  filters.reset()
                  setSearchInput("")
                }}
                className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Limpiar
              </button>
            )}
          </div>

          {/* More filters panel */}
          {showMoreFilters && (
            <div className="flex flex-wrap items-center gap-3 p-4 bg-card rounded-xl border border-border/50">
              <FilterDropdown
                label="Estado"
                options={statuses}
                selected={selectedStatus ? [selectedStatus] : []}
                onToggle={(v) => filters.set("status", selectedStatus === v ? "" : v)}
              />
              <FilterDropdown
                label="Estudio"
                options={studios}
                selected={selectedStudio ? [selectedStudio] : []}
                onToggle={(v) => filters.set("studio", selectedStudio === v ? "" : v)}
              />
              <FilterDropdown
                label="Ordenar por"
                options={["rating", "name", "year", "episodes"]}
                labels={["Rating", "Nombre", "Ano", "Episodios"]}
                selected={[sortBy]}
                onToggle={(v) => filters.set("sort", v)}
              />
            </div>
          )}

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {nameQuery && (
                <FilterChip label={`"${nameQuery}"`} onRemove={() => { filters.set("q", ""); setSearchInput("") }} />
              )}
              {selectedGenres.map((g) => (
                <FilterChip key={g} label={g} onRemove={() => filters.toggle("genres", g)} />
              ))}
              {selectedYear && (
                <FilterChip label={`Ano: ${selectedYear}`} onRemove={() => filters.set("year", "")} />
              )}
              {selectedSeason && (
                <FilterChip label={selectedSeason} onRemove={() => filters.set("season", "")} />
              )}
              {selectedFormat && (
                <FilterChip label={selectedFormat} onRemove={() => filters.set("format", "")} />
              )}
              {selectedStatus && (
                <FilterChip label={selectedStatus} onRemove={() => filters.set("status", "")} />
              )}
              {selectedStudio && (
                <FilterChip label={selectedStudio} onRemove={() => filters.set("studio", "")} />
              )}
            </div>
          )}
        </div>

        {/* Results count + view toggle */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {totalCount} {totalCount === 1 ? "resultado" : "resultados"}
            {hasActiveFilters ? " encontrados" : ""}
          </p>
          <ViewModeToggle storageKey="yumedb-view-mode-anime" />
        </div>

        {/* Anime grid */}
        {displayedItems.length > 0 ? (
          <div
            className={
              viewMode === "list"
                ? "flex flex-col gap-3"
                : viewMode === "large"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6"
                  : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 gap-y-6"
            }
          >
            {displayedItems.map((anime) => (
              <AnimeCard
                key={anime.id}
                anime={anime}
                variant={viewMode === "list" ? "wide" : "default"}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium text-foreground">No se encontraron resultados</p>
            <p className="text-sm text-muted-foreground mt-1">
              Intenta ajustar los filtros de busqueda
            </p>
            <button
              type="button"
              onClick={() => {
                filters.reset()
                setSearchInput("")
              }}
              className="mt-4 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-10" />
        {hasMore && (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

/* ── Filter dropdown component ── */
function FilterDropdown({
  label,
  options,
  labels,
  selected,
  onToggle,
  multi = false,
}: {
  label: string
  options: string[]
  labels?: string[]
  selected: string[]
  onToggle: (value: string) => void
  multi?: boolean
}) {
  const [open, setOpen] = useState(false)
  const hasSelection = selected.length > 0 && !(selected.length === 1 && selected[0] === "")

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg border transition-colors ${
          hasSelection
            ? "bg-primary/10 text-primary border-primary/30"
            : "bg-card text-muted-foreground border-border/50 hover:text-foreground hover:border-border"
        }`}
      >
        {label}
        {hasSelection && multi && (
          <span className="flex items-center justify-center h-5 min-w-[20px] px-1 text-[10px] font-bold bg-primary text-primary-foreground rounded-full">
            {selected.length}
          </span>
        )}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-50 w-56 max-h-64 overflow-y-auto bg-card border border-border rounded-xl shadow-xl shadow-background/80 py-1">
            {options.map((option, i) => {
              const displayLabel = labels ? labels[i] : option
              const isSelected = selected.includes(option)
              return (
                <button
                  type="button"
                  key={option}
                  onClick={() => {
                    onToggle(option)
                    if (!multi) setOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors ${
                    isSelected
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {multi && (
                    <span
                      className={`flex items-center justify-center h-4 w-4 rounded border text-[10px] shrink-0 ${
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border"
                      }`}
                    >
                      {isSelected && "\u2713"}
                    </span>
                  )}
                  {!multi && isSelected && (
                    <span className="h-1.5 w-1.5 bg-primary rounded-full shrink-0" />
                  )}
                  {displayLabel}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

/* ── Filter chip component ── */
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
      {label}
      <button type="button" onClick={onRemove} className="hover:text-primary/70 transition-colors">
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}

export default function AnimeListPage() {
  return (
    <Suspense fallback={null}>
      <AnimeListPageContent />
    </Suspense>
  )
}
