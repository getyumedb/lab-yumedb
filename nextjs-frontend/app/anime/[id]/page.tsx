import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DetailHero } from "@/components/detail/detail-hero"
import { DetailSynopsis } from "@/components/detail/detail-synopsis"
import { DetailScores } from "@/components/detail/detail-scores"
import { DetailCharacters } from "@/components/detail/detail-characters"
import { DetailGallery } from "@/components/detail/detail-gallery"
import { DetailStaffThemes } from "@/components/detail/detail-staff-themes"
import { DetailStaff } from "@/components/detail/detail-staff"
import { DetailExternalRatings } from "@/components/detail/detail-external-ratings"
import { DetailReviews } from "@/components/detail/detail-reviews"
import { DetailRelations } from "@/components/detail/detail-relations"
import { DetailEpisodes } from "@/components/detail/detail-episodes"
import { DetailAlternativeTitles } from "@/components/detail/detail-alternative-titles"
import { DetailExternalLinks } from "@/components/detail/detail-external-links"
import { DetailStreamingPlatforms } from "@/components/detail/detail-streaming-platforms"
import { DetailTrailers } from "@/components/detail/detail-trailers"
import { getMockAnimeDetail } from "@/lib/mock/anime.mock"
import { getMockAnimes } from "@/lib/mock/anime.mock"
import { AnimeCard } from "@/components/anime-card"
import { TrackAnimeVisit } from "@/components/track-anime-visit"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const anime = getMockAnimeDetail(id)
  if (!anime) {
    return { title: "Anime no encontrado - YumeDb" }
  }
  return {
    title: `${anime.title} - YumeDb`,
    description: anime.synopsis.slice(0, 160),
  }
}

export default async function AnimeDetailPage({ params }: PageProps) {
  const { id } = await params
  const anime = getMockAnimeDetail(id)

  if (!anime) {
    notFound()
  }

  const relatedAnime = getMockAnimes()
    .filter((a) => a.id !== anime.id && a.genres.some((g) => anime.genres.includes(g)))
    .slice(0, 6)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TrackAnimeVisit id={anime.id} title={anime.title} image={anime.image} />
      <main>
        {/* Hero banner with poster and main info */}
        <DetailHero anime={anime} />

        {/* Content grid */}
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main column */}
            <div className="lg:col-span-2 flex flex-col gap-6 order-2 lg:order-1">
              <DetailSynopsis anime={anime} />
              <DetailRelations anime={anime} />
              <DetailEpisodes anime={anime} />
              <DetailCharacters anime={anime} />
              <DetailStaff anime={anime} />
              <DetailTrailers anime={anime} />
              <DetailGallery anime={anime} />
              <DetailReviews anime={anime} />

              {/* Similar anime */}
              {relatedAnime.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold font-display text-foreground mb-5">
                    Anime similar
                  </h2>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {relatedAnime.map((a) => (
                      <AnimeCard key={a.id} anime={a} />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar - shown first on mobile for quick info */}
            <div className="flex flex-col gap-6 order-1 lg:order-2">
              <DetailAlternativeTitles anime={anime} />
              <DetailStaffThemes anime={anime} />
              <DetailScores anime={anime} />
              <DetailExternalRatings anime={anime} />
              <DetailExternalLinks anime={anime} />
              <DetailStreamingPlatforms anime={anime} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
