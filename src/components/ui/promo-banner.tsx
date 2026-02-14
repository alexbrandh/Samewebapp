'use client';

import { useState } from 'react';
import { X } from 'phosphor-react';
import { useBanner } from '@/contexts/banner-context';

const messages = [
  'ENVÍOS GRATIS CON PEDIDOS SUPERIORES A $200.000 COP',
  'ENVÍOS A TODA COLOMBIA',
  'FRAGANCIAS DE LUJO A PRECIOS ACCESIBLES',
];

const separator = ' ✦ ';

export function PromoBanner() {
  const [isClosed, setIsClosed] = useState(false);
  const { setBannerVisible } = useBanner();

  const handleClose = () => {
    setIsClosed(true);
    setBannerVisible(false);
  };

  if (isClosed) return null;

  const marqueeContent = messages.join(separator) + separator;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-foreground overflow-hidden">
      <div className="relative flex items-center h-[28px]">
        {/* Marquee track */}
        <div className="flex whitespace-nowrap animate-[marquee_40s_linear_infinite]" style={{ '--gap': '0px' } as React.CSSProperties}>
          <span
            className="inline-block text-[10px] tracking-[0.18em] text-background px-0"
            style={{ fontFamily: "'MADE TOMMY', var(--font-serif)" }}
          >
            {marqueeContent}
          </span>
          <span
            className="inline-block text-[10px] tracking-[0.18em] text-background px-0"
            style={{ fontFamily: "'MADE TOMMY', var(--font-serif)" }}
            aria-hidden="true"
          >
            {marqueeContent}
          </span>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-2 z-10 shrink-0 p-1.5 bg-white/15 hover:bg-white/25 rounded-full transition-colors text-background"
          aria-label="Cerrar banner"
        >
          <X size={12} weight="bold" />
        </button>
      </div>
    </div>
  );
}
