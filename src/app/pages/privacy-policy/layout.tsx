import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sameperfumes.com';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad de SAME. perfumes. Cómo protegemos tus datos personales y tu información de compra.',
  alternates: {
    canonical: `${SITE_URL}/pages/privacy-policy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
