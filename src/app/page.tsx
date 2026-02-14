import { HeroSlider } from '@/components/sections/hero-slider';
import { TrustBadges } from '@/components/sections/trust-badges';
import { PressSection } from '@/components/sections/press-section';
import { ProductGrid } from '@/components/sections/product-grid';
import { InfoSection } from '@/components/sections/info-section';
import { Testimonials3DSection } from '@/components/sections/testimonials-3d-section';
import { SignatureSection } from '@/components/sections/signature-section';
import { NewsletterSection } from '@/components/sections/newsletter-section';
import { Footer } from '@/components/sections/footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="w-full">
        <HeroSlider />
        <TrustBadges />
        <PressSection />

        <ProductGrid title="UNISEX" tag="unisex" />

        <InfoSection />

        <Testimonials3DSection />

        <SignatureSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
