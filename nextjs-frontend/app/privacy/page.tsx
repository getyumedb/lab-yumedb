import { InfoPageLayout } from "@/components/info-page-layout"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Politica de Privacidad - YumeDb",
  description: "Politica de privacidad y tratamiento de datos personales de YumeDb.",
}

export default function PrivacyPage() {
  return (
    <InfoPageLayout title="Politica de Privacidad" lastUpdated="22 de febrero de 2026">
      <h2>1. Informacion que recopilamos</h2>
      <p>Recopilamos la siguiente informacion cuando utilizas YumeDb:</p>
      <ul>
        <li><strong>Datos de cuenta:</strong> Nombre de usuario, direccion de correo electronico y contrasena (cifrada).</li>
        <li><strong>Datos de uso:</strong> Listas de anime, valoraciones, comentarios y preferencias de la plataforma.</li>
        <li><strong>Datos tecnicos:</strong> Direccion IP, tipo de navegador, sistema operativo y paginas visitadas.</li>
        <li><strong>Cookies:</strong> Utilizamos cookies para mantener tu sesion y mejorar la experiencia. Consulta nuestra <a href="/cookies">Politica de Cookies</a> para mas detalle.</li>
      </ul>

      <h2>2. Como utilizamos tu informacion</h2>
      <p>Utilizamos tus datos para:</p>
      <ul>
        <li>Proporcionar y mantener el servicio de YumeDb</li>
        <li>Personalizar tu experiencia y recomendaciones</li>
        <li>Comunicarnos contigo sobre tu cuenta o el servicio</li>
        <li>Mejorar la plataforma mediante analisis agregados de uso</li>
        <li>Garantizar la seguridad de la plataforma y prevenir abusos</li>
      </ul>

      <h2>3. Comparticion de datos</h2>
      <p>
        No vendemos tus datos personales a terceros. Podemos compartir informacion en los
        siguientes casos:
      </p>
      <ul>
        <li>Con proveedores de servicios que nos ayudan a operar la plataforma</li>
        <li>Cuando sea requerido por ley o autoridades competentes</li>
        <li>Para proteger los derechos y seguridad de YumeDb y sus usuarios</li>
      </ul>

      <h2>4. Seguridad de los datos</h2>
      <p>
        Implementamos medidas de seguridad tecnicas y organizativas para proteger tu informacion,
        incluyendo cifrado de contrasenas, comunicaciones HTTPS y acceso restringido a datos
        personales.
      </p>

      <h2>5. Tus derechos</h2>
      <p>Tienes derecho a:</p>
      <ul>
        <li>Acceder a tus datos personales almacenados</li>
        <li>Rectificar informacion incorrecta o desactualizada</li>
        <li>Solicitar la eliminacion de tu cuenta y datos asociados</li>
        <li>Exportar tus datos en un formato portable</li>
        <li>Retirar tu consentimiento en cualquier momento</li>
      </ul>

      <h2>6. Retencion de datos</h2>
      <p>
        Conservamos tus datos mientras mantengas una cuenta activa. Si solicitas la eliminacion
        de tu cuenta, eliminaremos tus datos personales en un plazo de 30 dias, salvo aquellos
        que estemos obligados a conservar por motivos legales.
      </p>

      <h2>7. Contacto</h2>
      <p>
        Para cualquier consulta relacionada con tu privacidad, escribenos a{" "}
        <a href="mailto:privacy@yumedb.com">privacy@yumedb.com</a>.
      </p>
    </InfoPageLayout>
  )
}
