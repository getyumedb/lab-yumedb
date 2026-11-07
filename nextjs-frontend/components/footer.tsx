import Link from "next/link"
import { Heart } from "lucide-react"
import { RecentlyVisitedFooter } from "@/components/recently-visited-footer"

const footerLinks = {
  Explorar: [
    { label: "Top Anime", href: "/anime" },
    { label: "Anime de Temporada", href: "/anime" },
    { label: "Ranking Popular", href: "/anime" },
    { label: "Estrenos recientes", href: "/anime" },
    { label: "Horario de emision", href: "/schedule" },
  ],
  Comunidad: [
    { label: "Personajes", href: "/characters" },
    { label: "Personas", href: "/people" },
    { label: "Companias", href: "/companies" },
    { label: "Recomendaciones", href: "/" },
    { label: "Listas de usuarios", href: "/" },
  ],
  YumeDb: [
    { label: "Sobre nosotros", href: "/about" },
    { label: "Contacto", href: "/contact" },
  ],
  Legal: [
    { label: "Terminos de uso", href: "/terms" },
    { label: "Privacidad", href: "/privacy" },
    { label: "Cookies", href: "/cookies" },
    { label: "DMCA", href: "/dmca" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Recently visited section */}
        <RecentlyVisitedFooter />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-base font-display">
                Y
              </div>
              <span className="text-lg font-bold font-display text-foreground">YumeDb</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Tu base de datos de anime favorita. Descubre, valora y sigue miles de titulos.
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              Hecho con <Heart className="h-3 w-3 text-primary fill-primary" /> para la comunidad otaku
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-foreground mb-3">{category}</h4>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 YumeDb. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Twitter
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Discord
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
