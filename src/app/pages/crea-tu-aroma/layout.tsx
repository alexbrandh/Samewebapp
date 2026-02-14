import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sameperfumes.com';

export const metadata: Metadata = {
  title: 'Crea tu Aroma — Personaliza tu Perfume',
  description: 'Crea tu perfume personalizado con SAME. Elige tus notas favoritas y diseña una fragancia única. Experiencia de lujo accesible en Colombia.',
  alternates: {
    canonical: `${SITE_URL}/pages/crea-tu-aroma`,
  },
  openGraph: {
    title: 'Crea tu Aroma | SAME. Perfumes',
    description: 'Diseña tu fragancia personalizada eligiendo tus notas favoritas.',
    url: `${SITE_URL}/pages/crea-tu-aroma`,
    type: 'website',
    locale: 'es_CO',
    siteName: 'SAME.',
  },
};

export default function CreaTuAromaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
