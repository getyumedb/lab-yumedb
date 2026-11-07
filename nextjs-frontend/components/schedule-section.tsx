"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Star } from "lucide-react"
import { getMockAnimes } from "@/lib/mock/anime.mock"
import type { AnimeListItem } from "@/types"
import { NoImagePlaceholder } from "@/components/no-image-placeholder"
import { ViewModeToggle, useViewMode } from "@/components/view-mode-toggle"

/* -- Schedule data generation ----------------------------------------------- */

const BROADCAST_TIMES = [
  "17:00", "17:30", "18:00", "18:30", "19:00",
  "19:30", "20:00", "20:30", "21:00", "21:30",
  "22:00", "22:30", "23:00", "23:30", "00:00",
]

const airingAnime = getMockAnimes().filter((a) => a.status === "En emision")

interface ScheduleEntry {
  anime: AnimeListItem
  time: string
  episode: number
}

function getScheduleForDate(date: Date): ScheduleEntry[] {
  const dayOfWeek = date.getDay()
  const entries: ScheduleEntry[] = []

  airingAnime.forEach((anime) => {
    const assignedDay = anime.id % 7
    if (assignedDay === dayOfWeek) {
      const timeIndex = (anime.id * 3) % BROADCAST_TIMES.length
      const weeksSinceStart = Math.floor(
        (date.getTime() - new Date(2026, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)
      )
      const episode = Math.max(1, Math.min(weeksSinceStart + 1, anime.episodes))

      entries.push({
        anime,
        time: BROADCAST_TIMES[timeIndex],
        episode,
      })
    }
  })

  entries.sort((a, b) => a.time.localeCompare(b.time))
  return entries
}

/* -- Date helpers ---------------------------------------------------------- */

function formatDateTab(date: Date): string {
  const days = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"]
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`
}

function formatDayName(date: Date): string {
  const days = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"]
  return days[date.getDay()]
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function getWeekWindow(offset: number): Date[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dates: Date[] = []
  const startOffset = offset * 7
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + startOffset + i)
    d.setHours(0, 0, 0, 0)
    dates.push(d)
  }
  return dates
}

/* -- Schedule entry cards -------------------------------------------------- */

function ScheduleCardList({ entry }: { entry: ScheduleEntry }) {
  const [imgError, setImgError] = useState(false)

  return (
    <Link
      href={`/anime/${entry.anime.id}`}
      className="group flex items-center gap-4 p-3 bg-card rounded-xl border border-border/50 hover:border-primary/30 transition-all"
    >
      <div className="relative h-16 w-12 rounded-lg overflow-hidden shrink-0">
        {entry.anime.image && !imgError ? (
          <img
            src={entry.anime.image}
            alt={entry.anime.title}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <NoImagePlaceholder variant="portrait" className="h-full w-full text-[8px]" label="" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
          {entry.anime.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{entry.anime.titleJp}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded">
            Ep. {entry.episode}
          </span>
          <span className="text-xs text-muted-foreground">{entry.anime.studio}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="flex items-center gap-1 text-xs font-medium text-foreground">
          <Clock className="h-3 w-3 text-muted-foreground" />
          {entry.time}
        </span>
        <span className="flex items-center gap-1 text-xs text-yellow-500">
          <Star className="h-3 w-3 fill-yellow-500" />
          {entry.anime.rating}
        </span>
      </div>
    </Link>
  )
}

function ScheduleCardGrid({ entry }: { entry: ScheduleEntry }) {
  const [imgError, setImgError] = useState(false)

  return (
    <Link
      href={`/anime/${entry.anime.id}`}
      className="group relative flex flex-col text-left"
    >
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2">
        {entry.anime.image && !imgError ? (
          <img
            src={entry.anime.image}
            alt={entry.anime.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <NoImagePlaceholder variant="portrait" className="h-full w-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

        {/* Episode badge */}
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground rounded-md text-[10px] font-bold">
          Ep. {entry.episode}
        </div>

        {/* Time badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-background/80 backdrop-blur-sm rounded-md text-xs font-semibold text-foreground">
          <Clock className="h-3 w-3 text-muted-foreground" />
          {entry.time}
        </div>

        {/* Rating */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-background/80 backdrop-blur-sm rounded-md text-xs font-semibold text-yellow-500">
          <Star className="h-3 w-3 fill-yellow-500" />
          {entry.anime.rating}
        </div>
      </div>

      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
        {entry.anime.title}
      </h3>
      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{entry.anime.titleJp}</p>
    </Link>
  )
}

function ScheduleCardLarge({ entry }: { entry: ScheduleEntry }) {
  const [imgError, setImgError] = useState(false)

  return (
    <Link
      href={`/anime/${entry.anime.id}`}
      className="group relative flex flex-col text-left"
    >
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3">
        {entry.anime.image && !imgError ? (
          <img
            src={entry.anime.image}
            alt={entry.anime.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <NoImagePlaceholder variant="portrait" className="h-full w-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

        {/* Episode badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-primary-foreground rounded-md text-xs font-bold">
          Episodio {entry.episode}
        </div>

        {/* Time */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-background/80 backdrop-blur-sm rounded-md text-sm font-semibold text-foreground">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          {entry.time}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="flex items-center gap-1 text-sm text-yellow-500 font-semibold">
            <Star className="h-4 w-4 fill-yellow-500" />
            {entry.anime.rating}
          </span>
          <span className="text-xs text-foreground/70">{entry.anime.studio}</span>
        </div>
      </div>

      <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
        {entry.anime.title}
      </h3>
      <p className="text-sm text-muted-foreground mt-0.5">{entry.anime.titleJp}</p>
      <div className="flex items-center gap-2 mt-1.5">
        <span className="text-xs text-muted-foreground">{entry.anime.type}</span>
        <span className="h-0.5 w-0.5 bg-muted-foreground rounded-full" />
        <span className="text-xs text-muted-foreground">{entry.anime.episodes} ep.</span>
      </div>
    </Link>
  )
}

/* -- Date tabs with 7-day window ------------------------------------------- */

function DateTabs({
  dates,
  selected,
  onSelect,
  onPrev,
  onNext,
}: {
  dates: Date[]
  selected: Date
  onSelect: (d: Date) => void
  onPrev: () => void
  onNext: () => void
}) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onPrev}
        className="p-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors border border-border/50 shrink-0"
        aria-label="Semana anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div className="flex gap-1.5 flex-1 justify-center">
        {dates.map((date) => {
          const isToday = isSameDay(date, today)
          const isSelected = isSameDay(date, selected)
          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => onSelect(date)}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors border text-center ${isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : isToday
                    ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                    : "bg-card text-muted-foreground border-border/50 hover:text-foreground hover:border-border"
                }`}
            >
              <span className="block">{formatDateTab(date)}</span>
              {isToday && (
                <span className="block text-[10px] font-normal opacity-70 mt-0.5">Hoy</span>
              )}
            </button>
          )
        })}
      </div>
      <button
        type="button"
        onClick={onNext}
        className="p-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors border border-border/50 shrink-0"
        aria-label="Semana siguiente"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

