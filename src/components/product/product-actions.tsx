'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/hooks/useShopify';
import { Loader2 } from 'lucide-react';

export default function ProductActions({ variantId, availableForSale }: { variantId: string; availableForSale: boolean }) {
  const { addToCart, loading } = useCart();
  const [qty, setQty] = useState(1);
  const [mode, setMode] = useState<'once' | 'auto'>('once');

  const increment = () => setQty((q) => Math.min(q + 1, 10));
  const decrement = () => setQty((q) => Math.max(q - 1, 1));

  const handleAdd = async () => {
    if (!variantId) return;
    try {
      await addToCart(variantId, qty);
    } catch (error) {
      // Fallback para IDs mock (no gid://) durante desarrollo
      if (!variantId.startsWith('gid://')) {
        await new Promise((res) => setTimeout(res, 600));
        try { window.dispatchEvent(new CustomEvent('cart-updated')); } catch {}
      } else {
        throw error;
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Purchase mode toggle */}
      <div className="flex items-center gap-3 text-sm">
        <button
          className={`px-3 py-1 rounded-sm border ${mode === 'once' ? 'border-foreground text-foreground' : 'border-border text-muted-foreground'}`}
          onClick={() => setMode('once')}
          aria-pressed={mode === 'once'}
        >
          Buy once
        </button>
        <button
          className={`px-3 py-1 rounded-sm border ${mode === 'auto' ? 'border-foreground text-foreground' : 'border-border text-muted-foreground'}`}
          onClick={() => setMode('auto')}
          aria-pressed={mode === 'auto'}
        >
          Auto-replenish (save 15%)
        </button>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={decrement} aria-label="Decrease quantity">-</Button>
        <span className="w-8 text-center">{qty}</span>
        <Button variant="outline" size="sm" onClick={increment} aria-label="Increase quantity">+</Button>
      </div>

      {/* Add to bag */}
      <Button
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3"
        disabled={!availableForSale || loading}
        onClick={handleAdd}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>Add To Bag</>
        )}
      </Button>

      {!availableForSale && (
        <p className="text-sm text-destructive">Currently unavailable</p>
      )}
    </div>
  );
}