import { CalendarDays } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FullSchedule } from "@/components/schedule-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Schedule - YumeDb",
  description: "Horario estimado de emision de anime",
}

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold font-display text-foreground text-balance">
              Estimated Schedule
            </h1>
          </div>
          <p className="text-muted-foreground">
            Horario estimado de emision de anime en curso. Navega entre fechas para ver que se emite cada dia.
          </p>
        </div>
        <FullSchedule />
      </main>
      <Footer />
    </div>
  )
}
