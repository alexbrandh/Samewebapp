import { useMemo } from 'react';
import { useCart } from './useShopify';

/**
 * Hook reutilizable para calcular el progreso hacia el envío gratis
 * @param threshold - Monto mínimo para envío gratis (default: 100)
 */
export function useFreeShipping(threshold: number = 200) {
  const { cart } = useCart();

  const shippingProgress = useMemo(() => {
    const currentTotal = parseFloat(cart?.cost?.subtotalAmount?.amount || '0');
    const amountRemaining = Math.max(0, threshold - currentTotal);
    const progressPercentage = Math.min(100, (currentTotal / threshold) * 100);
    const qualifiesForFreeShipping = currentTotal >= threshold;

    return {
      currentTotal,
      amountRemaining,
      progressPercentage,
      qualifiesForFreeShipping,
      threshold,
    };
  }, [cart, threshold]);

  return shippingProgress;
}
