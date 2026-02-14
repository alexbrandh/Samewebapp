import type { Metadata } from 'next';
import { Footer } from '@/components/sections/footer';

export const metadata: Metadata = {
  title: 'Rastrea Tu Pedido — SAME.',
  description: 'Rastrea el estado de tu pedido SAME. con tu número de guía de Coordinadora.',
};

export default function TrackOrderPage() {
  return (
    <>
      <main className="min-h-screen pt-32 pb-20 px-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-4">Rastrea Tu Pedido</h1>
        <p className="text-muted-foreground mb-8">
          Una vez despachado tu pedido, recibirás un correo con tu número de guía. Usa el enlace a continuación para rastrear tu envío.
        </p>

        <div className="space-y-6">
          <div className="p-6 border border-border rounded-xl bg-muted/30">
            <h2 className="text-lg font-semibold mb-3">Coordinadora Mercantil</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Realizamos todos nuestros envíos a través de Coordinadora. Ingresa tu número de guía en su página oficial para conocer el estado de tu paquete.
            </p>
            <a
              href="https://www.coordinadora.com/portafolio-de-servicios/guia-de-envios/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
            >
              Rastrear en Coordinadora
            </a>
          </div>

          <div className="p-6 border border-border rounded-xl bg-muted/30">
            <h2 className="text-lg font-semibold mb-3">¿No encuentras tu guía?</h2>
            <p className="text-sm text-muted-foreground">
              Si aún no has recibido tu número de guía o tienes problemas para rastrear tu pedido, escríbenos a{' '}
              <a href="mailto:contact@sameperfumes.com" className="underline text-foreground">contact@sameperfumes.com</a>
              {' '}con tu número de pedido y te ayudaremos.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
