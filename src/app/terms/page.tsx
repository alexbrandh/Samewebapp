import type { Metadata } from 'next';
import { Footer } from "@/components/sections/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sameperfumes.com';

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: 'Términos y condiciones de SAME. perfumes. Políticas de compra, envío, devoluciones y uso del sitio web en Colombia.',
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
};

export default function TermsAndConditions() {
  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto px-6 pb-16 pt-32">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Términos y Condiciones</h1>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Sección 1 – Términos de la Tienda en Línea</h2>
              <p className="mb-4 text-muted-foreground">
                Bienvenido a SAME..
              </p>
              <p className="mb-4 text-muted-foreground">
                Operamos exclusivamente como tienda en línea a través de www.sameperfumes.com, ofreciendo una selección curada de perfumes y productos de belleza.
              </p>
              <p className="mb-4 text-muted-foreground">
                Aceptamos pagos en línea seguros usando tarjetas de crédito/débito Visa y MasterCard en COP.
              </p>
              <p className="mb-4 text-muted-foreground">
                Todos los pagos se procesan de forma segura a través de proveedores de pago certificados. En algunos casos, múltiples envíos pueden aparecer como transacciones separadas en el estado de cuenta de tu tarjeta.
              </p>
              <p className="mb-4 text-muted-foreground">
                Al acceder o comprar a través de nuestro sitio web, aceptas estos Términos y Condiciones ("Términos", "Términos de Servicio") y todas las políticas relacionadas. Si no estás de acuerdo, por favor absténte de usar el sitio.
              </p>
              <p className="text-sm text-muted-foreground">
                Nuestra tienda en línea está alojada en Shopify Inc., que proporciona la plataforma de comercio electrónico que nos permite vender nuestros productos y servicios.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Sección 2 – Condiciones Generales</h2>
              <p className="mb-4 text-muted-foreground">
                Nos reservamos el derecho de rechazar el servicio a cualquier persona en cualquier momento y por cualquier razón.
              </p>
              <p className="mb-4 text-muted-foreground">
                Entiendes que tus datos (excluyendo datos de tarjeta de crédito) pueden ser transferidos sin cifrar a través de redes. La información de pago siempre está cifrada durante la transmisión.
              </p>
              <p className="mb-4 text-muted-foreground">
                Aceptas no reproducir, copiar, vender o explotar ninguna parte de nuestro sitio web o servicios sin nuestro consentimiento expreso por escrito.
              </p>
              <p className="mb-4 text-muted-foreground">
                Al usar nuestro sitio, confirmas que eres mayor de edad en tu país de residencia o que has obtenido el consentimiento necesario de un padre o tutor.
              </p>
              <p className="mb-4 text-muted-foreground">
                Los menores de 18 años no están autorizados a registrarse, realizar transacciones o usar el sitio.
              </p>
              <p className="text-muted-foreground">
                Cualquier disputa o reclamo se manejará de acuerdo con las regulaciones colombianas.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Sección 3 – Precisión y Disponibilidad de la Información</h2>
              <p className="mb-4 text-muted-foreground">
                Aunque hacemos todo lo posible para asegurar que la información en www.sameperfumes.com sea precisa y actual, no garantizamos que las descripciones de productos, precios o disponibilidad estén libres de errores.
              </p>
              <p className="mb-4 text-muted-foreground">
                Todo el contenido de este sitio es con fines informativos generales y puede actualizarse en cualquier momento sin previo aviso.
              </p>
              <p className="text-muted-foreground">
                Es tu responsabilidad revisar los cambios y actualizaciones regularmente.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Sección 4 – Modificaciones al Servicio y Precios</h2>
              <p className="mb-4 text-muted-foreground">
                Los precios y la disponibilidad de productos están sujetos a cambios sin previo aviso.
              </p>
              <p className="mb-4 text-muted-foreground">
                Nos reservamos el derecho de modificar, suspender o discontinuar cualquier parte de nuestro sitio web o servicios en cualquier momento.
              </p>
              <p className="text-muted-foreground">
                No somos responsables de ninguna modificación, cambio de precio o discontinuación del servicio.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Sección 5 – Productos y Compras en Línea</h2>
              <p className="mb-4 text-muted-foreground">
                Todos los productos disponibles a través de nuestro sitio web se venden exclusivamente en línea.
              </p>
              <p className="mb-4 text-muted-foreground">
                Las cantidades pueden ser limitadas y la disponibilidad no está garantizada. Las devoluciones y cambios siguen nuestra Política de Devoluciones.
              </p>
              <p className="mb-4 text-muted-foreground">
                Nos esforzamos por mostrar imágenes y colores precisos de los productos; sin embargo, las diferencias en las pantallas de los dispositivos pueden resultar en variaciones.
              </p>
              <p className="mb-4 text-muted-foreground">
                Podemos limitar la venta de productos a ciertos usuarios, regiones o jurisdicciones a nuestra discreción.
              </p>
              <p className="text-muted-foreground">
                No garantizamos que la calidad de ningún producto, servicio o información cumpla con tus expectativas, ni que cualquier problema en el sitio sea corregido inmediatamente.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Sección 6 – Facturación e Información de la Cuenta</h2>
              <p className="mb-4 text-muted-foreground">
                Nos reservamos el derecho de rechazar, cancelar o limitar cualquier pedido.
              </p>
              <p className="mb-4 text-muted-foreground">
                Estas restricciones pueden aplicarse por cliente, por hogar o por método de pago. Si un pedido es modificado o cancelado, intentaremos contactarte a través del correo electrónico o número de teléfono proporcionado al finalizar la compra.
              </p>
              <p className="text-muted-foreground">
                Aceptas proporcionar información de facturación y contacto precisa, completa y actualizada para asegurar transacciones y comunicaciones exitosas.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Sección 7 – Herramientas y Enlaces de Terceros</h2>
              <p className="mb-4 text-muted-foreground">
                Nuestro sitio web puede incluir enlaces o acceso a herramientas o sitios web de terceros.
              </p>
              <p className="mb-4 text-muted-foreground">
                No monitoreamos ni controlamos a estos terceros y no asumimos responsabilidad por su contenido, rendimiento o políticas.
              </p>
              <p className="text-muted-foreground">
                Tu uso de herramientas de terceros es completamente a tu propia discreción, y debes revisar sus términos antes de usarlas.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Sección 8 – Comentarios y Retroalimentación de Usuarios</h2>
              <p className="mb-4 text-muted-foreground">
                Si envías sugerencias, reseñas, ideas u otra retroalimentación a SAME., aceptas que podemos usar, modificar o publicar dicho contenido en cualquier momento, sin obligación o compensación.
              </p>
              <p className="mb-4 text-muted-foreground">
                Eres responsable de asegurar que tus envíos no violen ningún derecho de propiedad intelectual o legal.
              </p>
              <p className="text-muted-foreground">
                Nos reservamos el derecho de eliminar cualquier contenido considerado ofensivo, difamatorio, ilegal o de otra manera inapropiado.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Sección 9 – Información Personal</h2>
              <p className="text-muted-foreground">
                El envío de tus datos personales a través de nuestro sitio web se rige por nuestra Política de Privacidad y Cookies, disponible en www.sameperfumes.com.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Sección 10 – Errores, Inexactitudes y Omisiones</h2>
              <p className="mb-4 text-muted-foreground">
                Ocasionalmente, la información en nuestro sitio web puede contener errores tipográficos o factuales relacionados con precios, promociones o descripciones de productos.
              </p>
              <p className="mb-4 text-muted-foreground">
                Nos reservamos el derecho de corregir estos errores o actualizar la información en cualquier momento, incluso después de que un pedido haya sido realizado.
              </p>
              <p className="text-muted-foreground">
                No tenemos la obligación de actualizar o revisar ninguna información a menos que la ley lo requiera.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Sección 11 – Usos Prohibidos</h2>
              <p className="mb-4 text-muted-foreground">Aceptas no usar nuestro sitio web o su contenido para ningún propósito ilegal o no autorizado, incluyendo pero no limitándose a:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Violar cualquier ley o regulación local, nacional o internacional.</li>
                <li>Infringir nuestros derechos de propiedad intelectual o los de otros.</li>
                <li>Cargar o transmitir código malicioso, malware o datos dañinos.</li>
                <li>Proporcionar información falsa o engañosa.</li>
                <li>Acosar, discriminar o difamar a cualquier persona o grupo.</li>
                <li>Participar en spam, phishing o cualquier actividad automatizada de recopilación de datos.</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                La violación de estos Términos puede resultar en la terminación inmediata de tu acceso a nuestros servicios.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Sección 12 – Exención de Garantías y Limitación de Responsabilidad</h2>
              <p className="mb-4 text-muted-foreground">
                No garantizamos que nuestro sitio web o servicios siempre sean seguros, ininterrumpidos o libres de errores.
              </p>
              <p className="mb-4 text-muted-foreground">
                Todos los productos y servicios se proporcionan "tal cual" y "según disponibilidad" sin garantías de ningún tipo, expresas o implícitas.
              </p>
              <p className="text-muted-foreground">
                SAME., sus empleados, afiliados y socios no serán responsables de ningún daño directo, indirecto, incidental o consecuente que surja de tu uso de nuestro sitio web o productos, excepto como lo requiera la ley.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Sección 13 – Indemnización</h2>
              <p className="text-muted-foreground">
                Aceptas indemnizar y mantener indemne a SAME., sus afiliados, directivos y empleados de cualquier reclamo, pérdida o daño resultante de tu violación de estos Términos o cualquier ley aplicable.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Sección 14 – Terminación</h2>
              <p className="mb-4 text-muted-foreground">
                Estos Términos de Servicio permanecen vigentes a menos que sean terminados por ti o por nosotros.
              </p>
              <p className="mb-4 text-muted-foreground">
                Puedes dejar de usar el sitio web en cualquier momento.
              </p>
              <p className="text-muted-foreground">
                Podemos suspender o terminar tu acceso si determinamos que has incumplido estos Términos o participado en actividades no autorizadas.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Sección 15 – Cambios en los Términos</h2>
              <p className="mb-4 text-muted-foreground">
                Puedes revisar la versión más actual de estos Términos y Condiciones en cualquier momento en esta página.
              </p>
              <p className="mb-4 text-muted-foreground">
                Nos reservamos el derecho de actualizar, cambiar o reemplazar cualquier parte de estos Términos publicando actualizaciones en nuestro sitio web.
              </p>
              <p className="text-muted-foreground">
                El uso continuado de www.sameperfumes.com después de dichas actualizaciones constituye la aceptación de los Términos revisados.
              </p>
            </section>

            <section className="mb-12 bg-muted p-6 rounded-lg text-foreground">
              <h2 className="text-xl font-semibold mb-4">Política de Reembolso y Cancelación</h2>
              <p className="mb-4 text-muted-foreground">
                En SAME., valoramos la satisfacción del cliente y tomamos todas las medidas para asegurar la calidad de nuestros productos.
              </p>
              <p className="mb-6 text-muted-foreground">
                Sin embargo, debido a la naturaleza de los perfumes y productos de fragancias de uso personal, no ofrecemos reembolsos, devoluciones ni cambios una vez que el pedido ha sido enviado, excepto en el caso raro de un artículo defectuoso o incorrecto.
              </p>

              <h3 className="text-lg font-medium mb-3 text-foreground">1. Política de Reembolso</h3>
              <p className="mb-4 text-muted-foreground">
                Todas las ventas realizadas a través de www.sameperfumes.com se consideran finales.
              </p>
              <p className="mb-4 text-muted-foreground">
                Por razones de higiene, seguridad e integridad del producto, no podemos aceptar devoluciones ni ofrecer reembolsos por perfumes, aceites concentrados o cualquier otro producto de fragancia una vez que haya salido de nuestra instalación.
              </p>
              <p className="mb-4 text-muted-foreground">Los reembolsos solo se considerarán si:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4 text-muted-foreground">
                <li>Has recibido un producto diferente al que ordenaste, o</li>
                <li>El producto está dañado o defectuoso al momento de su llegada.</li>
              </ul>
              <p className="mb-4 text-sm text-muted-foreground">
                En tales casos, contacta a nuestro equipo de soporte en contact@sameperfumes.com dentro de las 48 horas posteriores a recibir tu pedido, incluyendo fotos o videos que muestren el problema.
              </p>
              <p className="mb-4 text-sm text-muted-foreground">
                Cada reclamo será revisado individualmente, y si es aprobado, se procesará un reemplazo o reembolso.
              </p>
              <p className="text-sm text-muted-foreground">
                Los reembolsos (cuando apliquen) se realizarán utilizando el mismo método de pago usado para la transacción original y pueden tardar hasta 15 días hábiles en reflejarse, dependiendo de tu banco o proveedor de pago.
              </p>

              <h3 className="text-lg font-medium mb-3 mt-6 text-foreground">2. Cancelación de Pedido</h3>
              <p className="mb-4 text-muted-foreground">
                Si deseas cancelar tu pedido, contáctanos inmediatamente en contact@sameperfumes.com.
              </p>
              <p className="mb-4 text-muted-foreground">
                Las cancelaciones solo pueden procesarse antes de que el pedido haya sido empacado o despachado.
              </p>
              <p className="mb-4 text-muted-foreground">
                Una vez que el pedido ha sido enviado, no puede ser cancelado ni reembolsado.
              </p>
              <p className="text-sm text-muted-foreground">
                En caso de cancelación previa al despacho, el monto total del pedido será reembolsado a tu método de pago original.
              </p>

              <h3 className="text-lg font-medium mb-3 mt-6 text-foreground">3. Artículos Incorrectos o Defectuosos</h3>
              <p className="mb-4 text-muted-foreground">
                Todos los productos son cuidadosamente inspeccionados antes del despacho.
              </p>
              <p className="text-sm text-muted-foreground">
                Si, sin embargo, recibes un producto incorrecto o dañado, notifícanos en contact@sameperfumes.com dentro de las 48 horas posteriores a la entrega, incluyendo tu número de pedido y evidencia fotográfica. Nuestro equipo te guiará en los siguientes pasos para reemplazar el artículo o, si es necesario, emitir un reembolso.
              </p>

              <h3 className="text-lg font-medium mb-3 mt-6 text-foreground">4. Exclusiones</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                <li>Debido a regulaciones de salud y seguridad, no aceptamos devoluciones ni cambios de productos de perfumería abiertos o sin abrir.</li>
                <li>Los artículos en oferta o con descuento son estrictamente no reembolsables y no intercambiables.</li>
                <li>No contamos con bodega o tienda física, por lo tanto, no se aceptan devoluciones ni entregas en persona.</li>
                <li>El cambio de opinión o preferencia personal no es una razón válida para reembolso o reemplazo.</li>
              </ul>
            </section>

            <div className="text-center pt-8 border-t border-border">
              <h3 className="text-lg font-semibold mb-4 text-foreground">📩 Información de Contacto</h3>
              <p className="text-sm text-muted-foreground">
                Para preguntas o inquietudes sobre estos Términos y Condiciones, contáctanos en:
                <br />
                <a href="mailto:contact@sameperfumes.com" className="text-primary hover:underline">contact@sameperfumes.com</a>
                <br />
                <a href="https://www.sameperfumes.com" className="text-primary hover:underline">www.sameperfumes.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
