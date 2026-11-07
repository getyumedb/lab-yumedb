import { notFound } from "next/navigation"
import { Heart, Calendar, MapPin, Film, Globe, BookOpen, Info, ExternalLink } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getMockPerson } from "@/lib/mock/person.mock"
import { PersonVoiceRoles, PersonStaffRoles, PersonCharacters } from "@/components/people-sections"
import { FavoriteButton } from "@/components/favorite-button"
import { ImageWithFallback } from "@/components/image-with-fallback"
import { ShareButton } from "@/components/share-button"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const person = getMockPerson(id)
  if (!person) return { title: "Persona no encontrada - YumeDb" }
  return {
    title: `${person.name} - YumeDb`,
    description: person.bio.slice(0, 160),
  }
}

export default async function PersonDetailPage({ params }: PageProps) {
  const { id } = await params
  const person = getMockPerson(id)
  if (!person) notFound()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative">
          <div className="absolute inset-0 h-[300px]">
            <ImageWithFallback src={person.roles[0]?.animeImage} alt="" className="w-full h-full object-cover" placeholderVariant="banner" placeholderLabel="" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-8 md:pt-20">
            <div className="flex flex-col md:flex-row gap-6 items-end">
              <div className="h-40 w-40 rounded-full overflow-hidden border-2 border-primary shadow-xl shrink-0 mx-auto md:mx-0">
                <ImageWithFallback src={person.image} alt={person.name} className="h-full w-full object-cover" placeholderVariant="circle" placeholderLabel="" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="px-2.5 py-1 text-xs font-bold bg-primary/20 text-primary rounded-md uppercase tracking-wide">
                    {person.type}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground text-balance">
                  {person.name}
                </h1>
                <p className="text-lg text-muted-foreground mt-1">{person.nameJp}</p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" /> {person.birthDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" /> {person.birthPlace}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Film className="h-4 w-4 text-primary" /> {person.roles.length} participaciones
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart className="h-4 w-4 text-primary" /> {person.favorites.toLocaleString()} favoritos
                  </span>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
                  <FavoriteButton className="flex-1 max-w-[200px]" />
                  <ShareButton title={person.name} path={`/people/${person.id}`} />
                  {person.websiteUrl && (
                    <a
                      href={person.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg transition-colors border border-border/50 text-sm font-medium"
                    >
                      <Globe className="h-4 w-4" />
                      <span className="hidden sm:inline">Sitio web</span>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* Bio */}
              <section className="bg-card rounded-xl border border-border/50 p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold font-display text-foreground mb-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Biografia
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{person.bio}</p>
              </section>

              {/* Voice actor roles (anime + character) */}
              <PersonVoiceRoles person={person} />

              {/* Staff roles */}
              <PersonStaffRoles
                roles={[
                  ...person.roles.filter((r) => !r.role.startsWith("Voice Actor")),
                  ...(person.staffRoles ?? []).map((sr) => ({ animeId: sr.animeId, animeName: sr.animeName, animeImage: sr.animeImage, role: sr.position })),
                ]}
              />

              {/* Characters - collapsible */}
              {person.characters && person.characters.length > 0 && (
                <PersonCharacters characters={person.characters} />
              )}
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
                    <dt className="text-muted-foreground">Nombre</dt>
                    <dd className="text-foreground font-medium">{person.name}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Nombre japones</dt>
                    <dd className="text-foreground font-medium">{person.nameJp}</dd>
                  </div>
                  {person.alternativeNames && person.alternativeNames.length > 0 && (
                    <div>
                      <dt className="text-muted-foreground mb-1.5">Nombres alternativos</dt>
                      <dd className="flex flex-wrap gap-1.5">
                        {person.alternativeNames.map((name) => (
                          <span
                            key={name}
                            className="px-2.5 py-1 text-xs bg-primary/5 text-foreground rounded-lg border border-border/50"
                          >
                            {name}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-muted-foreground">Rol</dt>
                    <dd className="text-foreground font-medium">{person.type}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Fecha de nacimiento</dt>
                    <dd className="text-foreground font-medium">{person.birthDate}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Lugar de nacimiento</dt>
                    <dd className="text-foreground font-medium">{person.birthPlace}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Genero</dt>
                    <dd className="text-foreground font-medium">{person.gender}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Favoritos</dt>
                    <dd className="text-foreground font-medium">{person.favorites.toLocaleString()}</dd>
                  </div>
                  {person.websiteUrl && (
                    <div>
                      <dt className="text-muted-foreground">Sitio web</dt>
                      <dd>
                        <a
                          href={person.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                        >
                          <Globe className="h-3.5 w-3.5" />
                          {person.websiteUrl.replace(/^https?:\/\//, "")}
                        </a>
                      </dd>
                    </div>
                  )}
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
