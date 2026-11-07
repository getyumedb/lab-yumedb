import { InfoPageLayout } from "@/components/info-page-layout"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sobre nosotros - YumeDb",
  description: "Conoce al equipo detras de YumeDb, la base de datos de anime mas completa.",
}

export default function AboutPage() {
  return (
    <InfoPageLayout title="Sobre nosotros" subtitle="Conoce la historia y mision de YumeDb">
      <h2>Nuestra mision</h2>
      <p>
        YumeDb nace con el objetivo de crear la base de datos de anime mas completa, accesible y
        hermosa en espanol. Creemos que cada fan de anime merece una plataforma donde pueda
        descubrir nuevas series, hacer seguimiento de su progreso y conectar con una comunidad
        apasionada.
      </p>

      <h2>Quienes somos</h2>
      <p>
        Somos un equipo de desarrolladores y entusiastas del anime que compartimos una vision
        comun: democratizar el acceso a informacion de calidad sobre anime. Nuestro equipo esta
        distribuido por todo el mundo hispanohablante, trabajando dia a dia para mejorar la
        experiencia de nuestros usuarios.
      </p>

      <h2>Que ofrecemos</h2>
      <ul>
        <li><strong>Base de datos completa:</strong> Miles de titulos con informacion detallada sobre episodios, personajes, staff y mas.</li>
        <li><strong>Seguimiento personalizado:</strong> Gestiona tu lista de anime, valora tus series favoritas y lleva un registro de tu progreso.</li>
        <li><strong>Comunidad activa:</strong> Conecta con otros fans a traves de reviews, recomendaciones y foros.</li>
        <li><strong>Horarios de emision:</strong> Mantente al dia con los estrenos y horarios de las series en emision.</li>
        <li><strong>Plataformas de streaming:</strong> Encuentra donde ver cada anime de forma legal.</li>
      </ul>

      <h2>Nuestros valores</h2>
      <ul>
        <li><strong>Accesibilidad:</strong> YumeDb es y sera siempre gratuito para todos los usuarios.</li>
        <li><strong>Calidad:</strong> Nos esforzamos por ofrecer informacion precisa y actualizada.</li>
        <li><strong>Comunidad:</strong> Valoramos las contribuciones y feedback de nuestros usuarios.</li>
        <li><strong>Privacidad:</strong> Respetamos la privacidad de nuestros usuarios y protegemos sus datos.</li>
      </ul>

      <h2>Contacto</h2>
      <p>
        Si tienes alguna pregunta, sugerencia o simplemente quieres saludarnos, no dudes en
        visitar nuestra <a href="/contact">pagina de contacto</a>. Estaremos encantados de
        escucharte.
      </p>
    </InfoPageLayout>
  )
}
