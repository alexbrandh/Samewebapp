'use client';

import { useState, useEffect } from 'react';
import { HeroSlider } from '@/components/sections/hero-slider';
import { PressSection } from '@/components/sections/press-section';
import { ProductGrid } from '@/components/sections/product-grid';
import { BestSellersSection } from '@/components/sections/best-sellers-section';
import { BrandComparisonSection } from '@/components/sections/brand-comparison-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { NewsletterSection } from '@/components/sections/newsletter-section';
import { Footer } from '@/components/sections/footer';
import { InfoSection } from '@/components/sections/info-section';
import { VideosSection } from '@/components/sections/videos-section';
import { SignatureSection } from '@/components/sections/signature-section';
import { LoadingScreen } from '@/components/ui/loading-screen';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga inicial - puedes ajustar el tiempo según necesites
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <div className="min-h-screen">
        <main className="w-full">
          <HeroSlider />
          <PressSection />
          {/* Categorías (PressSection renders categories) */}

          <ProductGrid title="MEN" tag="men" />
          <ProductGrid title="WOMEN" tag="women" />
          <ProductGrid title="UNISEX" tag="unisex" />

          <BestSellersSection /> {/* Mas populares */}

          <InfoSection /> {/* Sección del extracto */}
          <VideosSection />
          <BrandComparisonSection />

          <TestimonialsSection />
          <NewsletterSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
