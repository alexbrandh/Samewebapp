import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sameperfumes.com';

export const metadata: Metadata = {
  title: 'Sobre Nosotros — Nuestra Historia',
  description: 'Conoce SAME., la casa de fragancias colombiana que celebra la individualidad. Perfumes de lujo accesible con ingredientes premium, cruelty-free y envío a todo Colombia.',
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: 'Sobre Nosotros | SAME. Perfumes',
    description: 'Conoce SAME., la casa de fragancias colombiana que celebra la individualidad a través del aroma.',
    url: `${SITE_URL}/about`,
    type: 'website',
    locale: 'es_CO',
    siteName: 'SAME.',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
