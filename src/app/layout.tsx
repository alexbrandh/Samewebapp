import type { Metadata, Viewport } from "next";
import { Nunito_Sans, Outfit } from "next/font/google";
import "./globals.css";
import CartHeader from "@/components/navigation/cart-header";
import { MobileNavbar } from "@/components/navigation/mobile-navbar";
import { WelcomePopup } from "@/components/ui/welcome-popup";
import { CookiePanel } from "@/components/ui/cookie-banner";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { FloatingCurrencyButton } from "@/components/ui/floating-currency-button";
import { PromoBanner } from "@/components/ui/promo-banner";
import { CustomerProvider } from "@/contexts/customer-context";
import { BannerProvider } from "@/contexts/banner-context";
import { CurrencyProvider } from "@/contexts/currency-context";
import { MainContentWrapper } from "@/components/layout/main-content-wrapper";

const nunitoSans = Nunito_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SAME. — Luxury Fragrances",
  description: "Luxury fragrances that feel high-end without the exclusive price. Same doesn't shout who you are. It accompanies you while you show it.",
  keywords: ["perfumes", "luxury", "fragrances", "SAME", "eau de parfum", "unisex"],
  authors: [{ name: "SAME." }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SAME.",
  },
  openGraph: {
    title: "SAME. — Luxury Fragrances",
    description: "Luxury fragrances that feel high-end without the exclusive price",
    type: "website",
    siteName: "SAME.",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "SAME. — Luxury Fragrances",
    description: "Luxury fragrances that feel high-end without the exclusive price",
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
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="SAME." />
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
