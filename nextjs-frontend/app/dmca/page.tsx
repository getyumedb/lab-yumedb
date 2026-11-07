import { InfoPageLayout } from "@/components/info-page-layout"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "DMCA - YumeDb",
  description: "Politica de proteccion de derechos de autor (DMCA) de YumeDb.",
}

export default function DmcaPage() {
  return (
    <InfoPageLayout title="DMCA - Proteccion de derechos de autor" lastUpdated="22 de febrero de 2026">
      <h2>Compromiso con los derechos de autor</h2>
      <p>
        YumeDb respeta los derechos de propiedad intelectual de terceros y cumple con la Ley de
        Derechos de Autor del Milenio Digital (DMCA). Respondemos activamente a las notificaciones
        de presunta infraccion y tomamos las medidas apropiadas.
      </p>

      <h2>Contenido en YumeDb</h2>
      <p>
        YumeDb es una base de datos informativa sobre anime. Las imagenes, titulos y material
        relacionado con series de anime son propiedad de sus respectivos creadores, estudios de
        animacion y distribuidores. Utilizamos este material con fines informativos y de
        referencia.
      </p>

      <h2>Notificacion de infraccion</h2>
      <p>
        Si crees que algun contenido en YumeDb infringe tus derechos de autor, puedes enviarnos
        una notificacion DMCA que incluya:
      </p>
      <ol>
        <li>Identificacion de la obra protegida que consideras infringida.</li>
        <li>Identificacion del material en YumeDb que presuntamente infringe, incluyendo la URL.</li>
        <li>Tu informacion de contacto: nombre, direccion, telefono y correo electronico.</li>
        <li>Una declaracion de que crees de buena fe que el uso del material no esta autorizado.</li>
        <li>Una declaracion bajo juramento de que la informacion proporcionada es exacta y que eres el titular de los derechos o estas autorizado para actuar en su nombre.</li>
        <li>Tu firma fisica o electronica.</li>
      </ol>

      <h2>Donde enviar la notificacion</h2>
      <p>
        Envia tu notificacion DMCA a nuestro agente designado por correo electronico a{" "}
        <a href="mailto:dmca@yumedb.com">dmca@yumedb.com</a>.
      </p>

      <h2>Contranotificacion</h2>
      <p>
        Si consideras que tu contenido fue retirado por error, puedes enviar una
        contranotificacion incluyendo:
      </p>
      <ul>
        <li>Identificacion del contenido retirado y su ubicacion anterior</li>
        <li>Declaracion bajo juramento de que la retirada fue un error o una identificacion incorrecta</li>
        <li>Tu nombre, direccion y consentimiento a la jurisdiccion del tribunal competente</li>
        <li>Tu firma fisica o electronica</li>
      </ul>

      <h2>Politica de reincidencia</h2>
      <p>
        YumeDb puede deshabilitar el acceso de usuarios que infrinjan repetidamente los derechos
        de propiedad intelectual de terceros, de acuerdo con nuestra politica de reincidencia.
      </p>
    </InfoPageLayout>
  )
}
