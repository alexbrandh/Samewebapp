'use client';

import { useFreeShipping } from '@/lib/hooks/useFreeShipping';
import { useCurrency } from '@/contexts/currency-context';

interface FreeShippingProgressProps {
  threshold?: number;
  className?: string;
}

/**
 * Componente reutilizable para mostrar el progreso hacia el envío gratis
 */
export function FreeShippingProgress({
  threshold = 100,
  className = ''
}: FreeShippingProgressProps) {
  const {
    amountRemaining,
    progressPercentage,
    qualifiesForFreeShipping
  } = useFreeShipping(threshold);
  const { formatPrice } = useCurrency();

  return (
    <div className={className}>
      {qualifiesForFreeShipping ? (
        <div className="flex items-center gap-2 text-primary">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm font-medium">¡Calificas para envío gratis!</p>
        </div>
      ) : (
        <>
          <p className="text-sm font-medium text-primary mb-2">
            ¡Agrega {formatPrice(amountRemaining.toString())} y recibe envío gratis!
          </p>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}
