'use client';

import Link from "next/link";

export function HeroSlider() {
  return (
    <section className="relative w-full bg-background transition-all duration-300">
      <div className="w-full">
        <div className="relative w-full overflow-hidden h-auto md:aspect-video">
          <Link href="/collections/all" className="block w-full h-full relative group">
            {/* Imagen vertical para móvil - Auto height to show full image */}
            <div className="md:hidden block w-full relative">
              <img
                src="/pictures/Movil.png"
                alt="Discover Your Signature Scent"
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Imagen horizontal para desktop - Aspect ratio 16:9 sin recorte */}
            <div className="hidden md:block absolute inset-0">
              <img
                src="/pictures/Computadora.png"
                alt="Discover Your Signature Scent"
                className="object-cover h-full w-full"
              />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}