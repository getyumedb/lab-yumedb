import Link from "next/link"
import { SearchX } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <SearchX className="h-16 w-16 text-muted-foreground/40 mb-6" />
        <h1 className="text-3xl font-bold font-display text-foreground mb-2">
          Anime no encontrado
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          El anime que buscas no existe en nuestra base de datos. Puede que
          haya sido eliminado o que la URL sea incorrecta.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          Volver al inicio
        </Link>
      </main>
      <Footer />
    </div>
  )
}
