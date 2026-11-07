"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Menu,
  X,
  Bell,
  Bookmark,
  User,
  TrendingUp,
  Clock,
  Star,
  Flame,
  Film,
  Users,
  Building2,
  UserCircle,
  CalendarDays,
  Tv,
  MessageCircle,
  Heart,
  CheckCircle2,
  Trash2,
  Settings,
  SlidersHorizontal,
  LogOut,
} from "lucide-react"
import { GlobalSearch } from "@/components/global-search"
import { useAuth } from "@/lib/auth-context"

const navLinks = [
  { label: "Anime", href: "/anime" },
  { label: "Personajes", href: "/characters" },
  { label: "Personas", href: "/people" },
  { label: "Companies", href: "/companies" },
  { label: "Schedule", href: "/schedule" },
]

interface Notification {
  id: number
  type: "episode" | "recommendation" | "social" | "system"
  title: string
  message: string
  time: string
  read: boolean
  image?: string
  link?: string
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "episode",
    title: "Nuevo episodio disponible",
    message: "Espada Celestial - Episodio 13 ya esta disponible",
    time: "Hace 2 min",
    read: false,
    image: "/images/anime-1.jpg",
    link: "/anime/1",
  },
  {
    id: 2,
    type: "social",
    title: "Nuevo seguidor",
    message: "OtakuMaster99 ha comenzado a seguirte",
    time: "Hace 15 min",
    read: false,
  },
  {
    id: 3,
    type: "episode",
    title: "Nuevo episodio disponible",
    message: "Sakura Dreams - Episodio 8 ya esta disponible",
    time: "Hace 1 hora",
    read: false,
    image: "/images/anime-2.jpg",
    link: "/anime/2",
  },
  {
    id: 4,
    type: "recommendation",
    title: "Recomendacion para ti",
    message: "Basado en tus gustos, te recomendamos Neo Genesis Titan",
    time: "Hace 3 horas",
    read: true,
    image: "/images/anime-3.jpg",
    link: "/anime/3",
  },
  {
    id: 5,
    type: "system",
    title: "Actualizacion del sistema",
    message: "Nuevas funciones de lista y estadisticas disponibles",
    time: "Hace 1 dia",
    read: true,
  },
  {
    id: 6,
    type: "episode",
    title: "Temporada finalizada",
    message: "Sombras de Tokyo ha terminado su emision",
    time: "Hace 2 dias",
    read: true,
    image: "/images/anime-4.jpg",
    link: "/anime/4",
  },
]

interface BookmarkItem {
  id: number
  animeId: number
  title: string
  image: string
  addedAt: string
}

const initialBookmarks: BookmarkItem[] = [
  { id: 1, animeId: 1, title: "Espada Celestial", image: "/images/anime-1.jpg", addedAt: "Hace 1 dia" },
  { id: 2, animeId: 3, title: "Neo Genesis Titan", image: "/images/anime-3.jpg", addedAt: "Hace 3 dias" },
  { id: 3, animeId: 5, title: "Furia del Dragon", image: "/images/anime-5.jpg", addedAt: "Hace 1 semana" },
  { id: 4, animeId: 7, title: "Sombra Nocturna", image: "/images/anime-7.jpg", addedAt: "Hace 2 semanas" },
]

