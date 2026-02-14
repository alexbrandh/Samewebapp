'use client';

import { PageContainer } from '@/components/ui/page-container';

export default function TermsPage() {
  return (
    <PageContainer className="overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
          Términos y Condiciones
        </h1>

        <div className="prose prose-gray max-w-none space-y-8 text-foreground/90">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              1. Aceptación de Términos
            </h2>
            <p className="leading-relaxed">
              Al acceder y usar el sitio web y los servicios de SAME., aceptas y te comprometes a
              cumplir con los términos y disposiciones de este acuerdo. Si no estás de acuerdo con estos
              términos, por favor no uses nuestros servicios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              2. Licencia de Uso
            </h2>
            <p className="mb-4 leading-relaxed">
              Se concede permiso para acceder temporalmente a los materiales del sitio web de SAME.
              solo para visualización personal y no comercial. Esta es la concesión de una licencia,
              no una transferencia de título, y bajo esta licencia no puedes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modificar o copiar los materiales</li>
              <li>Usar los materiales con fines comerciales</li>
              <li>Intentar descompilar o realizar ingeniería inversa de cualquier software</li>
              <li>Eliminar cualquier notación de derechos de autor o propiedad</li>
              <li>Transferir los materiales a otra persona</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              3. Información del Producto
            </h2>
            <p className="leading-relaxed">
              Nos esforzamos por proporcionar descripciones e imágenes precisas de los productos. Sin embargo, no
              garantizamos que las descripciones u otro contenido sea preciso, completo, confiable,
              actual o libre de errores. Los colores y aromas pueden variar ligeramente de lo que aparece en
              tu pantalla.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              4. Precios y Pagos
            </h2>
            <p className="mb-4 leading-relaxed">
              Todos los precios están listados en COP y están sujetos a cambios sin previo aviso. Nos reservamos
              el derecho de:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modificar precios en cualquier momento</li>
              <li>Rechazar o cancelar pedidos si ocurren errores de precios</li>
              <li>Limitar cantidades compradas por persona u hogar</li>
            </ul>
            <p className="mt-4 leading-relaxed">
              El pago debe recibirse antes del cumplimiento del pedido. Aceptamos las principales tarjetas de crédito y
              otros métodos de pago mostrados al finalizar la compra.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              5. Envío y Entrega
            </h2>
            <p className="leading-relaxed">
              Nuestro objetivo es procesar y enviar pedidos dentro de 1-3 días hábiles. Los tiempos de entrega varían
              según tu ubicación y el método de envío elegido. No somos responsables de retrasos
              causados por transportistas o procesamiento aduanero.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              6. Devoluciones y Reembolsos
            </h2>
            <p className="mb-4 leading-relaxed">
              Por razones de higiene y seguridad, no se aceptan devoluciones una vez enviado el producto. Nuestra política incluye:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Contactar dentro de las 48 horas si el producto es defectuoso</li>
              <li>Los productos deben estar sin usar y en empaque original</li>
              <li>Reembolsos procesados dentro de 5-10 días hábiles si aplica</li>
              <li>Revisión caso por caso por nuestro equipo</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              7. Registro de Cuenta
            </h2>
            <p className="leading-relaxed">
              Al crear una cuenta, debes proporcionar información precisa y completa. Eres
              responsable de mantener la confidencialidad de tus credenciales de cuenta y de
              todas las actividades que ocurran bajo tu cuenta.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              8. Propiedad Intelectual
            </h2>
            <p className="leading-relaxed">
              Todo el contenido de este sitio web, incluyendo texto, gráficos, logotipos, imágenes y software,
              es propiedad de SAME. y está protegido por leyes internacionales de derechos de autor.
              El uso no autorizado de cualquier material puede violar derechos de autor, marcas registradas y otras leyes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              9. Limitación de Responsabilidad
            </h2>
            <p className="leading-relaxed">
              SAME. no será responsable de ningún daño directo, indirecto, incidental, consecuente o
              especial que surja de o en conexión con tu uso de nuestro sitio web o
              productos, incluso si hemos sido advertidos de la posibilidad de tales daños.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              10. Ley Aplicable
            </h2>
            <p className="leading-relaxed">
              Estos términos y condiciones se rigen e interpretan de acuerdo con las leyes
              de la República de Colombia, y te sometes irrevocablemente a la jurisdicción exclusiva de
              los tribunales de dicha ubicación.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              11. Cambios en los Términos
            </h2>
            <p className="leading-relaxed">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán efectivos
              inmediatamente al publicarse en el sitio web. Tu uso continuado del sitio web después de
              los cambios constituye la aceptación de los términos modificados.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              12. Información de Contacto
            </h2>
            <p className="leading-relaxed">
              Las preguntas sobre los Términos y Condiciones deben enviarse a:
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
