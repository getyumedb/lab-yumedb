"use client"

import { useState, useEffect, use, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"
import { getMockAnimes } from "@/lib/mock/anime.mock"
import { ListIcon } from "@/lib/list-icons"
import { ImageWithFallback } from "@/components/image-with-fallback"
import { useActivityPosts, type ActivityFilter } from "@/hooks/use-activity-posts"
import {
  Tv,
  Film,
  Clock,
  Star,
  BarChart3,
  Heart,
  Calendar,
  MapPin,
  Settings,
  TrendingUp,
  BookOpen,
  Eye,
  Pause,
  XCircle,
  CheckCircle2,
  ListPlus,
  Activity,
  Search,
  LayoutGrid,
  LayoutList,
  SlidersHorizontal,
  X,
  ChevronDown,
  ArrowUpDown,
  FolderPlus,
  Pin,
  PinOff,
  Trash2,
  Send,
  Filter,
  ShieldAlert,
} from "lucide-react"

// ─── Mock user stats ──────────────────────────────────────────────
const userStats = {
  totalAnime: 247,
  episodesWatched: 4832,
  daysWatched: 67.2,
  meanScore: 7.4,
  totalManga: 89,
  chaptersRead: 2310,
  volumesRead: 198,
}

const statusBreakdown = [
  { label: "Viendo", count: 18, color: "bg-primary", icon: Eye },
  { label: "Completado", count: 186, color: "bg-emerald-500", icon: CheckCircle2 },
  { label: "En pausa", count: 12, color: "bg-amber-500", icon: Pause },
  { label: "Abandonado", count: 8, color: "bg-destructive", icon: XCircle },
  { label: "Planeado", count: 23, color: "bg-muted-foreground", icon: ListPlus },
]

const genreStats = [
  { name: "Accion", count: 68, pct: 27 },
  { name: "Fantasia", count: 52, pct: 21 },
  { name: "Romance", count: 41, pct: 17 },
  { name: "Sci-Fi", count: 34, pct: 14 },
  { name: "Comedia", count: 28, pct: 11 },
  { name: "Drama", count: 24, pct: 10 },
]

const favoriteAnime = getMockAnimes().slice(0, 6)

// ─── Sub-page tabs ──────────────────────────────────────────────
const profileTabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "anime-list", label: "Anime List", icon: Tv },
  { id: "manga-list", label: "Manga List", icon: BookOpen },
  { id: "favorites", label: "Favoritos", icon: Heart },
  { id: "stats", label: "Estadisticas", icon: TrendingUp },
] as const

type ProfileTab = (typeof profileTabs)[number]["id"]

// ─── Time helper ────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `Hace ${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Hace ${hours}h`
  const days = Math.floor(hours / 24)
  return `Hace ${days}d`
}

// ─── Activity filter options ────────────────────────────────────
const activityFilters: { value: ActivityFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "completed", label: "Completado" },
  { value: "watching", label: "Viendo" },
  { value: "score", label: "Puntuado" },
  { value: "added", label: "Agregado" },
  { value: "manual", label: "Posts" },
]

