import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/sections/footer';

export const metadata: Metadata = {
  title: 'Políticas de Reembolso — SAME.',
  description: 'Conoce nuestras políticas de devolución y reembolso para tus compras en SAME.',
};

export default function RefundPolicyPage() {
  return (
    <>
      <main className="min-h-screen pt-32 pb-20 px-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-8">Políticas de Reembolso</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">Garantía de Satisfacción</h2>
            <p>En SAME. queremos que estés completamente satisfecho con tu compra. Si por algún motivo no estás conforme, puedes solicitar un cambio o reembolso dentro de los primeros <strong>15 días calendario</strong> posteriores a la entrega.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Condiciones para Devoluciones</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>El producto debe estar sin usar y en su empaque original.</li>
              <li>Debe incluir todos los accesorios y materiales con los que fue recibido.</li>
              <li>No se aceptan devoluciones de productos que hayan sido abiertos o usados, salvo por defectos de fábrica.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Proceso de Devolución</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Escríbenos a <a href="mailto:contact@sameperfumes.com" className="underline text-foreground">contact@sameperfumes.com</a> con tu número de pedido y motivo de devolución.</li>
              <li>Te enviaremos las instrucciones para el envío de devolución.</li>
              <li>Una vez recibido y verificado el producto, procesaremos el reembolso en un plazo de 5–10 días hábiles al mismo método de pago original.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Cambios</h2>
            <p>Si deseas cambiar tu producto por otra fragancia o tamaño, contáctanos y te guiaremos en el proceso. Los cambios están sujetos a disponibilidad de inventario.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Productos Defectuosos</h2>
            <p>Si recibiste un producto dañado o defectuoso, contáctanos inmediatamente con fotos del producto y el empaque. Cubriremos el envío de devolución y te enviaremos un reemplazo sin costo adicional.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">¿Necesitas ayuda?</h2>
            <p>
              Visita nuestra{' '}
              <Link href="/pages/contact" className="underline text-foreground">página de contacto</Link>
              {' '}o escríbenos directamente a{' '}
              <a href="mailto:contact@sameperfumes.com" className="underline text-foreground">contact@sameperfumes.com</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
