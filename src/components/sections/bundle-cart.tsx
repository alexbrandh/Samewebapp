'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCurrency } from '@/contexts/currency-context';
import { Trash, Plus, Minus, ShoppingCart, CaretUp, CaretDown } from 'phosphor-react';
import { useProducts } from '@/lib/hooks/useShopify'; // Fixed import
import type { ShopifyProduct } from '@/lib/types/shopify';

interface BundleProduct extends ShopifyProduct {
  quantity: number;
  selectedVariantId: string;
}

interface BundleCartProps {
  selectedProducts: BundleProduct[];
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  total: number;
  discountPercent: number;
  onCheckout: () => void;
  isLoading?: boolean;
}

export function BundleCart({
  selectedProducts,
  onRemove,
  onUpdateQuantity,
  totalItems,
  subtotal,
  discount,
  total,
  discountPercent,
  onCheckout,
  isLoading = false,
}: BundleCartProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getNextDiscountMessage = () => {
    if (totalItems === 0) return 'Add 2 products to start saving';

    // Check for Free Shipping via Price Threshold (200 AED)
    if (total >= 200) {
      if (totalItems < 6) return `Free Shipping unlocked! Add ${6 - totalItems} more for 20% discount`;
      return 'You\'ve unlocked the maximum discount!';
    }

    if (totalItems < 2) return 'Add 1 more for 10% discount';
    if (totalItems < 4) return `Add ${4 - totalItems} more for 15% discount`;
    if (totalItems < 6) return `Add ${6 - totalItems} more for 20% discount`;
    return 'You\'ve unlocked the maximum benefits!';
  };

  const handleCheckout = async () => {
    // Aquí se implementaría la lógica de checkout con Shopify
    // Puedes usar la API de Shopify para crear un cart y redirigir al checkout
  };

  return (
    <div
      className={`${isSticky ? 'sticky top-24 lg:top-28' : ''
        } transition-all duration-300 bg-card border rounded-lg shadow-lg overflow-hidden flex flex-col max-h-[calc(100vh-140px)]`}
    >
      {/* Header */}
      <div
        className="p-4 bg-primary text-primary-foreground cursor-pointer flex items-center justify-between shrink-0"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <ShoppingCart size={24} weight="bold" />
          <div>
            <h3 className="font-bold text-lg">Order Summary</h3>
            <p className="text-xs opacity-90">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>
        {isSticky && (
          <button className="p-1 hover:bg-primary-foreground/10 rounded-full transition-colors">
            {isCollapsed ? <CaretDown size={20} weight="bold" /> : <CaretUp size={20} weight="bold" />}
          </button>
        )}
      </div>

      {/* Content */}
      <div className={`transition-all duration-300 flex flex-col min-h-0 ${isCollapsed && isSticky ? 'h-0 overflow-hidden' : 'flex-1'}`}>
        {/* Discount Progress */}
        <div className="p-4 bg-muted/50 border-b shrink-0">
          <div className="text-sm font-medium mb-2">{getNextDiscountMessage()}</div>
          <div className="w-full bg-background rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.min((totalItems / 6) * 100, 100)}%`,
              }}
            />
          </div>
          {discountPercent >= 10 && (
            <div className="mt-2 text-center animate-pulse">
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-full text-xs font-bold border border-green-200 dark:border-green-800">
                🎉 YOU SAVE {discount}%
              </span>
            </div>
          )}
        </div>

        {/* Selected Products */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {selectedProducts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <ShoppingCart size={48} className="mx-auto mb-3 opacity-30" weight="light" />
              <p className="text-sm">Your bundle is empty</p>
              <p className="text-xs mt-1">Add products to get started</p>
            </div>
          ) : (
            <div className="divide-y relative">
              {selectedProducts.map(product => {
                const image = product.images?.edges?.[0]?.node;
                // Find the selected variant to get its price
                const selectedVariant = product.variants?.edges?.find(
                  (e: any) => e.node.id === product.selectedVariantId
                )?.node;
                const price = parseFloat(selectedVariant?.price?.amount || product.priceRange.minVariantPrice.amount);
                // Get variant title (e.g., "100ml / Extrait")
                const variantTitle = selectedVariant?.title !== 'Default Title' ? selectedVariant?.title : null;

                return (
                  <div key={`${product.id}-${product.selectedVariantId}`} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex gap-3">
                      {/* Product Image */}
                      <div className="relative w-16 h-16 rounded overflow-hidden shrink-0">
                        {image && (
                          <Image
                            src={image.url}
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium line-clamp-2 mb-0.5">{product.title}</h4>
                        {variantTitle && (
                          <p className="text-xs text-muted-foreground mb-1">{variantTitle}</p>
                        )}
                        <p className="text-sm font-bold">
                          {formatPrice((price * product.quantity).toString())}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => onUpdateQuantity(product.id, product.quantity - 1)}
                            className="p-1 rounded hover:bg-muted transition-colors"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus size={16} weight="bold" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">{product.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(product.id, product.quantity + 1)}
                            className="p-1 rounded hover:bg-muted transition-colors"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus size={16} weight="bold" />
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemove(product.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors self-start"
                        aria-label="Eliminar producto"
                      >
                        <Trash size={18} weight="regular" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Recommended Section (Best Sellers) */}
          <RecommendedSection />
        </div>

        {/* Price Summary */}
        {selectedProducts.length > 0 && (
          <div className="p-4 border-t bg-background shrink-0">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Initial Price</span>
                <span className="font-medium">
                  {formatPrice(subtotal.toFixed(2))}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 p-2 rounded-md">
                  <span>Savings ({discountPercent}%)</span>
                  <span>
                    -{formatPrice(discount.toFixed(2))}
                  </span>
                </div>
              )}
              {(totalItems >= 6 || total >= 200) && (
                <div className="flex justify-between text-blue-600 dark:text-blue-400">
                  <span>Shipping</span>
                  <span className="font-medium">FREE</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>SUBTOTAL</span>
                <span>
                  {formatPrice(total.toFixed(2))}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={onCheckout}
              disabled={selectedProducts.length === 0 || isLoading}
              className="w-full mt-4 py-3 px-4 bg-primary text-primary-foreground font-bold text-sm rounded-md hover:bg-primary/90 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                'Proceed to Checkout'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function RecommendedSection() {
  const { products } = useProducts(10);
  const bestSellers = products
    .filter((p: any) => p.tags?.some((t: string) => t.toLowerCase().includes('bestseller')))
    .slice(0, 4);

  if (!bestSellers.length) return null;

  return (
    <div className="p-4 bg-muted/20 border-t">
      <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3 tracking-wider">
        Recommended for You
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {bestSellers.map((product: any) => (
          <div key={product.id} className="group relative bg-background rounded-lg border p-2 hover:shadow-md transition-all">
            <div className="relative aspect-square mb-2 rounded-md overflow-hidden bg-muted">
              {product.images?.edges?.[0]?.node && (
                <Image
                  src={product.images.edges[0].node.url}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              )}
            </div>
            <div className="text-xs">
              <p className="font-medium line-clamp-1">{product.title}</p>
              <a href={`/products/${product.handle}`} className="text-primary hover:underline mt-1 block">View</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
