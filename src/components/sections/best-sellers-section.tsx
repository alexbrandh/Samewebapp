'use client';

import { AnimatedGroup } from '@/components/ui/animated-group';
import { useProducts } from '@/lib/hooks/useShopify';
import { ProductCard } from '@/components/product/product-card';
import type { ShopifyProduct } from '@/lib/types/shopify';

export function BestSellersSection() {
  const { products, loading } = useProducts(50);

  // Filtrar productos con tag "bestseller" y limitar a 8
  const bestSellers = products
    .filter((product: ShopifyProduct) =>
      product.tags?.some(tag =>
        tag.toLowerCase().includes('bestseller') ||
        tag.toLowerCase().includes('best')
      )
    )
    .slice(0, 8);

  if (loading || bestSellers.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-10 lg:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-3">
          <div className="flex justify-center mb-1">
            <div className="border border-border bg-card py-1 px-4 rounded-lg text-sm font-medium text-foreground">
              Best Sellers
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
            Most Popular Fragrances
          </h2>
          <p className="text-center mt-4 text-muted-foreground max-w-2xl mx-auto">
            Discover our customers' favorite perfumes. These best-selling scents have captivated thousands.
          </p>
        </div>

        {/* Products Grid with Animation */}
        <AnimatedGroup
          preset="blur-slide"
          className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6"
        >
          {bestSellers.map((product: ShopifyProduct) => (
            <ProductCard
              key={product.id}
              product={product}
              badgeText="BEST SELLER"
            />
          ))}
        </AnimatedGroup>
      </div>
    </section>
  );
}
