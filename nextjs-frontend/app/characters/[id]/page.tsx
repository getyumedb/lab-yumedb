import { notFound } from "next/navigation"
import Link from "next/link"
import { Calendar, User, Heart, BookOpen, Info } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getMockCharacter } from "@/lib/mock/character.mock"
import { CharacterAppearances } from "@/components/character-appearances"
import { CharacterVoiceActors } from "@/components/character-voice-actors"
import { FavoriteButton } from "@/components/favorite-button"
import { ImageWithFallback } from "@/components/image-with-fallback"
import { ShareButton } from "@/components/share-button"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const character = getMockCharacter(id)
  if (!character) return { title: "Personaje no encontrado - YumeDb" }
  return {
    title: `${character.name} - YumeDb`,
    description: character.description.slice(0, 160),
  }
}

export default async function CharacterDetailPage({ params }: PageProps) {
  const { id } = await params
  const character = getMockCharacter(id)
  if (!character) notFound()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative">
          <div className="absolute inset-0 h-[300px]">
            <ImageWithFallback src={character.animeAppearances[0]?.animeImage} alt="" className="w-full h-full object-cover" placeholderVariant="banner" placeholderLabel="" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-8 md:pt-20">
            <div className="flex flex-col md:flex-row gap-6 items-end">
              <div className="h-40 w-40 rounded-full overflow-hidden border-2 border-primary shadow-xl shrink-0 mx-auto md:mx-0">
                <ImageWithFallback src={character.image} alt={character.name} className="h-full w-full object-cover" placeholderVariant="circle" placeholderLabel="" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground text-balance">
                  {character.name}
                </h1>
                <p className="text-lg text-muted-foreground mt-1">{character.nameJp}</p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-sm text-muted-foreground">
                  {character.age !== "Desconocida" && (
                    <span className="flex items-center gap-1.5">
                      <User className="h-4 w-4 text-primary" /> {character.age} anos
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded">{character.gender}</span>
                  </span>
                  {character.birthDate !== "Desconocido" && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-primary" /> {character.birthDate}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Heart className="h-4 w-4 text-primary" /> {character.favorites.toLocaleString()} favoritos
                  </span>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-2 mt-4 w-52 md:w-64">
                  <FavoriteButton className="flex-1" />
                  <ShareButton title={character.name} path={`/characters/${character.id}`} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* Description */}
              <section className="bg-card rounded-xl border border-border/50 p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold font-display text-foreground mb-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Descripcion
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{character.description}</p>
              </section>

              {/* Anime appearances */}
              <CharacterAppearances appearances={character.animeAppearances} />

              {/* Voice actors */}
              <CharacterVoiceActors voiceActors={character.voiceActors} />
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
                    <dd className="text-foreground font-medium">{character.name}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Nombre japones</dt>
                    <dd className="text-foreground font-medium">{character.nameJp}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Genero</dt>
                    <dd className="text-foreground font-medium">{character.gender}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Edad</dt>
                    <dd className="text-foreground font-medium">{character.age}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Cumpleanos</dt>
                    <dd className="text-foreground font-medium">{character.birthDate}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Favoritos</dt>
                    <dd className="text-foreground font-medium">{character.favorites.toLocaleString()}</dd>
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
