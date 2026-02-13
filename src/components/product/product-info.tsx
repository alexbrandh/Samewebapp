'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/lib/hooks/useShopify';
import { useCurrency } from '@/contexts/currency-context';
import { Loader2, Check } from 'lucide-react';

interface ProductInfoProps {
  title: string;
  description: string;
  price: string;
  currencyCode: string;
  variantId: string;
  availableForSale: boolean;
  isNew?: boolean;
}

export default function ProductInfo({
  title,
  description,
  price,
  currencyCode,
  variantId,
  availableForSale,
  isNew,
}: ProductInfoProps) {
  const { addToCart, loading } = useCart();
  const { formatPrice } = useCurrency();
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    if (!variantId || !availableForSale) return;

    try {
      await addToCart(variantId, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="lg:sticky lg:top-20">
      {/* Title & Price */}
      <div className="mb-6">
        {isNew && (
          <span className="inline-block px-2 py-1 text-xs font-semibold bg-foreground text-background rounded mb-3">
            NEW
          </span>
        )}
        <h1 className="text-4xl lg:text-5xl font-semibold text-foreground mb-4">
          {title}
        </h1>
        <p className="text-2xl font-semibold text-foreground">
          {formatPrice(price)}
        </p>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-base text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      {/* Add to Bag Button */}
      <div className="mb-6">
        <Button
          onClick={handleAddToCart}
          disabled={!availableForSale || loading}
          className="w-full h-14 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : added ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Added to Bag!
            </>
          ) : (
            'Add to Bag'
          )}
        </Button>
      </div>

      {/* Free Shipping Message */}
      <div className="mb-8 p-4 bg-muted rounded-lg border border-border">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold">Exciting!</span> Add $60.00 and receive free shipping!
        </p>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="ingredients" className="w-full mb-8">
        <TabsList className="w-full grid grid-cols-3 h-auto p-1 bg-muted">
          <TabsTrigger value="ingredients" className="text-sm py-2.5">
            Ingredients
          </TabsTrigger>
          <TabsTrigger value="directions" className="text-sm py-2.5">
            Directions
          </TabsTrigger>
          <TabsTrigger value="shipping" className="text-sm py-2.5">
            Shipping
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ingredients" className="mt-4 space-y-4">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Key Ingredients</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <strong>Premium Fragrance Oils</strong> - Carefully selected for long-lasting scent
              </li>
              <li>
                <strong>Natural Extracts</strong> - Derived from botanical sources
              </li>
              <li>
                <strong>Skin-Safe Formula</strong> - Dermatologically tested
              </li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="directions" className="mt-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Apply to pulse points (wrists, neck, behind ears) for optimal scent diffusion.
            For best results, apply to clean, moisturized skin. Avoid rubbing wrists together
            as this can break down the fragrance molecules.
          </p>
        </TabsContent>

        <TabsContent value="shipping" className="mt-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              We currently ship within the United States. Please allow 1 day for processing.
            </p>
            <p>
              <strong>Shipping Options:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Standard (4-7 business days)</li>
              <li>Expedited (3 business days)</li>
            </ul>
            <p className="font-semibold">
              Orders over $60 qualify for free standard shipping!
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-6 bg-card border border-border rounded-lg">
          <h3 className="font-semibold text-card-foreground mb-2">Long-Lasting Scent</h3>
          <p className="text-sm text-muted-foreground">
            Premium formulation ensures your fragrance lasts all day
          </p>
        </div>
        <div className="p-6 bg-card border border-border rounded-lg">
          <h3 className="font-semibold text-card-foreground mb-2">Clean Ingredients</h3>
          <p className="text-sm text-muted-foreground">
            Made with skin-safe, high-quality ingredients
          </p>
        </div>
      </div>

      {/* Back to Shop Link */}
      <div className="text-center">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground underline"
        >
          ← Back to Shop
        </Link>
      </div>
    </div>
  );
}
