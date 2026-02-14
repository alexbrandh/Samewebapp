import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sameperfumes.com';

export const metadata: Metadata = {
  title: 'Todos los Perfumes — Catálogo Completo',
  description: 'Explora todos los perfumes SAME. Fragancias de lujo accesible para hombre, mujer y unisex. Eau de Parfum y Elixir con envío a toda Colombia. Filtra por género, familia olfativa y más.',
  alternates: {
    canonical: `${SITE_URL}/collections/all`,
  },
  openGraph: {
    title: 'Todos los Perfumes | SAME.',
    description: 'Explora todos los perfumes SAME. Fragancias de lujo accesible para hombre, mujer y unisex con envío a toda Colombia.',
    url: `${SITE_URL}/collections/all`,
    type: 'website',
    locale: 'es_CO',
    siteName: 'SAME.',
  },
};

export default function CollectionsAllLayout({ children }: { children: React.ReactNode }) {
  return children;
}
