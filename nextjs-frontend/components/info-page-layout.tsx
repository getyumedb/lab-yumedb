import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface InfoPageLayoutProps {
  title: string
  subtitle?: string
  lastUpdated?: string
  children: React.ReactNode
}

export function InfoPageLayout({ title, subtitle, lastUpdated, children }: InfoPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
          {lastUpdated && (
            <p className="text-xs text-muted-foreground/60 mt-3">
              Ultima actualizacion: {lastUpdated}
            </p>
          )}
        </div>
        <article className="prose prose-sm max-w-none [&_h2]:text-xl [&_h2]:font-bold [&_h2]:font-display [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-sm [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:text-sm [&_ul]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul>li]:mb-1.5 [&_ol]:text-sm [&_ol]:text-muted-foreground [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol>li]:mb-1.5 [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80 [&_strong]:text-foreground">
          {children}
        </article>
      </main>
      <Footer />
    </div>
  )
}
