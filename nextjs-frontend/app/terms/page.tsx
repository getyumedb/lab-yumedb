import { InfoPageLayout } from "@/components/info-page-layout"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terminos de uso - YumeDb",
  description: "Terminos y condiciones de uso de la plataforma YumeDb.",
}

export default function TermsPage() {
  return (
    <InfoPageLayout title="Terminos de uso" lastUpdated="22 de febrero de 2026">
      <h2>1. Aceptacion de los terminos</h2>
      <p>
        Al acceder y utilizar YumeDb, aceptas quedar vinculado por estos Terminos de Uso. Si no
        estas de acuerdo con alguno de estos terminos, no debes utilizar la plataforma.
      </p>

      <h2>2. Descripcion del servicio</h2>
      <p>
        YumeDb es una plataforma de base de datos de anime que permite a los usuarios explorar
        informacion sobre series de anime, gestionar listas personales, valorar contenido y
        participar en la comunidad.
      </p>

      <h2>3. Registro de cuentas</h2>
      <p>
        Para acceder a determinadas funcionalidades es necesario crear una cuenta. Eres responsable
        de mantener la confidencialidad de tu cuenta y contrasena. Debes proporcionar informacion
        veraz y actualizada durante el proceso de registro.
      </p>

      <h2>4. Uso aceptable</h2>
      <p>Te comprometes a no:</p>
      <ul>
        <li>Utilizar la plataforma para fines ilegales o no autorizados</li>
        <li>Publicar contenido ofensivo, difamatorio o que viole derechos de terceros</li>
        <li>Intentar acceder a cuentas o datos de otros usuarios sin autorizacion</li>
        <li>Utilizar scripts, bots o herramientas automatizadas para acceder masivamente al servicio</li>
        <li>Interferir con el funcionamiento normal de la plataforma</li>
      </ul>

      <h2>5. Contenido del usuario</h2>
      <p>
        Al publicar reviews, comentarios u otro contenido en YumeDb, otorgas a la plataforma una
        licencia no exclusiva para mostrar dicho contenido. Conservas la propiedad de tu contenido
        original y puedes eliminarlo en cualquier momento.
      </p>

      <h2>6. Propiedad intelectual</h2>
      <p>
        Las imagenes, logotipos y material relacionado con series de anime son propiedad de sus
        respectivos creadores y titulares de derechos. YumeDb los utiliza con fines informativos
        y bajo principios de uso justo.
      </p>

      <h2>7. Limitacion de responsabilidad</h2>
      <p>
        YumeDb se proporciona &quot;tal cual&quot; sin garantias de ningun tipo. No nos hacemos
        responsables de la exactitud de la informacion proporcionada por terceros ni de danos
        derivados del uso de la plataforma.
      </p>

      <h2>8. Modificaciones</h2>
      <p>
        Nos reservamos el derecho de modificar estos terminos en cualquier momento. Los cambios
        seran efectivos inmediatamente despues de su publicacion. El uso continuado de la
        plataforma implica la aceptacion de los terminos modificados.
      </p>

      <h2>9. Contacto</h2>
      <p>
        Si tienes preguntas sobre estos terminos, contactanos en{" "}
        <a href="mailto:legal@yumedb.com">legal@yumedb.com</a>.
      </p>
    </InfoPageLayout>
  )
}
