'use client';

import { useState } from 'react';
import { X } from 'phosphor-react';
import { useBanner } from '@/contexts/banner-context';

export function PromoBanner() {
  const [isClosed, setIsClosed] = useState(false);
  const { setBannerVisible } = useBanner();

  const handleClose = () => {
    setIsClosed(true);
    setBannerVisible(false);
  };

  if (isClosed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary">
      <div className="relative flex items-center justify-center px-4 py-1.5">
        <p className="text-xs font-medium text-primary-foreground text-center">
          Envío gratis a partir de 6 productos — Hasta <strong>20% OFF</strong> comprando más
        </p>
        <button
          onClick={handleClose}
          className="absolute right-3 shrink-0 p-0.5 hover:bg-white/10 rounded-full transition-colors text-primary-foreground"
          aria-label="Cerrar banner"
        >
          <X size={12} weight="bold" />
        </button>
      </div>
    </div>
  );
}
