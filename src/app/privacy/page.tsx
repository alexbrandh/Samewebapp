import type { Metadata } from 'next';
import { Footer } from "@/components/sections/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sameperfumes.com';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad de SAME. perfumes. Cómo protegemos tus datos personales y tu información de compra en Colombia.',
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
};

export default function PrivacyPolicy() {
  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto px-6 pb-16 pt-32">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Política de Privacidad</h1>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-lg mb-6 text-foreground">
              <strong>SAME. – Política de Privacidad y Cookies</strong>
            </p>

            <p className="mb-6 text-muted-foreground">
              Esta Política de Privacidad y Cookies describe cómo SAME. ("nosotros", "nuestro") recopila, usa, comparte y protege la información personal a través del sitio web www.sameperfumes.com y sus canales de atención al cliente relacionados.
            </p>

            <p className="mb-6 text-muted-foreground">
              Valoramos tu privacidad y estamos comprometidos a proteger tus datos personales de acuerdo con las leyes de protección de datos aplicables de la República de Colombia.
            </p>

            <p className="mb-8 text-muted-foreground">
              Al acceder a nuestro sitio web o comunicarte con nosotros, aceptas los términos descritos en esta Política de Privacidad y Cookies y nuestros Términos y Condiciones del sitio web.
            </p>

            <p className="mb-12 text-sm text-muted-foreground">
              Ten en cuenta que esta política puede actualizarse periódicamente, y la versión más reciente siempre estará disponible en nuestro sitio web. Te recomendamos revisar esta página regularmente para mantenerte informado de cualquier actualización.
            </p>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Información que Recopilamos</h2>
              <p className="mb-4 text-muted-foreground">
                Nosotros y nuestros proveedores de servicios autorizados podemos recopilar información proporcionada directamente por ti a través de nuestro sitio web, por teléfono, correo electrónico o cualquier otro canal de comunicación. También podemos recibir información de terceros legalmente autorizados para compartirla con nosotros. La información recopilada puede incluir:
              </p>

              <h3 className="text-xl font-medium mb-3 mt-6 text-foreground">a. Información Personal y de Contacto:</h3>
              <p className="mb-4 text-muted-foreground">
                Nombre, direcciones de facturación y entrega, número de teléfono, correo electrónico, datos de pago, fecha de nacimiento, género, nacionalidad e información relacionada con destinatarios de regalos.
              </p>

              <h3 className="text-xl font-medium mb-3 mt-6 text-foreground">b. Datos del Sitio Web y Técnicos:</h3>
              <p className="mb-4 text-muted-foreground">
                Dirección IP, ubicación, tipo de navegador, detalles del dispositivo, la URL utilizada para acceder a nuestro sitio web, páginas visitadas, términos de búsqueda y elementos seleccionados.
              </p>

              <h3 className="text-xl font-medium mb-3 mt-6 text-foreground">c. Información Transaccional:</h3>
              <p className="mb-4 text-muted-foreground">
                Pedidos realizados, productos comprados, fechas y horas de transacciones, pedidos incompletos, preferencias y solicitudes personalizadas.
              </p>

              <h3 className="text-xl font-medium mb-3 mt-6 text-foreground">d. Información de Terceros:</h3>
              <p className="mb-4 text-muted-foreground">
                Datos proporcionados por procesadores de pago, socios de entrega, programas de fidelidad, encuestas o campañas promocionales.
              </p>

              <p className="text-sm text-muted-foreground">
                Ten en cuenta que los datos completos de la tarjeta de pago se utilizan únicamente para procesar tu transacción y no son almacenados ni accesibles para nuestro personal. Todos los pagos son manejados de forma segura por socios certificados y legalmente autorizados.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Cómo Usamos Tu Información</h2>
              <p className="mb-4 text-muted-foreground">Tus datos personales pueden ser utilizados para los siguientes propósitos:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4 text-muted-foreground">
                <li>Procesar y cumplir tus pedidos o entregar los servicios solicitados.</li>
                <li>Verificar y completar transacciones financieras, incluyendo prevención de fraude y verificaciones crediticias.</li>
                <li>Responder a consultas de clientes y brindar soporte.</li>
                <li>Gestionar tu cuenta y mejorar tu experiencia de compra.</li>
                <li>Con fines analíticos y estadísticos para mejorar el rendimiento del sitio web.</li>
                <li>Para comunicaciones de marketing, incluyendo boletines y promociones (a menos que elijas no recibirlos).</li>
                <li>Asegurar el cumplimiento de obligaciones legales y proteger nuestros derechos y los derechos de terceros.</li>
                <li>Mantener la integridad y seguridad del sitio web.</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Podemos ofrecer una función de Chat en Vivo para atención al cliente. Las transcripciones del chat pueden ser registradas y consultadas únicamente con fines de calidad del servicio.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Compartir Información</h2>
              <p className="mb-4 text-muted-foreground">Podemos compartir tus datos personales con:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4 text-muted-foreground">
                <li>Nuestras empresas afiliadas y socios comerciales de confianza.</li>
                <li>Proveedores de servicios terceros autorizados que manejan procesamiento de pagos, logística, TI, marketing o mantenimiento del sitio web.</li>
                <li>Asesores profesionales como abogados, auditores y aseguradoras.</li>
                <li>Autoridades gubernamentales, reguladoras o de aplicación de la ley cuando sea legalmente requerido.</li>
                <li>Sucesores o adquirientes en caso de fusión, adquisición o reestructuración.</li>
                <li>Destinatarios de regalos o proveedores de garantía relacionados con tu pedido.</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Todos los terceros que manejan tu información están contractualmente obligados a mantenerla confidencial y usarla únicamente para los fines acordados.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Preferencias de Marketing y Contacto</h2>
              <p className="mb-4 text-muted-foreground">
                Al registrarte en nuestro sitio web, puedes elegir si deseas recibir comunicaciones de marketing de nuestra parte o de nuestros socios seleccionados.
              </p>
              <p className="mb-4 text-muted-foreground">
                Puedes cancelar la suscripción en cualquier momento haciendo clic en el enlace "cancelar suscripción" en nuestros correos o contactándonos directamente.
              </p>
              <p className="text-muted-foreground">
                Para cualquier consulta relacionada con la privacidad o para actualizar tus preferencias de comunicación, contáctanos en:
                <br />
                📧 <a href="mailto:contact@sameperfumes.com" className="text-primary hover:underline">contact@sameperfumes.com</a>
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Seguridad de Datos</h2>
              <p className="mb-4 text-muted-foreground">
                Tu información personal se almacena en servidores seguros, y todas las transacciones de pago están cifradas utilizando tecnología Secure Socket Layer (SSL).
              </p>
              <p className="mb-4 text-muted-foreground">
                Eres responsable de mantener tus credenciales de cuenta (usuario y contraseña) confidenciales.
              </p>
              <p className="mb-4 text-muted-foreground">
                Hemos implementado medidas de seguridad robustas incluyendo cifrado, monitoreo y autenticación para proteger nuestros sistemas.
              </p>
              <p className="text-sm text-muted-foreground">
                Sin embargo, ten en cuenta que ninguna transmisión por internet es completamente segura, y el intercambio de datos se realiza bajo tu propio riesgo.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Transferencias Internacionales de Datos</h2>
              <p className="mb-4 text-muted-foreground">
                Tus datos personales pueden ser transferidos y almacenados fuera de Colombia.
              </p>
              <p className="mb-4 text-muted-foreground">
                Al usar nuestro sitio web, consientes dichas transferencias, reconociendo que las leyes de privacidad en otras jurisdicciones pueden diferir.
              </p>
              <p className="text-muted-foreground">
                Nos aseguramos de que cualquier tercero que maneje tus datos mantenga estricta confidencialidad y cumpla con estándares reconocidos de protección de datos.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Actualizaciones de la Política</h2>
              <p className="mb-4 text-muted-foreground">
                Podemos revisar esta Política de Privacidad y Cookies de vez en cuando para reflejar cambios regulatorios u operativos.
              </p>
              <p className="text-muted-foreground">
                Las actualizaciones entran en vigor una vez publicadas en www.sameperfumes.com, y tu uso continuado del sitio web significa tu aceptación de la política revisada.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Publicidad de Terceros</h2>
              <p className="mb-4 text-muted-foreground">
                Ciertos anuncios en nuestro sitio web pueden ser proporcionados por redes de terceros que usan cookies o tecnologías similares para personalizar anuncios basados en tus intereses.
              </p>
              <p className="mb-4 text-muted-foreground">
                No controlamos las prácticas de recopilación de datos de estos terceros, y sus prácticas de privacidad no están cubiertas por esta política.
              </p>
              <p className="text-muted-foreground">
                Recomendamos revisar sus declaraciones de privacidad para detalles adicionales.
              </p>
            </section>

            <section className="mb-12 bg-muted p-6 rounded-lg text-foreground">
              <h2 className="text-xl font-semibold mb-4">Notas Importantes</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Todos los datos de tarjetas de crédito/débito e información de identificación personal no serán almacenados, vendidos, compartidos, alquilados ni cedidos a ningún tercero.</li>
                <li>Se recomienda a los clientes revisar esta página periódicamente para conocer actualizaciones.</li>
                <li>Cualquier modificación a esta política será efectiva en la fecha de publicación en nuestro sitio web.</li>
              </ul>
            </section>

            <div className="text-center pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                📧 <a href="mailto:contact@sameperfumes.com" className="text-primary hover:underline">contact@sameperfumes.com</a>
                <br />
                📞 +971 58 562 1027
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
