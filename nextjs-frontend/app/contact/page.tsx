"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, MessageSquare, Bug, HelpCircle, Send } from "lucide-react"
import { toast } from "sonner"

const categories = [
  { value: "general", label: "Consulta general", icon: HelpCircle },
  { value: "feedback", label: "Feedback / Sugerencia", icon: MessageSquare },
  { value: "bug", label: "Reportar un error", icon: Bug },
  { value: "business", label: "Colaboraciones / Negocios", icon: Mail },
]

export default function ContactPage() {
  const [category, setCategory] = useState("general")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Mensaje enviado", { description: "Te responderemos lo antes posible." })
    setName("")
    setEmail("")
    setMessage("")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-foreground">Contacto</h1>
          <p className="text-muted-foreground mt-2">
            Tienes alguna pregunta o sugerencia? Nos encantaria saber de ti.
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border/50 p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Category selector */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Motivo del contacto</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon
                  const isActive = category === cat.value
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg border transition-colors text-left ${
                        isActive
                          ? "bg-primary/10 text-primary border-primary/30 font-medium"
                          : "bg-secondary/50 text-muted-foreground border-border/50 hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {cat.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-name" className="text-sm font-medium text-foreground">Nombre</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="px-3 py-2.5 text-sm bg-secondary border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-email" className="text-sm font-medium text-foreground">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="px-3 py-2.5 text-sm bg-secondary border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-message" className="text-sm font-medium text-foreground">Mensaje</label>
              <textarea
                id="contact-message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje aqui..."
                rows={5}
                className="px-3 py-2.5 text-sm bg-secondary border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 resize-none"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors self-end"
            >
              <Send className="h-4 w-4" />
              Enviar mensaje
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Tambien puedes escribirnos directamente a <a href="mailto:hello@yumedb.com" className="text-primary underline hover:text-primary/80">hello@yumedb.com</a></p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
