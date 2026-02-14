import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sameperfumes.com';

export const metadata: Metadata = {
  title: 'Contáctanos',
  description: 'Ponte en contacto con SAME. perfumes. Escríbenos por email a contact@sameperfumes.com o por WhatsApp. Atención al cliente en español para toda Colombia.',
  alternates: {
    canonical: `${SITE_URL}/pages/contact`,
  },
  openGraph: {
    title: 'Contáctanos | SAME. Perfumes',
    description: 'Ponte en contacto con nuestro equipo. Atención al cliente en español.',
    url: `${SITE_URL}/pages/contact`,
    type: 'website',
    locale: 'es_CO',
    siteName: 'SAME.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
