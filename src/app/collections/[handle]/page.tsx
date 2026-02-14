'use client';

import { useState, use, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CircleNotch, CaretDown } from 'phosphor-react';
import { useCollectionProducts } from '@/lib/hooks/useShopify';
import { ProductCard } from '@/components/product/product-card';
import Link from 'next/link';

interface CollectionPageProps {
  params: Promise<{
    handle: string;
  }>;
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { collection, products, loading, error, hasNextPage, loadMore } = useCollectionProducts(resolvedParams.handle, 24);

  const displayProducts = products;

  // Collection information from Shopify
  const collectionTitle = collection?.title
    || resolvedParams.handle.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  const collectionDescription = collection?.description || '';

  // Get first 4 product images for the hero strip
  const heroImages = useMemo(() => {
    return displayProducts.slice(0, 4).map((p: any) =>
      p.featuredImage?.url || p.images?.edges?.[0]?.node?.url
    ).filter(Boolean);
  }, [displayProducts]);

  return (
    <div className="min-h-screen bg-background pb-20 overflow-x-hidden">
      {/* Collection Hero */}
      <section className="relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="h-full w-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Back navigation */}
          <div className="pt-3 pb-2">
            <Link
              href="/collections/all"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={14} weight="light" />
              <span>Todos los perfumes</span>
            </Link>
          </div>

          {/* Hero content */}
          <div className="pt-8 pb-10 sm:pt-12 sm:pb-14 lg:pt-16 lg:pb-18">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              <p className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3 sm:mb-4">
                Colección
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1] mb-0">
                {collectionTitle}
              </h1>
            </motion.div>

            {collectionDescription && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 sm:mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl"
              >
                {collectionDescription}
              </motion.p>
            )}

            {/* Product count + hero image strip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-10"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl font-bold text-foreground tabular-nums">
                  {loading && displayProducts.length === 0 ? '—' : displayProducts.length}
                </span>
                <span className="text-sm text-muted-foreground leading-tight">
                  {displayProducts.length === 1 ? 'fragancia' : 'fragancias'}
                  <br />
                  <span className="text-xs">en esta colección</span>
                </span>
              </div>

              {/* Product image strip */}
              {heroImages.length > 0 && (
                <div className="flex items-center gap-2">
                  {heroImages.map((src: string, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-muted border border-border/50"
                    >
                      <Image
                        src={src}
                        alt=""
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                  {displayProducts.length > 4 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.62 }}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-muted border border-border/50 flex items-center justify-center"
                    >
                      <span className="text-xs text-muted-foreground font-medium">+{displayProducts.length - 4}</span>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10" id="products-section">
        {/* Sort / count bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex items-center justify-between mb-6 sm:mb-8"
        >
          <p className="text-sm text-muted-foreground">
            {loading && displayProducts.length === 0
              ? 'Cargando...'
              : `Mostrando ${displayProducts.length} ${displayProducts.length === 1 ? 'producto' : 'productos'}`
            }
          </p>

          <button
            onClick={() => {
              const section = document.getElementById('products-section');
              section?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <CaretDown size={14} weight="bold" />
          </button>
        </motion.div>

        {/* Loading state */}
        {loading && displayProducts.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-24">
            <CircleNotch size={32} weight="bold" className="animate-spin text-muted-foreground mb-4" />
            <span className="text-sm text-muted-foreground">Cargando fragancias...</span>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
              {displayProducts.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            {/* Load More */}
            {hasNextPage && (
              <div className="flex justify-center mt-12 sm:mt-16">
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  variant="outline"
                  size="lg"
                  className="rounded-full px-10 py-5 text-sm font-semibold hover:bg-foreground hover:text-background transition-all duration-300 border-foreground/20"
                >
                  {loading ? (
                    <>
                      <CircleNotch size={16} weight="bold" className="animate-spin mr-2" />
                      Cargando...
                    </>
                  ) : (
                    'Ver más fragancias'
                  )}
                </Button>
              </div>
            )}

            {/* Empty state */}
            {displayProducts.length === 0 && !loading && (
              <div className="text-center py-24">
                <div className="max-w-sm mx-auto">
                  <p className="text-lg font-semibold text-foreground mb-2">
                    Sin productos
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Esta colección está vacía por el momento.
                  </p>
                  <Button
                    onClick={() => router.push('/collections/all')}
                    className="rounded-full px-8"
                  >
                    Explorar todos los perfumes
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}