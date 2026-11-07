import { InfoPageLayout } from "@/components/info-page-layout"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Politica de Cookies - YumeDb",
  description: "Informacion sobre el uso de cookies en YumeDb.",
}

export default function CookiesPage() {
  return (
    <InfoPageLayout title="Politica de Cookies" lastUpdated="22 de febrero de 2026">
      <h2>Que son las cookies</h2>
      <p>
        Las cookies son pequenos archivos de texto que se almacenan en tu dispositivo cuando
        visitas un sitio web. Se utilizan ampliamente para hacer que los sitios funcionen de
        manera eficiente y para proporcionar informacion a los propietarios del sitio.
      </p>

      <h2>Cookies que utilizamos</h2>

      <h3>Cookies esenciales</h3>
      <p>
        Estas cookies son necesarias para el funcionamiento de la plataforma. Incluyen cookies
        de sesion para mantener tu inicio de sesion y cookies de preferencias para recordar
        tu configuracion (idioma, tema, etc.).
      </p>

      <h3>Cookies de funcionalidad</h3>
      <p>
        Permiten funciones mejoradas y personalizacion, como recordar tu nombre de usuario,
        tus preferencias de visualizacion y tu historial de anime visitados.
      </p>

      <h3>Cookies analiticas</h3>
      <p>
        Nos ayudan a entender como los usuarios interactuan con la plataforma, permitiendonos
        mejorar su estructura y contenido. Estos datos se recopilan de forma anonima y agregada.
      </p>

      <h2>Control de cookies</h2>
      <p>
        Puedes controlar y eliminar cookies a traves de la configuracion de tu navegador. Ten
        en cuenta que deshabilitar las cookies esenciales puede afectar al funcionamiento de
        la plataforma.
      </p>
      <ul>
        <li><strong>Chrome:</strong> Configuracion &gt; Privacidad y seguridad &gt; Cookies</li>
        <li><strong>Firefox:</strong> Opciones &gt; Privacidad y seguridad &gt; Cookies</li>
        <li><strong>Safari:</strong> Preferencias &gt; Privacidad &gt; Cookies</li>
        <li><strong>Edge:</strong> Configuracion &gt; Cookies y permisos del sitio</li>
      </ul>

      <h2>Actualizaciones</h2>
      <p>
        Esta politica puede actualizarse periodicamente para reflejar cambios en nuestras
        practicas. Te notificaremos de cualquier cambio significativo a traves de la plataforma.
      </p>

      <h2>Contacto</h2>
      <p>
        Si tienes preguntas sobre nuestra politica de cookies, contactanos en{" "}
        <a href="mailto:privacy@yumedb.com">privacy@yumedb.com</a>.
      </p>
    </InfoPageLayout>
  )
}
