'use client';

import { PageContainer } from '@/components/ui/page-container';

export default function PrivacyPolicyPage() {
  return (
    <PageContainer className="overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
          Política de Privacidad
        </h1>

        <div className="prose prose-gray max-w-none space-y-8 text-foreground/90">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              1. Información que Recopilamos
            </h2>
            <p className="mb-4 leading-relaxed">
              Recopilamos información que nos proporcionas directamente, incluyendo cuando:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Creas una cuenta o realizas una compra</li>
              <li>Te suscribes a nuestro boletín</li>
              <li>Contactas a nuestro equipo de atención al cliente</li>
              <li>Participas en encuestas o promociones</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              2. Cómo Usamos Tu Información
            </h2>
            <p className="mb-4 leading-relaxed">
              Usamos la información que recopilamos para:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Procesar y cumplir tus pedidos</li>
              <li>Enviarte actualizaciones importantes sobre tus compras</li>
              <li>Responder a tus comentarios y preguntas</li>
              <li>Enviarte comunicaciones de marketing (con tu consentimiento)</li>
              <li>Mejorar nuestro sitio web y servicios</li>
              <li>Detectar y prevenir fraudes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              3. Cookies y Tecnologías de Seguimiento
            </h2>
            <p className="mb-4 leading-relaxed">
              Usamos cookies y tecnologías de seguimiento similares para mejorar tu experiencia de navegación.
              Estas tecnologías nos ayudan a:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Recordar tus preferencias y configuraciones</li>
              <li>Entender cómo usas nuestro sitio web</li>
              <li>Mejorar nuestros servicios y experiencia de usuario</li>
              <li>Proporcionar contenido y anuncios personalizados</li>
            </ul>
            <p className="mt-4 leading-relaxed">
              Puedes gestionar tus preferencias de cookies en cualquier momento a través de la configuración de tu navegador o
              nuestro banner de consentimiento de cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              4. Compartir y Divulgar Datos
            </h2>
            <p className="mb-4 leading-relaxed">
              No vendemos tu información personal. Podemos compartir tu información con:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Proveedores de servicios que nos asisten en operar nuestro negocio</li>
              <li>Procesadores de pago para completar transacciones</li>
              <li>Empresas de envío para entregar tus pedidos</li>
              <li>Autoridades legales cuando lo requiera la ley</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              5. Seguridad de Datos
            </h2>
            <p className="leading-relaxed">
              Implementamos medidas técnicas y organizativas apropiadas para proteger tu
              información personal contra acceso no autorizado, alteración, divulgación o
              destrucción. Sin embargo, ningún método de transmisión por internet es 100% seguro.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              6. Tus Derechos
            </h2>
            <p className="mb-4 leading-relaxed">
              Tienes derecho a:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Acceder a tu información personal</li>
              <li>Corregir datos inexactos</li>
              <li>Solicitar la eliminación de tus datos</li>
              <li>Oponerte al procesamiento de tus datos</li>
              <li>Retirar tu consentimiento en cualquier momento</li>
              <li>Cancelar la suscripción a comunicaciones de marketing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              7. Privacidad de Menores
            </h2>
            <p className="leading-relaxed">
              Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos
              deliberadamente información personal de menores.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              8. Cambios a Esta Política
            </h2>
            <p className="leading-relaxed">
              Podemos actualizar esta política de privacidad de vez en cuando. Te notificaremos de cualquier
              cambio publicando la nueva política en esta página y actualizando la fecha de &quot;Última Actualización&quot;.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              9. Contáctanos
            </h2>
            <p className="leading-relaxed">
              Si tienes alguna pregunta sobre esta política de privacidad o nuestras prácticas de datos,
              contáctanos en:
            </p>
            <p className="mt-4 leading-relaxed">
              Email: contact@sameperfumes.com<br />
              Dirección: Colombia
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Última Actualización: {new Date().toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
