import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sameperfumes.com';

export const metadata: Metadata = {
  title: 'Arma tu Bundle — Combos de Perfumes',
  description: 'Arma tu combo de perfumes SAME. y ahorra. Elige 3 o más fragancias y obtén descuento. Perfumes de lujo accesible con envío a toda Colombia.',
  alternates: {
    canonical: `${SITE_URL}/pages/bundle`,
  },
  openGraph: {
    title: 'Arma tu Bundle | SAME. Perfumes',
    description: 'Arma tu combo de perfumes y ahorra. Elige 3 o más fragancias y obtén descuento.',
    url: `${SITE_URL}/pages/bundle`,
    type: 'website',
    locale: 'es_CO',
    siteName: 'SAME.',
  },
};

export default function BundleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
