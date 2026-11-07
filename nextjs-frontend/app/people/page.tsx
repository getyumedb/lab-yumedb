"use client"

import { useMemo, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { RotateCcw, Users } from "lucide-react"
import { SimpleDropdown } from "@/components/ui/simple-dropdown"
import { SearchInput } from "@/components/ui/search-input"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getMockPeople } from "@/lib/mock/person.mock"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { PersonCard } from "@/components/cards/person-card"
import { ViewModeToggle, useViewMode } from "@/components/view-mode-toggle"

const roleTypes = ["Voice Actor", "Director", "Animador", "Escritor", "Compositor"]
const sortOptions = [
  { value: "favorites", label: "Favoritos" },
  { value: "name", label: "Nombre" },
  { value: "roles", label: "Participaciones" },
]

function PeopleListPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "")
  const [viewMode] = useViewMode("yumedb-view-mode-people")
  const nameQuery = searchParams.get("q") || ""
  const selectedRole = searchParams.get("role") || ""
  const sortBy = searchParams.get("sort") || "favorites"

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  const reset = () => {
    router.replace("/people", { scroll: false })
    setSearchInput("")
  }

  const filtered = useMemo(() => {
    let result = [...getMockPeople()]
    if (nameQuery) {
      const q = nameQuery.toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.nameJp.toLowerCase().includes(q))
    }
    if (selectedRole) {
      result = result.filter((p) => p.type === selectedRole)
    }
    switch (sortBy) {
      case "favorites": result.sort((a, b) => b.favorites - a.favorites); break
      case "name": result.sort((a, b) => a.name.localeCompare(b.name)); break
      case "roles": result.sort((a, b) => b.roles.length - a.roles.length); break
    }
    return result
  }, [nameQuery, selectedRole, sortBy])

  const { displayedItems, hasMore, sentinelRef, totalCount } = useInfiniteScroll({ data: filtered, pageSize: 20 })
  const hasFilters = nameQuery || selectedRole

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-foreground text-balance">Personas</h1>
          <p className="text-muted-foreground mt-1">Voice actors, directores, compositores y mas</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <SearchInput
            value={searchInput}
            onChange={setSearchInput}
            onSubmit={() => setParam("q", searchInput)}
            placeholder="Buscar persona..."
          />

          <SimpleDropdown
            label="Rol"
            options={roleTypes}
            selected={selectedRole}
            onSelect={(v) => setParam("role", selectedRole === v ? "" : v)}
          />
          <SimpleDropdown
            label="Ordenar"
            options={sortOptions.map((s) => s.value)}
            labels={sortOptions.map((s) => s.label)}
            selected={sortBy}
            onSelect={(v) => setParam("sort", v)}
          />

          {hasFilters && (
            <button type="button" onClick={reset} className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <RotateCcw className="h-3.5 w-3.5" /> Limpiar
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">{totalCount} resultados</p>
          <ViewModeToggle storageKey="yumedb-view-mode-people" />
        </div>

        {displayedItems.length > 0 ? (
          <div
            className={
              viewMode === "list"
                ? "flex flex-col gap-3"
                : viewMode === "large"
                  ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 gap-y-8"
                  : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6"
            }
          >
            {displayedItems.map((person) => (
              <PersonCard
                key={person.id}
                id={person.id}
                name={person.name}
                nameJp={person.nameJp}
                image={person.image}
                type={person.type}
                rolesCount={person.roles.length}
                favorites={person.favorites}
                variant={viewMode}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="No se encontraron personas"
            description="Intenta ajustar los filtros"
          />
        )}

        <div ref={sentinelRef} className="h-10" />
        {hasMore && <LoadingSpinner />}
      </main>
      <Footer />
    </div>
  )
}

export default function PeopleListPage() {
  return (
    <Suspense fallback={null}>
      <PeopleListPageContent />
    </Suspense>
  )
}
