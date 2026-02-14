'use client';

import Image from "next/image";
import Link from "next/link";
import { useBanner } from "@/contexts/banner-context";

export function HeroSlider() {
  const { isBannerVisible } = useBanner();

  return (
    <section className={`relative w-full ${isBannerVisible ? '-mt-[84px]' : '-mt-[56px]'}`}>
      <div className="w-full">
        <div className="relative w-full overflow-hidden">
          <Link href="/collections/all" className="block w-full h-full relative group">
            {/* Imagen única responsive para móvil y desktop */}
            <div className="relative w-full">
              <Image
                src="/pictures/hero-banner.png"
                alt="SAME. — Fragancias de lujo inspiradas en íconos"
                width={1920}
                height={1080}
                className="w-full h-auto object-cover"
                priority
                sizes="100vw"
              />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}