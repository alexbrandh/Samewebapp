import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/sections/footer';

export const metadata: Metadata = {
  title: 'Políticas de Envío — SAME.',
  description: 'Conoce nuestras políticas de envío, tiempos de entrega y cobertura a nivel nacional en Colombia.',
};

export default function ShippingPolicyPage() {
  return (
    <>
      <main className="min-h-screen pt-32 pb-20 px-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-8">Políticas de Envío</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">Cobertura</h2>
            <p>Realizamos envíos a todo el territorio colombiano a través de nuestra alianza con Coordinadora Mercantil.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Tiempos de Entrega</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Ciudades principales:</strong> 2–4 días hábiles</li>
              <li><strong>Ciudades intermedias:</strong> 4–6 días hábiles</li>
              <li><strong>Zonas rurales:</strong> 6–10 días hábiles</li>
            </ul>
            <p>Los tiempos comienzan a contar desde la confirmación del pago.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Costos de Envío</h2>
            <p>El envío se calcula al momento del checkout según la ubicación de destino. Pedidos de 4 o más artículos califican para <strong>envío gratis</strong>.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Seguimiento</h2>
            <p>Una vez despachado tu pedido, recibirás un correo electrónico con el número de guía para rastrear tu envío directamente en la página de Coordinadora.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">¿Tienes preguntas?</h2>
            <p>
              Escríbenos a{' '}
              <a href="mailto:contact@sameperfumes.com" className="underline text-foreground">contact@sameperfumes.com</a>
              {' '}o por{' '}
              <Link href="/pages/contact" className="underline text-foreground">nuestra página de contacto</Link>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
