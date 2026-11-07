"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Mic, Briefcase, UserCircle, ChevronRight, Search, X, SlidersHorizontal } from "lucide-react"
import type { PersonDetail } from "@/types"
import { getMockAnimes } from "@/lib/mock/anime.mock"
import { ViewModeToggle, useViewMode } from "@/components/view-mode-toggle"
import { ImageWithFallback } from "@/components/image-with-fallback"

const INITIAL_COUNT = 6

/* ─── Voice Actor Roles ─── anime left | character right ─── */
export function PersonVoiceRoles({ person }: { person: Person }) {
  const voiceRoles = person.roles.filter((r) => r.role.startsWith("Voice Actor"))
  const [showAll, setShowAll] = useState(false)
  const [search, setSearch] = useState("")
  const [yearFilter, setYearFilter] = useState("")
  const [genreFilter, setGenreFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [viewMode] = useViewMode("person-va-view", "list")

  // Enrich with anime data and pair with character
  const enriched = useMemo(() => {
    return voiceRoles.map((role) => {
      const anime = getMockAnimes().find((a) => a.id === role.animeId)
      // Extract character name from role string e.g. "Voice Actor - Kaito Himura"
      const characterName = role.role.replace("Voice Actor - ", "").replace("Voice Actor", "").trim()
      // Find matching character data
      const charData = person.characters?.find(
        (c) => c.animeName === role.animeName || c.characterName === characterName,
      )
      return {
        ...role,
        characterName: charData?.characterName || characterName || "Desconocido",
        characterImage: charData?.characterImage || "",
        characterId: charData?.characterId,
        year: anime?.year,
        genres: anime?.genres ?? [],
        type: anime?.type,
      }
    })
  }, [voiceRoles, person.characters])

  const uniqueYears = useMemo(
    () => [...new Set(enriched.map((r) => r.year).filter(Boolean))].sort((a, b) => (b ?? 0) - (a ?? 0)),
    [enriched],
  )
  const uniqueGenres = useMemo(
    () => [...new Set(enriched.flatMap((r) => r.genres))].sort(),
    [enriched],
  )
  const uniqueTypes = useMemo(
    () => [...new Set(enriched.map((r) => r.type).filter(Boolean))].sort(),
    [enriched],
  )

  const filtered = useMemo(() => {
    return enriched.filter((r) => {
      if (search && !r.animeName.toLowerCase().includes(search.toLowerCase()) && !r.characterName.toLowerCase().includes(search.toLowerCase())) return false
      if (yearFilter && String(r.year) !== yearFilter) return false
      if (genreFilter && !r.genres.includes(genreFilter)) return false
      if (typeFilter && r.type !== typeFilter) return false
      return true
    })
  }, [enriched, search, yearFilter, genreFilter, typeFilter])

  const displayed = showAll ? filtered : filtered.slice(0, INITIAL_COUNT)
  const hasActiveFilters = search || yearFilter || genreFilter || typeFilter

  if (voiceRoles.length === 0)
    return (
      <section>
        <h2 className="text-lg font-bold font-display text-foreground flex items-center gap-2 mb-4">
          <Mic className="h-5 w-5 text-primary" />
          Roles de Voz
        </h2>
        <div className="flex flex-col items-center justify-center py-10 bg-card rounded-xl border border-border/50 text-center">
          <Mic className="h-8 w-8 text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">No hay roles de voz registrados</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Esta persona no tiene participaciones como actor de voz</p>
        </div>
      </section>
    )

  function clearFilters() {
    setSearch("")
    setYearFilter("")
    setGenreFilter("")
    setTypeFilter("")
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold font-display text-foreground flex items-center gap-2">
          <Mic className="h-5 w-5 text-primary" />
          Roles de Voz ({filtered.length})
        </h2>
        <div className="flex items-center gap-2">
          <ViewModeToggle storageKey="person-va-view" defaultMode="list" />
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
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        filtersOpen={filtersOpen}
        onToggleFilters={() => setFiltersOpen(!filtersOpen)}
        hasActiveFilters={hasActiveFilters}
        onClear={clearFilters}
        placeholder="Buscar anime o personaje..."
      >
        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="filter-select">
          <option value="">Todos los anos</option>
          {uniqueYears.map((y) => <option key={y} value={String(y)}>{y}</option>)}
        </select>
        <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)} className="filter-select">
          <option value="">Todos los generos</option>
          {uniqueGenres.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="filter-select">
          <option value="">Todos los tipos</option>
          {uniqueTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </FilterBar>

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState message="No se encontraron roles de voz con los filtros seleccionados." />
      ) : viewMode === "list" ? (
        <div className="flex flex-col gap-3">
          {displayed.map((role) => (
            <div
              key={`${role.animeId}-${role.characterName}`}
              className="group flex items-stretch bg-card rounded-xl border border-border/50 hover:border-primary/20 transition-all overflow-hidden"
            >
              {/* Left: Anime */}
              <Link href={`/anime/${role.animeId}`} className="flex items-center gap-3 flex-1 p-3 hover:bg-secondary/30 transition-colors min-w-0">
                <div className="h-16 w-12 rounded-lg overflow-hidden shrink-0">
                  <ImageWithFallback src={role.animeImage} alt={role.animeName} className="h-full w-full object-cover" placeholderVariant="portrait" placeholderClassName="h-full w-full" placeholderLabel="" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{role.animeName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {role.year && <span className="text-xs text-muted-foreground">{role.year}</span>}
                    {role.type && <span className="text-[10px] px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded">{role.type}</span>}
                  </div>
                </div>
              </Link>

              {/* Divider */}
              <div className="w-px bg-border/50 my-2" />

              {/* Right: Character */}
              <Link
                href={role.characterId ? `/characters/${role.characterId}` : "#"}
                className="flex items-center gap-3 flex-1 p-3 hover:bg-secondary/30 transition-colors min-w-0 flex-row-reverse"
              >
                <div className="h-12 w-12 rounded-full overflow-hidden shrink-0 border border-border/50">
                  <ImageWithFallback src={role.characterImage} alt={role.characterName} className="h-full w-full object-cover" placeholderVariant="circle" placeholderClassName="h-full w-full" placeholderLabel="" />
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-sm font-medium text-foreground truncate">{role.characterName}</p>
                  <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded">Personaje</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {displayed.map((role) => (
            <div key={`${role.animeId}-${role.characterName}`} className="bg-card rounded-xl border border-border/50 overflow-hidden">
              <Link href={`/anime/${role.animeId}`} className="block">
                <div className="aspect-[3/4] overflow-hidden">
                  <ImageWithFallback src={role.animeImage} alt={role.animeName} className="h-full w-full object-cover hover:scale-105 transition-transform duration-300" placeholderVariant="portrait" placeholderClassName="h-full w-full" placeholderLabel="" />
                </div>
              </Link>
              <div className="p-2.5">
                <Link href={`/anime/${role.animeId}`}>
                  <p className="text-xs font-medium text-foreground hover:text-primary transition-colors line-clamp-1">{role.animeName}</p>
                </Link>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="h-6 w-6 rounded-full overflow-hidden shrink-0 border border-border/50">
                    <ImageWithFallback src={role.characterImage} alt="" className="h-full w-full object-cover" placeholderVariant="circle" placeholderClassName="h-full w-full" placeholderLabel="" />
                  </div>
                  <span className="text-[10px] text-muted-foreground truncate">{role.characterName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {displayed.map((role) => (
            <div key={`${role.animeId}-${role.characterName}`} className="group flex gap-4 p-3 bg-card rounded-xl border border-border/50 hover:border-primary/20 transition-all">
              <Link href={`/anime/${role.animeId}`} className="w-20 aspect-[3/4] rounded-lg overflow-hidden shrink-0">
                <ImageWithFallback src={role.animeImage} alt={role.animeName} className="h-full w-full object-cover" placeholderVariant="portrait" placeholderClassName="h-full w-full" placeholderLabel="" />
              </Link>
              <div className="flex-1 min-w-0 py-1">
                <Link href={`/anime/${role.animeId}`}>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">{role.animeName}</p>
                </Link>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 border border-border/50">
                    <ImageWithFallback src={role.characterImage} alt="" className="h-full w-full object-cover" placeholderVariant="circle" placeholderClassName="h-full w-full" placeholderLabel="" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{role.characterName}</p>
                    <span className="text-[10px] text-muted-foreground">{role.year} {role.type && `- ${role.type}`}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

/* ─── Staff Roles ─── */
export function PersonStaffRoles({ roles }: { roles: Person["roles"]; staffRoles?: Person["staffRoles"] }) {
  // Staff roles are from person.staffRoles; also include non-VA roles from person.roles
  // We receive the parent's staffRoles merged
  return <StaffRolesInner roles={roles} />
}

function StaffRolesInner({ roles }: { roles: Person["roles"] }) {
  const [showAll, setShowAll] = useState(false)
  const [search, setSearch] = useState("")
  const [viewMode] = useViewMode("person-staff-view", "list")

  // Separate non-VA roles
  const staffOnly = useMemo(() => roles.filter((r) => !r.role.startsWith("Voice Actor")), [roles])

  const filtered = useMemo(() => {
    if (!search) return staffOnly
    return staffOnly.filter((r) => r.animeName.toLowerCase().includes(search.toLowerCase()))
  }, [staffOnly, search])

  const displayed = showAll ? filtered : filtered.slice(0, INITIAL_COUNT)

  if (staffOnly.length === 0)
    return (
      <section>
        <h2 className="text-lg font-bold font-display text-foreground flex items-center gap-2 mb-4">
          <Briefcase className="h-5 w-5 text-primary" />
          Posiciones Staff
        </h2>
        <div className="flex flex-col items-center justify-center py-10 bg-card rounded-xl border border-border/50 text-center">
          <Briefcase className="h-8 w-8 text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">No hay posiciones staff registradas</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Esta persona no tiene participaciones como staff</p>
        </div>
      </section>
    )

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold font-display text-foreground flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          Posiciones Staff ({filtered.length})
        </h2>
        <div className="flex items-center gap-2">
          <ViewModeToggle storageKey="person-staff-view" defaultMode="list" />
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

      {staffOnly.length > 3 && (
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar anime..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-secondary/50 border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState message="No se encontraron posiciones staff." />
      ) : viewMode === "list" ? (
        <div className="flex flex-col gap-3">
          {displayed.map((role) => (
            <Link
              key={`${role.animeId}-${role.role}`}
              href={`/anime/${role.animeId}`}
              className="group flex items-center gap-4 p-3 bg-card rounded-xl border border-border/50 hover:border-primary/30 transition-all"
            >
              <div className="h-16 w-12 rounded-lg overflow-hidden shrink-0">
                <ImageWithFallback src={role.animeImage} alt={role.animeName} className="h-full w-full object-cover" placeholderVariant="portrait" placeholderClassName="h-full w-full" placeholderLabel="" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{role.animeName}</p>
                <span className="mt-1 inline-block px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded">{role.role}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {displayed.map((role) => (
            <Link key={`${role.animeId}-${role.role}`} href={`/anime/${role.animeId}`} className="group flex flex-col">
              <div className="aspect-[3/4] rounded-lg overflow-hidden border border-border/50 group-hover:border-primary/30 transition-all">
                <ImageWithFallback src={role.animeImage} alt={role.animeName} className="h-full w-full object-cover" placeholderVariant="portrait" placeholderClassName="h-full w-full" placeholderLabel="" />
              </div>
              <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors mt-1.5 line-clamp-2">{role.animeName}</p>
              <span className="text-[10px] text-muted-foreground mt-0.5">{role.role}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {displayed.map((role) => (
            <Link key={`${role.animeId}-${role.role}`} href={`/anime/${role.animeId}`} className="group flex gap-4 p-3 bg-card rounded-xl border border-border/50 hover:border-primary/30 transition-all">
              <div className="w-20 aspect-[3/4] rounded-lg overflow-hidden shrink-0">
                <ImageWithFallback src={role.animeImage} alt={role.animeName} className="h-full w-full object-cover" placeholderVariant="portrait" placeholderClassName="h-full w-full" placeholderLabel="" />
              </div>
              <div className="flex-1 min-w-0 py-1">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">{role.animeName}</p>
                <span className="mt-2 inline-block px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded">{role.role}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

/* ─── Characters ─── */
export function PersonCharacters({ characters }: { characters: NonNullable<Person["characters"]> }) {
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? characters : characters.slice(0, INITIAL_COUNT)

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold font-display text-foreground flex items-center gap-2">
          <UserCircle className="h-5 w-5 text-primary" />
          Personajes interpretados ({characters.length})
        </h2>
        {characters.length > INITIAL_COUNT && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            {showAll ? "Mostrar menos" : `Ver todos (${characters.length})`}
            <ChevronRight className={`h-4 w-4 transition-transform ${showAll ? "rotate-90" : ""}`} />
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {displayed.map((char) => (
          <Link
            key={char.characterId}
            href={`/characters/${char.characterId}`}
            className="group flex items-center gap-4 p-3 bg-card rounded-xl border border-border/50 hover:border-primary/30 transition-all"
          >
            <div className="h-14 w-14 rounded-full overflow-hidden shrink-0">
              <ImageWithFallback src={char.characterImage} alt={char.characterName} className="h-full w-full object-cover" placeholderVariant="circle" placeholderClassName="h-full w-full" placeholderLabel="" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                {char.characterName}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{char.animeName}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ─── Shared Filter Bar ─── */
function FilterBar({
  search,
  onSearchChange,
  filtersOpen,
  onToggleFilters,
  hasActiveFilters,
  onClear,
  placeholder,
  children,
}: {
  search: string
  onSearchChange: (v: string) => void
  filtersOpen: boolean
  onToggleFilters: () => void
  hasActiveFilters: boolean
  onClear: () => void
  placeholder: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={placeholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-secondary/50 border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>
        <button
          type="button"
          onClick={onToggleFilters}
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
            onClick={onClear}
            className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground bg-secondary/50 border border-border/50 rounded-lg transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Limpiar</span>
          </button>
        )}
      </div>

      {filtersOpen && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-card rounded-xl border border-border/50 [&_.filter-select]:px-3 [&_.filter-select]:py-2 [&_.filter-select]:text-sm [&_.filter-select]:bg-secondary/50 [&_.filter-select]:border [&_.filter-select]:border-border/50 [&_.filter-select]:rounded-lg [&_.filter-select]:text-foreground [&_.filter-select]:focus:outline-none [&_.filter-select]:focus:ring-2 [&_.filter-select]:focus:ring-primary/30">
          {children}
        </div>
      )}
    </div>
  )
}

/* ─── Empty State ─── */
function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-8 text-center text-sm text-muted-foreground">
      {message}
    </div>
  )
}