/* -- Home page preview section --------------------------------------------- */

export function ScheduleSection() {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const entries = useMemo(() => getScheduleForDate(today), [today])

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-display text-foreground">
                Estimated Schedule
              </h2>
              <p className="text-sm text-muted-foreground">
                Hoy, {formatDateTab(today)}
              </p>
            </div>
          </div>
          <Link
            href="/schedule"
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Ver todo
          </Link>
        </div>

        {entries.length > 0 ? (
          <div className="flex flex-col gap-3">
            {entries.map((entry) => (
              <ScheduleCardList key={entry.anime.id} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-card rounded-xl border border-border/50">
            <CalendarDays className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-foreground">No hay anime programado para hoy</p>
            <p className="text-xs text-muted-foreground mt-1">Consulta otros dias en el horario completo</p>
            <Link
              href="/schedule"
              className="mt-3 px-4 py-2 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Ver horario completo
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

/* -- Full schedule page component ------------------------------------------ */

export function FullSchedule() {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const [weekOffset, setWeekOffset] = useState(0)
  const dates = useMemo(() => getWeekWindow(weekOffset), [weekOffset])
  const [selectedDate, setSelectedDate] = useState<Date>(today)
  const entries = useMemo(() => getScheduleForDate(selectedDate), [selectedDate])
  const [viewMode] = useViewMode("schedule-view", "list")

  return (
    <div className="flex flex-col gap-6">
      <DateTabs
        dates={dates}
        selected={selectedDate}
        onSelect={setSelectedDate}
        onPrev={() => setWeekOffset((o) => o - 1)}
        onNext={() => setWeekOffset((o) => o + 1)}
      />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold font-display text-foreground">
            {formatDayName(selectedDate)} - {formatDateTab(selectedDate)}
            {isSameDay(selectedDate, today) && (
              <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-primary text-primary-foreground rounded-md uppercase">
                Hoy
              </span>
            )}
          </h2>
          <span className="text-sm text-muted-foreground">
            {entries.length} {entries.length === 1 ? "anime" : "animes"}
          </span>
        </div>
        <ViewModeToggle storageKey="schedule-view" defaultMode="list" />
      </div>

      {entries.length > 0 ? (
        <>
          {viewMode === "list" && (
            <div className="flex flex-col gap-3">
              {entries.map((entry) => (
                <ScheduleCardList key={entry.anime.id} entry={entry} />
              ))}
            </div>
          )}
          {viewMode === "grid" && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {entries.map((entry) => (
                <ScheduleCardGrid key={entry.anime.id} entry={entry} />
              ))}
            </div>
          )}
          {viewMode === "large" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {entries.map((entry) => (
                <ScheduleCardLarge key={entry.anime.id} entry={entry} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-xl border border-border/50">
          <CalendarDays className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="text-base font-medium text-foreground">No hay anime programado</p>
          <p className="text-sm text-muted-foreground mt-1">
            No hay emisiones programadas para {formatDateTab(selectedDate)}
          </p>
        </div>
      )}
    </div>
  )
}
