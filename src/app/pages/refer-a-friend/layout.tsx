import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sameperfumes.com';

export const metadata: Metadata = {
  title: 'Refiere a un Amigo — Gana Descuentos',
  description: 'Refiere a un amigo a SAME. y gana descuentos exclusivos en tu próxima compra de perfumes. Programa de referidos para toda Colombia.',
  alternates: {
    canonical: `${SITE_URL}/pages/refer-a-friend`,
  },
  openGraph: {
    title: 'Refiere a un Amigo | SAME. Perfumes',
    description: 'Refiere a un amigo y gana descuentos exclusivos en perfumes.',
    url: `${SITE_URL}/pages/refer-a-friend`,
    type: 'website',
    locale: 'es_CO',
    siteName: 'SAME.',
  },
};

export default function ReferLayout({ children }: { children: React.ReactNode }) {
  return children;
}
