'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/hooks/useShopify';
import { getProducts } from '@/lib/shopify';
import { PageContainer } from '@/components/ui/page-container';
import { BundleCart } from '@/components/sections/bundle-cart';
import { ProductCard } from '@/components/product/product-card';
import { Footer } from '@/components/sections/footer';
import type { ShopifyProduct } from '@/lib/types/shopify';

interface BundleProduct extends ShopifyProduct {
  quantity: number;
  selectedVariantId: string;
}

export default function BundlePage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<BundleProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts(50);
      if (data?.edges) {
        const productsData = data.edges.map((edge: any) => edge.node);
        setProducts(productsData);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const handleAddToBundle = (product: ShopifyProduct, variantId: string) => {
    setSelectedProducts(prev => {
      // Use product.id + variantId as unique key to allow same product with different variants
      const uniqueKey = `${product.id}-${variantId}`;
      const existing = prev.find(p => `${p.id}-${p.selectedVariantId}` === uniqueKey);
      if (existing) {
        return prev.map(p =>
          `${p.id}-${p.selectedVariantId}` === uniqueKey ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1, selectedVariantId: variantId }];
    });
  };

  const handleRemoveFromBundle = (productId: string, variantId?: string) => {
    if (variantId) {
      setSelectedProducts(prev => prev.filter(p => `${p.id}-${p.selectedVariantId}` !== `${productId}-${variantId}`));
    } else {
      setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveFromBundle(productId);
      return;
    }
    setSelectedProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, quantity } : p))
    );
  };

  const calculateDiscount = (itemCount: number) => {
    if (itemCount >= 6) return 0.2; // 20%
    if (itemCount >= 4) return 0.15; // 15%
    if (itemCount >= 2) return 0.1; // 10%
    return 0;
  };

  const getTotalItems = () => {
    return selectedProducts.reduce((sum, p) => sum + p.quantity, 0);
  };

  const getSubtotal = () => {
    return selectedProducts.reduce((sum, p) => {
      // Get price from the selected variant
      const selectedVariant = p.variants?.edges?.find(
        (e: any) => e.node.id === p.selectedVariantId
      )?.node;
      const price = parseFloat(selectedVariant?.price?.amount || p.priceRange.minVariantPrice.amount);
      return sum + price * p.quantity;
    }, 0);
  };

  const getDiscount = () => {
    const itemCount = getTotalItems();
    const subtotal = getSubtotal();
    return subtotal * calculateDiscount(itemCount);
  };

  const getTotal = () => {
    return getSubtotal() - getDiscount();
  };

  // Filtrar productos por categoría/género
  const filterByTag = (tags: string[]) => {
    return products.filter(p =>
      tags.some(tag => p.tags?.some(t => t.toLowerCase().includes(tag.toLowerCase())))
    );
  };

  // Products logic
  const womenProducts = filterByTag(['women', 'woman', 'mujer', 'mujeres', 'female']);
  const TABS = [
    { id: 'all', label: 'Todos' },
    { id: 'men', label: 'HOMBRE' },
    { id: 'mujer', label: 'MUJER' },
    { id: 'unisex', label: 'UNISEX' },
  ];
  const menProducts = filterByTag(['men', 'man', 'hombre', 'hombres', 'male']);
  const unisexProducts = filterByTag(['unisex']);

  // Si no hay productos categorizados, mostrar todos
  const hasCategories = womenProducts.length > 0 || menProducts.length > 0 || unisexProducts.length > 0;
  const allProducts = hasCategories ? [] : products;

  // Cart Logic
  const { createCart, addToCart, cart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleBundleCheckout = async () => {
    if (selectedProducts.length === 0) return;

    setIsCheckingOut(true);
    try {
      const lines = selectedProducts.map(p => ({
        merchandiseId: p.selectedVariantId,
        quantity: p.quantity
      }));

      let resultCart;

      // Always create a new cart for the bundle to ensure only these items are in the checkout
      // This solves the issue of "active cart" containing old items
      resultCart = await createCart(lines);

      if (resultCart?.checkoutUrl) {
        window.location.href = resultCart.checkoutUrl;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error al verificar los productos. Inténtalo de nuevo.');
    } finally {
      setIsCheckingOut(false);
    }
  };


  return (
    <PageContainer>
      <main className="relative pt-20 lg:pt-24">
        {/* Header Section */}
        <div className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Arma tu Pack y Ahorra.</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Elige 2+ perfumes para ahorrar más. Usar el sentido común (olfativo) tiene sus beneficios.
            </p>
          </div>
        </div>

        {/* Discount Tiers */}
        <div className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-3 max-w-3xl mx-auto gap-4">
              <div className="text-center p-4 rounded-lg bg-background border">
                <div className="text-3xl font-bold mb-1">2</div>
                <div className="text-sm text-muted-foreground">10% OFF</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-background border">
                <div className="text-3xl font-bold mb-1">4</div>
                <div className="text-sm text-muted-foreground">15% OFF</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-background border">
                <div className="text-3xl font-bold mb-1">6</div>
                <div className="text-sm text-muted-foreground">20% OFF</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content with Sticky Cart */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Products List */}
            <div className="lg:col-span-8">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Cargando productos...</p>
                </div>
              ) : (
                <div className="space-y-12">
                  {/* Women Section */}
                  {womenProducts.length > 0 && (
                    <section>
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span className="inline-block px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200 rounded-full text-sm font-medium">
                          Mujer
                        </span>
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                        {womenProducts.map(product => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            variant="bundle"
                            onAddToBundle={handleAddToBundle}
                            isInBundle={selectedProducts.some(p => p.id === product.id)}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Men Section */}
                  {menProducts.length > 0 && (
                    <section>
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                          Hombre
                        </span>
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                        {menProducts.map(product => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            variant="bundle"
                            onAddToBundle={handleAddToBundle}
                            isInBundle={selectedProducts.some(p => p.id === product.id)}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Unisex Section */}
                  {unisexProducts.length > 0 && (
                    <section>
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                          Unisex
                        </span>
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                        {unisexProducts.map(product => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            variant="bundle"
                            onAddToBundle={handleAddToBundle}
                            isInBundle={selectedProducts.some(p => p.id === product.id)}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* All Products if no categories */}
                  {womenProducts.length === 0 &&
                    menProducts.length === 0 &&
                    unisexProducts.length === 0 && (
                      <section>
                        {products.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                            {products.map(product => (
                              <ProductCard
                                key={product.id}
                                product={product}
                                variant="bundle"
                                onAddToBundle={handleAddToBundle}
                                isInBundle={selectedProducts.some(p => p.id === product.id)}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <p className="text-muted-foreground">No hay productos disponibles en este momento.</p>
                          </div>
                        )}
                      </section>
                    )}
                </div>
              )}
            </div>

            {/* Sticky Bundle Cart */}
            <div className="lg:col-span-4">
              <BundleCart
                selectedProducts={selectedProducts}
                onRemove={handleRemoveFromBundle}
                onUpdateQuantity={handleUpdateQuantity}
                totalItems={getTotalItems()}
                subtotal={getSubtotal()}
                discount={getDiscount()}
                total={getTotal()}
                discountPercent={calculateDiscount(getTotalItems()) * 100}
                onCheckout={handleBundleCheckout}
                isLoading={isCheckingOut}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </PageContainer>
  );
}
