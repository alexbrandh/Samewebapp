'use client';

import { PageContainer } from '@/components/ui/page-container';

export default function AboutUs() {
  return (
    <PageContainer className="overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">Sobre Nosotros</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl mb-8 text-muted-foreground">
            SAME. es una casa de fragancias que celebra la individualidad a través del aroma.
          </p>

          <p className="mb-12 text-lg">
            Somos una marca moderna de perfumes construida sobre la idea de que el lujo debe sentirse, no cobrarse — donde la sofisticación se encuentra con la accesibilidad, y cada fragancia cuenta una historia.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Nuestra Esencia</h2>
            <p className="mb-4">
              La fragancia es emoción en su forma más pura. Conecta la memoria, el estado de ánimo y la identidad.
            </p>
            <p className="mb-4">
              En SAME., creamos perfumes que van más allá de las tendencias — cada mezcla está diseñada para capturar un sentimiento, un lugar, un momento en el tiempo.
            </p>
            <p className="mb-4">
              Nuestra inspiración viene del arte de la perfumería global, pero nuestro enfoque se basa en la simplicidad, la transparencia y la honestidad.
            </p>
            <p>
              Creemos que todos merecen experimentar la confianza de usar un aroma excepcional — sin compromisos.
            </p>
          </section>

          <section className="mb-12 bg-muted/30 p-8 rounded-lg border border-border">
            <h2 className="text-2xl font-semibold mb-6">Lo Que Nos Define</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2">Lujo Accesible</h3>
                <p className="text-muted-foreground">
                  Llevamos la esencia de las fragancias más admiradas del mundo a un público más amplio, haciendo que los perfumes de alta calidad sean alcanzables.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Artesanía e Integridad</h3>
                <p className="text-muted-foreground">
                  Cada fragancia se desarrolla con precisión y cuidado, asegurando equilibrio, duración y armonía en cada nota.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Belleza Moderna</h3>
                <p className="text-muted-foreground">
                  Nuestro diseño minimalista y estética reflejan la sofisticación del consumidor actual — limpio, seguro y refinado.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Sostenibilidad y Creación Consciente</h3>
                <p className="text-muted-foreground">
                  Estamos comprometidos con prácticas de producción éticas y procesos libres de crueldad en todas nuestras colecciones.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Nuestra Visión</h2>
            <p className="mb-4">
              Redefinir cómo las personas experimentan el perfume — pasando de la exclusividad a la emoción.
            </p>
            <p className="mb-4">
              SAME. es más que una marca; es una declaración de confianza, estilo y autoexpresión.
            </p>
            <p>
              Imaginamos un mundo donde la fragancia se convierte en parte de la identidad cotidiana, no solo un accesorio.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Nuestra Experiencia</h2>
            <p className="mb-4">
              Todos nuestros perfumes son creados por profesionales con años de experiencia en la industria de las fragancias, mezclando esencias y aceites premium de origen global.
            </p>
            <p>
              Cada aroma se prueba en equilibrio y duración antes de llegar a tus manos, asegurando que cada botella represente el estándar de calidad que define a SAME.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">La Experiencia SAME.</h2>
            <p className="mb-4">
              Operamos exclusivamente en línea, haciendo que sea sencillo para ti descubrir, seleccionar y disfrutar tu próxima fragancia insignia desde cualquier lugar.
            </p>
            <p>
              Cada pedido se prepara cuidadosamente, se sella y se envía con la precisión y el detalle de una experiencia de lujo — porque creemos que la elegancia debe comenzar en el momento en que abres tu perfume.
            </p>
          </section>

          <section className="mb-12 bg-primary/5 p-6 rounded-lg border border-primary/20">
            <h3 className="text-lg font-semibold mb-3">Nota Importante</h3>
            <p className="mb-2">
              Por razones de salud y seguridad, no se aceptan devoluciones ni cambios una vez que el producto ha sido enviado.
            </p>
            <p className="text-sm text-muted-foreground">
              Cada perfume se prepara fresco, se sella y se maneja bajo estricto control de calidad para garantizar higiene y autenticidad.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Nuestra Promesa</h2>
            <p className="mb-4 text-lg">
              En SAME., no vendemos perfumes — creamos experiencias.
            </p>
            <p className="mb-4">
              Cada aroma es una invitación a sentir algo real, personal e inolvidable.
            </p>
            <p className="text-lg font-medium">
              Porque el lujo no se trata de cuánto gastas — se trata de cuán profundamente te hace sentir.
            </p>
          </section>

          <section className="mb-12 bg-gray-900 text-white p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Inspirados por la Esencia</h2>
            <p className="mb-4">
              En SAME., cada fragancia comienza con inspiración — una historia contada a través del aroma.
            </p>
            <p className="mb-4">
              Nuestros perfumes son creados para capturar emociones, recuerdos y estados de ánimo, transformándolos en notas que hablan sin palabras.
            </p>
            <p className="mb-4">
              Explora nuestra colección y descubre los aromas que reflejan tu energía, tu ritmo, tu identidad.
            </p>
            <p>
              Elige la esencia que te inspira, selecciona tu botella y hazla tuya.
            </p>
            <p className="mt-6 text-primary/80 font-medium">
              Porque en SAME., el perfume no es solo una fragancia — es el reflejo de quién eres y la inspiración que dejas atrás.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Lujo al Alcance</h2>
            <p className="mb-4">
              En SAME., creemos que el verdadero lujo no tiene que venir con un precio alto.
            </p>
            <p className="mb-4">
              Un gran perfume debe inspirar confianza y emoción — no tensar tu presupuesto.
            </p>
            <p className="mb-4">
              Nuestras creaciones están elaboradas con ingredientes premium inspirados en las fragancias más icónicas del mundo, ofreciendo la misma sofisticación y duración a un precio más accesible.
            </p>
            <p className="mb-4">
              Simplemente elige tu aroma favorito y selecciona tu tamaño preferido — 50 ml o 100 ml — y experimenta calidad atemporal sin compromisos.
            </p>
            <p className="font-medium">
              Porque en SAME., la elegancia no se trata del costo — se trata de cómo te hace sentir.
            </p>
          </section>

          <section className="mb-12 border-t pt-8">
            <h2 className="text-2xl font-semibold mb-6">Preguntas Frecuentes</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2">¿Puedo comprar sus productos con pago contra entrega?</h3>
                <p className="text-foreground mb-2">
                  En SAME., todos los pagos se procesan de forma segura a través de Stripe.
                </p>
                <p className="text-foreground mb-2">
                  Aceptamos Visa, MasterCard y otras tarjetas débito y crédito principales.
                </p>
                <p className="text-muted-foreground">
                  Ten en cuenta que el pago contra entrega no está disponible. Todos los pedidos deben completarse usando una de nuestras opciones de pago en línea seguras al finalizar la compra.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">¿Sus perfumes son auténticos?</h3>
                <p className="text-foreground mb-2">
                  Sí — cada fragancia SAME. es 100% auténtica y elaborada exclusivamente por nosotros.
                </p>
                <p className="text-foreground mb-2">
                  Nuestros perfumes se desarrollan usando ingredientes premium de proveedores internacionales de confianza, y cada fórmula se crea bajo estrictos estándares de calidad y seguridad.
                </p>
                <p className="text-muted-foreground">
                  Aunque nuestros aromas están inspirados en las fragancias más icónicas del mundo, cada creación SAME. es original en composición y producción — asegurando calidad genuina, duración y sofisticación en cada botella.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">¿Cuál es su política de reembolso?</h3>
                <p className="text-foreground mb-2">
                  Por razones de higiene y seguridad, no se aceptan devoluciones ni reembolsos una vez que el pedido ha sido enviado.
                </p>
                <p className="text-muted-foreground">
                  Si recibes un producto defectuoso o incorrecto, contacta a nuestro equipo en contact@sameperfumes.com dentro de las 48 horas posteriores a la entrega. Nuestro equipo de atención al cliente revisará tu caso y te guiará en el proceso de reemplazo o reembolso si aplica.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">¿Recibo un correo de confirmación después del pago?</h3>
                <p className="text-foreground mb-2">
                  Sí. Una vez que tu pago se procesa exitosamente, recibirás un correo de confirmación de pedido de SAME. dentro de las 24 horas posteriores a la compra.
                </p>
                <p className="text-muted-foreground">
                  También recibirás una confirmación de envío con detalles de seguimiento tan pronto como tu pedido sea despachado.
                </p>
              </div>
            </div>
          </section>

          <div className="text-center pt-8 border-t">
            <p className="text-xl font-semibold mb-4">📍 SAME.</p>
            <p className="text-muted-foreground mb-2">
              🌐 <a href="https://www.sameperfumes.com" className="text-primary hover:underline">www.sameperfumes.com</a>
            </p>
            <p className="text-muted-foreground">
              📩 <a href="mailto:contact@sameperfumes.com" className="text-primary hover:underline">contact@sameperfumes.com</a>
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
