import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sameperfumes.com';

export const metadata: Metadata = {
  title: 'Descúbrete — Quiz de Perfumes',
  description: 'Descubre tu perfume ideal con nuestro quiz personalizado. Responde preguntas sobre tu estilo y personalidad para encontrar la fragancia SAME. perfecta para ti.',
  alternates: {
    canonical: `${SITE_URL}/pages/quiz`,
  },
  openGraph: {
    title: 'Descúbrete — Quiz de Perfumes | SAME.',
    description: 'Descubre tu perfume ideal con nuestro quiz personalizado. Encuentra la fragancia perfecta para tu estilo.',
    url: `${SITE_URL}/pages/quiz`,
    type: 'website',
    locale: 'es_CO',
    siteName: 'SAME.',
  },
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
