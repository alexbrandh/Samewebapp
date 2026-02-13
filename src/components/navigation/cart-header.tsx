'use client';

import { useEffect } from 'react';
import { Header } from '@/components/navigation/header';
import { useCart } from '@/lib/hooks/useShopify';

export default function CartHeader() {
  const { cartTotals, refreshCart } = useCart();
  const itemCount = Number(cartTotals.itemCount || 0);
  useEffect(() => {
    const handler = () => { try { refreshCart(); } catch {} };
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, [refreshCart]);
  return <Header cartItemsCount={itemCount} />;
}