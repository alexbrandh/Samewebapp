'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeft, CircleNotch } from 'phosphor-react';
import { useCollectionProducts, useCart } from '@/lib/hooks/useShopify';
import { FavoriteButton } from '@/components/product/favorite-button';
import type { ShopifyProduct } from '@/lib/types/shopify';
import Link from 'next/link';
import { PhotoGallery } from '@/components/ui/gallery';
import { useCurrency } from '@/contexts/currency-context';

// Mock products for each collection
const allMockProducts = [
  {
    id: 'mock-1',
    handle: 'pasha-flare',
    title: 'Perfume Elegance Premium',
    description: 'A sophisticated fragrance with floral and citrus notes',
    featuredImage: { url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop' },
    images: { edges: [{ node: { url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop' } }] },
    variants: {
      edges: [{
        node: {
          id: 'variant-1',
          price: { amount: '89.99', currencyCode: 'EUR' },
          availableForSale: true
        }
      }]
    },
    tags: ['new', 'premium'],
    collection: ['premium-fragrances', 'classic-collection']
  },
  {
    id: 'mock-2',
    handle: 'eau-de-parfum-classic',
    title: 'Eau de Parfum Classic',
    description: 'Classic fragrance with touches of vanilla and sandalwood',
    featuredImage: { url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop' },
    images: { edges: [{ node: { url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop' } }] },
    variants: {
      edges: [{
        node: {
          id: 'variant-2',
          price: { amount: '65.00', currencyCode: 'EUR' },
          availableForSale: true
        }
      }]
    },
    tags: ['bestseller'],
    collection: ['classic-collection']
  },
  {
    id: 'mock-3',
    handle: 'cologne-fresh-breeze',
    title: 'Cologne Fresh Breeze',
    description: 'Refreshing cologne perfect for everyday wear',
    featuredImage: { url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d32?w=400&h=400&fit=crop' },
    images: { edges: [{ node: { url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d32?w=400&h=400&fit=crop' } }] },
    variants: {
      edges: [{
        node: {
          id: 'variant-3',
          price: { amount: '45.50', currencyCode: 'EUR' },
          availableForSale: true
        }
      }]
    },
    tags: ['fresh', 'daily'],
    collection: ['daily-fresh']
  },
  {
    id: 'mock-4',
    handle: 'luxury-oud-collection',
    title: 'Luxury Oud Collection',
    description: 'Exclusive fragrance with oud and oriental spices',
    featuredImage: { url: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop' },
    images: { edges: [{ node: { url: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop' } }] },
    variants: {
      edges: [{
        node: {
          id: 'variant-4',
          price: { amount: '125.00', currencyCode: 'EUR' },
          availableForSale: true
        }
      }]
    },
    tags: ['luxury', 'oud'],
    collection: ['oriental-luxury', 'premium-fragrances']
  }
];

const mockProductsByCollection: Record<string, any[]> = {
  'premium-fragrances': [
    ...allMockProducts.filter(p => p.collection.includes('premium-fragrances'))
  ],
  'classic-collection': [
    ...allMockProducts.filter(p => p.collection.includes('classic-collection'))
  ],
  'daily-fresh': [
    ...allMockProducts.filter(p => p.collection.includes('daily-fresh'))
  ],
  'oriental-luxury': [
    ...allMockProducts.filter(p => p.collection.includes('oriental-luxury'))
  ]
};

// Collection information
const mockCollectionInfo: Record<string, { title: string; description: string; image: string }> = {
  'premium-fragrances': {
    title: 'Premium Fragrances',
    description: 'Exclusive high-end perfumes for special occasions',
    image: '/IDKO 1-100/1.png'
  },
  'classic-collection': {
    title: 'Classic Collection',
    description: 'Traditional and timeless aromas that never go out of style',
    image: '/IDKO 1-100/15.png'
  },
  'daily-fresh': {
    title: 'Daily Fresh',
    description: 'Refreshing colognes perfect for everyday use',
    image: '/IDKO 1-100/28.png'
  },
  'oriental-luxury': {
    title: 'Oriental Luxury',
    description: 'Exotic and spiced essences inspired by the Orient',
    image: '/IDKO 1-100/40.png'
  }
};

interface ProductCardProps {
  product: ShopifyProduct | any;
  onAddToBag: (merchandiseId: string) => void;
  isAddingToCart?: boolean;
}

function ProductCard({ product, onAddToBag, isAddingToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { formatPrice } = useCurrency();

  const firstVariant = product.variants.edges[0]?.node;
  const price = firstVariant?.price?.amount || '0';
  const image = product.featuredImage?.url || product.images.edges[0]?.node?.url;

  // Extract inspiration brand
  const inspirationBrand = product.metafields?.find((m: any) =>
    m && m.key === 'inspiration_brand'
  )?.value;

  const handleAddToBag = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (firstVariant?.id) {
      onAddToBag(firstVariant.id);
    }
  };

  return (
    <motion.div
      className="w-full flex flex-col gap-1 lg:gap-1.5 relative group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full p-2.5 lg:p-5 aspect-[473/520] lg:shrink shrink-0 flex items-end relative rounded-lg overflow-hidden transition-colors duration-300 ease-linear bg-muted hover:bg-background shadow-sm">
        <figure className="w-full absolute inset-0 h-full flex items-center justify-center">
          {image ? (
            <img
              alt={product.title}
              loading="lazy"
              className="h-full w-full object-cover group-hover:scale-[1.075] duration-500 ease-[cubic-bezier(0.5,1,0.89,1)]"
              src={image}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-muted">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          )}
        </figure>

        <div className="flex items-end justify-between relative w-full">
          <div className="w-full flex gap-1.5">
            {/* Tags/Badges could go here */}
          </div>
        </div>

        {/* Favorite Button */}
        <div className="absolute top-2.5 right-2.5 lg:top-5 lg:right-5 z-20">
          <FavoriteButton
            productId={product.id}
            size={20}
          />
        </div>

        {/* Add to Bag Button */}
        <div className="absolute right-2.5 bottom-2.5 lg:right-5 lg:bottom-5 h-[39px] shrink-0 z-10 w-max flex justify-end add-to-bag-container">
          <div className="add-to-bag-shell relative h-[39px] bg-background border border-border transition-colors duration-300 ease-linear w-max shadow-sm rounded-sm">
            <button
              type="button"
              aria-label="Add to bag"
              className="add-to-bag-button relative h-full disabled:cursor-wait disabled:opacity-50"
              onClick={handleAddToBag}
              disabled={isAddingToCart || !firstVariant?.availableForSale}
            >
              <span className="sr-only">Add To Bag</span>
              <span className="absolute right-0 bottom-0 h-[39px] w-[42px] flex items-center justify-center">
                {isAddingToCart ? (
                  <CircleNotch className="w-[15px] h-[15px] animate-spin" />
                ) : (
                  <Plus size={15} weight="bold" />
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 lg:gap-1.5 w-full">
        <h3 className="text-sm lg:text-base font-medium text-foreground line-clamp-1 uppercase tracking-wide">
          {product.title}
        </h3>
        {inspirationBrand && (
          <p className="text-[10px] lg:text-[11px] font-sans text-muted-foreground/80 mt-0.5 uppercase tracking-wide">
            Inspired by {inspirationBrand}
          </p>
        )}

        {product.description && (
          <p className="text-xs lg:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description.replace(/<[^>]*>/g, '').substring(0, 80)}
            {product.description.length > 80 && '...'}
          </p>
        )}

        <div className="flex items-center gap-2 mt-1">
          <p className="text-base lg:text-lg font-bold text-foreground">
            {formatPrice(price)}
          </p>

          {!firstVariant?.availableForSale && (
            <Badge variant="outline" className="text-xs">
              Sold Out
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface CollectionPageProps {
  params: Promise<{
    handle: string;
  }>;
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { collection, products, loading, error, hasNextPage, loadMore } = useCollectionProducts(resolvedParams.handle, 12);
  const { addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Use mock products if there's a Shopify connection error
  const mockProducts = mockProductsByCollection[resolvedParams.handle] || [];
  const displayProducts = error ? mockProducts : products;
  const isUsingMockData = error && mockProducts.length > 0;

  // Collection information - Use real Shopify data if available, fallback to mock
  const collectionInfo = collection ? {
    title: collection.title || resolvedParams.handle.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: collection.description || 'Exclusive fragrances crafted for the discerning individual',
    image: collection.image?.url || '/IDKO 1-100/1.png'
  } : (mockCollectionInfo[resolvedParams.handle] || {
    title: resolvedParams.handle.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: 'Exclusive fragrances crafted for the discerning individual',
    image: '/IDKO 1-100/1.png'
  });

  const handleAddToBag = async (merchandiseId: string) => {
    try {
      setAddingToCart(merchandiseId);
      // ...
      if (isUsingMockData) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        await addToCart(merchandiseId, 1);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16 overflow-x-hidden">
      {/* Back to Home Button */}
      <div className="max-w-7xl mx-auto px-6 py-2">
        <Link
          href="/collections/all"
          className="inline-flex items-center text-sm hover:text-primary transition-colors opacity-90 hover:opacity-100 backdrop-blur-sm bg-muted px-4 py-2 rounded-full"
        >
          <ArrowLeft size={16} weight="regular" className="mr-2" />
          Back to Collections
        </Link>
      </div>

      {/* Photo Gallery Hero */}
      <PhotoGallery
        animationDelay={0.3}
        title={collectionInfo.title}
        subtitle="Exclusive fragrances crafted for the discerning individual"
        buttonText="Explore Collection"
        onButtonClick={() => {
          const productsSection = document.getElementById('products-section');
          productsSection?.scrollIntoView({ behavior: 'smooth' });
        }}
        photos={[
          {
            id: 1,
            order: 0,
            x: "-320px",
            y: "15px",
            zIndex: 15,
            direction: "left",
            src: "/IDKO 1-100/5.png",
          },
          {
            id: 2,
            order: 1,
            x: "-160px",
            y: "32px",
            zIndex: 14,
            direction: "left",
            src: "/IDKO 1-100/12.png",
          },
          {
            id: 3,
            order: 2,
            x: "0px",
            y: "8px",
            zIndex: 13,
            direction: "right",
            src: "/IDKO 1-100/23.png",
          },
          {
            id: 4,
            order: 3,
            x: "160px",
            y: "22px",
            zIndex: 12,
            direction: "right",
            src: "/IDKO 1-100/34.png",
          },
          {
            id: 5,
            order: 4,
            x: "320px",
            y: "44px",
            zIndex: 11,
            direction: "left",
            src: "/IDKO 1-100/47.png",
          },
        ]}
      />

      <div className="max-w-7xl mx-auto px-6" id="products-section">
        {/* Collection Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 mt-4 max-w-4xl mx-auto text-center px-4"
        >
          {collectionInfo.description && collectionInfo.description !== 'Exclusive fragrances crafted for the discerning individual' ? (
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {collectionInfo.description}
            </p>
          ) : null}
        </motion.div>

        {isUsingMockData && (
          <motion.div
            className="mb-12 p-4 bg-primary/5 border border-primary/20 rounded-2xl max-w-2xl mx-auto backdrop-blur-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-foreground text-center font-medium">
              📝 Demo mode: Showing example products for this collection
            </p>
          </motion.div>
        )}

        {/* Products Section Header */}
        <div className="mb-10 text-center mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Our Selection
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Handpicked fragrances crafted with passion and precision
            </p>
          </motion.div>
        </div>

        {/* Products Grid */}
        {loading && displayProducts.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-20">
            <CircleNotch size={40} weight="bold" className="animate-spin text-primary mb-4" />
            <span className="text-muted-foreground font-medium">Loading exquisite fragrances...</span>
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, staggerChildren: 0.1 }}
            >
              {displayProducts.map((product: any, index: number) => (
                <motion.div
                  key={product.id}
                  onClick={() => router.push(`/products/${product.handle ?? '#'}`)}
                  className="cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard
                    product={product}
                    onAddToBag={() => handleAddToBag(product.variants.edges[0]?.node?.id)}
                    isAddingToCart={addingToCart === product.variants.edges[0]?.node?.id}
                  />
                </motion.div>
              ))}
            </motion.div>

            {!isUsingMockData && hasNextPage && (
              <div className="text-center mt-16 mb-12">
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  variant="outline"
                  size="lg"
                  className="rounded-full px-10 py-6 text-base font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <CircleNotch size={20} weight="bold" className="animate-spin mr-2" />
                      Loading More...
                    </>
                  ) : (
                    <>
                      Discover More
                      <Plus size={20} weight="bold" className="ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {displayProducts.length === 0 && !loading && (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <p className="text-2xl font-semibold text-foreground mb-3">
                    No products found
                  </p>
                  <p className="text-muted-foreground mb-8">
                    This collection is currently empty. Check back soon for new additions!
                  </p>
                  <Button
                    onClick={() => router.push('/collections/all')}
                    className="rounded-full px-8"
                  >
                    Explore All Products
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}