// ─── Overview Tab ──────────────────────────────────────────────
function OverviewTab({ isOwner }: { isOwner: boolean }) {
  const { addPost, togglePin, removePost, getFilteredPosts } = useActivityPosts()
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>("all")
  const [visibleCount, setVisibleCount] = useState(6)
  const [newPostText, setNewPostText] = useState("")

  const filteredPosts = getFilteredPosts(activityFilter)
  const visiblePosts = filteredPosts.slice(0, visibleCount)
  const hasMore = filteredPosts.length > visibleCount

  function handleCreatePost() {
    if (!newPostText.trim()) return
    addPost({ type: "manual", text: newPostText.trim() })
    setNewPostText("")
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Anime", value: userStats.totalAnime.toString(), icon: Tv, accent: "text-primary bg-primary/10" },
          { label: "Episodios", value: userStats.episodesWatched.toLocaleString("en-US"), icon: Film, accent: "text-emerald-500 bg-emerald-500/10" },
          { label: "Dias vistos", value: userStats.daysWatched.toString(), icon: Clock, accent: "text-amber-500 bg-amber-500/10" },
          { label: "Nota media", value: userStats.meanScore.toString(), icon: Star, accent: "text-yellow-500 bg-yellow-500/10" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${stat.accent}`}>
                <stat.icon className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground font-display">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 2-column layout: sidebar + main */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left sidebar */}
        <div className="lg:w-72 xl:w-80 shrink-0 flex flex-col gap-6">
          {/* Top Generos Vistos */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Top Generos Vistos
            </h3>
            <div className="flex flex-col gap-3">
              {genreStats.map((g, i) => (
                <div key={g.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground/60 w-4 text-right shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground font-medium">{g.name}</span>
                      <span className="text-xs text-muted-foreground">{g.count}</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${g.pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Anime Favoritos compact grid */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                Anime Favoritos
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {favoriteAnime.map((a) => (
                <Link key={a.id} href={`/anime/${a.id}`} className="group">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden border border-border/50">
                    <ImageWithFallback
                      src={a.image}
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      placeholderVariant="portrait"
                      placeholderClassName="w-full h-full"
                      placeholderLabel=""
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground group-hover:text-foreground mt-1 truncate transition-colors">{a.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right main column */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          {/* Status breakdown */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Estado de Anime
            </h3>
            <div className="flex flex-col gap-3">
              {statusBreakdown.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${s.color} shrink-0`} />
                  <span className="text-sm text-muted-foreground flex-1">{s.label}</span>
                  <span className="text-sm font-semibold text-foreground">{s.count}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex rounded-full overflow-hidden h-2">
              {statusBreakdown.map((s) => (
                <div
                  key={s.label}
                  className={`${s.color} first:rounded-l-full last:rounded-r-full`}
                  style={{ width: `${(s.count / userStats.totalAnime) * 100}%` }}
                />
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Actividad Reciente
              </h3>
            </div>

            {/* Filter bar */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {activityFilters.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => { setActivityFilter(f.value); setVisibleCount(6) }}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                    activityFilter === f.value
                      ? "bg-primary/10 text-primary border-primary/30 font-medium"
                      : "bg-secondary/30 text-muted-foreground border-border/50 hover:text-foreground"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Compose box (owner only) */}
            {isOwner && (
              <div className="flex gap-2 mb-4">
                <textarea
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="Escribe un update..."
                  rows={2}
                  className="flex-1 px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleCreatePost()
                  }}
                />
                <button
                  type="button"
                  onClick={handleCreatePost}
                  disabled={!newPostText.trim()}
                  className="self-end shrink-0 p-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Publicar"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Posts */}
            <div className="flex flex-col gap-2">
              {visiblePosts.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No hay actividad para este filtro.
                </div>
              ) : (
                visiblePosts.map((post) => (
                  <div
                    key={post.id}
                    className={`relative rounded-lg border transition-colors ${
                      post.pinned
                        ? "bg-primary/5 border-primary/20"
                        : "bg-secondary/20 border-border/50 hover:bg-secondary/30"
                    } ${post.type === "manual" ? "p-4" : "p-2.5"}`}
                  >
                    {/* Pin badge */}
                    {post.pinned && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-primary font-medium">
                        <Pin className="h-3 w-3 fill-primary" />
                        Fijado
                      </div>
                    )}

                    {post.type === "manual" ? (
                      /* Manual post (larger card) */
                      <div>
                        <p className="text-sm text-foreground leading-relaxed pr-16">{post.text}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-[10px] text-muted-foreground/60">{timeAgo(post.date)}</span>
                          {isOwner && (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => togglePin(post.id)}
                                className="p-1 text-muted-foreground hover:text-primary transition-colors"
                                title={post.pinned ? "Desfijar" : "Fijar"}
                              >
                                {post.pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => removePost(post.id)}
                                className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Auto-generated post (compact) */
                      <div className="flex items-center gap-3">
                        {post.animeImage && (
                          <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0">
                            <ImageWithFallback
                              src={post.animeImage}
                              alt={post.anime || ""}
                              className="h-full w-full object-cover"
                              placeholderVariant="square"
                              placeholderClassName="h-full w-full"
                              placeholderLabel=""
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{post.anime}</p>
                          <p className="text-xs text-muted-foreground">
                            {post.autoType === "completed" && `Completado${post.score ? ` - Nota: ${post.score}` : ""}`}
                            {post.autoType === "watching" && `Viendo episodio ${post.episode}`}
                            {post.autoType === "score" && `Puntuado ${post.score}`}
                            {post.autoType === "added" && "Agregado a la lista"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-muted-foreground/60">{timeAgo(post.date)}</span>
                          {isOwner && (
                            <div className="flex items-center gap-0.5">
                              <button
                                type="button"
                                onClick={() => togglePin(post.id)}
                                className="p-1 text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                                title={post.pinned ? "Desfijar" : "Fijar"}
                              >
                                {post.pinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => removePost(post.id)}
                                className="p-1 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                title="Eliminar"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Show more */}
            {hasMore && (
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="mt-3 w-full py-2 text-sm font-medium text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 rounded-lg border border-primary/20 transition-colors"
              >
                Mostrar mas
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Shared filter types ──────────────────────────────────────────
const ALL_GENRES = ["Accion", "Fantasia", "Romance", "Sci-Fi", "Comedia", "Drama", "Mecha", "Aventura", "Magia", "Slice of Life"]
const ALL_YEARS = [2026, 2025, 2024, 2023, 2022, 2021]
const ALL_FORMATS = ["TV", "Pelicula", "OVA", "ONA"]

const statusConfig = [
  { value: "all", label: "Todos", color: "" },
  { value: "watching", label: "Viendo", color: "bg-primary" },
  { value: "completed", label: "Completado", color: "bg-emerald-500" },
  { value: "on_hold", label: "En pausa", color: "bg-amber-500" },
  { value: "dropped", label: "Abandonado", color: "bg-destructive" },
  { value: "planned", label: "Planeado", color: "bg-muted-foreground" },
] as const

const statusStyles: Record<string, string> = {
  watching: "bg-primary/10 text-primary",
  completed: "bg-emerald-500/10 text-emerald-500",
  on_hold: "bg-amber-500/10 text-amber-500",
  dropped: "bg-destructive/10 text-destructive",
  planned: "bg-muted-foreground/10 text-muted-foreground",
}
const statusLabels: Record<string, string> = {
  watching: "Viendo",
  completed: "Completado",
  on_hold: "En pausa",
  dropped: "Abandonado",
  planned: "Planeado",
}

const sortOptions = [
  { value: "title", label: "Titulo" },
  { value: "score", label: "Nota" },
  { value: "progress", label: "Progreso" },
  { value: "year", label: "Ano" },
  { value: "rating", label: "Rating global" },
]

// ─── Genre Multi-Select Dropdown ──────────────────────────────────
function GenreMultiSelect({ selected, onToggle }: { selected: string[]; onToggle: (g: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-3 py-2 bg-secondary/50 border rounded-lg text-sm outline-none transition-all ${
          open ? "ring-2 ring-primary/50 border-primary" : "border-border"
        } ${selected.length > 0 ? "text-foreground" : "text-muted-foreground"}`}
      >
        <span className="truncate">
          {selected.length === 0
            ? "Seleccionar generos"
            : selected.length <= 3
              ? selected.join(", ")
              : `${selected.slice(0, 2).join(", ")} +${selected.length - 2}`}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 ml-2 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-lg shadow-xl shadow-background/80 py-1 max-h-56 overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-150">
          {ALL_GENRES.map((g) => {
            const isSelected = selected.includes(g)
            return (
              <button
                key={g}
                type="button"
                onClick={(e) => { e.stopPropagation(); onToggle(g) }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-secondary/50 transition-colors"
              >
                <div className={`h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-colors ${
                  isSelected
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border bg-secondary/30"
                }`}>
                  {isSelected && (
                    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className={isSelected ? "text-foreground font-medium" : "text-muted-foreground"}>
                  {g}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Anime List Tab ──────────────────────────────────────────────
function AnimeListTab() {
  const { user } = useAuth()
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [view, setView] = useState<"list" | "grid">("list")
  const [showFilters, setShowFilters] = useState(false)
  const [genreFilter, setGenreFilter] = useState<string[]>([])
  const [yearFilter, setYearFilter] = useState<number | null>(null)
  const [formatFilter, setFormatFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("title")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [customListFilter, setCustomListFilter] = useState<string | null>(null)

  const customLists = user?.customLists || []

  const allAnime = getMockAnimes()
  const listEntries = [
    ...allAnime.slice(0, 3).map((a) => ({ ...a, listStatus: "watching" as const, progress: Math.floor(Math.random() * a.episodes), userScore: +(7 + Math.random() * 2.5).toFixed(1), customListIds: customLists[0] ? [customLists[0].id] : [] })),
    ...allAnime.slice(3, 8).map((a) => ({ ...a, listStatus: "completed" as const, progress: a.episodes, userScore: +(6.5 + Math.random() * 3).toFixed(1), customListIds: customLists[1] ? [customLists[1].id] : [] })),
    ...allAnime.slice(8, 10).map((a) => ({ ...a, listStatus: "planned" as const, progress: 0, userScore: 0, customListIds: [] as string[] })),
    ...allAnime.slice(2, 4).map((a) => ({ ...a, id: a.id + "-hold", listStatus: "on_hold" as const, progress: Math.floor(a.episodes / 3), userScore: +(6 + Math.random() * 2).toFixed(1), customListIds: [] as string[] })),
    ...allAnime.slice(5, 6).map((a) => ({ ...a, id: a.id + "-drop", listStatus: "dropped" as const, progress: 2, userScore: +(4 + Math.random() * 2).toFixed(1), customListIds: [] as string[] })),
  ]

  const hasActiveFilters = genreFilter.length > 0 || yearFilter !== null || formatFilter !== null || customListFilter !== null

  let filtered = filter === "all" ? listEntries : listEntries.filter((e) => e.listStatus === filter)
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter((e) => e.title.toLowerCase().includes(q) || e.titleJp.toLowerCase().includes(q))
  }
  if (genreFilter.length > 0) {
    filtered = filtered.filter((e) => genreFilter.some((g) => e.genres.includes(g)))
  }
  if (yearFilter) {
    filtered = filtered.filter((e) => e.year === yearFilter)
  }
  if (formatFilter) {
    filtered = filtered.filter((e) => e.type === formatFilter)
  }
  if (customListFilter) {
    filtered = filtered.filter((e) => e.customListIds.includes(customListFilter))
  }

  filtered.sort((a, b) => {
    let cmp = 0
    switch (sortBy) {
      case "title": cmp = a.title.localeCompare(b.title); break
      case "score": cmp = a.userScore - b.userScore; break
      case "progress": cmp = (a.progress / a.episodes) - (b.progress / b.episodes); break
      case "year": cmp = a.year - b.year; break
      case "rating": cmp = a.rating - b.rating; break
    }
    return sortDir === "asc" ? cmp : -cmp
  })

  const statusCounts = statusConfig.map((s) => ({
    ...s,
    count: s.value === "all" ? listEntries.length : listEntries.filter((e) => e.listStatus === s.value).length,
  }))

  function clearFilters() {
    setGenreFilter([])
    setYearFilter(null)
    setFormatFilter(null)
    setCustomListFilter(null)
    setSearch("")
  }

  function toggleGenre(g: string) {
    setGenreFilter((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g])
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar en tu lista..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-8 pr-8 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground outline-none cursor-pointer"
            >
              {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>
          <button
            type="button"
            onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
            className="p-2 bg-secondary/50 border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            title={sortDir === "asc" ? "Ascendente" : "Descendente"}
          >
            <ArrowUpDown className={`h-4 w-4 transition-transform ${sortDir === "desc" ? "rotate-180" : ""}`} />
          </button>

          {/* Advanced filters toggle */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-colors ${
              showFilters || hasActiveFilters
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-secondary/50 text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filtros
            {hasActiveFilters && (
              <span className="h-4 min-w-4 px-1 text-[10px] font-bold bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                {[genreFilter.length > 0, yearFilter !== null, formatFilter !== null, customListFilter !== null].filter(Boolean).length}
              </span>
            )}
          </button>

          {/* View toggle */}
          <div className="flex items-center bg-secondary/50 border border-border rounded-lg p-0.5 ml-auto">
            <button
              type="button"
              onClick={() => setView("list")}
              className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutList className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setView("grid")}
              className={`p-1.5 rounded-md transition-colors ${view === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap gap-1.5">
          {statusCounts.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setFilter(s.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                filter === s.value
                  ? "bg-primary/10 text-primary border-primary/30 font-medium"
                  : "bg-secondary/30 text-muted-foreground border-border/50 hover:text-foreground hover:border-border"
              }`}
            >
              {s.color && <div className={`h-2 w-2 rounded-full ${s.color}`} />}
              {s.label}
              <span className="text-muted-foreground/60">{s.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced filters panel */}
      {showFilters && (
        <div className="bg-card border border-border rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-foreground">Filtros avanzados</h4>
            {hasActiveFilters && (
              <button type="button" onClick={clearFilters} className="text-xs text-primary hover:underline">
                Limpiar filtros
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {/* Genres - select with checkboxes */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Generos</label>
              <GenreMultiSelect selected={genreFilter} onToggle={toggleGenre} />
            </div>

            {/* Year + Format row - native selects */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[140px]">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Ano</label>
                <div className="relative">
                  <select
                    value={yearFilter ?? ""}
                    onChange={(e) => setYearFilter(e.target.value ? Number(e.target.value) : null)}
                    className="w-full appearance-none pl-3 pr-8 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground outline-none cursor-pointer focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  >
                    <option value="">Todos los anos</option>
                    {ALL_YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div className="flex-1 min-w-[140px]">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Formato</label>
                <div className="relative">
                  <select
                    value={formatFilter ?? ""}
                    onChange={(e) => setFormatFilter(e.target.value || null)}
                    className="w-full appearance-none pl-3 pr-8 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground outline-none cursor-pointer focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  >
                    <option value="">Todos los formatos</option>
                    {ALL_FORMATS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Custom lists with icons */}
            {customLists.length > 0 && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block flex items-center gap-1.5">
                  <FolderPlus className="h-3 w-3" />
                  Listas personalizadas
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {customLists.map((cl) => (
                    <button
                      key={cl.id}
                      type="button"
                      onClick={() => setCustomListFilter(customListFilter === cl.id ? null : cl.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                        customListFilter === cl.id
                          ? "bg-primary/10 text-primary border-primary/30 font-medium"
                          : "bg-secondary/30 text-muted-foreground border-border/50 hover:text-foreground"
                      }`}
                    >
                      <ListIcon iconName={cl.icon} color={cl.color} className="h-3 w-3" />
                      {cl.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="text-xs text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "entrada" : "entradas"}
        {hasActiveFilters && " (filtrado)"}
      </div>

      {/* Grid view */}
      {view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.length === 0 ? (
            <div className="col-span-full p-8 text-center text-sm text-muted-foreground bg-card border border-border rounded-xl">
              No hay entradas que coincidan con los filtros.
            </div>
          ) : (
            filtered.map((entry) => (
              <Link key={entry.id} href={`/anime/${entry.id}`} className="group">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-border/50">
                  <ImageWithFallback
                    src={entry.image}
                    alt={entry.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    placeholderVariant="portrait"
                    placeholderClassName="w-full h-full"
                    placeholderLabel=""
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent p-3 pt-10">
                    <p className="text-xs font-medium text-foreground truncate">{entry.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded ${statusStyles[entry.listStatus]}`}>
                        {statusLabels[entry.listStatus]}
                      </span>
                      {entry.userScore > 0 && (
                        <span className="flex items-center gap-0.5 text-[10px] text-yellow-500">
                          <Star className="h-2.5 w-2.5 fill-yellow-500" />
                          {entry.userScore}
                        </span>
                      )}
                    </div>
                    <div className="h-1 bg-secondary/50 rounded-full mt-1.5 overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${entry.episodes > 0 ? (entry.progress / entry.episodes) * 100 : 0}%` }} />
                    </div>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{entry.progress}/{entry.episodes} ep</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      ) : (
        /* List view */
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_100px_80px_80px_80px] gap-4 p-3 bg-secondary/30 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <span>Titulo</span>
            <span className="text-center">Progreso</span>
            <span className="text-center">Nota</span>
            <span className="text-center">Formato</span>
            <span className="text-center">Estado</span>
          </div>
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No hay entradas que coincidan con los filtros.
            </div>
          ) : (
            filtered.map((entry) => (
              <Link
                key={entry.id}
                href={`/anime/${entry.id}`}
                className="grid grid-cols-1 sm:grid-cols-[1fr_100px_80px_80px_80px] gap-2 sm:gap-4 p-3 items-center hover:bg-secondary/20 transition-colors border-b border-border/50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-9 rounded-md overflow-hidden shrink-0">
                    <ImageWithFallback
                      src={entry.image}
                      alt={entry.title}
                      className="h-full w-full object-cover"
                      placeholderVariant="portrait"
                      placeholderClassName="h-full w-full"
                      placeholderLabel=""
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{entry.title}</p>
                    <p className="text-xs text-muted-foreground">{entry.titleJp}</p>
                    {entry.customListIds.length > 0 && (
                      <div className="flex gap-1 mt-0.5">
                        {entry.customListIds.map((cid) => {
                          const cl = customLists.find((l) => l.id === cid)
                          return cl ? (
                            <span key={cid} className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
                              <ListIcon iconName={cl.icon} color={cl.color} className="h-2.5 w-2.5" />
                              {cl.name}
                            </span>
                          ) : null
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-sm text-foreground">{entry.progress}/{entry.episodes}</span>
                  <div className="h-1 bg-secondary rounded-full mt-1 overflow-hidden mx-auto max-w-[80px]">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${entry.episodes > 0 ? (entry.progress / entry.episodes) * 100 : 0}%` }} />
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-sm text-foreground">{entry.userScore > 0 ? entry.userScore : "-"}</span>
                </div>
                <div className="flex justify-center">
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-secondary/50 text-muted-foreground">{entry.type}</span>
                </div>
                <div className="flex justify-center">
                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded-md ${statusStyles[entry.listStatus]}`}>
                    {statusLabels[entry.listStatus]}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ─── Manga List Tab ───────────────────────────────��──────────────
const mangaStatusConfig = [
  { value: "all", label: "Todos", color: "" },
  { value: "reading", label: "Leyendo", color: "bg-primary" },
  { value: "completed", label: "Completado", color: "bg-emerald-500" },
  { value: "on_hold", label: "En pausa", color: "bg-amber-500" },
  { value: "dropped", label: "Abandonado", color: "bg-destructive" },
  { value: "planned", label: "Planeado", color: "bg-muted-foreground" },
] as const

const mangaStatusStyles: Record<string, string> = {
  reading: "bg-primary/10 text-primary",
  completed: "bg-emerald-500/10 text-emerald-500",
  on_hold: "bg-amber-500/10 text-amber-500",
  dropped: "bg-destructive/10 text-destructive",
  planned: "bg-muted-foreground/10 text-muted-foreground",
}
const mangaStatusLabels: Record<string, string> = {
  reading: "Leyendo",
  completed: "Completado",
  on_hold: "En pausa",
  dropped: "Abandonado",
  planned: "Planeado",
}

const MANGA_GENRES = ["Accion", "Romance", "Fantasia", "Seinen", "Shounen", "Josei", "Drama", "Comedia", "Horror"]

function MangaListTab() {
  const { user } = useAuth()
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [view, setView] = useState<"list" | "grid">("list")
  const [showFilters, setShowFilters] = useState(false)
  const [genreFilter, setGenreFilter] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("title")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [customListFilter, setCustomListFilter] = useState<string | null>(null)

  const customLists = user?.customLists || []

  const mangaEntries = [
    { id: 1, title: "Vagabond", titleJp: "Vagabond", image: "/images/anime-1.jpg", chapters: 327, progress: 327, status: "completed" as const, score: 9.5, genres: ["Accion", "Seinen", "Drama"], customListIds: customLists[1] ? [customLists[1].id] : [] },
    { id: 2, title: "Berserk", titleJp: "Beruseruku", image: "/images/anime-2.jpg", chapters: 364, progress: 350, status: "reading" as const, score: 9.8, genres: ["Accion", "Fantasia", "Horror"], customListIds: customLists[0] ? [customLists[0].id] : [] },
    { id: 3, title: "One Piece", titleJp: "Wan Piisu", image: "/images/anime-3.jpg", chapters: 1120, progress: 1100, status: "reading" as const, score: 9.2, genres: ["Accion", "Shounen", "Comedia"], customListIds: [] as string[] },
    { id: 4, title: "Chainsaw Man", titleJp: "Chensoo Man", image: "/images/anime-4.jpg", chapters: 180, progress: 140, status: "reading" as const, score: 8.7, genres: ["Accion", "Shounen"], customListIds: [] as string[] },
    { id: 5, title: "Oyasumi Punpun", titleJp: "Oyasumi Punpun", image: "/images/anime-5.jpg", chapters: 147, progress: 147, status: "completed" as const, score: 9.0, genres: ["Drama", "Seinen"], customListIds: [] as string[] },
    { id: 6, title: "Vinland Saga", titleJp: "Vinrando Saga", image: "/images/anime-6.jpg", chapters: 208, progress: 50, status: "on_hold" as const, score: 8.5, genres: ["Accion", "Seinen", "Drama"], customListIds: [] as string[] },
    { id: 7, title: "Tokyo Ghoul", titleJp: "Tokyo Guru", image: "/images/anime-7.jpg", chapters: 179, progress: 12, status: "dropped" as const, score: 6.5, genres: ["Accion", "Horror", "Seinen"], customListIds: [] as string[] },
    { id: 8, title: "Spy x Family", titleJp: "Supai Famiri", image: "/images/anime-8.jpg", chapters: 100, progress: 0, status: "planned" as const, score: 0, genres: ["Comedia", "Accion"], customListIds: [] as string[] },
  ]

  const hasActiveFilters = genreFilter.length > 0 || customListFilter !== null

  let filtered = filter === "all" ? mangaEntries : mangaEntries.filter((e) => e.status === filter)
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter((e) => e.title.toLowerCase().includes(q) || e.titleJp.toLowerCase().includes(q))
  }
  if (genreFilter.length > 0) {
    filtered = filtered.filter((e) => genreFilter.some((g) => e.genres.includes(g)))
  }
  if (customListFilter) {
    filtered = filtered.filter((e) => e.customListIds.includes(customListFilter))
  }

  filtered.sort((a, b) => {
    let cmp = 0
    switch (sortBy) {
      case "title": cmp = a.title.localeCompare(b.title); break
      case "score": cmp = a.score - b.score; break
      case "progress": cmp = (a.progress / a.chapters) - (b.progress / b.chapters); break
    }
    return sortDir === "asc" ? cmp : -cmp
  })

  const statusCounts = mangaStatusConfig.map((s) => ({
    ...s,
    count: s.value === "all" ? mangaEntries.length : mangaEntries.filter((e) => e.status === s.value).length,
  }))

  function toggleGenre(g: string) {
    setGenreFilter((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g])
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar manga..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-8 pr-8 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground outline-none cursor-pointer"
            >
              <option value="title">Titulo</option>
              <option value="score">Nota</option>
              <option value="progress">Progreso</option>
            </select>
            <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>
          <button
            type="button"
            onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
            className="p-2 bg-secondary/50 border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowUpDown className={`h-4 w-4 transition-transform ${sortDir === "desc" ? "rotate-180" : ""}`} />
          </button>

          {/* Filters toggle */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-colors ${
              showFilters || hasActiveFilters
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-secondary/50 text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filtros
            {hasActiveFilters && (
              <span className="h-4 min-w-4 px-1 text-[10px] font-bold bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                {[genreFilter.length > 0, customListFilter !== null].filter(Boolean).length}
              </span>
            )}
          </button>

          {/* View toggle */}
          <div className="flex items-center bg-secondary/50 border border-border rounded-lg p-0.5 ml-auto">
            <button
              type="button"
              onClick={() => setView("list")}
              className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutList className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setView("grid")}
              className={`p-1.5 rounded-md transition-colors ${view === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap gap-1.5">
          {statusCounts.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setFilter(s.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                filter === s.value
                  ? "bg-primary/10 text-primary border-primary/30 font-medium"
                  : "bg-secondary/30 text-muted-foreground border-border/50 hover:text-foreground hover:border-border"
              }`}
            >
              {s.color && <div className={`h-2 w-2 rounded-full ${s.color}`} />}
              {s.label}
              <span className="text-muted-foreground/60">{s.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <div className="bg-card border border-border rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-foreground">Filtros avanzados</h4>
            {hasActiveFilters && (
              <button type="button" onClick={() => { setGenreFilter([]); setCustomListFilter(null) }} className="text-xs text-primary hover:underline">
                Limpiar filtros
              </button>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Generos</label>
              <div className="flex flex-wrap gap-1.5">
                {MANGA_GENRES.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGenre(g)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                      genreFilter.includes(g)
                        ? "bg-primary/10 text-primary border-primary/30 font-medium"
                        : "bg-secondary/30 text-muted-foreground border-border/50 hover:text-foreground"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            {customLists.length > 0 && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block flex items-center gap-1.5">
                  <FolderPlus className="h-3 w-3" />
                  Listas personalizadas
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {customLists.map((cl) => (
                    <button
                      key={cl.id}
                      type="button"
                      onClick={() => setCustomListFilter(customListFilter === cl.id ? null : cl.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                        customListFilter === cl.id
                          ? "bg-primary/10 text-primary border-primary/30 font-medium"
                          : "bg-secondary/30 text-muted-foreground border-border/50 hover:text-foreground"
                      }`}
                    >
                      <ListIcon iconName={cl.icon} color={cl.color} className="h-3 w-3" />
                      {cl.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="text-xs text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "entrada" : "entradas"}
        {hasActiveFilters && " (filtrado)"}
      </div>

      {/* Grid view */}
      {view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.length === 0 ? (
            <div className="col-span-full p-8 text-center text-sm text-muted-foreground bg-card border border-border rounded-xl">
              No hay entradas que coincidan con los filtros.
            </div>
          ) : (
            filtered.map((entry) => (
              <div key={entry.id} className="group">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-border/50">
                  <ImageWithFallback
                    src={entry.image}
                    alt={entry.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    placeholderVariant="portrait"
                    placeholderClassName="w-full h-full"
                    placeholderLabel=""
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent p-3 pt-10">
                    <p className="text-xs font-medium text-foreground truncate">{entry.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded ${mangaStatusStyles[entry.status]}`}>
                        {mangaStatusLabels[entry.status]}
                      </span>
                      {entry.score > 0 && (
                        <span className="flex items-center gap-0.5 text-[10px] text-yellow-500">
                          <Star className="h-2.5 w-2.5 fill-yellow-500" />
                          {entry.score}
                        </span>
                      )}
                    </div>
                    <div className="h-1 bg-secondary/50 rounded-full mt-1.5 overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${(entry.progress / entry.chapters) * 100}%` }} />
                    </div>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{entry.progress}/{entry.chapters} cap</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* List view */
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_100px_80px_80px] gap-4 p-3 bg-secondary/30 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <span>Titulo</span>
            <span className="text-center">Progreso</span>
            <span className="text-center">Nota</span>
            <span className="text-center">Estado</span>
          </div>
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No hay entradas que coincidan con los filtros.
            </div>
          ) : (
            filtered.map((entry) => (
              <div
                key={entry.id}
                className="grid grid-cols-1 sm:grid-cols-[1fr_100px_80px_80px] gap-2 sm:gap-4 p-3 items-center hover:bg-secondary/20 transition-colors border-b border-border/50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-9 rounded-md overflow-hidden shrink-0">
                    <ImageWithFallback
                      src={entry.image}
                      alt={entry.title}
                      className="h-full w-full object-cover"
                      placeholderVariant="portrait"
                      placeholderClassName="h-full w-full"
                      placeholderLabel=""
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{entry.title}</p>
                    <p className="text-xs text-muted-foreground">{entry.titleJp}</p>
                    {entry.customListIds.length > 0 && (
                      <div className="flex gap-1 mt-0.5">
                        {entry.customListIds.map((cid) => {
                          const cl = customLists.find((l) => l.id === cid)
                          return cl ? (
                            <span key={cid} className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
                              <ListIcon iconName={cl.icon} color={cl.color} className="h-2.5 w-2.5" />
                              {cl.name}
                            </span>
                          ) : null
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-sm text-foreground">{entry.progress}/{entry.chapters}</span>
                  <div className="h-1 bg-secondary rounded-full mt-1 overflow-hidden mx-auto max-w-[80px]">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(entry.progress / entry.chapters) * 100}%` }} />
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-sm text-foreground">{entry.score > 0 ? entry.score : "-"}</span>
                </div>
                <div className="flex justify-center">
                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded-md ${mangaStatusStyles[entry.status]}`}>
                    {mangaStatusLabels[entry.status]}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ─── Favorites Tab ──────────────────────────────────────────────
function FavoritesTab() {
  const favAnime = getMockAnimes().slice(0, 8)

  const favCharacters = [
    { name: "Yuki Tanaka", anime: "Espada Celestial", image: "/images/anime-1.jpg" },
    { name: "Hana Sakura", anime: "Sakura Dreams", image: "/images/anime-2.jpg" },
    { name: "Ren Kurosawa", anime: "Mecha Genesis", image: "/images/anime-3.jpg" },
    { name: "Aoi Mizuki", anime: "Cronicas del Abismo", image: "/images/anime-4.jpg" },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <Tv className="h-4 w-4 text-primary" />
          Anime Favoritos
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {favAnime.map((a) => (
            <Link key={a.id} href={`/anime/${a.id}`} className="group">
              <div className="aspect-[3/4] rounded-xl overflow-hidden border border-border/50 relative">
                <ImageWithFallback
                  src={a.image}
                  alt={a.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  placeholderVariant="portrait"
                  placeholderClassName="w-full h-full"
                  placeholderLabel=""
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-3">
                  <p className="text-xs font-medium text-foreground truncate">{a.title}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-[10px] text-muted-foreground">{a.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <Heart className="h-4 w-4 text-primary" />
          Personajes Favoritos
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {favCharacters.map((c) => (
            <div key={c.name} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0">
                <ImageWithFallback
                  src={c.image}
                  alt={c.name}
                  className="h-full w-full object-cover"
                  placeholderVariant="square"
                  placeholderClassName="h-full w-full"
                  placeholderLabel=""
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground truncate">{c.anime}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Stats Tab ──────────────────────────────────────────────────
function StatsTab() {
  const scoreDistribution = [
    { score: 10, count: 12 },
    { score: 9, count: 28 },
    { score: 8, count: 56 },
    { score: 7, count: 72 },
    { score: 6, count: 43 },
    { score: 5, count: 18 },
    { score: 4, count: 8 },
    { score: 3, count: 5 },
    { score: 2, count: 3 },
    { score: 1, count: 2 },
  ]
  const maxCount = Math.max(...scoreDistribution.map((s) => s.count))

  const yearStats = [
    { year: "2026", count: 32 },
    { year: "2025", count: 58 },
    { year: "2024", count: 45 },
    { year: "2023", count: 38 },
    { year: "2022", count: 29 },
    { year: "2021", count: 24 },
    { year: "< 2021", count: 21 },
  ]
  const maxYear = Math.max(...yearStats.map((y) => y.count))

  return (
    <div className="flex flex-col gap-6">
      {/* Big stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Anime", value: userStats.totalAnime },
          { label: "Episodios", value: userStats.episodesWatched },
          { label: "Manga", value: userStats.totalManga },
          { label: "Capitulos", value: userStats.chaptersRead },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-foreground font-display">{s.value.toLocaleString("en-US")}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score distribution */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">Distribucion de Notas</h3>
          <div className="flex flex-col gap-2">
            {scoreDistribution.map((s) => (
              <div key={s.score} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-4 text-right shrink-0">{s.score}</span>
                <div className="flex-1 h-4 bg-secondary rounded-md overflow-hidden">
                  <div
                    className="h-full bg-primary/80 rounded-md transition-all"
                    style={{ width: `${(s.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-6 shrink-0">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Year distribution */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">Anime por Ano</h3>
          <div className="flex flex-col gap-2">
            {yearStats.map((y) => (
              <div key={y.year} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-10 text-right shrink-0">{y.year}</span>
                <div className="flex-1 h-4 bg-secondary rounded-md overflow-hidden">
                  <div
                    className="h-full bg-emerald-500/70 rounded-md transition-all"
                    style={{ width: `${(y.count / maxYear) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-6 shrink-0">{y.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Genres full */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-bold text-foreground mb-4">Generos (Top 6)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {genreStats.map((g) => (
            <div key={g.name} className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0">
                <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3" className="text-secondary" />
                  <circle
                    cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3"
                    className="text-primary"
                    strokeDasharray={`${g.pct} ${100 - g.pct}`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">{g.pct}%</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{g.name}</p>
                <p className="text-xs text-muted-foreground">{g.count} titulos</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Profile Page ──────────────────────────────────────────
export default function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params)
  const { user, isAuthenticated, hydrated } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview")

  const isOwner = isAuthenticated && user?.username === username

  // If not hydrated yet, show spinner
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Mock: For now, if the username matches the logged-in user, show their profile.
  // Otherwise, show a "public" mock profile or private message.
  const profileUser = isOwner
    ? user
    : {
        name: username.charAt(0).toUpperCase() + username.slice(1),
        username,
        email: "",
        avatar: null,
        banner: null,
        bio: "Anime fan",
        location: "",
        customLists: [],
      }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ShieldAlert className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-xl font-bold text-foreground mb-2">Usuario no encontrado</h1>
            <p className="text-sm text-muted-foreground">El perfil que buscas no existe.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Banner + Avatar hero */}
        <div className="relative">
          <div className="h-40 sm:h-56 bg-gradient-to-br from-primary/20 via-secondary to-primary/10 relative overflow-hidden">
            {profileUser.banner && (
              <img src={profileUser.banner} alt="Banner" className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          </div>

          <div className="mx-auto max-w-5xl px-4">
            <div className="relative -mt-12 sm:-mt-16 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl border-4 border-background bg-card overflow-hidden shrink-0 shadow-lg">
                {profileUser.avatar ? (
                  <img src={profileUser.avatar} alt={profileUser.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-3xl font-bold font-display">
                    {profileUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                )}
              </div>

              {/* Name + info */}
              <div className="flex-1 min-w-0 pt-1 sm:pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold font-display text-foreground">{profileUser.name}</h1>
                    <p className="text-sm text-muted-foreground">@{profileUser.username}</p>
                  </div>
                  {isOwner && (
                    <Link
                      href="/settings"
                      className="shrink-0 p-2 bg-secondary/50 hover:bg-secondary rounded-lg border border-border/50 transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Settings className="h-4 w-4" />
                    </Link>
                  )}
                </div>
                {profileUser.bio && <p className="text-sm text-muted-foreground mt-2 max-w-lg">{profileUser.bio}</p>}
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
                  {profileUser.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {profileUser.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Se unio en Ene 2024
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-5xl px-4 mt-6">
          <div className="flex gap-1 overflow-x-auto pb-px border-b border-border scrollbar-hide">
            {profileTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors -mb-px ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="mx-auto max-w-5xl px-4 py-6">
          {activeTab === "overview" && <OverviewTab isOwner={isOwner} />}
          {activeTab === "anime-list" && <AnimeListTab />}
          {activeTab === "manga-list" && <MangaListTab />}
          {activeTab === "favorites" && <FavoritesTab />}
          {activeTab === "stats" && <StatsTab />}
        </div>
      </main>

      <Footer />
    </div>
  )
}
