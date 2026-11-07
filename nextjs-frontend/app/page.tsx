import { Header } from "@/components/header"
import { ExtensionBanner } from "@/components/extension-banner"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { TrendingSection } from "@/components/trending-section"
import { RecentlyWatched } from "@/components/recently-watched"
import { SeasonalSection } from "@/components/seasonal-section"
import { TopAnimeSection } from "@/components/top-anime-section"
import { GenresSection } from "@/components/genres-section"
import { RecommendationsSection } from "@/components/recommendations-section"
import { ScheduleSection } from "@/components/schedule-section"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <ExtensionBanner />
        <TrendingSection />
        <ScheduleSection />
        <RecentlyWatched />
        <SeasonalSection />
        <TopAnimeSection />
        <GenresSection />
        <RecommendationsSection />
      </main>
      <Footer />
    </div>
  )
}
