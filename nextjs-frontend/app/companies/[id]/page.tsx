import { notFound } from "next/navigation"
import { Calendar, Globe, MapPin, Users, Heart, Film, BookOpen, Info } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getMockCompany } from "@/lib/mock/company.mock"
import { CompanyProductions } from "@/components/company-productions"
import { FavoriteButton } from "@/components/favorite-button"
import { ImageWithFallback } from "@/components/image-with-fallback"
import { ShareButton } from "@/components/share-button"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const company = getMockCompany(id)
  if (!company) return { title: "Company no encontrada - YumeDb" }
  return {
    title: `${company.name} - YumeDb`,
    description: company.description.slice(0, 160),
  }
}

export default async function CompanyDetailPage({ params }: PageProps) {
  const { id } = await params
  const company = getMockCompany(id)
  if (!company) notFound()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative">
          <div className="absolute inset-0 h-[300px]">
            <ImageWithFallback src={company.image} alt="" className="w-full h-full object-cover" placeholderVariant="banner" placeholderLabel="" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-8 md:pt-20">
            <div className="flex flex-col md:flex-row gap-6 items-end">
              <div className="h-40 w-40 rounded-2xl overflow-hidden border-2 border-primary shadow-xl shrink-0 bg-card">
                <ImageWithFallback src={company.image} alt={company.name} className="h-full w-full object-cover" placeholderVariant="square" placeholderLabel="" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 text-xs font-bold bg-primary/20 text-primary rounded-md uppercase tracking-wide">
                    {company.type}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground text-balance">
                  {company.name}
                </h1>
                <p className="text-lg text-muted-foreground mt-1">{company.nameJp}</p>

                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" /> Fundado en {company.founded}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" /> {company.headquarters}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-primary" /> {company.memberCount} empleados
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Film className="h-4 w-4 text-primary" /> {company.animeProductions.length} producciones
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart className="h-4 w-4 text-primary" /> {company.favorites.toLocaleString()} favoritos
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-center justify-center md:justify-start gap-2 w-52 md:w-64">
                    <FavoriteButton className="flex-1" />
                    <ShareButton title={company.name} path={`/companies/${company.id}`} />
                  </div>

                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors bg-primary/20 text-primary border border-primary/30">
                      <Globe className="h-4 w-4" />
                      Sitio web oficial
                    </a>
                  )}
                </div>

              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* About */}
              <section className="bg-card rounded-xl border border-border/50 p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold font-display text-foreground mb-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Acerca de
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{company.description}</p>
              </section>

              {/* Anime productions */}
              <CompanyProductions productions={company.animeProductions} />
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-6">
              <div className="bg-card rounded-xl border border-border/50 p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold font-display text-foreground mb-5">
                  <Info className="h-5 w-5 text-primary" />
                  Informacion
                </h2>
                <dl className="flex flex-col gap-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Tipo</dt>
                    <dd className="text-foreground font-medium">{company.type}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Fundado</dt>
                    <dd className="text-foreground font-medium">{company.founded}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Sede</dt>
                    <dd className="text-foreground font-medium">{company.headquarters}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Empleados</dt>
                    <dd className="text-foreground font-medium">{company.memberCount}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Favoritos</dt>
                    <dd className="text-foreground font-medium">{company.favorites.toLocaleString()}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
