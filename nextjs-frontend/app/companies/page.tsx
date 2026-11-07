"use client"

import { useMemo, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Building2, RotateCcw } from "lucide-react"
import { SimpleDropdown } from "@/components/ui/simple-dropdown"
import { SearchInput } from "@/components/ui/search-input"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getMockCompanies } from "@/lib/mock/company.mock"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { CompanyCard } from "@/components/cards/company-card"
import { ViewModeToggle, useViewMode } from "@/components/view-mode-toggle"

const companyTypes = ["Studio", "Productor", "Licenciatario"]
const sortOptions = [
  { value: "name", label: "Nombre" },
  { value: "founded", label: "Fundado" },
  { value: "productions", label: "Producciones" },
  { value: "favorites", label: "Favoritos" },
]

function CompaniesListPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "")
  const [viewMode] = useViewMode("yumedb-view-mode-companies")
  const nameQuery = searchParams.get("q") || ""
  const selectedType = searchParams.get("type") || ""
  const sortBy = searchParams.get("sort") || "favorites"

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  const reset = () => {
    router.replace("/companies", { scroll: false })
    setSearchInput("")
  }

  const filtered = useMemo(() => {
    let result = [...getMockCompanies()]
    if (nameQuery) {
      const q = nameQuery.toLowerCase()
      result = result.filter((c) => c.name.toLowerCase().includes(q) || c.nameJp.toLowerCase().includes(q))
    }
    if (selectedType) {
      result = result.filter((c) => c.type === selectedType)
    }
    switch (sortBy) {
      case "name": result.sort((a, b) => a.name.localeCompare(b.name)); break
      case "founded": result.sort((a, b) => b.founded - a.founded); break
      case "productions": result.sort((a, b) => b.animeProductions.length - a.animeProductions.length); break
      case "favorites": result.sort((a, b) => b.favorites - a.favorites); break
    }
    return result
  }, [nameQuery, selectedType, sortBy])

  const { displayedItems, hasMore, sentinelRef, totalCount } = useInfiniteScroll({ data: filtered, pageSize: 12 })
  const hasFilters = nameQuery || selectedType

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-foreground text-balance">Companies</h1>
          <p className="text-muted-foreground mt-1">Estudios, productores y licenciatarios de anime</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <SearchInput
            value={searchInput}
            onChange={setSearchInput}
            onSubmit={() => setParam("q", searchInput)}
            placeholder="Buscar company..."
          />

          <SimpleDropdown
            label="Tipo"
            options={companyTypes}
            selected={selectedType}
            onSelect={(v) => setParam("type", selectedType === v ? "" : v)}
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
          <ViewModeToggle storageKey="yumedb-view-mode-companies" />
        </div>

        {displayedItems.length > 0 ? (
          <div
            className={
              viewMode === "list"
                ? "flex flex-col gap-3"
                : viewMode === "large"
                  ? "grid grid-cols-1 sm:grid-cols-2 gap-5"
                  : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            }
          >
            {displayedItems.map((company) => (
              <CompanyCard
                key={company.id}
                id={company.id}
                name={company.name}
                nameJp={company.nameJp}
                image={company.image}
                type={company.type}
                founded={company.founded}
                productionsCount={company.animeProductions.length}
                favorites={company.favorites}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Building2}
            title="No se encontraron companies"
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

export default function CompaniesListPage() {
  return (
    <Suspense fallback={null}>
      <CompaniesListPageContent />
    </Suspense>
  )
}
