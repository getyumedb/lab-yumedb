"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Film, UserCircle, Users, Building2, Star } from "lucide-react"
import { getMockAnimes } from "@/lib/mock/anime.mock"
import { getMockCharacters } from "@/lib/mock/character.mock"
import { getMockPeople } from "@/lib/mock/person.mock"
import { getMockCompanies } from "@/lib/mock/company.mock"
import { ImageWithFallback } from "@/components/image-with-fallback"

interface SearchResult {
  id: number
  title: string
  subtitle: string
  image: string
  href: string
  category: "anime" | "character" | "person" | "company"
  extra?: string
}

function getCategoryIcon(category: SearchResult["category"]) {
  switch (category) {
    case "anime":
      return <Film className="h-4 w-4" />
    case "character":
      return <UserCircle className="h-4 w-4" />
    case "person":
      return <Users className="h-4 w-4" />
    case "company":
      return <Building2 className="h-4 w-4" />
  }
}

function getCategoryLabel(category: SearchResult["category"]) {
  switch (category) {
    case "anime":
      return "Anime"
    case "character":
      return "Personajes"
    case "person":
      return "Personas"
    case "company":
      return "Companies"
  }
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()

  // Keyboard shortcut to open
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) && !open) {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === "Escape" && open) {
        setOpen(false)
        setQuery("")
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const results = useMemo<SearchResult[]>(() => {
    if (query.length < 2) return []
    const q = query.toLowerCase()
    const matches: SearchResult[] = []

    // Anime
    getMockAnimes()
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.titleJp.toLowerCase().includes(q) ||
          a.genres.some((g) => g.toLowerCase().includes(q))
      )
      .slice(0, 4)
      .forEach((a) =>
        matches.push({
          id: a.id,
          title: a.title,
          subtitle: a.titleJp,
          image: a.image,
          href: `/anime/${a.id}`,
          category: "anime",
          extra: `${a.rating} - ${a.type} - ${a.year}`,
        })
      )

    // Characters
    getMockCharacters()
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.nameJp.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .forEach((c) =>
        matches.push({
          id: c.id,
          title: c.name,
          subtitle: c.nameJp,
          image: c.image,
          href: `/characters/${c.id}`,
          category: "character",
          extra: c.animeAppearances[0]?.animeName,
        })
      )

    // People
    getMockPeople()
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameJp.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .forEach((p) =>
        matches.push({
          id: p.id,
          title: p.name,
          subtitle: p.nameJp,
          image: p.image,
          href: `/people/${p.id}`,
          category: "person",
          extra: p.type,
        })
      )

    // Companies
    getMockCompanies()
      .filter(
        (co) =>
          co.name.toLowerCase().includes(q) ||
          co.nameJp.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .forEach((co) =>
        matches.push({
          id: co.id,
          title: co.name,
          subtitle: co.nameJp,
          image: co.image,
          href: `/companies/${co.id}`,
          category: "company",
          extra: co.type,
        })
      )

    return matches
  }, [query])

  // Group by category
  const grouped = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {}
    for (const r of results) {
      if (!groups[r.category]) groups[r.category] = []
      groups[r.category].push(r)
    }
    return groups
  }, [results])

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [results])

  const navigate = useCallback(
    (href: string) => {
      setOpen(false)
      setQuery("")
      router.push(href)
    },
    [router]
  )

  // Keyboard navigation
  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault()
        navigate(results[selectedIndex].href)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, results, selectedIndex, navigate])

  let flatIndex = -1

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-secondary/50 hover:bg-secondary rounded-lg transition-colors border border-border/50"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Buscar...</span>
        <kbd className="hidden md:inline-flex h-5 items-center rounded border border-border/50 bg-background/50 px-1.5 text-[10px] text-muted-foreground">
          /
        </kbd>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => {
              setOpen(false)
              setQuery("")
            }}
          />
          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Buscar anime, personajes, personas, companies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-muted-foreground hover:text-foreground shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border/50 bg-secondary/50 px-1.5 text-[10px] text-muted-foreground shrink-0">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {query.length < 2 ? (
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
                    Busquedas populares
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Accion", "Romance", "Mecha", "Fantasia", "Sci-Fi"].map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="px-3 py-1.5 text-xs bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted-foreground/60">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 border border-border/50 rounded text-[9px]">{"↑↓"}</kbd> navegar
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 border border-border/50 rounded text-[9px]">Enter</kbd> seleccionar
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 border border-border/50 rounded text-[9px]">Esc</kbd> cerrar
                    </span>
                  </div>
                </div>
              ) : results.length === 0 ? (
                <div className="p-8 text-center">
                  <Search className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {"No se encontraron resultados para \"" + query + "\""}
                  </p>
                </div>
              ) : (
                Object.entries(grouped).map(([category, items]) => (
                  <div key={category}>
                    <div className="px-4 py-2 flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wide bg-secondary/30">
                      {getCategoryIcon(category as SearchResult["category"])}
                      {getCategoryLabel(category as SearchResult["category"])}
                    </div>
                    {items.map((item) => {
                      flatIndex++
                      const idx = flatIndex
                      return (
                        <button
                          type="button"
                          key={`${item.category}-${item.id}`}
                          onClick={() => navigate(item.href)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-colors ${
                            selectedIndex === idx
                              ? "bg-primary/10"
                              : "hover:bg-secondary/50"
                          }`}
                        >
                          <div className={`shrink-0 overflow-hidden ${
                            item.category === "character" || item.category === "person"
                              ? "h-10 w-10 rounded-full"
                              : "h-12 w-9 rounded-md"
                          }`}>
                            <ImageWithFallback
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-cover"
                              placeholderVariant={item.category === "character" || item.category === "person" ? "circle" : "portrait"}
                              placeholderClassName="h-full w-full"
                              placeholderLabel=""
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {item.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {item.subtitle}
                            </p>
                          </div>
                          {item.extra && (
                            <span className="shrink-0 text-xs text-muted-foreground flex items-center gap-1">
                              {item.category === "anime" && (
                                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              )}
                              {item.extra}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
