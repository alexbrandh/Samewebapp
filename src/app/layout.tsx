import type { Metadata, Viewport } from "next";
import { Nunito_Sans, Outfit } from "next/font/google";
import "./globals.css";
import CartHeader from "@/components/navigation/cart-header";
import { MobileNavbar } from "@/components/navigation/mobile-navbar";
import { WelcomePopup } from "@/components/ui/welcome-popup";
import { CookiePanel } from "@/components/ui/cookie-banner";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { PromoBanner } from "@/components/ui/promo-banner";
import { CustomerProvider } from "@/contexts/customer-context";
import { BannerProvider } from "@/contexts/banner-context";
import { CurrencyProvider } from "@/contexts/currency-context";
import { MainContentWrapper } from "@/components/layout/main-content-wrapper";
import { OrganizationJsonLd, LocalBusinessJsonLd, WebsiteJsonLd } from "@/lib/seo";

const nunitoSans = Nunito_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-serif",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sameperfumes.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SAME. — Perfumes de Lujo Accesible en Colombia",
    template: "%s | SAME. Perfumes",
  },
  description: "Compra perfumes de lujo accesible en Colombia. Fragancias inspiradas en las marcas más icónicas del mundo con envío a todo el país. Eau de Parfum y Elixir desde $89.900 COP.",
  keywords: [
    "perfumes Colombia",
    "perfumes de lujo accesible",
    "fragancias premium Colombia",
    "SAME perfumes",
    "eau de parfum Colombia",
    "perfumes unisex",
    "comprar perfumes online Colombia",
    "perfumes inspirados",
    "perfumes baratos Colombia",
    "fragancias de larga duración",
    "tienda de perfumes online",
    "perfumes originales Colombia",
    "perfumes envío gratis Colombia",
    "perfumes para hombre Colombia",
    "perfumes para mujer Colombia",
  ],
  authors: [{ name: "SAME.", url: SITE_URL }],
  creator: "SAME.",
  publisher: "SAME.",
  manifest: "/manifest.json",
  alternates: {
    canonical: SITE_URL,
    languages: {
      'es-CO': SITE_URL,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SAME.",
  },
  openGraph: {
    title: "SAME. — Perfumes de Lujo Accesible en Colombia",
    description: "Compra perfumes de lujo accesible en Colombia. Fragancias inspiradas en las marcas más icónicas del mundo con envío a todo el país.",
    type: "website",
    siteName: "SAME.",
    locale: "es_CO",
    url: SITE_URL,
    images: [
      {
        url: "/2.png",
        width: 1200,
        height: 630,
        alt: "SAME. — Perfumes de Lujo Accesible",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SAME. — Perfumes de Lujo Accesible en Colombia",
    description: "Compra perfumes de lujo accesible en Colombia. Fragancias inspiradas con envío a todo el país.",
    images: ["/2.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  other: {
    'geo.region': 'CO',
    'geo.country': 'CO',
    'geo.placename': 'Colombia',
    'content-language': 'es-CO',
    'distribution': 'Colombia',
    'rating': 'general',
    'revisit-after': '3 days',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#222222",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CO">
      <head>
        <meta name="apple-mobile-web-app-title" content="SAME." />
        <link rel="alternate" hrefLang="es-CO" href={SITE_URL} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
        <OrganizationJsonLd />
        <LocalBusinessJsonLd />
        <WebsiteJsonLd />
      </head>
      <body
        className={`${nunitoSans.variable} ${outfit.variable} antialiased pb-32 lg:pb-0`}
        suppressHydrationWarning
      >
        <BannerProvider>
          <CustomerProvider>
            <CurrencyProvider>
              <PromoBanner />
              <CartHeader />
              <MainContentWrapper>
                {children}
              </MainContentWrapper>
              <MobileNavbar />
              <WelcomePopup />
              <CookiePanel />
              <WhatsAppButton />
            </CurrencyProvider>
          </CustomerProvider>
        </BannerProvider>
      </body>
    </html>
  );
}