function getNotifIcon(type: Notification["type"]) {
  switch (type) {
    case "episode":
      return <Tv className="h-4 w-4 text-primary" />
    case "recommendation":
      return <Heart className="h-4 w-4 text-chart-3" />
    case "social":
      return <MessageCircle className="h-4 w-4 text-chart-2" />
    case "system":
      return <Bell className="h-4 w-4 text-muted-foreground" />
  }
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [bookmarkOpen, setBookmarkOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [bookmarks, setBookmarks] = useState(initialBookmarks)

  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const notifRef = useRef<HTMLDivElement>(null)
  const bookmarkRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
      if (bookmarkRef.current && !bookmarkRef.current.contains(e.target as Node)) {
        setBookmarkOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markOneRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const removeBookmark = (id: number) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id))
  }

  const togglePanel = (panel: "notif" | "bookmark") => {
    if (panel === "notif") {
      setNotifOpen(!notifOpen)
      setBookmarkOpen(false)
    } else {
      setBookmarkOpen(!bookmarkOpen)
      setNotifOpen(false)
    }
  }

  return (
    <>
      {/* Top info bar */}
      <div className="bg-primary/10 border-b border-primary/20">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-1.5 text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-primary font-medium">
              <Flame className="h-3.5 w-3.5" />
              Temporada Invierno 2026
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              12,847 animes registrados
            </span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="hidden md:inline">Comunidad: 2.1M usuarios</span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500" />
              245 reviews hoy
            </span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-lg shadow-background/50"
            : "bg-background/80 backdrop-blur-md border-b border-border/50"
        }`}
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="relative flex items-center justify-center h-9 w-9 rounded-lg bg-primary text-primary-foreground font-bold text-lg font-display">
              Y
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold font-display leading-none tracking-tight text-foreground">
                YumeDb
              </span>
              <span className="text-[10px] text-muted-foreground leading-none mt-0.5 tracking-widest uppercase">
                Anime Database
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search - Command palette */}
            <GlobalSearch />

            {/* Notifications */}
            <div ref={notifRef} className={`relative ${notifOpen ? "block" : "hidden sm:block"}`}>
              <button
                type="button"
                onClick={() => togglePanel("notif")}
                className={`relative p-2 rounded-lg transition-colors ${
                  notifOpen
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center h-4 w-4 text-[9px] font-bold bg-primary text-primary-foreground rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-auto sm:top-full mt-2 w-auto sm:w-96 bg-card border border-border rounded-xl shadow-2xl shadow-background/80 overflow-hidden z-50">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="text-sm font-bold text-foreground">Notificaciones</h3>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllRead}
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Marcar todo leido
                      </button>
                    )}
                  </div>

                  {/* Notification list */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-sm text-muted-foreground">
                        No tienes notificaciones
                      </div>
                    ) : (
                      notifications.map((notif) => {
                        const Wrapper = notif.link ? Link : "div"
                        const wrapperProps = notif.link
                          ? {
                              href: notif.link,
                              onClick: () => {
                                markOneRead(notif.id)
                                setNotifOpen(false)
                              },
                            }
                          : { onClick: () => markOneRead(notif.id) }

                        return (
                          <Wrapper
                            key={notif.id}
                            {...(wrapperProps as React.ComponentProps<"div"> & React.ComponentProps<typeof Link>)}
                            className={`flex items-start gap-3 p-4 border-b border-border/30 hover:bg-secondary/30 transition-colors cursor-pointer ${
                              !notif.read ? "bg-primary/5" : ""
                            }`}
                          >
                            {/* Image or icon */}
                            {notif.image ? (
                              <img
                                src={notif.image}
                                alt=""
                                className="h-10 w-8 rounded-md object-cover shrink-0"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                                {getNotifIcon(notif.type)}
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p
                                  className={`text-xs font-semibold ${!notif.read ? "text-foreground" : "text-muted-foreground"}`}
                                >
                                  {notif.title}
                                </p>
                                {!notif.read && (
                                  <span className="h-2 w-2 mt-1 rounded-full bg-primary shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {notif.message}
                              </p>
                              <p className="text-[10px] text-muted-foreground/60 mt-1 flex items-center gap-1">
                                <Clock className="h-2.5 w-2.5" />
                                {notif.time}
                              </p>
                            </div>
                          </Wrapper>
                        )
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bookmarks */}
            <div ref={bookmarkRef} className={`relative ${bookmarkOpen ? "block" : "hidden sm:block"}`}>
              <button
                type="button"
                onClick={() => togglePanel("bookmark")}
                className={`p-2 rounded-lg transition-colors ${
                  bookmarkOpen
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <Bookmark className="h-5 w-5" />
              </button>

              {bookmarkOpen && (
                <div className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-auto sm:top-full mt-2 w-auto sm:w-80 bg-card border border-border rounded-xl shadow-2xl shadow-background/80 overflow-hidden z-50">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="text-sm font-bold text-foreground">Guardados</h3>
                    <span className="text-xs text-muted-foreground">{bookmarks.length} anime</span>
                  </div>

                  {/* Bookmark list */}
                  <div className="max-h-80 overflow-y-auto">
                    {bookmarks.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bookmark className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No tienes anime guardado</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          Guarda anime para acceder rapidamente
                        </p>
                      </div>
                    ) : (
                      bookmarks.map((bm) => (
                        <div
                          key={bm.id}
                          className="flex items-center gap-3 p-3 border-b border-border/30 hover:bg-secondary/30 transition-colors group"
                        >
                          <Link
                            href={`/anime/${bm.animeId}`}
                            onClick={() => setBookmarkOpen(false)}
                            className="flex items-center gap-3 flex-1 min-w-0"
                          >
                            <img
                              src={bm.image}
                              alt={bm.title}
                              className="h-12 w-9 rounded-md object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                {bm.title}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{bm.addedAt}</p>
                            </div>
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeBookmark(bm.id)}
                            className="p-1.5 text-muted-foreground hover:text-destructive rounded-md hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                            aria-label={`Eliminar ${bm.title} de guardados`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {bookmarks.length > 0 && (
                    <div className="p-3 border-t border-border">
                      <Link
                        href="/anime"
                        onClick={() => setBookmarkOpen(false)}
                        className="block w-full py-2 text-center text-xs text-primary font-medium hover:bg-primary/5 rounded-lg transition-colors"
                      >
                        Ver toda mi lista
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile / Login */}
            {isAuthenticated && user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 pr-2 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors border border-border/50"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-7 w-7 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-md bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                  )}
                  <span className="hidden sm:inline text-sm text-foreground max-w-[80px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-2xl shadow-background/80 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* User info */}
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu links */}
                    <div className="p-1.5">
                      <Link
                        href={`/user/${user.username}`}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                      >
                        <UserCircle className="h-4 w-4" />
                        Perfil
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                        Preferencias
                      </Link>
                    </div>

                    <div className="border-t border-border p-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          logout()
                          setUserMenuOpen(false)
                          router.push("/")
                        }}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Cerrar sesion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 p-1.5 pr-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors border border-border/50"
              >
                <div className="h-7 w-7 rounded-md bg-primary/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="hidden sm:inline text-sm text-foreground">Entrar</span>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card/95 backdrop-blur-xl">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  href={link.href}
                  key={link.label}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                >
                  {link.label === "Anime" && <Film className="h-4 w-4" />}
                  {link.label === "Personajes" && <UserCircle className="h-4 w-4" />}
                  {link.label === "Personas" && <Users className="h-4 w-4" />}
                  {link.label === "Companies" && <Building2 className="h-4 w-4" />}
                  {link.label === "Schedule" && <CalendarDays className="h-4 w-4" />}
                  {link.label}
                </Link>
              ))}

              {/* Mobile notification & bookmark links */}
              <div className="border-t border-border/50 mt-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    setNotifOpen(true)
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors w-full"
                >
                  <Bell className="h-4 w-4" />
                  Notificaciones
                  {unreadCount > 0 && (
                    <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold bg-primary text-primary-foreground rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    setBookmarkOpen(true)
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors w-full"
                >
                  <Bookmark className="h-4 w-4" />
                  Guardados
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
